import React from 'react';
import Entry from './Entry';
import GridButtons from './GridButtons';

function EntryList(props) {
    const filters = props.filters;
    const entries = props.entries;
    const clickSave = props.clickSave;
    const clearFilter = props.clearFilter;
    const starred = props.starred;
    const view = props.view;
    const changeLayout = props.changeLayout;
    const searchFilter = props.searchFilter;
    const commonEntries = groupBy(entries, "name");
    const entryList = entries
        .filter((le) => {
            if (searchFilter.length < 2) return true;
            const search = searchFilter.toLowerCase();
            const searchFn = (item) => {
                return item.toLowerCase().indexOf(search) !== -1;
            };
            const datetime = `${le.day} ${le.time}`;
            const searchItems = [
                le.id,
                le.name,
                le.type,
                //le.description,
                le.author,
                le.presenter,
                le.day,
                datetime,
            ];
            return searchItems.some(searchFn);
        })
        .filter((le) => {
            if (filters.length === 0) return true;
            const id = le.id;
            const startsWith = (filterLetter) => id.startsWith(filterLetter);
            return filters.some(startsWith);
        })
        .map((le) => {
            const saved = starred[le.id] || false;
            return (
              <Entry key={le.id} dict={le} saved={saved} view={view}
                similar={commonEntries[le.name]}
                clickSave={(e) => clickSave(e, le.id)} />
            );
        });
    return (<div>
        <GridButtons changeLayout={changeLayout} />
        <FilterDescription filters={filters} 
            clearFilter={clearFilter}
            searchFilter={props.searchFilter} />
        {entryList}
    </div>)
}

function FilterDescription(props) {
    const filters = props.filters;
    const searchFilter = props.searchFilter;
    const filtersApplied = [];
    const clearFilter = props.clearFilter;
    if (filters.length > 0) {
        filtersApplied.push(`ID starting with "${filters.join(",")}"`);
    }
    if (searchFilter.length > 1) {
        filtersApplied.push(`text containing: "${searchFilter}"`);
    }
    const text = filtersApplied.join(" AND ");
    return (
        <div>
        {text && 
                <div className="filter__description">
                    Filters: {text}
                    <a className="filter__clear"
                        onClick={clearFilter}
                        href="/">Clear Filters</a>
                </div>
        }
        </div>
    );
}


function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

export default EntryList;
