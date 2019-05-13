import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from '@cartologic/sdk/wizard/reducers';

export function configureStore(initialState) {
    return createStore(reducers, initialState, composeWithDevTools(
        applyMiddleware(ReduxThunk)))
};
