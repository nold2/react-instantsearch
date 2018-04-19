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
    refine: PropTypes.func.isRequired,
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
  isUserInteraction = true;

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

    google.maps.event.addListenerOnce(
      this.mapInstance,
      'idle',
      this.setupListenersWhenMapIsReady
    );

    this.setState(() => ({
      isMapAlreadyRender: true,
    }));
  }

  componentDidUpdate() {
    const { google, boundingBox } = this.props;

    if (boundingBox) {
      this.isUserInteraction = false;
      this.mapInstance.fitBounds(
        new google.maps.LatLngBounds(
          boundingBox.southWest,
          boundingBox.northEast
        ),
        0
      );
      this.isUserInteraction = true;
    }
  }

  setupListenersWhenMapIsReady = () => {
    const onChange = () => {
      if (this.isUserInteraction) {
        // setMapMoveSinceLastRefine();

        // if (isRefineOnMapMove()) {
        this.isPendingRefine = true;
        // }
      }
    };

    this.mapInstance.addListener('center_changed', onChange);
    this.mapInstance.addListener('zoom_changed', onChange);
    this.mapInstance.addListener('dragstart', onChange);

    this.mapInstance.addListener('idle', () => {
      if (this.isUserInteraction && this.isPendingRefine) {
        this.isPendingRefine = false;

        this.refineWithBoudingBox();
      }
    });
  };

  refineWithBoudingBox() {
    const { refine } = this.props;
    const currentLatLngBounds = this.mapInstance.getBounds();

    refine({
      northEast: {
        lat: currentLatLngBounds.getNorthEast().lat(),
        lng: currentLatLngBounds.getNorthEast().lng(),
      },
      southWest: {
        lat: currentLatLngBounds.getSouthWest().lat(),
        lng: currentLatLngBounds.getSouthWest().lng(),
      },
    });
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
