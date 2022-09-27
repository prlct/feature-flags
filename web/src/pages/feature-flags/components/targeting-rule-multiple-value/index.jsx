import { useState, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import {
  Text,
  TextInput,
  Button,
  Stack,
  ActionIcon,
  Badge,
  Group,
} from '@mantine/core';
import { IconX } from '@tabler/icons';

const TargetingRuleMultipleValues = ({ values, onChange, disabled, sx }) => {
  const [inputValue, setInputValue] = useState('');

  const handleValueAdd = useCallback(() => {
    if (!inputValue) return;

    if (!values.includes(inputValue)) {
      onChange([...values, inputValue]);
    }

    setInputValue('');
  }, [inputValue, onChange, values]);

  const handleValueDelete = useCallback((index) => {
    onChange(values.filter((_, i) => i !== index));
  }, [onChange, values]);

  return (
    <Stack sx={sx}>
      <TextInput
        label={<Text size="sm">Values</Text>}
        value={inputValue}
        disabled={disabled}
        onInput={(e) => setInputValue(e.currentTarget.value)}
        rightSectionWidth="200"
        rightSection={(
          <Button
            variant="subtle"
            disabled={disabled}
            onClick={handleValueAdd}
            sx={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            Add
          </Button>
              )}
      />

      <Group spacing="sm">
        {values.map((value, index) => (
          <Badge
            key={value}
            variant="outline"
            disabled={disabled}
            sx={{ height: 26 }}
            rightSection={(
              <ActionIcon
                size="xs"
                color="blue"
                radius="xl"
                variant="transparent"
                disabled={disabled}
                onClick={() => handleValueDelete(index)}
              >
                <IconX size={16} />
              </ActionIcon>
                  )}
          >
            {value}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
};

TargetingRuleMultipleValues.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
};

TargetingRuleMultipleValues.defaultProps = {
  values: [],
  disabled: false,
};

export default TargetingRuleMultipleValues;
