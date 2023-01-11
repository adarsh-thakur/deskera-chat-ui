import { Fragment } from "react";
import { IMeetMember, IMeetSlot } from "../../model/MeetModel";
import { DKButton, DKContactIcon, DKIcon, DKLabel } from "../common";
import { MONTHS, WEEK_DAYS } from "../../Utility/Constants";

interface IBookMeetConfirmationProps {
  host: IMeetMember;
  invitee: IMeetMember;
  selectedSlot: IMeetSlot;
  onConfirmed: () => void;
}

export default function BookMeetConfirmation(
  props: IBookMeetConfirmationProps
) {
  function getAvatars() {
    return (
      <div className="dk-chat-row dk-chat-width-auto dk-chat-mt-l dk-chat-fs-s-2">
        {props.host.profilePic ? (
          <DKIcon
            src={props.host.profilePic}
            className="dk-chat-z-index-1 dk-chat-ic-m dk-chat-circle dk-chat-border-blue dk-chat-bg-chip-blue"
            style={{
              minWidth: 35
            }}
            alt={props.host.name[0]}
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
            "dk-chat-text-blue dk-chat-bg-chip-blue dk-chat-mt-l dk-chat-justify-content-center"
          }
          style={{
            borderRadius: 4,
            width: 160
          }}
          onClick={() => props.onConfirmed()}
        />
      </Fragment>
    );
  }

  return (
    <div className="dk-chat-column dk-chat-parent-width dk-chat-align-items-center ">
      {getAvatars()}
      {getMeetDetails()}
      {getCTA()}
    </div>
  );
}
