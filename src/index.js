import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const deskeraChat = (type, data) => {
  const init = () => {
    if (!document.getElementById('root')) {
      const mountEl = document.createElement('div');
      mountEl.setAttribute('id', 'root');
      document.body.appendChild(mountEl);
    }
    ReactDOM.render(
      <React.StrictMode>
        <App data={data} />
      </React.StrictMode>,
      document.getElementById('root')
    );

  };
  const update = () => {
    init(data);
  };
  switch (type) {
    case 'init':
      init(data);
      break;
    case 'update':
      update(data);
    default:
      break;
  }
}
window.deskeraChat = deskeraChat;
/**
 * @todo enable following lines to render the chat for a specific tenant in dev mode
 */

// deskeraChat('init', {
//   tenantId: <TENANT_ID>
// }
// );


/**
 * @description: These are the configuration parameters for the chat
 */
// {
//   tenantId: 70223, // required
//   accentColor: 'green',
//   name: 'Adarsh Thakur',
//   phone: '+918888888888',
//   email: 'abc@deskera.com',
//   sessionDuration:10000,
//   avatar: 'https://img.icons8.com/ios/50/000000/cat-profile.png',
// }