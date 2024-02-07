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

export interface PropertyPageConfig {
    context: "INSERT" | "EDIT" | "READONLY";
    size: string;
    controls: Control[];
}

export interface HTMLProperty {
    id: string;
    name: string;
    value: any;
}

export interface Control {
    id: string;
    type: string;
    constraints?: Constraints;
}

interface Constraints {
    visibility?: Constraint;
    requirement?: Constraint;
    modifiable?: Constraint;
}

interface Constraint {
    contexts?: Array<"INSERT" | "EDIT" | "READONLY">;
    conditions?: string;
}

export interface PropertyControlProps extends Control {
    label: string;
    property: string;
    value: any;
    customValidation?: CustomValidation;
    required: boolean;
    readonly: boolean;
}

interface CustomValidation {
    function: string;
    message: string;
}

export interface Columns extends Control {
    controls: Control[];
}

export interface ComboRadio extends PropertyControlProps {
    loadSettings: LoadSettings;
    options: object;
}

interface LoadSettings {
    type: string;
    qualification?: string;
}

export interface Date extends PropertyControlProps {
    min: string;
    max: string;
    step: number;
}

export interface Text extends PropertyControlProps {
    pattern: string;
    minLength: number;
    maxLength: number;
}

export interface Group extends Control {
    name: string;
    controls: Control[];
}

export interface Label extends Control {
    expression: string;
}

export interface Money extends PropertyControlProps {
    currency: string;
}

export interface Number extends PropertyControlProps {
    min: number;
    max: number;
    step: number;
}

export interface TableProps extends PropertyControlProps {
    controls: PropertyControlProps[];
    size: number;
}

export interface TabsProps extends Control {
    label: string;
    tabs: TabProps[];
}

interface TabProps {
    id: string;
    name: string;
    controls: Control[];
}

export interface TextArea extends PropertyControlProps {
    rows: number;
    cols: number;
    minLength: number;
    maxLength: number;
}