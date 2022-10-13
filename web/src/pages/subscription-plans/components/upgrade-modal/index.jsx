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
  const { plan, interval, onClose } = props;
  const { classes } = useStyles();
  const router = useRouter();

  const {
    data: invoicePreview,
    isFetching,
    remove,
  } = subscriptionApi.usePreviewUpgradeSubscription(plan.priceId);
  const upgradeMutation = subscriptionApi.useUpgradeSubscription();

  useEffect(() => () => remove(), [remove]);

  const isDowngrade = useMemo(
    () => plan.priceId === '0' || invoicePreview?.invoice?.total < 0,
    [
      plan.priceId,
      invoicePreview?.invoice?.total,
    ],
  );

  const text = useMemo(() => {
    if (isDowngrade) {
      return `Please, confirm that you want to switch to ${plan.title}. The new plan will be applied immediately. We refund you the difference for the ${plan.title} to be used for your next payment.`;
    }

    return `Please, confirm that you want to update to ${plan.title}. You will be upgraded immediately and charged the difference for the ${plan.title}.`;
  }, [
    plan.title,
    isDowngrade,
  ]);

  const onConfirm = useCallback(() => {
    upgradeMutation.mutate({
      priceId: plan.priceId,
    }, {
      onSuccess: () => {
        router.push(`${routes.route.home}?subscriptionPlan=${plan.priceId}&interval=${interval}`);
      },
    });
  }, [upgradeMutation, plan.priceId, router, interval]);

  const renderPrice = useCallback(() => {
    const { invoice } = invoicePreview;
    let secondRow = (
      <>
        <Text>Next payment</Text>
        <Text size="lg" weight={600}>
          {dayjs(invoice.lines?.data[1]?.period.end * 1000).format('MMM DD, YYYY')}
        </Text>
      </>
    );

    if (isDowngrade) {
      const balanceAfterNextPayment = Math.abs(invoice.total) - invoice.lines?.data[1]?.amount;

      secondRow = (
        <>
          <Text>Total for the next payment</Text>
          <Text size="lg" weight={600}>
            $
            {Math.abs(Math.min(balanceAfterNextPayment / 100, 0))}
          </Text>
        </>
      );
    }

    return (
      <>
        <Container className={classes.row} sx={{ marginTop: '12px' }}>
          <Text>{isDowngrade ? 'Refund' : 'Total Price'}</Text>
          <Text size="lg" weight={600}>
            $
            {Math.abs(invoicePreview.invoice.total / 100)}
          </Text>
        </Container>
        {plan.priceId !== '0' && (
          <Container className={classes.row}>
            {secondRow}
          </Container>
        )}
      </>
    );
  }, [invoicePreview, isDowngrade, classes.row, plan.priceId]);

  return (
    <Modal
      opened
      centered
      title={(
        <Title order={4}>
          You are about to
          {' '}
          {isDowngrade ? 'switch' : 'upgrade'}
          {' '}
          to
          {' '}
          {plan.title}
        </Title>
      )}
      onClose={onClose}
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
            <Button disabled={upgradeMutation.isLoading} variant="subtle" onClick={onClose}>Cancel</Button>
            <Button disabled={upgradeMutation.isLoading} onClick={onConfirm}>Confirm</Button>
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
  onClose: PropTypes.func.isRequired,
};

export default memo(UpgradeModal);
