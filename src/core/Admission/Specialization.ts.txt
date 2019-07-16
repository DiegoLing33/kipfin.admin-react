/**
 * The specialization props
 */
import AdmissionRequest, {AdmissionRequestCondition} from "./AdmissionRequest";

export interface SpecializationProps {
    title?: string;
    shortTitle?: string;
    key?: string;
}

/**
 * Специальность
 */
export default class Specialization {

    protected items: AdmissionRequest[] = [];
    public title: string;
    public shortTitle: string;
    public key: string;
    public filter?: (value: AdmissionRequest) => void;
    public onlyOriginals: boolean = false;

    public bounds: { [key: string]: number } = {};

    /**
     * Constructor.
     * @param props
     */
    constructor(props: SpecializationProps) {
        this.title = props.title || "";
        this.shortTitle = props.shortTitle || "";
        this.key = props.key || "";

        this.bounds[AdmissionRequestCondition.Paid] = 50;
        this.bounds[AdmissionRequestCondition.Free] = 50;
    }

    /**
     * Возвращает проходной бал для условий обучения
     */
    getBoundRate(condition: AdmissionRequestCondition | string): number {
        const paids = this.getOriginalsByCondition(condition).sort((a, b) => a.rate + b.rate);
        const result = paids.length < this.bounds[condition] ? paids.pop()! : paids[this.bounds[condition] - 1];
        return result.rate;
    }

    clear() {
        this.items = [];
    }

    /**
     * Возвращает все заявки
     */
    getItemsAll(){
        return this.items;
    }

    /**
     * Возвращает только оригиналы
     */
    getItemsOriginals(){
        return this.items.filter(value => value.original);
    }

    /**
     * Возвращает заявления на пступления
     * @return {AdmissionRequest[]}
     */
    getItems() {
        if (this.onlyOriginals) return this.items.filter(v => v.original);
        if (this.filter) return this.items.filter(this.filter);
        return this.items;
    }

    /**
     * Возвращает список оригиналов по условию
     * @param condition
     */
    getOriginalsByCondition(condition: AdmissionRequestCondition | string): AdmissionRequest[] {
        return this.items.filter(value => (value.type === condition || value.type === AdmissionRequestCondition.NotMind) && value.original);
    }

    /**
     * Returns the middle rate value
     * @return {number}
     */
    getMiddleRate(): number {
        let sum = 0;
        this.getItems().forEach(v => {
            sum += v.rate;
        });
        return Math.round(sum / this.getItems().length * 100) / 100;
    }

    /**
     * Returns the middle rate value
     * @param condition
     * @return {number}
     */
    getMiddleRateOfCondition(condition: AdmissionRequestCondition | string): number {
        let sum = 0;
        this.getItems().filter(value => value.type === AdmissionRequestCondition.NotMind || condition).forEach(v => {
            sum += v.rate;
        });
        return Math.round(sum / this.getItems().length * 100) / 100;
    }

    /**
     * Returns the count of items
     * @return {number}
     */
    getCount(): number {
        return this.getItems().length;
    }

    /**
     * Возвращает заявления по условию обучения
     * @param condition
     */
    getItemsByCondition(condition: AdmissionRequestCondition): AdmissionRequest[] {
        return this.getItems().filter(value => value.type === condition);
    }

    /**
     * Добавялет заявление
     * @param admission
     */
    public add(admission: AdmissionRequest): void {
        this.items.push(admission);
    }

}

