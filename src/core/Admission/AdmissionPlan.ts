import DateUtils from "../DateUtils/DateUtils";
import KFWebApi from "../API/KFWebApi";

export interface IAdmissionPlan {
    admission_id?: number | string;
    spec_id?: number | string;
    free_count?: number | string;
    paid_count?: number | string;
    year?: number | string;
}

/**
 * План набора
 */
export default class AdmissionPlan {

    /**
     * Загружает планы
     */
    public static async loadAdmissionPlans(): Promise<AdmissionPlan[]> {
        return new Promise<AdmissionPlan[]>((resolve, reject) => {
            KFWebApi.request("admission.plan")
                .argsGet({year: DateUtils.getToday().getFullYear()})
                .send()
                .then(response => {
                    if (response.ok) resolve((response.list as any[]).map(value => new AdmissionPlan(value)));
                    else reject("Something went wrong in API.");
                });
        });
    }

    public readonly admissionId: number;
    public readonly specId: number;
    public readonly freeCount: number;
    public readonly paidCount: number;
    public readonly year: number;

    /**
     * Конструктор
     * @param props
     */
    public constructor(props: IAdmissionPlan) {
        const __sti = (v: any, d: number = 0) => v !== undefined ? (typeof v === "string" ? parseInt(v, 10) : v) : d;
        this.admissionId = __sti(props.admission_id);
        this.specId = __sti(props.spec_id);
        this.freeCount = __sti(props.free_count);
        this.paidCount = __sti(props.paid_count);
        this.year = __sti(props.year, 2000);
    }

}