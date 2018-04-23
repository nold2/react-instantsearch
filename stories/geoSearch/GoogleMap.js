import { isEqual } from 'lodash';
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

const hasMapMoveSinceLastRefineStateUpdater = ({
  hasMapMoveSinceLastRefine,
}) => {
  // Prevent setState when the previous value
  // is already true, not need to trigger a new render
  if (hasMapMoveSinceLastRefine === true) {
    return null;
  }

  return {
    hasMapMoveSinceLastRefine: true,
  };
};

class GoogleMap extends Component {
  static propTypes = {
    google: PropTypes.object.isRequired,
    boundingBox: BoundingBoxPropTypes.isRequired,
    initialZoom: PropTypes.number.isRequired,
    initialPosition: LatLngPropTypes.isRequired,
    isRefinedWithMap: PropTypes.bool.isRequired,
    refine: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    position: LatLngPropTypes,
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
  lastRefinePosition = this.props.position;
  lastRefineBoundingBox = this.props.boundingBox;
  listeners = [];

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

    this.fitViewToBounds();

    this.setState(() => ({
      isMapAlreadyRender: true,
    }));
  }

  componentDidUpdate(prevProps) {
    const { position, boundingBox, isRefinedWithMap } = this.props;
    const { hasMapMoveSinceLastRefine } = this.state;
    const fitBoundsEnable =
      boundingBox &&
      !isRefinedWithMap &&
      !hasMapMoveSinceLastRefine &&
      !isEqual(boundingBox, prevProps.boundingBox);

    const positionChangedSinceLastRefine =
      Boolean(position) &&
      Boolean(this.lastRefinePosition) &&
      position !== this.lastRefinePosition;

    // Do the same test but in the component above
    // because the boudingBox is always set in that
    // case (currentRefinement || hitBoundingBox)
    // const boundingBoxChangedSinceLastRefine = !isEqual(
    //   boundingBox,
    //   this.lastRefineBoundingBox
    // );

    this.lastRefinePosition = position;
    // this.lastRefineBoundingBox = boundingBox;

    if (positionChangedSinceLastRefine) {
      // if (positionChangedSinceLastRefine || boundingBoxChangedSinceLastRefine) {
      // console.log('here');
      this.setState({
        hasMapMoveSinceLastRefine: false,
      });

      return;
    }

    if (fitBoundsEnable) {
      // console.log('fit');
      // console.log(boundingBox);
      // console.log('---');
      this.fitViewToBounds();
    }
  }

  componentWillUnmount() {
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
  }

  setupListenersWhenMapIsReady = () => {
    const onMapPositionChange = () => {
      const { isRefineOnMapMove } = this.state;

      if (this.isUserInteraction) {
        this.setState(hasMapMoveSinceLastRefineStateUpdater);

        if (isRefineOnMapMove) {
          this.isPendingRefine = true;
        }
      }
    };

    this.listeners.push(
      this.mapInstance.addListener('center_changed', onMapPositionChange)
    );

    this.listeners.push(
      this.mapInstance.addListener('zoom_changed', onMapPositionChange)
    );

    this.listeners.push(
      this.mapInstance.addListener('dragstart', onMapPositionChange)
    );

    this.listeners.push(
      this.mapInstance.addListener('idle', () => {
        if (this.isUserInteraction && this.isPendingRefine) {
          this.isPendingRefine = false;

          this.refineWithBoudingBox();
        }
      })
    );
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

  fitViewToBounds() {
    const { google, boundingBox, isRefinedWithMap } = this.props;
    const padding = isRefinedWithMap ? 0 : null;

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

  render() {
    const { children } = this.props;
    const { isMapAlreadyRender } = this.state;

    return (
      <Fragment>
        <div
          ref={c => (this.element = c)}
          className="ais-GeoSearch-map"
          style={{ width: '100%', height: '100%' }}
        />

        {isMapAlreadyRender && children}
      </Fragment>
    );
  }
}

export default GoogleMap;
