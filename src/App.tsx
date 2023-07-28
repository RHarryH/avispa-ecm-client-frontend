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
import {AppProps, SectionLocation, WidgetType} from "./interface/AppProps";
import Container from "react-bootstrap/Container";
import {Row} from "react-bootstrap";
import axios from "axios";

function App() {
    const [appData, setAppData] = useState<AppProps>({
        fullName: "Avispa ECM Client",
        shortName: "ECM",
        description: "Avispa ECM Client default application",
        header: {
            menu: {
                items: []
            }
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
        axios.get<AppProps>(`/client`)
            .then(res => {
                const clientData = res.data;
                setAppData(clientData);
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
                <Header brand={appData.shortName} menu={appData.header.menu}/>
            </header>

            <main>
                <Container fluid>
                    <Row>
                        {
                            appData.layout.sections.map(section => {
                                const activeWidget = section.widgets.find(widget => widget.activeByDefault)?.label.toLowerCase();
                                return (<Section location={section.location} activeWidget={activeWidget} widgets={section.widgets}></Section>);
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
