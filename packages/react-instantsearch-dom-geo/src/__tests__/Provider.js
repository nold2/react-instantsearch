import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider, STATE_CONTEXT } from '../Provider';

Enzyme.configure({ adapter: new Adapter() });

describe('Provider', () => {
  const defaultProps = {
    hits: [],
    position: null,
    currentRefinement: null,
    isRefinedWithMap: false,
    refine: () => {},
  };

  const lastRenderArgs = fn => fn.mock.calls[fn.mock.calls.length - 1][0];

  it('expect to call children with props', () => {
    const children = jest.fn(x => x);

    const props = {
      ...defaultProps,
    };

    shallow(<Provider {...props}>{children}</Provider>);

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith({
      hits: [],
      position: null,
      currentRefinement: null,
      isRefinedWithMap: false,
      hasMapMoveSinceLastRefine: false,
      setMapMoveSinceLastRefine: expect.any(Function),
      refine: expect.any(Function),
    });
  });

  describe('setMapMoveSinceLastRefine', () => {
    it('expect to update the state with the given value', () => {
      const children = jest.fn(x => x);

      const props = {
        ...defaultProps,
      };

      const wrapper = shallow(<Provider {...props}>{children}</Provider>);

      lastRenderArgs(children).setMapMoveSinceLastRefine(true);

      expect(wrapper.state().hasMapMoveSinceLastRefine).toBe(true);
    });

    it('expect to only update the state when the given is different', () => {
      const children = jest.fn(x => x);

      const props = {
        ...defaultProps,
      };

      shallow(<Provider {...props}>{children}</Provider>);

      expect(children).toHaveBeenCalledTimes(1);
      expect(children).toHaveBeenLastCalledWith(
        expect.objectContaining({
          hasMapMoveSinceLastRefine: false,
        })
      );

      lastRenderArgs(children).setMapMoveSinceLastRefine(true);

      expect(children).toHaveBeenCalledTimes(2);
      expect(children).toHaveBeenLastCalledWith(
        expect.objectContaining({
          hasMapMoveSinceLastRefine: true,
        })
      );

      lastRenderArgs(children).setMapMoveSinceLastRefine(true);

      expect(children).toHaveBeenCalledTimes(2);
      expect(children).toHaveBeenLastCalledWith(
        expect.objectContaining({
          hasMapMoveSinceLastRefine: true,
        })
      );
    });
  });

  describe('context', () => {
    it('expect to expose hasMapMoveSinceLastRefine & setMapMoveSinceLastRefine', () => {
      const children = jest.fn(x => x);

      const props = {
        ...defaultProps,
      };

      const wrapper = shallow(<Provider {...props}>{children}</Provider>);

      expect(wrapper.instance().getChildContext()).toEqual({
        [STATE_CONTEXT]: expect.objectContaining({
          hasMapMoveSinceLastRefine: false,
          setMapMoveSinceLastRefine: expect.any(Function),
        }),
      });
    });
  });
});
