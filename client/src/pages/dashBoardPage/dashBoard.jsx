import React, {useEffect} from "react";
import {withAuthenticationRequired} from "@auth0/auth0-react";

function DashBoard() {

    const [userList, setUserList] = React.useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/getUsers')
            .then(res => res.json())
            .then(data => setUserList(data))
            .catch(err => console.error("Error fetching users:", err));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
            <p className="text-lg text-gray-700">This is a simple dashboard layout.</p>
            <div>
                <div>User List</div>
                <ul>
                    {userList.map((user, key) => {
                            return <>
                                <li key={key}>{user.user_id}</li>
                                <li key={key}>{user.auth0_id}</li>
                                <li key={key}>{user.username}</li>
                                <li key={key}>{user.email}</li>
                            </>
                        }
                    )}
                </ul>
            </div>
        </div>
    )
        ;
}

export default withAuthenticationRequired(DashBoard)