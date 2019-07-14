import sha1 from "sha1";
import KFWebApi from "../API/KFWebApi";

export interface ISpecialisation {
    spec_id?: number;
    name?: string;
    short_name?: string;
    key_name?: string;
    code?: string;
}

/**
 * Специализация
 */
export default class Specialisation {

    /**
     * Загружает специальности
     */
    static async loadSpecialisations(): Promise<Specialisation[]> {
        return new Promise<Specialisation[]>((resolve, reject) => {
            KFWebApi.request("specs.list").send().then(resp => {
                if (resp.ok) {
                    const list: any[] = resp.list;
                    resolve(list.map(value => new Specialisation(value)));
                } else {
                    reject(resp.message || "Something went wrong.");
                }
            });
        });
    }

    public readonly specId: number|string;
    public readonly name: string;
    public readonly short: string;
    public readonly key: string;
    public readonly code: string;

    /**
     * Конструктор
     * @param props
     */
    public constructor(props: ISpecialisation) {
        const __sti = (v: any, d: number = 0) => v !== undefined ? (typeof v === "string" ? parseInt(v, 10) : v) : d;
        this.specId = __sti(props.spec_id);
        this.name = props.name || "SPEC_NAME";
        this.short = props.short_name || "SHORT";
        this.key = props.key_name || "KEY_NAME";
        this.code = props.code || "00.00.00";
    }

    /**
     * Создает токен специальности
     */
    public token(): string{
        return sha1(String(this.name+this.short+this.key+this.code+this.specId));
    }

}