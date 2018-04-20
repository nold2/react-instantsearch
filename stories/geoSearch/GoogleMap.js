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
    isRefinedWithMap: PropTypes.bool.isRequired,
    refine: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  static childContextTypes = {
    instance: PropTypes.object,
    google: PropTypes.object,
    refineWithoutBoundingBox: PropTypes.func,
    refineWithBoudingBox: PropTypes.func,
    toggleRefineOnMapMove: PropTypes.func,
    setInitialRefineOnMapMove: PropTypes.func,
    isRefinedWithMap: PropTypes.bool,
    isRefineOnMapMove: PropTypes.bool,
    hasMapMoveSinceLastRefine: PropTypes.bool,
  };

  state = {
    isMapAlreadyRender: false,
    isRefineOnMapMove: true,
    hasMapMoveSinceLastRefine: false,
  };

  mapInstance = null;
  isUserInteraction = true;

  createRef = c => (this.element = c);

  getChildContext() {
    const { google, isRefinedWithMap } = this.props;
    const { isRefineOnMapMove, hasMapMoveSinceLastRefine } = this.state;

    return {
      instance: this.mapInstance,
      refineWithBoudingBox: this.refineWithBoudingBox,
      refineWithoutBoundingBox: this.refineWithoutBoundingBox,
      toggleRefineOnMapMove: this.toggleRefineOnMapMove,
      setInitialRefineOnMapMove: this.setInitialRefineOnMapMove,
      google,
      isRefinedWithMap,
      isRefineOnMapMove,
      hasMapMoveSinceLastRefine,
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
    const { google, boundingBox, isRefinedWithMap } = this.props;
    const { hasMapMoveSinceLastRefine } = this.state;
    const fitBoundsEnable =
      boundingBox && !isRefinedWithMap && !hasMapMoveSinceLastRefine;

    // Keep the default padding when it's not refined with the map
    const padding = isRefinedWithMap ? 0 : null;

    if (fitBoundsEnable) {
      this.isUserInteraction = false;
      this.mapInstance.fitBounds(
        new google.maps.LatLngBounds(
          boundingBox.southWest,
          boundingBox.northEast
        ),
        padding
      );
      this.isUserInteraction = true;
    }
  }

  setupListenersWhenMapIsReady = () => {
    const onChange = () => {
      const { isRefineOnMapMove } = this.state;

      if (this.isUserInteraction) {
        this.setState(() => ({
          hasMapMoveSinceLastRefine: true,
        }));

        if (isRefineOnMapMove) {
          this.isPendingRefine = true;
        }
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

  refineWithoutBoundingBox = () => {
    const { refine } = this.props;

    refine();

    this.setState(() => ({
      hasMapMoveSinceLastRefine: false,
    }));
  };

  refineWithBoudingBox = () => {
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

    // Should be after the refine otherwise it will
    // trigger fitBounds on the previous marker
    // -> refine -> render -> setState -> render
    // -> setState -> render -> fitBounds -> refine -> render
    this.setState(() => ({
      hasMapMoveSinceLastRefine: false,
    }));
  };

  toggleRefineOnMapMove = () => {
    this.setState(({ isRefineOnMapMove }) => ({
      isRefineOnMapMove: !isRefineOnMapMove,
    }));
  };

  setInitialRefineOnMapMove = value => {
    this.setState(() => ({
      isRefineOnMapMove: value,
    }));
  };

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
