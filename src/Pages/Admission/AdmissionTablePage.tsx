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
 *   Файл создан: 2019-07-15 12:36
 *
 *   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
 */

import * as React from "react";
import WrapperView from "../../Template/WrapperView";
import AdmissionRequest, {AdmissionRequestProps} from "../../core/Admission/AdmissionRequest";
import {Button, Divider, Icon, Input, List, notification, Table} from "antd";
import Highlighter from "react-highlight-words";
import Specialisation, {ISpecialisation} from "../../core/University/Specialisation";
import {AConditions} from "../../core/Admission/AConditions";
import {PaginationConfig} from "antd/lib/pagination";
import KFWebApi from "../../core/API/KFWebApi";
import User from "../../core/auth/User";
import AdmissionTableFilterComponent from "./AdmissionTable/AdmissionTableFilterComponent";
import AdmissionTableModalComponent from "./AdmissionTable/AdmissionTableModalComponent";

interface IAdmissionTablePageStates {
    dataSource: any;
    searchText: string;
    searchRateMin: string;
    searchRateMax: string;
    searchModalPerson: any;
}

/**
 * Таблица студентов
 */
export default class AdmissionTablePage extends React.Component<any, IAdmissionTablePageStates> {

    state = {
        dataSource:        [],
        searchText:        '',
        searchRateMin:     '',
        searchRateMax:     '',
        searchModalPerson: "",
    };

    public loadedSpecialities: ISpecialisation[] = [];
    public loadedData: AdmissionRequestProps[]   = [];
    public searchInput: any                      = null;
    public lastFilter: any                       = {};

    /**
     * Компонент загружен
     */
    public componentDidMount(): void {
        this.update();
    }

    /**
     * Создает фильтр по специальностям
     */
    public createSpecialisationFilter(): any {
        return this.loadedSpecialities.map(value => {
            return {
                text:  value.name,
                value: value.name,
            }
        });
    }

    /**
     * Создает фильтр условий
     */
    public createConditionsFilter(): any {
        return [
            {text: AConditions.Free, value: AConditions.Free},
            {text: AConditions.Paid, value: AConditions.Paid},
            {text: AConditions.NotMind, value: AConditions.NotMind},
        ]
    }

    /**
     * Поиск по имени
     * @param dataIndex
     */
    getColumnSearchProps = (dataIndex: React.ReactText) => ({
        filterDropdown: (props: { setSelectedKeys: any, selectedKeys: any, confirm: any, clearFilters: any }) => {
            const handleSearch = (selectedKeys: any, confirm: any) => {
                confirm();
                this.setState({searchText: selectedKeys[0]});
            };

            const handleReset = (clearFilters: any) => {
                clearFilters();
                this.setState({searchText: ''});
            };

            return (
                <div style={{padding: 8}}>
                    <Input
                        ref={node => this.searchInput = node}
                        placeholder={`Поиск ${dataIndex}`}
                        value={props.selectedKeys[0]}
                        onChange={e => props.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(props.selectedKeys, props.confirm)}
                        style={{width: 188, marginBottom: 8, display: 'block'}}
                    />
                    <Button type="primary" onClick={() => handleSearch(props.selectedKeys, props.confirm)}
                            icon="search" size="small" style={{width: 90, marginRight: 8}}>
                        Искать
                    </Button>
                    <Button onClick={() => handleReset(props.clearFilters)} size="small" style={{width: 90}}>
                        Сброс
                    </Button>
                </div>
            );
        },

        filterIcon: (filtered: any) => <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}}/>,

