/**
 * Страница статистики
 */
import * as React from "react";
import {Component} from "react";
import WrapperView from "../../Template/WrapperView";

import {Alert, Button, Col, Icon, notification, Row, Switch, Table} from "antd";
import Progress from "antd/es/progress";
import Typography from "antd/es/typography";
import Spin from "antd/es/spin";
import Divider from "antd/es/divider";
import {Bar} from "ant-design-pro/lib/Charts";
import KipfinStatTableColumns from "../../Components/Columns/KipfinStatTableColumns";
import {AdmissionRequestCondition} from "../../App/Admission/AdmissionRequest";
import DateUtils from "../../App/DateUtils/DateUtils";
import AdmissionRequestsManager, {SpecializationsList} from "../../App/Admission/AdmissionRequestsManager";
import StringNumberUtils from "../../App/StringNumberUtils";

export default class StatPage extends Component {

    state = {
        dataSpec: [],
        dataRates: [],
        dataDates: [],
        dataMinRates: [],
        plan: 300,

        dateBase: [],
        dynamicDaysDataShape: [],
        dynamicSpecsDataShape: [],
        stateText: "",

        isLoading: true,
        showOriginals: false,

        switchDisabled: false,
        middleValueHidden: true,


        all: 0,
        allToday: 0,

        originalsToday: 0,
        originals: 0,
    };


    /**
     * Updates the table
     */
    updateTables() {
        let dateBase: any[] = [];
        let dataSpec: any[] = [];
        let dataRates: any[] = [];
        let dataMinRates: any[] = [];
        let dynamicDays: any[] = [];
        let dynamicSpecs: any[] = [];
        let all = 0;
        let allToday = 0;
        let originals = 0;
        let originalsToday = 0;
        SpecializationsList.forEach(s => {
            dataSpec.push({
                spec: s.shortTitle,
                d: s.getItemsByCondition(AdmissionRequestCondition.Paid).length,
                b: s.getItemsByCondition(AdmissionRequestCondition.Free).length,
                dnb: s.getItemsByCondition(AdmissionRequestCondition.NotMind).length,
                all: s.getCount(),
                key: `c_${s.key}`
            });

            dynamicSpecs.push({
                x: s.shortTitle,
                y: s.getCount(),
            });
            for (let condition in s.bounds)
                if (s.bounds.hasOwnProperty(condition) && s.bounds[condition] > 0) {
                    dataRates.push({
                        spec: `${s.title} (${condition})`,
                        midVal: s.getMiddleRateOfCondition(condition),
                        key: `r_${s.key}_${condition}`,
                    });
                    let originalsString = StringNumberUtils.stringByNumber(s.getOriginalsByCondition(condition).length,
                        "оригинал", "оригинала", "оригиналов", true);
                    let boundsString = StringNumberUtils.stringByNumber(s.bounds[condition],
                        "место", "места", "мест", true);
                    dataMinRates.push({
                        spec: `${s.title} (${condition}).`,
                        etc: `Основания: В специальности [${s.shortTitle}] и условиях обучения [${condition}]  
                        ${originalsString} (с учётом [Бюджет/Договор]) из ${boundsString}.`,
                        midVal: s.getBoundRate(condition),
                        key: `r_${s.key}_${condition}`,
                    });
                }
            originals += s.getItemsOriginals().length;
            originalsToday += s.getItemsOriginals().filter(value => value.date.toLocaleDateString() === DateUtils.getToday().toLocaleDateString()).length;
            all += s.getItemsAll().length;
            allToday += s.getItemsAll().filter(value => value.date.toLocaleDateString() === DateUtils.getToday().toLocaleDateString()).length;
        });


        let i = 0;
        while (dateBase.length < 15) {
            let ds = DateUtils.getDateBackTo(DateUtils.getToday(), i);
            i++;
            if (DateUtils.isDateNotAWorkDay(ds)) continue;
            let dv = ds.toLocaleDateString();
            let cnt = 0;
            SpecializationsList.forEach(spec => {
                spec.getItems().forEach(item => {
                    if (item.date.toLocaleDateString() === dv) {
                        cnt++;
                    }
                });
            });
            dateBase.push({
                date: dv,
                count: cnt,
                key: `d_${dv}`,
            });

            dynamicDays.push({
                x: dv,
                y: cnt,
            });

        }

        this.setState({
            dataSpec: dataSpec,
            dataRates: dataRates,
            dataMinRates: dataMinRates,
            dataDates: dateBase,
            dynamicDaysDataShape: dynamicDays.reverse(),
            dynamicSpecsDataShape: dynamicSpecs,
            all: all,
            allToday: allToday,
            originals: originals,
            originalsToday: originalsToday,
            isLoading: false,
            switchDisabled: false
        });
    }

    update() {
        AdmissionRequestsManager.loadRequests(() => {
            this.updateTables();
        });
    }

    /**
     * Component has been added to the window
     */
    componentDidMount() {
        this.update();
    }

    setOriginals(flag: boolean) {
        notification.open({
            message: "Перерасчёт выполнен",
            icon: <Icon type={"smile"}/>
        });
        this.setState({
            switchDisabled: true,
            isLoading: true,
        }, () => {
            SpecializationsList.forEach(spec => spec.onlyOriginals = flag);
            this.setState({showOriginals: flag}, () => {
                this.updateTables();
            });
        });
    }

