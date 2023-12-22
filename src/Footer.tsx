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
import Navbar from 'react-bootstrap/Navbar';
import {Version} from "./interface/AppProps";

interface Versions {
    versions: Version[];
}

function Footer({versions}:Versions) {
    function getFooterLine() {
        let value = '';
        versions.forEach(version => (
            value += version.componentName + ' v' + version.number + ', '
        ))
        return value + '©' + new Date().getFullYear() + ' ';
    }

    return (
        <Navbar fixed="bottom" bg="light" data-bs-theme="dark" aria-label="Footer">
            <Container fluid>
                <div className="ms-auto">
                        <span>
                            {getFooterLine()}
                        </span>
                    <a href="https://rafalhiszpanski.pl">Rafał Hiszpański</a>
                </div>
            </Container>
        </Navbar>
    );
}

export default Footer;