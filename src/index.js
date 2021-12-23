import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const render = (data) => {
  ReactDOM.render(
    <React.StrictMode>
      <App data={data}/>
    </React.StrictMode>,
    document.getElementById('root')
  );
}
const deskeraChat = {
  render: render,
}
window.deskeraChat = deskeraChat;
render({ tenantId: 70223 });