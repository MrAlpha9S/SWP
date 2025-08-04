import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserInfo, updateUserInfo, updateUserController } from "../../components/utils/userUtils.js";
import Hero from "../../components/layout/profilepage/hero.jsx";
import UsernameField from "../../components/layout/profilepage/UsernameField.jsx";
import EmailField from "../../components/layout/profilepage/EmailField.jsx";
import RoleField from "../../components/layout/profilepage/RoleField.jsx";
import CreatedAtField from "../../components/layout/profilepage/CreatedAtField.jsx";
import { FaUser, FaEnvelope, FaUserTag, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaCamera, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PageFadeWrapper from "../../components/utils/PageFadeWrapper.jsx";
import {formatUtcToLocalString, getCurrentUTCDateTime} from "../../components/utils/dateUtils.js";

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
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const navigate = useNavigate();
    const [expired, setExpired] = useState(false);

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
                const loadedProfile = {
                    username: userData?.username || "",
                    email: userData?.email || "",
                    avatar: userData?.avatar || "",
                    role: userData?.role || "",
                    created_at: userData?.created_at || "",
                    is_social: userData?.is_social || false,
                    sub_id: userData?.sub_id,
                    vip_end_date: userData?.vip_end_date || "",
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
        // Không cho phép thay đổi nếu là social user
        if (profile.is_social) return;
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        // Không cho phép cập nhật nếu là social user
        if (profile.is_social) {
            setError("Tài khoản social không thể cập nhật thông tin.");
            return;
        }
        
        try {
            const payload = {
                username: profile.username,
                email: profile.email,
                avatar: profile.avatar
            };

            // 1. Cập nhật database
            await updateUserInfo(user, getAccessTokenSilently, payload);

            // 2. Cập nhật Auth0
            const auth0Payload = { 
                username: profile.username, 
                email: profile.email, 
                avatar: profile.avatar 
            };

            await updateUserController(user, getAccessTokenSilently, auth0Payload);

            setSuccess("Cập nhật thành công!");
            setOriginalProfile(profile);
        } catch (err) {
            setError("Cập nhật thất bại!");
        }
    };

    // Hàm nhập link avatar (chỉ cho non-social users)
    const handleAvatarLink = () => {
        if (profile.is_social) return;
        const url = prompt("Nhập link ảnh avatar:");
        if (url) {
            setProfile({ ...profile, avatar: url });
        }
        setShowAvatarMenu(false);
    };

    // Hàm xóa avatar (chỉ cho non-social users)
    const handleAvatarRemove = () => {
        if (profile.is_social) return;
        setProfile({ ...profile, avatar: "" });
        setShowAvatarMenu(false);
    };

    useEffect(() => {
        if (originalProfile && originalProfile.vip_end_date) {
            const today = getCurrentUTCDateTime()
            const vipEndDate = new Date(originalProfile?.vip_end_date);
            if (today - vipEndDate > 0) {
                setExpired(true);
            }
        }
    }, [originalProfile]);

    return (
        <PageFadeWrapper>
        <div className="bg-[#e0f7fa] min-h-screen flex flex-col">
            <div className="flex flex-1 justify-center items-start py-8">
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
                            {/* Chỉ hiển thị nút avatar menu cho non-social users */}
                            {!profile.is_social && (
                                <button
                                    type="button"
                                    className="absolute bottom-2 right-2 bg-primary-500 text-white rounded-full p-2 shadow hover:bg-primary-600 transition"
                                    onClick={() => setShowAvatarMenu((v) => !v)}
                                    title="Tùy chọn avatar"
                                >
                                    <FaCamera />
                                </button>
                            )}
                            {/* Menu avatar chỉ cho non-social users */}
                            {showAvatarMenu && !profile.is_social && (
                                <div className="absolute z-10 right-0 mt-2 w-40 bg-white border rounded shadow-lg flex flex-col">
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                                        onClick={handleAvatarLink}
                                        type="button"
                                    >
                                        <FaCamera /> Cập nhật từ link
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-500"
                                        onClick={handleAvatarRemove}
                                        type="button"
                                        disabled={!profile.avatar}
                                    >
                                        <FaTrash /> Xóa avatar
                                    </button>
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
                            {/* Hiển thị thông báo cho social users */}
                            {profile.is_social && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <p className="text-blue-800 text-sm">
                                        Tài khoản social không thể cập nhật thông tin cá nhân.
                                    </p>
                                </div>
                            )}
                            
                            <div>
                                <label className="block font-semibold mb-1 text-primary-700 flex items-center gap-2">
                                    <FaUser className="text-primary-400" /> Tên người dùng
                                </label>
                                <UsernameField
                                    value={profile.username}
                                    onChange={handleChange}
                                    readOnly={profile.is_social}
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1 text-primary-700 flex items-center gap-2">
                                    <FaEnvelope className="text-primary-400" /> Email
                                </label>
                                <EmailField
                                    value={profile.email}
                                    onChange={handleChange}
                                    readOnly={profile.is_social}
                                />
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
                            <div>
                                <label className="block font-semibold mb-1 text-primary-700 flex items-center gap-2">
                                    <FaCalendarAlt className="text-primary-400" /> Gói đăng ký
                                </label>
                                <RoleField
                                    value={
                                        originalProfile.sub_id === 1
                                            ? 'Miễn phí'
                                            : originalProfile.sub_id === 2
                                                ? 'Premium 1 tháng'
                                                : 'Premium 12 tháng'
                                    }
                                />
                                <div className='mt-4'>
                                    <label className="block font-semibold mb-1 text-primary-700 flex items-center gap-2">
                                        <FaCalendarAlt className="text-primary-400" /> Thời hạn
                                        {expired && <span className='text-xs font-normal text-red-500'>Bạn có đăng ký gói trước đó hiện đã hết hạn. <a
                                            className='cursor-pointer underline'
                                            onClick={() => navigate('/subscription')}>Gia hạn ngay?</a></span>}
                                    </label>
                                    {originalProfile.sub_id === 1 ? (
                                        <input
                                            type="text"
                                            name="expiry"
                                            value={'Vô thời hạn'}
                                            disabled
                                            className="w-full border rounded px-3 py-2 bg-gray-100"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name="expiry"
                                            value={formatUtcToLocalString(originalProfile.vip_end_date)}
                                            disabled
                                            className="w-full border rounded px-3 py-2 bg-gray-100"
                                        />
                                    )}
                                </div>
                            </div>
                            {/* Chỉ hiển thị nút cập nhật cho non-social users */}
                            {!profile.is_social && (
                                <button
                                    type="submit"
                                    className={`w-full mt-4 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
                                        ${(
                                            profile.username !== originalProfile.username ||
                                            profile.email !== originalProfile.email ||
                                            profile.avatar !== originalProfile.avatar
                                        )
                                            ? "bg-primary-500 hover:bg-primary-600 text-white shadow"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    disabled={
                                        !(
                                            profile.username !== originalProfile.username ||
                                            profile.email !== originalProfile.email ||
                                            profile.avatar !== originalProfile.avatar
                                        )
                                    }
                                >
                                    <FaCheckCircle />
                                    Cập nhật
                                </button>
                            )}
                        </form>
                    )}

                </div>
            </div>
        </div>
            </PageFadeWrapper>
    );
}

export default Profile;