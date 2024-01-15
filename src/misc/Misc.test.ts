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
            "id": "5a9da2df-4d01-4061-8a9d-8bd9b1314842",
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
        "id": "2c740c3f-9887-4470-b87f-012e0a1d2882",
        "type": "combo",
        "label": "Seller",
        "property": "seller",
        "value": "",
        "required": true,
        "options": {
            "e4f38c78-74ec-49f6-b6c6-effe4ac633b4": "AVISPA SOFTWARE Rafał Hiszpański",
            "1bfb2de1-4aa8-4e0a-a007-878ae91443aa": "ITDS Polska Sp. z o.o.",
            "e8033580-dced-4142-8db8-1c67fa36c81f": "Transition Technologies MS S.A."
        }
    }, "$.controls[0].controls[0].value");
});

test('check nested property', () => {
    controlFinderTest("payment.method", {
        "id": "0ddc1e1d-0a44-49b9-a61c-2d8ec24025d7",
        "type": "combo",
        "label": "Method",
        "property": "payment.method",
        "value": "BANK_TRANSFER",
        "required": true,
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
        "id": "610932cb-cf2a-4fe2-9f89-c4b9e3896baf",
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
        "id": "95b2f162-7868-4e00-a162-5154ca6322fe",
        "type": "table",
        "label": "Positions",
        "property": "positions",
        "required": true,
        "controls": [{
            "id": "d8300f38-bc45-4c98-b8ef-88603a518dd8",
            "type": "text",
            "label": "Name",
            "property": "objectName",
            "value": [""],
            "required": false,
            "maxLength": 50
        }, {
            "id": "ebd55325-b3bc-4d23-b9b3-a5f7f7b8d176",
            "type": "number",
            "label": "Quantity",
            "property": "quantity",
            "value": ["1"],
            "required": false,
            "min": 0.001,
            "max": 10000.0,
            "step": 0.001
        }, {
            "id": "4b06914b-43f1-45c4-bc96-ed994f625118",
            "type": "combo",
            "label": "Unit",
            "property": "unit",
            "value": [""],
            "required": false,
            "options": {
                "HOUR": "godz.",
                "PIECE": "szt."
            }
        }, {
            "id": "610932cb-cf2a-4fe2-9f89-c4b9e3896baf",
            "type": "money",
            "label": "Unit price",
            "property": "unitPrice",
            "value": [""],
            "required": false,
            "currency": "PLN"
        }, {
            "id": "5d2fa31f-69ce-4e78-8132-f809e3f2dc0a",
            "type": "number",
            "label": "Discount",
            "property": "discount",
            "value": ["0"],
            "required": false,
            "min": 0.0,
            "max": 100.0,
            "step": 0.01
        }, {
            "id": "b5864d8d-d378-42ee-bf2c-742aff372a4e",
            "type": "combo",
            "label": "VAT Rate",
            "property": "vatRate",
            "value": [""],
            "required": false,
            "options": {
                "VAT_00": "0%",
                "VAT_05": "5%",
                "VAT_08": "8%",
                "VAT_23": "23%"
            }
        }, {
            "id": "0758aded-053e-4943-951b-f971293cf88c",
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