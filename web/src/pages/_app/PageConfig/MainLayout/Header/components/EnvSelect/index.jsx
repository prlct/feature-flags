import {
  Select,
  createStyles,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ENV } from 'helpers/constants';
import { IconChevronDown } from '@tabler/icons';

const environmentsList = [
  { value: ENV.DEVELOPMENT, label: 'Development' },
  { value: ENV.STAGING, label: 'Staging' },
  { value: ENV.DEMO, label: 'Demo' },
  { value: ENV.PRODUCTION, label: 'Production' },
];

const useStyles = createStyles((theme) => ({
  input: {
    backgroundColor: theme.white,
    color: theme.colors.gray[9],
    fontSize: '16px',
    fontWeight: 600,
    width: 176,
    padding: '8px 20px',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #DAE0E5',
    borderRadius: 12,
  },
  rightSection: {
    pointerEvents: 'none',
    right: 10,
  },
}));

const EnvSelect = () => {
  const { classes } = useStyles();
  const [env, setEnv] = useLocalStorage({ key: 'selectedAppEnv', defaultValue: environmentsList[0].value });
  return (
    <Select
      value={env}
      variant="filled"
      size="sm"
      data={environmentsList}
      onChange={setEnv}
      rightSection={<IconChevronDown size={12} />}
      classNames={{
        input: classes.input,
        rightSection: classes.rightSection,
      }}
    />
  );
};

export default EnvSelect;
