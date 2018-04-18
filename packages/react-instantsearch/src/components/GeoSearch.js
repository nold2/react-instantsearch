/* eslint-disable import/no-extraneous-dependencies */
/* global google */

import { isEqual } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from 'react-google-maps';

class GeoSearch extends Component {
  static propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    isRefinedWithMap: PropTypes.bool.isRequired,
    refine: PropTypes.func.isRequired,
    position: PropTypes.object,
    currentRefinement: PropTypes.object,
  };

  state = {
    isRefineOnMapMove: true,
    hasMapMoveSinceLastRefine: false,
  };

  isMapAlreadyLoaded = false;
  isPendingRefine = false;
  isUserInteraction = true;

  lastRefinePosition = null;
  lastRefineBoundingBox = null;

  createRef = c => (this.element = c);

  componentDidMount() {
    this.fitViewToBounds();
  }

  componentDidUpdate() {
    const { position, currentRefinement } = this.props;

    // It's not possible to put this in the connector
    // because we can't we have no way to properly:
    // - 1. hook on the update
    // - 2. trigger a proper upadte
    const positionChangedSinceLastRefine =
      Boolean(position) &&
      Boolean(this.lastRefinePosition) &&
      !isEqual(position, this.lastRefinePosition);

    const boundingBoxChangedSinceLastRefine =
      !currentRefinement &&
      Boolean(this.lastRefineBoundingBox) &&
      !isEqual(currentRefinement, this.lastRefineBoundingBox);

    this.lastRefinePosition = position || null;
    this.lastRefineBoundingBox = currentRefinement || null;

    if (positionChangedSinceLastRefine || boundingBoxChangedSinceLastRefine) {
      this.setState(() => ({
        hasMapMoveSinceLastRefine: false,
      }));
    } else {
      this.fitViewToBounds();
    }
  }

  onMapChange = () => {
    const { isRefineOnMapMove } = this.state;

    if (this.isMapAlreadyLoaded && this.isUserInteraction) {
      this.setState(() => ({
        hasMapMoveSinceLastRefine: true,
      }));

      if (isRefineOnMapMove) {
        this.isPendingRefine = true;
      }
    }
  };

  onMapIdle = () => {
    this.isMapAlreadyLoaded = true;

    if (this.isUserInteraction && this.isPendingRefine) {
      this.refineWithMap();

      this.isPendingRefine = false;
    }
  };

  onToggle = () =>
    this.setState(prevState => ({
      isRefineOnMapMove: !prevState.isRefineOnMapMove,
    }));

  refineWithMap = () => {
    const { refine } = this.props;

    const ne = this.element.getBounds().getNorthEast();
    const sw = this.element.getBounds().getSouthWest();

    refine({
      northEast: { lat: ne.lat(), lng: ne.lng() },
      southWest: { lat: sw.lat(), lng: sw.lng() },
    });

    this.setState(() => ({
      hasMapMoveSinceLastRefine: false,
    }));
  };

  clearMapRefinement = () => {
    const { refine } = this.props;

    refine();

    this.setState(() => ({
      hasMapMoveSinceLastRefine: false,
    }));
  };

  fitViewToBounds() {
    const { hits, isRefinedWithMap } = this.props;
    const { hasMapMoveSinceLastRefine } = this.state;
    const isFitBoundsEnable =
      Boolean(hits.length) && !hasMapMoveSinceLastRefine && !isRefinedWithMap;

    if (isFitBoundsEnable) {
      this.isUserInteraction = false;
      this.element.fitBounds(
        hits.reduce(
          (acc, item) =>
            acc.extend({ lat: item._geoloc.lat, lng: item._geoloc.lng }),
          new google.maps.LatLngBounds()
        )
      );
      this.isUserInteraction = true;
    }
  }

  render() {
    const { hits, isRefinedWithMap } = this.props;
    const { isRefineOnMapMove, hasMapMoveSinceLastRefine } = this.state;

    return (
      <div>
        <GoogleMap
          ref={this.createRef}
          defaultZoom={8}
          defaultCenter={{ lat: -34.397, lng: 150.644 }}
          options={{
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            clickableIcons: false,
            zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_TOP,
            },
          }}
          onDragStart={this.onMapChange}
          onCenterChanged={this.onMapChange}
          onZoomChanged={this.onMapChange}
          onIdle={this.onMapIdle}
        >
          {hits.map(item => (
            <Marker key={item.objectID} position={item._geoloc} />
          ))}
        </GoogleMap>

        {isRefineOnMapMove || !hasMapMoveSinceLastRefine ? (
          <label>
            <input
              type="checkbox"
              checked={isRefineOnMapMove}
              onChange={this.onToggle}
            />
            Search as I move the map
          </label>
        ) : (
          <button onClick={this.refineWithMap}>Redo search here</button>
        )}

        {isRefinedWithMap && (
          <button onClick={this.clearMapRefinement}>
            Clear map refinement
          </button>
        )}
      </div>
    );
  }
}

export default withScriptjs(withGoogleMap(GeoSearch));
