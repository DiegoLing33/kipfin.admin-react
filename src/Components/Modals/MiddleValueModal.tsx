import {Component} from "react";
import {Alert, Divider, Icon, Modal, notification, Spin, Table} from "antd";
import * as React from "react";
import {ModalProps} from "antd/lib/modal";
import TextArea from "antd/lib/input/TextArea";

/**
 * Middle value modal
 */
export default class MiddleValueModal extends Component<ModalProps> {

    static shared?: MiddleValueModal;

    state = {
        isVisible: false,
        dataShape: [],
        isCounting: false,
    };

    onInputHandler(e: any) {
        this.setState({isCounting: true});
        let values = [];
        let str = String(e.target.value).replace(/(\r\n|\n|\r| )/gm, "");
        let len = str.length;
        for (let i = 0; i < len; i++) {
            try {
                let num = parseInt(str[i]);
                if (!num) throw new Error("Not a number!");
                values.push(num);
            } catch (e) {
                notification.open({
                    message: "Введено не верное значение. Возможно, Вы ввели не оценку.",
                    icon: <Icon type={"meh"}/>
                })
            }
        }
        let midValue = 0;
        values.forEach(value => midValue += value);
        midValue /= values.length;
        midValue = midValue || 0;

        this.setState({
            isCounting: false,
            dataShape: [
                {
                    title: "Всего оценок",
                    value: values.length,
                    key: "all"
                },
                {
                    title: "Оценок 3",
                    value: values.filter(value => value === 3).length,
                    key: "all3"
                },
                {
                    title: "Оценок 4",
                    value: values.filter(value => value === 4).length,
                    key: "all4"
                },
                {
                    title: "Оценок 5",
                    value: values.filter(value => value === 5).length,
                    key: "all5"
                },
                {
                    title: "Средний балл",
                    value: `${Math.round(midValue * 100) / 100}`,
                    key: "allMiddle"
                }]
        });

    }

    /**
     * Отображает модальное окно
     */
    public present(){
        this.setState({isVisible: true});
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Modal destroyOnClose={true}  onCancel={()=>{
                this.setState({isVisible: false, dataShape: []});
            }} visible={this.state.isVisible} footer={false} closable={true}
                   title={"Расчёт среднего бала"}>
                <Alert style={{marginBottom: 15}} type={"warning"} closable={true}
                       message={<div>Вводите оценки с новой строки или без пробелов в ряд - это не имеет значения.
                           При вводе, Вы можете использовать пробелы, если так будет удобней.
                       </div>}/>
                <TextArea onChange={(e) => this.onInputHandler(e)} rows={10}/>
                <Divider>Информация</Divider>
                <Spin tip={"Подсчёт..."} spinning={this.state.isCounting}>
                    <Table pagination={false} bordered columns={[
                        {
                            title: "Наименования",
                            dataIndex: "title",
                            key: "title",
                            width: "60%",
                        },
                        {
                            title: "Значение",
                            dataIndex: "value",
                            key: "value"
                        }
                    ]} dataSource={this.state.dataShape}/>
                </Spin>
            </Modal>
        )
    }
}