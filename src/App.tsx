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

import React, {useEffect, useState} from 'react';
import {Helmet} from "react-helmet";
import './App.css';
import Header from "./Header";
import Footer from "./Footer";
import Section from "./Section";
import {AppProps, SectionProps, SectionTypeEnum, WidgetTypeEnum} from "./interface/AppProps";
import Container from "react-bootstrap/Container";
import {Row} from "react-bootstrap";

function App() {
    const [appData, setAppData] = useState<AppProps>({
        fullName: "Avispa ECM Client",
        shortName: "ECM",
        description: "Avispa ECM Client default application",
        header: {
            menuItems: []
        },
        layout: {
            sections: []
        },
        versions: [
            {
                componentName: "Avispa ECM Client",
                number: "Unknown version"
            }
        ]
    });

    useEffect(() => {
        return setAppData({
            fullName: "Avispa μF",
            shortName: "μF",
            description: "Avispa μF - an application for generating simple invoices",
            header: {
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
            },
            layout: {
                sections: [
                    {
                        type: SectionTypeEnum.SIDEBAR,
                        widgets: [
                            {
                                name: "Repository",
                                activeByDefault: true,
                                type: WidgetTypeEnum.REPOSITORY
                            }
                        ]
                    },
                    {
                        type: SectionTypeEnum.CENTER,
                        widgets: [
                            {
                                name: "Properties",
                                type: WidgetTypeEnum.PROPERTIES
                            },
                            {
                                name: "Invoices",
                                activeByDefault: true,
                                type: WidgetTypeEnum.LIST
                            },
                            {
                                name: "Customers",
                                type: WidgetTypeEnum.LIST
                            },
                            {
                                name: "Bank Accounts",
                                type: WidgetTypeEnum.LIST
                            }
                        ]
                    }
                ]
            },
            versions: [
                {
                    componentName: "Avispa μF",
                    number: "2.0.0"
                },
                {
                    componentName: "Avispa ECM Client",
                    number: "2.0.0"
                },
                {
                    componentName: "Avispa ECM",
                    number: "2.0.0"
                }
            ]
        })
    }, []);

    return (
        <div className="App">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{appData.fullName}</title>
                <meta name="description" content="Avispa μF - an application for generating simple invoices" />
            </Helmet>

            <header>
                <Header brand={appData.shortName} menuItems={appData.header.menuItems}/>
            </header>

            <main>
                <Container fluid>
                    <Row>
                        {
                            appData.layout.sections.map(section => {
                                const activeWidget = section.widgets.find(widget => widget.activeByDefault)?.name.toLowerCase();
                                return (<Section type={section.type} activeWidget={activeWidget} widgets={section.widgets}></Section>);
                            })
                        }
                    </Row>
                </Container>
            </main>

            <footer className="mt-5">
                <Footer versions={appData.versions}/>
            </footer>
        </div>
    );
}

export default App;
