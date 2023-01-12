/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { DKButton, DKLabel, DKIcons } from "../common";
import { WEEK_DAYS } from "../../Utility/Constants";
import { IMeetHost, IMeetMember, IMeetSlot } from "../../model/MeetModel";
import { BookMeetService } from "../../services/bookMeet";
import HostAvatar from "./HostAvatar";
import { getHexToRgbWithAlpha } from "../../Utility/Utility";

interface ISlotSelectorProps {
  tenantId: number;
  host: IMeetHost;
  invitee: IMeetMember;
  accentColor?: string;
  onSelectSlot: (slot: IMeetSlot) => void;
}

export default function SlotSelector(props: ISlotSelectorProps) {
  const today = new Date(new Date().setSeconds(0, 0));
  const [isLoading, setIsLoading] = useState(true);
  const [slots, setSlots] = useState<IMeetSlot[]>([]);
  const [date, setDate] = useState(
    new Date(new Date(today).setHours(9, 0, 0, 0))
  );

  useEffect(() => {
    fetchSlotsByDay();
  }, [date]);

  const fetchSlotsByDay = async () => {
    setIsLoading(true);

    try {
      /* fetching slots between 9AM to 6PM */
      const startDate = date.getTime() < today.getTime() ? today : date;
      let endDate = new Date(new Date(startDate).setHours(18, 0, 0, 0));

      if (endDate.getTime() < startDate.getTime()) {
        setSlots([]);
        return;
      }

      const slotResponse =
        await BookMeetService.getInstance().fetchAvailableSlotsByDay(
          props.tenantId,
          props.host.userId,
          {
            fromDate: startDate.toISOString(),
            toDate: endDate.toISOString()
          }
        );
      const availableSlots = slotResponse?.slots?._15min || [];
      setSlots(availableSlots);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  function getPaginationControls() {
    const previousDate = new Date(new Date(date).setDate(date.getDate() - 1));
    const nextDate = new Date(new Date(date).setDate(date.getDate() + 1));

    return (
      <div className="dk-chat-row dk-chat-mt-l dk-chat-align-items-center">
        {date.getDate() > today.getDate() ? (
          <div
            className="dk-chat-row"
            onClick={() => setDate(previousDate)}
            style={{
              width: "33%"
            }}
          >
            <DKButton
              icon={DKIcons.ic_arrow_left2}
              title={`${WEEK_DAYS[previousDate.getDay()]} ${
                previousDate.getMonth() + 1
              }/${previousDate.getDate()}`}
              className={
                "dk-chat-border-none dk-chat-bg-transparent dk-chat-fs-r"
              }
            />
          </div>
        ) : (
          <div
            className="dk-chat-row dk-chat-width-auto"
            style={{
              width: "33%"
            }}
          ></div>
        )}
        <DKLabel
          text={`${WEEK_DAYS[date.getDay()]} ${
            date.getMonth() + 1
          }/${date.getDate()}`}
          className="dk-chat-text-align-center dk-chat-fs-r"
          style={{
            width: "33%"
          }}
        />
        <div
          className="dk-chat-row dk-chat-cursor-hand dk-chat-justify-content-end"
          onClick={() => setDate(nextDate)}
          style={{
            width: "33%"
          }}
        >
          <DKButton
            icon={DKIcons.ic_arrow_right2}
            title={`${WEEK_DAYS[nextDate.getDay()]} ${
              nextDate.getMonth() + 1
            }/${nextDate.getDate()}`}
            className={
              "dk-chat-border-none dk-chat-bg-transparent dk-chat-fs-r"
            }
            isReverse={true}
          />
        </div>
      </div>
    );
  }

  function getSlots() {
    return isLoading ? (
      <DKLabel
        text={"Fetching available slots..."}
        className={"dk-chat-text-gray dk-chat-mt-r"}
      />
    ) : (
      <div
        className="dk-chat-row dk-chat-flex-wrap dk-chat-mt-r"
        style={{ columnGap: "2%", rowGap: 8 }}
      >
        {slots.map((slot) => (
          <DKButton
            title={slot.title}
            className={"dk-chat-justify-content-center dk-chat-fs-s-2 dk-chat-fw-m "}
            style={{
              width: "49%",
              borderRadius: 4,
              backgroundColor: getHexToRgbWithAlpha(props.accentColor, 0.2),
              color: props.accentColor ? props.accentColor : "rgb(22, 100, 215)"
            }}
            onClick={() => {
              const [hours, minutes] = slot.format.split(":");
              const meetStartDate = new Date(
                new Date(date).setHours(Number(hours), Number(minutes), 0)
              );
              const meetEndDate = new Date(
                new Date(meetStartDate).setMinutes(
                  meetStartDate.getMinutes() + 15
                )
              );
              props.onSelectSlot({
                ...slot,
                startDate: meetStartDate.toISOString(),
                endDate: meetEndDate.toISOString()
              });
            }}
          />
        ))}
        {slots.length === 0 ? (
          <DKLabel
            text={"No available slots found for current selected date."}
            className={"dk-chat-text-gray dk-chat-mt-r"}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="dk-chat-column dk-chat-parent-width dk-chat-align-items-center ">
      <HostAvatar host={props.host} />
      {getPaginationControls()}
      {getSlots()}
    </div>
  );
}
