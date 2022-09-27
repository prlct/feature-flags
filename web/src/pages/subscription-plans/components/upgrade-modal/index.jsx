import { useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import {
  Button,
  Modal,
  Title,
  Text,
} from '@mantine/core';

import * as routes from 'routes';
import { subscriptionApi } from 'resources/subscription';

const UpgradeModal = (props) => {
  const router = useRouter();

  const { data: invoicePreview, isLoading } = subscriptionApi.usePreviewUpgradeSubscription(props.priceId);
  const upgradeMutation = subscriptionApi.useUpgradeSubscription();

  const onConfirm = useCallback(() => {
    upgradeMutation.mutate({
        priceId: props.priceId,
      }, {
        onSuccess: () => {
          router.push(`${routes.route.home}?subscriptionPlan=${props.priceId}&interval=${props.interval}`);
        }
      });
  }, [props.priceId, props.interval]);

  return (
    <Modal
      opened
      centered
      title={
        <Title order={3}>
          Preview invoice details
        </Title>
      }
      onClose={props.onClose}
    >
      {!isLoading && (
        <>
          <Text>Subtotal: <b>${invoicePreview.invoice.subtotal / 100}</b></Text>
          <Text>Tax: <b>${invoicePreview.invoice.tax / 100}</b></Text>
          <Text>Total: <b>${invoicePreview.invoice.total / 100}</b></Text>

          <Button onClick={onConfirm}>Confirm</Button>
          <Button onClick={props.onClose}>Cancel</Button>
        </>
      )}
    </Modal>
  );
};

UpgradeModal.propTypes = {
  priceId: PropTypes.string.isRequired,
  interval: PropTypes.oneOf(['month', 'year']).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default memo(UpgradeModal);
