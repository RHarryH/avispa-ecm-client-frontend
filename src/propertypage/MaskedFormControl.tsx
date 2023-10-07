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

import React from "react";
import {FormControl} from "react-bootstrap";
import {withMask} from "use-mask-input";

export default function MaskedFormControl(props:any) {
    /*
    // this code can be used with plain inputmask library
    // don't forget about ref={ref} in actual element and import of inputmask(.min).js
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if(ref.current) {
            Inputmask({"regex": props.pattern}).mask(ref.current)
        }
    }, []);*/

    return <FormControl ref={withMask("", {"regex": props.pattern})} {...props}/>
}