import React from 'react';
import ReactDOM from 'react-dom';
import {AppContextProvider} from "./context/appContext";
// import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

// css Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// import Coba from './pages/Coba';


ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
      {/* <Coba /> */}
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
