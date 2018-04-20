import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const Redo = (_, { hasMapMoveSinceLastRefine, refineWithBoudingBox }) => (
  <Button
    className="redo"
    onClick={() => refineWithBoudingBox()}
    disabled={!hasMapMoveSinceLastRefine}
  >
    Redo search here
  </Button>
);

Redo.contextTypes = {
  refineWithBoudingBox: PropTypes.func.isRequired,
  hasMapMoveSinceLastRefine: PropTypes.bool.isRequired,
};

export default Redo;
