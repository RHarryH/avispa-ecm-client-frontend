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

import {AxiosResponse} from "axios";
import {Columns, Control, Group, PropertyControlProps, TableProps, Tabs} from "../interface/PropertyPageConfig";

export function processDownload(response: AxiosResponse) {
    const type = response.headers['content-type'];
    const filename = getFilenameFromHeader(response);
    const blob = new Blob([response.data], {type: type});
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(blob)
    link.download = filename;
    link.click();

    setTimeout(() => window.URL.revokeObjectURL(link.href), 0); // memory cleanup
}

function getFilenameFromHeader(response: AxiosResponse) {
    const disposition = response.headers['content-disposition'];

    if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches?.[1]) {
            return matches[1].replace(/['"]/g, '');
        }
    }

    return "download";
}

export interface FoundControl {
    control: PropertyControlProps;
    index?: number; // optional index in case of table content
}

export const getPropertyControl = (searchedProperty: string, controls: Control[]):FoundControl|undefined => {
    let found = undefined;
    for (const control of controls) {
        if('value' in control) {
            const propertyControl = control as PropertyControlProps;
            if(propertyControl.property === searchedProperty) {
                //console.log("Control " + searchedProperty + " found");
                return {control: propertyControl};
            }
        } else if (control.type === 'group') {
            const group = control as Group;
            //console.log("Entering from group " + group.name);
            found = getPropertyControl(searchedProperty, group.controls);
        } else if (control.type === 'columns') {
            //console.log("Entering from columns");
            const columns = control as Columns;
            found = getPropertyControl(searchedProperty, columns.controls);
        } else if (control.type === 'tabs') {
            //console.log("Entering from tabs");
            const tabs = control as Tabs;
            tabs.tabs.forEach(tab => {
                found = getPropertyControl(searchedProperty, tab.controls);
            });
        } else if (control.type === 'table') {
            //console.log("Entering from table");
            const table = control as TableProps;
            found = getPropertyInTable(searchedProperty, table);
        }
        if (found) {
            return found;
        }
    }

    return found;
}

function getPropertyInTable(searchedProperty:string, table:TableProps) {
    const indexRegex = /\[(0|[1-9]\d*)]/i;
    const match = indexRegex.exec(searchedProperty);
    if(match?.index) {
        const inTableProperty = searchedProperty.substring(match.index + match.length + 2);
        const found = table.controls.find(control => control.property === inTableProperty)
        const index = parseInt(match[1]);
        if(found && found?.value.length > index) {
            return {
                control: found,
                index: index
            }
        }
    } else { // if there is not access to table field found, return table itself
        return {
            control: table
        };
    }
}