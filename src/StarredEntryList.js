import React, { Component } from 'react';
import Entry from './Entry';
import GridButtons from './GridButtons';
import FlipMove from 'react-flip-move';

class StarredEntryList extends Component{
    constructor(props) {
        super(props)
        this.state = {sortOrder: "time", };
    }
    changeSortOrder(e) {
        this.setState({
            sortOrder: e.target.value,
        });
    }
    sort(strategy, entries) {
        if (strategy === "time") {
            return entries.sort((x,y) => entryToDateNum(x) - entryToDateNum(y));
        }
        else if (strategy === "name") {
            return entries.sort((x,y) => x.name.localeCompare(y.name));
        }
        else if (strategy === "id") {
            return entries.sort((x,y) => x.id.localeCompare(y.id));
        }
        return entries;
    }
    render() {
        const entries = this.props.entries;
        const clickSave = this.props.clickSave;
        const changeLayout = this.props.changeLayout;
        const starred = this.props.starred;
        const view = this.props.view;
        const sortOrder = this.state.sortOrder;
      const entryList = this.sort(sortOrder, entries)
        .filter((le) => starred[le.id] || false)
        .map((le) => {
            const saved = starred[le.id] || false;
            return (<Entry key={le.id} dict={le} saved={saved} view={view}
                similar={this.props.commonEntries[le.name]}
                clickSave={(e) => clickSave(e, le.id)} />
            );
        });
        if (entryList.length === 0) {
            return (
                <div className="starred-entries__none">No Starred Entries.</div>
            );
        }
        return (<div className="starred">
            <GridButtons changeLayout={changeLayout} />
            <select className="starred-entries__sorter"
                onChange={(e) =>this.changeSortOrder(e)} id="" name="">
                    <option value="none">No Sort Order</option>
                    <option value="name">Name</option>
                    <option value="id">ID</option>
                    <option value="time" selected>Time</option>
            </select>
            <FlipMove enterAnimation="fade" leaveAnimation="fade">
                {entryList}
            </FlipMove>
        </div>);
    }
}

function entryToDateNum(listEntry) {
    try {
        const d = listEntry.day;
        let dayNum = 0;
        if (d.indexOf("Mon") !== -1) dayNum = 1;
        else if (d.indexOf("Tue") !== -1) dayNum = 2;
        else if (d.indexOf("Wed") !== -1) dayNum = 3;
        else if (d.indexOf("Thu") !== -1) dayNum = 4;
        else if (d.indexOf("Fri") !== -1) dayNum = 5;
        else if (d.indexOf("Sat") !== -1) dayNum = 6;
        else if (d.indexOf("Sun") !== -1) dayNum = 7;

        const timeStart = listEntry.time.split(" ")[0];
        const mIndex = timeStart.indexOf("M");
        const isPM = timeStart[mIndex - 1] === "P";
        const time1200 = timeStart.substring(0, mIndex - 2).replace(":", "");
        const time2400 = parseInt(time1200, 10) + (isPM ? 2400 : 0) ;
        return dayNum * 10000 + time2400;
    } catch(error) { return 0; }
}

export default StarredEntryList;
