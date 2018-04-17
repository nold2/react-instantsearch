import React, { Component } from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import { GeoSearch, Configure } from '../packages/react-instantsearch/dom';
import { displayName, filterProps, WrapWithHits } from './util';
import JSXAddon from 'storybook-addon-jsx';

setAddon(JSXAddon);

const stories = storiesOf('GeoSearch', module);

const position = '37.7793, -122.419';
const radius = 5000;
const precision = 2500;

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

      <GeoSearch
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `500px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </WrapWithHits>
  ),
  {
    displayName,
    filterProps,
  }
);

// With IP
stories
  .addWithJSX(
    'with IP',
    () => (
      <WrapWithHits
        linkedStoryGroup="GeoSearch"
        indexName="airbnb"
        searchParameters={{
          hitsPerPage: 25,
        }}
      >
        <Configure aroundLatLngViaIP />

        <GeoSearch
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `500px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </WrapWithHits>
    ),
    {
      displayName,
      filterProps,
    }
  )
  .addWithJSX(
    'with IP & radius',
    () => (
      <WrapWithHits
        linkedStoryGroup="GeoSearch"
        indexName="airbnb"
        searchParameters={{
          hitsPerPage: 25,
        }}
      >
        <Configure aroundLatLngViaIP aroundRadius={radius} />

        <GeoSearch
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `500px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </WrapWithHits>
    ),
    {
      displayName,
      filterProps,
    }
  )
  .addWithJSX(
    'with IP & radius & precision',
    () => (
      <WrapWithHits
        linkedStoryGroup="GeoSearch"
        indexName="airbnb"
        searchParameters={{
          hitsPerPage: 25,
        }}
      >
        <Configure
          aroundLatLngViaIP
          aroundRadius={radius}
          aroundPrecision={precision}
        />

        <GeoSearch
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `500px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </WrapWithHits>
    ),
    {
      displayName,
      filterProps,
    }
  );

// With Position
stories
  .addWithJSX(
    'with position',
    () => (
      <WrapWithHits
        linkedStoryGroup="GeoSearch"
        indexName="airbnb"
        searchParameters={{
          hitsPerPage: 25,
        }}
      >
        <Configure aroundLatLng={position} />

        <GeoSearch
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `500px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </WrapWithHits>
    ),
    {
      displayName,
      filterProps,
    }
  )
  .addWithJSX(
    'with position & radius',
    () => (
      <WrapWithHits
        linkedStoryGroup="GeoSearch"
        indexName="airbnb"
        searchParameters={{
          hitsPerPage: 25,
        }}
      >
        <Configure aroundLatLng={position} aroundRadius={radius} />

        <GeoSearch
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `500px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </WrapWithHits>
    ),
    {
      displayName,
      filterProps,
    }
  )
  .addWithJSX(
    'with position & radius & precision',
    () => (
      <WrapWithHits
        linkedStoryGroup="GeoSearch"
        indexName="airbnb"
        searchParameters={{
          hitsPerPage: 25,
        }}
      >
        <Configure
          aroundLatLng={position}
          aroundRadius={radius}
          aroundPrecision={precision}
        />

        <GeoSearch
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `500px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </WrapWithHits>
    ),
    {
      displayName,
      filterProps,
    }
  );

// With Places @TODO
stories.addWithJSX('with Places', () => <div>TODO</div>, {
  displayName,
  filterProps,
});

// Only UI
stories
  .addWithJSX(
    'with control & refine on map move',
    () => (
      <WrapWithHits
        linkedStoryGroup="GeoSearch"
        indexName="airbnb"
        searchParameters={{
          hitsPerPage: 25,
        }}
      >
        <Configure aroundLatLngViaIP />

        <GeoSearch
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `500px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          enableRefineControl
          enableRefineOnMapMove
        />
      </WrapWithHits>
    ),
    {
      displayName,
      filterProps,
    }
  )
  .addWithJSX(
    'with control & disable refine on map move',
    () => (
      <WrapWithHits
        linkedStoryGroup="GeoSearch"
        indexName="airbnb"
        searchParameters={{
          hitsPerPage: 25,
        }}
      >
        <Configure aroundLatLngViaIP />

        <GeoSearch
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `500px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          enableRefineOnMapMove={false}
          enableRefineControl
        />
      </WrapWithHits>
    ),
    {
      displayName,
      filterProps,
    }
  )
  .addWithJSX(
    'without control & refine on map move',
    () => (
      <WrapWithHits
        linkedStoryGroup="GeoSearch"
        indexName="airbnb"
        searchParameters={{
          hitsPerPage: 25,
        }}
      >
        <Configure aroundLatLngViaIP />

        <GeoSearch
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `500px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          enableRefineControl={false}
          enableRefineOnMapMove
        />
      </WrapWithHits>
    ),
    {
      displayName,
      filterProps,
    }
  )
  .addWithJSX(
    'without control & disable refine on map move',
    () => (
      <WrapWithHits
        linkedStoryGroup="GeoSearch"
        indexName="airbnb"
        searchParameters={{
          hitsPerPage: 25,
        }}
      >
        <Configure aroundLatLngViaIP />

        <GeoSearch
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `500px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          enableRefineControl={false}
          enableRefineOnMapMove={false}
        />
      </WrapWithHits>
    ),
    {
      displayName,
      filterProps,
    }
  );

stories.add('with unmount', () => {
  class App extends Component {
    state = {
      isVisible: true,
    };

    onToggle = () =>
      this.setState(prevState => ({
        isVisible: !prevState.isVisible,
      }));

    render() {
      const { isVisible } = this.state;

      return (
        <WrapWithHits
          linkedStoryGroup="GeoSearch"
          indexName="airbnb"
          searchParameters={{
            hitsPerPage: 25,
          }}
        >
          <button onClick={this.onToggle}>
            {isVisible ? 'Unmount' : 'Mount'}
          </button>

          <Configure aroundLatLngViaIP />

          {isVisible && (
            <GeoSearch
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyCl2TTJXpwxGuuc2zQZkAlIkWhpYbyjjP8"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `500px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
          )}
        </WrapWithHits>
      );
    }
  }

  return <App />;
});
