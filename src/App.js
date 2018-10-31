import React, { Component } from 'react';
import './App.css';
import d21 from "./sampledata/d21.json"
import d20 from "./sampledata/d20.json"
import { parseEntry, getAllEntryTexts } from './doubleexposure.js'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Navigation } from './Navigation.js';
import FilterButtons from './FilterButtons';
import StarredEntryList from './StarredEntryList';
import Email from './Email';
import PeopleList from './PeopleList';
import getFilters from './filters.js';
import Info from './Info';
import EntryList from './EntryList';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: [],
            display: "Card",
            filters: [],
            starred: {},
            source: "Dex21",
            searchFilter: "",
        }
    }
    fetchLive(url) {
        const encodedUrl = encodeURIComponent(url);
        const coUrl = `http://allorigins.me/get?url=${encodedUrl}`;
        return fetch(coUrl).then((response) => response.json())
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
    const liveMap = {
      "Dex21-larp-live": "https://www.dexposure.com/d21larp.html",
      "Dex21-live": "https://www.dexposure.com/d21complete.html",
      "Met2018-live": "https://www.dexposure.com/m2018complete.html",
      "Metatopia 2018": "https://www.dexposure.com/m2018complete.html",
      "Dreamation 2019": "https://www.dexposure.com/d2019complete.html",
      "Dexcon 22": "https://www.dexposure.com/d22complete.html",
    };
    if (liveMap.hasOwnProperty(src)) {
      const url = liveMap[src];
      this.fetchLive(url).then((json) => {
        this.setState({
          entries: this.domParse(json),
        });
      });
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
          starred: {},
      });
      this.saveEventToLocalStorage(value);
      this.fromSource(value)
  }
    hydrateStateWithLocalStorage() {
        for (let key in this.state) {
            if (localStorage.hasOwnProperty(key)) {
                let value = localStorage.getItem(key);
                try {
                    value = JSON.parse(value);
                    this.setState({ [key]: value });
                } catch (e) {
                    // handle empty string
                    this.setState({ [key]: value });
                }
            }
        }
    }

    getEventFromLocalStorage(event) {
      const value = localStorage.getItem("event");
      return JSON.parse(value || '"Met2018-live"');
    }
    saveEventToLocalStorage(event) {
      localStorage.setItem("event", JSON.stringify(event));
    }

    saveStateToLocalStorage() {
        for (let key in this.state) {
            localStorage.setItem(key, JSON.stringify(this.state[key]));
        }
    }

  componentDidMount() {
      this.hydrateStateWithLocalStorage();

      const src = this.getEventFromLocalStorage();

    //const src = this.state.source;
      this.fromSource(src);

      // add event listener to save state to localStorage
      // when user leaves/refreshes the page
      window.addEventListener(
          "beforeunload",
          this.saveStateToLocalStorage.bind(this));
  }
    componentWillUnmount() {
        window.removeEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );

        // saves if component has a chance to unmount
        this.saveStateToLocalStorage();
    }

  clickSave(event, id) {
    const starred = this.state.starred;
    const val = starred[id] || false;
    const newDb = Object.assign({}, starred);
    newDb[id] = !val;
    this.setState({
      starred: newDb,
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
          filters: [],
      });
  }
  render() {
    const filters = this.state.filters;
    const starred = this.state.starred;
    const entries = this.state.entries;
    const commonEntries = groupBy(entries, "name");
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
                    <EntryList {...props} entries={entries} starred={starred}
                        filters={filters} 
                        view={this.state.display}
                        changeLayout={(e) => this.changeLayout(e)}
                        clearFilter={(e) => this.clearFilter(e)}
                        searchFilter={this.state.searchFilter}
                        clickSave={this.clickSave.bind(this)} />}
                />
                <Route path="/starred" exact render={(props) => 
                    <StarredEntryList {...props} entries={entries} 
                      starred={starred}
                      commonEntries={commonEntries}
                      view={this.state.display}
                      changeLayout={(e) => this.changeLayout(e)}
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
                    <Email {...props} entries={this.state.starred} />}
                />
                <Route path="/info" exact component={Info} />
                <Route path="/:id" exact render={(props) => 
                    <EntryList {...props} entries={entries} starred={starred}
                        filters={filters} 
                        view={this.state.display}
                        changeLayout={(e) => this.changeLayout(e)}
                        clearFilter={(e) => this.clearFilter(e)}
                        searchFilter={this.state.searchFilter}
                        clickSave={this.clickSave.bind(this)} />}
                />
            </Switch>
        </div>
      </div>
  </Router>
    );
  }
}

function TypeList(props) {
    const searchFor = props.searchFor;
    const types = props.events.map((e) => e.type);
    const typeSet = new Set(types);
    const sortedTypes = Array.from(typeSet).sort();
    const typeDiv = sortedTypes.map((t) => {
      return (<div className="type-list__type" onClick={(e) => searchFor(t)} 
        key={t}><a href="/">{t}</a></div>
      );
    });
  return ( 
    <div className="type-list">
      <div className="type-list__title">Systems</div>
      {typeDiv}
    </div>
  );
}

function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}


export default App;
