import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const Clear = (_, { isRefinedWithMap, refine }) =>
  isRefinedWithMap && (
    <Button className="clear" onClick={() => refine()}>
      Clear the map refinement
    </Button>
  );

Clear.contextTypes = {
  refine: PropTypes.func.isRequired,
  isRefinedWithMap: PropTypes.bool.isRequired,
};

export default Clear;
