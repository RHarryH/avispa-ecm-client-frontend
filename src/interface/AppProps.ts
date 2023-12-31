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

import {SectionProps} from "../Section";

export interface AppProps {
    fullName: string
    shortName: string
    description: string
    header: Header
    layout: Layout
    versions: Version[]
}

interface Header {
    menu: Menu
}

export interface Menu {
    items: MenuItem[]
}

export interface MenuItem {
    label: string
    items?: MenuItem[]
    resource?: string
    action?: string
}

interface Layout {
    sections: SectionProps[];
}

export interface Version {
    componentName: string
    number: string
}