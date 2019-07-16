import {Component} from "react";
import * as React from "react";
import WrapperView from "../../Template/WrapperView";
import {Button, Divider, Input, notification, Table} from "antd";
import GKFRequests from "../../App/GKFRequests";
import Auth from "../../App/Auth";
import KFWebApi from "../../core/API/KFWebApi";
import {Routing} from "../../App";

/**
 * Список пользователей
 */
export default class UsersList extends Component {

    state = {
        usersData: [],

        newUserLogin: "",
        newUserPassword: "",
    };

    /**
     * Обновляет данные
     */
    update() {
        KFWebApi.request("users.list").send().then(resp => {
            this.setState({
                usersData: resp.list.map((v: any) => {
                    v.key = v.login;
                    return v;
                })
            });
        });
    }

    componentDidMount(): void {
        this.update();
    }

    addButtonClick = () => {
        if (this.state.newUserLogin !== "" && this.state.newUserPassword !== "") {
            GKFRequests.sendPOSTRequest("Users/Add",
                {login: this.state.newUserLogin, password: this.state.newUserPassword})
                .then(response => {
                    if (response.ok) {
                        this.update();
                    } else {
                        notification.open({
                            message: "Что-то пошло не так..."
                        });
                    }
                })
        }
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <WrapperView title={"Пользователи"}>
                {
                    Auth.GetAccess() > 20 ?
                        <div>
                            <Divider>Добавление пользователя</Divider>
                            <Input placeholder={"panovyv"} onChange={(e) => this.setState({newUserLogin: e.target.value})}
                                   style={{marginBottom: 10}}/>
                            <Input type={"password"} placeholder={"password"}
                                   onChange={(e) => this.setState({newUserPassword: e.target.value})} style={{marginBottom: 10}}/>
                            <Button block type={"primary"} onClick={this.addButtonClick}>Добавить</Button>
                        </div> : ""
                }
                <Divider>Список пользователей</Divider>
                <Table bordered pagination={false} dataSource={this.state.usersData} columns={[
                    {title: "ID", dataIndex: "user_id", key: "user_id"},
                    {title: "Логин", dataIndex: "login", key: "login"},
                    {title: "Имя", dataIndex: "name", key: "name"},
                    {title: "Статус", dataIndex: "group.title", key: "group"},
                ]}/>
            </WrapperView>
        );
    }
}