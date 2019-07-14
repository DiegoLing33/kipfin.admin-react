/**
 * Перечисления условий договоров
 */
export enum AdmissionRequestCondition {
    Paid = "Договор",
    Free = "Бюджет",
    NotMind = "Бюджет/Договор"
}

/**
 * Параметры заявки
 */
export interface AdmissionRequestProps {
    type?: AdmissionRequestCondition,
    original?: boolean;
    rate?: number;
    date?: Date;
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

    public readonly type: AdmissionRequestCondition;
    public readonly original: boolean;
    public readonly rate: number;
    public readonly date: Date;


    /**
     * The constructor
     */
    constructor(props: AdmissionRequestProps) {
        /**
         * Тип договора
         * @type {string}
         */
        this.type = props.type || AdmissionRequestCondition.Paid;

        /**
         * Оригинал
         * @type {boolean}
         */
        this.original = props.original || false;

        /**
         * The rate value
         * @type {number}
         */
        this.rate = props.rate || 0;

        /**
         * The date
         * @type {Date}
         */
        this.date = props.date || new Date();
    }

}
