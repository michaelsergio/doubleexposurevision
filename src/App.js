import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import d21 from "./d21.json"
import d20 from "./d20.json"
import { parseEntry, getAllEntryTexts } from './doubleexposure.js'
import { HashRouter as Router, 
         Route, Link, Switch, NavLink} from 'react-router-dom'
import cn from 'classnames/bind';


/*
 * TODO: 
 * Should have day dividers.
 * Add sort order.
 * Add Agenda view for starred.
 */

function EventItem(props) { 
    const name = props.name;
    const source = props.source;
    const dropdownClasses = cn("dropdown-item", {
        "event--active": name === source,
    });
    return (
        <li className={dropdownClasses}
            onClick={props.changeEvent}>{name}</li>
    );
}

function getFilters(value) {
      if (value === "LARP") return ['Q', 'L'];
      else if (value === "NAGA") return ['G'];
      else if (value === "DnD") return ['N'];
      else if (value === "RPG") return ['R'];
      else if (value === "Board Games") return ['B'];
      else if (value === "Arena / Wargamming") return ['A', 'G'];
      else if (value === "Collectable Games") return ['C'];
      else if (value === "Video Games") return ['V'];
      else if (value === "Pencil Puzzles") return ['P'];
      else if (value === "Special Events & Panels") return ['S'];
      else return [];
}

function Navigation(props) {
    const source = props.source;
    const changeEvent = props.changeEvent;
    const searchChange = props.searchChange;
    const searchFilter = props.searchFilter;

    const events = ["Dex21", "Dex20"].map((x) => {
        return (<EventItem name={x} source={source} 
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
                    {events}
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

function GridButtons(props) {
    return (
        <div className="grid-buttons">
            <input type="button" value="List" 
                onClick={props.changeLayout} />
            <input type="button" value="Card" 
                onClick={props.changeLayout} />
        </div>
    );
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
                        href="#">Clear Filters</a>
                </div>
        }
        </div>
    );
}

function TypeList(props) {
    const searchFor = props.searchFor;
    const types = props.events.map((e) => e.type);
    const typeSet = new Set(types);
    const sortedTypes = Array.from(typeSet).sort();
    const typeDiv = sortedTypes.map((t) => {
      return (<div className="type-list__type" onClick={(e) => searchFor(t)} 
        key={t}><a href="#">{t}</a></div>
      );
    });
  return ( 
    <div className="type-list">
      <div className="type-list__title">Systems</div>
      {typeDiv}
    </div>
  );
}

function StarredEntryList(props) {
    const entries = props.entries;
    const clickSave = props.clickSave;
    const db = props.db;
    const view = props.view;
    const entryList = entries
        .filter((le) => db[le.id] || false)
        .map((le) => {
            const saved = db[le.id] || false;
            return (
                <div>
                    <GridButtons changeLayout={(e) => this.changeLayout(e)} />
                    <Entry key={le.id} dict={le} saved={saved} view={view}
                        clickSave={(e) => clickSave(e, le.id)} />
                </div>
            );
        });
    return (entryList.length > 0) ? entryList : (
        <div className="starred-entries__none">No Starred Entries.</div>)
}

function EntryList(props) {
    const filters = props.filters;
    const entries = props.entries;
    const clickSave = props.clickSave;
    const clearFilter = props.clearFilter;
    const db = props.db;
    const view = props.view;
    const searchFilter = props.searchFilter;
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
            const saved = db[le.id] || false;
            return (
                <Entry key={le.id} dict={le} saved={saved} view={view}
                    clickSave={(e) => clickSave(e, le.id)} />
            );
        });
    return (<div>
        <GridButtons changeLayout={(e) => this.changeLayout(e)} />
        <FilterDescription filters={filters} 
            clearFilter={clearFilter}
            searchFilter={props.searchFilter} />
        {entryList}
    </div>)
}

function makeEmailLink(recipient, subject, body) {
  const encodedBody = body.replace("\n", "%0A").replace(" ", "%20");
  return `mailto:${recipient}?subject=${subject}&body=${encodedBody}`;
}

