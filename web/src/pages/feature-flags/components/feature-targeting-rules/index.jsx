import { useState, useCallback, useMemo, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import debounce from 'lodash/debounce';

import { featureFlagApi } from 'resources/feature-flag';

import TargetingRules from '../targeting-rules';

const FeatureTargetingRules = ({ feature, sx }) => {
  const [rules, setRules] = useState();

  useEffect(() => {
    setRules(feature.targetingRules);
  }, [feature.targetingRules]);

  const updateTargetingRulesMutation = featureFlagApi.useUpdateTargetingRules();

  // eslint-disable-next-line no-shadow
  const saveTargetingRules = useMemo(() => debounce((rules, feature, mutation) => {
    mutation.mutate({
      _id: feature._id,
      env: feature.env,
      targetingRules: rules,
    });
  }, 500), []);

  const handleRulesChange = useCallback((newRules) => {
    setRules(newRules);
    saveTargetingRules(newRules, feature, updateTargetingRulesMutation);
  }, [feature, saveTargetingRules, updateTargetingRulesMutation]);

  return (
    <TargetingRules
      rules={rules}
      onChange={handleRulesChange}
      disabled={feature.enabledForEveryone}
      sx={sx}
    />
  );
};

FeatureTargetingRules.propTypes = {
  feature: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    env: PropTypes.string,
    enabled: PropTypes.bool,
    enabledForEveryone: PropTypes.bool,
    targetingRules: PropTypes.arrayOf(PropTypes.shape({
      attribute: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    })),
  }).isRequired,
  // eslint-disable-next-line react/require-default-props
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
};

export default FeatureTargetingRules;
