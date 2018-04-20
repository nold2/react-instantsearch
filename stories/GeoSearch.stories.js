import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import injectScript from 'scriptjs';
import { setAddon, storiesOf } from '@storybook/react';
// import places from 'places.js';
import {
  // GeoSearch,
  Configure,
  // CurrentRefinements,
} from '../packages/react-instantsearch/dom';
import { GeoSearch, Marker, Clear, Redo } from './geoSearch';
import { displayName, filterProps, WrapWithHits } from './util';
import JSXAddon from 'storybook-addon-jsx';

setAddon(JSXAddon);

// const Control = () => {};
// const Clear = () => {};
// const InfoBox = () => {};
// const Marker = () => {};

// const paddingBoundingBox = {};
// const mapOptions = {};

const stories = storiesOf('GeoSearch', module);

// const position = '37.7793, -122.419';
// const radius = 5000;
// const precision = 2500;

// Use the context for the map reference
// <GeoSearch> have methods and provide it through context
// <...> Just call the provided function through the context
// - TODO: see how to customize the content of Marker
// - TODO: see how to customize the content of Box

class GoogleMapsLoader extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  state = {
    google: null,
  };

  componentDidMount() {
    injectScript(
      'https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8',
      () => {
        this.setState({
          google: window.google,
        });
      }
    );
  }

  render() {
    if (!this.state.google) {
      return null;
    }

    return this.props.children(this.state.google);
  }
}

