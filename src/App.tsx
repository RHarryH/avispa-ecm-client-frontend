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

import React, {useEffect} from 'react';
import { Helmet } from "react-helmet";
import logo from './logo.svg';
import './App.css';
import Header from "./Header";
import Footer from "./Footer";

function App() {
    useEffect(() => {
        // TODO: dynamic from REST
    }, []);

    return (
        <div className="App">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Avispa μF</title>
                <meta name="description" content="Avispa μF - an application for generating simple invoices" />
            </Helmet>

            <header>
                <Header/>
            </header>

            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            <footer className="mt-5">
                <Footer/>
            </footer>
        </div>
    );
}

export default App;
