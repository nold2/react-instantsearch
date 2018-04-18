import PropTypes from 'prop-types';
import createConnector from '../core/createConnector';
import {
  getResults,
  getCurrentRefinementValue,
  getIndex,
  refineValue,
  cleanUpValue,
} from '../core/indexUtils';

// To control the map with an external widget the other widget
// **must** write the value in the attribute `aroundLatLng`
const getBoundingBoxId = () => 'boundingBox';
const getAroundLatLngId = () => 'aroundLatLng';

const getRefinement = id => (props, searchState, context) =>
  getCurrentRefinementValue(props, searchState, context, id);

const getCurrentRefinement = getRefinement(getBoundingBoxId());
const getCurrentPosition = getRefinement(getAroundLatLngId());

const refine = (searchState, nextValue, context) => {
  const resetPage = true;
  const nextRefinement = {
    [getBoundingBoxId()]: nextValue,
  };

  return refineValue(searchState, nextRefinement, context, resetPage);
};

const currentRefinementToString = currentRefinement =>
  [
    currentRefinement.northEast.lat,
    currentRefinement.northEast.lng,
    currentRefinement.southWest.lat,
    currentRefinement.southWest.lng,
  ].join();

export default createConnector({
  displayName: 'AlgoliaGeoSearch',

  propTypes: {
    enableRefineOnMapMove: PropTypes.bool,
  },

  defaultProps: {
    enableRefineOnMapMove: true,
  },

  getProvidedProps(props, searchState, searchResults) {
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
      currentRefinement,
      isRefinedWithMap,
    };
  },

  refine(props, searchState, nextValue) {
    return refine(searchState, nextValue, this.context);
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
      currentRefinementToString(currentRefinement)
    );
  },

  cleanUp(props, searchState) {
    return cleanUpValue(searchState, this.context, getBoundingBoxId());
  },

  getMetadata(props, searchState) {
    const items = [];
    const id = getBoundingBoxId();
    const index = getIndex(this.context);
    const currentRefinement = getCurrentRefinement(
      props,
      searchState,
      this.context
    );

    if (currentRefinement) {
      items.push({
        label: `${id}: ${currentRefinementToString(currentRefinement)}`,
        value: nextState => refine(nextState, undefined, this.context),
        currentRefinement,
      });
    }

    return {
      id,
      index,
      items,
    };
  },
});
