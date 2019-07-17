import {Component} from "react";
import * as React from "react";
import {Layout, Spin} from 'antd';
import MainNavigation from "./Navigation/MainNavigation";
import MiddleValueModal from "../Components/Modals/MiddleValueModal";
import User from "../core/auth/User";

const {Sider} = Layout;

/**
 * Main frame component
 */
export default class MainFrameView extends Component {

    state = {
        loading: true,
    };

    componentDidMount(): void {
        User.updateMe(() => this.setState({loading: false}));
    }

    /**
     * Renders the view
     */
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Spin spinning={this.state.loading} tip={"Получение данных..."}>
                <Layout style={{minHeight: window.innerHeight}}>
                    <Sider breakpoint="lg" collapsedWidth="0">
                        <div className="logo">
                            КИПФИН
                        </div>
                        <MainNavigation/>
                    </Sider>
                    {this.state.loading ? "" : this.props.children}
                    <MiddleValueModal ref={(e: any) => MiddleValueModal.shared = e}/>
                </Layout>
            </Spin>
        );
    }
}
