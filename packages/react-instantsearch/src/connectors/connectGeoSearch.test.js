import connector from './connectGeoSearch';

jest.mock('../core/createConnector');

describe('connectGeoSearch', () => {
  const defaultProps = {
    enableRefineOnMapMove: true,
  };

  describe('getInitialUiState', () => {
    it('expect to return the default initial uiState', () => {
      const props = {
        ...defaultProps,
      };

      const actual = connector.getInitialUiState(props);

      const expectation = {
        isRefineOnMapMove: true,
        hasMapMoveSinceLastRefine: false,
      };

      expect(actual).toEqual(expectation);
    });

    it('expect to return the initial uiState when enableRefineOnMapMove is false', () => {
      const props = {
        ...defaultProps,
        enableRefineOnMapMove: false,
      };

      const actual = connector.getInitialUiState(props);

      const expectation = {
        isRefineOnMapMove: false,
        hasMapMoveSinceLastRefine: false,
      };

      expect(actual).toEqual(expectation);
    });
  });
});
