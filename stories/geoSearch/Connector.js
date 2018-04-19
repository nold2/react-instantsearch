import PropTypes from 'prop-types';
import { connectGeoSearch } from '../../packages/react-instantsearch/connectors';

const Connector = ({ children, ...props }) => children(props);

Connector.propTypes = {
  children: PropTypes.func.isRequired,
};

export default connectGeoSearch(Connector);