function Email(props) {
  const entries = props.entries;
  const plainText = Object.keys(entries).sort().join("\n");
  const mailLink = makeEmailLink(
    "vinny@example.com", 
    "Registration", 
    plainText
  );
  // TODO: need to do special key sort
  return(<div className="email">
    <div className="email__title"> Email Form </div>
    <pre>{plainText}</pre>
    <a href={mailLink}>Mail</a>
    </div>
  );
}

function SeeAlso(props) {
    const classes = cn("entry__see-also", {
        "entry__see-also--listview": props.isListView,
    });
  const seeAlso = props.txt.split(",")
    .map((x) => x.trim())
    //.map((x) => <Link to={"/" + x}>{x}</Link> );
    .map((x) => <a key={x} href={"#" + x}>{x}</a> );
  return ( <div className={classes}>See Also: {seeAlso}</div>)
}

function PeopleList(props) {
  const events = props.events;
  const searchFor = props.searchFor;
  const people = events
    .map((e) => [e.author, e.presenter])
    .reduce((acc, val) => acc.concat(val), []);
  const peopleSet = new Set(people);
  const sortedPeople = Array.from(peopleSet).sort();
  const peopleDiv = sortedPeople.map((p) => {
    return (<div key={p} onClick={(e) => searchFor(p)}
      className="person__name"><a href="#">{p}</a></div>);
  });
  return ( <div className="people-list">
    <div className="people-list__title">People</div>
    {peopleDiv}
    </div>);
}

function Entry(props) {
    const e = props.dict;
    const savedClasses = cn("entry__save", {
        "entry__save--saved": props.saved
    });
    const isListView = props.view === "List";
    const isFull = e !== undefined && e.status.indexOf("FILLED") !== -1;
    const idClasses = cn("entry__id", {
        "entry__id--filled": isFull,
    });
    const entryClasses = cn("entry", {
        "entry--filled": isFull,
        "entry--listview": isListView,
    });
    const byRowClasses = cn("entry__by-row", {
        "entry__by-row--listview": isListView,
    });
    const descClasses = cn("entry__description", {
        "entry__description--listview": isListView,
    });
    const extraClasses = cn("entry__extras", {
        "entry__extras--listview": isListView,
    });
    const statusClasses = cn("entry__status", {
        "entry__status--listview": isListView,
    });
    return (
      <div className={entryClasses} id={e.id}>
        <div className="entry__title-row">
        <div className={idClasses}>{e.id}</div>
        <div className="entry__name"> {e.name} </div>
        <div className="entry__type"> {e.type} </div>
        <div className={savedClasses} saved={e.saved}
          onClick={props.clickSave}></div>
      </div>
      <div className={byRowClasses}>
        {e.author && <div className="entry__author">By {e.author}</div>}
        {e.presenter && <div className="entry__presenter">Presented by {e.presenter}</div>}
      </div>
      <div className={descClasses}>{e.description}</div>
      { e.seeAlso && <SeeAlso isListView={isListView} txt={e.seeAlso} /> }
      <div className={extraClasses}>
        <div className="entry__round badge badge-primary">{e.round}</div>
        <div className="entry__material badge badge-primary">{e.material}</div>
        <div className="entry__level badge badge-primary">{e.level}</div>
        <div className="entry__attitude badge badge-primary">{e.attitude}</div>
        <div className="entry__age badge badge-primary">{e.age}</div>
        <div className="entry__next-round badge badge-primary">{e.nextRound}</div>
      </div>
      <div className={statusClasses}>{e.status}</div>
      <div className="entry__time-row">
        <div className="entry__day">{e.day}</div>
        <div className="entry__time">{e.time}</div>
      </div>
    </div>
  )
}

