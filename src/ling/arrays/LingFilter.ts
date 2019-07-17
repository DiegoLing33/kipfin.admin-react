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
 *   Файл создан: 2019-07-16 16:20
 *
 *   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
 */


/**
 * Фильтр
 */
export interface ILingFilter {
    [name: string]: (any[] | any);
}

/**
 * Фильтр
 */
export interface ILingFilterHandler {
    [name: string]: (item: any) => any;
}

export type TLingFilterSource = any[];

declare global {
    interface Array<T> {
        /**
         * Фильтрует массив
         * @param filter
         * @param handler
         */
        lingFilter<T>(this: T[], filter: ILingFilter, handler?: ILingFilterHandler): T[];
    }
}

/**
 * Расширенный фильтр массивов
 * @version 1.0
 * @author Diego Ling
 */
export default class LingFilter {

    protected __src: TLingFilterSource;
    protected __filterEmpty = false;

    /**
     * Конструктор
     * @param src
     */
    public constructor(src: TLingFilterSource) {
        this.__src = src;
    }

    /**
     * Больше или равно
     * @param value
     * @constructor
     */
    public static MoreEqualFilter = (value: number) => (v: any) => v >= value;

    /**
     * Меньше или равно
     * @param value
     * @constructor
     */
    public static LessEqualFilter = (value: number) => (v: any) => v <= value;

    /**
     * Меньше
     * @param value
     * @constructor
     */
    public static LessFilter = (value: number) => (v: any) => v < value;

    /**
     * Больше
     * @param value
     * @constructor
     */
    public static MoreFilter = (value: number) => (v: any) => v > value;

    /**
     * Равно
     * @param value
     * @constructor
     */
    public static EqualFilter = (value: number) => (v: any) => v === value;

    /**
     * Удаляет пустые массивы
     * @param obj
     */
    protected static filterEmptyItems(obj: { [name: string]: any[] }): { [name: string]: any[] } {
        let newObj: any = {};
        Object.keys(obj).forEach(key => {
            if (obj[key].length > 0) newObj[key] = obj[key];
        });
        return newObj;
    }

    /**
     * Очищает пустые фильтры
     */
    public filterEmpty(): LingFilter {
        this.__filterEmpty = true;
        return this;
    }

    /**
     * Возвращает фильтрованный массив
     * @param filter    - фильтры
     * @param handler   - обработчик
     */
    public filter(filter: ILingFilter, handler: ILingFilterHandler = {}): any[] {
        if(this.__filterEmpty) filter = LingFilter.filterEmptyItems(filter);
        let array = this.__src;
        // Format filter values
        Object.keys(filter).forEach(key => {
            if (!(filter[key] instanceof Array)) filter[key] = [filter[key]];
            if (handler.hasOwnProperty(key)) filter[key] = filter[key].map((v: any) => handler[key](v));
        });
        // Format values
        array = array.map(function(value) {
            Object.keys(value).forEach(key => {
                if (handler.hasOwnProperty(key)) value[key] = handler[key](value[key]);
            });
            return value;
        });
        // console.log(array);
        // console.log(filter);

        return array.filter(value => {
            // Filtering keys
            for (const filterKey in filter) {
                // If value has a key
                if (filter.hasOwnProperty(filterKey)
                    && value.hasOwnProperty(filterKey)) {
                    // All keys have
                    if (typeof filter[filterKey][0] === "function") {
                        if (!filter[filterKey][0](value[filterKey])) return false;
                    } else {
                        if (!((filter[filterKey] as any[]).includes(value[filterKey]))) return false;
                    }
                } else return false;
            }
            return true;
        });
    }

}
