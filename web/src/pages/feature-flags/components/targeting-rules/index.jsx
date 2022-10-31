import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  TextInput,
  Button,
  Stack,
  Group,
  Select,
  Text,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconHelp, IconTrash } from '@tabler/icons';

import { DEFAULT_TARGETING_RULE, TARGETING_RULES_OPERATORS } from 'helpers/constants';

import TargetingRuleMultipleValues from '../targeting-rule-multiple-value';

const selectOptions = [
  { label: 'equals', value: TARGETING_RULES_OPERATORS.EQUALS },
  { label: 'includes', value: TARGETING_RULES_OPERATORS.INCLUDES },
];

const makeRule = () => ({
  attribute: '',
  operator: TARGETING_RULES_OPERATORS.EQUALS,
  value: '',
  description: '',
});

const defaultAttributes = ['email', 'companyId', 'id'];

const TargetingRules = ({ rules, onChange, disabled, sx }) => {
  const [attributes, setAttributes] = useState(defaultAttributes);

  useEffect(() => {
    const ruleAttributes = rules
      .filter((r) => !!r.attribute)
      .map((r) => r.attribute);
    const attributesList = [
      ...attributes,
      ...ruleAttributes,
    ];
    setAttributes(Array.from(new Set(attributesList)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rules]);

  const handleAddRuleClick = () => {
    if (rules.length < 50) {
      onChange([...rules, makeRule()]);
    }
  };

  const shownRules = rules.length > 0 ? rules : [DEFAULT_TARGETING_RULE];

  const handleInputChange = (index, prop, value) => {
    const rulesToUpdate = rules.length ? rules : shownRules;
    const updatedRules = rulesToUpdate.map((f, i) => {
      if (i === index) {
        if (prop === 'operator') {
          const defaultValue = value === TARGETING_RULES_OPERATORS.INCLUDES ? [] : '';
          return { ...f, [prop]: value, value: defaultValue };
        }
        return { ...f, [prop]: value };
      }
      return f;
    });

    onChange(updatedRules);
  };

  const handleAttributeCreate = (newAttribute) => {
    setAttributes((prevState) => [...prevState, newAttribute]);
  };

  const handleRuleDelete = (index) => {
    onChange(rules.filter((_, i) => (i !== index)));
  };

  return (
    <Stack spacing="xs" sx={sx}>
      <Title order={4}>Feature targeting rules</Title>
      <Text size="xs">
        <Text inherit>
          Show features to the users based on the rules.
          For example: only show to users with specified emails or for companies specified by _id.
        </Text>
        {' '}
        <Text
          variant="link"
          component="a"
          href="https://developer.growthflags.com/dynamic-targeting"
          target="_blank"
          inherit
        >
          Learn more how to send custom attributes.
        </Text>
      </Text>

      {shownRules.map(({ attribute, operator, value, description }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Group key={index} align="start" noWrap gap={16}>
          <Select
            label={(<Text size="sm">Attribute</Text>)}
            placeholder="Type to create new"
            creatable
            searchable
            disabled={disabled}
            value={attribute}
            data={attributes}
            getCreateLabel={(query) => `+ Create ${query}`}
            onChange={(v) => handleInputChange(index, 'attribute', v)}
            onCreate={handleAttributeCreate}
            sx={{ minWidth: '140px' }}
          />
          <Select
            label={(<Text size="sm">Operator</Text>)}
            data={selectOptions}
            value={operator}
            disabled={disabled}
            onChange={(v) => handleInputChange(index, 'operator', v)}
            sx={{ width: '120px' }}
          />
          <Stack sx={{ flexGrow: 1 }}>
            {operator === TARGETING_RULES_OPERATORS.EQUALS
              ? (
                <TextInput
                  label={(<Text size="sm">Value</Text>)}
                  value={value}
                  disabled={disabled}
                  onChange={(e) => handleInputChange(index, 'value', e.currentTarget.value)}
                  sx={{ minWidth: '200px', flexGrow: 1 }}
                />
              )
              : (
                <TargetingRuleMultipleValues
                  values={value}
                  disabled={disabled}
                  onChange={(v) => handleInputChange(index, 'value', v)}
                  sx={{ minWidth: 200, maxWidth: 340, flexGrow: 1 }}
                />
              )}
            <TextInput
              label={(
                <Group spacing={3}>
                  <Text>Title</Text>
                  <Tooltip label="When added, value title is shown instead of value. Useful for id values." withArrow position="right">
                    <Group><IconHelp size={20} color="#ced4da" /></Group>
                  </Tooltip>
                </Group>
                )}
              value={description}
              disabled={disabled}
              onChange={(e) => handleInputChange(index, 'description', e.currentTarget.value)}
            />
          </Stack>
          <ActionIcon
            size="lg"
            color="red"
            variant="transparent"
            disabled={disabled}
            onClick={() => handleRuleDelete(index)}
            sx={{
              marginTop: '32px',
              '&:disabled': {
                backgroundColor: 'transparent',
                border: 0,
              } }}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
      ))}
      <Group position="left">
        <Button
          variant="subtle"
          disabled={disabled}
          onClick={handleAddRuleClick}
          sx={{
            padding: 0,
            '@media( hover: hover)': {
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            },
          }}
        >
          Add rule
        </Button>
      </Group>
    </Stack>
  );
};

TargetingRules.propTypes = {
  rules: PropTypes.arrayOf(PropTypes.shape({
    attribute: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    description: PropTypes.string,
  })),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
};

TargetingRules.defaultProps = {
  rules: [],
  disabled: false,
};

export default TargetingRules;
