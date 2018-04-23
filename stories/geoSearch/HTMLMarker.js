import { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import createHTLMMarker from './createHTMLMarker';

const LatLngPropTypes = PropTypes.shape({
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
});

class HTMLMarker extends Component {
  static propTypes = {
    position: LatLngPropTypes.isRequired,
    hit: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  };

  static contextTypes = {
    google: PropTypes.object.isRequired,
    instance: PropTypes.object.isRequired,
  };

  state = {
    marker: null,
  };

  componentDidMount() {
    const { position } = this.props;
    const { google, instance } = this.context;

    const Marker = createHTLMMarker(google);

    const marker = new Marker({
      map: instance,
      position,
    });

    this.setState(() => ({
      marker,
    }));
  }

  componentDidUpdate() {
    const { children } = this.props;
    const { marker } = this.state;

    if (typeof ReactDOM.createPortal !== 'function') {
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        children,
        marker.element
      );
    }
  }

  componentWillUnmount() {
    const { marker } = this.state;

    if (marker) {
      marker.setMap(null);
    }
  }

  render() {
    const { children } = this.props;
    const { marker } = this.state;

    if (!marker) {
      return null;
    }

    if (typeof ReactDOM.createPortal !== 'function') {
      return null;
    }

    return ReactDOM.createPortal(children, marker.element);
  }
}

export default HTMLMarker;
