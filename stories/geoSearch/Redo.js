import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

class Redo extends Component {
  static contextTypes = {
    hasMapMoveSinceLastRefine: PropTypes.bool.isRequired,
    refineWithBoudingBox: PropTypes.func.isRequired,
    setInitialRefineOnMapMove: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.context.setInitialRefineOnMapMove(false);
  }

  render() {
    const { hasMapMoveSinceLastRefine, refineWithBoudingBox } = this.context;

    return (
      <Button
        className="redo"
        onClick={() => refineWithBoudingBox()}
        disabled={!hasMapMoveSinceLastRefine}
      >
        Redo search here
      </Button>
    );
  }
}

export default Redo;
