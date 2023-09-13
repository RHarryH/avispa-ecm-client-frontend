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
import axios from "axios";
import {processDownload} from "./misc/Misc";

interface DirectoryNode {
    id: string;
    parent: string;
    text: string;
    href?: string;
    type: string;
}

function RepositoryWidget() {
    const [repositoryWidgetData, setRepositoryWidgetData] = useState<DirectoryNode[]>([]);

    useEffect(() => {
        return fetchData();
    }, []);

    const reloadData = useCallback(() => {
        return fetchData();
    }, []);

    function fetchData() {
        axios.get<DirectoryNode[]>(`/directory`)
            .then(response => {
                const folderHierarchy = response.data;
                setRepositoryWidgetData(folderHierarchy);
            })
            .catch(function(error) {
                console.log(error);
            })
    }

    const exportData = useCallback(() => {
        axios.get(`/directory/export`, {responseType: 'blob'})
            .then(response => {
                processDownload(response);
            })
            .catch(function(error) {
                console.log(error);
            })
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