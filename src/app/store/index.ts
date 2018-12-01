import { Store, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import { logger } from 'app/middleware';
import { RootState, rootReducer, rootEpic } from 'app/reducers';

const epicMiddleware = createEpicMiddleware();

export function configureStore(initialState?: RootState): Store<RootState> {
  let middleware = applyMiddleware(logger, epicMiddleware);

  if (process.env.NODE_ENV !== 'production') {
    middleware = composeWithDevTools(middleware);
  }

  const store = createStore(rootReducer, initialState, middleware) as Store<RootState>;

  if (module.hot) {
    module.hot.accept('app/reducers', () => {
      const nextReducer = require('app/reducers');
      store.replaceReducer(nextReducer);
    });
  }

  epicMiddleware.run(rootEpic);

  return store;
}
