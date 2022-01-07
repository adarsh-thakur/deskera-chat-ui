import { useEffect, useState } from 'react';
import './App.css';
import ChatPopup from './chat/ChatPopup';
import ChatWrapper from './components/ChatWrapper';
import { TenantService } from './services/tenant';
import WebSocketService from './services/webScoket';
import { GUEST_USER_COOKIE } from './Utility/Constants';
import { decodeJSON, getCookie, getRandomHexString, isEmptyObject } from './Utility/Utility';

const TENANT_ID_KEY = 'tenantid';

const App = (props) => {
    let tenantID = null;
    let userID = null;
    const [mount, setMount] = useState(false);
    const tenantService = TenantService.getInstance();
    const webSocketService = WebSocketService.getInstance();

    useEffect(() => {
        if (tenantID && userID) {
            setMount(true);
        }
    }, [tenantID, userID]);

    useEffect(() => {
        if (props.shutDown) {
            webSocketService.stopWebSocketPing();
            return null;
        }
    }, [props.shutDown]);

    const initChat = ({ tenantId }) => {
        tenantService.setTenantId(tenantId);
        tenantID = tenantService.getTenantId();
        if (!isEmptyObject(getCookie(GUEST_USER_COOKIE))) {
            const cookie = decodeJSON(getCookie(GUEST_USER_COOKIE));
            tenantService.setUserId(cookie.userId);
        } else {
            tenantService.setUserId(getRandomHexString());
        }
        userID = tenantService.getUserId();
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
    return mount ? <ChatWrapper
        {...props.data}
        tenantId={tenantService.getTenantId()}
        userId={tenantService.getUserId()}
    /> : null;
};

export default App;
