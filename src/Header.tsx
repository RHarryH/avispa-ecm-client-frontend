/*
 * Avispa ECM Client Frontend
 * Copyright (C) 2023 Rafał Hiszpański
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Menu, MenuItem} from "./interface/AppProps";
import {DropDirection} from "react-bootstrap/DropdownContext";

interface HeaderProps {
    brand: string;
    menu: Menu;
}

function Header({brand, menu}:HeaderProps) {

    function createMenu(items:MenuItem[]) {
        return items.map(item => createItems(item));
    }
    function createItems(item:MenuItem) {
        if(item.items && item.items.length) {
            return createSubMenu(item.label, item.items);
        } else {
            return (<Nav.Link href={item.action}>{item.label}</Nav.Link>);
        }
    }

    function createSubMenu(label:string, items:MenuItem[], drop:DropDirection = "down") {
        return (
            <NavDropdown title={label} id={label} drop={drop}>
                {
                    items.map(item => createSubItem(item))
                }
            </NavDropdown>
        );
    }

    function createSubItem(subItem:MenuItem) {
        if(subItem.items && subItem.items.length) {
            return createSubMenu(subItem.label, subItem.items, "end");
        } else {
            return (<NavDropdown.Item href={subItem.action}>{subItem.label}</NavDropdown.Item>);
        }
    }

    return (
        <Navbar expand="md" fixed="top" bg="dark" data-bs-theme="dark" aria-label="Navigation bar">
            <Container fluid>
                <Navbar.Brand href="#home">{brand}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" aria-expanded="false" aria-label="Toggle navigation"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">{createMenu(menu.items)}</Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;