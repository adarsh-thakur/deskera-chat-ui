import './App.css';
import ChatPopup from './chat/ChatPopup';
import { TenantService } from './services/tenant';
import WebSocketService from './services/webScoket';
import { getRandomHexString } from './Utility/Utility';

const TENANT_ID_KEY = 'tenantid';

const App = (props) => {
    const initChat = ({tenantId}) => {
        const tenantService = TenantService.getInstance();
        tenantService.setTenantId(tenantId);
        tenantService.setUserId(getRandomHexString());
        const webSocketService = WebSocketService.getInstance();
        webSocketService.openConnection();
    }
    const extractTenantInfo = () => {
        const chatScriptEl = document.getElementById('deskera-chat-script');
        if (chatScriptEl?.dataset?.[TENANT_ID_KEY]) {
            initChat(chatScriptEl.dataset[TENANT_ID_KEY]);
        } else {
            if (props?.data?.tenantId) {
                initChat(props.data);
            }
        }
    }
    extractTenantInfo();
    return <ChatPopup {...props.data} />;
};

export default App;
