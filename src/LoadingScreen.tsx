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

import {Col, Modal, Spinner} from "react-bootstrap";
import React from "react";

function LoadingScreen() {
    return (
        <Col>
            <Modal.Body className="d-flex justify-content-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Modal.Body>
        </Col>
    );
}

export default LoadingScreen;