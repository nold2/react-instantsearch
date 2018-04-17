import PropTypes from 'prop-types';
import createConnector from '../core/createConnector';
import {
  getResults,
  getCurrentRefinementValue,
  refineValue,
} from '../core/indexUtils';

const getBoundingBoxId = () => 'boundingBox';

// To control the map with an external widget the other widget
// must write the value in the attribute `aroundLatLng`
const getAroundLatLngId = () => 'aroundLatLng';

const getCurrentRefinement = (props, searchState, context) =>
  getCurrentRefinementValue(
    props,
    searchState,
    context,
    getBoundingBoxId(),
    null,
    x => x
  );

const getCurrentPosition = (props, searchState, context) =>
  getCurrentRefinementValue(
    props,
    searchState,
    context,
    getAroundLatLngId(),
    null,
    x => x
  );

const toggleRefineOnMapMove = update => () =>
  update(prevState => ({
    isRefineOnMapMove: !prevState.isRefineOnMapMove,
  }));

const setMapMoveSinceLastRefine = update => value =>
  update(({ hasMapMoveSinceLastRefine }) => {
    // Prevent rendering when the map has moved
    if (hasMapMoveSinceLastRefine === value) {
      return null;
    }

    return {
      hasMapMoveSinceLastRefine: value,
    };
  });

export default createConnector({
  displayName: 'AlgoliaGeoSearch',

  propTypes: {
    enableRefineOnMapMove: PropTypes.bool,
  },

  defaultProps: {
    enableRefineOnMapMove: true,
  },

  getInitialUiState({ enableRefineOnMapMove }) {
    return {
      isRefineOnMapMove: enableRefineOnMapMove,
      hasMapMoveSinceLastRefine: false,
    };
  },

  getProvidedProps(
    props,
    searchState,
    searchResults,
    metadata,
    searchForFacetValuesResults,
    uiState,
    setUiState
  ) {
    const { hasMapMoveSinceLastRefine, isRefineOnMapMove } = uiState;
    const results = getResults(searchResults, this.context);

    const currentRefinement = getCurrentRefinement(
      props,
      searchState,
      this.context
    );

    const isRefinedWithMapFromSearchState = Boolean(currentRefinement);
    const isRefinedWithMapFromSearchParameters = Boolean(
      results && results._state.insideBoundingBox
    );

    const isRefinedWithMap =
      // We read it from both becuase the SearchParameters & the searchState are not always
      // in sync. When we set the refinement the searchState is used when we clear the refinement
      // the SearchParameters is used. In the first case when we render the results are not there
      // so we can't find the value from the results. The most up to date value is the searchState.
      // But whren we clear the refinement the searchState is immediatly clear even when the items
      // retrieve are still the one from the previous query with the bounding box. It leads to some
      // issue with fitBounds.
      isRefinedWithMapFromSearchState || isRefinedWithMapFromSearchParameters;

    return {
      hits: !results ? [] : results.hits.filter(_ => Boolean(_._geoloc)),
      position: getCurrentPosition(props, searchState, this.context),
      toggleRefineOnMapMove: toggleRefineOnMapMove(setUiState),
      setMapMoveSinceLastRefine: setMapMoveSinceLastRefine(setUiState),
      currentRefinement,
      isRefinedWithMap,
      isRefineOnMapMove,
      hasMapMoveSinceLastRefine,
    };
  },

  refine(props, searchState, nextValue) {
    const resetPage = true;
    const nextRefinement = {
      [getBoundingBoxId()]: nextValue,
    };

    return refineValue(searchState, nextRefinement, this.context, resetPage);
  },

  getSearchParameters(searchParameters, props, searchState) {
    const currentRefinement = getCurrentRefinement(
      props,
      searchState,
      this.context
    );

    if (!currentRefinement) {
      return searchParameters;
    }

    return searchParameters.setQueryParameter(
      'insideBoundingBox',
      [
        currentRefinement.northEast.lat,
        currentRefinement.northEast.lng,
        currentRefinement.southWest.lat,
        currentRefinement.southWest.lng,
      ].join()
    );
  },
});
