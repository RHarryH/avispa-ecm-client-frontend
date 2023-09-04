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

import {ComboRadio, Date, Money, Number, PropertyControlProps, Text, TextArea} from "../interface/PropertyPageConfig";
import ComboControl from "./ComboControl";
import {FormControl, InputGroup} from "react-bootstrap";
import RadioControl from "./RadioControl";
import React from "react";

interface PropertyControlComponentProps {
    control: PropertyControlProps;
    valueIndex?: number;
}

function PropertyControl({control, valueIndex = -1}: PropertyControlComponentProps) {

    function getControlValue(control: PropertyControlProps, valueIndex: number = -1) {
        if(valueIndex === -1) {
            return control.value;
        } else {
            return control.value[valueIndex];
        }
    }

    const value = getControlValue(control, valueIndex);

    switch (control.type) {
        case 'combo':
            const combo = control as ComboRadio;
            return <ComboControl combo={combo} propertyValue={value}/>
        case 'date':
            const date = control as Date;
            return (
                <FormControl type="date" min={date.min} max={date.max} step={date.step}
                             id={date.property} name={date.property} value={value} required={date.required}/>
            );
        case 'datetime':
            const datetime = control as Date;
            return (
                <FormControl type="datetime-local" min={datetime.min} max={datetime.max} step={datetime.step}
                             id={datetime.property} name={datetime.property} value={value} required={datetime.required}/>
            );
        case 'money':
            const money = control as Money;
            return (
                <InputGroup>
                    <FormControl type="text" id={money.property} name={money.property} value={value} required={money.required}/>
                    <InputGroup.Text>{money.currency}</InputGroup.Text>
                </InputGroup>
            );
        case 'number':
            const number = control as Number;
            return (
                <FormControl type="number"  min={number.min} max={number.max} step={number.step}
                             id={number.property} name={number.property} value={value} required={number.required}/>
            );
        case 'radio':
            const radio = control as ComboRadio;
            return <RadioControl radio={radio} propertyValue={value}/>
        case 'text':
        case 'email':
            const text = control as Text;
            return (
                <FormControl type={text.type} pattern={text.pattern} minLength={text.minLength}
                             maxLength={text.maxLength} id={text.property} name={text.property} value={value} required={text.required}/>
            );
        case 'textarea':
            const textarea = control as TextArea;
            return (
                <FormControl as="textarea" rows={textarea.rows} cols={textarea.cols} minLength={textarea.minLength}
                             maxLength={textarea.maxLength} id={textarea.property} name={textarea.property} value={value}  required={textarea.required}/>
            );
        default:
            return <span>Unknown control of '{control.type}' type</span>;
    }
}

export default PropertyControl;