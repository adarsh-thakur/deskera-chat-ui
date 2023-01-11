import React, { useEffect, useState } from "react";
import { GUEST_USER_COOKIE } from "../Utility/Constants";
import { getCookie } from "../Utility/Utility";
import ic_bdr from "../assets/images/ic_bdr.png";
export enum INITIAL_USER_SELECTION {
    TALK_TO_REP = `I want to talk to a Specialist 🙋‍♂️`,
    BOOK_A_MEET = `I want to schedule a meeting`
}
function BDRInfo(props) {
    return <>
        <div className="dk-chat-row dk-chat-flex-wrap" style={{ gap: 5, padding: '0 20px' }}>
            <div className="dk-chat-d-flex dk-chat-align-items-center dk-chat-parent-width dk-chat-mb-r" style={{ gap: 10, flexDirection: 'column' }}>
                <div className="dk-chat-bg-chip-orange dk-chat-text-blue dk-chat-fs-r dk-chat-fw-b dk-chat-p-h-l dk-chat-border-radius-m dk-chat-text-orange">Meet your sales representative</div>
                <div
                    className="dk-chat-bg-chip-orange"
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        backgroundRepeat: 'round'
                    }}>
                    <img className="dk-chat-parent-size" style={{ borderRadius: '50%' }} src={`${props.bdrInfo?.profilePic}`} alt="" onError={({ currentTarget }:any) => {
                        currentTarget.onerror = null;
                        currentTarget.src = ic_bdr;
                    }} />
                </div>
                <div className="dk-chat-fw-b dk-chat-text-align-center">
                    <div className="dk-chat-fs-l">{props.bdrInfo?.displayName}</div>
                    <div className="dk-chat-fs-r dk-chat-text-gray">{props.bdrInfo?.email}</div>
                </div>
            </div>
            {!getCookie(GUEST_USER_COOKIE) && ['TALK_TO_REP', 'BOOK_A_MEET'].map(item => <div
                className='dk-chat-parent-width dk-chat-bg-chip-blue dk-chat-p-s dk-chat-text-blue dk-chat-text-align-center dk-chat-cursor-hand dk-chat-fs-r '
                onClick={() => props.onItemClick(item)}
            >
                {INITIAL_USER_SELECTION[item]}
            </div>
            )}
        </div></>
}
export default BDRInfo;