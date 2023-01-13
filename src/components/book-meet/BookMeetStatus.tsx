import { IMeetHost, IMeetMember, IMeetSlot } from "../../model/MeetModel";
import { DKLabel } from "../common";
/* import { MONTHS, WEEK_DAYS } from "../../Utility/Constants"; */
import HostAvatar from "./HostAvatar";

interface IBookMeetStatusProps {
  host: IMeetHost;
  invitee: IMeetMember;
  selectedSlot: IMeetSlot;
}

export default function BookMeetStatus(props: IBookMeetStatusProps) {
  function getMeetDetails() {
    /* const date = new Date(props.selectedSlot.startDate); */
    return (
      <div className="dk-chat-column dk-chat-ml-r">
        {/* <DKLabel
          text={`${WEEK_DAYS[date.getDay()]}, ${
            MONTHS[date.getMonth()]
          } ${date.getDate()}, ${props.selectedSlot.title}, GMT+${Math.floor(
            (new Date().getTimezoneOffset() * -1) / 60
          )}:${(new Date().getTimezoneOffset() * -1) % 60}`}
          className="dk-chat-fw-m dk-chat-fs-m"
        /> */}
        <DKLabel
          text={`Your meeting is scheduled with <b>${props.host.name}</b>. Meeting invite sent to <b>${props.invitee?.email}</b>`}
          /* className="dk-chat-mt-r" */
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
