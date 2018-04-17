import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { has, isEqual, find } from 'lodash';
import { shallowEqual, getDisplayName, removeEmptyKey } from './utils';

/**
 * @typedef {object} ConnectorDescription
 * @property {string} displayName - the displayName used by the wrapper
 * @property {function} refine - a function to filter the local state
 * @property {function} getSearchParameters - function transforming the local state to a SearchParameters
 * @property {function} getMetadata - metadata of the widget
 * @property {function} transitionState - hook after the state has changed
 * @property {function} getProvidedProps - transform the state into props passed to the wrapped component.
 * Receives (props, widgetStates, searchState, metadata) and returns the local state.
 * @property {function} getId - Receives props and return the id that will be used to identify the widget
 * @property {function} cleanUp - hook when the widget will unmount. Receives (props, searchState) and return a cleaned state.
 * @property {object} propTypes - PropTypes forwarded to the wrapped component.
 * @property {object} defaultProps - default values for the props
 */

/**
 * Connectors are the HOC used to transform React components
 * into InstantSearch widgets.
 * In order to simplify the construction of such connectors
 * `createConnector` takes a description and transform it into
 * a connector.
 * @param {ConnectorDescription} connectorDesc the description of the connector
 * @return {Connector} a function that wraps a component into
 * an instantsearch connected one.
 */
