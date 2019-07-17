import * as React from "react";
import WrapperView from "../../Template/WrapperView";
import AdmissionPlan from "../../core/Admission/AdmissionPlan";
import Specialisation from "../../core/University/Specialisation";
import {IAnalyzerSummary} from "../../core/Admission/AnalyzerSummary";
import {Col, Divider, Progress, Row, Spin, Table} from "antd";
import DateUtils from "../../core/DateUtils/DateUtils";
import StringNumberUtils from "../../core/Utils/StringNumberUtils";


export default class AdmissionStatPage extends React.Component {

    state = {
        dataSource: [],
        loading: true,
        recount: [],
        today: [],
        minimal: [],
    };

    /**
     * Данные анализа
     */
    analyze?: IAnalyzerSummary;
    plan?: AdmissionPlan[];
    specs?: Specialisation[];

    componentDidMount(): void {
        this.update();
    }

    /**
     * Загружает данные последнего анализа
     */
    loadAnalyzeJson(): Promise<IAnalyzerSummary> {
        return new Promise<IAnalyzerSummary>(resolve => {
            const xhr = new XMLHttpRequest();
            const url = "http://api2.kipfin.ru/data/data.analyze.json?" + Date.now();
            xhr.onload = () => {
                let data = JSON.parse(xhr.responseText) as IAnalyzerSummary;
                resolve(data);
            };
            xhr.open("GET", url);
            xhr.send();
        });
    }

    /**
     * Выпоняет получение данных
     */
    update() {
        this.setState({loading: true});
        Promise.all([
            AdmissionPlan.loadAdmissionPlans(),
            Specialisation.loadSpecialisations(),
            this.loadAnalyzeJson(),
        ]).then(value => {
            [this.plan, this.specs, this.analyze] = value;
            this.updateDetailedBlocks();
            this.updateTodayBlock();
            this.updateMinimal();
            // this.setState({
            //     dataSource: this.plan.map((p: AdmissionPlan & any) => {
            //         let spec = this.specs!.find(s => s.specId === p.specId)!;
            //         p.all = p.paidCount + p.freeCount;
            //         p.key = p.admissionId;
            //         p.nowFree = this.analyze!.detailed.originals[spec.token()].freeCount;
            //     }), loading: false
            // });
            this.setState({loading: false});
        });
    }

    updateTodayBlock() {
        const sumit = (a: any[]): number => {
            let c = 0;
            a.forEach(value => c += value);
            return c;
        };
        let todayAmount = sumit(Object.values(this.analyze!.summary.amountToday));
        let todayOriginals = sumit(Object.values(this.analyze!.summary.amountOriginalsToday));
        let todayAmountText = StringNumberUtils.stringByNumber(todayAmount, "нового абитуриента",
            "новых абитуриента", "новых абитуриентов");
        let todayOriginalsText = StringNumberUtils.stringByNumber(todayOriginals, "согласился",
            "согласились", "согласились");
        let pc = Math.round(todayOriginals / todayAmount * 100);
        let blocks: React.ReactNode[] = [];
        blocks.push(
            <div>
                <div style={{fontSize: 34, fontWeight: 200, margin: "27px 0"}}>
                    {todayOriginals > 0 ?
                        <span>Сегодня мы приняли <b>{todayAmount}</b> {todayAmountText}<br/>и <b>{todayOriginals}</b> {todayOriginalsText} оставить оригинал.</span>
                        : (
                            todayAmount > 0 ?
                                <span>Сегодня мы приняли <b>{todayAmount}</b> {todayAmountText}.</span>
                                :
                                <div>Статистика пока еще не обновлялась.</div>
                        )
                    }
                </div>
                {todayAmount > 0 ? <Progress format={() => pc + "%"} percent={100} successPercent={pc}/> : ""}
            </div>
        );
        if (todayAmount > 0) {
            blocks.push(<div style={{padding: 20}}>Если быть точнее, то...</div>);
            let list: any[] = [];
            for (let token in this.analyze!.summary.amountToday) {
                if (this.analyze!.summary.amountToday.hasOwnProperty(token)) {
                    list.push({
                        spec: this.analyze!.tokens[token].name,
                        amount: this.analyze!.summary.amountToday[token],
                        originals: this.analyze!.summary.amountOriginalsToday[token]
                    })
                }
            }
            blocks.push(<Table bordered pagination={false} columns={[
                {title: "Специальность", dataIndex: "spec", key: "spec"},
                {title: "Всего", dataIndex: "amount", key: "amount"},
                {title: "Оригиналы", dataIndex: "originals", key: "originals"},
            ]} dataSource={list}/>);
        }
        this.setState({today: blocks});
    }

