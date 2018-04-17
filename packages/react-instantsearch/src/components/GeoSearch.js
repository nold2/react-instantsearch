/* eslint-disable import/no-extraneous-dependencies */
/* global google */

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
    isRefineOnMapMove: PropTypes.bool.isRequired,
    hasMapMoveSinceLastRefine: PropTypes.bool.isRequired,
    // refine: PropTypes.func.isRequired,
    toggleRefineOnMapMove: PropTypes.func.isRequired,
    setMapMoveSinceLastRefine: PropTypes.func.isRequired,
  };

  isMapAlreadyLoaded = false;
  isPendingRefine = false;
  isUserInteraction = true;

  componentDidMount() {
    this.fitViewToBounds();
  }

  componentDidUpdate() {
    this.fitViewToBounds();
  }

  createRef = c => (this.element = c);

  onChange = () => {
    const { isRefineOnMapMove, setMapMoveSinceLastRefine } = this.props;

    if (this.isMapAlreadyLoaded && this.isUserInteraction) {
      setMapMoveSinceLastRefine(true);

      if (isRefineOnMapMove) {
        this.isPendingRefine = true;
      }
    }
  };

  onIdle = () => {
    this.isMapAlreadyLoaded = true;

    if (this.isUserInteraction && this.isPendingRefine) {
      this.refineWithMap();

      this.isPendingRefine = false;
    }
  };

  fitViewToBounds() {
    const { hits, hasMapMoveSinceLastRefine, isRefinedWithMap } = this.props;
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

  refineWithMap = () => {
    // const { refine, setMapMoveSinceLastRefine } = this.props;
    const { setMapMoveSinceLastRefine } = this.props;

    // const ne = this.element.getBounds().getNorthEast();
    // const sw = this.element.getBounds().getSouthWest();

    // refine({
    //   northEast: { lat: ne.lat(), lng: ne.lng() },
    //   southWest: { lat: sw.lat(), lng: sw.lng() },
    // });
    console.log('refine(bounds)');

    setMapMoveSinceLastRefine(false);
  };

  clearMapRefinement = () => {
    // const { refine, setMapMoveSinceLastRefine } = this.props;
    const { setMapMoveSinceLastRefine } = this.props;

    // refine();
    console.log('refine()');

    setMapMoveSinceLastRefine(false);
  };

  render() {
    const {
      hits,
      isRefineOnMapMove,
      isRefinedWithMap,
      hasMapMoveSinceLastRefine,
      toggleRefineOnMapMove,
    } = this.props;

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
          onDragStart={this.onChange}
          onCenterChanged={this.onChange}
          onZoomChanged={this.onChange}
          onIdle={this.onIdle}
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
              onChange={toggleRefineOnMapMove}
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
