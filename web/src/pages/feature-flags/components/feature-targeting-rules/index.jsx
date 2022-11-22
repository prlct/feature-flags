import { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';

import { featureFlagApi } from 'resources/feature-flag';
import { DEFAULT_TARGETING_RULE } from 'helpers/constants';
import { useAmplitude } from 'contexts/amplitude-context';

import TargetingRules from '../targeting-rules';

const FeatureTargetingRules = ({ feature, sx }) => {
  const [rules, setRules] = useState([]);
  const [nonEmptyRules, setNonEmptyRules] = useState([]);

  const amplitude = useAmplitude();

  useEffect(() => {
    if (!rules.length) {
      setRules(feature.targetingRules);
      setNonEmptyRules(feature.targetingRules);
    }
  }, [feature.targetingRules, rules.length]);

  const updateTargetingRulesMutation = featureFlagApi.useUpdateTargetingRules();

  const saveTargetingRules = useMemo(() => debounce((rules, feature, mutation) => {
    mutation.mutate(
      {
        _id: feature._id,
        env: feature.env,
        targetingRules: rules,
      },
      {
        onSuccess: () => {
          const isRulesChanged = isEqual(rules, nonEmptyRules);
          const newRule = difference(rules, nonEmptyRules);
          if (!isRulesChanged) {
            amplitude.track('Add rule', { rule: newRule[0].attribute, operator: newRule[0].operator, env: feature.env });
          }
        },
        onSettled: () => setNonEmptyRules(rules),
      },
    );
  }, 500), [amplitude, nonEmptyRules]);

  const handleRulesChange = useCallback((newRules) => {
    setRules(newRules);
    const nonEmptyRules = newRules.filter((rule) => rule.value.length !== 0
      && rule.attribute?.length > 0 && !isEqual(DEFAULT_TARGETING_RULE, rule));

    saveTargetingRules(nonEmptyRules, feature, updateTargetingRulesMutation);
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
