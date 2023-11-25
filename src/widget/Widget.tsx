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

import React, {useCallback, useState} from "react";
import {Button} from "react-bootstrap";
import RepositoryWidget from "./RepositoryWidget";
import PropertiesWidget from "./PropertiesWidget";
import ListWidget from "./ListWidget";

export interface RestError {
    status: number
    message: string
    path: string
}

export enum WidgetType {
    REPOSITORY = 'REPOSITORY',
    PROPERTIES = 'PROPERTIES',
    LIST = 'LIST'
}

export interface WidgetProps {
    label: string
    active?: boolean
    type: WidgetType
    resource?: string
    configuration?: string
}

export interface DefaultConcreteWidgetProps {
    onError?: (error: RestError) => void
}

function Widget(widget: WidgetProps) {
    const [error, setError] = useState<RestError | undefined>(undefined);

    const onError = useCallback((error: RestError) => {
        setError(error);
    }, []);

    if (error) {
        return (
            <div className="py-3 text-center">
                <h3>Widget failed during loading!</h3>
                <h4>{error.message}</h4>
                <Button variant="primary" className="bi bi-arrow-repeat" onClick={() => setError(undefined)}> Reload
                    widget</Button>
            </div>
        );
    } else {
        switch (widget.type) {
            case WidgetType.REPOSITORY:
                return (<RepositoryWidget onError={onError}/>);
            case WidgetType.PROPERTIES:
                return (<PropertiesWidget/>);
            case WidgetType.LIST:
                return (<ListWidget configuration={widget.configuration} onError={onError}></ListWidget>);
        }
    }
}

export default Widget;