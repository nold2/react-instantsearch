import { SearchResults, SearchParameters } from 'algoliasearch-helper';
import connector from './connectGeoSearch';

jest.mock('../core/createConnector');

describe('connectGeoSearch', () => {
  const empty = {};

  const defaultProps = {
    enableRefineOnMapMove: true,
  };

  const defaultSearchState = {};

  const createProps = (props = {}) => ({
    ...defaultProps,
    ...props,
  });

  const createSearchState = (searchState = {}) => ({
    ...defaultSearchState,
    ...searchState,
  });

  const createSingleIndexInstance = () => ({
    context: {
      ais: {
        mainTargetedIndex: 'index',
      },
    },
  });

  const createSearchResults = (hits = [], state) => ({
    results: new SearchResults(new SearchParameters(state), [
      {
        hits,
      },
    ]),
  });

  describe('getInitialUiState', () => {
    it('expect to return the default initial uiState', () => {
      const props = createProps();

      const actual = connector.getInitialUiState(props);

      const expectation = {
        isRefineOnMapMove: true,
        hasMapMoveSinceLastRefine: false,
      };

      expect(actual).toEqual(expectation);
    });

    it('expect to return the initial uiState when enableRefineOnMapMove is false', () => {
      const props = createProps({
        enableRefineOnMapMove: false,
      });

      const actual = connector.getInitialUiState(props);

      const expectation = {
        isRefineOnMapMove: false,
        hasMapMoveSinceLastRefine: false,
      };

      expect(actual).toEqual(expectation);
    });
  });

  describe('getProvidedProps', () => {
    it('expect to return default provided props', () => {
      const instance = createSingleIndexInstance();
      const props = createProps();
      const searchState = createSearchState();
      const searchResults = empty;
      const metadata = empty;
      const searchForFacetValuesResults = empty;
      const uiState = connector.getInitialUiState(props);
      const setUiState = () => {};

      const actual = connector.getProvidedProps.call(
        instance,
        props,
        searchState,
        searchResults,
        metadata,
        searchForFacetValuesResults,
        uiState,
        setUiState
      );

      const expectation = {
        hits: [],
        position: null,
        currentRefinement: null, // @TODO
        isRefinedWithMap: false,
        isRefineOnMapMove: true,
        toggleRefineOnMapMove: expect.any(Function),
        hasMapMoveSinceLastRefine: false,
        setMapMoveSinceLastRefine: expect.any(Function),
      };

      expect(actual).toEqual(expectation);
    });

    describe('hits', () => {
      it('expect to return hits when we have results', () => {
        const hits = [
          { objectID: '123', _geoloc: true },
          { objectID: '456', _geoloc: true },
          { objectID: '789', _geoloc: true },
        ];

        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults(hits);
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        const expectation = [
          { objectID: '123', _geoloc: true },
          { objectID: '456', _geoloc: true },
          { objectID: '789', _geoloc: true },
        ];

        expect(actual.hits).toEqual(expectation);
      });

      it('expect to return hits with only "_geoloc" when we have results', () => {
        const hits = [
          { objectID: '123', _geoloc: true },
          { objectID: '456', _geoloc: false },
          { objectID: '789', _geoloc: true },
        ];

        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults(hits);
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        const expectation = [
          { objectID: '123', _geoloc: true },
          { objectID: '789', _geoloc: true },
        ];

        expect(actual.hits).toEqual(expectation);
      });

      it("expect to return empty hits when we don't have results", () => {
        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = empty;
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        const expectation = [];

        expect(actual.hits).toEqual(expectation);
      });
    });

    describe('position', () => {
      it('expect to return the position from the searchState', () => {
        const aroundLatLng = {
          lat: 10,
          lng: 12,
        };

        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState({ aroundLatLng });
        const searchResults = createSearchResults();
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(actual.position).toEqual({
          lat: 10,
          lng: 12,
        });
      });

      it('expect to return null from an empty searchState', () => {
        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults();
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(actual.position).toBe(null);
      });
    });

    describe('currentRefinement', () => {
      it('expect to return the boundingBox from the searchState', () => {
        const boundingBox = {
          northEast: {
            lat: 10,
            lng: 12,
          },
          southWest: {
            lat: 12,
            lng: 14,
          },
        };

        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState({ boundingBox });
        const searchResults = createSearchResults();
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(actual.currentRefinement).toEqual({
          northEast: {
            lat: 10,
            lng: 12,
          },
          southWest: {
            lat: 12,
            lng: 14,
          },
        });
      });

      it('expect to return an null from an empty searchState', () => {
        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults();
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(actual.currentRefinement).toBe(null);
      });
    });

    describe('isRefinedWithMap', () => {
      it("expect to return true when it's refined with the map (from the searchState)", () => {
        const hits = [
          { objectID: '123', _geoloc: true },
          { objectID: '456', _geoloc: true },
          { objectID: '789', _geoloc: true },
        ];

        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState({
          boundingBox: '10, 12, 12, 14',
        });
        const searchResults = createSearchResults(hits);
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(actual.isRefinedWithMap).toBe(true);
      });

      it("expect to return true when it's refined with the map (from the searchParameters)", () => {
        const sliceSearchParameters = {
          insideBoundingBox: '10, 12, 12, 14',
        };

        const hits = [
          { objectID: '123', _geoloc: true },
          { objectID: '456', _geoloc: true },
          { objectID: '789', _geoloc: true },
        ];

        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults(hits, sliceSearchParameters);
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(actual.isRefinedWithMap).toBe(true);
      });

      it("expect to return false when it's not refined with the map", () => {
        const hits = [
          { objectID: '123', _geoloc: true },
          { objectID: '456', _geoloc: true },
          { objectID: '789', _geoloc: true },
        ];

        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults(hits);
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(actual.isRefinedWithMap).toBe(false);
      });
    });

    describe('isRefineOnMapMove', () => {
      it('expect to return true when refine on map move is enabled', () => {
        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults();
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(actual.isRefineOnMapMove).toEqual(true);
      });

      it('expect to return false when refine on map move is disabled', () => {
        const instance = createSingleIndexInstance();
        const props = createProps({ enableRefineOnMapMove: false });
        const searchState = createSearchState();
        const searchResults = createSearchResults();
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(actual.isRefineOnMapMove).toEqual(false);
      });
    });

    describe('toggleRefineOnMapMove', () => {
      it('expect to set the value to false when the previous value is true', () => {
        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults();
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = fn => fn(uiState);

        const providedProps = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(providedProps.isRefineOnMapMove).toEqual(true);

        const actual = providedProps.toggleRefineOnMapMove();

        expect(actual.isRefineOnMapMove).toEqual(false);
      });

      it('expect to set the value to true when the previous value is false', () => {
        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults();
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = {
          ...connector.getInitialUiState(props),
          isRefineOnMapMove: false,
        };
        const setUiState = fn => fn(uiState);

        const providedProps = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(providedProps.isRefineOnMapMove).toEqual(false);

        const actual = providedProps.toggleRefineOnMapMove();

        expect(actual.isRefineOnMapMove).toEqual(true);
      });
    });

    describe('hasMapMoveSinceLastRefine', () => {
      it('expect to return true when the map has moved since last refine', () => {
        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults();
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = {
          ...connector.getInitialUiState(props),
          hasMapMoveSinceLastRefine: true,
        };
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(actual.hasMapMoveSinceLastRefine).toEqual(true);
      });

      it("expect to return false when the map hasn't moved since last refine", () => {
        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults();
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = () => {};

        const actual = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(actual.hasMapMoveSinceLastRefine).toEqual(false);
      });
    });

    describe('setMapMoveSinceLastRefine', () => {
      it('expect to return true when the given value is true', () => {
        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults();
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = connector.getInitialUiState(props);
        const setUiState = fn => fn(uiState);

        const providedProps = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(providedProps.hasMapMoveSinceLastRefine).toBe(false);

        const actual = providedProps.setMapMoveSinceLastRefine(true);

        expect(actual.hasMapMoveSinceLastRefine).toBe(true);
      });

      it('expect to return false when the given value is false', () => {
        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults();
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = {
          ...connector.getInitialUiState(props),
          hasMapMoveSinceLastRefine: true,
        };
        const setUiState = fn => fn(uiState);

        const providedProps = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(providedProps.hasMapMoveSinceLastRefine).toBe(true);

        const actual = providedProps.setMapMoveSinceLastRefine(false);

        expect(actual.hasMapMoveSinceLastRefine).toBe(false);
      });

      it('expect to return null when the given value is equal to the previous one', () => {
        const instance = createSingleIndexInstance();
        const props = createProps();
        const searchState = createSearchState();
        const searchResults = createSearchResults();
        const metadata = empty;
        const searchForFacetValuesResults = empty;
        const uiState = {
          ...connector.getInitialUiState(props),
          hasMapMoveSinceLastRefine: true,
        };
        const setUiState = fn => fn(uiState);

        const providedProps = connector.getProvidedProps.call(
          instance,
          props,
          searchState,
          searchResults,
          metadata,
          searchForFacetValuesResults,
          uiState,
          setUiState
        );

        expect(providedProps.hasMapMoveSinceLastRefine).toBe(true);

        const actual = providedProps.setMapMoveSinceLastRefine(true);

        expect(actual).toBe(null);
      });
    });
  });

  describe('refine', () => {
    it('expect to set the boundingBox when boundingBox is provided', () => {
      const instance = createSingleIndexInstance();
      const props = createProps();
      const searchState = createSearchState();
      const nextRefinement = {
        northEast: {
          lat: 10,
          lng: 12,
        },
        southWest: {
          lat: 12,
          lng: 14,
        },
      };

      const actual = connector.refine.call(
        instance,
        props,
        searchState,
        nextRefinement
      );

      const expectation = {
        page: 1,
        boundingBox: {
          northEast: {
            lat: 10,
            lng: 12,
          },
          southWest: {
            lat: 12,
            lng: 14,
          },
        },
      };

      expect(actual).toEqual(expectation);
    });

    it('expect to replace the previous value when boundingBox is provided', () => {
      const instance = createSingleIndexInstance();
      const props = createProps();
      const searchState = createSearchState({
        boundingBox: {
          northEast: {
            lat: 8,
            lng: 10,
          },
          southWest: {
            lat: 10,
            lng: 12,
          },
        },
      });

      const nextRefinement = {
        northEast: {
          lat: 10,
          lng: 12,
        },
        southWest: {
          lat: 12,
          lng: 14,
        },
      };

      const actual = connector.refine.call(
        instance,
        props,
        searchState,
        nextRefinement
      );

      const expectation = {
        page: 1,
        boundingBox: {
          northEast: {
            lat: 10,
            lng: 12,
          },
          southWest: {
            lat: 12,
            lng: 14,
          },
        },
      };

      expect(actual).toEqual(expectation);
    });

    it('expect to clear the previous value when boundingBox is omit', () => {
      const instance = createSingleIndexInstance();
      const props = createProps();
      const searchState = createSearchState({
        boundingBox: {
          northEast: {
            lat: 8,
            lng: 10,
          },
          southWest: {
            lat: 10,
            lng: 12,
          },
        },
      });

      const actual = connector.refine.call(instance, props, searchState);

      const expectation = {
        page: 1,
      };

      expect(actual).toEqual(expectation);
    });
  });

  describe('getSearchParameters', () => {
    it('expect to set the paremeter "insideBoundingBox" when boundingBox is provided', () => {
      const instance = createSingleIndexInstance();
      const searchParameters = new SearchParameters();
      const props = createProps();
      const searchState = createSearchState({
        boundingBox: {
          northEast: {
            lat: 10,
            lng: 12,
          },
          southWest: {
            lat: 12,
            lng: 14,
          },
        },
      });

      const actual = connector.getSearchParameters.call(
        instance,
        searchParameters,
        props,
        searchState
      );

      const expectation = '10,12,12,14';

      expect(actual.insideBoundingBox).toEqual(expectation);
    });

    it('expect to return the given searchParameters when boundingBox is omit', () => {
      const instance = createSingleIndexInstance();
      const searchParameters = new SearchParameters();
      const props = createProps();
      const searchState = createSearchState();

      const actual = connector.getSearchParameters.call(
        instance,
        searchParameters,
        props,
        searchState
      );

      expect(actual).toEqual(searchParameters);
    });
  });

  describe('cleanUp', () => {
    it('expect to remove the refinement from the searchState when boundingBox is provided', () => {
      const instance = createSingleIndexInstance();
      const props = createProps();
      const searchState = createSearchState({
        query: 'studio',
        boundingBox: {
          northEast: {
            lat: 10,
            lng: 12,
          },
          southWest: {
            lat: 12,
            lng: 14,
          },
        },
      });

      const actual = connector.cleanUp.call(instance, props, searchState);

      const expectation = {
        query: 'studio',
      };

      expect(actual).toEqual(expectation);
    });

    it('expect to return the given searchState when boundingBox is omit', () => {
      const instance = createSingleIndexInstance();
      const props = createProps();
      const searchState = createSearchState({
        query: 'studio',
      });

      const actual = connector.cleanUp.call(instance, props, searchState);

      const expectation = {
        query: 'studio',
      };

      expect(actual).toEqual(expectation);
    });
  });
});
