import React from "react";
import {Alert, Button, Divider, Form, notification, Radio} from "antd";
import LabelText from "../../../Components/LabelText";
import TextArea from "antd/lib/input/TextArea";
import {FormProps} from "antd/lib/form";
import KFWebApi, {KFWebApiRequestType} from "../../../core/API/KFWebApi";
import User from "../../../core/auth/User";

const FormItem = Form.Item;

/**
 * Форма добавления ошибки
 */
class AdmissionTasksAddForm extends React.Component<FormProps & any> {

    /**
     * Отправляет форму
     */
    public send() {
        let values = this.props.form.getFieldsValue(["text", "category_id"]);
        if(values.text === undefined || values.text === null || values.text === ""){
            notification.open({
                message: "Текст сообщения не может быть пустым."
            });
            return;
        }
        KFWebApi.request("articles.add")
            .argsPost({
                token: User.getToken(),
                text: values.text,
                category_id: values.category_id,
            }).send(KFWebApiRequestType.POST).then(result => {
           if(result.ok){
               notification.open({
                   message: "Сообщение успешно отправлено!"
               });
               this.props.form.resetFields(["text"]);
               this.props.onSend();
           }else{
               notification.open({
                   message: "Ошибка отправки сообщения.",
                   description: "Ответ сервера: " + (result.message || "Unknown error")
               });
           }
        });
    }

    render(): React.ReactNode {
        const {form} = this.props;
        return <Form>
            <Divider>Добавить ошибку</Divider>
            <Alert
                style={{marginBottom: 15}} message={"Если Вы видите эту форму, значит Вы имеете достаточно привелегий."}
                closable={true}/>
            <LabelText text={"Опишите найденную ошибку"} fullPadding={false}/>
            <FormItem style={{margin: 0}}>
                {form.getFieldDecorator("text", {rules: [{required: true}]})(
                    <TextArea rows={5} placeholder={"У Кустова Александра Викторовича отсутсвуют фотографии"}/>
                )}
            </FormItem>
            <LabelText text={"Попробуйте её классифицировать. Воспользуйтесь подсказкой сверху, если это необходимо."}/>
            <FormItem style={{margin: 0}}>
                <div style={{textAlign: "center", marginBottom: 15}}>
                    {form.getFieldDecorator("category_id", {initialValue: "10", rules: [{required: true}]})(
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value="11">Ошибка</Radio.Button>
                            <Radio.Button value="12">Недочёт</Radio.Button>
                            <Radio.Button value="10">Другое</Radio.Button>
                        </Radio.Group>
                    )}
                </div>
            </FormItem>
            <Button type={"primary"} onClick={() => this.send()} block>Отправить</Button>
        </Form>;
    }
}

export default Form.create<any>()(AdmissionTasksAddForm);