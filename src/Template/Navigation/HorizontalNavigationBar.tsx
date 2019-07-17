import React from "react";
import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";

export default class HorizontalNavigationBar extends React.Component {

    public render(): React.ReactNode {
        return <Navbar bg="light" expand="lg">
            <Navbar.Brand>КИПФИН</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Item><Link to={"/"}>Главная</Link></Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    }
}