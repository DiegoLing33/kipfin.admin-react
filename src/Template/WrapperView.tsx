import {Component, default as React} from "react";
import DateUtils from "../App/DateUtils/DateUtils";
import {Layout, Spin} from "antd";
import Auth, {IUser} from "../App/Auth";
import KFWebApi from "../core/src/API/KFWebApi";

const {Header, Content, Footer} = Layout;

export interface WrapperViewProps {
    title?: string;
}

export default class WrapperView extends Component<WrapperViewProps> {

    state = {
        today: new Date(),
        meData: {name: "", login: "", access: "", group: {title: "", group_id: ""}},
        loading: true,
    };

    getName(s: string) {
        const parts = s.split(" ");
        if (parts.length === 1) return parts[0];
        return parts[1];
    }

    componentWillMount(): void {
        KFWebApi.request("users.me")
            .argsGet({token: Auth.GetToken()})
            .send()
            .then(resp => {
                Auth.me = resp as any as IUser;
                this.setState({meData: resp, loading: false});
            });
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Layout>
                <Spin spinning={this.state.loading} tip={"Получение данных..."}>
                    <Header style={{background: '#fff', padding: "0 30px"}}>
                        <span style={{fontSize: 17}}>{this.props.title}</span>
                    </Header>
                    <div className={"header-date"} style={{margin: '24px 16px 0'}}>
                        <div className={"date"}>Здравствуйте, {this.getName(this.state.meData!.name)}!</div>
                        <div
                            className={"weekday"}>Сегодня {this.state.today.toLocaleDateString()}, {DateUtils.getRusDayOfWeek(this.state.today)}.
                        </div>
                    </div>
                    <Content style={{margin: '24px 16px 0'}}>
                        <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                            {this.state.meData.name === "" ? "" :this.props.children}
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>KIPFIN ©2019 Created by Panov Yakov V.</Footer>
                </Spin>
            </Layout>);
    }
}