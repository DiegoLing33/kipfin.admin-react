import AdmissionRequest from "./AdmissionRequest";
import {AConditions} from "./AConditions";
import Specialisation from "../University/Specialisation";
import DateUtils from "../DateUtils/DateUtils";

/**
 * Фильтр корзины
 */
export interface IARequestsButchFilter {
    original?: Array<boolean>;
    spec?: Array<string | Specialisation>;
    conditions?: Array<string | AConditions>;
    name?: Array<string>;
    date?: Array<Date>;
}

/**
 * Корзина запросов
 */
export default class ARequestsButch {
    protected __requests: AdmissionRequest[] = [];

    /**
     * Конструктор
     * @param requests
     */
    public constructor(requests: AdmissionRequest[]) {
        this.__requests = requests;
    }

    /**
     * Возвращает запросы (возможна фильтрация)
     * @param {IARequestsButchFilter} options
     */
    public getList(options?: IARequestsButchFilter): AdmissionRequest[] {
        function __arrayFormat(val: any | any[], f?: (v: any) => any): any {
            if (!(val instanceof Array)) val = [val];
            if (f) val = val.map(f);
            return val;
        }

        if (options) {
            if (options.original) options.original = __arrayFormat(options.original);
            if (options.conditions) options.conditions = __arrayFormat(options.conditions);
            if (options.spec) options.spec = __arrayFormat(options.spec, v => v instanceof Specialisation ? v.name : v);
            if (options.date) options.date = __arrayFormat(options.date, DateUtils.getRusDateString);
            if (options.name) options.name = __arrayFormat(options.name);

            return this.__requests.filter(value => {
                if (options.conditions !== undefined && !options.conditions.includes(value.type)) return false;
                if (options.original !== undefined && !options.original.includes(value.original)) return false;
                if (options.spec !== undefined && !options.spec.includes(value.spec)) return false;
                if (options.date !== undefined && !options.date.includes(value.date)) return false;
                if (options.name !== undefined && !options.name.includes(value.name)) return false;
                return true;
            });
        } else {
            return this.__requests;
        }
    }

    /**
     * Создает JSON из корзины
     */
    public getJson(): string {
        return JSON.stringify(this.getList().map((value: any) => {
            value.date = DateUtils.getRusDateString(value.date);
            return value;
        }), null, 2);
    }
}