import GKFRequests, {GKFRequestsResponse} from "../GKFRequests";
import Auth from "../Auth";

export interface AdmissionTask {
    id: number;
    creatorLogin: string;
    completerLogin: string;
    text: string;
    date: string;
    state: number;
}

export enum AdmissionTaskStateString {
    Completed = "Выполнено",
    Open = "Открыто",
    Canceled = "Отменено"
}

/**
 * Менеджер задач
 */
export default class AdmissionTaskManager {

    /**
     * Загружает задачи
     * @param callback
     * @param except
     */
    static loadTasks(callback: ((tasks: AdmissionTask[]) => void), except: number[] = []) {
        GKFRequests.sendGETRequest("Admission.Tasks.List", {except})
            .then(response => {
                if(response.ok){
                    callback((response.list as any[]).map(value => {
                        value.id = parseInt(value.id);
                        value.state = parseInt(value.state);
                        return value;
                    }));
                }
            });
    }

    /**
     * Отправляет состояние задания
     *
     * @param taskId
     * @param state
     * @param callback
     */
    static sendTaskState(taskId: number, state: number, callback: (response: GKFRequestsResponse) => void){
        GKFRequests.sendPOSTRequest("Admission.Tasks.SetState", {
            id: taskId, state, user_id: Auth.me!.user_id
        }).then(response => {
            callback(response);
        });
    }

    /**
     * Возвращает текст состояния по id
     * @param stateId
     */
    static getStateStringByStateId(stateId: number): string{
        switch (stateId) {
            default:
            case 1: return AdmissionTaskStateString.Open;
            case 2: return AdmissionTaskStateString.Completed;
            case 3: return AdmissionTaskStateString.Canceled;
        }
    }

}