import {Component} from "react";
import * as React from "react";
import WrapperView from "../../Template/WrapperView";
import AdmissionRequestsManager, {IFormattedChangesArray} from "../../App/Admission/AdmissionRequestsManager";
import {List, Table} from "antd";
import {AdmissionRequestCondition} from "../../App/Admission/AdmissionRequest";
import DateUtils from "../../App/DateUtils/DateUtils";

/**
 * Страница с изменениями
 */
export default class ChangesPage extends Component {

    /**
     * Состояния
     */
    state = {
        dataSource: [],
    };

    /**
     * Компонент загрузился
     */
    componentDidMount(): void {
        this.update();
    }

    /**
     * Обновление
     */
    update() {
        AdmissionRequestsManager.loadChanges(data => {
            this.setState({dataSource: data.map(value => {
                // @ts-ignore
                    value["key"] = value.name + value.change + value.date;
                return value;
                })});
        });
    }

    /**
     * Возвращает имя поля
     * @param f
     */
    getFieldName(f: string) {
        switch (f) {
            case "original":
                return "Аттестат";
            case "rate":
                return "Балл";
            case "spec":
                return "Специальность";
            case "type":
                return "Условия";
            default:
                return "?";
        }
    }

    render(): React.ReactNode {
        return <WrapperView title={"Изменения данных"}>
            <List bordered style={{marginBottom: 20}}>
                <List.Item>
                    <span>Всего изменений: {this.state.dataSource.length}</span>
                </List.Item>
                <List.Item>
                    <span>Изменений сегодня: {this.state.dataSource.filter((value: any) =>
                        value.date === DateUtils.getToday().toLocaleDateString()).length}</span>
                </List.Item>
            </List>
            <Table bordered pagination={false} columns={[
                {title: "ФИО", dataIndex: "name", key: "name"},
                {title: "Дата", dataIndex: "date", key: "date"},
                {title: "Изменено", dataIndex: "change", key: "change", render: this.getFieldName},
                {
                    title: "Описание",
                    dataIndex: "diff",
                    key: "diff",
                    render: (text, record: IFormattedChangesArray) => {
                        switch (record.change) {
                            case "original":
                                if (record.was === true && record.value === false) return "Забрал оригинал.";
                                if (record.was === false && record.value === true) return "Принёс оригинал.";
                                return "?";
                            case "type":
                                if (record.was === AdmissionRequestCondition.Free && record.value === AdmissionRequestCondition.Paid)
                                    return "Перешел на условия \"по договору\".";
                                if (record.was === AdmissionRequestCondition.Paid && record.value === AdmissionRequestCondition.Free)
                                    return "Перешёл на условия \"бюджет\".";
                                break;
                            default:
                                break;
                        }
                        return `${record.was} -> ${record.value}.`;
                    }
                },
            ]} dataSource={this.state.dataSource}/>
        </WrapperView>
    }
}