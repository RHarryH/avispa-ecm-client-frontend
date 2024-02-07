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
import {FormCheck, FormControl, InputGroup} from "react-bootstrap";
import RadioControl from "./RadioControl";
import React from "react";
import MaskedFormControl from "./MaskedFormControl";

interface PropertyControlComponentProps {
    control: PropertyControlProps;
    rootPropertyName?: string;
    valueIndex?: number;
}

function PropertyControl({control, rootPropertyName = '', valueIndex = -1}: PropertyControlComponentProps) {

    function getControlValue(control: PropertyControlProps, valueIndex: number) {
        if(valueIndex === -1) {
            return control.value;
        } else {
            return control.value[valueIndex];
        }
    }

    function getPropertyId(control: PropertyControlProps, rootPropertyName: string, valueIndex: number) {
        if(!rootPropertyName && valueIndex === -1) {
            return control.property;
        } else {
            return rootPropertyName + valueIndex + '.' + control.property;
        }
    }

    function getPropertyName(control: PropertyControlProps, rootPropertyName: string, valueIndex: number) {
        if(!rootPropertyName && valueIndex === -1) {
            return control.property;
        } else {
            return rootPropertyName + '[' + valueIndex + '].' + control.property;
        }
    }

    const id = getPropertyId(control, rootPropertyName, valueIndex);
    const name = getPropertyName(control, rootPropertyName, valueIndex);
    const value = getControlValue(control, valueIndex);

    switch (control.type) {
        case 'checkbox':
            const label = rootPropertyName ? undefined : (control.label + (control.required ? '*' : ''));
            const ariaLabel = rootPropertyName ? (control.label + " " + (valueIndex + 1)) : undefined;
            const tableCentered = rootPropertyName ? "d-flex justify-content-center" : undefined;
            return (
                <FormCheck type="switch" id={id} name={name} label={label} aria-label={ariaLabel}
                           className={tableCentered} disabled={control.readonly}
                           required={control.required} defaultValue={value ? value : false}
                           defaultChecked={value === 'true'}
                           onChange={(e) => e.target.value = e.target.checked.toString()}/>
            );
        case 'combo':
            const combo = control as ComboRadio;
            return <ComboControl combo={combo} property={{
                'id': id,
                'name': name,
                'value': value
            }}/>
        case 'date':
            const date = control as Date;
            return (
                <FormControl type="date" min={date.min} max={date.max} step={date.step} id={id} name={name}
                             defaultValue={value} required={date.required} readOnly={date.readonly}
                             disabled={date.readonly}/>
            );
        case 'datetime':
            const datetime = control as Date;
            return (
                <FormControl type="datetime-local" min={datetime.min} max={datetime.max} step={datetime.step} id={id}
                             name={name} defaultValue={value} required={datetime.required} readOnly={datetime.readonly}
                             disabled={datetime.readonly}/>
            );
        case 'money':
            const money = control as Money;
            return (
                <InputGroup>
                    <MaskedFormControl type="text" id={id} name={name} defaultValue={value} required={money.required}
                                       readOnly={money.readonly} disabled={money.readonly} money/>
                    <InputGroup.Text>{money.currency}</InputGroup.Text>
                </InputGroup>
            );
        case 'number':
            const number = control as Number;
            return (
                <FormControl type="number" min={number.min} max={number.max} step={number.step}
                             id={id} name={name} defaultValue={value} required={number.required}
                             readOnly={number.readonly} disabled={number.readonly}/>
            );
        case 'radio':
            const radio = control as ComboRadio;
            return <RadioControl radio={radio} property={{
                'id': id,
                'name': name,
                'value': value
            }}/>
        case 'text':
        case 'email':
            const text = control as Text;
            return (
                <MaskedFormControl type={text.type} pattern={text.pattern} minLength={text.minLength}
                                   maxLength={text.maxLength} id={id} name={name} defaultValue={value}
                                   required={text.required} readOnly={text.readonly} disabled={text.readonly}/>
            );
        case 'textarea':
            const textarea = control as TextArea;
            return (
                <FormControl as="textarea" rows={textarea.rows} cols={textarea.cols} minLength={textarea.minLength}
                             maxLength={textarea.maxLength} id={id} name={name} defaultValue={value}
                             required={textarea.required} readOnly={textarea.readonly} disabled={textarea.readonly}/>
            );
        case 'hidden':
            return (
                <FormControl type={control.type} id={id} name={name} defaultValue={value} required={control.required}
                             readOnly={control.readonly}/>
            );
        default:
            return <span>Unknown control of '{control.type}' type</span>;
    }
}

export default PropertyControl;