    updateMinimal() {
        let blocks: React.ReactNode[] = [];
        let list: any[] = [];
        for (let rawtoken in this.analyze!.minimal) {
            if (this.analyze!.minimal.hasOwnProperty(rawtoken)) {
                let [token, type] = rawtoken.split("&");
                list.push({
                    spec: this.analyze!.tokens[token].name + ` (${type})`,
                    minimal: this.analyze!.minimal[rawtoken].value,
                    control: this.analyze!.minimal[rawtoken].controlNumber,
                })
            }
        }
        blocks.push(<Table bordered pagination={false} columns={[
            {title: "Специальность", dataIndex: "spec", key: "spec"},
            {title: "Минимальный балл", dataIndex: "minimal", key: "minimal"},
            {title: "Контрольное значение", dataIndex: "control", key: "control"},
        ]} dataSource={list}/>);
        this.setState({minimal: blocks});
    }

    updateDetailedBlocks() {
        const createBlock = (title: string, a: number, notMind: number, all: number,) => {
            return <Col span={8} style={{textAlign: "center"}}>
                <div style={{marginBottom: 20}}>{title}</div>
                <Progress successPercent={notMind} type={"circle"} width={80} percent={(a + notMind) / all * 100}
                          format={(p?: number) => Math.round(p || 0) + "%"}/>
                <div style={{marginTop: 20}}>{a + notMind} / {all}</div>
            </Col>
        };
        let blocks: React.ReactNode[] = [];
        for (let token in this.analyze!.detailed.originals) {
            if (this.analyze!.detailed.originals.hasOwnProperty(token)) {
                let specialisation = this.analyze!.tokens[token];
                let originals = this.analyze!.detailed.originals[token];
                let plan = this.plan!.find(p => p.specId === specialisation.specId)!;
                blocks.push(<div key={specialisation.key}
                                 style={{paddingBottom: 30, marginBottom: 30, borderBottom: "1px dashed #aaa"}}>
                    <div style={{fontSize: 24}}>{specialisation.name}</div>
                    <div style={{padding: 15, opacity: 0.6, marginBottom: 15}} />
                    <Row justify={"center"} align={"middle"}>
                        {createBlock("Бюджет", originals.freeCount, originals.notMindCount, plan.freeCount)}
                        {createBlock("Договор", originals.paidCount, 0, plan.paidCount)}
                        {createBlock("Всего", originals.freeCount + originals.paidCount, originals.notMindCount, plan.freeCount + plan.paidCount)}
                    </Row>
                </div>)
            }
        }
        this.setState({recount: blocks});
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return <WrapperView title={"Статистика приёмной кампаии"}>
            <Spin tip={"Получение данных"} spinning={this.state.loading}>
                <div style={{textAlign: "center"}}>
                    <Divider>Статистика на {DateUtils.getRusDateString(DateUtils.getToday())}</Divider>
                    {this.state.today}
                    <Divider>Детальная статистика</Divider>
                    <div style={{padding: 15, opacity: 0.6}}>
                        Детальная статистика рассчитывается только по оригиналам.
                        <br/>
                        Графическое представление для получения лучшего понимания происходящего.
                    </div>
                    {this.state.recount}
                    <Divider>Минимальный проходной балл</Divider>
                    {this.state.minimal}
                </div>
            </Spin>
        </WrapperView>
    }
}
