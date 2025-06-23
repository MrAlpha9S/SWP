import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserInfo, updateUserInfo } from "../../components/utils/userUtils.js";
import Hero from "../../components/layout/dashboard/hero.jsx";
import Sidebar from "../../components/layout/dashboard/sidebar.jsx";
import UsernameField from "../../components/layout/profilepage/UsernameField.jsx";
import EmailField from "../../components/layout/profilepage/EmailField.jsx";
import RoleField from "../../components/layout/profilepage/RoleField.jsx";
import CreatedAtField from "../../components/layout/profilepage/CreatedAtField.jsx";
import { FaUser, FaEnvelope, FaUserTag, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Profile() {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        avatar: "",
        role: "",
        created_at: ""
    });
    const [originalProfile, setOriginalProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [currentStepDashboard, setCurrentStepDashboard] = useState("profile");
    const navigate = useNavigate();

    useEffect(() => {
        if (currentStepDashboard !== "profile") {
            // Điều hướng sang trang tương ứng nếu không phải profile
            navigate(`/${currentStepDashboard}`);
        }
    }, [currentStepDashboard, navigate]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!isAuthenticated || !user) return;
            setIsLoading(true);
            try {
                const data = await getUserInfo(user, getAccessTokenSilently, isAuthenticated);
                const userData = Array.isArray(data.data) ? data.data[0] : data.data;
                console.log(userData)
                const loadedProfile = {
                    username: userData?.username || "",
                    email: userData?.email || "",
                    avatar: userData?.avatar || "",
                    role: userData?.role || "",
                    created_at: userData?.created_at || ""
                };
                setProfile(loadedProfile);
                setOriginalProfile(loadedProfile);
            } catch (err) {
                setError("Không thể tải thông tin người dùng.");
            }
            setIsLoading(false);
        };
        fetchProfile();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const isChanged =
        originalProfile &&
        (profile.username !== originalProfile.username ||
            profile.email !== originalProfile.email);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await updateUserInfo(user, getAccessTokenSilently, {
                username: profile.username,
                email: profile.email,
                avatar: profile.avatar
            });
            setSuccess("Cập nhật thành công!");
            setOriginalProfile(profile);
        } catch (err) {
            setError("Cập nhật thất bại!");
        }
    };

    return (
        <div className="bg-[#e0f7fa] min-h-screen flex flex-col">
            <Hero title="Hồ sơ cá nhân" heroHeight={120} />
            <div className="flex flex-col md:flex-row gap-4 px-1 py-4 md:px-4 max-w-[1280px] mx-auto w-full">
                <div className="w-full md:w-[260px] shrink-0">
                    <Sidebar
                        currentStepDashboard={currentStepDashboard}
                        setCurrentStepDashboard={setCurrentStepDashboard}
                        mode="inline"
                    />
                </div>
                <div className="flex-1 flex justify-center items-start">
                    {currentStepDashboard === "profile" && (
                        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mt-2">
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative">
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt="avatar" className="w-28 h-28 rounded-full border-4 border-primary-400 shadow object-cover" />
                                    ) : (
                                        <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-5xl text-white shadow">
                                            <FaUser />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {error && (
                                <div className="flex items-center text-red-600 mb-2 gap-2 justify-center">
                                    <FaTimesCircle /> {error}
                                </div>
                            )}
                            {success && (
                                <div className="flex items-center text-green-600 mb-2 gap-2 justify-center">
                                    <FaCheckCircle /> {success}
                                </div>
                            )}
                            {isLoading ? (
                                <div className="text-center text-primary-500 font-semibold">Đang tải...</div>
                            ) : (
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div>
                                        <label className="block font-semibold mb-1 text-primary-700 flex items-center gap-2">
                                            <FaUser className="text-primary-400" /> Tên người dùng
                                        </label>
                                        <UsernameField value={profile.username} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1 text-primary-700 flex items-center gap-2">
                                            <FaEnvelope className="text-primary-400" /> Email
                                        </label>
                                        <EmailField value={profile.email} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1 text-primary-700 flex items-center gap-2">
                                            <FaUserTag className="text-primary-400" /> Vai trò
                                        </label>
                                        <RoleField value={profile.role} />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-1 text-primary-700 flex items-center gap-2">
                                            <FaCalendarAlt className="text-primary-400" /> Ngày tạo
                                        </label>
                                        <CreatedAtField value={profile.created_at} />
                                    </div>
                                    <button
                                        type="submit"
                                        className={`w-full mt-4 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
                                            ${isChanged
                                                ? "bg-primary-500 hover:bg-primary-600 text-white shadow"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                                        disabled={!isChanged}
                                    >
                                        <FaCheckCircle />
                                        Cập nhật
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;