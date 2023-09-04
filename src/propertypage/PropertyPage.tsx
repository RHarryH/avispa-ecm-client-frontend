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

import {
    Columns,
    Control,
    Group,
    Label,
    PropertyControlProps,
    PropertyPageConfig,
    TableProps
} from "../interface/PropertyPageConfig";
import {Col, FormLabel, Row} from "react-bootstrap";
import React from "react";
import PropertyControl from "./PropertyControl";
import TableControl from "./TableControl";

interface PropertyPageProps {
    propertyPage: PropertyPageConfig;
}

function PropertyPage({propertyPage}: PropertyPageProps) {
    return (
        <fieldset disabled={propertyPage.readonly}>
            {
                getControls(propertyPage.controls)
            }
        </fieldset>
    );

    function getControls(controls: Control[]) {
        return controls.map((control, index) => {
            return getControl(control, index < controls.length);
        });
    }

    function getControl(control: Control, notLast: boolean, controlsNum: number = 1) {
        switch (control.type) {
            case 'label':
                const label = control as Label;
                return (<h3 className="col-sm-12">{label.expression}</h3>);
            case 'separator':
                return (<hr/>);
            case 'columns':
                const column = control as Columns;
                return (
                    <Row className={notLast ? 'mb-3' : ''}>
                        {
                            column.controls.map((columnControl, index) => (
                                <Col>{getControl(columnControl, index < column.controls.length, column.controls.length)}</Col>
                            ))
                        }
                    </Row>
                );
            case 'group':
                const group = control as Group;
                return (
                    <fieldset className={'border row mx-0 pb-3' + (notLast ? ' mb-3' : '')}>
                        <legend style={{
                            float: "initial",
                            width: "initial"
                        }}>{group.name}</legend>
                        <Col>
                            {getControls(group.controls)}
                        </Col>
                    </fieldset>
                );
            case 'table':
                const table = control as TableProps;
                return <TableControl table={table} readonly={propertyPage.readonly}/>;
            default:
                return (
                    <Row as={control.type === 'radio' ? 'fieldset' : 'div'} className={notLast && controlsNum === 1 ? 'mb-3' : ''}> {/* avoid doubling of bottom margin for columns */}
                        {
                            isPropertyControl(control) ?
                                getPropertyControlWithLabel(control as PropertyControlProps, controlsNum) :
                                null
                        }
                    </Row>
                );
        }
    }

    function isPropertyControl(control: Control): control is PropertyControlProps {
        return 'property' in control;
    }

    function getPropertyControlWithLabel(control: PropertyControlProps, controlsNum:number) {
        return <>
            {
                control.type !== 'radio' ?
                    getPropertyLabel(control, controlsNum) :
                    <legend className={"form-label col-form-label pt-0 col-sm-" + (2*controlsNum)}>{control.label + (control.required ? '*' : '')}</legend>
            }
            <Col>
                <PropertyControl control={control}/>
            </Col>
        </>;
    }

    function getPropertyLabel(control: PropertyControlProps, controlsNum:number = 1) {
        return (
            <FormLabel column sm={2 * controlsNum}
                       htmlFor={control.property}>
                {control.label + (control.required ? '*' : '')}
            </FormLabel>
        );
    }
}

export default PropertyPage;