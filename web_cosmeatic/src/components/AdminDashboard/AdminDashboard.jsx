import "./style.css";
import BottomBar from "./BottomBar";
import MidBar from "./MidBar";

function AdminDashboard({ onGoToOrders, onGoToChart , onGoToUsers}) {
    return (
        <div className="leftmaincontainer">
            <MidBar onGoToOrders={onGoToOrders} onGoToChart={onGoToChart}/>
            <BottomBar onGoToUsers={onGoToUsers} />
        </div>
    );
}

export default AdminDashboard;
