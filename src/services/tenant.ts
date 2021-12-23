export class TenantService {
    private _tenantId: string;
    private _userId: string;
    public getUserId(): string {
        return this._userId;
    }
    public setUserId(userId: string) {
        this._userId = userId;
    }
    public getTenantId(): string {
        return this._tenantId;
    }
    public setTenantId(tenantId: any) {
        this._tenantId = String(tenantId);
    }
    private static _instance;
    public static getInstance(): TenantService {
        if (!this._instance) {
            this._instance = new TenantService();
        }
        return this._instance;
    }

}