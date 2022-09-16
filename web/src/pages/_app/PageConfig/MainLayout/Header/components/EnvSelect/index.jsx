import {
  Select,
  createStyles,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ENV } from 'helpers/constants';

const environmentsList = [
  { value: ENV.DEVELOPMENT, label: 'Development' },
  { value: ENV.STAGING, label: 'Staging' },
  { value: ENV.DEMO, label: 'Demo' },
  { value: ENV.PRODUCTION, label: 'Production' },
];

const useStyles = createStyles((theme) => ({
  input: {
    backgroundColor: theme.colors.gray[7],
    color: theme.colors.gray[1] },
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
      classNames={{
        input: classes.input,
      }}
    />
  );
};

export default EnvSelect;
