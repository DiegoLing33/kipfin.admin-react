/**
 * Requests manager
 */
import Auth from "./Auth";

export interface GKFRequestsResponse {
    readonly ok: boolean;

    [key: string]: any;
}

export default class GKFRequests {

    /**
     * The URL
     */
    static url: string = "http://api2.kipfin.ru/Methods";

    /**
     * Sends the request to the kipfin
     * @param method
     * @param data
     */
    static sendGETRequest(method: string, data: any = {}): Promise<GKFRequestsResponse> {
        method = method.replace(/\./g, "/");
        return new Promise<GKFRequestsResponse>(resolve => {
            let xhr = new XMLHttpRequest();
            let req = ["secret=d3b485d3b0eeb49d552f719562c38b01", `hash=${Auth.GetHash()}`];
            for (let key in data) {
                if (data.hasOwnProperty(key))
                    req.push(`${key}=${encodeURIComponent(data[key])}`);
            }
            xhr.onload = () => {
                try {
                    resolve(JSON.parse(xhr.responseText) as GKFRequestsResponse);
                } catch (e) {
                    resolve({ok: false});
                }
            };
            xhr.open("GET", GKFRequests.url
                + `/${method}.php?${req.join("&")}`);
            xhr.send();
        });
    }

    /**
     * Sends the request to the kipfin
     * @param method
     * @param data
     */
    static sendPOSTRequest(method: string, data: any = {}): Promise<GKFRequestsResponse> {
        method = method.replace(/\./g, "/");
        return new Promise<GKFRequestsResponse>(resolve => {
            let xhr = new XMLHttpRequest();
            let formData = new FormData();
            for (let key in data) {
                if (data.hasOwnProperty(key))
                    formData.append(key, data[key]);
            }
            xhr.onload = () => {
                try {
                    resolve(JSON.parse(xhr.responseText) as GKFRequestsResponse);
                } catch (e) {
                    resolve({ok: false});
                }
            };
            xhr.open("POST", GKFRequests.url + `/${method}.php?secret=d3b485d3b0eeb49d552f719562c38b01&hash=${Auth.GetHash()}`);
            xhr.send(formData);
        });
    }
}