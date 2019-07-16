import React from 'react';
import "./style.css"
import './App.css';
import MainFrameView from "./Template/MainFrameView";
import {Route, Switch} from "react-router";
import IndexPage from "./Pages/IndexPage";
import StatPage from "./Pages/Admission/StatPage";
import ListPage from "./Pages/Admission/ListPage";
import InfoPage from "./Pages/Admission/InfoPage";
import UsersList from "./Pages/Users/UsersList";
import LoginPage from "./Pages/Login/LoginPage";
import TasksPage from "./Pages/Admission/TasksPage";
import ChangesPage from "./Pages/Admission/ChangesPage";
import SpecialisationsListPage from "./Pages/Education/SpecialisationsListPage";
import AdmissionPlanPage from "./Pages/Admission/AdmissionPlanPage";
import AdmissionStatPage from "./Pages/Admission/AdmissionStatPage";
import AdmissionTablePage from "./Pages/Admission/AdmissionTablePage";
import User from "./core/auth/User";

/**
 * Роутинг
 */
export class Routing {
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

Routing.default.reg("/", IndexPage);
Routing.default.reg("/users", UsersList);

Routing.default.reg("/admission/plan", AdmissionPlanPage);
Routing.default.reg("/admission/stat", StatPage);
Routing.default.reg("/admission/newstat", AdmissionStatPage);
Routing.default.reg("/admission/changes", ChangesPage);
Routing.default.reg("/admission/list", ListPage);
Routing.default.reg("/admission/info/:code", InfoPage);
Routing.default.reg("/admission/info/tasks", TasksPage);
Routing.default.reg("/admission/table", AdmissionTablePage);

Routing.default.reg("/education/specialisations", SpecialisationsListPage);

const App: React.FC = () => {
    const app = (
        <MainFrameView>
            {Routing.default.getSwitchComponent()}
        </MainFrameView>
    );
    if(User.isLocalAuthorized()) return app;
    else return <LoginPage />
};

export default App;
