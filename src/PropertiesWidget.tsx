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

import React, {useState} from "react";
import {useEventListener} from "./event/EventContext";
import axios from "axios";
import {PropertyPageConfig} from "./interface/PropertyPageConfig";
import PropertyPage from "./propertypage/PropertyPage";

interface PropertiesWidgetData {
    objectFound?: boolean;
    propertyPage?: PropertyPageConfig;
}

function PropertiesWidget() {
    const [propertiesWidgetData, setPropertiesWidgetData] = useState<PropertiesWidgetData>({});

    useEventListener(["REPOSITORY_ITEM_SELECTED"], (state) => {
        axios.get<PropertiesWidgetData>('/widget/properties-widget/' + state.id)
            .then(response => {
                const widgetData = response.data;
                setPropertiesWidgetData(widgetData);
            })
            .catch(function (error) {
                console.log(error);
            })
    });

    useEventListener(["REPOSITORY_ITEM_DESELECTED"], () => {
        setPropertiesWidgetData({});
    });

    function renderPropertyPage() {
        if(propertiesWidgetData.objectFound) {
            if (propertiesWidgetData.propertyPage) {
                return <PropertyPage propertyPage={propertiesWidgetData.propertyPage}></PropertyPage>;
            } else {
                return <span>Property Page for selected object is not defined</span>;
            }
        } else {
            return <span>Object not found</span>;
        }
    }

    return <div className="py-3">
        {
            propertiesWidgetData.objectFound && propertiesWidgetData.propertyPage ?
                renderPropertyPage() :
                (<span>Nothing is selected</span>)
        }
    </div>;
}

export default PropertiesWidget;