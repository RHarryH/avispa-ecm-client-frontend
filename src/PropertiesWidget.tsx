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

import {useEffect, useState} from "react";
import {useEventContext} from "./event/EventContext";

interface Test {
    test: string;
}

function PropertiesWidget() {
    const [propertiesWidgetData, setPropertiesWidgetData] = useState<Test>({
        test: "test"
    });

    const { state } = useEventContext();

    useEffect(() => {
        return setPropertiesWidgetData({
            test: "test"
        })
    }, []);

    return <>Selected: {state.id}</>;
}

export default PropertiesWidget;