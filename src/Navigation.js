import React, { Component } from 'react';
import cn from 'classnames/bind';
import { HashRouter as Router, 
    Route, Link, Switch, NavLink} from 'react-router-dom'

function Navigation(props) {
    const source = props.source;
    const changeEvent = props.changeEvent;
    const searchChange = props.searchChange;
    const searchFilter = props.searchFilter;

    const events = ["Dex21", "Dex20", "Dex21-larp-live", "Dex21-live"].map((x) => {
        return (<EventItem key={x} name={x} source={source} 
            changeEvent={changeEvent} />)
    });
    return (
        <ul className="navigation" role="navigation">
            <li><NavLink to="/" exact activeClassName="navigation--selected">List</NavLink></li>
            <li><NavLink to="/people" activeClassName="navigation--selected">People</NavLink></li>
            <li><NavLink to="/system" activeClassName="navigation--selected">Systems</NavLink></li>
            <li><NavLink to="/starred" exact activeClassName="navigation--selected">Starred</NavLink></li>
            <li><NavLink to="/email" activeClassName="navigation--selected">Email</NavLink></li>
            <li><NavLink to="/info" exact activeClassName="navigation--selected">Info</NavLink></li>
            <li className="dropdown show">
                <div className="dropdown-toggle" data-toggle="dropdown" 
                    id="dropdownMenuLink"
                    aria-haspopup="true" aria-expanded="false">Events</div>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <ul>
                        {events}
                    </ul>
                </div>
            </li>
            <li className="navigation__search"> <form>
                    <input onChange={searchChange}
                        placeholder="Search" value={searchFilter} />
                </form>
            </li>
        </ul>
    );
}

function EventItem(props) { 
    const name = props.name;
    const source = props.source;
    const dropdownClasses = cn("dropdown-item", {
        "event--active": name === source,
    });
    return (
        <li className={dropdownClasses} onClick={props.changeEvent}>{name}</li>
    );
}

export { Navigation } ;
