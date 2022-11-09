import { createContext, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';

export const EXAMPLE_PIPELINES = [{
  name: 'Pipeline 1',
  sequences: [
    {
      id: '1',
      name: 'Sign up',
      enabled: true,
      trigger: {
        name: 'Sign up',
        description: 'Description',
      },

      audience: {
        name: 'Audience name',
        value: 'All users',
      },

      emails: [
        {
          id: '1',
          delay: 1,
          name: 'Welcome email',
          enabled: true,
          sent: 12,
          unsubscribed: 4,
          converted: 2,
          reactions: {
            happy: 2,
            unhappy: 1,
            love: 8,
          },
        },
        {
          id: '2',
          delay: 2,
          name: 'SDK, Rules, call',
          enabled: true,
          sent: 12,
          unsubscribed: 4,
          converted: 2,
          reactions: {
            happy: 2,
            unhappy: 1,
            love: 8,
          },
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

const reducer = (state, action) => {
  switch (action.type) {
    case 'open-modal':
      return { ...state, [action.name]: true };
    case 'close-modal':
      return { ...state, [action.name]: false };
    case 'set-current-sequence':
      return { ...state, currentSequence: action.sequence };
    default:
      return state;
  }
};

export const EmailSequencesContextProvider = ({ children }) => {
  const [context, dispatch] = useReducer(reducer, initialContext, () => initialContext);

  const contextValue = useMemo(() => ({ context, dispatch }), [context, dispatch]);

  return (
    <EmailSequencesContext.Provider value={contextValue}>
      {children}
    </EmailSequencesContext.Provider>
  );
};

EmailSequencesContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
