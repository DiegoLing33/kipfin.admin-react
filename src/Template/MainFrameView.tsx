import {Component} from "react";
import * as React from "react";
import {Layout} from 'antd';
import MainNavigation from "./Navigation/MainNavigation";
import MiddleValueModal from "../Components/Modals/MiddleValueModal";

const {Sider} = Layout;

/**
 * Main frame component
 */
export default class MainFrameView extends Component {

    /**
     * Renders the view
     */
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Layout style={{minHeight: window.innerHeight}}>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        // console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        // console.log(collapsed, type);
                    }}
                >
                    <div className="logo">
                        КИПФИН
                    </div>
                    <MainNavigation/>
                </Sider>
                {this.props.children}
                <MiddleValueModal ref={(e: any) => MiddleValueModal.shared = e}/>
            </Layout>
        );
    }
}