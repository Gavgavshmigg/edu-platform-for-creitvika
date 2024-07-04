import React, { useContext, useEffect } from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import { Context } from '.';
import { observer } from 'mobx-react-lite';
import './App.scss';
import 'react-big-calendar/lib/sass/styles.scss';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import MyRoutes from './routes';

function App() {

  return (
    <BrowserRouter>
      <div className="app">
        <MyRoutes/>
      </div>
    </BrowserRouter>
  );
}

export default observer(App);
