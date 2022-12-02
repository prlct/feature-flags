import { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import queryClient from 'query-client';

export const EXAMPLE_PIPELINES = [{
  _id: 'pipeline1',
  name: 'Activation pipeline',
  sequences: [
    {
      id: '1',
      name: 'Sign up sequence',
      enabled: true,
      total: 103,
      completed: 100,
      dropped: 3,
      trigger: {
        name: 'Sign up',
        description: 'Description',
        value: 'user-sign-up',
      },
      emails: [
        {
          id: '1',
          delay: 1,
          name: 'Welcome email',
          enabled: true,
          sent: 1000,
          unsubscribed: 50,
        },
        {
          id: '2',
          delay: 2,
          name: 'SDK, Rules, call',
          enabled: true,
          sent: 950,
          unsubscribed: 150,
        },
        {
          id: '3',
          delay: 3,
          name: 'unsubscribes',
          enabled: true,
          sent: 800,
          unsubscribed: 200,
        },
      ],

    },
  ],
}];

const EXAMPLE_USERS = [{
  id: 'user1',
  email: 'johndoe@examplemail.com',
  firstName: 'John',
  lastName: 'Doe',
  pipeline: 'pipeline1',
  sequence: '1',
}];

const initialContext = {
  audience: false,
  testEmail: false,
  triggerSelection: false,
  currentSequence: null,
  pipelines: EXAMPLE_PIPELINES,
};

export const EmailSequencesContext = createContext(initialContext);

export const EmailSequencesContextProvider = ({ children }) => {
  const [users, setUsers] = useState(EXAMPLE_USERS);
  const [triggerSelectionModal, setTriggerSelectionModal] = useState(false);
  const [sendTestEmailModal, setSendTestEmailModal] = useState(false);
  const [addUsersModal, setAddUsersModal] = useState(false);
  const [renameSequenceModal, setRenameSequenceModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [currentEmail, setCurrentEmail] = useState(null);

  const closeTriggerModal = () => {
    queryClient.removeQueries(['currentSequence']);
    setTriggerSelectionModal(false);
  };

  const openTriggerModal = (sequence) => {
    queryClient.setQueryData(['currentSequence'], sequence);
    setTriggerSelectionModal(true);
  };

  const openSendTestEmailModal = () => setSendTestEmailModal(true);
  const closeSendTestEmailModal = () => setSendTestEmailModal(false);
  const closeAddUsersModal = () => setAddUsersModal(false);
  const openAddUsersModal = () => setAddUsersModal(true);

  const openRenameSequenceModal = () => {
    setRenameSequenceModal(true);
  };
  const closeRenameSequenceModal = () => setRenameSequenceModal(false);

  const closeEditEmailModal = () => {
    setEmailModal(false);
    setCurrentEmail(null);
  };

  const openEditEmailModal = (email) => {
    setEmailModal(true);
    setCurrentEmail(email);
  };

  const contextValue = useMemo(
    () => ({
      openRenameSequenceModal,
      closeRenameSequenceModal,
      closeTriggerModal,
      openTriggerModal,
      openSendTestEmailModal,
      closeSendTestEmailModal,
      closeAddUsersModal,
      openAddUsersModal,
      closeEditEmailModal,
      openEditEmailModal,
      renameSequenceModal,
      setUsers,
      currentEmail,
      emailModal,
      triggerSelectionModal,
      sendTestEmailModal,
      addUsersModal,
      users,
    }),
    [
      renameSequenceModal,
      currentEmail,
      emailModal,
      triggerSelectionModal,
      sendTestEmailModal,
      addUsersModal,
      users,
    ],
  );

  return (
    <EmailSequencesContext.Provider value={contextValue}>
      {children}
    </EmailSequencesContext.Provider>
  );
};

EmailSequencesContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
