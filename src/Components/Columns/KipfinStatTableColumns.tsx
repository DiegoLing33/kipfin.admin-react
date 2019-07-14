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
 *   Файл создан: 2019-06-29 00:52
 *
 *   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
 */

/**
 * The columns collection
 */
const KipfinStatTableColumns = {

    /**
     * The table indicates fill level
     */
    SpecsCountFillTable: [
        {
            title: "Спец.",
            dataIndex: "spec",
            key: "spec"
        },
        {
            title: 'Д',
            dataIndex: 'd',
            key: 'd',
        },
        {
            title: 'Б',
            dataIndex: 'b',
            key: 'b',
        },
        {
            title: '/',
            dataIndex: 'dnb',
            key: 'dnb',
        },
        {
            title: 'Всего',
            dataIndex: 'all',
            key: 'all',
        },
    ],

    /**
     * The count of people came that days table
     */
    DateCountPeopleTable: [
        {
            title: "Дата",
            dataIndex: "date",
            key: "date"
        },
        {
            title: "Кол-во",
            dataIndex: "count",
            key: "count"
        }
    ]
};

export default KipfinStatTableColumns;
