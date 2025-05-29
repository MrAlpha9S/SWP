import React, {useEffect} from "react";
import {useAuth0, withAuthenticationRequired} from "@auth0/auth0-react";

function DashBoard() {

    const [userList, setUserList] = React.useState([]);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch('http://localhost:3000/getUsers', {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setUserList(data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, [getAccessTokenSilently]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
            <p className="text-lg text-gray-700">This is a simple dashboard layout.</p>
            <div>
                <div>User List</div>
                {userList.map((user, key) => {
                        return <div className="flex flex-col items-center justify-center h-[150px] w-[250px] bg-gray-200 gap-2">
                            <ul key={key}>
                                <li>{user.user_id}</li>
                                <li>{user.auth0_id}</li>
                                <li>{user.username}</li>
                                <li>{user.email}</li>
                            </ul>
                        </div>
                    }
                )}
            </div>
        </div>
    )
        ;
}

export default withAuthenticationRequired(DashBoard)