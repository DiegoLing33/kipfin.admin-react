import {Component, CSSProperties} from "react";
import * as React from "react";
import WrapperView from "../Template/WrapperView";
import {Button, Divider} from "antd";
import Auth from "../App/Auth";
import {Routing} from "../App";

const instyles: {[name: string]: CSSProperties} = {
    updateTitle: {
        fontSize: 22,
        display: "block",
        marginBottom: 20
    },
    updateText: {
      display: "block"
    }
};

export default class IndexPage extends Component{

    /**
     * Rendersthe page
     */
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <WrapperView title={"Панель управления"}>
                Здесь пока что пусто. Однако, отсюда Вы можете покинуть Ваш аккакунт.<br/><br/>
                <Button onClick={()=>{Auth.SaveToken(""); window.location.reload()}}>Выйти из системы</Button>
                <Divider>Обновления</Divider>
                <div>
                    <div style={instyles.updateTitle} >Версия: 1.2.0</div>
                    <div style={instyles.updateText}>
                        <i>Updates</i>
                        <ul>
                            <li>Полностью переработанно ядро и новое API.</li>
                            <li>Оптимизация и исправление мелких ошибок.</li>
                            <li>Новый раздел <b>Статистика</b>, включающий детализированную статистику на сегодня.</li>
                            <li>Новое отображение бокового меню.</li>
                            <li>Новые дополнительные разделы.</li>
                        </ul>
                        <i>Fixes</i>
                        <ul>
                            <li>Статистика на сегодня снова отображается корректно в старом разделе.</li>
                        </ul>
                        <i>Bugs</i>
                        <ul>
                            <li>В поле "быстрого перехода" код абитуриента не исчезает после нажатия enter.</li>
                            <li>В поле "Добавить задание" текст задания не исчезает после нажатия кнопки "Добавить".</li>
                            <li>Возможность изменить уровень доступа через локальное изменение cookies.</li>
                        </ul>
                    </div>
                </div>
                <div>
                    <div style={instyles.updateTitle} >Версия: 1.1.0</div>
                    <div style={instyles.updateText}>
                        <i>Updates</i>
                        <ul>
                            <li>Добавлен раздел <b>Изменения данных</b>. В нём можно узнать о том, когда принесли оригиналы,
                                сменили специальность и тд.</li>
                            <li>В разделе <b>Абитуриенты</b> снова добавлена строка "быстрого перехода".</li>
                            <li>В разделе <b>Задания</b> <i>выполненные</i> и <i>отмененные</i> пункты по-умолчанию скрыты.</li>
                            <li>Небольшие изменения в разделе <b>Статистика</b>.</li>
                        </ul>
                        <i>Fixes</i>
                        <ul>
                            <li>Исправлена ошибка "КИФИН".</li>
                            <li>Исправлена ошибка "Прлучение данных".</li>
                            <li>Исправлена ошибка невозможности перехода к списку абитуриентов со страницы информации через меню.</li>
                            <li>Исправлена ошибка сохранения модального окна "Средний балл" после его закрытия.</li>
                        </ul>
                        <i>Bugs</i>
                        <ul>
                            <li>В поле "быстрого перехода" код абитуриента не исчезает после нажатия enter.</li>
                            <li>В поле "Добавить задание" текст задания не исчезает после нажатия кнопки "Добавить".</li>
                        </ul>
                    </div>
                </div>
            </WrapperView>
        )
    }
}