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
import Auth from "./App/Auth";
import LoginPage from "./Pages/Login/LoginPage";
import TasksPage from "./Pages/Admission/TasksPage";
import ChangesPage from "./Pages/Admission/ChangesPage";
import SpecialisationsListPage from "./Pages/Education/SpecialisationsListPage";
import AdmissionPlanPage from "./Pages/Admission/AdmissionPlanPage";
import AdmissionStatPage from "./Pages/Admission/AdmissionStatPage";
import AdmissionTablePage from "./Pages/Admission/AdmissionTablePage";

const App: React.FC = () => {
    const app = (
        <MainFrameView>
            <Switch>
                <Route exact path={"/"} component={IndexPage}/>
                <Route exact path={"/admission/stat"} component={StatPage}/>
                <Route exact path={"/admission/newstat"} component={AdmissionStatPage}/>
                <Route exact path={"/admission/changes"} component={ChangesPage}/>
                <Route exact path={"/admission/list"} component={ListPage}/>
                <Route exact path={"/admission/info/:code"} component={InfoPage}/>
                <Route exact path={"/admission/tasks"} component={TasksPage}/>
                <Route exact path={"/admission/plan"} component={AdmissionPlanPage}/>
                <Route exact path={"/users"} component={UsersList}/>
                <Route exact path={"/education/specialisations"} component={SpecialisationsListPage}/>
                <Route exact path={"/admission/table"} component={AdmissionTablePage}/>
            </Switch>
        </MainFrameView>
    );
    if(Auth.GetToken()) return app;
    else return <LoginPage />
};

export default App;
