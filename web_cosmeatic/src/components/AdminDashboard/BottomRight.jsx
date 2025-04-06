import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../services/UserSevices";

function BottomRight() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null); // Để lưu lỗi khi xảy ra

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers(); // Dữ liệu trả về từ API
            setUsers(data);
        } catch (error) {
            setError("Failed to load users. Please try again later.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="BottomRight">
            <div className="bottomlefttop">
                <h2 style={{marginLeft: 10}}>Hoạt động gần đây</h2>
                <div>
                    See All
                    <span className="material-symbols-outlined">arrow_forward</span>
                </div>
            </div>

            {/* Hiển thị danh sách người dùng */}
            {error ? (
                <p>{error}</p>
            ) : users.length > 0 ? (
                users.map((user) => (
                    <div className="bottomrightcard" key={user.id}>
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg" alt="User Avatar" />
                        <div>
                            <h4>{user.name}</h4>
                            <p>{user.phone}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading recent activity...</p>
            )}
        </div>
    );
}

export default BottomRight;
