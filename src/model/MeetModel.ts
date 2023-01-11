export interface IMeetSlot {
  title: string;
  format: string;
  startDate?: string;
  endDate?: string;
}

export interface IMeetMember {
  name: string;
  email: string;
  phone: string;
  profilePic?: string;
}

export interface IMeetHost extends IMeetMember {
  userId: number;
  meetLink: string;
}

export interface IEventPayload {
  meetLink: string;
  startDate: string;
  endDate: string;
  requestorName: string;
  requestorEmail: string;
  questions: string;
  tzName: string;
  ownerId: number;
}

export interface ISlotResponse {
  slots: {
    _15min: IMeetSlot[];
    _30min: IMeetSlot[];
    _60min: IMeetSlot[];
  };
}

export interface IBDRPayload {
  _id?: string;
  iamUserId: number;
  displayName: string;
  email?: string;
  meetingLink: string;
  profilePic: string;
  phone: string;
  active: boolean;
}
