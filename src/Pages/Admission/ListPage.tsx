import {Component, default as React} from "react";
import WrapperView from "../../Template/WrapperView";
import GKFRequests from "../../App/GKFRequests";
import {Table, Button, Input} from "antd";
import {Redirect} from "react-router";

/**
 * Строка поиска
 * @param props
 * @constructor
 */
export function ListPageSearch(props: { onFind: (code: string) => void }) {
    const handleCode = (e: React.KeyboardEvent & any) => {
        if (e.keyCode === 13) {
            let value = String(e.target.value);
            value = value.toLowerCase();
            value = value.replace("к", "k");
            value = value.replace("а", "a");
            value = value.replace("р", "p");
            value = value.toUpperCase();
            props.onFind(value);
        }
    };
    return <div style={{marginBottom: 20}}>
        <div style={{marginBottom: 20, textAlign: "center", opacity: 0.5}}>Введите код абитуриента и нажмите Enter:</div>
        <Input onKeyDown={(e) => handleCode(e)} placeholder={"Код абитуриента"}/>
    </div>
}

/**
 * Список абитуриентов
 */
export default class ListPage extends Component {

    state = {
        tableDataSource: [],
        redirect: "",
        updateTime: "",
    };

    loopIndex: any;
    unmounted: boolean = false;

    componentDidMount(): void {
        this.unmounted = false;
        this.updateData();
        if (this.loopIndex) clearInterval(this.loopIndex);
        setInterval(() => this.updateData(), 10000);
    }

    componentWillUnmount(): void {
        this.unmounted = true;
        if (this.loopIndex) clearInterval(this.loopIndex);
    }

    /**
     * Updates the daat
     */
    updateData() {
        if (this.unmounted) return;
        let data: any[] = [];
        GKFRequests.sendGETRequest("Admission/List", {})
            .then((resp: any) => {
                if (resp) {
                    for (const item of resp.list)
                        data.push({
                            code: item.code,
                            time: new Date(item.date * 1000).toLocaleString(),
                            state: item.state === "2" ? "Открыт" : "Ожидает",
                            key: `k_${item.code}`,
                        })
                }
                this.setState({
                    tableDataSource: data,
                    updateTime: "Обновлено в " + new Date().toLocaleTimeString()
                })
            });
    }


    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <WrapperView title={"Список абитуриентов"}>
                {this.state.redirect !== "" ? <Redirect to={this.state.redirect}/> : ""}
                <ListPageSearch onFind={(code) => this.setState({redirect: "/admission/info/" + code})}/>
                <div style={{textAlign: "center", paddingBottom: 20}}>{this.state.updateTime}</div>
                <Table dataSource={this.state.tableDataSource} bordered pagination={false} columns={[
                    {title: "Код", key: "code", dataIndex: "code"},
                    {title: "Время регистрации", key: "time", dataIndex: "time"},
                    {title: "Сотояние", key: "state", dataIndex: "state"},
                    {
                        title: "", key: "x", render: (text, record: any, index) =>
                            <Button type={"primary"} block
                                    onClick={() => this.setState({redirect: "/admission/info/" + record.code})}>
                                Открыть
                            </Button>
                    }
                ]}/>
            </WrapperView>
        )
    }
}