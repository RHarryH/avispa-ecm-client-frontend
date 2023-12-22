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

import React, {useEffect, useMemo, useRef} from "react";
import {FormControl, FormControlProps} from "react-bootstrap";
import {BsPrefixProps, ReplaceProps} from "react-bootstrap/helpers";

//handy type definition to wrap up the replace+bsprefix bits of bootstrap
type BootstrapComponentProps<As extends React.ElementType, P> = ReplaceProps<As, BsPrefixProps<As> & P>

//our extended button properties
type MaskedFormControlProps = {
    money?: boolean;
    //any new properties we want to add go here
} & FormControlProps

//boot-strap-ified full button properties with all the bells and whistles
type MaskedFormControlProperties<As extends React.ElementType = 'input'> =
    BootstrapComponentProps<As, MaskedFormControlProps>

export default function MaskedFormControl(props: MaskedFormControlProperties) {
    const ref = useRef<HTMLElement>(null);

    // /*"greedy": true*/
    const currencyAlias = useMemo(() => {
        return {
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
        }
    }, []);

    useEffect(() => {
        if(ref.current) {
            if (props.pattern) {
                Inputmask({"regex": props.pattern}).mask(ref.current)
            } else if (props.money) {
                Inputmask(currencyAlias).mask(ref.current)
            }
        }
    }, [props.pattern, props.money, currencyAlias]);

    //return <FormControl ref={withMask("A", {"regex": props.pattern})} {...props}/>
    const {money, ...formProps} = props; // exclude money from props for FormControl
    return <FormControl ref={ref} {...formProps}/>
}