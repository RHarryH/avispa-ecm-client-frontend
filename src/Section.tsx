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

import {SectionProps, SectionTypeEnum, WidgetProps, WidgetTypeEnum} from "./interface/AppProps";
import RepositoryWidget from "./RepositoryWidget";
import PropertiesWidget from "./PropertiesWidget";
import ListWidget from "./ListWidget";
import {Col, Tab, Tabs} from "react-bootstrap";
import React from "react";

function Widget(widget: WidgetProps) {
    switch(widget.type) {
        case WidgetTypeEnum.REPOSITORY:
            return (<RepositoryWidget></RepositoryWidget>);
        case WidgetTypeEnum.PROPERTIES:
            return (<PropertiesWidget></PropertiesWidget>);
        case WidgetTypeEnum.LIST:
            return (<ListWidget></ListWidget>);
    }

    return (<></>);
}
function Section({type, activeWidget, widgets}:SectionProps){
    function getAriaLabel(id: string) {
        const firstLetter = id.charAt(0);
        const firstLetterCap = firstLetter.toUpperCase();
        const remainingLetters = id.slice(1);
        return firstLetterCap + remainingLetters;
    }

    if(widgets.length) {
        let sectionWidth: number | undefined = undefined;
        switch(type) {
            case SectionTypeEnum.SIDEBAR:
                sectionWidth = 2;
                break;
        }

        const id = SectionTypeEnum[type].toLowerCase();
        const ariaLabel = getAriaLabel(id);

        return (
            <Col lg={sectionWidth}>
                <Tabs
                    defaultActiveKey={activeWidget}
                    id={id}
                    aria-label={ariaLabel}
                >
                    {
                        widgets.map(widget => (
                            <Tab eventKey={widget.name.toLowerCase()} title={widget.name}>
                                <Widget name={widget.name} type={widget.type}></Widget>
                            </Tab>
                        ))
                    }
                </Tabs>
            </Col>
        );
    }

    return (<></>);
}

export default Section;