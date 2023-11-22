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
import React, {useCallback} from "react";
import MaskedFormControl from "./MaskedFormControl";
import {withMask} from "use-mask-input";
import Inputmask from "inputmask";

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

    const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        runCustomValidation(event.currentTarget);
    }, []);

    function runCustomValidation(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
        element.setCustomValidity("");

        if (element.validity.valid) {
            const customValidation = control.customValidation?.function;
            if (customValidation) {
                let value = element.value;
                if (control.type == 'money') {
                    const radixPoint = Inputmask().mask(element).option('radixPoint');
                    value = value.replace(radixPoint, ".");
                }

                if (!executeFunctionByName(customValidation, window, [value])) {
                    setValidationMessage(element);
                }
            }
        }
    }

    function executeFunctionByName(functionName: string, context: any, args: any[]): boolean {
        let namespaces = functionName.split(".");
        let func = namespaces.pop();

        if (!func) {
            return true;
        }

        for (const element of namespaces) {
            context = context[element];
        }
        return context[func](...args);
    }

    function setValidationMessage(element: EventTarget & (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)) {
        const validationMessage = control.customValidation?.message;
        if (validationMessage) {
            element.setCustomValidity(validationMessage);
        } else {
            element.setCustomValidity("Custom validation failed");
        }
    }

    const id = getPropertyId(control, rootPropertyName, valueIndex);
    const name = getPropertyName(control, rootPropertyName, valueIndex);
    const value = getControlValue(control, valueIndex);

    switch (control.type) {
        case 'combo':
            const combo = control as ComboRadio;
            return <ComboControl combo={combo} property={{
                'id': id,
                'name': name,
                'value': value
            }} onChange={onChange}/>
        case 'date':
            const date = control as Date;
            return (
                <FormControl type="date" min={date.min} max={date.max} step={date.step}
                             id={id} name={name} defaultValue={value} required={date.required} onChange={onChange}/>
            );
        case 'datetime':
            const datetime = control as Date;
            return (
                <FormControl type="datetime-local" min={datetime.min} max={datetime.max} step={datetime.step}
                             id={id} name={name} defaultValue={value} required={datetime.required} onChange={onChange}/>
            );
        case 'money':
            const money = control as Money;
            // /*"greedy": true*/
            const currencyAlias = {
                alias: "numeric",
                numericInput: true,
                min: 0,
                max: 9999999.99,
                groupSeparator: '\xa0', // non-breaking space
                radixPoint: ',',
                autoGroup: true,
                autoUnmask: true,
                digits: 2,
                digitsOptional: false,
                allowPlus: false,
                allowMinus: false,
                removeMaskOnSubmit: true,
                greedy: true
            };
            return (
                <InputGroup>
                    <FormControl ref={withMask("", currencyAlias)} onChange={(event) => {
                        const caret = event.target.selectionStart
                        const element = event.target
                        window.requestAnimationFrame(() => {
                            element.selectionStart = caret
                            element.selectionEnd = caret
                        })

                        onChange(event);
                    }} type="text" id={id} name={name} defaultValue={value} required={money.required}/>
                    <InputGroup.Text>{money.currency}</InputGroup.Text>
                </InputGroup>
            );
        case 'number':
            const number = control as Number;
            return (
                <FormControl type="number" min={number.min} max={number.max} step={number.step}
                             id={id} name={name} defaultValue={value} required={number.required} onChange={onChange}/>
            );
        case 'radio':
            const radio = control as ComboRadio;
            return <RadioControl radio={radio} property={{
                'id': id,
                'name': name,
                'value': value
            }} onChange={onChange}/>
        case 'text':
        case 'email':
            const text = control as Text;
            return (
                <MaskedFormControl type={text.type} pattern={text.pattern} minLength={text.minLength}
                                   maxLength={text.maxLength} id={id} name={name} defaultValue={value}
                                   required={text.required}
                                   onChange={onChange}/>
            );
        case 'textarea':
            const textarea = control as TextArea;
            return (
                <FormControl as="textarea" rows={textarea.rows} cols={textarea.cols} minLength={textarea.minLength}
                             maxLength={textarea.maxLength} id={id} name={name} defaultValue={value}
                             required={textarea.required}
                             onChange={onChange}/>
            );
        case 'hidden':
            return (
                <FormControl type={control.type} id={id} name={name} defaultValue={value} required={control.required}/>
            );
        default:
            return <span>Unknown control of '{control.type}' type</span>;
    }
}

export default PropertyControl;