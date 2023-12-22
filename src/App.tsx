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

import React, {useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import {Helmet} from "react-helmet";
import './App.css';
import Header from "./Header";
import Footer from "./Footer";
import Section from "./Section";
import {AppProps} from "./interface/AppProps";
import Container from "react-bootstrap/Container";
import {Row} from "react-bootstrap";
import axios from "axios";
import EventContext from "./event/EventContext";
import {eventReducer} from "./event/EventReducer";
import Notifications from "./notification/Notifications";
import {RestError} from "./widget/Widget";
import ErrorPage from "./misc/ErrorPage";

function App() {
    const [error, setError] = useState<RestError | undefined>(undefined);

    const onError = useCallback((error: RestError | undefined) => {
        setError(error);
    }, [error]);

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
        if (!error) {
            axios.get<AppProps>('/client')
                .then(res => {
                    const clientData = res.data;
                    setAppData(clientData);
                })
                .catch(error => {
                    if (onError) {
                        onError(error);
                    } else {
                        console.error(error.message);
                    }
                })
        }
    }, [error]);

    const [state, publishEvent ] = useReducer(eventReducer, {type: null});

    const eventProviderState = useMemo(() => (
        {state, publishEvent}
    ), [state]);

    return (
        <div className="App">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{appData.fullName}</title>
                <meta name="description" content="Avispa μF - an application for generating simple invoices" />
                <script src={process.env.REACT_APP_BASE_URL + "/custom/ecm-custom-validation.js"}
                        type="text/javascript"/>
            </Helmet>

            <header>
                <EventContext.Provider value={eventProviderState}>
                    <Header brand={appData.shortName} menu={appData.header?.menu}/>
                </EventContext.Provider>
            </header>

            <main>
                <Container fluid>
                    {
                        error ? (<ErrorPage error={error} displayMessage="Something went wrong! Please try again."
                                            buttonMessage="Reload website" onError={onError}></ErrorPage>) :
                            (
                                <EventContext.Provider value={eventProviderState}>
                                    <Row>
                                        {
                                            appData.layout?.sections.map(section => {
                                                return <Section key={section.location} location={section.location}
                                                                widgets={section.widgets}></Section>;
                                            })
                                        }
                                    </Row>
                                    <Notifications/>
                                </EventContext.Provider>
                            )
                    }
                </Container>
            </main>

            <footer className="mt-5">
                <Footer versions={appData.versions}/>
            </footer>
        </div>
    );
}

export default App;
