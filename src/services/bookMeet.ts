import { API_CONSTANT } from "../Utility/ApIConstant";
import { IChatUserContactPayload, IEventPayload, ISlotResponse } from "../model/MeetModel";
import axiosInstance from "./http";

export class BookMeetService {
  private static _bookMeet: BookMeetService = null;

  public static getInstance() {
    if (!BookMeetService._bookMeet) {
      BookMeetService._bookMeet = new BookMeetService();
    }

    return BookMeetService._bookMeet;
  }

  public async fetchAvailableSlotsByDay(
    tenantId: number,
    userId: number,
    params: {
      fromDate: string;
      toDate: string;
    }
  ): Promise<ISlotResponse> {
    return axiosInstance.get(
      API_CONSTANT.BOOK_MEET.GET_SLOTS(tenantId, userId),
      {
        params: {
          tzOffset: new Date().getTimezoneOffset() * -1,
          fromDate: encodeURI(params.fromDate),
          toDate: encodeURI(params.toDate)
        }
      }
    );
  }

  public async createMeetingInvitee(tenantId: number, payload: IChatUserContactPayload) {
    return axiosInstance
      .post(API_CONSTANT.BOOK_MEET.CREATE_CONTACT(tenantId), payload)
      .catch((err) => {});
  }

  public async createMeetingEvent(tenantId: number, payload: IEventPayload) {
    return axiosInstance
      .post(API_CONSTANT.BOOK_MEET.CREATE_EVENT(tenantId), payload);
  }
}
