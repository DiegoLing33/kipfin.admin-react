import {Component} from "react";
import * as React from "react";
import WrapperView from "../../Template/WrapperView";
import {Divider, notification, Table} from "antd";
import GKFRequests from "../../App/GKFRequests";
import KFWebApi from "../../core/API/KFWebApi";

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
                <Divider>Список пользователей</Divider>
                <Table bordered pagination={false} dataSource={this.state.usersData} columns={[
                    {title: "ID", dataIndex: "user_id", key: "user_id"},
                    {title: "Логин", dataIndex: "login", key: "login"},
                    {title: "Имя", dataIndex: "name", key: "name"},
                    {title: "Статус", dataIndex: "group.title", key: "group"},
                    {title: "Доступ", dataIndex: "group.access", key: "group_access"},
                ]}/>
            </WrapperView>
        );
    }
}
