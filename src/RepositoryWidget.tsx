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

import React, {useCallback, useEffect, useState} from "react";
import TreeView from "./TreeView";
import {Button, Col, Row} from "react-bootstrap";

interface DirectoryNode {
    id: string;
    parent: string;
    text: string;
    href?: string;
    type: string;
}

function RepositoryWidget() {
    const [repositoryWidgetData, setRepositoryWidgetData] = useState<DirectoryNode[]>([]);

    function fetchData() {
        return setRepositoryWidgetData([
            {
                "id": "9d262041-c7f8-4151-b8c8-6d88c3bbffa5",
                "parent": "#",
                "text": "Invoices",
                "type": "root"
            },
            {
                "id": "4603b617-e7ee-459e-9765-dedc29cfdd47",
                "parent": "9d262041-c7f8-4151-b8c8-6d88c3bbffa5",
                "text": "2023",
                "type": "folder"
            },
            {
                "id": "43718385-5db9-4a88-9bab-0ed18c4ade6a",
                "parent": "4603b617-e7ee-459e-9765-dedc29cfdd47",
                "text": "07",
                "type": "folder"
            },
            {
                "id": "e63420bd-f752-4fac-9a4b-47618e76cda8",
                "parent": "43718385-5db9-4a88-9bab-0ed18c4ade6a",
                "text": "F/2023/07/001",
                "type": "odt"
            }])
    }

    useEffect(() => {
        return fetchData();
    }, []);

    const exportData = useCallback(() => {
        // REST
    }, []);

    const reloadData = useCallback(() => {
        return fetchData();
    }, []);

    return (
        <Row className="row-cols-1 py-3">
            <Col>
                {
                    repositoryWidgetData.length ?
                        <Button size="sm" variant="outline-dark" className="mb-2 me-2 bi bi-box-arrow-down" onClick={exportData}> Export</Button> :
                        null
                }
                <Button size="sm" variant="outline-dark" className="mb-2 bi bi-arrow-clockwise" onClick={reloadData}> Refresh</Button>
            </Col>
            <Col className="mb-2">
                {
                    repositoryWidgetData.length ?
                        <TreeView treeData={repositoryWidgetData}></TreeView> :
                        <span>Repository is empty</span>
                }
            </Col>
        </Row>
    );
}

export default RepositoryWidget;