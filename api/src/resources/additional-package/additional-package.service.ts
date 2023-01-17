import db from 'db';

import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './additional-package.schema';
import { AdditionalPackage } from './additional-package.types';
import moment from 'moment';
import stripe from 'services/stripe/stripe.service';

const service = db.createService<AdditionalPackage>(DATABASE_DOCUMENTS.ADDITIONAL_PACKAGE, { schema });

const createPaymentForAdditionalPackage = async (company: any) => {
  const activePackage = await service.findOne({ 
    customer: company.stripeId as string,
    unusedMau: { $gt: 0 },
    periodEnd: { $gte: moment().toDate() }, 
  });

  if (company?.stripeId && !activePackage) {
    try {
      const invoice = await stripe.invoices.create({
        customer: company.stripeId, 
        auto_advance: false,
        metadata: { 
          mau: 1000, 
          invoiceType: 'additional-package', 
        },
        custom_fields: [{ 
          name: 'invoice_type',
          value: 'additional-package', 
        }],
      });
  
      const invoiceItem = await stripe.invoiceItems.create({      
        customer: company.stripeId,
        amount: 100,
        invoice: invoice.id,
      });
  
      const invoicePay = invoice?.id && await stripe.invoices.pay(invoice?.id);
    } catch (err) {
      //TODO in case of refusal or insufficient funds
      console.log('invoices', err);
    }
  }
};

const paymentIntent = async (data: any) => {
  const periodEnd = moment().add(30, 'd').toDate();

  const invoiceType = data.metadata?.invoiceType || '';

  if (invoiceType !== 'additional-package') return;

  await service.insertOne({      
    customer: data.customer,
    status: data.status,
    limitMau: data.metadata.mau || 1000,
    unusedMau: data.metadata.mau || 1000,
    periodEnd, 
  });
  
};

export default Object.assign(service, {
  createPaymentForAdditionalPackage,
  paymentIntent,
});
