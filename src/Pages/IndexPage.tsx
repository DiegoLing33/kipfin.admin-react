import {Component} from "react";
import * as React from "react";
import WrapperView from "../Template/WrapperView";
import {Button, Col, Row} from "antd";
import {Jumbotron} from "react-bootstrap";
import User from "../core/auth/User";
import {Link} from "react-router-dom";
import VersionControl, {VersionControlComponent} from "../App/VersionControl";


export default class IndexPage extends Component {

    /**
     * Rendersthe page
     */
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const lastVersion = VersionControl.default.log()[VersionControl.default.log().length-1];
        return (
            <WrapperView title={"Панель администратора"}>
                <Jumbotron>
                    <h1>Панель администратора</h1>
                    <p>
                        {User.me!.getName()}, добро пожаловать в административный доступ Колледжа информатики и
                        программирования
                        Финансового университета при Правительстве Российской Федерации!
                    </p>
                    <p>
                        Возможно, Вам будет полезен следующий функционал:
                    </p>
                    <Row gutter={16}>
                        <Col style={{marginBottom: 15}} span={"12"}>
                            <Link to={"/admission/list"}>
                                <Button block type={"primary"} size={"large"} icon={"reconciliation"}>
                                    Абитуриенты
                                </Button>
                            </Link>
                        </Col>
                        <Col style={{marginBottom: 15}} span={"12"}>
                            <Link to={"/admission/errors"}>
                                <Button block type={"primary"} size={"large"} icon={"fire"}>
                                    Сообщения
                                </Button>
                            </Link>
                        </Col>
                        <Col style={{marginBottom: 15}} span={"24"}>
                            <Link to={"/admission/table"}>
                                <Button block type={"dashed"} size={"large"} icon={"contacts"}>
                                    Абитуриенты
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </Jumbotron>
                <VersionControlComponent {...lastVersion}/>
            </WrapperView>
        )
    }
}
