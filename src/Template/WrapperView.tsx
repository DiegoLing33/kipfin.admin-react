import {Component, default as React} from "react";
import DateUtils from "../App/DateUtils/DateUtils";
import {Layout} from "antd";
import Auth from "../App/Auth";

const {Header, Content, Footer} = Layout;

export interface WrapperViewProps{
    title?: string;
}

export default class WrapperView extends Component<WrapperViewProps>{

    state = {
        today: new Date()
    };

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Layout>
                <Header style={{background: '#fff', padding: "0 30px"}}>
                    <span style={{fontSize: 17}}>{this.props.title}</span>
                </Header>
                <div className={"header-date"} style={{margin: '24px 16px 0'}}>
                    <div className={"date"}>Пользователь: {Auth.GetLogin()}.</div>
                    <div className={"weekday"}>Сегодня {this.state.today.toLocaleDateString()}, {DateUtils.getRusDayOfWeek(this.state.today)}.</div>
                </div>
                <Content style={{margin: '24px 16px 0'}}>
                    <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                        {this.props.children}
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>KIPFIN ©2019 Created by Panov Yakov V.</Footer>
            </Layout>
        );
    }
}