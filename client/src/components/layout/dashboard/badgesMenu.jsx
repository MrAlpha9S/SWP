import React, {useEffect, useMemo, useState, useRef} from 'react';
import {LockOutlined, ShareAltOutlined} from '@ant-design/icons';
import {Popover, Button, message} from "antd";
import {useQuery} from "@tanstack/react-query";
import {getAchieved, getAchievementProgress, getAchievements} from "../../utils/achievementsUtils.js";
import {useAuth0} from "@auth0/auth0-react";
import html2canvas from 'html2canvas';
import CustomButton from "../../ui/CustomButton.jsx";
import {CiShare2} from "react-icons/ci";
import {useEditorContentStore} from "../../../stores/store.js";
import {useNavigate} from "react-router-dom";

const Badge = ({label, icon, locked = false, description = '', progressInfo = '', onShare, showShareButton = false}) => {
    const badgeRef = useRef(null);

    const badgeContent = (
        <div ref={badgeRef} className="flex flex-col items-center space-y-2 text-center relative group">
            <div className="relative">
                {locked && <LockOutlined className="absolute top-0 left-0 text-gray-400 text-sm"/>}
                <img
                    src={icon || '/placeholder.svg'}
                    alt={label}
                    className={`w-16 h-16 ${locked ? 'opacity-30' : ''}`}
                />
            </div>
            <p className={`text-sm font-medium ${locked ? 'text-gray-400' : 'text-primary-800'}`}>{label}</p>
            {showShareButton && !locked && (
                <CustomButton
                    type="secondary"
                    size="small"
                    icon={<ShareAltOutlined />}
                    className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-8 h-[30px]"
                    onClick={(e) => {
                        e.stopPropagation();
                        onShare && onShare(badgeRef.current, label, description);
                    }}
                >
                    <CiShare2 /> Chia sẻ
                </CustomButton>
            )}
        </div>
    );

    return (
        <Popover content={<div><p>{description}</p><p className="text-xs text-gray-500">{progressInfo}</p></div>}
                 title={label} placement="top">
            {badgeContent}
        </Popover>
    );
};

const getProgressInfo = (achievementId, progress) => {
    if (!progress) return '';

    const totalPosts = (progress.posts_created || 0) + (progress.comments_created || 0);
    const safeMoney = progress?.money_saved ?? 0;

    switch (achievementId) {
        case '5-days-streak':
            return `Chuỗi hiện tại: ${progress.consecutive_smoke_free_days || 0} / 5`;
        case '10-days-streak':
            return `Chuỗi hiện tại: ${progress.consecutive_smoke_free_days || 0} / 10`;
        case '50-days-streak':
            return `Chuỗi hiện tại: ${progress.consecutive_smoke_free_days || 0} / 50`;
        case '100-days-streak':
            return `Chuỗi hiện tại: ${progress.consecutive_smoke_free_days || 0} / 100`;
        case '1-year-streak':
            return `Chuỗi hiện tại: ${progress.consecutive_smoke_free_days || 0} / 365`;
        case '7-days-smoke-free':
            return `Tổng: ${progress.days_without_smoking || 0} / 7`;
        case '14-days-smoke-free':
            return `Tổng: ${progress.days_without_smoking || 0} / 14`;
        case '30-days-smoke-free':
            return `Tổng: ${progress.days_without_smoking || 0} / 30`;
        case '90-days-smoke-free':
            return `Tổng: ${progress.days_without_smoking || 0} / 90`;
        case '180-days-smoke-free':
            return `Tổng: ${progress.days_without_smoking || 0} / 180`;
        case '1-year-quit':
            return `Tổng: ${progress.days_without_smoking || 0} / 365`;

        case 'new-me':
            return totalPosts >= 1 ? 'Đã hoàn thành' : '0 / 1';
        case 'community-guru':
            return `${totalPosts} / 100`;
        case 'story-teller':
            return `${totalPosts} / 50`;
        case 'social-butterfly':
            return `${totalPosts} / 25`;

        case 'cheer-champion':
            return `${progress.total_likes_given || 0} / 100`;
        case 'kind-heart':
            return `${progress.total_likes_given || 0} / 50`;
        case 'warm-welcomer':
            return `${progress.total_likes_given || 0} / 10`;

        case 'smart-saver':
            return progress.first_saving_goal_completed ? 'Đã hoàn thành' : 'Chưa hoàn thành';
        case 'streak-starter':
            return progress.first_check_in_completed ? 'Đã hoàn thành' : 'Chưa hoàn thành';

        case 'new-member':
            return 'Đã tham gia';

        case '100k':
            return `${safeMoney.toLocaleString()} / 100,000 VNĐ`;
        case '500k':
            return `${safeMoney.toLocaleString()} / 500,000 VNĐ`;
        case '1m':
            return `${safeMoney.toLocaleString()} / 1,000,000 VNĐ`;
        case '5m':
            return `${safeMoney.toLocaleString()} / 5,000,000 VNĐ`;
        case '10m':
            return `${safeMoney.toLocaleString()} / 10,000,000 VNĐ`;

        default:
            return '';
    }
};

