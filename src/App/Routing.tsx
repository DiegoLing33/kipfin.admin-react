/*
 *
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
 *  ,--. o                   |    o
 *  |   |.,---.,---.,---.    |    .,---.,---.
 *  |   |||---'|   ||   |    |    ||   ||   |
 *  `--' ``---'`---|`---'    `---'``   '`---|
 *             `---'                    `---'
 *
 *   Copyright (C) 2016-2017, Yakov Panov (Yakov Ling)
 *   Mail: <diegoling33@gmail.com>
 *
 *   Это программное обеспечение имеет лицензию, как это сказано в файле
 *   COPYING, который Вы должны были получить в рамках распространения ПО.
 *
 *   Использование, изменение, копирование, распространение, обмен/продажа
 *   могут выполняться исключительно в согласии с условиями файла COPYING.
 *
 *   Файл создан: 2019-07-16 10:47
 *
 *   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
 */


import React from "react";
import {Route, Switch} from "react-router";

/**
 * Роутинг
 */
export default class Routing {
    /**
     * Стандартный роутер
     */
    public static default: Routing = new Routing();

    /**
     * Пути
     */
    protected __paths: {[adress: string]: React.Component} = {};

    /**
     * Регистрирует компоненты
     * @param path
     * @param component
     */
    public reg(path: string, component: React.Component | any){
        this.__paths[path] = component;
    }

    /**
     * Возвращает компонент пути
     * @param path
     */
    public getComponent(path: string): React.Component | any{
        return  this.__paths[path];
    }

    /**
     * Формирует Switch компонент
     */
    public getSwitchComponent(): React.ReactNode{
        return (
            <Switch>
                {Object.keys(this.__paths).map((path, i) => <Route key={`path_${i}`} exact path={path} component={this.getComponent(path)} />)}
            </Switch>
        )
    }

}
