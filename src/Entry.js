import React, { Component } from 'react';
import cn from 'classnames/bind';

class Entry extends Component {
    state = {
      showRawVersion: false,
    };
    toggleRaw() {
      this.setState({
        showRawVersion: !this.state.showRawVersion,
      });
    }
    render() {
      const e = this.props.dict;
      const similar = (this.props.similar || [])
        .filter(se => se.id !== e.id)
        .map(se => <SimilarEntry key={se.id} entry={se} />);
      const savedClasses = cn("entry__save", {
            "entry__save--saved": this.props.saved
        });
        const isListView = this.props.view === "List";
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
        const divLink = "#" + e.id;
        const content = this.state.showRawVersion ? <span className="entry__description__raw">{e.raw}</span> : e.description;
        return (
            <div className={entryClasses} id={e.id}>
                <div className="entry__title-row">
                    <div className={idClasses}>{e.id}</div>
                    <div className="entry__name"> {e.name} </div>
                    <div className="entry__type"> {e.type} </div>
                    <div className={savedClasses} saved={e.saved}
                        onClick={this.props.clickSave}></div>
                </div>
                <div className={byRowClasses}>
                    {e.author && <div className="entry__author">By {e.author}</div>}
                    {e.presenter && <div className="entry__presenter">Presented by {e.presenter}</div>}
                </div>
                <div className={descClasses}>
                  { content }
                  <span
                    className="entry__raw__button"
                    onClick={e=>this.toggleRaw()}>
                    {this.state.showRawVersion ? "Parsed" : "Raw" }
                  </span>
                </div>
                { e.seeAlso && <SeeAlso isListView={isListView} txt={e.seeAlso} /> }
                { similar.length > 0 && <div className="entry__similar__entries">Similar: {similar}</div> }
                <div className={extraClasses}>
                    <div className="entry__round badge badge-primary">{e.round}</div>
                    <div className="entry__material badge badge-primary">{e.material}</div>
                    <div className="entry__level badge badge-primary">{e.level}</div>
                    <div className="entry__attitude badge badge-primary">{e.attitude}</div>
                    <div className="entry__age badge badge-primary">{e.age}</div>
                    { e.hiTest && <div className="entry__hitest badge badge-warning">This is a HI-TEST Session.</div> }
                    <div className="entry__next-round badge badge-primary">{e.nextRound}</div>
                </div>
                <div className={statusClasses}>{e.status} {e.testType}</div>
                <div className="entry__time-row">
                    <div className="entry__day">{e.day}</div>
                    <div className="entry__time">{e.time}</div>
                </div>
            </div>
        )
    }
}

class SimilarEntry extends Component {
    isFull(se) {
      return se.status.indexOf(" 0 seats") !== -1;
    }
    render() {
      const se = this.props.entry;
      const isFull = this.isFull(se);
      const classes = cn("entry__similar", {
        "entry__similar--hitest": se.hiTest,
        "entry__similar--full": isFull,
      });
      const title = se.id + 
        (se.hiTest ? " is a hitest." : "") + 
        (isFull ? " This is full." : "");
      return (<a className={classes}
        title={title}
        key={se.id}
        href={"#" + se.id}>
        {se.id} {se.day.substring(0,3)} {se.time}
      </a>);
    }
}
class SeeAlso extends Component {
    render() {
        const classes = cn("entry__see-also", {
            "entry__see-also--listview": this.props.isListView,
        });
        const seeAlso = this.props.txt.split(",")
            .map((x) => x.trim())
        //.map((x) => <Link to={"/" + x}>{x}</Link> );
        .map((x) => <a key={x} href={"/" + x}>{x}</a> );
        return ( <div className={classes}>See Also: {seeAlso}</div>)
    }
}


export default Entry;
