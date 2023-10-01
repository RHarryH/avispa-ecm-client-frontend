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

import {FormSelect} from "react-bootstrap";
import {ComboRadio, HTMLProperty} from "../interface/PropertyPageConfig";

interface ComboProps {
    combo: ComboRadio;
    property: HTMLProperty;
}

function ComboControl({combo, property}: ComboProps) {
    function getComboOptions(values: Map<string, string>) {
        const array = [];
        for (let [key, value] of values) {
            array.push(<option value={key}>{value}</option>);
        }

        return <>{array}</>;
    }

    const dictionaryMap = new Map(Object.entries(combo.options));
    const currentKey = typeof property.value === 'string' || !property.value ? property.value : property.value.id;
    const dictionaryHas = dictionaryMap.has(currentKey);

    return (
        <FormSelect id={property.id} name={property.name} defaultValue={currentKey} required={combo.required}>
            {
                currentKey && !dictionaryHas ?
                    (<option value="" selected disabled hidden>DEPRECATED</option>) :
                    null
            }
            {getComboOptions(dictionaryMap)}
        </FormSelect>
    );
}

export default ComboControl;
