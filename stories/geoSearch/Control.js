import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

class Control extends Component {
  static propTypes = {
    defaultValue: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    isRefineOnMapMove: PropTypes.bool.isRequired,
    hasMapMoveSinceLastRefine: PropTypes.bool.isRequired,
    refineWithBoudingBox: PropTypes.func.isRequired,
    toggleRefineOnMapMove: PropTypes.func.isRequired,
    setInitialRefineOnMapMove: PropTypes.func.isRequired,
  };

  static defaultProps = {
    defaultValue: true,
  };

  componentDidMount() {
    const { defaultValue } = this.props;
    const { setInitialRefineOnMapMove } = this.context;

    if (defaultValue === false) {
      setInitialRefineOnMapMove(defaultValue);
    }
  }

  render() {
    const {
      isRefineOnMapMove,
      hasMapMoveSinceLastRefine,
      refineWithBoudingBox,
      toggleRefineOnMapMove,
    } = this.context;

    return (
      <div>
        {!hasMapMoveSinceLastRefine || isRefineOnMapMove ? (
          <label>
            <input
              type="checkbox"
              checked={isRefineOnMapMove}
              onChange={toggleRefineOnMapMove}
            />
            Search as I move the map
          </label>
        ) : (
          <Button
            className="redo"
            onClick={() => refineWithBoudingBox()}
            disabled={!hasMapMoveSinceLastRefine}
          >
            Redo search here
          </Button>
        )}
      </div>
    );
  }
}
export default Control;
