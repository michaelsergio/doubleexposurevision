import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import testdata from "./test.json"
import testdata from "./d20.json"
import { parseEntry, getAllEntryTexts } from './doubleexposure.js'
import { HashRouter as Router, Route, Link } from 'react-router-dom'


function makeEmailLink(recipient, subject, body) {
  const encodedBody = body.replace("\n", "%0A").replace(" ", "%20");
  return `mailto:${recipient}?subject=${subject}&body=${encodedBody}`;
}

function Email(props) {
  const entries = props.entries;
  const plainText = Object.keys(entries).join("\n");
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
  const seeAlso = props.txt.split(",")
    .map((x) => x.trim())
    //.map((x) => <Link to={"/" + x}>{x}</Link> );
    .map((x) => <a key={x} href={"#" + x}>{x}</a> );
  return ( <div className="entry__see-also">See Also: {seeAlso}</div>)
}
function Person(props) {
  return (<div className="person__name">{props.name}</div>);
}

function PeopleList(props) {
  const events = props.events;
  const people = events
    .map((e) => [e.author, e.presenter])
    .reduce((acc, val) => acc.concat(val), []);
  const peopleSet = new Set(people);
  const sortedPeople = Array.from(peopleSet).sort();
  const peopleDiv = sortedPeople.map((p) => {
    return (<Person key={p} name={p} />)
  });
  return ( <div className="people-list">{peopleDiv}</div>);
}

function Entry(props) {
  const e = props.dict;
  const savedClasses = "entry__saved" + (props.saved ? " entry__saved--saved" : "");
  const isFull = e !== undefined && e.status.indexOf("FILLED") !== -1;
  const idClasses = "entry__id" + (isFull ? " entry__id--filled" : "");
  return (
    <div className="entry" id={e.id}>
        <div className="entry__title-row">
        <div className={idClasses}>{e.id}</div>
        <div className="entry__name"> {e.name} </div>
        <div className="entry__type"> {e.type} </div>
        <div className={savedClasses} saved={e.saved}
          onClick={props.clickSave}></div>
      </div>
      <div className="entry__by-row">
        {e.author && <div className="entry__author">By {e.author}</div>}
        {e.presenter && <div className="entry__presenter">Presented by {e.presenter}</div>}
      </div>
      <div className="entry__description">{e.description}</div>
      { e.seeAlso && <SeeAlso txt={e.seeAlso} /> }
      <div className="entry__extras">
        <div className="entry__round badge badge-primary">{e.round}</div>
        <div className="entry__material badge badge-primary">{e.material}</div>
        <div className="entry__level badge badge-primary">{e.level}</div>
        <div className="entry__attitude badge badge-primary">{e.attitude}</div>
        <div className="entry__age badge badge-primary">{e.age}</div>
        <div className="entry__next-round badge badge-primary">{e.nextRound}</div>
      </div>
      <div className="entry__status">{e.status}</div>
      <div className="entry__time-row">
        <div className="entry__day">{e.day}</div>
        <div className="entry__time">{e.time}</div>
      </div>
    </div>
  )

}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            larps: [],
            display: "List",
            db: {},
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
                  larps: json.contents,
              });
          });
          */
    }
  componentDidMount() {
    const parser = new DOMParser();
    const page = testdata.contents;
    const doc = parser.parseFromString(page, "text/html");
    const entryTexts = getAllEntryTexts(doc);
    const larps = entryTexts
      .map((txt) => parseEntry(txt))
      .filter((entry) => entry !== null);
    this.setState({
      larps: larps,
      filters: [],
    });
  }
  email(e) {
    const db = this.state.db;
    const keys = Object.keys(db);
    if (keys.length === 0) alert("You need to star items first");
    else alert("Sending Email");
  }
  clickSave(event, id) {
    const db = this.state.db;
    const val = db[id] || false;
    const reassign = {};
    reassign[id] = !val;

    const newDb = Object.assign(reassign, db);
    this.setState({
      db: newDb,
    });
  }
  filter(e) {
      const value = e.target.value;
      let filters = [];
      if (value === "LARP") filters = ['Q', 'L'];
      else if (value === "NAGA") filters = ['G'];
      else if (value === "DnD") filters = ['N'];
      else if (value === "RPG") filters = ['R'];
      else if (value === "Board Games") filters = ['B'];
      else if (value === "Arena/Wargamming") filters = ['A', 'G'];
      else if (value === "Collectable Games") filters = ['C'];
      else if (value === "Video Games") filters = ['V'];
      else if (value === "Pencil Puzzles") filters = ['P'];
      else if (value === "Special Events & Panels") filters = ['S'];
      else filters = [];
      this.setState({
          filters: filters,
      });
  }
  render() {
      const filters = this.state.filters;
      const larpEntries = this.state.larps
          .filter((le) => {
              if (filters.length === 0) return true;
              const startsWith = (filterLetter) => le.id.startsWith(filterLetter);
              return filters.some(startsWith);
          })
          .map((le) => {
      const saved = this.state.db[le.id] || false;
      return (<Entry key={le.id} dict={le} 
        saved={saved}
        clickSave={(e)=> this.clickSave(e, le.id)} />);
    });
    return (
      <div className="container">
      <ul className="navigation" role="navigation">
        <li>Home</li>
        <li>Starred</li>
        <li>Change-Event</li>
        <li onClick={(e)=>this.email()}>Email</li>
        <li className="navigation__search"><form><input placeholder="Search"/><i className="search"></i></form></li>
      </ul>
        <div className="title">Double Exposure Vision</div>
        <div className="grid-buttons">
          <input type="button" value="List"></input>
          <input type="button" value="Card"></input>
        </div>
        <div className="filter-buttons">
        <input type="button" onClick={(e)=>this.filter(e)}  value="LARP"></input>
        <input type="button" onClick={(e)=>this.filter(e)}  value="NAGA"></input>
        <input type="button" onClick={(e)=>this.filter(e)}  value="DnD"></input>
        <input type="button" onClick={(e)=>this.filter(e)}  value="RPG"></input>
        <input type="button" onClick={(e)=>this.filter(e)}  value="Board Games"></input>
        <input type="button" onClick={(e)=>this.filter(e)}  value="Arena/Wargamming"></input>
        <input type="button" onClick={(e)=>this.filter(e)}  value="Collectable Games"></input>
        <input type="button" onClick={(e)=>this.filter(e)}  value="Video Games"></input>
        <input type="button" onClick={(e)=>this.filter(e)}  value="Pencil Puzzles"></input>
        <input type="button" onClick={(e)=>this.filter(e)}  value="Special Events & Panels"></input>
        <input type="button" onClick={(e)=>this.filter(e)}  value="All"></input>
        </div>
        <div className="App-intro">
      {larpEntries}
        </div>
      <PeopleList events={this.state.larps} />
      <Email entries={this.state.db} />
      <div>
        <a className="random-link" 
          href="http://ipressgames.com/igx-update/">RPG Schedule</a> 
      </div>
      </div>
    );
  }
}

export default App;