// Default
stories.addWithJSX(
  'default',
  () => (
    <WrapWithHits
      linkedStoryGroup="GeoSearch"
      indexName="airbnb"
      searchParameters={{
        hitsPerPage: 25,
      }}
    >
      <Configure aroundLatLngViaIP />

      <div style={{ height: 500 }}>
        <GoogleMapsLoader>
          {google => (
            <GeoSearch
              google={google}
              // initialZoom={8}
              // initialPosition={position}
              // paddingBoundingBox={paddingBoundingBox}
              // mapOptions={mapOptions}
            >
              {({ hits }) => (
                <Fragment>
                  {/* <Control enableRefineOnMapMove={false} /> */}
                  <Redo />
                  <Clear />

                  {/* {currentHit && (
                  <InfoBox // Provided API
                    position={currentHit._geoloc}
                    onClick={() => {}}
                    onHover={() => {}}
                  />
                )} */}

                  {/* {currentHit && (
                  <InfoWindow // Provided API
                    position={currentHit._geoloc}
                    onClick={() => {}}
                    onHover={() => {}}
                  />
                )} */}

                  {hits.map(hit => (
                    <Marker // Provided API
                      key={hit.objectID}
                      hit={hit}
                      position={hit._geoloc}
                      onClick={() => {}}
                      onHover={() => {}}
                    />
                  ))}
                </Fragment>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </div>
    </WrapWithHits>
  ),
  {
    displayName,
    filterProps,
  }
);

// // With IP
// stories
//   .addWithJSX(
//     'with IP',
//     () => (
//       <WrapWithHits
//         linkedStoryGroup="GeoSearch"
//         indexName="airbnb"
//         searchParameters={{
//           hitsPerPage: 25,
//         }}
//       >
//         <Configure aroundLatLngViaIP />

//         <GeoSearch
//           googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
//           loadingElement={<div style={{ height: `100%` }} />}
//           containerElement={<div style={{ height: `500px` }} />}
//           mapElement={<div style={{ height: `100%` }} />}
//         />
//       </WrapWithHits>
//     ),
//     {
//       displayName,
//       filterProps,
//     }
//   )
//   .addWithJSX(
//     'with IP & radius',
//     () => (
//       <WrapWithHits
//         linkedStoryGroup="GeoSearch"
//         indexName="airbnb"
//         searchParameters={{
//           hitsPerPage: 25,
//         }}
//       >
//         <Configure aroundLatLngViaIP aroundRadius={radius} />

//         <GeoSearch
//           googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
//           loadingElement={<div style={{ height: `100%` }} />}
//           containerElement={<div style={{ height: `500px` }} />}
//           mapElement={<div style={{ height: `100%` }} />}
//         />
//       </WrapWithHits>
//     ),
//     {
//       displayName,
//       filterProps,
//     }
//   )
//   .addWithJSX(
//     'with IP & radius & precision',
//     () => (
//       <WrapWithHits
//         linkedStoryGroup="GeoSearch"
//         indexName="airbnb"
//         searchParameters={{
//           hitsPerPage: 25,
//         }}
//       >
//         <Configure
//           aroundLatLngViaIP
//           aroundRadius={radius}
//           aroundPrecision={precision}
//         />

//         <GeoSearch
//           googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
//           loadingElement={<div style={{ height: `100%` }} />}
//           containerElement={<div style={{ height: `500px` }} />}
//           mapElement={<div style={{ height: `100%` }} />}
//         />
//       </WrapWithHits>
//     ),
//     {
//       displayName,
//       filterProps,
//     }
//   );

// // With Position
// stories
//   .addWithJSX(
//     'with position',
//     () => (
//       <WrapWithHits
//         linkedStoryGroup="GeoSearch"
//         indexName="airbnb"
//         searchParameters={{
//           hitsPerPage: 25,
//         }}
//       >
//         <Configure aroundLatLng={position} />

//         <GeoSearch
//           googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
//           loadingElement={<div style={{ height: `100%` }} />}
//           containerElement={<div style={{ height: `500px` }} />}
//           mapElement={<div style={{ height: `100%` }} />}
//         />
//       </WrapWithHits>
//     ),
//     {
//       displayName,
//       filterProps,
//     }
//   )
//   .addWithJSX(
//     'with position & radius',
//     () => (
//       <WrapWithHits
//         linkedStoryGroup="GeoSearch"
//         indexName="airbnb"
//         searchParameters={{
//           hitsPerPage: 25,
//         }}
//       >
//         <Configure aroundLatLng={position} aroundRadius={radius} />

//         <GeoSearch
//           googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
//           loadingElement={<div style={{ height: `100%` }} />}
//           containerElement={<div style={{ height: `500px` }} />}
//           mapElement={<div style={{ height: `100%` }} />}
//         />
//       </WrapWithHits>
//     ),
//     {
//       displayName,
//       filterProps,
//     }
//   )
//   .addWithJSX(
//     'with position & radius & precision',
//     () => (
//       <WrapWithHits
//         linkedStoryGroup="GeoSearch"
//         indexName="airbnb"
//         searchParameters={{
//           hitsPerPage: 25,
//         }}
//       >
//         <Configure
//           aroundLatLng={position}
//           aroundRadius={radius}
//           aroundPrecision={precision}
//         />

//         <GeoSearch
//           googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
//           loadingElement={<div style={{ height: `100%` }} />}
//           containerElement={<div style={{ height: `500px` }} />}
//           mapElement={<div style={{ height: `100%` }} />}
//         />
//       </WrapWithHits>
//     ),
//     {
//       displayName,
//       filterProps,
//     }
//   );

// // With Places @TODO
// stories.addWithJSX(
//   'with Places',
//   () => {
//     class Places extends Component {
//       static propTypes = {
//         onChange: PropTypes.func.isRequired,
//         defaultRefinement: PropTypes.object.isRequired,
//       };

//       createRef = c => (this.element = c);

//       componentDidMount() {
//         const { onChange, defaultRefinement } = this.props;

//         const autocomplete = places({
//           container: this.element,
//           aroundRadius: radius,
//         });

//         onChange(defaultRefinement);

//         autocomplete.on('change', event => {
//           onChange(event.suggestion.latlng);
//         });

//         autocomplete.on('clear', () => {
//           onChange(defaultRefinement);
//         });
//       }

//       render() {
//         return (
//           <div style={{ marginBottom: 20 }}>
//             <input
//               ref={this.createRef}
//               type="search"
//               id="address-input"
//               placeholder="Where are we going?"
//             />
//           </div>
//         );
//       }
//     }

//     class App extends Component {
//       state = {
//         searchState: {},
//       };

//       onPlacesChange = ({ lat, lng }) =>
//         this.setState(({ searchState }) => ({
//           searchState: {
//             ...searchState,
//             boundingBox: undefined,
//             aroundLatLng: {
//               lat,
//               lng,
//             },
//           },
//         }));

//       onSearchStateChange = searchState =>
//         this.setState(() => ({
//           searchState,
//         }));

//       render() {
//         const { searchState } = this.state;
//         const { aroundLatLng } = searchState;

//         return (
//           <WrapWithHits
//             linkedStoryGroup="GeoSearch"
//             indexName="airbnb"
//             searchState={searchState}
//             onSearchStateChange={this.onSearchStateChange}
//             searchParameters={{
//               hitsPerPage: 25,
//               aroundRadius: radius,
//               ...(aroundLatLng && {
//                 aroundLatLng: `${aroundLatLng.lat},${aroundLatLng.lng}`,
//               }),
//             }}
//           >
//             <Places
//               onChange={this.onPlacesChange}
//               defaultRefinement={{
//                 lat: 37.7793,
//                 lng: -122.419,
//               }}
//             />

//             <GeoSearch
//               googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
//               loadingElement={<div style={{ height: `100%` }} />}
//               containerElement={<div style={{ height: `500px` }} />}
//               mapElement={<div style={{ height: `100%` }} />}
//             />
//           </WrapWithHits>
//         );
//       }
//     }

//     return <App />;
//   },
//   {
//     displayName,
//     filterProps,
//   }
// );

// // Only UI
// stories
//   .addWithJSX(
//     'with control & refine on map move',
//     () => (
//       <WrapWithHits
//         linkedStoryGroup="GeoSearch"
//         indexName="airbnb"
//         searchParameters={{
//           hitsPerPage: 25,
//         }}
//       >
//         <Configure aroundLatLngViaIP />

//         <GeoSearch
//           googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
//           loadingElement={<div style={{ height: `100%` }} />}
//           containerElement={<div style={{ height: `500px` }} />}
//           mapElement={<div style={{ height: `100%` }} />}
//           enableRefineControl
//           enableRefineOnMapMove
//         />
//       </WrapWithHits>
//     ),
//     {
//       displayName,
//       filterProps,
//     }
//   )
//   .addWithJSX(
//     'with control & disable refine on map move',
//     () => (
//       <WrapWithHits
//         linkedStoryGroup="GeoSearch"
//         indexName="airbnb"
//         searchParameters={{
//           hitsPerPage: 25,
//         }}
//       >
//         <Configure aroundLatLngViaIP />

//         <GeoSearch
//           googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
//           loadingElement={<div style={{ height: `100%` }} />}
//           containerElement={<div style={{ height: `500px` }} />}
//           mapElement={<div style={{ height: `100%` }} />}
//           enableRefineOnMapMove={false}
//           enableRefineControl
//         />
//       </WrapWithHits>
//     ),
//     {
//       displayName,
//       filterProps,
//     }
//   )
//   .addWithJSX(
//     'without control & refine on map move',
//     () => (
//       <WrapWithHits
//         linkedStoryGroup="GeoSearch"
//         indexName="airbnb"
//         searchParameters={{
//           hitsPerPage: 25,
//         }}
//       >
//         <Configure aroundLatLngViaIP />

//         <GeoSearch
//           googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
//           loadingElement={<div style={{ height: `100%` }} />}
//           containerElement={<div style={{ height: `500px` }} />}
//           mapElement={<div style={{ height: `100%` }} />}
//           enableRefineControl={false}
//           enableRefineOnMapMove
//         />
//       </WrapWithHits>
//     ),
//     {
//       displayName,
//       filterProps,
//     }
//   )
//   .addWithJSX(
//     'without control & disable refine on map move',
//     () => (
//       <WrapWithHits
//         linkedStoryGroup="GeoSearch"
//         indexName="airbnb"
//         searchParameters={{
//           hitsPerPage: 25,
//         }}
//       >
//         <Configure aroundLatLngViaIP />

//         <GeoSearch
//           googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
//           loadingElement={<div style={{ height: `100%` }} />}
//           containerElement={<div style={{ height: `500px` }} />}
//           mapElement={<div style={{ height: `100%` }} />}
//           enableRefineControl={false}
//           enableRefineOnMapMove={false}
//         />
//       </WrapWithHits>
//     ),
//     {
//       displayName,
//       filterProps,
//     }
//   )
//   .addWithJSX(
//     'with CurrentRefinement',
//     () => (
//       <WrapWithHits
//         linkedStoryGroup="GeoSearch"
//         indexName="airbnb"
//         searchParameters={{
//           hitsPerPage: 25,
//         }}
//       >
//         <Configure aroundLatLngViaIP />

//         <div style={{ height: 50 }}>
//           <CurrentRefinements />
//         </div>

//         <GeoSearch
//           googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
//           loadingElement={<div style={{ height: `100%` }} />}
//           containerElement={<div style={{ height: `500px` }} />}
//           mapElement={<div style={{ height: `100%` }} />}
//         />
//       </WrapWithHits>
//     ),
//     {
//       displayName,
//       filterProps,
//     }
//   );

// stories.add('with unmount', () => {
//   class App extends Component {
//     state = {
//       isVisible: true,
//     };

//     onToggle = () =>
//       this.setState(prevState => ({
//         isVisible: !prevState.isVisible,
//       }));

//     render() {
//       const { isVisible } = this.state;

//       return (
//         <WrapWithHits
//           linkedStoryGroup="GeoSearch"
//           indexName="airbnb"
//           searchParameters={{
//             hitsPerPage: 25,
//           }}
//         >
//           <button onClick={this.onToggle}>
//             {isVisible ? 'Unmount' : 'Mount'}
//           </button>

//           <Configure aroundLatLngViaIP />

//           {isVisible && (
//             <GeoSearch
//               googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
//               loadingElement={<div style={{ height: `100%` }} />}
//               containerElement={<div style={{ height: `500px` }} />}
//               mapElement={<div style={{ height: `100%` }} />}
//             />
//           )}
//         </WrapWithHits>
//       );
//     }
//   }

//   return <App />;
// });
