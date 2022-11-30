import { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { emailSequenceApi } from 'resources/email-sequence';

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

const createEmptySequence = (trigger) => ({
  name: 'Empty sequence',
  id: `${Math.random() * 10000}`, // FIXME
  emails: [],
  trigger,
  enabled: false,
  total: 0,
  completed: 0,
  dropped: 0,
});

const createEmptyEmail = () => ({
  name: 'Email name',
  id: `${Math.random() * 10000}`, // FIXME
  delay: 1,
  enabled: false,
  sent: 0,
  unsubscribed: 0,
});

export const EmailSequencesContextProvider = ({ children }) => {
  const router = useRouter();
  const [pipelines, setPipelines] = useState(EXAMPLE_PIPELINES);
  const [users, setUsers] = useState(EXAMPLE_USERS);
  const [triggerSelectionModal, setTriggerSelectionModal] = useState(false);
  const [sendTestEmailModal, setSendTestEmailModal] = useState(false);
  const [addUsersModal, setAddUsersModal] = useState(false);
  const [renameSequenceModal, setRenameSequenceModal] = useState(false);
  const [currentSequence, setCurrentSequence] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
  const [currentEmail, setCurrentEmail] = useState(null);

  const [openedPipeline, setOpenedPipeline] = useState(router.asPath.split('#')?.[1] || pipelines[0]?.name);

  const closeTriggerModal = () => {
    setCurrentSequence(null);
    setTriggerSelectionModal(false);
  };

  const openTriggerModal = (sequence) => {
    setCurrentSequence(sequence);
    setTriggerSelectionModal(true);
  };

  const openSendTestEmailModal = () => setSendTestEmailModal(true);
  const closeSendTestEmailModal = () => setSendTestEmailModal(false);
  const closeAddUsersModal = () => setAddUsersModal(false);
  const openAddUsersModal = () => setAddUsersModal(true);

  const openRenameSequenceModal = (sequence) => {
    setCurrentSequence(sequence);
    setRenameSequenceModal(true);
  };
  const closeRenameSequenceModal = () => setRenameSequenceModal(false);

  const { mutate: createSequence } = emailSequenceApi.useAddSequence();

  const closeEditEmailModal = () => {
    setEmailModal(false);
    setCurrentEmail(null);
  };

  const openEditEmailModal = (email) => {
    setEmailModal(true);
    setCurrentEmail(email);
  };

  const addSequence = useMemo(() => (trigger) => {
    const currentPipeline = pipelines.find((p) => p.name === openedPipeline);

    const sequence = createEmptySequence(trigger);
    createSequence(
      { pipelineId: currentPipeline.id || currentPipeline._id,
        name: sequence.name,
        trigger: { ...trigger, key: new Date().toISOString() } },
      {
        onSuccess: (data) => {
          currentPipeline.sequences = [...currentPipeline.sequences, data];
          setPipelines([...pipelines, currentPipeline]);
        },
      },
    );
  }, [createSequence, openedPipeline, pipelines]);

  const setTrigger = useMemo(() => (trigger) => {
    currentSequence.trigger = trigger;
    setPipelines([...pipelines]);
  }, [currentSequence, pipelines]);

  const saveCurrentEmail = useMemo(() => () => {
    setPipelines([...pipelines]);
  }, [pipelines]);

  const addEmptyEmail = useMemo(() => (sequence) => {
    const currentPipeline = pipelines.find((p) => p.name === openedPipeline);
    const currentSequence = currentPipeline.sequences.find((s) => s === sequence);
    const email = createEmptyEmail();
    currentSequence.emails = [...currentSequence.emails, email];
    setPipelines([...pipelines]);
    openEditEmailModal(email);
  }, [openedPipeline, pipelines]);

  const removeEmail = useMemo(() => (emailId) => {
    const currentPipeline = pipelines.find((p) => p.name === openedPipeline);
    const currentSequence = currentPipeline.sequences.find(
      (s) => !!s.emails.find((e) => e.id === emailId),
    );
    currentSequence.emails = currentSequence.emails.filter((e) => e.id !== emailId);
    setPipelines([...pipelines]);
  }, [openedPipeline, pipelines]);

  const toggleEmailEnabled = useMemo(() => (email) => {
    // eslint-disable-next-line no-param-reassign
    email.enabled = !email.enabled;
    setPipelines([...pipelines]);
  }, [pipelines]);

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
      removeEmail,
      setUsers,
      toggleEmailEnabled,
      addEmptyEmail,
      saveCurrentEmail,
      currentEmail,
      emailModal,
      setTrigger,
      addSequence,
      openedPipeline,
      setOpenedPipeline,
      pipelines,
      triggerSelectionModal,
      sendTestEmailModal,
      addUsersModal,
      currentSequence,
      users,
    }),
    [
      renameSequenceModal,
      removeEmail,
      toggleEmailEnabled,
      addEmptyEmail,
      saveCurrentEmail,
      currentEmail,
      emailModal,
      setTrigger,
      addSequence,
      openedPipeline,
      pipelines,
      triggerSelectionModal,
      sendTestEmailModal,
      addUsersModal,
      currentSequence,
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
