import { useEffect, useState } from "react";
import { DKLabel, showAlert } from "../common";
import SlotSelector from "./SlotSelector";
import BookMeetStatus from "./BookMeetStatus";
import BookMeetConfirmation from "./BookMeetConfirmation";

import {
  IMeetSlot,
  IEventPayload,
  IMeetHost,
  IMeetMember,
  IChatUserContactPayload
} from "../../model/MeetModel";
import { BookMeetService } from "../../services/bookMeet";

interface IBookAMeetProps {
  tenantId: number;
  invitee: IMeetMember;
  host: IMeetHost;
  slot?: string;
  onBookMeeting: (meetStartDate: string) => Promise<any>;
}

function getSlotDataFromDateString(meetStartDate: string | null): IMeetSlot {
  if (!meetStartDate) return null;

  const startDate = new Date(meetStartDate);
  const endDate = new Date(
    new Date(meetStartDate).setMinutes(startDate.getMinutes() + 15)
  );
  const slotHours = startDate.getHours();
  const slotMinutes = startDate.getMinutes();

  return {
    title: `${slotHours % 12}:${slotMinutes} ${slotHours < 12 ? "AM" : "PM"}`,
    format: `${slotHours}:${slotMinutes}`,
    startDate: meetStartDate,
    endDate: endDate.toISOString()
  };
}

const MAX_STEPS = 3;

export default function BookAMeet({
  tenantId,
  host,
  slot,
  invitee,
  onBookMeeting
}: IBookAMeetProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<IMeetSlot>(null);

  useEffect(() => {
    const slotData = getSlotDataFromDateString(slot);
    if (!slotData) return;

    setSelectedSlot(slotData);
    setCurrentStep(3);
  }, [slot]);

  const onSkipToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const onSelectSlot = (slot: IMeetSlot) => {
    if (!slot?.startDate) return;

    setSelectedSlot(slot);
    onSkipToStep(currentStep + 1);
  };

  const onConfirmSlot = async () => {
    if (!selectedSlot) return;

    try {
      const contactPayload: IChatUserContactPayload = {
        ...invitee,
        owner_id: host.userId
      };
      await BookMeetService.getInstance().createMeetingInvitee(
        tenantId,
        contactPayload
      );

      const payload: IEventPayload = {
        meetingLink: host.meetLink,
        startDate: selectedSlot.startDate,
        endDate: selectedSlot.endDate,
        requestorName: invitee.name,
        requestorEmail: invitee.email,
        questions: "Book a demo",
        tzName: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ownerId: host.userId
      };
      await BookMeetService.getInstance().createMeetingEvent(tenantId, payload);

      // to avoid showing further step from this instance, as it will show up based on saved thread message
      onSkipToStep(MAX_STEPS + 1);

      await onBookMeeting(selectedSlot.startDate);
    } catch (err) {
      onSkipToStep(1);

      showAlert(
        "Error occured!",
        "Something went wrong while setting up event, please try again!"
      );
    }
  };

  function stepRenderer() {
    switch (currentStep) {
      case 1:
        return (
          <SlotSelector
            tenantId={tenantId}
            host={host}
            invitee={invitee}
            onSelectSlot={onSelectSlot}
          />
        );
      case 2:
        return (
          <BookMeetConfirmation
            host={host}
            invitee={invitee}
            selectedSlot={selectedSlot}
            onConfirmed={onConfirmSlot}
          />
        );
      case 3:
        return (
          <BookMeetStatus
            selectedSlot={selectedSlot}
            host={host}
            invitee={invitee}
          />
        );
      default:
        return null;
    }
  }

  function stepHeader() {
    return currentStep < MAX_STEPS ? (
      <DKLabel
        className={`dk-chat-text-gray dk-chat-parent-width dk-chat-text-align-center`}
        text={`Schedule a 15 minute meeting.<span class="dk-chat-fw-m"> All times are GMT+5:30</span>`}
      />
    ) : null;
  }

  return currentStep <= MAX_STEPS ? (
    <div
      style={{
        maxWidth: 340,
        marginTop: 24,
        marginLeft: "auto"
      }}
    >
      {stepHeader()}
      <div
        className="dk-chat-column dk-chat-flex-1 dk-chat-shadow-m dk-chat-p-r dk-chat-m-s dk-chat-border-blue"
        style={{ borderWidth: `2px 0 0` }}
      >
        {stepRenderer()}
      </div>
    </div>
  ) : null;
}
