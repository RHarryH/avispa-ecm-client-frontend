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

import {AxiosResponse} from "axios";

export function processDownload(response: AxiosResponse) {
    const type = response.headers['content-type'];
    const filename = getFilenameFromHeader(response);
    const blob = new Blob([response.data], {type: type});
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(blob)
    link.download = filename;
    link.click();

    setTimeout(() => window.URL.revokeObjectURL(link.href), 0); // memory cleanup
}

function getFilenameFromHeader(response: AxiosResponse) {
    const disposition = response.headers['content-disposition'];

    if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches?.[1]) {
            return matches[1].replace(/['"]/g, '');
        }
    }

    return "download";
}