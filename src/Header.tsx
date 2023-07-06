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
import {useEffect, useState} from "react";

function Header() {
    const [headerData, setHeaderData] = useState({
        brand: "Avispa ECM Client",
        menuItems: [{
            name: "",
            actions: [{name: "", type: ""}]
        }]
    });

    useEffect(() => {
        return setHeaderData({
            brand: "μF",
            menuItems: [
                {
                    name: "Invoice",
                    actions: [
                        {
                            name: "Add new",
                            type: "invoice-add-button"
                        },
                        {
                            name: "Clone",
                            type: 'invoice-clone-button'
                        }
                    ]
                },
                {
                    name: "Customer",
                    actions: [
                        {
                            name: "Add new",
                            type: "customer-add-button"
                        }
                    ]
                },
                {
                    name: "Bank account",
                    actions: [
                        {
                            name: "Add new",
                            type: "bank-account-add-button"
                        }
                    ]
                }
            ]
        });
    }, []);

    return (
        <Navbar expand="md" fixed="top" bg="dark" data-bs-theme="dark" aria-label="Navigation bar">
            <Container fluid>
                <Navbar.Brand href="#home">{headerData.brand}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" aria-expanded="false" aria-label="Toggle navigation"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {
                            headerData.menuItems.map(item => (
                                <NavDropdown title={item.name} id="basic-nav-dropdown">
                                    {
                                        item.actions.map(action => (
                                            <NavDropdown.Item className={action.type}
                                                              href="#">{action.name}</NavDropdown.Item>
                                        ))
                                    }
                                </NavDropdown>
                            ))
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;