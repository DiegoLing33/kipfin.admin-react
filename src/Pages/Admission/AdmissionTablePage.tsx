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
import {Button, Icon, Input, Table} from "antd";
import Highlighter from "react-highlight-words";
import Specialisation, {ISpecialisation} from "../../core/University/Specialisation";
import {AConditions} from "../../core/Admission/AConditions";

interface IAdmissionTablePageStates {
    dataSource: any,
    searchText: string,
    searchRateMin: string,
    searchRateMax: string,
}

/**
 * Таблица студентов
 */
export default class AdmissionTablePage extends React.Component<any, IAdmissionTablePageStates> {

    state = {
        dataSource:    [],
        searchText:    '',
        searchRateMin: '',
        searchRateMax: '',
    };

    public loadedSpecialities: ISpecialisation[] = [];
    public loadedData: AdmissionRequestProps[]   = [];
    public searchInput: any                      = null;
    public searchRateMaxInput: any               = null;
    public searchRateMinInput: any               = null;

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
                        ref={node => {
                            this.searchInput = node;
                        }}
                        placeholder={`Поиск ${dataIndex}`}
                        value={props.selectedKeys[0]}
                        onChange={e => props.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(props.selectedKeys, props.confirm)}
                        style={{width: 188, marginBottom: 8, display: 'block'}}
                    />
                    <Button
                        type="primary"
                        onClick={() => handleSearch(props.selectedKeys, props.confirm)}
                        icon="search"
                        size="small"
                        style={{width: 90, marginRight: 8}}
                    >
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


    getMinMaxColumnSearchProps = (dataIndex: React.ReactText) => ({
        filterDropdown: (props: { setSelectedKeys: any, selectedKeys: any, confirm: any, clearFilters: any }) => {
            const handleSearch = (selectedKeys: any, confirm: any) => {
                confirm();
                this.setState({searchRateMin: selectedKeys[0]});
            };

            const handleReset = (clearFilters: any) => {
                clearFilters();
                this.setState({searchRateMin: ''});
            };

            return (
                <div style={{padding: 8}}>
                    <Input
                        ref={node => {
                            this.searchRateMinInput = node;
                        }}
                        placeholder={`Минимальный порог`}
                        value={props.selectedKeys[0]}
                        onChange={e => props.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(props.selectedKeys, props.confirm)}
                        style={{width: 188, marginBottom: 8, display: 'block'}}
                    />
                    <Button
                        type="primary"
                        onClick={() => handleSearch(props.selectedKeys, props.confirm)}
                        icon="search"
                        size="small"
                        style={{width: 90, marginRight: 8}}
                    >
                        Искать
                    </Button>
                    <Button onClick={() => handleReset(props.clearFilters)} size="small" style={{width: 90}}>
                        Сброс
                    </Button>
                </div>
            );
        },

        filterIcon: (filtered: any) => <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}}/>,
        onFilter:   (value: any, record: any) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    });

    /**
     * Загружает JSON
     */
    public loadJSON(): Promise<AdmissionRequestProps[]> {
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
            this.loadJSON().then(res => {
                this.loadedData = res.map((val: any) => {
                    val.original = val.original === "Оригинал" ? "Оригинал" : "Нет";
                    val.rate     = parseFloat(val.rate);
                    return val;
                }).sort((a: any, b: any) => a.rate > b.rate ? -1 : 1).map((value: any, index: number) => {
                    value.key = (index + 1);
                    return value;
                });
                this.setState({dataSource: this.loadedData});
            });
        });
    }

    /**
     * Отлавливает изменения в таблице
     *
     * @param pagination
     * @param filter
     * @param sorter
     */
    handleTableChanges(pagination: any, filter: any, sorter: any) {
        console.log(filter);
        if(filter.hasOwnProperty("rate") && filter.rate.lenght > 0)
            filter.rate = [AdmissionRequest.getRate(filter.rate[0])];
        // TODO таблица
        this.setState({
            dataSource: this.loadedData.filter((value: any) => {
                if (filter.hasOwnProperty("name")) delete filter["name"];
                const keys = Object.keys(filter);

                return keys.filter((a: string) => filter[a].length > 0).every(key => {
                    if(key === "rate") {
                        console.log(key, value.rate, AdmissionRequest.getRate(filter.rate[0]));
                        return value.rate >= filter.rate[0];
                    }
                    return filter[key].indexOf(value[key]) > -1;
                });
            }).sort((a: any, b: any) => a.rate > b.rate ? -1 : 1).map((value: any, index: number) => {
                value.key = (index + 1);
                return value;
            })
        });
    }

    /**
     * Рендер
     */
    public render(): React.ReactNode {
        return <WrapperView title={"Список абитуриентов"}>
            <Table bordered dataSource={this.state.dataSource} onChange={(p, f, s) => this.handleTableChanges(p, f, s)}
                   pagination={{pageSize: 80}}
                   columns={[
                       {title: "#", dataIndex: "key", key: "key"},
                       {title: "Имя", dataIndex: "name", key: "name", ...this.getColumnSearchProps("name")},
                       {title: "Балл", dataIndex: "rate", key: "rate", ...this.getMinMaxColumnSearchProps("rate")},
                       {
                           title:     "Специальность",
                           dataIndex: "spec",
                           key:       "spec",
                           filters:   this.createSpecialisationFilter()
                       },
                       {
                           title:     "Оригинал",
                           dataIndex: "original",
                           key:       "original",
                           filters:   [{text: 'Оригинал', value: 'Оригинал'}, {text: 'Не оригинал', value: 'Нет'}]
                       },
                       {
                           title:   "Условия", dataIndex: "type", key: "type",
                           filters: this.createConditionsFilter()
                       },
                   ]}/>
        </WrapperView>;
    }

}
