/**
 * Менеджер заявок
 */
import AdmissionRequest, {AdmissionRequestCondition} from "./AdmissionRequest";
import DateUtils from "../DateUtils/DateUtils";
import Specialization from "./Specialization";

const PKS = new Specialization({
    title: "Программирование в компьютерных системах",
    shortTitle: "ПКС",
    key: "PKS"
});

PKS.bounds[AdmissionRequestCondition.Free] = 50;
PKS.bounds[AdmissionRequestCondition.Paid] = 0;

const OIBAS = new Specialization({
    title: "Обеспечение информационной безопасности автоматизированных систем",
    shortTitle: "ОИБАС",
    key: "OIBAS"
});

OIBAS.bounds[AdmissionRequestCondition.Free] = 50;
OIBAS.bounds[AdmissionRequestCondition.Paid] = 50;

const ISIP = new Specialization({
    title: "Информационные системы и программирование",
    shortTitle: "ИСИП",
    key: "ISIP"
});

ISIP.bounds[AdmissionRequestCondition.Free] = 0;
ISIP.bounds[AdmissionRequestCondition.Paid] = 150;

const getSpecIndexByTitle = function(title: string) {
    let index = -1;
    for (const i in SpecializationsList)
        if (SpecializationsList.hasOwnProperty(i))
            if (SpecializationsList[i].title === title) index = parseInt(i);
    return index;
};

const SpecializationsList: Specialization[] = [PKS, OIBAS, ISIP];

export {PKS, OIBAS, ISIP, SpecializationsList, getSpecIndexByTitle};

export interface IFormattedChangesArray {
    name: string;
    change: string;
    date: Date | any;
    value: any;
    was: any;
}

/**
 * Менеджер заявок
 */
export default class AdmissionRequestsManager{

    /**
     * Загружает заявки
     * @param callback
     */
    static loadRequests(callback: () => void){
        SpecializationsList.forEach(value => value.clear());
        const xhr = new XMLHttpRequest();
        const url = "http://stat.kipfin.ru/php/data.json?" + Date.now();
        xhr.onload = () => {
            let data = JSON.parse(xhr.responseText);
            for (let row of data) {
                let specIndex = getSpecIndexByTitle(row.spec);
                let spec = SpecializationsList[specIndex];
                spec.add(new AdmissionRequest({
                    rate: row.rate,
                    type: row.type,
                    original: row.original === "Оригинал",
                    date: DateUtils.getDateFromRusFormat(row.date)
                }));
            }
            callback();
        };
        xhr.open("GET", url);
        xhr.send();
    }

    /**
     * Загружает изменения
     * @param callback
     */
    static loadChanges(callback: (data: IFormattedChangesArray[]) => void){
        const xhr = new XMLHttpRequest();
        const url = "http://stat.kipfin.ru/php/data.changes.json?" + Date.now();
        xhr.onload = () => {
            let data = JSON.parse(xhr.responseText);
            callback(data);
        };
        xhr.open("GET", url);
        xhr.send();
    }

}