import KFWebApi, {KFWebApiRequest} from "./KFWebApi";

/**
 * KIPFIN API
 */
export default class KFApi {

    /**
     * Настройка API
     */
    static sharedAPIObject: any = KFWebApiRequest;

    /**
     * Преобразует приложение в NODE приложение
     */
    static nodeApp(): void{
        KFApi.sharedAPIObject = require("./KFNodeApiRequest").default;
    }

    /**
     * Создает запрос в API сервер
     * @param method
     */
    static request(method: string): KFWebApiRequest{
        return new this.sharedAPIObject(KFWebApi.API_SERVER, method);
    }
}