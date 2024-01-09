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

import Inputmask from "inputmask";
import {PropertyControlProps} from "../interface/PropertyPageConfig";

export function runCustomValidation(control: PropertyControlProps, element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
    element.setCustomValidity("");

    if (element.validity.valid) {
        const customValidation = control.customValidation?.function;
        if (customValidation) {
            let value = element.value;
            if (control.type === 'money') {
                const radixPoint = Inputmask().mask(element).option('radixPoint');
                value = value.replace(radixPoint, ".");
            }

            try {
                if (!executeFunctionByName(customValidation, window, [value])) {
                    setValidationMessage(control, element);
                }
            } catch (e) {
                element.setCustomValidity((<Error>e).message);
            }
        }
    }
}

function executeFunctionByName(functionName: string, context: any, args: any[]): boolean {
    let namespaces = functionName.split(".");
    let func = namespaces.pop();

    if (!func) {
        throw new Error("Function '" + functionName + "' can't be executed");
    }

    for (const element of namespaces) {
        context = context[element];
    }

    if (context[func]) {
        return context[func](...args);
    } else {
        throw new Error("Function '" + func + "' can't be executed");
    }
}

function setValidationMessage(control: PropertyControlProps, element: EventTarget & (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)) {
    const validationMessage = control.customValidation?.message;
    if (validationMessage) {
        element.setCustomValidity(validationMessage);
    } else {
        element.setCustomValidity("Custom validation failed");
    }
}