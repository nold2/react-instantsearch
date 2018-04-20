import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const Clear = (_, { isRefinedWithMap, refineWithoutBoundingBox }) =>
  isRefinedWithMap && (
    <Button className="clear" onClick={() => refineWithoutBoundingBox()}>
      Clear the map refinement
    </Button>
  );

Clear.contextTypes = {
  refineWithoutBoundingBox: PropTypes.func.isRequired,
  isRefinedWithMap: PropTypes.bool.isRequired,
};

export default Clear;
