import { API_CONSTANT } from "../Utility/ApIConstant";
import { customEvent } from "./customEvents";
import httpClient from "./http";
export class BDR {
    private static bdrInfo = null;
    public static setBDRInfo(bdrInfo) {
        this.bdrInfo = bdrInfo;
        customEvent.dispatch('bdfInfoFetched', bdrInfo);
    }
    public static getBDRInfo() {
        return this.bdrInfo;
    }
}
export const getBDR = (tenantId: number) => {
    const tzOffset = new Date().getTimezoneOffset() * - 1;
    return httpClient.get(API_CONSTANT.BDR.GET(tenantId, tzOffset));
}