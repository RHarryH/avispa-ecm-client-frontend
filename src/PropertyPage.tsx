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

interface PropertyPageProps {
    propertyPage: PropertyPageConfig;
}

export interface PropertyPageConfig {
    readonly: boolean;
    size: string;
    controls: Control[];
}

interface Control {
    type: string;
    conditions: Condition;

    rows?: number;
    cols?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;

    label?: string;

    typeName?:string;
    typeNameExpression?: string;
    dictionary?: string;
    sortByLabel?: boolean;

    min?:string|number;
    max?:string|number;
    step?:number;

    name?: string;

    expression?:string;

    currency?:string;

    tabs?: Tab[];
    controls?: Control[];
}

interface Tab {
    name: string;
    controls: Control[];
}

interface Condition {
    visibility: string;
    requirement: string;
}

function PropertyPage({propertyPage}:PropertyPageProps){
    return <></>;
}

export default PropertyPage;