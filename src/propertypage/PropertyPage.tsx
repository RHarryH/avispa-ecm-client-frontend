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
    ComboRadio,
    Control,
    Group,
    Label,
    PropertyControlProps,
    PropertyPageConfig,
    TableProps,
    TabsProps
} from "../interface/PropertyPageConfig";
import {Col, FormLabel, Row, Tab, Tabs} from "react-bootstrap";
import React from "react";
import PropertyControl from "./PropertyControl";
import TableControl from "./TableControl";
import {getPropertyControl, toKebabCase} from "../misc/Misc";

interface PropertyPageProps {
    propertyPage: PropertyPageConfig;
    onTableRowAdded?: (propertyName: string) => void;
    onTableRowRemoved?: (propertyName: string, index: number) => void;
}

function PropertyPage({propertyPage, onTableRowAdded, onTableRowRemoved}: PropertyPageProps) {
    interface Comparators {
        "$eq": (a: any, b: any) => boolean;
        "$ne": (a: any, b: any) => boolean;
        "$lt": (a: any, b: any) => boolean;
        "$lte": (a: any, b: any) => boolean;
        "$gt": (a: any, b: any) => boolean;
        "$gte": (a: any, b: any) => boolean;
    }

    const comparators: Comparators = {
        "$eq": (a, b) => a === b,
        "$ne": (a, b) => a !== b,
        "$lt": (a, b) => a < b,
        "$lte": (a, b) => a <= b,
        "$gt": (a, b) => a > b,
        "$gte": (a, b) => a >= b
    };

    function resolveConditions(conditions: string) {
        const conditionsObject = JSON.parse(conditions);

        // and all conditions on the top level
        return Object.entries(conditionsObject).every(function (entry) {
            let [key, value] = entry;
            return resolveCondition(key, value);
        });

        function resolveCondition(property: any, expectedValue: any) {
            /*const valueString = JSON.stringify(expectedValue);
            console.log(`Condition: ${property} => ${valueString}`);*/

            // extract values from the form
            // for radios and combos when the value is UUID, the label is used, otherwise regular value is used
            function getValue(fullKey: string) {
                function isUUID(uuid: string) { // UUID v4
                    const s = "" + uuid;
                    return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(s);
                }

                // get element matching the key
                const element = getPropertyControl(fullKey, propertyPage.controls)?.control;

                // if this is combo or radio, extract correct option
                if(element) {
                    if('options' in element) {
                        const comboradio = element as ComboRadio;
                        if (comboradio.options) {
                            const options = Object.entries(comboradio.options);
                            const matchingOption = options.find(option => option[0] === comboradio.value);
                            if (matchingOption) {
                                return isUUID(matchingOption[0]) ? matchingOption[1] : matchingOption[0];
                            } else if (options.length > 0) {
                                const firstOption = options[0];
                                return isUUID(firstOption[0]) ? firstOption[1] : firstOption[0];
                            } else {
                                return "";
                            }
                        }
                    } else if(element.type === 'money') {
                        return element?.value.replace(",", ".")
                    }
                }

                //console.log("Element for key: " + fullKey + " " + JSON.stringify(element));

                return element?.value;
            }

            if (property === "$and") {
                return expectedValue.every((element: any) => {
                    let [elementKey, elementValue] = Object.entries(element)[0];
                    return resolveCondition(elementKey, elementValue);
                });
            } else if (property === "$or") {
                return expectedValue.some((element: any) => {
                    let [elementKey, elementValue] = Object.entries(element)[0];
                    return resolveCondition(elementKey, elementValue);
                });
            } else {
                const actualValue = getValue(property);

                let operator;
                let comparedValue;

                // if this is complex comparison like
                // "propertyName": {
                //     "$ge": 12
                // }
                // extract nested object
                if (typeof expectedValue === 'object' && !Array.isArray(expectedValue) && expectedValue !== null) { // value is an object
                    [operator, comparedValue] = Object.entries(expectedValue)[0];
                } else { // otherwise use equality check by default
                    operator = "$eq";
                    comparedValue = expectedValue;
                }

                const test = comparators[operator as keyof Comparators](actualValue, comparedValue);

                //console.log("Test: " + property + "(" + actualValue + ") " + operator + " " + comparedValue + " = " + test);
                return test;
            }
        }
    }

    function getControls(controls: Control[]) {
        return controls.map((control, index) => {
            return getControl(control, index < controls.length);
        });
    }

    function getControl(control: Control, notLast: boolean, controlsNum: number = 1) {
        let visible = '';
        if(control.conditions?.visibility && !resolveConditions(control.conditions.visibility)) {
            visible = 'd-none';
        }

        switch (control.type) {
            case 'label':
                const label = control as Label;
                return (<h3 className="col-sm-12">{label.expression}</h3>);
            case 'separator':
                return (<hr/>);
            case 'columns': {
                const column = control as Columns;
                return (
                    <Row>
                        {getColumn(column)}
                    </Row>
                );
            }
            case 'group': {
                const group = control as Group;
                const margin = notLast ? 'mb-3' : '';
                return (
                    <fieldset className={`border row mx-0  ${margin} ${visible}`}>
                        <legend style={{
                            float: "initial",
                            width: "initial"
                        }}>{group.name}</legend>
                        <Col>
                            {getControls(group.controls)}
                        </Col>
                    </fieldset>
                );
            }
            case 'table':
                const table = control as TableProps;
                return <TableControl visible={visible} table={table} readonly={propertyPage.readonly} onRowAdded={onTableRowAdded} onRowRemoved={onTableRowRemoved}/>;
            case 'tabs': {
                const tabs = control as TabsProps;
                const margin = notLast ? 'mb-3' : '';
                return (
                    <div className={`${margin} ${visible}`}>
                        <Tabs defaultActiveKey={toKebabCase(tabs.tabs[0].name)}>
                            {
                                tabs.tabs.map(tab => (
                                    <Tab eventKey={toKebabCase(tab.name)}
                                         className="rounded-bottom border-bottom border-start border-end p-3"
                                         title={tab.name}>
                                        {getControls(tab.controls)}
                                    </Tab>
                                ))
                            }
                        </Tabs>
                    </div>
                );
            }
            default: {
                const margin = notLast ? 'mb-3' : '';
                return (
                    <Row as={control.type === 'radio' ? 'fieldset' : 'div'}
                         className={`${margin} ${visible}`}>
                        {
                            isPropertyControl(control) ?
                                getPropertyControlWithLabel(control, controlsNum) :
                                null
                        }
                    </Row>
                );
            }
        }
    }

    function getColumn(column: Columns) {
        return column.controls.map((columnControl, index) => (
                getColumnControl(columnControl, index < column.controls.length, column.controls.length)
            )
        )
    }

    function getColumnControl(control: Control, notLast: boolean, controlsNum: number = 1) {
        return <Col>{getControl(control, notLast, controlsNum)}</Col>;
    }

    function isPropertyControl(control: Control): control is PropertyControlProps {
        return 'property' in control;
    }

    function getPropertyControlWithLabel(control: PropertyControlProps, controlsNum: number) {
        if(control.conditions?.requirement) {
            control.required = resolveConditions(control.conditions.requirement);
        }

        return <>
            {
                control.type !== 'radio' ?
                    getPropertyLabel(control, controlsNum) :
                    <legend className={"form-label col-form-label pt-0 col-sm-" + (2 * controlsNum)}>{control.label + (control.required ? '*' : '')}</legend>
            }
            <Col>
                <PropertyControl control={control}/>
            </Col>
        </>;
    }

    function getPropertyLabel(control: PropertyControlProps, controlsNum: number = 1) {
        return (
            <FormLabel column sm={2 * controlsNum}
                       htmlFor={control.property}>
                {control.label + (control.required ? '*' : '')}
            </FormLabel>
        );
    }

    return (
        <fieldset disabled={propertyPage.readonly}>
            {
                getControls(propertyPage.controls)
            }
        </fieldset>
    );
}

export default PropertyPage;