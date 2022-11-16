import { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useModals } from '@mantine/modals';
import { Text, Title } from '@mantine/core';

export const EXAMPLE_PIPELINES = [{
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

const initialContext = {
  audience: false,
  testEmail: false,
  triggerSelection: false,
  currentSequence: null,
  pipelines: EXAMPLE_PIPELINES,
};

export const EmailSequencesContext = createContext(initialContext);

const createEmptyPipeline = (prev) => {
  const name = `Pipeline ${prev.length + 1}`;
  return { name, sequences: [] };
};

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
  const modals = useModals();
  const [pipelines, setPipelines] = useState(EXAMPLE_PIPELINES);
  const [triggerSelectionModal, setTriggerSelectionModal] = useState(false);
  const [sendTestEmailModal, setSendTestEmailModal] = useState(false);
  const [addUsersModal, setAddUsersModal] = useState(false);
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
  const addEmptyPipeline = () => setPipelines((prev) => [...prev, createEmptyPipeline(prev)]);
  const closeAddUsersModal = () => setAddUsersModal(false);
  const openAddUsersModal = () => setAddUsersModal(true);

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
    currentPipeline.sequences = [...currentPipeline.sequences, createEmptySequence(trigger)];
  }, [openedPipeline, pipelines]);

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

  const removePipeline = useMemo(() => () => {
    modals.openConfirmModal({
      title: (<Title order={3}>{`Delete pipeline ${openedPipeline}`}</Title>),
      centered: true,
      children: (
        <Text>
          {`Delete pipeline ${openedPipeline}?`}
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red', variant: 'subtle' },
      cancelProps: { variant: 'subtle' },
      onConfirm: () => {
        setPipelines(
          (prev) => prev.filter((p) => p.name !== openedPipeline),
        );
        setOpenedPipeline(pipelines[0]?.name);
      },
    });
  }, [modals, openedPipeline, pipelines]);

  const toggleEmailEnabled = useMemo(() => (email) => {
    // eslint-disable-next-line no-param-reassign
    email.enabled = !email.enabled;
    setPipelines([...pipelines]);
  }, [pipelines]);

  const contextValue = useMemo(
    () => ({
      closeTriggerModal,
      openTriggerModal,
      addEmptyPipeline,
      openSendTestEmailModal,
      closeSendTestEmailModal,
      closeAddUsersModal,
      openAddUsersModal,
      closeEditEmailModal,
      openEditEmailModal,
      toggleEmailEnabled,
      addEmptyEmail,
      removePipeline,
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
    }),
    [
      toggleEmailEnabled,
      addEmptyEmail,
      removePipeline,
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
