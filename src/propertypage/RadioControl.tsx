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

import {ComboRadio} from "../interface/PropertyPageConfig";
import {FormCheck} from "react-bootstrap";
import React from "react";

interface RadioProps {
    radio: ComboRadio;
    propertyValue: any;
}

function RadioControl({radio, propertyValue}: RadioProps) {
    function getRadioOptions(values: Map<string, string>) {
        const array = [];
        let index = 0;
        for (let [key, value] of values) {
            array.push(<FormCheck type="radio" id={radio.property + index++} name={radio.property} inline label={value} value={key} checked={key === currentKey} required={radio.required}/>);
        }

        return <>{array}</>;
    }

    const currentKey = typeof propertyValue === 'string' || !propertyValue ? propertyValue : propertyValue.id;
    const dictionaryMap = new Map(Object.entries(radio.options));

    return getRadioOptions(dictionaryMap);
}

export default RadioControl;
