import React, { useEffect } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { differenceInMilliseconds } from 'date-fns';

function Dashboard() {

    const [userList, setUserList] = React.useState([]);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch('http://localhost:3000/users/getAllUsers', {
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

    //formatting the difference in time
    const formatDifference = (ms) => {
        if (ms < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isNegative: true };

        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        return {
            days: days,
            hours: hours % 24,
            minutes: minutes % 60,
            seconds: seconds % 60,
            isNegative: false,
        };
    };

    //quit date
    const quitDate = new Date('2025-06-01'); // Example quit date
    const quitYear = quitDate.getFullYear();
    const quitMonth = quitDate.toLocaleString('default', { month: 'short' });
    const quitDay = String(quitDate.getDate()).padStart(2, '0');

    //now
    const currectDate = new Date();
    const currectYear = currectDate.getFullYear();
    const currectMonth = currectDate.toLocaleString('default', { month: 'short' });
    const currectDay = String(currectDate.getDate()).padStart(2, '0');

    // Calculate the difference using date-fns
    const differenceInMs = differenceInMilliseconds(currectDate, quitDate);
    const difference = formatDifference(differenceInMs);

    useEffect(() => {
        console.log(userList);
    }, [userList]);

    return (
        <div className="bg-primary-50 min-h-screen flex items-center justify-center p-4">
            <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-4/5 space-y-4">


                <div className="flex items-center justify-between">
                    <button className="bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-800">
                        Daily check-in →
                    </button>
                    <a href="#" className="text-sm text-primary-700 hover:underline">
                        What's a check-in and why are they important?
                    </a>
                </div>


                <div className="bg-primary-100 rounded-lg p-6 text-center">
                    <h2 className="text-gray-600 text-sm font-medium">Total time smoke-free</h2>
                    <div className="flex justify-center items-baseline space-x-2 mt-2">
                        <span className="text-4xl font-bold text-primary-800">{difference.days}</span>
                        <span className="text-sm text-gray-500">days</span>
                        <span className="text-4xl font-bold text-primary-800">{difference.hours}</span>
                        <span className="text-sm text-gray-500">hours</span>
                        <span className="text-4xl font-bold text-primary-800">{difference.minutes}</span>
                        <span className="text-sm text-gray-500">mins</span>
                    </div>
                </div>


                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-primary-100 p-4 rounded-lg">
                        <div className="text-2xl">💰</div>
                        <div className="text-xl font-semibold text-primary-800">$40</div>
                        <div className="text-sm text-gray-600">Money saved</div>
                    </div>
                    <div className="bg-primary-100 p-4 rounded-lg">
                        <div className="text-2xl">🚭</div>
                        <div className="text-xl font-semibold text-primary-800">8</div>
                        <div className="text-sm text-gray-600">Puffs avoided</div>
                    </div>
                    <div className="bg-primary-100 p-4 rounded-lg">
                        <div className="text-2xl">🏆</div>
                        <div className="text-xl font-semibold text-primary-800">1</div>
                        <div className="text-sm text-gray-600">Badges earned</div>
                    </div>
                </div>


                <div className="bg-primary-100 p-4 rounded-lg flex flex-col text-center relative">
                    <div className="absolute right-3 top-3">
                        <a href="#" className="text-sm text-primary-700 hover:underline">Is this correct?</a>
                    </div>
                    <div className="text-2xl">📅</div>
                    <h3 className="text-lg font-semibold text-primary-800">My quit start date</h3>
                    <p className="text-sm text-gray-600">{quitDay} {quitMonth} {quitYear} to {currectDay} {currectMonth} {currectYear}</p>
                </div>

                <div className="text-center">
                    <a href="#" className="text-sm text-primary-700 hover:underline">🔗 Share my progress</a>
                </div>

            </div>
        </div>
    )
        ;
}

export default withAuthenticationRequired(Dashboard)