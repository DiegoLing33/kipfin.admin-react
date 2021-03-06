import {Component, default as React} from "react";
import DateUtils from "../App/DateUtils/DateUtils";
import {Button, Collapse, Icon, Layout} from "antd";
import User from "../core/auth/User";
import {Jumbotron} from "react-bootstrap";
import Auth from "../App/Auth";

const {Header, Content, Footer} = Layout;

export interface WrapperViewProps {
    title?: string;
    description?: React.ReactNode;
}

/**
 * Разделитель контента
 */
export default class WrapperView extends Component<WrapperViewProps> {

    state = {
        today: new Date(),
    };


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Layout>
                <Header style={{background: '#fff', padding: "0 30px"}}>
                    <span style={{fontSize: 17}}>{this.props.title}</span>
                </Header>
                <div className={"header-date"} style={{margin: '24px 16px 0', marginLeft: "auto"}}>
                    <div className={"date"}>Здравствуйте, {User.me!.getName()}!</div>
                    <div className={"weekday"}>
                        Сегодня {this.state.today.toLocaleDateString()}, {DateUtils.getRusDayOfWeek(this.state.today)}.
                    </div>
                    <div className={"group"}>
                        {User.me!.group.title} (ID: {User.me!.userId})
                    </div>
                    <Button onClick={() => {
                        Auth.SaveToken("");
                        window.location.reload()
                    }} block>Выйти из системы</Button>
                </div>
                {this.props.description ?
                    <div style={{margin: '24px 16px 0', userSelect: "none"}}>
                        <Collapse style={{userSelect: "none"}} bordered={false}
                                  expandIcon={() => <Icon type={"info-circle"}/>}>
                            <Collapse.Panel header={this.props.title + ": как этим пользоваться?"} key="1">
                                <Jumbotron>
                                    <h1>{this.props.title}</h1>
                                    {this.props.description}
                                </Jumbotron>
                            </Collapse.Panel>
                        </Collapse>
                    </div>
                    : null}
                <Content style={{margin: '24px 16px 0'}}>
                    <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                        {this.props.children}
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>KIPFIN ©2019 Created by Panov Yakov V.</Footer>
            </Layout>);
    }
}
