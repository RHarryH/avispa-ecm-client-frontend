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

import {TableProps} from "../interface/PropertyPageConfig";
import React from "react";
import {Button, Table} from "react-bootstrap";
import PropertyControl from "./PropertyControl";

interface TableControlComponentProps {
    table: TableProps;
    readonly: boolean;
    onRowAdded?: (propertyName: string) => void;
    onRowRemoved?: (propertyName: string, index: number) => void;
    visible: string;
}

function TableControl({table, readonly, onRowAdded, onRowRemoved, visible}: TableControlComponentProps) {
    function getTableControls(table: TableProps, readonly: boolean) {
        let array = [];
        for(let i = 0; i < table.size; i++) {
            array.push(
                <tr>
                    <th className="row-count align-middle" scope="col">
                        {i + 1}
                    </th>
                    {
                        table.controls.map(control=> (
                            <td>
                                <PropertyControl control={control} rootPropertyName={table.property} valueIndex={i}/>
                            </td>
                        ))
                    }
                    <td>
                        {
                            !readonly && i !== 0 ?
                                <Button variant="" className={"bi bi-trash-fill align-middle"} onClick={() => onRowRemoved ? onRowRemoved(table.property, i) : null}></Button> :
                                null
                        }
                    </td>
                </tr>
            );
        }

        return array;
    }

    return (
    <div className={`mb-3 ${visible}`}>
        <Table size="sm" className="caption-top">
            <caption className="text-black">{table.label + (table.required ? '*' : '')}</caption>
            <thead className="table-light">
            <tr>
                <th scope="col">#</th>
                {
                    table.controls.map(control => (
                        (<th scope="col">{control.label}</th>)
                    ))
                }
                {!readonly ? <th scope="col">Delete</th> : null}
            </tr>
            </thead>
            <tbody>
                {getTableControls(table, readonly)}
            </tbody>
        </Table>
        {
            !readonly ?
                <Button size="sm" variant="outline-dark" className="bi bi-plus-lg"
                        onClick={() => onRowAdded ? onRowAdded(table.property) : null}>Add new</Button> :
                null
        }
    </div>
    );
}

export default TableControl;
