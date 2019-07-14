import {AConditions} from "./AConditions";
import Specialisation from "../University/Specialisation";

/**
 * Рассказ анализатора
 */
export interface IAnalyzerSummary {
    tokens: {[token: string]: Specialisation},
    minimal: IAnalyzerMinGoScores,
    summary: IAnalyzerAdmissionSummary,
    detailed: IAnalyzerSpecialisationsSummary,
}

/**
 * Минимальный проходной балл (значение)
 */
export interface IAnalyzerMinGoScoreValue {
    type: AConditions | string;
    value: number;
    controlNumber: number;
}
/**
 * Минимальный проходной балл
 */
export interface IAnalyzerMinGoScores {
    [token: string]: IAnalyzerMinGoScoreValue;
}

/**
 * Анализ количества абитуриентов
 */
export interface IAnalyzerAdmissionSummaryCount {
    [token: string]: number
}

/**
 * Анализ данных в сумме
 */
export interface IAnalyzerAdmissionSummary {
    amount: IAnalyzerAdmissionSummaryCount;
    amountOriginals: IAnalyzerAdmissionSummaryCount;

    amountToday: IAnalyzerAdmissionSummaryCount;
    amountOriginalsToday: IAnalyzerAdmissionSummaryCount;
}

/**
 * Анализ каждой специальности
 */
export interface IAnalyzerSpecialisationInfo {
    paidCount: number;
    freeCount: number;
    notMindCount: number;
}

/**
 * Анализ количества абитуриентов
 */
export interface IAnalyzerDetailedSummaryCount {
    [token: string]: IAnalyzerSpecialisationInfo
}

/**
 * Анализ данных каждой специальности
 */
export interface IAnalyzerSpecialisationsSummary {
    all: IAnalyzerDetailedSummaryCount;
    originals: IAnalyzerDetailedSummaryCount;
}