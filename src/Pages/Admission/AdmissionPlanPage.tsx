import * as React from "react";
import WrapperView from "../../Template/WrapperView";
import {Spin, Table} from "antd";
import AdmissionPlan from "../../core/Admission/AdmissionPlan";
import Specialisation from "../../core/University/Specialisation";

export default class AdmissionPlanPage extends React.Component {
    state = {
        dataSource: [],
        loading: true,
    };

    componentDidMount(): void {
        this.update();
    }

    update() {
        this.setState({loading: true});
        Promise.all([
            AdmissionPlan.loadAdmissionPlans(),
            Specialisation.loadSpecialisations()
        ]).then(value => {
            let [plan, specs] = value;
            this.setState({
                dataSource: plan.map((p: AdmissionPlan & any) => {
                    p.specTitle = specs.find(s => s.specId === p.specId)!.name;
                    p.all = p.paidCount + p.freeCount;
                    p.key = p.admissionId;
                    return p;
                }), loading: false
            });
        });
    }

    render(): React.ReactNode {
        return (<WrapperView title={"План набора"}>
            <Spin tip={"Получение данных"} spinning={this.state.loading}>
                <Table pagination={false} bordered columns={[
                    {title: "ID", dataIndex: "admissionId", key: "specId"},
                    {title: "Специальность", dataIndex: "specTitle", key: "specTitle"},
                    {title: "Договор", dataIndex: "paidCount", key: "paidCount"},
                    {title: "Бюджет", dataIndex: "freeCount", key: "freeCount"},
                    {title: "Всего", dataIndex: "all", key: "all"},
                ]} dataSource={this.state.dataSource}/>
            </Spin>
        </WrapperView>);
    }
}