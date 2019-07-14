import {Component} from "react";
import * as React from "react";
import {Input, Icon, Button, Alert, notification} from "antd";
import Auth from "../../App/Auth";
import KFWebApi from "../../core/src/API/KFWebApi";

/**
 * Страница входа
 */
export default class LoginPage extends Component {

    state = {
        login: "",
        password: "",
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div>
                <div style={{maxWidth: "90%", width: 400, margin: "50px auto"}}>
                    <div style={{
                        textAlign: "center",
                        fontSize: 40,
                        fontWeight: 100,
                        marginBottom: 20,
                    }}>
                        Авторизация
                    </div>
                    <div style={{
                        textAlign: "center",
                        marginBottom: 10,
                    }}>
                        <Alert
                            message={"С целью приватизации функционала портала KIPFIN была введена система пользователей."}/>
                    </div>
                    <Input
                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        placeholder="Логин"
                        style={{marginBottom: 10}}
                        onChange={(e) => this.setState({login: e.target.value})}
                    />
                    <Input
                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        type="password"
                        placeholder="Пароль"
                        style={{marginBottom: 10}}
                        onChange={(e) => this.setState({password: e.target.value})}
                    />
                    <Button type="primary" block onClick={() => {
                        KFWebApi.request("users.login")
                            .argsGet({login: this.state.login, password: this.state.password})
                            .send()
                            .then(resp => {
                                if (resp.ok) {
                                    Auth.SaveToken(resp.token);
                                    window.location.reload();
                                }else{
                                    notification.open({
                                        message: "Пользователь не найден",
                                        icon: <Icon type={"meh"}/>
                                    });
                                }
                            });
                    }}>
                        Войти
                    </Button>
                    <div style={{textAlign: "center", marginTop: 20}}>
                        KIPFIN ©2019 Created by Panov Yakov V.
                    </div>
                </div>
            </div>
        );
    }
}