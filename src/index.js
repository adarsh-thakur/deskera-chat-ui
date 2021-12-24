import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const render = (data) => {

  if (!document.getElementById('root')) {
    const mountEl = document.createElement('div');
    mountEl.setAttribute('id', 'root');
    document.body.appendChild(mountEl);
  }

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
console.log(window);
// render({ tenantId: 70223 }); //enable this line to render the chat for a specific tenant in dev mode