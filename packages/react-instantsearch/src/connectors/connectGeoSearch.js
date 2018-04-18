import createConnector from '../core/createConnector';
import {
  getResults,
  getCurrentRefinementValue,
  getIndex,
  refineValue,
  cleanUpValue,
} from '../core/indexUtils';

/**
 * The GeoSearch connector provides the logic to build a widget that will display the results on a map.
 * It also provides a way to search for results based on their position. The connector provides function to manage the search experience (search on map interaction).
 * @name connectGeoSearch
 * @kind connector
 * @requirements Note that the GeoSearch connector uses the [geosearch](https://www.algolia.com/doc/guides/searching/geo-search) capabilities of Algolia.
 * Your hits **must** have a `_geoloc` attribute in order to be passed to the rendering function.
 * Currently, the feature is not compatible with multiple values in the `_geoloc` attribute.
 * @propType {{ northEast: { lat: number, lng: number }, southWest: { lat: number, lng: number } }} [defaultRefinement] - Default search state of the widget containing the bounds for the map
 * @providedPropType {function({ northEast: { lat: number, lng: number }, southWest: { lat: number, lng: number } })} refine - a function to toggle the refinement
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 * @providedPropType {array.<object>} hits - the records that matched the search
 * @providedPropType {boolean} isRefinedWithMap - true if the current refinement is set with the map bounds
 * @providedPropType {{ northEast: { lat: number, lng: number }, southWest: { lat: number, lng: number } }} [currentRefinement] - the refinement currently applied
 * @providedPropType {{ lat: number, lng: number }} [position] - the position of the search
 */

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
