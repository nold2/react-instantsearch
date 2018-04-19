import { Component } from 'react';
import PropTypes from 'prop-types';

const LatLngPropTypes = PropTypes.shape({
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
});

class Marker extends Component {
  static propTypes = {
    position: LatLngPropTypes.isRequired,
    hit: PropTypes.object.isRequired,
  };

  static contextTypes = {
    google: PropTypes.object.isRequired,
    instance: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { position } = this.props;
    const { google, instance } = this.context;

    this.marker = new google.maps.Marker({
      map: instance,
      position,
    });
  }

  componentWillUnmount() {
    this.marker.setMap(null);
  }

  render() {
    return null;
  }
}

export default Marker;
