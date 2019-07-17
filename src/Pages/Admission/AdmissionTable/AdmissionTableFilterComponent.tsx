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
 *   Файл создан: 2019-07-17 13:29
 *
 *   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
 */


import * as React from "react";
import {Button, Col, Divider, Input, List, Row} from "antd";
import AdmissionTablePage from "../AdmissionTablePage";

/**
 * Фильтр таблицы
 * @param props
 * @constructor
 */
export default function AdmissionTableFilterComponent(props: { table: AdmissionTablePage }) {
    return (
        <div>
            <Divider>Фильтры</Divider>
            <Row gutter={16} style={{marginBottom: 20}}>
                <Col span={24}>
                    <List bordered header={"Фильтрация по баллу"}>
                        <List.Item>
                            <Input allowClear placeholder={"Минимальный балл"}
                                   onChange={(e) => props.table.setState({searchRateMin: e.target.value})}
                                   onPressEnter={() => props.table.staticSorting()}/>
                        </List.Item>
                        <List.Item>
                            <Input allowClear placeholder={"Максимальный балл"}
                                   onChange={(e) => props.table.setState({searchRateMax: e.target.value})}
                                   onPressEnter={() => props.table.staticSorting()}/>
                        </List.Item>
                    </List>
                </Col>
                <Col span={24} style={{marginTop: 20}}>
                    <Button block type={"primary"} onClick={() => props.table.staticSorting()}>Применить</Button>
                </Col>
                <Col span={24} style={{marginTop: 10}}>
                    <Button block onClick={() => window.location.reload()}>Сбросить все фильтры</Button>
                </Col>
            </Row>
        </div>
    )
}
