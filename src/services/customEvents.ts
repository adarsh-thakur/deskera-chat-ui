export const customEvent = {
    on: (ev: string, cb: (data) => void) => {
        document.addEventListener(ev, (data: any) => cb(data.detail));
    },
    dispatch: (ev: string, data: any) => {
        document.dispatchEvent(new CustomEvent(ev, { detail: data }));
    },
    remove: (ev: string, cb: (data) => void) => {
        document.removeEventListener(ev, cb);
    }
}