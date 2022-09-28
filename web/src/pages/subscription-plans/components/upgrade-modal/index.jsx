import { useEffect, useMemo, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import {
  Button,
  Container,
  Modal,
  Space,
  Title,
  Text,
} from '@mantine/core';

import * as routes from 'routes';
import { subscriptionApi } from 'resources/subscription';

import { useStyles } from './styles';

const UpgradeModal = (props) => {
  const { classes } = useStyles();
  const router = useRouter();

  const { data: invoicePreview, isFetching, remove } = subscriptionApi.usePreviewUpgradeSubscription(props.plan.priceId);
  const upgradeMutation = subscriptionApi.useUpgradeSubscription();

  useEffect(() => {
    return () => remove();
  }, []);

  const isDowngrage = useMemo(() =>
    props.plan.priceId === '0' || invoicePreview?.invoice?.total < 0,
    [
      props.plan.priceId,
      invoicePreview?.invoice?.total,
    ]
  );

  const text = useMemo(() => {
    if (isDowngrage) {
      return `Please, confirm that you want to switch to ${props.plan.title}. The new plan will be applied immediately. We refund you the difference for the ${props.plan.title} to be used for your next payment.`
    }

    return `Please, confirm that you want to update to ${props.plan.title}. You will be upgraded immediately and charged the difference for the ${props.plan.title}.`
  }, [
    props.plan.title,
    isDowngrage,
  ]);

  const onConfirm = useCallback(() => {
    upgradeMutation.mutate({
      priceId: props.plan.priceId,
    }, {
      onSuccess: () => {
        router.push(`${routes.route.home}?subscriptionPlan=${props.plan.priceId}&interval=${props.interval}`);
      }
    });
  }, [props.plan.priceId, props.interval]);

  const renderPrice = useCallback(() => {
    const { invoice } = invoicePreview;
    let secondRow = (
      <>
        <Text>Next payment</Text>
        <Text size='lg' weight={600}>
          {dayjs(invoice.lines?.data[1]?.period.end * 1000).format('MMM DD, YYYY')}
        </Text>
      </>
    );

    if (isDowngrage) {
      const balanceAfterNextPayment = Math.abs(invoice.total) -  invoice.lines?.data[1]?.amount;

      secondRow = (
        <>
          <Text>Total for the next payment</Text>
          <Text size='lg' weight={600}>
            ${Math.abs(Math.min(balanceAfterNextPayment / 100, 0))}
          </Text>
        </>
      );
    }

    return (
      <>
        <Container className={classes.row} sx={{ marginTop: '12px' }}>
          <Text>{isDowngrage ? 'Refund' : 'Total Price'}</Text>
          <Text size='lg' weight={600}>${Math.abs(invoicePreview.invoice.total / 100)}</Text>
        </Container>
        {props.plan.priceId !== '0' && (
          <Container className={classes.row}>
            {secondRow}
          </Container>
        )}
      </>
    );
  }, [isDowngrage, invoicePreview]);

  return (
    <Modal
      opened
      centered
      title={
        <Title order={4}>
          You are about to {isDowngrage ? 'switch' : 'upgrade'} to {props.plan.title}
        </Title>
      }
      onClose={props.onClose}
    >
      <Space h={16} />
      <Text
        sx={(theme) => ({
          color: theme.colors.dark[3],
          fontSize: '14px',
        })}
      >
        {text}
      </Text>

      {!isFetching && (
        <>
          {renderPrice()}
          <Space h={32} />
          <Container
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: 0,
              gap: '16px',
            }}
          >
            <Button variant="subtle" onClick={props.onClose}>Cancel</Button>
            <Button onClick={onConfirm}>Confirm</Button>
          </Container>
        </>
      )}
    </Modal>
  );
};

UpgradeModal.propTypes = {
  plan: PropTypes.shape({
    priceId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  interval: PropTypes.oneOf(['month', 'year']).isRequired,
};

export default memo(UpgradeModal);
