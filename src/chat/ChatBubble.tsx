import React, { useRef, useState } from 'react';
import { DKIcons, DKIcon, DKLabel, INPUT_TYPE, INPUT_VIEW_DIRECTION, DKButton } from 'deskera-ui-library';
import ControlledInput from '../components/ControlledInput';
import ChatInputBox from './ChatInput';

export default function ChatBubble() {
    /* state definitions goes here*/
    const [needPopup, setNeedPopup] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showChatHistory, setShowChatHistory] = useState(true);
    const [email, setEmail] = useState('');

    const [cookies, setCookies] = useState(null);
    const [messages, setMessages] = useState([]);
    const messageTopRef = useRef();
    const messageBottomRef = useRef();

    /* helper renderer goes here */
    const renderHeader = () => {
        return <div className="border-radius-m row bg-blue p-v-l p-h-s">
            <DKLabel
                className="text-white fw-b fs-m"
                text={'Hey there 👋🏻'}
            />
        </div>;
    }

    const renderChatHistory = () => {
        return <div
            id="chat-wrapper"
            style={{ minHeight: 270, maxHeight: 270, overflowX: 'auto' }}
            className={`scroll-y-only-web hide-scroll-bar parent-width border-s parent-width border-radius-s border-box flex-wrap justify-content-start`}
        >
            <p ref={messageTopRef} />
            {showChatHistory && <div className="dk-chat-screen parent-size shadow-s border-radius-m">
                {messages?.map((message, index) => {
                    return (
                        // <ChatBubble
                        //     data={message}
                        //     searchText={''}
                        //     currentUserId={cookies?.id}
                        //     currentTenantId={cookies?.id}
                        //     onActionButtonClick={(
                        //         messageId,
                        //         threadId,
                        //         attachemntId
                        //     ) =>
                        //         onActionButtonClick(
                        //             messageId,
                        //             threadId,
                        //             attachemntId
                        //         )
                        //     }
                        // />
                        ''
                    );
                })}
            </div>}
            <div id="bottom" ref={messageBottomRef} />
        </div>
    }

    const renderEmailInput = () => {
        return <>
            <ControlledInput
                name="Email Address"
                autoFocus
                type={INPUT_TYPE.EMAIL}
                value={email}
                direction={INPUT_VIEW_DIRECTION.VERTICAL}
                invalid={false}
                required
                onChange={(e) => this.setState({ email: e.target.value })}
                onKeyDown={() => {}}
            />
            <div className="row mt-m">
                <DKButton
                    title="Submit"
                    className="fs-m border-m text-white bg-blue mt-m"
                    onClick={() => this.validateEmail()}
                />
                <DKButton
                    title="Skip"
                    className="fs-m border-m bg-gray1 mt-m ml-s"
                    onClick={() => this.signUp(true)}
                />
            </div>
        </>
    }

    const renderChatInput = () => {
        return <ChatInputBox
            onSend={() => {}}
            currentThreadId={cookies?.threadId}
            guest={true}
        />
    }

    const renderPopup = () => {
        return (
            <div
                className="row row-reverse position-absolute"
                style={{ height: 400, width: 300, bottom: 90, right: 20 }}
            >
                <div
                    className="parent-width border-m shadow-m border-radius-m bg-white "
                >
                    {renderHeader()}
                    {renderChatHistory()}
                    <div className="p-m">
                        {showChatHistory && renderEmailInput()}
                        {showChatHistory && renderChatInput()}
                    </div>
                </div>
            </div>
        );
    }
    const renderBubble = () => {
        return <div
            className="border-radius-l bg-blue position-absolute d-flex align-items-center justify-content-center"
            style={{ bottom: 15, right: 20, height: 50, width: 50 }}
            onClick={() => setShowPopup(!showPopup)}
        >
            <DKIcon
                src={needPopup ? DKIcons.ic_close : DKIcons.ic_close}
                className={`chat-float-icon $needPopup ? 'rotate-138' : ''
                    }`}
            ></DKIcon>
        </div >
    }
    /* Main renderer goes here */
    return (
        <>
            {showPopup && renderPopup()}
            {renderBubble()}
        </>
    )
}
