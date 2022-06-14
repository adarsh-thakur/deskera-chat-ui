import { useEffect, useRef, useState } from 'react';
import './App.css';
import './css/override.css';
import ChatWrapper from './components/ChatWrapper';
import { TenantService } from './services/tenant';
import WebSocketService from './services/webSocket';
import { DEFAULT_COLOR, DEFAULT_POSITION, GUEST_USER_COOKIE } from './Utility/Constants';
import { decodeJSON, getCookie, getRandomHexString, isEmptyObject } from './Utility/Utility';
import { ChatService } from './services/chat';

const TENANT_ID_KEY = 'tenantid';

const App = (props) => {
    console.log(props)
    const [mount, setMount] = useState(false);
    const [settings, setSettings] = useState({
        bubblePosition: DEFAULT_POSITION,
        bubbleColor: props?.data?.accentColor || DEFAULT_COLOR,
    });
    const tenantService = TenantService.getInstance();
    const webSocketService = WebSocketService.getInstance();

    useEffect(() => {
        if (props.shutDown) {
            webSocketService.stopWebSocketPing();
            return null;
        }
    }, [props.shutDown]);

    useEffect(() => {
        extractTenantInfo();
    }, []);

    const getSettings = (tenantId) => {
        ChatService.getSettings(tenantId).then((res) => {
            setSettings({ ...settings, ...res });
        }).catch((error) => {
            console.log(error);
            console.error('Error while getting settings');
        });
    }
    const initChat = ({ tenantId }) => {
        tenantService.setTenantId(tenantId);
        if (!isEmptyObject(getCookie(GUEST_USER_COOKIE))) {
            const cookie = decodeJSON(getCookie(GUEST_USER_COOKIE));
            if (cookie) {
                tenantService.setUserId(cookie.userId);
            } else {
                tenantService.setUserId(getRandomHexString());
            }
        } else {
            tenantService.setUserId(getRandomHexString());
        }
        setMount(true);
        webSocketService.openConnection();
    }
    const extractTenantInfo = () => {
        let tenantId = '';
        const chatScriptEl = document.getElementById('deskera-chat-script');
        if (chatScriptEl?.dataset?.[TENANT_ID_KEY]) {
            tenantId = chatScriptEl.dataset[TENANT_ID_KEY];
            initChat(chatScriptEl.dataset[TENANT_ID_KEY]);
        } else {
            if (props?.data?.tenantId) {
                tenantId = props?.data?.tenantId;
                initChat(props.data);
            }
        }
        if (tenantId) getSettings(tenantId);
    }
    return mount ? <ChatWrapper
        {...props.data}
        settings={settings}
        tenantId={tenantService.getTenantId()}
        userId={tenantService.getUserId()}
    /> : null;
};

export default App;
