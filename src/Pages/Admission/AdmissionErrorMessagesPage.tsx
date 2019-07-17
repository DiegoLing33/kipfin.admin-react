import React from "react";
import WrapperView from "../../Template/WrapperView";
import AdmissionTasksAddForm from "./AdmissionTasks/AdmissionTasksAddForm";
import {Button, Divider, Icon, notification, Table, Tag} from "antd";
import KFWebApi from "../../core/API/KFWebApi";
import User from "../../core/auth/User";
import {PaginationConfig} from "antd/lib/pagination";
import LingFilter from "../../ling/arrays/LingFilter";

/**
 * Сообщение
 */
export interface AdmissionErrorMessage {
    [key: string]: any;
}

export interface IAdmissionErrorMessagesState {
    dataSource: AdmissionErrorMessage[];
    stateFilter: number[];
    tableLoading: boolean;
}

/**
 * Страница с заданиями
 */
export default class AdmissionErrorMessagesPage extends React.Component<any, IAdmissionErrorMessagesState> {

    state: IAdmissionErrorMessagesState = {
        dataSource: [],
        stateFilter: [1],
        tableLoading: true,
    };

    /**
     * Компонент заружен
     */
    componentDidMount(): void {
        this.update();
    }

    /**
     * Загруженные сообщения
     */
    public loadedMessages: AdmissionErrorMessage[] = [];

    /**
     * Обновляет данные
     */
    public update() {
        this.setState({tableLoading: true});
        Promise.all([
            KFWebApi.request("articles.list").argsGet({category_id: 10}).send(),
            KFWebApi.request("articles.list").argsGet({category_id: 11}).send(),
            KFWebApi.request("articles.list").argsGet({category_id: 12}).send(),
        ]).then(value => {
            let messages: any[] = [];
            value.forEach(v => {
                if (v.ok) messages.push(...v.list);
            });
            messages = messages.sort((a, b) => parseInt(a.article_id) > parseInt(b.article_id) ? 1 : -1);
            this.loadedMessages = messages.map((v, i) => {
                return {
                    article_id: parseInt(v.article_id),
                    key: (i + 1),
                    text: v.text,
                    category: String(v.text).includes("фото") ? 1001 : parseInt(v.category.category_id),
                    state: parseInt(v.article_state),
                    author: new User(v.author).getFullShortName(),
                    changer: new User({name: (v.changer as any).changer_name} as any).getFullShortName(),
                }
            });
            this.handleTableChanges({}, {});
        });
    }

    protected setMessageState(article_id: number, new_state: number) {
        KFWebApi.request("articles.set")
            .argsGet({
                article_id: article_id,
                token: User.getToken(), changer_id: User.me!.userId,
                state: new_state
            }).send().then(res => {
                this.update();
           if(res.ok){

           }else{
               notification.open({message: "Ошибка", description: "Ответ сервера: " + res.message});
           }
        });
    }

    /**
     * Отрисовывает состояние
     * @param record
     */
    protected renderState(record: AdmissionErrorMessage) {
        switch (record.state) {
            default:
                return <Tag>Открыто</Tag>;
            case 2:
                return <Tag color={"green"}>Выполнено: {record.changer}</Tag>;
            case 3:
                return <Tag color={"red"}>Отклонено: {record.changer}</Tag>;
        }
    }

    /**
     * Отрисовывает категорию
     * @param record
     */
    protected renderCategory(record: AdmissionErrorMessage) {
        switch (record.category) {
            default:
                return <Tag color={"gold"}>Другое</Tag>;
            case 11:
                return <Tag color={"#f50"}>Ошибка</Tag>;
            case 12:
                return <Tag color={"blue"}>Недочёт</Tag>;
            case 1001:
                return <Tag color={"#2db7f5"}>Фото</Tag>;
        }
    }

    /**
     * Отрисовывает действия
     * @param record
     */
    protected renderAction(record: AdmissionErrorMessage) {
        const inner = () => {
            if (record.state > 1) {
                return record.state === 2 ? <Icon type={"smile"}/> : <Icon type={"meh"}/>;
            }
            return <Button.Group>
                <Button onClick={() => this.setMessageState(record.article_id, 2)} shape="circle" icon={"check"}/>
                <Button onClick={() => this.setMessageState(record.article_id, 3)} shape="circle" icon={"close"}/>
            </Button.Group>;
        };
        return <div style={{textAlign: "center"}}>{inner()}</div>;
    }

    protected handleTableChanges(pagination: PaginationConfig, filter: any) {
        this.setState({tableLoading: true});
        let sf = filter.state || this.state.stateFilter;
        this.setState({stateFilter: sf});
        filter.state = sf;
        const lf = new LingFilter(this.loadedMessages);
        lf.filterEmpty();
        this.setState({dataSource: lf.filter(filter), tableLoading: false},
            () => {
                pagination.current = 1;
            });
    }

    /**
     * Рендер
     */
    render(): React.ReactNode {
        return <WrapperView title={"Ошибки и недочёты"} description={
            <div>
                <p>Здесь можно посмотреть сообщения, оставленные администрацией. На данный момент - это случаи ошибок в
                    заполнении абитуриентов.</p>
                <div>
                    <b>Добавление ошибки.</b> Как правильно классифицировать ошибку?
                    <ul>
                        <li><b>Ошибка</b> - точная ошибка, например, неверно посчитан средний балл.</li>
                        <li><b>Недочёт</b> - в анкете нету фото или не введены какие-либо данные.</li>
                        <li><b>Другое</b> - выберите этот вариант, если предложенные не подходят.</li>
                    </ul>
                    <p>
                        Существуют также автоматическая классификация, например, <Tag color={"#2db7f5"}>Фото</Tag>.
                    </p>
                </div>
                <p>
                    Не забудьте, что по умолчанию установлен фильтр "Состояние" -> "Открыто".
                </p>
            </div>
        }>
            {User.me!.group.checkAccess(16) ? <AdmissionTasksAddForm onSend={()=>this.update()}/> : null}
            <Divider>Сообщения</Divider>
            <Table loading={this.state.tableLoading} onChange={(p, f) => this.handleTableChanges(p, f)} dataSource={this.state.dataSource} bordered
                   pagination={{pageSize: 80}} columns={[
                {title: "#", dataIndex: "key", key: "theKey"},
                {title: "Категория", dataIndex: "category", key: "category",
                    filters: [
                        {text: "Ошибка", value: 11},
                        {text: "Недочёт", value: 12},
                        {text: "Другое", value: 10},
                        {text: "Фото", value: 1001},
                    ],
                    render: (text: string, record: AdmissionErrorMessage) => this.renderCategory(record),
                },
                {title: "Задание", dataIndex: "text", key: "text", width: "60%"},
                {
                    title: "Состояние",
                    dataIndex: "state",
                    key: "state",
                    filteredValue: this.state.stateFilter,
                    filters: [
                        {text: "Отклонено", value: 3}, {text: "Выполнено", value: 2}, {text: "Открыто", value: 1}
                    ],
                    render: (text: string, record: AdmissionErrorMessage) => this.renderState(record)
                },
                {title: "Отправитель", dataIndex: "author", key: "author"},
                {
                    title: "Действия", dataIndex: "x", key: "x", render:
                        (text: string, record: AdmissionErrorMessage) => this.renderAction(record)
                },
            ] as any}/>
        </WrapperView>
    }

}