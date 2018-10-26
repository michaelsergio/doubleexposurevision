import React from 'react';

function PeopleList(props) {
  const events = props.events;
  const searchFor = props.searchFor;
  const people = events
    .map((e) => [e.author, e.presenter])
    .reduce((acc, val) => acc.concat(val), [])
    .flatMap(e => e.split(", "));
  const peopleSet = new Set(people);
  const sortedPeople = Array.from(peopleSet).sort();
  const peopleDiv = sortedPeople.map((p) => {
    return (<div key={p} onClick={(e) => searchFor(p)}
      className="person__name"><a href="/">{p}</a></div>);
  });
  return ( <div className="people-list">
    <div className="people-list__title">People</div>
    {peopleDiv}
    </div>);
}


export default PeopleList;
