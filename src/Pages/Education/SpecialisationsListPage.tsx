import * as React from "react";
import WrapperView from "../../Template/WrapperView";
import {Spin, Table} from "antd";
import Specialisation from "../../core/src/University/Specialisation";

export default class SpecialisationsListPage extends React.Component {
    state = {
        dataSource: [],
        loading: true,
    };

    componentDidMount(): void {
        this.update();
    }

    update() {
        this.setState({loading: true});
        Specialisation.loadSpecialisations().then(specs => {
            this.setState({dataSource: specs, loading: false});
        });

    }

    render(): React.ReactNode {
        return (<WrapperView title={"Специальности"}>
            <Spin tip={"Получение данных"} spinning={this.state.loading}>
                <Table pagination={false} bordered columns={[
                    {title: "ID", dataIndex: "specId", key: "specId"},
                    {title: "Код", dataIndex: "code", key: "code"},
                    {title: "Название", dataIndex: "name", key: "name"},
                ]} dataSource={this.state.dataSource}/>
            </Spin>
        </WrapperView>);
    }
}