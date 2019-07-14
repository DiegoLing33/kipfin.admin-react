import {Component, default as React} from "react";
import WrapperView from "../../Template/WrapperView";
import {Row, Col, Input, Icon, Form, notification, Divider, Skeleton, Button} from "antd";
import GKFRequests from "../../App/GKFRequests";
import {Redirect} from "react-router";
import {ListPageSearch} from "./ListPage";
import {Link} from "react-router-dom";

/**
 * Страница с информацией о заявке
 */
export default class InfoPage extends Component {


    /**
     * The code
     */
    code?: string;


    state = {
        redirect: "",
        code: "",
        data: {},
        isInProgress: true,
    };

    /**
     * The references to textarea
     */
    textAreaRef: any;


    componentWillUpdate(np: any) {
        const {match} = this.props as any;
        const prevPostId = match.params.code;
        const nextPostId = np.match.params.code;
        if (nextPostId && prevPostId !== nextPostId) {
            this.updateData(nextPostId);
        }
    }

    /**
     * Component did mount
     */
    componentDidMount(): void {
        const {match} = this.props as any;
        let index = match.params.code;
        if (index) {
            this.updateData(index);
        } else {
            notification.open({
                message: "Что-то пошло не так.",
                description: "Указанный код не может быть индексирован."
            });
        }
    }

    /**
     * Получение данных
     * @param index
     */
    updateData(index: string) {
        this.setState({
            isInProgress: true,
        });
        index = index.toUpperCase();
        index = index.replace("А", "A");
        index = index.replace("Р", "P");
        index = index.replace("К", "K");

        GKFRequests.sendGETRequest("Admission/Get", {c: index})
            .then(resp => {
                for (let k in resp) if (resp.hasOwnProperty(k) && typeof resp[k] === "string") resp[k] = resp[k].trim();
                this.setState({
                    code: index,
                    data: resp,
                    isInProgress: false,
                })
            })
            .catch(() => {
                notification.open({
                    message: "Код не найден...",
                    icon: <Icon type="meh"/>
                })
            });
    }

    /**
     * Removes the abitur
     */
    successAbitur() {
        GKFRequests.sendGETRequest("Admission/Delete", {c: this.state.code})
            .then(() => this.setState({redirect: "/admission/list"}));
    }

    copyText(text: string) {
        this.textAreaRef.value = text;
        this.textAreaRef.select();
        document.execCommand('copy');
        notification.open({
            message: "Скопировано:",
            description: this.textAreaRef.value,
            icon: <Icon type="smile"/>
        })
    }

    /**
     * Creates the data item
     * @param key
     * @param text
     */
    createInfoItem(key: string, text: string) {
        return (
            <Row key={key} gutter={16}>
                <Col span={16}>
                    <Input value={text}/>
                </Col>
                <Col span={8}>
                    <Button type={"primary"} block onClick={() => {
                        this.copyText(text);
                    }}>Копировать</Button>
                </Col>
            </Row>
        );
    }

    getSpaceGroup(title: string, name: string, c?: number): any {
        let obj = (this.state.data as { [key: string]: any })[name];
        let group: any[] = [];
        if (c === undefined) {
            group.push(this.createInfoItem(`${name}_0`, obj || "-"));
        } else {
            let strValues = String(obj).split(" ");
            for (let i = 0; i < c; i++) {
                group.push(this.createInfoItem(`${name}_${i}`, strValues[i] === undefined ? "-" : strValues[i]))
            }
        }
        return (
            <Form.Item label={`${title} [${obj || "-"}]:`}>
                {group}
            </Form.Item>
        )
    }

    getPhoneGroup(title: string, name: string) {
        let obj = (this.state.data as { [key: string]: any })[name];
        let group: any[] = [];
        let strValue = String(obj);
        let strValues: string[] = [];
        strValue = strValue.replace("-", "");
        strValues.push(strValue.substr(0, 3));
        strValue = strValue.substr(3);
        strValues.push(strValue.substr(0, 3) + "-" + strValue.substr(3, 2) + "-" +
            strValue.substr(5, 2));

        for (let i = 0; i < strValues.length; i++) {
            group.push(this.createInfoItem(`${name}_${i}`, strValues[i] === undefined ? "-" : strValues[i]))
        }
        return (
            <Form.Item label={`${title} [${obj || "-"}]:`}>
                {group}
            </Form.Item>
        )
    }

    isUndefined() {
        return !this.state.data.hasOwnProperty("code");
    }

    /**
     * Отрисовывает элемент
     */
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const data: any = this.state.data;
        return (
            <WrapperView title={"Информация об абитуриенте"}>
                {this.state.redirect !== "" ? <Redirect to={this.state.redirect}/> : ""}
                <ListPageSearch onFind={(code) => this.setState({redirect: "/admission/info/" + code})}/>
                <div hidden={!this.state.isInProgress}>
                    <div style={{paddingTop: 20}}>Получение данных...</div>
                    <Skeleton active/>
                </div>
                <div hidden={!this.isUndefined() && !this.state.isInProgress}
                     style={{textAlign: "center", padding: 30, fontSize: 22}}>
                    <div style={{marginBottom: 20}}>Абитуриент не найден.</div>
                    <Button>
                        <Link to={"/admission/list"}>
                            Список абитуриентов
                        </Link>
                    </Button>
                </div>
                <div hidden={this.state.isInProgress || this.isUndefined()}>
                    <div style={{
                        textAlign: "center",
                        fontSize: 70,
                        padding: 20,
                        paddingBottom: 0
                    }}>{this.state.code}</div>
                    <div style={{
                        textAlign: "center",
                        fontSize: 30,
                        padding: 20,
                        paddingTop: 0
                    }}>{data.fio}</div>
                    <Divider>Информация</Divider>
                    {this.getSpaceGroup("Имя абитуриента", "fioValue", 3)}
                    {this.getSpaceGroup("Имя абитуриента (Транслит)", "t_fio", 3)}
                    {this.getPhoneGroup("Номер телефона", "phoneValue")}
                    {this.getSpaceGroup("E-mail адрес", "emailValue", 1)}
                    <Divider>Образование</Divider>
                    {this.getSpaceGroup("Номер аттестата", "attValue")}
                    {this.getSpaceGroup("Название школы", "schName")}
                    <Divider>Законный представитель</Divider>
                    {this.getSpaceGroup("Имя представителя", "fioRepr", 3)}
                    {this.getPhoneGroup("Номер телефона представителя", "phoneValueRepr")}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Button type={"default"} block
                                    onClick={() => this.setState({redirect: "/admission/list"})}>Отменить</Button>
                        </Col>
                        <Col span={12}>
                            <Button disabled={this.state.code.indexOf("A000") > -1} block type={"primary"}
                                    onClick={() => this.successAbitur()}>Провести</Button>
                        </Col>
                    </Row>
                    {
                        document.queryCommandSupported('copy') &&
                        <form style={{opacity: 0.001}}>
                            <textarea rows={1} ref={(textArea) => this.textAreaRef = textArea}/>
                        </form>
                    }
                </div>
            </WrapperView>
        );
    }
}