export default function createConnector(connectorDesc) {
  if (!connectorDesc.displayName) {
    throw new Error(
      '`createConnector` requires you to provide a `displayName` property.'
    );
  }

  const hasRefine = has(connectorDesc, 'refine');
  const hasSearchForFacetValues = has(connectorDesc, 'searchForFacetValues');
  const hasSearchParameters = has(connectorDesc, 'getSearchParameters');
  const hasMetadata = has(connectorDesc, 'getMetadata');
  const hasTransitionState = has(connectorDesc, 'transitionState');
  const hasCleanUp = has(connectorDesc, 'cleanUp');
  const isWidget = hasSearchParameters || hasMetadata || hasTransitionState;

  return Composed =>
    class Connector extends Component {
      static displayName = `${connectorDesc.displayName}(${getDisplayName(
        Composed
      )})`;
      static defaultClassNames = Composed.defaultClassNames;
      static propTypes = connectorDesc.propTypes;
      static defaultProps = connectorDesc.defaultProps;

      static contextTypes = {
        // @TODO: more precise state manager propType
        ais: PropTypes.object.isRequired,
        multiIndexContext: PropTypes.object,
      };

      constructor(props, context) {
        super(props, context);

        const {
          ais: { store, widgetsManager },
        } = context;
        const canRender = false;

        const initialUiState = connectorDesc.getInitialUiState
          ? connectorDesc.getInitialUiState(props)
          : {};

        this.state = {
          uiState: initialUiState,
          props: this.getProvidedProps({
            uiState: initialUiState,
            props: {
              ...props,
              canRender,
            },
          }),
          canRender, // use to know if a component is rendered (browser), or not (server).
        };

        this.unsubscribe = store.subscribe(() => {
          if (this.state.canRender) {
            this.setState(prevState => ({
              props: this.getProvidedProps({
                uiState: prevState.uiState,
                props: {
                  ...this.props,
                  canRender: prevState.canRender,
                },
              }),
            }));
          }
        });

        if (isWidget) {
          this.unregisterWidget = widgetsManager.registerWidget(this);
        }

        if (process.env.NODE_ENV === 'development') {
          const onlyGetProvidedPropsUsage = !find(
            Object.keys(connectorDesc),
            key =>
              [
                'getMetadata',
                'getSearchParameters',
                'refine',
                'cleanUp',
              ].indexOf(key) > -1
          );

          if (
            onlyGetProvidedPropsUsage &&
            connectorDesc.displayName.substr(0, 7) !== 'Algolia'
          ) {
            // eslint-disable-next-line no-console
            console.warn(
              'react-instantsearch: it seems that you are using the `createConnector` api ' +
                'only to access the `searchState` and the `searchResults` through `getProvidedProps`.' +
                'We are now provided a dedicated API' +
                ' the `connectStateResults` connector that you should use instead. The `createConnector` API will be ' +
                'soon deprecated and will break in future next major versions.' +
                '\n\n' +
                'See more at https://community.algolia.com/react-instantsearch/connectors/connectStateResults.html' +
                '\n' +
                'and https://community.algolia.com/react-instantsearch/guide/Conditional_display.html'
            );
          }
        }
      }

      getMetadata(nextWidgetsState) {
        if (hasMetadata) {
          return connectorDesc.getMetadata.call(
            this,
            this.props,
            nextWidgetsState
          );
        }
        return {};
      }

      getSearchParameters(searchParameters) {
        if (hasSearchParameters) {
          return connectorDesc.getSearchParameters.call(
            this,
            searchParameters,
            this.props,
            this.context.ais.store.getState().widgets
          );
        }
        return null;
      }

      transitionState(prevWidgetsState, nextWidgetsState) {
        if (hasTransitionState) {
          return connectorDesc.transitionState.call(
            this,
            this.props,
            prevWidgetsState,
            nextWidgetsState
          );
        }
        return nextWidgetsState;
      }

      componentDidMount() {
        this.setState({
          canRender: true,
        });
      }

      componentWillMount() {
        if (connectorDesc.getSearchParameters) {
          this.context.ais.onSearchParameters(
            connectorDesc.getSearchParameters,
            this.context,
            this.props
          );
        }
      }

      // The canRender props is not sync with the one from the state because
      // in this lifecycle we don't pass the `canRender` prop to the getProvidedProps
      // function. It means that every time a component received new props the canRender
      // prop is `undefined`.
      componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props, nextProps)) {
          this.setState(prevState => ({
            props: this.getProvidedProps({
              uiState: prevState.uiState,
              props: nextProps,
            }),
          }));

          if (isWidget) {
            // Since props might have changed, we need to re-run getSearchParameters
            // and getMetadata with the new props.
            this.context.ais.widgetsManager.update();
            if (connectorDesc.transitionState) {
              this.context.ais.onSearchStateChange(
                connectorDesc.transitionState.call(
                  this,
                  nextProps,
                  this.context.ais.store.getState().widgets,
                  this.context.ais.store.getState().widgets
                )
              );
            }
          }
        }
      }

      componentWillUnmount() {
        this.unsubscribe();
        if (isWidget) {
          this.unregisterWidget(); // will schedule an update
          if (hasCleanUp) {
            const newState = connectorDesc.cleanUp.call(
              this,
              this.props,
              this.context.ais.store.getState().widgets
            );
            this.context.ais.store.setState({
              ...this.context.ais.store.getState(),
              widgets: newState,
            });
            this.context.ais.onSearchStateChange(removeEmptyKey(newState));
          }
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        const { props: stateProps } = this.state;
        const { props: nextStateProps } = nextState;

        const propsEqual = shallowEqual(this.props, nextProps);

        if (stateProps === null || nextStateProps === null) {
          if (stateProps === nextStateProps) {
            return !propsEqual;
          }

          return true;
        }

        const statePropsEqual = shallowEqual(stateProps, nextStateProps);

        return !propsEqual || !statePropsEqual;
      }

      getProvidedProps = ({ props, uiState }) => {
        const {
          results,
          searching,
          error,
          widgets,
          metadata,
          resultsFacetValues,
          searchingForFacetValues,
          isSearchStalled,
        } = this.context.ais.store.getState();

        const searchResults = {
          results,
          searching,
          error,
          searchingForFacetValues,
          isSearchStalled,
        };

        return connectorDesc.getProvidedProps.call(
          this,
          props,
          widgets,
          searchResults,
          metadata,
          resultsFacetValues,
          uiState,
          this.setUiState
        );
      };

      refine = (...args) => {
        this.context.ais.onInternalStateUpdate(
          connectorDesc.refine.call(
            this,
            this.props,
            this.context.ais.store.getState().widgets,
            ...args
          )
        );
      };

      searchForFacetValues = (...args) => {
        this.context.ais.onSearchForFacetValues(
          connectorDesc.searchForFacetValues(
            this.props,
            this.context.ais.store.getState().widgets,
            ...args
          )
        );
      };

      createURL = (...args) =>
        this.context.ais.createHrefForState(
          connectorDesc.refine.call(
            this,
            this.props,
            this.context.ais.store.getState().widgets,
            ...args
          )
        );

      cleanUp = (...args) => connectorDesc.cleanUp.call(this, ...args);

      setUiState = uiStateUpdater =>
        this.setState(prevState => {
          const nextSliceUiState = uiStateUpdater(prevState.uiState);

          if (!nextSliceUiState) {
            return null;
          }

          const nextUiState = {
            ...prevState.uiState,
            ...nextSliceUiState,
          };

          return {
            uiState: nextUiState,
            props: this.getProvidedProps({
              props: prevState.props,
              uiState: nextUiState,
            }),
          };
        });

      render() {
        const { props: stateProps } = this.state;

        if (stateProps === null) {
          return null;
        }

        const refineProps = hasRefine
          ? { refine: this.refine, createURL: this.createURL }
          : {};

        const searchForFacetValuesProps = hasSearchForFacetValues
          ? { searchForItems: this.searchForFacetValues }
          : {};

        return (
          <Composed
            {...this.props}
            {...stateProps}
            {...refineProps}
            {...searchForFacetValuesProps}
          />
        );
      }
    };
}
