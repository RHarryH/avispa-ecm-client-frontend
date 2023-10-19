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

import {getPropertyControl} from "./Misc";
import testPropertyPage from "./test/property-page.json";

function controlFinderTest(searchedProperty: string, expected: any) {
    const property = getPropertyControl(searchedProperty, testPropertyPage.controls);
    expect(property?.control).toEqual(expected);
}

test('check direct property', () => {
    controlFinderTest("issueDate", {
        "type": "date",
        "label": "Issue date",
        "property": "issueDate",
        "value": "",
        "required": true
    });
});

test('check unknown property', () => {
    controlFinderTest("unknown", undefined);
});

test('check control inside grouping control', () => {
    controlFinderTest("seller", {
        "type": "combo",
        "label": "Seller",
        "property": "seller",
        "value": "",
        "required": true,
        "typeName": "Customer",
        "sortByLabel": false,
        "options": {
            "e4f38c78-74ec-49f6-b6c6-effe4ac633b4": "AVISPA SOFTWARE Rafał Hiszpański",
            "1bfb2de1-4aa8-4e0a-a007-878ae91443aa": "ITDS Polska Sp. z o.o.",
            "e8033580-dced-4142-8db8-1c67fa36c81f": "Transition Technologies MS S.A."
        }
    });
});

test('check nested property', () => {
    controlFinderTest("payment.method", {
        "type": "combo",
        "label": "Method",
        "property": "payment.method",
        "value": "BANK_TRANSFER",
        "required": true,
        "sortByLabel": true,
        "options": {
            "BANK_TRANSFER": "przelew bankowy",
            "CASH": "gotówka",
            "VAT_00": "0%",
            "VAT_05": "5%"
        }
    });
});

test('check table property', () => {
    controlFinderTest("positions[0].unitPrice", {
        "type": "money",
        "label": "Unit price",
        "property": "unitPrice",
        "value": [""],
        "required": false,
        "currency": "PLN"
    });
});

test('check table property with index out of values range', () => {
    controlFinderTest("positions[1].unitPrice", undefined);
});