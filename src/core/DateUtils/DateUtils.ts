/*
 *
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
 *  ,--. o                   |    o
 *  |   |.,---.,---.,---.    |    .,---.,---.
 *  |   |||---'|   ||   |    |    ||   ||   |
 *  `--' ``---'`---|`---'    `---'``   '`---|
 *             `---'                    `---'
 *
 *   Copyright (C) 2016-2017, Yakov Panov (Yakov Ling)
 *   Mail: <diegoling33@gmail.com>
 *
 *   Это программное обеспечение имеет лицензию, как это сказано в файле
 *   COPYING, который Вы должны были получить в рамках распространения ПО.
 *
 *   Использование, изменение, копирование, распространение, обмен/продажа
 *   могут выполняться исключительно в согласии с условиями файла COPYING.
 *
 *   Файл создан: 2019-06-29 01:02
 *
 *   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
 */

/**
 * The utilities: Date and time
 */
export default class DateUtils {

    /**
     * Returns the date of the today
     * @return {Date}
     */
    static getToday(): Date {
        // 0 - sunday
        // 1 - monday
        let rawDate   = new Date();
        let weekDay   = rawDate.getDay();
        let backIndex = 0;

        if (weekDay === 6) backIndex = 1;
        else if (weekDay === 0) backIndex = 2;

        return DateUtils.getDateBackTo(rawDate, backIndex);
    }

    /**
     * Возвращает сформированную русскую дату
     * @param date
     */
    static getRusDateString(date: Date): string{
        return [
            String(date.getDate()).padStart(2, "0"),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getFullYear())
        ].join(".");
    }

    /**
     * Returns the day of weec name
     * @param date
     */
    static getRusDayOfWeek(date: Date): string{
        switch (date.getDay()) {
            default:
            case 1: return "Понедельник";
            case 2: return "Вторник";
            case 3: return "Среда";
            case 4: return "Четверг";
            case 5: return "Пятница";
            case 6: return "Суббота";
            case 0: return "Воскресенье";
        }
    }

    /**
     * Returns the Date object from Russian Date Standard
     * @param strDate
     * @return {Date}
     */
    static getDateFromRusFormat(strDate: string): Date {
        let di = String(strDate).split("."); //22.05.2019 -> [Date Object]
        return new Date(parseInt(di[2]), parseInt(di[1]) - 1, parseInt(di[0]));
    }

    /**
     * Returns true if the sourceDate is a weekends.
     * @param sourceDate
     * @return {boolean}
     */
    static isDateNotAWorkDay(sourceDate: Date): boolean {
        let weekDay = sourceDate.getDay();
        return weekDay === 6 || weekDay === 0;
    }

    /**
     * Returns true if the sourceDate is a working week.
     * @param sourceDate
     * @return {boolean}
     */
    static isDateAWorkDay(sourceDate: Date): boolean {
        return !DateUtils.isDateNotAWorkDay(sourceDate);
    }

    /**
     * Returns the new date backed by backIndex days
     *
     * @param sourceDate
     * @param backIndex
     * @return {Date}
     */
    static getDateBackTo(sourceDate: Date, backIndex: number): Date {
        return new Date(new Date().setDate(sourceDate.getDate() - backIndex))
    }

}
