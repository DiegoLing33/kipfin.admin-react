import {Component} from "react";
import * as React from "react";
import WrapperView from "../../Template/WrapperView";
import GKFRequests from "../../App/GKFRequests";
import {Button, Divider, notification, Table, Icon, Switch, List} from "antd";
import TextArea from "antd/lib/input/TextArea";
import Auth from "../../App/Auth";
import ButtonGroup from "antd/lib/button/button-group";
import AdmissionTaskManager, {AdmissionTask} from "../../App/Admission/AdmissionTaskManager";

/**
 * Страница заданий
 */
export default class TasksPage extends Component {
    state = {
        tableDataSource: [],
        updateTime: "",

        taskValue: "",
    };

    filterBy = {completed: true, canceled: true, opened: false};

    loadedTasks: AdmissionTask[] = [];

    loopIndex: any;
    unmounted: boolean = false;

    /**
     * Что-то пошло не так
     */
    somethingWentWrong() {
        notification.open({
            message: "Что-то пошло не так...",
            icon: <Icon type={"meh"}/>
        });
    }

    /**
     * Нажатие на кнопку добавления задания
     */
    addTaskButtonClick = () => {
        if (this.state.taskValue !== "") {
            GKFRequests.sendPOSTRequest("Admission/Tasks/Add", {
                text: this.state.taskValue, user_id: Auth.me!.user_id
            }).then(response => {
                if (response.ok) {
                    this.updateData();
                } else {
                    this.somethingWentWrong();
                }
            })
        }
    };

    componentDidMount(): void {
        this.unmounted = false;
        this.updateData();
        if (this.loopIndex) clearInterval(this.loopIndex);
        setInterval(() => this.updateData(), 10000);
    }

    componentWillUnmount(): void {
        this.unmounted = true;
        if (this.loopIndex) clearInterval(this.loopIndex);
    }

    /**
     * Updates the daat
     */
    updateData() {
        if (this.unmounted) return;
        let filter = [];
        if(this.filterBy.opened) filter.push(1);
        if(this.filterBy.completed) filter.push(2);
        if(this.filterBy.canceled) filter.push(3);
        AdmissionTaskManager.loadTasks(tasks => {
            this.loadedTasks = tasks;
            this.setState({
                tableDataSource: tasks.map((v: AdmissionTask & any) => {
                    v.state_text = AdmissionTaskManager.getStateStringByStateId(v.state);
                    v.key = "task_" + v.id;
                    return v;
                }),
                updateTime: "Обновлено в " + new Date().toLocaleTimeString()
            })
        }, filter);
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <WrapperView title={"Задания"}>
                {
                    Auth.GetAccess() > 10 ?
                        <div>
                            <Divider>Добавить задание</Divider>
                            <TextArea rows={3} placeholder={"Введите задание"} style={{marginBottom: 10}}
                                      onChange={(e) => this.setState({taskValue: e.target.value})}/>
                            <Button onClick={this.addTaskButtonClick} block type={"primary"}
                                    icon={"plus"}>Добавить</Button>
                        </div> : ""
                }
                <Divider>Задания для секретарей</Divider>
                <div style={{textAlign: "center", paddingBottom: 15}}>{this.state.updateTime}</div>
                <List bordered style={{marginBottom: 20}}>
                    <List.Item>
                        <Switch checked={this.filterBy.completed} onChange={(e) => {this.filterBy.completed = e.valueOf(); this.updateData()}}/>
                        <span style={{marginLeft: 20}}>Скрывать выполненные</span>
                    </List.Item>
                    <List.Item>
                        <Switch checked={this.filterBy.canceled } onChange={(e) => {this.filterBy.canceled = e.valueOf(); this.updateData()}}/>
                        <span style={{marginLeft: 20}}>Скрывать отмененные</span>
                    </List.Item>
                    <List.Item>
                        <Switch onChange={(e) => {this.filterBy.opened = e.valueOf(); this.updateData()}}/>
                        <span style={{marginLeft: 20}}>Скрывать открытые</span>
                    </List.Item>
                </List>
                <Table dataSource={this.state.tableDataSource} bordered pagination={false} columns={[
                    {title: "Код", key: "id", dataIndex: "id"},
                    {title: "Задание", key: "text", dataIndex: "text", width: "40%"},
                    {title: "Состояние", key: "state_text", dataIndex: "state_text"},
                    {title: "Заказчик", key: "login", dataIndex: "login"},
                    {
                        title: "Действия", key: "x", render: (text, record: any) => {
                            if (record.state === 1) {
                                return (
                                    <ButtonGroup style={{width: "100%"}}>
                                        <Button type={"primary"} onClick={() => {
                                            AdmissionTaskManager.sendTaskState(record.id, 2, () => {
                                                this.updateData();
                                            })
                                        }}>Выполнить</Button>
                                        <Button type={"default"} onClick={() => {
                                            AdmissionTaskManager.sendTaskState(record.id, 3, () => {
                                                this.updateData();
                                            })
                                        }}>Отклонить</Button>
                                    </ButtonGroup>
                                )
                            } else {
                                return (
                                    <span>{record.state_text} <b>{record.completer}</b></span>
                                )
                            }
                        }
                    }
                ]}/>
            </WrapperView>
        )
    }
}