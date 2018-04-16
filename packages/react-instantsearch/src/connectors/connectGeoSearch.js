import createConnector from '../core/createConnector';

export default createConnector({
  getInitialUiState({ enableRefineOnMapMove }) {
    return {
      isRefineOnMapMove: enableRefineOnMapMove,
      hasMapMoveSinceLastRefine: false,
    };
  },
});
