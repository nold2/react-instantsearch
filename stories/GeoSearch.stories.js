import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import injectScript from 'scriptjs';
import { setAddon, storiesOf } from '@storybook/react';
import {
  Configure,
  CurrentRefinements,
} from '../packages/react-instantsearch/dom';
import { GeoSearch, Marker, Clear, Redo, Control } from './geoSearch';
import Places from './geoSearch/Places';
import { displayName, filterProps, WrapWithHits } from './util';
import JSXAddon from 'storybook-addon-jsx';

setAddon(JSXAddon);

const stories = storiesOf('GeoSearch', module);

const position = '37.7793, -122.419';
const radius = 5000;
const precision = 2500;

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
        this.setState(() => ({
          google: window.google,
        }));
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
            <GeoSearch google={google}>
              {({ hits }) => (
                <Fragment>
                  <Clear />

                  {hits.map(hit => (
                    <Marker
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

        <div style={{ height: 500 }}>
          <GoogleMapsLoader>
            {google => (
              <GeoSearch google={google}>
                {({ hits }) => (
                  <Fragment>
                    <Clear />

                    {hits.map(hit => (
                      <Marker
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

        <div style={{ height: 500 }}>
          <GoogleMapsLoader>
            {google => (
              <GeoSearch google={google}>
                {({ hits }) => (
                  <Fragment>
                    <Clear />

                    {hits.map(hit => (
                      <Marker
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

        <div style={{ height: 500 }}>
          <GoogleMapsLoader>
            {google => (
              <GeoSearch google={google}>
                {({ hits }) => (
                  <Fragment>
                    <Clear />

                    {hits.map(hit => (
                      <Marker
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

// // With Position
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

        <div style={{ height: 500 }}>
          <GoogleMapsLoader>
            {google => (
              <GeoSearch google={google}>
                {({ hits }) => (
                  <Fragment>
                    <Clear />

                    {hits.map(hit => (
                      <Marker
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

        <div style={{ height: 500 }}>
          <GoogleMapsLoader>
            {google => (
              <GeoSearch google={google}>
                {({ hits }) => (
                  <Fragment>
                    <Clear />

                    {hits.map(hit => (
                      <Marker
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

        <div style={{ height: 500 }}>
          <GoogleMapsLoader>
            {google => (
              <GeoSearch google={google}>
                {({ hits }) => (
                  <Fragment>
                    <Clear />

                    {hits.map(hit => (
                      <Marker
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

// With Places
stories.addWithJSX(
  'with Places',
  () => (
    <WrapWithHits
      linkedStoryGroup="GeoSearch"
      indexName="airbnb"
      searchParameters={{
        hitsPerPage: 25,
      }}
    >
      <Places
        defaultRefinement={{
          lat: 37.7793,
          lng: -122.419,
        }}
      />

      <div style={{ height: 500 }}>
        <GoogleMapsLoader>
          {google => (
            <GeoSearch google={google}>
              {({ hits }) => (
                <Fragment>
                  <Control />

                  {hits.map(hit => (
                    <Marker
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

// // Only UI
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

        <div style={{ height: 500 }}>
          <GoogleMapsLoader>
            {google => (
              <GeoSearch google={google}>
                {({ hits }) => (
                  <Fragment>
                    <Control />
                    <Clear />

                    {hits.map(hit => (
                      <Marker
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

        <div style={{ height: 500 }}>
          <GoogleMapsLoader>
            {google => (
              <GeoSearch google={google}>
                {({ hits }) => (
                  <Fragment>
                    <Control defaultValue={false} />
                    <Clear />

                    {hits.map(hit => (
                      <Marker
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

        <div style={{ height: 500 }}>
          <GoogleMapsLoader>
            {google => (
              <GeoSearch google={google}>
                {({ hits }) => (
                  <Fragment>
                    {hits.map(hit => (
                      <Marker
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

        <div style={{ height: 500 }}>
          <GoogleMapsLoader>
            {google => (
              <GeoSearch google={google}>
                {({ hits }) => (
                  <Fragment>
                    <Redo />
                    <Clear />

                    {hits.map(hit => (
                      <Marker
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
  )
  .addWithJSX(
    'with CurrentRefinement',
    () => (
      <WrapWithHits
        linkedStoryGroup="GeoSearch"
        indexName="airbnb"
        searchParameters={{
          hitsPerPage: 25,
        }}
      >
        <Configure aroundLatLngViaIP />

        <div style={{ height: 50 }}>
          <CurrentRefinements />
        </div>

        <div style={{ height: 500 }}>
          <GoogleMapsLoader>
            {google => (
              <GeoSearch google={google}>
                {({ hits }) => (
                  <Fragment>
                    <Clear />

                    {hits.map(hit => (
                      <Marker
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

// Unmount
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
            <div style={{ height: 500 }}>
              <GoogleMapsLoader>
                {google => (
                  <GeoSearch google={google}>
                    {({ hits }) => (
                      <Fragment>
                        <Clear />

                        {hits.map(hit => (
                          <Marker
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
          )}
        </WrapWithHits>
      );
    }
  }

  return <App />;
});
