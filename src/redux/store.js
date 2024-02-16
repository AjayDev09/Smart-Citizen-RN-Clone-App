import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistStore, persistReducer } from 'redux-persist'
import thunk from "redux-thunk";
import todoReducer from './reducers';
import { applyMiddleware, compose, createStore } from 'redux'



const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
}

const persistedReducer = persistReducer(persistConfig, todoReducer)

export const store = createStore(
  persistedReducer,
  composeEnhancers(
    applyMiddleware(
      thunk
      // logger,
    )
  )
);

export const store0 = createStore(
  persistedReducer,
  applyMiddleware(
    thunk
  )
);
export let persistor = persistStore(store);
 

//export const store = createStore(persistedReducer)
//export const persistor = persistStore(store)