function isSelected(title, filters) {
    const titleFilters = getFilters(title)
    return titleFilters.length == filters.length && 
        titleFilters.every((x) => filters.includes(x));
}

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
            type="button" 
            onClick={filter} 
            value={t} />);
    });
    return (<div className="filter-buttons">{buttons}</div>);
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: [],
            display: "Card",
            filters: [],
            db: {},
            source: "Dex21",
            searchFilter: "",
        }
    }
    fetchLive() {
        // const url = "https://www.dexposure.com/d21larp.html";
        // const encodedUrl = encodeURIComponent(url);
        // const coUrl = `http://allorigins.me/get?url=${encodedUrl}`;
        /*
        fetch(coUrl)
          .then((response) => response.json())
          .then((json) => {
              const page = json.contents;
              const parser = new DOMParser();
              const doc = parser.parseFromString(page, "text/html");
              // each p tag turns into a listing object or null
              // { id: "L005", system: "Wayfinder", title: "The Hedge",
              //   byline: "", presentedBy: "", 

              this.setState({
                  entries: json.contents,
              });
          });
          */
    }
    domParse(json) {
        const parser = new DOMParser();
        const page = json.contents;
        const doc = parser.parseFromString(page, "text/html");
        const entryTexts = getAllEntryTexts(doc);
        const entries = entryTexts
            .map((txt) => parseEntry(txt))
            .filter((entry) => entry !== null);
        return entries;
    }
  fromSource(src) {
      if (src === "D21-live") {
          ;
      }
      else if (src === "Dex21") {
          this.setState({
              entries: this.domParse(d21),
          });
      }
      else if (src === "Dex20") {
          this.setState({
              entries: this.domParse(d20),
          });
      }
  }
  changeEvent(e) {
      const value = e.target.textContent;
      this.setState({
          source: value,
      });
      this.fromSource(value)
  }
  componentDidMount() {
      const src = this.state.source;
      this.fromSource(src);
  }
  clickSave(event, id) {
    const db = this.state.db;
    const val = db[id] || false;
    const newDb = Object.assign({}, db);
    newDb[id] = !val;
    this.setState({
      db: newDb,
    });
  }
  filter(e) {
      const value = e.target.value;
      let filters = getFilters(value);
      this.setState({
          filters: filters,
      });
  }
  searchChange(e) {
      this.setState({
          searchFilter: e.target.value,
      });
  }
  changeLayout(e) {
      this.setState({
          display: e.target.value,
      });
  }
  searchFor(txt) {
    this.setState({
      searchFilter: txt,
    });

  }
  clearFilter() {
      this.setState({
          searchFilter: "",
      });
  }
  render() {
    const filters = this.state.filters;
    const db = this.state.db;
    const entries = this.state.entries;
    return (
        <Router>
      <div className="container">
          <Navigation 
              source={this.state.source}
              searchFilter={this.state.searchFilter}
              changeEvent={(e)=>this.changeEvent(e)}
              searchChange={(e)=>this.searchChange(e)} 
          />
        <div className="title">Double Exposure Vision - {this.state.source}</div>
        <FilterButtons currentFilter={this.state.filters} 
                       filter={(e)=>this.filter(e)} 
        />
        <div className="App-intro">
            <Switch>
                <Route path="/" exact render={(props) => 
                    <EntryList {...props} entries={entries} db={db}
                        filters={filters} 
                        view={this.state.display}
                        changeLayout={(e) => this.changeLayout(e)}
                        clearFilter={(e) => this.clearFilter(e)}
                        searchFilter={this.state.searchFilter}
                        clickSave={this.clickSave.bind(this)} />}
                />
                <Route path="/starred" exact render={(props) => 
                    <StarredEntryList {...props} entries={entries} db={db}
                        view={this.state.display}
                        clickSave={this.clickSave.bind(this)} />}
                />
                <Route path="/people" exact render={(props) => 
                    <PeopleList {...props} events={entries} 
                        searchFor={this.searchFor.bind(this)} />}
                />
                <Route path="/system" exact render={(props) => 
                    <TypeList {...props} events={entries} 
                        searchFor={this.searchFor.bind(this)} />}
                />
                <Route path="/email" exact render={(props) => 
                    <Email {...props} entries={this.state.db} />}
                />
                <Route path="/info" exact component={Info} />
            </Switch>
        </div>
      </div>
  </Router>
    );
  }
}
function Info() {
    return (<div>
        <a href="https://dexposure.com/home.html">Double Exposure</a>
        <a className="random-link" 
          href="http://ipressgames.com/igx-update/">RPG Schedule</a> 
      </div>);
}
export default App;
