import React from 'react';
import cn from 'classnames/bind';
import getFilters from './filters.js';

function FilterButtons(props) {
    const currentFilter = props.currentFilter;
    const filter = props.filter;
    const Button = (props) => {
        const value = props.value;
        const event = props.event;
    };
    const titles = ["All", "LARP", "NAGA", "DnD", "RPG", "Board Games",
        "Arena / Wargamming", "Collectable Games", "Video Games",
        "Pencil Puzzles", "Special Events & Panels",
    ];
    const buttons = titles.map((t) => {
        const selected = isSelected(t, currentFilter);
        const buttonClasses = cn("btn", {
            "btn-primary": selected,
            "btn-secondary": !selected,
        });
        return (<input 
            className={buttonClasses}
            key={t}
            type="button" 
            onClick={filter} 
            value={t} />);
    });
    return (<div className="filter-buttons">{buttons}</div>);
}

function isSelected(title, filters) {
    const titleFilters = getFilters(title)
    return titleFilters.length === filters.length && 
        titleFilters.every((x) => filters.includes(x));
}


export default FilterButtons;
