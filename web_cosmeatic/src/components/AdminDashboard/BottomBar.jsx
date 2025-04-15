import React from "react";
import BottomLeft from "./BottomLeft";
import BottomRight from "./BottomRight";

function BottomBar({onGoToUsers}) {
    return (
        <div className="BottomBar">
            <BottomLeft />
            <BottomRight onGoToUsers={onGoToUsers}/>
        </div>
    );
}

export default BottomBar;
