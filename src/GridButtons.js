import React from 'react';

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


export default GridButtons;
