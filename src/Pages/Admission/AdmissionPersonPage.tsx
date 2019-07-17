import React from "react";
import WrapperView from "../../Template/WrapperView";
import {Alert, Divider, Input} from "antd";

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
 *   Файл создан: 2019-07-17 15:49
 *
 *   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
 */

/**
 * Страница поиска человека
 */
export default class AdmissionPersonPage extends React.Component {

    public render(): React.ReactNode {
        return <WrapperView title={"Поиск абитуриента"}>
            <Alert message={"Здесь Вы можете полуить подробную информацию об абитуриенте."}/>
            <Divider>Поиск абитуриента</Divider>
            <div style={{textAlign: "center", padding: 15, paddingTop: 0, opacity: 0.5}}>
                Введите фамилию имя и отчество абитуриента.
            </div>
            <Input placeholder={"Например, Хекоян Эрик"}/>
            <div>

            </div>
        </WrapperView>
    }

}
