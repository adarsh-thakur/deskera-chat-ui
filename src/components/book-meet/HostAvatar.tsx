import { DKContactIcon, DKIcon } from "../common";
import ic_bdr from "../../assets/images/ic_bdr.png";
import { IMeetHost } from "../../model/MeetModel";

interface IHostAvatarProps {
  host: IMeetHost;
  className?: string;
  style?: any;
}

export default function HostAvatar(props: IHostAvatarProps) {
  return (
    <div
      className={
        "dk-chat-row dk-chat-width-auto dk-chat-mt-l dk-chat-fs-s-2 " +
        (props.className || "")
      }
      style={props.style || {}}
    >
      {props.host.profilePic ? (
        <DKIcon
          src={props.host.profilePic}
          className="dk-chat-z-index-1 dk-chat-ic-m dk-chat-circle dk-chat-border-blue dk-chat-bg-chip-blue"
          style={{
            minWidth: 35
          }}
          alt={props.host.name[0]}
          defaultSrc={ic_bdr}
        />
      ) : (
        <DKContactIcon
          title={props.host.name}
          className="dk-chat-position-relative dk-chat-z-index-2 dk-chat-bg-chip-blue dk-chat-border-blue"
          style={{
            left: -4,
            height: 35,
            width: 35
          }}
        />
      )}
    </div>
  );
}
