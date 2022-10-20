import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import trim from 'lodash/trim';

import { useModals } from '@mantine/modals';
import { Group, Stack, TextInput, Button, Title, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons';

import { featureFlagApi } from 'resources/feature-flag';

import RemoteConfig from '../remote-config';

const ABVariant = (props) => {
  const { feature, env, variantIndex, setOpenedVariant } = props;
  const modals = useModals();

  const [name, setName] = useState('');

  useEffect(() => {
    setName(feature.tests[variantIndex].name);
  }, [feature.tests, variantIndex]);

  const updateVariantMutation = featureFlagApi.useUpdateABVariant(feature._id);
  const removeVariantMutation = featureFlagApi.useRemoveABVariant(feature._id);

  const debouncedUpdateVariant = useMemo(
    () => debounce(({
      env,
      remoteConfig = feature.tests[variantIndex].remoteConfig,
    }) => updateVariantMutation.mutate({
      env, name, remoteConfig, variantIndex,
    }), 500),
    [feature.tests, name, updateVariantMutation, variantIndex],
  );

  const onNameBlurHandler = () => {
    if (trim(name) === trim(feature.tests[variantIndex].name)) {
      return null;
    }

    return debouncedUpdateVariant({ env });
  };

  const handleRemove = () => {
    modals.openConfirmModal({
      title: (<Title order={3}>{`Delete variant ${name}`}</Title>),
      centered: true,
      children: (
        <Text>
          {`Delete variant ${name}?`}
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red', variant: 'subtle' },
      cancelProps: { variant: 'subtle' },
      onConfirm: async () => {
        await removeVariantMutation.mutate({ variantIndex, env });
        setOpenedVariant(Math.max(variantIndex - 1, 0).toString());
      },
    });
  };

  return (
    <Stack>
      <Group position="apart">
        <TextInput
          label="Variant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={onNameBlurHandler}
        />
        <Button color="red" leftIcon={<IconTrash color="white" size={24} />} onClick={handleRemove}>
          Remove variant
        </Button>
      </Group>
      <RemoteConfig
        feature={feature}
        env={env}
        initialRemoteConfig={feature.tests[variantIndex].remoteConfig}
        configSaveHandler={debouncedUpdateVariant}
      />
    </Stack>
  );
};

ABVariant.propTypes = {
  feature: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    remoteConfig: PropTypes.string,
    tests: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      remoteConfig: PropTypes.string,
    })).isRequired,
  }).isRequired,
  env: PropTypes.string.isRequired,
  variantIndex: PropTypes.number.isRequired,
  setOpenedVariant: PropTypes.func.isRequired,
};

export default ABVariant;
