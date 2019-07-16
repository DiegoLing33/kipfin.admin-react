import KFWebApi, {IKFApiResponse, KFWebApiRequest} from "./KFWebApi";
import * as http from "http";

export default class KFNodeApiRequest extends KFWebApiRequest{
    /**
     * Отправляет запрос
     */
    public async send(): Promise<IKFApiResponse> {
        return new Promise<IKFApiResponse>(resolve => {
            const [className, methodName] = this.__method.split(".") as string[];
            const req: string[] = ["class=" + className, "method=" + methodName];
            for (let key in this.__get)
                if (this.__get.hasOwnProperty(key))
                    req.push(`${key}=${encodeURIComponent(this.__get[key])}`);
            const url = `${KFWebApi.API_SERVER}/index.php?${req.join("&")}`;
            http.get(url, (res: any) => {
               let data = "";
               res.on("data", (chunk: any) => data += chunk);
               res.on("end", ()=>{
                  const json = JSON.parse(data) as IKFApiResponse;
                  resolve(json);
               });
            });
        });
    }
}