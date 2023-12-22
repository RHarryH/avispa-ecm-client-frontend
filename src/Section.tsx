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

import {Col, Tab, Tabs} from "react-bootstrap";
import React, {useState} from "react";
import {useEventListener} from "./event/EventContext";
import {FocusableEventData, ItemUpsertedEventData} from "./event/EventReducer";
import Widget, {WidgetProps, WidgetType} from "./widget/Widget";

export enum SectionLocation {
    SIDEBAR = 'SIDEBAR',
    CENTER = 'CENTER'
}

export interface SectionProps {
    location: SectionLocation
    activeWidget?: string
    widgets: WidgetProps[]
}

function Section({location, widgets}:SectionProps){
    const [key, setKey] = useState<string>(getDefaultWidget(widgets));

    // FOCUS EVENTS SHOULD GO ALWAYS HERE
    useEventListener(["REPOSITORY_ITEM_SELECTED", "REPOSITORY_ITEM_DESELECTED"], (state) => {
        const data = state.data as FocusableEventData;
        if(!data?.focus) {
            return;
        }

        // focus on properties widget
        const propertiesWidget = widgets.find(widget => widget.type === WidgetType.PROPERTIES);
        const tabKey = propertiesWidget?.label.toLowerCase();
        if (tabKey) {
            setKey(tabKey);
        }
    });

    useEventListener(["ITEM_UPSERT"], (state) => {
        const data = state.data as ItemUpsertedEventData;
        if(!data?.focus) {
            return;
        }

        // focus on list widget
        const listWidget = widgets.find(widget => widget.type === WidgetType.LIST && widget.resource === data.upsertedResource);
        if(listWidget) {
            const tabKey = getTabKey(listWidget);
            if (tabKey) {
                setKey(tabKey);
            }
        }
    });

    function getAriaLabel(id: string) {
        const firstLetter = id.charAt(0);
        const firstLetterCap = firstLetter.toUpperCase();
        const remainingLetters = id.slice(1);
        return firstLetterCap + remainingLetters;
    }

    function getDefaultWidget(widgets: WidgetProps[]) {
        let widget = widgets.find(widget => widget.active);

        // select first widget as active if not specified in another way
        if(!widget && widgets.length) {
            widget = widgets[0];
        }

        return widget ? getTabKey(widget) : "";
    }

    function getTabKey(widget: WidgetProps) {
        return widget.resource ? widget.resource : widget.label.toLowerCase();
    }

    if(widgets.length) {
        let sectionWidth: number | undefined;
        if(location === SectionLocation.SIDEBAR) {
            sectionWidth = 2;
        }

        const id = SectionLocation[location].toLowerCase();
        const ariaLabel = getAriaLabel(id);

        return (
            <Col lg={sectionWidth}>
                <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k ?? "")}
                    id={id}
                    aria-label={ariaLabel}
                >
                    {
                        widgets.map(widget => {
                            const tabKey = getTabKey(widget);
                            return (
                                <Tab key={tabKey} eventKey={tabKey} title={widget.label}>
                                    <Widget label={widget.label} type={widget.type}
                                            configuration={widget.configuration}></Widget>
                                </Tab>
                            );
                        })
                    }
                </Tabs>
            </Col>
        );
    }

    return null;
}

export default Section;