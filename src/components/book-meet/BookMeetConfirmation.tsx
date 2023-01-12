import { Fragment } from "react";
import { IMeetHost, IMeetMember, IMeetSlot } from "../../model/MeetModel";
import { DKButton, DKLabel } from "../common";
import { MONTHS, WEEK_DAYS } from "../../Utility/Constants";
import HostAvatar from "./HostAvatar";
import { getHexToRgbWithAlpha, getRgbTextColorForChip } from "../../Utility/Utility";

interface IBookMeetConfirmationProps {
  host: IMeetHost;
  invitee: IMeetMember;
  selectedSlot: IMeetSlot;
  accentColor?: string;
  onConfirmed: () => void;
}

export default function BookMeetConfirmation(
  props: IBookMeetConfirmationProps
) {
  function getMeetDetails() {
    const date = new Date(props.selectedSlot.startDate);
    const timezoneOffset = new Date().getTimezoneOffset() * -1;
    const tzHours = Math.floor(timezoneOffset / 60);
    const tzMins = timezoneOffset % 60;
    return (
      <Fragment>
        <DKLabel
          text={`${WEEK_DAYS[date.getDay()]}, ${
            MONTHS[date.getMonth()]
          } ${date.getDate()}, ${
            props.selectedSlot.title
          }, GMT+${tzHours}:${tzMins}`}
          className="dk-chat-fw-m dk-chat-fs-l dk-chat-mt-l"
        />
        <DKLabel
          text="Calendar invite will be sent to below email"
          className="dk-chat-mt-r"
        />
        <DKLabel
          text={props.invitee.email}
          className="dk-chat-mt-r dk-chat-text-orange"
        />
      </Fragment>
    );
  }

  function getCTA() {
    return (
      <Fragment>
        <DKButton
          title={"Book meeting"}
          className={
            "dk-chat-mt-l dk-chat-justify-content-center "
          }
          style={{
            borderRadius: 4,
            width: 160,
            backgroundColor: getHexToRgbWithAlpha(props.accentColor, 0.2),
            color: getRgbTextColorForChip(props.accentColor)
          }}
          onClick={() => props.onConfirmed()}
        />
      </Fragment>
    );
  }

  return (
    <div className="dk-chat-column dk-chat-parent-width dk-chat-align-items-center ">
      <HostAvatar host={props.host} />
      {getMeetDetails()}
      {getCTA()}
    </div>
  );
}
