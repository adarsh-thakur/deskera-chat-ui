export interface IMeetSlot {
  title: string;
  format: string;
  startDate?: string;
  endDate?: string;
}

export interface IMeetMember {
  id?: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  profilePic?: string;
}

export interface IMeetHost extends IMeetMember {
  userId: number;
  meetLink: string;
}

export interface IChatUserContactPayload {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  owner_id: number;
}

export interface IEventPayload {
  meetingLink: string;
  startDate: string;
  endDate: string;
  requestorName: string;
  requestorEmail: string;
  questions: string;
  tzName: string;
  ownerId: number;
  crmContactId?: string;
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
