import {Component} from "react";
import * as React from "react";
import {Icon, Menu, Tag} from "antd";
import MiddleValueModal from "../../Components/Modals/MiddleValueModal";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import SubMenu from "antd/lib/menu/SubMenu";
import User from "../../core/auth/User";

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
        menuItems: null
    };

    /**
     * Элементы меню
     */
    menuItems: Array<IMenuItem | IMenuGlobal> = [
        {title: "Главная", icon: "home", link: "/"},
        {
            title: "Приёмная кампания",
            items: [
                {title: "Анкеты", link: "/admission/list", icon: "tablet"},
                {title: "Статистика", link: "/admission/stat", icon: "bar-chart"},
                {title: "Статистика", link: "/admission/newstat", icon: "schedule", beta: true},
                {title: "Изменения данных", link: "/admission/changes", icon: "solution"},
                {title: "Сообщения", link: "/admission/errors", icon: "fire"},
                {title: "Средний балл", link: "", icon: "calculator", click: () => MiddleValueModal.shared!.present()},
                {title: "План набора", link: "/admission/plan", icon: "database"},
                {title: "Абитуриенты", link: "/admission/table", icon: "contacts", beta: true},
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
        {title: "История версий", icon: "rocket", link: "/updates"},

    ];

    componentDidMount(): void {
        User.waitMe(()=>{
            if(User.me!.group.checkAccess(256)){
                this.menuItems.push(
                    {title: "Пользователи", link: "/users", icon: "usergroup-add"},
                )
            }

            this.setState({menuItems: this.getMenuItems(this.menuItems as any)});
        });

        this.setState({menuItems: this.getMenuItems(this.menuItems as any)});
    }

    /**
     * Возвращает рекцию из элемента
     * @param item
     * @param key
     */
    getMenuItem(item: IMenuItem, key: string): React.ReactNode {
        let content: any = <span><Icon type={item.icon}/><span>{item.title}</span></span>;
        if(item.beta) content = <span>{content} <Tag color="#2db7f5">BETA</Tag></span>;

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
                {this.state.menuItems}
            </Menu>
        );
    }
}
