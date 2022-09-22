import { useCallback } from 'react';
import { PropTypes } from 'prop-types';
import {
  Title,
  Text,
  TextInput,
  Button,
  Stack,
  ScrollArea,
  ActionIcon,
  Badge,
  Group,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons';
import pluralize from 'pluralize';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import _trim from 'lodash/trim';
import { useForm } from 'react-hook-form';

import { handleError } from 'helpers';
import { featureFlagApi } from 'resources/feature-flag';

const schema = yup.object().shape({
  email: yup.string().email('Email format is incorrect.'),
});

const EmailsSettings = ({ feature }) => {
  const {
    register, handleSubmit, formState: { errors }, setError, reset,
  } = useForm({ resolver: yupResolver(schema) });

  const enableFeatureForUsersMutation = featureFlagApi.useEnableFeatureForUsers();

  const handleEmailsAdd = useCallback(({ email }) => {
    const trimmedEmail = _trim(email);

    if (trimmedEmail) {
      enableFeatureForUsersMutation.mutate({
        email: trimmedEmail,
        env: feature.env,
        _id: feature._id,
      }, {
        onSuccess: () => {
          reset({ email: '' });
          showNotification({
            title: 'Success',
            message: `The feature has been successfully enabled to the user ${email}.`,
            color: 'green',
          });
        },
        onError: (e) => handleError(e, setError),
      });
    }
  }, [
    enableFeatureForUsersMutation,
    feature._id,
    feature.env,
    reset,
    setError,
  ]);

  const disableFeatureForUserMutation = featureFlagApi.useDisableFeatureForUser();

  const handleEmailDelete = useCallback((email) => {
    const trimmedEmail = _trim(email);

    if (trimmedEmail) {
      disableFeatureForUserMutation.mutate({
        email: trimmedEmail,
        env: feature.env,
        _id: feature._id,
      }, {
        onSuccess: () => {
          reset({ email: '' });
          showNotification({
            title: 'Success',
            message: `The feature has been successfully disabled to the user ${email}.`,
            color: 'green',
          });
        },
        onError: (e) => handleError(e, setError),
      });
    }
  }, [
    disableFeatureForUserMutation,
    feature._id,
    feature.env,
    reset,
    setError,
  ]);

  return (
    <Stack>
      <TextInput
        label={
          <Title order={4}>Individual users</Title>
                  }
        {...register('email')}
        placeholder="Enter user email"
        error={errors?.email?.message}
        rightSectionWidth="200"
        rightSection={(
          <Button
            disabled={feature.enabledForEveryone}
            sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            onClick={handleSubmit(handleEmailsAdd)}
          >
            Add
          </Button>
                  )}
        disabled={feature.enabledForEveryone}
      />

      <Text component="p" m={0}>
        Enabled for
        {' '}
        {feature.users.length}
        {' '}
        {pluralize('user', feature.users.length)}
      </Text>
      <ScrollArea style={{ height: 300 }}>
        <Group spacing="sm">
          {feature.users.map((user) => (
            <Badge
              sx={{ height: 26 }}
              key={user}
              variant="outline"
              rightSection={(
                <ActionIcon
                  disabled={feature.enabledForEveryone}
                  size="xs"
                  color="blue"
                  radius="xl"
                  variant="transparent"
                  onClick={() => handleEmailDelete(user)}
                >
                  <IconX size={16} />
                </ActionIcon>
                      )}
            >
              {user}
            </Badge>
          ))}
        </Group>
      </ScrollArea>
    </Stack>
  );
};

EmailsSettings.propTypes = {
  feature: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    env: PropTypes.string,
    enabled: PropTypes.bool,
    enabledForEveryone: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default EmailsSettings;
