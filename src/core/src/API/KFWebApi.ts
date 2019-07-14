export type TKFWebApiArgs = { [name: string]: any };

/**
 * Ответ KipFin API
 */
export interface IKFApiResponse {
    ok: boolean;

    [name: string]: any;
}

/**
 * Типы запросов
 */
export enum KFWebApiRequestType {
    GET = "GET",
    POST = "POST",
}

/**
 * Запрос
 */
export class KFWebApiRequest {

    protected __url: string;
    protected __method: string;
    protected __get: TKFWebApiArgs = {};
    protected __post: TKFWebApiArgs = {};

    /**
     * Конструктор
     * @param url
     * @param method
     */
    public constructor(url: string, method: string) {
        this.__url = url;
        this.__method = method;
    }

    /**
     * Устанавливает GET аргументы
     * @param args
     */
    public argsGet(args: TKFWebApiArgs): KFWebApiRequest {
        this.__get = {...this.__get, ...args};
        return this;
    }

    /**
     * Устанавливает POST аргументы
     * @param args
     */
    public argsPost(args: TKFWebApiArgs): KFWebApiRequest {
        this.__post = {...this.__post, ...args};
        return this;
    }


    /**
     * Отправляет запрос
     * @param type
     */
    public async send(type: KFWebApiRequestType = KFWebApiRequestType.GET): Promise<IKFApiResponse> {
        return new Promise<IKFApiResponse>(resolve => {
            const xhr = new XMLHttpRequest();
            const [className, methodName] = this.__method.split(".") as string[];
            const req: string[] = ["class=" + className, "method=" + methodName];
            for (let key in this.__get)
                if (this.__get.hasOwnProperty(key))
                    req.push(`${key}=${encodeURIComponent(this.__get[key])}`);
            xhr.onload = () => {
                try {
                    resolve(JSON.parse(xhr.responseText) as IKFApiResponse);
                } catch (e) {
                    resolve({ok: false});
                }
            };
            const url = `${KFWebApi.API_SERVER}/index.php?${req.join("&")}`;
            if (type === KFWebApiRequestType.POST) {
                const body: FormData = new FormData();
                for (let key in this.__post)
                    if (this.__post.hasOwnProperty(key))
                        body.append(key, this.__post[key]);
                xhr.open("POST", url);
                xhr.send(body);
            }else{
                xhr.open("GET", url);
                xhr.send();
            }
        });
    }

}

/**
 * Веб API
 */
export default class KFWebApi {

    /**
     * API Сервер
     */
    public static API_SERVER: string = "http://api2.kipfin.ru/new";

    /**
     * Создает новый запрос
     * @param method
     */
    public static request(method: string): KFWebApiRequest{
        return  new KFWebApiRequest(KFWebApi.API_SERVER, method);
    }

}