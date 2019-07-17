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
 *   Файл создан: 2019-07-17 13:31
 *
 *   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
 */

import {List, Modal} from "antd";
import * as React from "react";
import AdmissionTablePage from "../AdmissionTablePage";

/**
 * Модальное окно
 * @param props
 * @constructor
 */
export default function AdmissionTableModalComponent(props: { table: AdmissionTablePage }) {
    let searchModalPerson: any = props.table.state.searchModalPerson;
    if (searchModalPerson === "") return null;
    if (searchModalPerson !== "") searchModalPerson = JSON.parse(searchModalPerson);
    return (
        <Modal title={searchModalPerson.fioValue} visible={searchModalPerson !== ""}
               onCancel={() => props.table.setState({searchModalPerson: ""})}
               onOk={() => props.table.setState({searchModalPerson: ""})}
        >
            <h1>Абитуриент</h1>
            <List bordered header={searchModalPerson.fioValue}>
                <List.Item>{searchModalPerson.phoneValue}</List.Item>
            </List>
            <h1 style={{marginTop: 20}}>Родитель</h1>
            <List bordered header={searchModalPerson.fioRepr}>
                <List.Item>{searchModalPerson.phoneValueRepr}</List.Item>
            </List>
        </Modal>
    );
}
