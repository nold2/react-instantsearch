import createConnector from '../core/createConnector';
import { getCurrentRefinementValue } from '../core/indexUtils';

const getId = () => 'aroundLatLng';

export default createConnector({
  displayName: 'AlgoliaGeoSearch',

  getProvidedProps() {
    return {};
  },

  refine(props, searchState, nextValue) {
    const { boundingBox, ...sliceSearchState } = searchState;

    return {
      ...sliceSearchState,
      aroundLatLng: nextValue,
    };
  },

  getSearchParameters(searchParameters, props, searchState) {
    const currentRefinement = getCurrentRefinementValue(
      props,
      searchState,
      this.context,
      getId()
    );

    return searchParameters
      .setQueryParameter('insideBoundingBox')
      .setQueryParameter(
        'aroundLatLng',
        `${currentRefinement.lat}, ${currentRefinement.lng}`
      );
  },
});
