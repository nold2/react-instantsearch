import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Connector from './Connector';
import GoogleMap from './GoogleMap';

class GeoSearch extends Component {
  static propTypes = {
    google: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    initialZoom: PropTypes.number,
    initialPosition: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }),
  };

  static defaultProps = {
    initialZoom: 1,
    initialPosition: {
      lat: 0,
      lng: 0,
    },
  };

  renderConnectorChildren = ({
    hits,
    currentRefinement,
    position,
    isRefinedWithMap,
    refine,
  }) => {
    const { google, children, initialZoom, initialPosition } = this.props;

    // We can optimize this a bit to use isRefinedWithMap
    // to avoid the bounds computation when the refienemnt
    // is from the map
    const hitsLatLngBounds = hits.reduce(
      (acc, item) =>
        acc.extend({ lat: item._geoloc.lat, lng: item._geoloc.lng }),
      new google.maps.LatLngBounds()
    );

    const hitsBoundingBox = {
      northEast: {
        lat: hitsLatLngBounds.getNorthEast().lat(),
        lng: hitsLatLngBounds.getNorthEast().lng(),
      },
      southWest: {
        lat: hitsLatLngBounds.getSouthWest().lat(),
        lng: hitsLatLngBounds.getSouthWest().lng(),
      },
    };

    return (
      <GoogleMap
        google={google}
        boundingBox={currentRefinement || hitsBoundingBox}
        initialZoom={initialZoom}
        initialPosition={position || initialPosition}
        isRefinedWithMap={isRefinedWithMap}
        refine={refine}
      >
        {children({ hits })}
      </GoogleMap>
    );
  };

  render() {
    return <Connector>{this.renderConnectorChildren}</Connector>;
  }
}

export default GeoSearch;