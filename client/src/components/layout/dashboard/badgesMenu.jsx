import React, {useEffect, useMemo, useState} from 'react';
import {LockOutlined} from '@ant-design/icons';
import {Popover} from "antd";
import {useQuery} from "@tanstack/react-query";
import {getAchieved, getAchievementProgress, getAchievements} from "../../utils/achievementsUtils.js";
import {useAuth0} from "@auth0/auth0-react";

const Badge = ({ label, icon, locked = false, description = '', progressInfo = '' }) => {
    const badgeContent = (
        <div className="flex flex-col items-center space-y-2 text-center">
            <div className="relative">
                {locked && <LockOutlined className="absolute top-0 left-0 text-gray-400 text-sm" />}
                <img
                    src={icon || '/placeholder.svg'}
                    alt={label}
                    className={`w-16 h-16 ${locked ? 'opacity-30' : ''}`}
                />
            </div>
            <p className={`text-sm font-medium ${locked ? 'text-gray-400' : 'text-primary-800'}`}>{label}</p>
        </div>
    );

    return (
        <Popover content={<div><p>{description}</p><p className="text-xs text-gray-500">{progressInfo}</p></div>} title={label} placement="top">
            {badgeContent}
        </Popover>
    );
};

const getProgressInfo = (achievementId, progress) => {
    switch (achievementId) {
        case '5-days-streak':
            return `Chuỗi hiện tại: ${progress.consecutive_smoke_free_days} / 5`
        case '10-days-streak':
            return `Chuỗi hiện tại: ${progress.consecutive_smoke_free_days} / 10`;
        case '50-days-streak':
            return `Chuỗi hiện tại: ${progress.consecutive_smoke_free_days} / 50`;
        case '100-days-streak':
            return `Chuỗi hiện tại: ${progress.consecutive_smoke_free_days} / 100`;
        case '1-year-streak':
            return `Chuỗi hiện tại: ${progress.consecutive_smoke_free_days} / 365`;
        case '30-days-smoke-free':
            return `Tổng: ${progress.days_without_smoking} / 30`;
        case '90-days-smoke-free':
            return `Tổng: ${progress.days_without_smoking} / 90`;
        case '180-days-smoke-free':
            return `Tổng: ${progress.days_without_smoking} / 180`;
        case '1-year-quit':
            return `Tổng: ${progress.days_without_smoking} / 365`;
        case '7-days-smoke-free':
            return `Tổng: ${progress.days_without_smoking} / 7`;
        case '14-days-smoke-free':
            return `Tổng: ${progress.days_without_smoking} / 14`;

        case 'new-me':
            return `${progress.posts_created + progress.comments_created >= 1 ? 'Đã hoàn thành' : '0 / 1'}`;
        case 'community-guru':
            return `${progress.posts_created + progress.comments_created} / 100`;
        case 'story-teller':
            return `${progress.posts_created + progress.comments_created} / 50`;
        case 'social-butterfly':
            return `${progress.posts_created + progress.comments_created} / 25`;

        case 'cheer-champion':
            return `${progress.total_likes_given} / 100`;
        case 'kind-heart':
            return `${progress.total_likes_given} / 50`;
        case 'warm-welcomer':
            return `${progress.total_likes_given} / 10`;

        case 'smart-saver':
            return progress.first_saving_goal_completed ? 'Đã hoàn thành' : 'Chưa hoàn thành';
        case 'streak-starter':
            return progress.first_check_in_completed ? 'Đã hoàn thành' : 'Chưa hoàn thành';

        case 'new-member':
            return `Đã tham gia`;

        default:
            return '';
    }
};



const BadgesMenu = () => {
    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0()
    const [localAchievements, setLocalAchievements] = useState([])
    const [localProgress, setLocalProgress] = useState([])
    const [localAchieved, setLocalAchieved] = useState([])
    const [locked, setLocked] = useState([])

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
    }, [isAchievementPending])

    useEffect(() => {
        if (!isAchievementProgressPending && achievementProgress && achievementProgress.success) {
            setLocalProgress(achievementProgress?.data)
        }
    }, [isAchievementProgressPending])

    useEffect(() => {
        if (!isAchievedPending && achieved && achieved.success) {
            setLocalAchieved(achieved?.data)
        }
    }, [isAchievedPending])

    useEffect(() => {
        if (localAchieved && !isAchievedPending && localAchievements?.length) {
            const achievedSet = new Set(localAchieved.map(a => a.achievement_id));
            const lockedAchievements = localAchievements.filter(a => !achievedSet.has(a.achievement_id));
            setLocked(lockedAchievements);
        }
    }, [localAchieved, isAchievedPending, localAchievements]);


    return (
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-10">
            <section className="flex flex-col gap-5">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Đã đạt được</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {localAchieved?.map((badge) => (
                        <Badge
                            key={badge.achievement_id}
                            label={badge.achievement_name}
                            icon={badge.icon_url}
                            description={badge.criteria}
                            progressInfo={getProgressInfo(badge.achievement_id, localProgress)}
                        />
                    ))}
                </div>
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
            </section>
        </div>
    );
};

export default BadgesMenu;