    render() {

        const numberStyle = {fontSize: 110, fontWeight: 500};
        const textStyle = {fontSize: 40, fontWeight: 100};

        return (
            <WrapperView title={"Статистика приёмной кампании"}>
                <div>
                    <Alert message={"Статистика обновляется в течении всего дня в разное время. Как правило, данные полностью обновлены к 20:00 по МСК."}/>
                </div>
                <Spin tip="Получение данных..." spinning={this.state.isLoading}>
                    <div style={{textAlign: "center", padding: 15}}>
                        <Switch disabled={this.state.switchDisabled}
                                onChange={(c) => this.setOriginals(c)} style={{margin: 7}}/>
                        <div>показывать только оригиналы</div>
                    </div>
                    <Divider>Факты о приёме</Divider>
                    <Row justify={"center"} gutter={16} align={"middle"}>
                        <Col span={12}>
                            <div style={{textAlign: "center"}}>
                                <div style={numberStyle}>{this.state.allToday}</div>
                                <div style={textStyle}>- столько заявок<br/>мы приняли сегодня.</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{textAlign: "center"}}>
                                <div style={numberStyle}>{this.state.all}</div>
                                <div style={textStyle}>- столько заявок<br/>мы обработали в целом.</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{textAlign: "center"}}>
                                <div style={numberStyle}>{this.state.originalsToday}</div>
                                <div style={textStyle}>- столько оригиналов<br/>мы получили сегодня.</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{textAlign: "center"}}>
                                <div style={numberStyle}>{this.state.originals}</div>
                                <div style={textStyle}>- столько оригиналов<br/>мы получили в целом.</div>
                            </div>
                        </Col>
                    </Row>
                    <div>
                        <Divider>Сводные данные</Divider>
                        <Typography style={{padding: "5px 0"}}>Достижение цели:</Typography>
                        {this.state.all > this.state.plan ?
                            <div>
                                <div>Мы уже набрали запланированное кол-во абитуриентов в целом.
                                    Согласно плану приёма: <b>{this.state.plan}</b>.
                                    Отлично. Самое время достичь выполнения плана оригиналами аттестатов!
                                </div>
                                <Progress format={per => (Math.round((per || 0) * 100) / 100) + "%"}
                                          percent={(this.state.originals / this.state.plan) * 100} status="active"
                                          style={{marginBottom: 30}}/>
                            </div>
                            :
                            <Progress format={per => (Math.round((per || 0) * 100) / 100) + "%"}
                                      percent={(this.state.all / this.state.plan) * 100} status="active"
                                      style={{marginBottom: 30}}/>
                        }
                    </div>
                    <div>
                        <Divider>Динамика</Divider>
                        <Bar color={"#007d8c"} height={200} data={this.state.dynamicDaysDataShape} title={""}/>
                    </div>
                    <div>
                        <Divider>Специальности</Divider>
                        <Table pagination={false} bordered dataSource={this.state.dataSpec}
                               columns={KipfinStatTableColumns.SpecsCountFillTable}/>
                        <div style={{marginTop: 20}}>
                            <Bar color={"#007d8c"} height={200} data={this.state.dynamicSpecsDataShape} title={""}/>
                        </div>
                        {/* Middle Value Table */}
                        <Divider style={{marginTop: 30}}>Минимальный проходной балл аттестата</Divider>
                        <Alert
                            type={"warning"}
                            style={{margin: "20px 0"}}
                            message={"Значения в таблице являются независимыми от переключателя \"показывать только оригиналы\"."}
                        />
                        <Table style={{marginBottom: 30}} pagination={false} bordered
                               dataSource={this.state.dataMinRates}
                               columns={[
                                   {
                                       title: "Специальность",
                                       dataIndex: "spec",
                                       key: "spec",
                                       render: (text, record: any) =>
                                           <div>
                                               {text}<br/>
                                               <small>{record.etc}</small>
                                           </div>
                                   },
                                   {title: "Минимальный балл", dataIndex: "midVal", key: "midVal", width: "20%"}
                               ]}/>
                        {/* Min Value Table */}
                        <Divider style={{marginTop: 30}}>Средний балл аттестата</Divider>
                        <Alert
                            style={{margin: "20px 0"}}
                            message={"Значения в таблице могут изменяется переключателем \"показывать только оригиналы\". " +
                            "Данные рассчитываются по формуле: СУММА(ЗАЯВЛЕНИЯ) / КОЛИЧЕСТВО и является исключительно " +
                            "статистической."}
                        />
                        <div style={{marginBottom: 15, opacity: 0.5}}>По умолчанию таблица скрыта, нажмите, чтобы
                            отобразить её.
                        </div>
                        <Button style={{marginBottom: 15}} block
                                onClick={(e) => this.setState({middleValueHidden: !this.state.middleValueHidden})}>Отобразить
                            / скрыть</Button>
                        <div hidden={this.state.middleValueHidden}>
                            <Table style={{marginBottom: 30}} pagination={false} bordered
                                   dataSource={this.state.dataRates}
                                   columns={[
                                       {title: "Специальность", dataIndex: "spec", key: "spec"},
                                       {title: "Средний балл", dataIndex: "midVal", key: "midVal", width: "20%"}
                                   ]}/>
                        </div>
                        <Divider>Разделение по датам</Divider>
                        <Table pagination={false} bordered dataSource={this.state.dataDates}
                               columns={KipfinStatTableColumns.DateCountPeopleTable}/>
                    </div>
                </Spin>
            </WrapperView>);
    }

}