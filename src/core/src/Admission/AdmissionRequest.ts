/**
 * Перечисления условий договоров
 */
import DateUtils from "../DateUtils/DateUtils";
import {AConditions} from "./AConditions";

/**
 * Параметры заявки
 */
export interface AdmissionRequestProps {
    type?: AConditions,
    original?: boolean|string;
    rate?: number;
    date?: Date|string;
    name?: string;
    spec?: string;
}

/**
 * Заявление на поступление
 */
export default class AdmissionRequest {

    /**
     * Преобразует строку в балл
     * @param str
     */
    static getRate(str: string): number{
        try {
            return parseFloat(str.replace(",", "."));
        }catch {
            return 0.0;
        }
    }

    public readonly type: AConditions;
    public readonly original: boolean;
    public readonly rate: number;
    public readonly date: Date;
    public readonly name: string;
    public readonly spec: string;


    /**
     * The constructor
     */
    constructor(props: AdmissionRequestProps) {
        /**
         * Тип договора
         * @type {string}
         */
        this.type = props.type || AConditions.Paid;


        if(props.original !== undefined && typeof props.original === "string") props.original = props.original.includes("гинал");
        this.original = props.original || false;

        /**
         * The rate value
         * @type {number}
         */
        this.rate = props.rate || 0;

        if(props.date){
            if(typeof props.date === "string") this.date = DateUtils.getDateFromRusFormat(props.date);
            else this.date = props.date || new Date();
        }else {
            this.date = new Date();
        }
        this.name = props.name || "Unnamed";
        this.spec = props.spec || "SPO";
    }

}