const BadgesMenu = () => {
    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0()
    const [localAchievements, setLocalAchievements] = useState([])
    const [localProgress, setLocalProgress] = useState(null)
    const [localAchieved, setLocalAchieved] = useState([])
    const [locked, setLocked] = useState([])
    const allBadgesRef = useRef(null);
    const {setTitle, setContent} = useEditorContentStore()
    const navigate = useNavigate()

    const {isPending: isAchievementPending, data: achievements} = useQuery({
        queryKey: ['achievements'],
        queryFn: async () => {
            return await getAchievements(user, getAccessTokenSilently, isAuthenticated)
        },
        enabled: !!isAuthenticated && !!user,
    })

    const {isPending: isAchievementProgressPending, data: achievementProgress} = useQuery({
        queryKey: ['achievement-progress'],
        queryFn: async () => {
            return await getAchievementProgress(user, getAccessTokenSilently, isAuthenticated)
        },
        enabled: !!isAuthenticated && !!user,
    })

    const {isPending: isAchievedPending, data: achieved} = useQuery({
        queryKey: ['achieved'],
        queryFn: async () => {
            return await getAchieved(user, getAccessTokenSilently, isAuthenticated)
        },
        enabled: !!isAuthenticated && !!user,
    })

    useEffect(() => {
        if (!isAchievementPending && achievements && achievements.success) {
            setLocalAchievements(achievements?.data)
        }
    }, [isAchievementPending, achievements])

    useEffect(() => {
        if (!isAchievementProgressPending && achievementProgress && achievementProgress.success) {
            setLocalProgress(achievementProgress?.data)
        }
    }, [isAchievementProgressPending, achievementProgress])

    useEffect(() => {
        if (!isAchievedPending && achieved && achieved.success) {
            setLocalAchieved(achieved?.data)
        }
    }, [isAchievedPending, achieved])

    useEffect(() => {
        if (localAchieved && !isAchievedPending && localAchievements?.length) {
            const achievedSet = new Set(localAchieved.map(a => a.achievement_id));
            const lockedAchievements = localAchievements.filter(a => !achievedSet.has(a.achievement_id));
            setLocked(lockedAchievements);
        }
    }, [localAchieved, isAchievedPending, localAchievements]);

    const createBadgeBanner = (badgeData, progressText) => {
        const banner = document.createElement('div');
        banner.style.cssText = `
            width: 600px;
            padding: 40px;
            background: linear-gradient(135deg, #0d9488 0%, #115e59 100%);
            border-radius: 20px;
            color: white;
            font-family: 'Arial', sans-serif;
            position: relative;
            overflow: hidden;
        `;

        // Add decorative elements
        const decorativeCircle1 = document.createElement('div');
        decorativeCircle1.style.cssText = `
            position: absolute;
            width: 200px;
            height: 200px;
            background: rgba(45, 212, 191, 0.15);
            border-radius: 50%;
            top: -100px;
            right: -100px;
        `;
        banner.appendChild(decorativeCircle1);

        const decorativeCircle2 = document.createElement('div');
        decorativeCircle2.style.cssText = `
            position: absolute;
            width: 150px;
            height: 150px;
            background: rgba(94, 234, 212, 0.1);
            border-radius: 50%;
            bottom: -75px;
            left: -75px;
        `;
        banner.appendChild(decorativeCircle2);

        // Main content container
        const content = document.createElement('div');
        content.style.cssText = `
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            gap: 30px;
        `;

        // Badge icon container
        const iconContainer = document.createElement('div');
        iconContainer.style.cssText = `
            background: rgba(204, 251, 241, 0.25);
            padding: 25px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 25px rgba(19, 78, 74, 0.3);
            border: 1px solid rgba(45, 212, 191, 0.3);
        `;

        const badgeIcon = document.createElement('img');
        badgeIcon.src = badgeData.icon_url || '/placeholder.svg';
        badgeIcon.alt = badgeData.achievement_name;
        badgeIcon.style.cssText = `
            width: 80px;
            height: 80px;
            object-fit: contain;
        `;
        iconContainer.appendChild(badgeIcon);

        // Text content
        const textContent = document.createElement('div');
        textContent.style.cssText = `
            flex: 1;
        `;

        // Achievement unlocked text
        const achievementText = document.createElement('div');
        achievementText.style.cssText = `
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            opacity: 0.9;
            letter-spacing: 1px;
            text-transform: uppercase;
        `;
        achievementText.textContent = '🏆 HUY HIỆU ĐÃ MỞ KHÓA';

        // Badge name
        const badgeName = document.createElement('h1');
        badgeName.style.cssText = `
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 12px 0;
            line-height: 1.2;
        `;
        badgeName.textContent = badgeData.achievement_name;

        // Description
        const description = document.createElement('p');
        description.style.cssText = `
            font-size: 16px;
            margin: 0 0 12px 0;
            opacity: 0.9;
            line-height: 1.4;
        `;
        description.textContent = badgeData.criteria;

        // Progress text
        if (progressText) {
            const progress = document.createElement('div');
            progress.style.cssText = `
                background: rgba(94, 234, 212, 0.25);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                display: inline-block;
                backdrop-filter: blur(5px);
                border: 1px solid rgba(45, 212, 191, 0.3);
            `;
            progress.textContent = progressText;
            textContent.appendChild(progress);
        }

        textContent.appendChild(achievementText);
        textContent.appendChild(badgeName);
        textContent.appendChild(description);

        content.appendChild(iconContainer);
        content.appendChild(textContent);
        banner.appendChild(content);

        // Footer
        const footer = document.createElement('div');
        footer.style.cssText = `
            position: relative;
            z-index: 2;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid rgba(94, 234, 212, 0.3);
            font-size: 14px;
            opacity: 0.9;
            text-align: center;
        `;
        footer.textContent = 'Hành trình cai thuốc - Mỗi ngày là một chiến thắng! 🚭';
        banner.appendChild(footer);

        return banner;
    };

    const handleShareSingleBadge = async (badgeElement, badgeName, description) => {
        try {
            // Find the full badge data
            const badgeData = localAchieved.find(badge => badge.achievement_name === badgeName);
            if (!badgeData) return;

            const progressText = getProgressInfo(badgeData.achievement_id, localProgress);

            // Create the banner
            const banner = createBadgeBanner(badgeData, progressText);

            // Add to DOM temporarily for rendering
            banner.style.position = 'absolute';
            banner.style.left = '-9999px';
            document.body.appendChild(banner);

            const canvas = await html2canvas(banner, {
                scale: 1,
                useCORS: true,
                backgroundColor: null,
                width: 600,
                height: banner.offsetHeight,
            });

            document.body.removeChild(banner);

            const base64 = canvas.toDataURL('image/png');

            setTitle(`Tôi vừa đạt được huy hiệu: ${badgeName}`)
            setContent(`<p>Tôi vừa đạt được huy hiệu "${badgeName}"!</p><img src="${base64}" />`)
            navigate('/forum/editor')

            message.success(`Đã tải xuống huy hiệu "${badgeName}"`);

        } catch (error) {
            console.error('Error sharing badge:', error);
            message.error('Có lỗi xảy ra khi chia sẻ huy hiệu');
        }
    };

    const createAllBadgesBanner = () => {
        const banner = document.createElement('div');
        banner.style.cssText = `
            width: 800px;
            padding: 40px;
            background: linear-gradient(135deg, #0d9488 0%, #115e59 100%);
            border-radius: 20px;
            color: white;
            font-family: 'Arial', sans-serif;
            position: relative;
            overflow: hidden;
        `;

        // Add decorative elements
        const decorativeCircle1 = document.createElement('div');
        decorativeCircle1.style.cssText = `
            position: absolute;
            width: 300px;
            height: 300px;
            background: rgba(45, 212, 191, 0.15);
            border-radius: 50%;
            top: -150px;
            right: -150px;
        `;
        banner.appendChild(decorativeCircle1);

        const decorativeCircle2 = document.createElement('div');
        decorativeCircle2.style.cssText = `
            position: absolute;
            width: 200px;
            height: 200px;
            background: rgba(94, 234, 212, 0.1);
            border-radius: 50%;
            bottom: -100px;
            left: -100px;
        `;
        banner.appendChild(decorativeCircle2);

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            position: relative;
            z-index: 2;
            text-align: center;
            margin-bottom: 30px;
        `;

        const headerTitle = document.createElement('h1');
        headerTitle.style.cssText = `
            font-size: 32px;
            font-weight: bold;
            margin: 0 0 10px 0;
        `;
        headerTitle.textContent = '🏆 BỘ SƯU TẬP HUY HIỆU';

        const headerSubtitle = document.createElement('p');
        headerSubtitle.style.cssText = `
            font-size: 18px;
            margin: 0;
            opacity: 0.9;
        `;
        headerSubtitle.textContent = `${localAchieved.length} huy hiệu đã đạt được`;

        header.appendChild(headerTitle);
        header.appendChild(headerSubtitle);

        // Badges grid
        const badgesGrid = document.createElement('div');
        badgesGrid.style.cssText = `
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        `;

        localAchieved.forEach(badge => {
            const badgeItem = document.createElement('div');
            badgeItem.style.cssText = `
                background: rgba(204, 251, 241, 0.2);
                padding: 20px;
                border-radius: 15px;
                text-align: center;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(45, 212, 191, 0.25);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            `;

            const badgeIcon = document.createElement('img');
            badgeIcon.src = badge.icon_url || '/placeholder.svg';
            badgeIcon.alt = badge.achievement_name;
            badgeIcon.style.cssText = `
                width: 60px;
                height: 60px;
                object-fit: contain;
                margin: 0 auto 10px auto;
                display: block;
            `;

            const badgeName = document.createElement('h3');
            badgeName.style.cssText = `
                font-size: 14px;
                font-weight: 600;
                margin: 0;
                line-height: 1.2;
            `;
            badgeName.textContent = badge.achievement_name;

            badgeItem.appendChild(badgeIcon);
            badgeItem.appendChild(badgeName);
            badgesGrid.appendChild(badgeItem);
        });

        // Footer
        const footer = document.createElement('div');
        footer.style.cssText = `
            position: relative;
            z-index: 2;
            padding-top: 20px;
            border-top: 1px solid rgba(94, 234, 212, 0.3);
            font-size: 16px;
            opacity: 0.9;
            text-align: center;
        `;
        footer.textContent = 'Hành trình cai thuốc - Mỗi ngày là một chiến thắng! 🚭';

        banner.appendChild(header);
        banner.appendChild(badgesGrid);
        banner.appendChild(footer);

        return banner;
    };

    const handleShareAllBadges = async () => {

        try {
            if (localAchieved.length === 0) {
                message.warning('Không có huy hiệu nào để chia sẻ');
                return;
            }

            // Create the banner
            const banner = createAllBadgesBanner();

            // Add to DOM temporarily for rendering
            banner.style.position = 'absolute';
            banner.style.left = '-9999px';
            document.body.appendChild(banner);

            const canvas = await html2canvas(banner, {
                scale: 0.7,
                useCORS: true,
                backgroundColor: null,
            });

            document.body.removeChild(banner);

            const base64 = canvas.toDataURL('image/png');

            setTitle('Chia sẻ bộ sưu tập huy hiệu của tôi')
            setContent(`<p>Đây là tất cả các huy hiệu tôi đã đạt được trong hành trình cai thuốc! 🏆</p><img src="${base64}" />`)
            navigate('/forum/editor')

            message.success('Đã tải xuống bộ sưu tập huy hiệu');

        } catch (error) {
            console.error('Error sharing all badges:', error);
            message.error('Có lỗi xảy ra khi chia sẻ huy hiệu');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-10">
            <section className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Đã đạt được</h2>
                    {localAchieved.length > 0 && (
                        <CustomButton
                            type="primary"
                            icon={<ShareAltOutlined />}
                            onClick={handleShareAllBadges}
                        >
                           <CiShare2/> Chia sẻ tất cả
                        </CustomButton>
                    )}
                </div>
                <div ref={allBadgesRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4">
                    {localAchieved?.map((badge) => {
                        const progressText = getProgressInfo(badge.achievement_id, localProgress)
                        return <Badge
                            key={badge.achievement_id}
                            label={badge.achievement_name}
                            icon={badge.icon_url}
                            description={badge.criteria}
                            progressInfo={progressText}
                            showShareButton={true}
                            onShare={handleShareSingleBadge}
                        />
                    })}
                </div>
                {localAchieved.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>Chưa có huy hiệu nào. Hãy tiếp tục hành trình của bạn!</p>
                    </div>
                )}
            </section>

            <section className="flex flex-col gap-5">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Huy hiệu bị khóa</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {locked?.map((badge) => (
                        <Badge
                            key={badge.achievement_id}
                            label={badge.achievement_name}
                            icon={badge.icon_url}
                            description={badge.criteria}
                            locked
                            progressInfo={getProgressInfo(badge.achievement_id, localProgress)}
                        />
                    ))}
                </div>
                {locked.length === 0 && localAchievements.length > 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>🎉 Chúc mừng! Bạn đã mở khóa tất cả huy hiệu!</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default BadgesMenu;