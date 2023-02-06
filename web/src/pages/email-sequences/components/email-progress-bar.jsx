import PropTypes from 'prop-types';

import DoubleSectionProgressBar from './ProgressBar';

const EmailProgressBar = ({ converted, sent, dropped }) => (
  <DoubleSectionProgressBar
    total={sent}
    primaryCount={converted}
    secondaryCount={dropped}
    isCompact={false}
    primaryText="Converted"
    secondaryText="Dropped"
    totalText="Sent"
  />
);

EmailProgressBar.propTypes = {
  sent: PropTypes.number.isRequired,
  converted: PropTypes.number.isRequired,
  dropped: PropTypes.number.isRequired,
};

export default EmailProgressBar;
