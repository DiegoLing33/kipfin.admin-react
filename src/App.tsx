import React from 'react';
import "./style-next.css";
import "./style.css";
import './App.css';
import MainFrameView from "./Template/MainFrameView";
import IndexPage from "./Pages/IndexPage";
import StatPage from "./Pages/Admission/StatPage";
import ListPage from "./Pages/Admission/ListPage";
import InfoPage from "./Pages/Admission/InfoPage";
import UsersList from "./Pages/Users/UsersList";
import LoginPage from "./Pages/Login/LoginPage";
import AdmissionChangesPage from "./Pages/Admission/AdmissionChangesPage";
import SpecialisationsListPage from "./Pages/Education/SpecialisationsListPage";
import AdmissionPlanPage from "./Pages/Admission/AdmissionPlanPage";
import AdmissionStatPage from "./Pages/Admission/AdmissionStatPage";
import AdmissionTablePage from "./Pages/Admission/AdmissionTablePage";
import User from "./core/auth/User";
import Routing from "./App/Routing";
import AdmissionPersonPage from "./Pages/Admission/AdmissionPersonPage";
import UpdatesPage from "./Pages/index/UpdatesPage";
import AdmissionErrorMessagesPage from "./Pages/Admission/AdmissionErrorMessagesPage";

Routing.default.reg("/", IndexPage);
Routing.default.reg("/users", UsersList);

Routing.default.reg("/admission/plan", AdmissionPlanPage);
Routing.default.reg("/admission/stat", StatPage);
Routing.default.reg("/admission/newstat", AdmissionStatPage);
Routing.default.reg("/admission/changes", AdmissionChangesPage);
Routing.default.reg("/admission/list", ListPage);
Routing.default.reg("/admission/info/:code", InfoPage);
Routing.default.reg("/admission/errors", AdmissionErrorMessagesPage);
Routing.default.reg("/admission/table", AdmissionTablePage);
Routing.default.reg("/admission/person", AdmissionPersonPage);

Routing.default.reg("/education/specialisations", SpecialisationsListPage);

Routing.default.reg("/updates", UpdatesPage);

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
