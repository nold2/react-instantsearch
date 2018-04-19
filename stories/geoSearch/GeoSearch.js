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

  renderInnerChildren = ({ hits, currentRefinement, position, refine }) => {
    const { google, children, initialZoom, initialPosition } = this.props;

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
        refine={refine}
      >
        {children({ hits })}
      </GoogleMap>
    );
  };

  render() {
    return (
      // prettier-ignore
      <Connector>
        {this.renderInnerChildren}
      </Connector>
    );
  }
}

export default GeoSearch;