        onFilter:                      (value: any, record: any) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible: any) => (visible) ? setTimeout(() => this.searchInput.select()) : null,
        render:                        (text: any) => (
            <Highlighter
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });

    /**
     * Загружает JSON
     */
    public loadEnterPeopleDataJSON(): Promise<AdmissionRequestProps[]> {
        return new Promise<AdmissionRequestProps[]>(resolve => {
            const xhr  = new XMLHttpRequest();
            const url  = "http://api2.kipfin.ru/data/data.json?" + Date.now();
            xhr.onload = () => {
                resolve(JSON.parse(xhr.responseText) as AdmissionRequestProps[]);
            };
            xhr.open("GET", url);
            xhr.send();
        });
    }

    /**
     * Обновляет данные
     */
    public update() {
        Specialisation.loadSpecialisations().then(specs => {
            this.loadedSpecialities = specs;
            this.loadEnterPeopleDataJSON().then(res => {
                this.loadedData = this.sortRequestsByRate(res.map((val: any) => {
                    val.original = val.original === "Оригинал" ? "Оригинал" : "Нет";
                    val.rate     = AdmissionRequest.getRate(String(val.rate));
                    return val;
                }));
                this.setState({dataSource: this.loadedData});
            });
        });
    }

    /**
     * Сортирует запросы по балу
     * @param requests
     */
    public sortRequestsByRate(requests: AdmissionRequestProps[]): AdmissionRequestProps[] {
        return requests.sort((a: any, b: any) => a.rate > b.rate ? -1 : 1).map((value: any, index: number) => {
            value.key = (index + 1);
            return value;
        });
    }

    /**
     * Возвращает максимальный и минимальный порог
     */
    public getMaxMin(): { max: number, min: number } {
        let max = 5;
        let min = 0;
        if (this.state.searchRateMax === "") max = 5;
        else max = AdmissionRequest.getRate(this.state.searchRateMax);
        if (this.state.searchRateMin === "") min = 0;
        else min = AdmissionRequest.getRate(this.state.searchRateMin);
        return {max, min};
    }

    /**
     * Отображает условия фильтрации
     * @param filter
     * @param bounds
     */
    protected displayFilterConditions(filter: { [name: string]: any[] }, bounds: any) {
        let items: any[] = [];
        Object.keys(filter).forEach(value =>
            items.push(<List.Item key={value}>{filter[value].join(", ")}</List.Item>));
        items.push((<List.Item key="bound">Границы балла: от {bounds.min} до {bounds.max}</List.Item>));
        notification.open({
            message:     "Условия сортировки изменены",
            description: <List bordered={true}>{items}</List>
        });
    }

    /**
     * Статистическая сортировка
     * @param filter
     */
    staticSorting(filter?: any) {
        filter       = filter || this.lastFilter;
        const bounds = this.getMaxMin();
        this.displayFilterConditions(filter, bounds);
        this.setState({
            dataSource: this.sortRequestsByRate(this.loadedData.lingFilter({
                ...filter,
                name: (v: any) => true,
                rate: (v: any) => {
                    v = AdmissionRequest.getRate(String(v));
                    return v >= bounds.min && v <= bounds.max
                },
            }))
        });
    }

    /**
     * Отлавливает изменения в таблице
     *
     * @param pagination
     * @param filter
     * @param sorter
     */
    handleTableChanges(pagination: PaginationConfig, filter: any, sorter: any) {
        this.lastFilter = filter;
        this.staticSorting(filter);
    }

    /**
     * Отображает модальное окно с абитуриентом по имени
     * @param name
     */
    public findNameAndDisplayModal(name: any) {
        KFWebApi.request("admission.find")
            .argsGet({name: name, token: User.getToken()})
            .send()
            .then(res => {
                if (res.ok) {
                    this.setState({searchModalPerson: res.data});
                } else {
                    notification.open({message: "Абитуриент не найден"});
                    this.setState({searchModalPerson: ""});
                }
            });
    }

    /**
     * Рендер
     */
    public render(): React.ReactNode {
        return <WrapperView title={"Список абитуриентов"}
        description={<div>
            <p>Здесь находится полный список абитуриентов, которые подали заявления.</p>
            <p>
                Примеры использования раздела:
            </p>
            <div>
                Как ответить на вопрос "<b>Какое место в рейтинге на ПКС у Ильи?</b>":
                <ol>
                    <li>Установить фильтр <b>Специальность</b>: Программирование в компьютерных системах.</li>
                    <li>Установить фильтр <b>Условия</b>: Бюджет и Бюджет/Договор.</li>
                    <li>Использовать <b>Поиск по имени</b>.</li>
                    <li>Результат и Ваш ответ будет находится в первой колонке (<b>#</b>).</li>
                </ol>
            </div>
            <div>
                Как получить номера телефона всех абитуриентов без оригиналов на бюджет с высоким баллом:
                <ol>
                    <li>Установить фильтр <b>Условия</b>: Бюджет и Бюджет/Договор.</li>
                    <li>Установить фильтр <b>Оригинал</b>: Не оригинал.</li>
                    <li>Установить <b>Фильтрация по баллу</b> необходимым образом.</li>
                    <li>Использовать пиктограмму человека в последнем столбце. Если абитуриент использовал сервис go.kipfin.ru, то телефон будет.</li>
                </ol>
            </div>
        </div>}
        >
            <AdmissionTableModalComponent table={this}/>
            <AdmissionTableFilterComponent table={this}/>
            <Divider>Таблица абитуриентов</Divider>
            <Table bordered dataSource={this.state.dataSource} onChange={(p, f, s) => this.handleTableChanges(p, f, s)}
                   pagination={{pageSize: 80}}
                   columns={[
                       {title: "#", dataIndex: "key", key: "key"},
                       {title: "Имя", dataIndex: "name", key: "name", ...this.getColumnSearchProps("name")},
                       {title: "Балл", dataIndex: "rate", key: "rate"},
                       {
                           title:   "Специальность", dataIndex: "spec", key: "spec",
                           filters: this.createSpecialisationFilter()
                       },
                       {
                           title:     "Оригинал",
                           dataIndex: "original",
                           key:       "original",
                           filters:   [{text: 'Оригинал', value: 'Оригинал'}, {text: 'Не оригинал', value: 'Нет'}]
                       },
                       {title: "Условия", dataIndex: "type", key: "type", filters: this.createConditionsFilter()},
                       {
                           title:  "", dataIndex: "load", key: "load",
                           render: (text, record: AdmissionRequestProps) =>
                                       <Button icon={"user"}
                                               onClick={(e) => this.findNameAndDisplayModal(record.name)}/>,
                       }
                   ]}/>
        </WrapperView>;
    }

}
