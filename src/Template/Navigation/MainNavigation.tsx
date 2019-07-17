import {Component} from "react";
import * as React from "react";
import {Badge, Icon, Menu} from "antd";
import MiddleValueModal from "../../Components/Modals/MiddleValueModal";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import SubMenu from "antd/lib/menu/SubMenu";

interface IMenuItem {
    link: string;
    icon: string;
    title: string;
    click?: () => void;
    beta?: boolean;
}

interface IMenuGlobal {
    title: string;
    items: IMenuItem[];
}


/**
 * The main menu component
 */
export default class MainNavigation extends Component {
    state = {
        redirect: "",
    };

    /**
     * Элементы меню
     */
    menuItems: Array<IMenuItem | IMenuGlobal> = [
        {title: "Главная", icon: "appstore", link: "/"},
        {
            title: "Приёмная кампания",
            items: [
                {title: "Абитуриенты", link: "/admission/list", icon: "reconciliation"},
                {title: "Статистика", link: "/admission/stat", icon: "bar-chart"},
                {title: "Статистика", link: "/admission/newstat", icon: "schedule", beta: true},
                {title: "Изменения данных", link: "/admission/changes", icon: "solution"},
                {title: "Задания", link: "/admission/tasks", icon: "fire"},
                {title: "Средний балл", link: "", icon: "calculator", click: () => MiddleValueModal.shared!.present()},
                {title: "План набора", link: "/admission/plan", icon: "database"},
                {title: "Таблица", link: "/admission/profile", icon: "database", beta: true},
                {title: "Абитуриент", link: "/admission/person", icon: "qq", beta: true},
            ]
        },
        {
            title: "Обучение",
            items: [
                {title: "Специальности", link: "/education/specialisations", icon: "database"},
            ]
        },
        {
            title: "Учебная часть",
            items: [
                {title: "График", link: "#", icon: "carry-out"},
                {title: "Аудитории", link: "#", icon: "calendar"},
            ]
        },
        // {
        //     title: "Инструменты",
        //     items: [
        //         {title: "Пользователи", link: "/users", icon: "usergroup-add"},
        //     ]
        // }
    ];

    /**
     * Возвращает рекцию из элемента
     * @param item
     * @param key
     */
    getMenuItem(item: IMenuItem, key: string): React.ReactNode {
        let content: any = <span><Icon type={item.icon}/><span>{item.title}</span></span>;
        if(item.beta) content = <Badge count={"BETA"} offset={[30, 6]}>{content}</Badge>;

        if (item.click) {
            return <Menu.Item key={key} onClick={() => item.click!()}>
                {content}
            </Menu.Item>
        } else {
            return <Menu.Item key={key}>
                <Link to={item.link}>
                    {content}
                </Link>
            </Menu.Item>
        }
    }

    /**
     * Возвращает реакцию для секции элементов
     * @param section
     * @param key
     */
    getMenuSection(section: IMenuGlobal, key: string): React.ReactNode {
        let subs: React.ReactNode[] = [];
        section.items.forEach((item, index) => subs.push(this.getMenuItem(item, `${key}_${index}`)));
        return <SubMenu key={key} title={section.title}>{subs}</SubMenu>
    }

    /**
     * Возвращает рекцию по карте меню
     * @param menuItems
     */
    getMenuItems(menuItems: Array<IMenuItem & IMenuGlobal>): React.ReactNode {
        return menuItems.map((value, index) => {
            if (value.items) {
                return this.getMenuSection(value, `s${index}`);
            } else {
                return this.getMenuItem(value, `mi${index}`);
            }
        });
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Menu defaultOpenKeys={["s1"]} selectable={false} theme="dark" mode="inline">
                {this.state.redirect !== "" ? <Redirect to={this.state.redirect}/> : ""}
                {this.getMenuItems(this.menuItems as any)}
            </Menu>
        );
    }
}
