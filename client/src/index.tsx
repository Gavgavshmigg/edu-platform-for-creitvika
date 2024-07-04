import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Store from './store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import SchoolStore from './store/schoolStore';
import MaterialStore from './store/materialStore';

interface State {
  store: Store,
  schoolStore: SchoolStore,
  materialStore: MaterialStore
}

const store = new Store();
const schoolStore = new SchoolStore();
const materialStore = new MaterialStore();

export const Context = createContext<State>({
  store,
  schoolStore,
  materialStore
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Context.Provider value={{
    store,
    schoolStore,
    materialStore
  }}>
    <App />
  </Context.Provider>
);