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

import {getPropertyControl, resource2TypeName} from "./Misc";
import testPropertyPage from "./test/property-page.json";

function controlFinderTest(searchedProperty: string, expectedControl: any, expectedPath: string|undefined) {
    const property = getPropertyControl(searchedProperty, testPropertyPage.controls);
    expect(property?.control).toEqual(expectedControl);
    expect(property?.valueJsonPath).toEqual(expectedPath);
}

test('check direct property', () => {
    controlFinderTest("issueDate", {
        "type": "date",
        "label": "Issue date",
        "property": "issueDate",
        "value": "",
        "required": true
    },
    "$.controls[1].value");
});

test('check unknown property', () => {
    controlFinderTest("unknown", undefined, undefined);
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
    }, "$.controls[0].controls[0].value");
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
    }, "$.controls[4].controls[0].controls[0].value");
});

test('check table property', () => {
    controlFinderTest("positions[0].unitPrice", {
        "type": "money",
        "label": "Unit price",
        "property": "unitPrice",
        "value": [""],
        "required": false,
        "currency": "PLN"
    }, "$.controls[3].value[0]");
});

test('check whole table', () => {
    controlFinderTest("positions", {
        "type": "table",
        "label": "Positions",
        "property": "positions",
        "required": true,
        "controls": [{
            "type": "text",
            "label": "Name",
            "property": "objectName",
            "value": [""],
            "required": false,
            "maxLength": 50
        }, {
            "type": "number",
            "label": "Quantity",
            "property": "quantity",
            "value": ["1"],
            "required": false,
            "min": 0.001,
            "max": 10000.0,
            "step": 0.001
        }, {
            "type": "combo",
            "label": "Unit",
            "property": "unit",
            "value": [""],
            "required": false,
            "sortByLabel": true,
            "options": {
                "HOUR": "godz.",
                "PIECE": "szt."
            }
        }, {
            "type": "money",
            "label": "Unit price",
            "property": "unitPrice",
            "value": [""],
            "required": false,
            "currency": "PLN"
        }, {
            "type": "number",
            "label": "Discount",
            "property": "discount",
            "value": ["0"],
            "required": false,
            "min": 0.0,
            "max": 100.0,
            "step": 0.01
        }, {
            "type": "combo",
            "label": "VAT Rate",
            "property": "vatRate",
            "value": [""],
            "required": false,
            "sortByLabel": false,
            "options": {
                "VAT_00": "0%",
                "VAT_05": "5%",
                "VAT_08": "8%",
                "VAT_23": "23%"
            }
        }, {
            "type": "hidden",
            "property": "id",
            "value": [""],
            "required": false
        }
        ],
        "size": 1
    }, "$.controls[3]");
});

test('check table property with index out of values range', () => {
    controlFinderTest("positions[1].unitPrice", undefined, undefined);
});

test('resource to type name conversion', () => {
    expect(resource2TypeName("test")).toEqual("Test");
    expect(resource2TypeName("test-resource")).toEqual("Test resource");
});