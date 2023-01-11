import { IMeetHost, IMeetMember, IMeetSlot } from "../../model/MeetModel";
import { DKContactIcon, DKIcon, DKLabel } from "../common";
import { MONTHS, WEEK_DAYS } from "../../Utility/Constants";
import HostAvatar from "./HostAvatar";

interface IBookMeetStatusProps {
  host: IMeetHost;
  invitee: IMeetMember;
  selectedSlot: IMeetSlot;
}

export default function BookMeetStatus(props: IBookMeetStatusProps) {
  function getAvatar() {
    return props.host.profilePic ? (
      <DKIcon
        src={props.host.profilePic}
        className="dk-chat-z-index-1 dk-chat-ic-l dk-chat-circle dk-chat-border-blue dk-chat-bg-chip-blue dk-chat-text-align-center"
        style={{
          minWidth: 48
        }}
        alt={props.host.name[0]}
      />
    ) : (
      <DKContactIcon
        title={props.host.name}
        className="dk-chat-position-relative dk-chat-z-index-2 dk-chat-bg-chip-blue dk-chat-border-blue"
        style={{
          left: -4,
          height: 48,
          minWidth: 48
        }}
      />
    );
  }

  function getMeetDetails() {
    const date = new Date(props.selectedSlot.startDate);
    return (
      <div className="dk-chat-column dk-chat-ml-r">
        <DKLabel
          text={`${WEEK_DAYS[date.getDay()]}, ${
            MONTHS[date.getMonth()]
          } ${date.getDate()}, ${props.selectedSlot.title}, GMT+${Math.floor(
            (new Date().getTimezoneOffset() * -1) / 60
          )}:${(new Date().getTimezoneOffset() * -1) % 60}`}
          className="dk-chat-fw-m dk-chat-fs-m"
        />
        <DKLabel
          text={`Meeting with ${props.host.name}`}
          className="dk-chat-mt-r"
        />
        <DKLabel
          text={`Confirmation mail sent to ${props.invitee?.email}`}
          className="dk-chat-mt-s"
        />
      </div>
    );
  }

  return (
    <div className="dk-chat-row dk-chat-align-items-start">
      <HostAvatar host={props.host} className={"dk-chat-mt-0"} />
      {getMeetDetails()}
    </div>
  );
}
