import { useAuth0 } from "@auth0/auth0-react"

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (
        isAuthenticated && (
            <div className='flex justify-center items-center'>
                <h2>{user.name}</h2>
            </div>
        )
    );
};

export default Profile;