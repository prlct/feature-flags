import { useMemo } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import queryClient from 'query-client';
import shipTheme from 'theme/ship-theme';

import { GrowthFlagsContextProvider } from 'contexts/growth-flags-context';
import { AmplitudeContextProvider } from 'contexts/amplitude-context';

import UpdateUserModal from 'pages/pipeline-users/components/update-user-modal';
import EventSettingModal from 'pages/pipeline-settings/components/event-setting-modal';
import TriggerSelectionModal from '../email-sequences/components/trigger-selection-modal';
import EditEmailModal from '../email-sequences/components/edit-email-modal';
import RenameSequenceModal from '../email-sequences/components/rename-sequence-modal';
import AddUsersModal from '../email-sequences/components/add-users-modal';
import SendTestEmailModal from '../email-sequences/components/send-test-email-modal';

import PageConfig from './PageConfig';
import Hotjar from './Hotjar';
import GoogleTag from './GoogleTag';
import './emailEditor.css';

const App = ({ Component, pageProps }) => {
  const modals = useMemo(() => ({
    triggerSelection: TriggerSelectionModal,
    sequenceEmail: EditEmailModal,
    renameSequence: RenameSequenceModal,
    addUsers: AddUsersModal,
    sendTestEmail: SendTestEmailModal,
    updateUser: UpdateUserModal,
    updateEvent: EventSettingModal,
  }), []);

  return (
    <>
      <Head>
        <title>Growthflags</title>
      </Head>
      <Hotjar />
      <GoogleTag />
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          theme={shipTheme}
          defaultProps={{
            Button: { size: 'md' },
            TextInput: { size: 'md' },
            PasswordInput: { size: 'md' },
            Select: { size: 'md' },
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <ModalsProvider modals={modals}>
            <NotificationsProvider autoClose={5000} limit={2}>
              <GrowthFlagsContextProvider>
                <AmplitudeContextProvider>
                  <PageConfig>
                    <Component {...pageProps} />
                  </PageConfig>
                </AmplitudeContextProvider>
              </GrowthFlagsContextProvider>
            </NotificationsProvider>
          </ModalsProvider>
          <ReactQueryDevtools position="bottom-right" />
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default App;
