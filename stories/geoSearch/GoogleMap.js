import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

const LatLngPropTypes = PropTypes.shape({
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
});

const BoundingBoxPropTypes = PropTypes.shape({
  northEast: LatLngPropTypes.isRequired,
  southWest: LatLngPropTypes.isRequired,
});

class GoogleMap extends Component {
  static propTypes = {
    google: PropTypes.object.isRequired,
    boundingBox: BoundingBoxPropTypes.isRequired,
    initialZoom: PropTypes.number.isRequired,
    initialPosition: LatLngPropTypes.isRequired,
    children: PropTypes.node.isRequired,
  };

  static childContextTypes = {
    google: PropTypes.object,
    instance: PropTypes.object,
  };

  state = {
    isMapAlreadyRender: false,
  };

  mapInstance = null;

  createRef = c => (this.element = c);

  getChildContext() {
    return {
      google: this.props.google,
      instance: this.mapInstance,
    };
  }

  componentDidMount() {
    const { google } = this.props;

    this.mapInstance = new google.maps.Map(this.element, {
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      clickableIcons: false,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
      },
    });

    this.setState(() => ({
      isMapAlreadyRender: true,
    }));
  }

  componentDidUpdate() {
    const { google, boundingBox } = this.props;

    if (boundingBox) {
      this.mapInstance.fitBounds(
        new google.maps.LatLngBounds(
          boundingBox.southWest,
          boundingBox.northEast
        )
      );
    }
  }

  render() {
    const { children } = this.props;
    const { isMapAlreadyRender } = this.state;

    return (
      <Fragment>
        <div
          ref={this.createRef}
          className="ais-GeoSearch-map"
          style={{ width: '100%', height: '100%' }}
        />

        {isMapAlreadyRender && children}
      </Fragment>
    );
  }
}

export default GoogleMap;
