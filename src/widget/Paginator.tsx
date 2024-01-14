/*
 * Avispa ECM Client Frontend
 * Copyright (C) 2024 Rafał Hiszpański
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

import React from "react";
import {Pagination} from "react-bootstrap";

interface PaginationProps {
    pagesNum: number
    currentPage: number
    onClick: (pageNumber: number) => void
}

function Paginator({pagesNum, currentPage, onClick}: PaginationProps) {
    function renderPaginationItems(currentPage: number, pagesNum: number) {
        let array = [];
        for (let i = 1; i <= pagesNum; i++) {
            const distanceToCurrentPage = Math.abs(i - currentPage);
            if (i === 1 || i === pagesNum || distanceToCurrentPage <= 2) {
                array.push(
                    <Pagination.Item key={i} active={i === currentPage} onClick={() => onClick(i)}>{i}</Pagination.Item>
                );
            } else if (distanceToCurrentPage === 3) {
                array.push(
                    <Pagination.Ellipsis key={crypto.randomUUID()}/>
                );
            }
        }

        return array;
    }

    return (
        <Pagination size="sm" className="d-flex justify-content-center">
            <Pagination.First disabled={currentPage === 1} onClick={() => onClick(1)}/>
            <Pagination.Prev disabled={currentPage === 1}
                             onClick={() => onClick(Math.max(currentPage - 1, 1))}/>
            {renderPaginationItems(currentPage, pagesNum)}
            <Pagination.Next disabled={currentPage === pagesNum}
                             onClick={() => onClick(Math.min(currentPage + 1, pagesNum))}/>
            <Pagination.Last disabled={currentPage === pagesNum}
                             onClick={() => onClick(pagesNum)}/>
        </Pagination>
    );
}

export default Paginator;