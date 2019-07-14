import Specialisation from "../../University/Specialisation";
import {AConditions} from "../AConditions";

/**
 * Минимальный проходной балл
 */
export default interface MinGoScoreValue {
    specialisation: Specialisation;
    type: AConditions | string;
    value: number;
    controlNumber: number;
}