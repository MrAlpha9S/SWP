// components/forum/PostCard.jsx
import React from 'react';
import { Card, Divider } from 'antd';
import { FaCommentAlt, FaRegClock, FaRegHeart, FaHeart } from "react-icons/fa";
import { convertYYYYMMDDStrToDDMMYYYYStr } from '../../utils/dateUtils.js';
import { useNavigate } from "react-router-dom";
import { AddLike } from "../../utils/forumUtils.js"

export default function PostCard({ post_id, title, username, created_at, content, category_name, category_tag, isPinned, comments, likes, avatar, isLiked }) {
    const navigate = useNavigate();
    return (
        <Card hoverable style={{ borderColor: '#0f766e' }} onClick={() => navigate(`/forum/${category_tag}/${post_id}`)}>
            <div className='flex'>
                <div className='w-[13%]'>
                    <img className='size-50 rounded-full' src={avatar} alt={username} />
                </div>
                <div className="w-[87%]">
                    <div className="flex justify-between items-start">
                        <div className='w-full h-full'>
                            <div className='flex justify-between'>
                                <h3 className="text-lg font-semibold text-primary-800">{title}</h3>
                                <p className='flex gap-2 items-center'>
                                    {convertYYYYMMDDStrToDDMMYYYYStr(created_at.split('T')[0])} <FaRegClock />
                                </p>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Đăng bởi <strong>{username}</strong></p>
                            <div className="text-sm text-gray-700 mb-1" dangerouslySetInnerHTML={{ __html: content }} />
                            <Divider />
                        </div>
                        {isPinned && <span className="text-xs text-primary-500">📌</span>}
                    </div>
                    <div className="flex gap-4 text-sm text-primary-600 items-center">
                        <p className="text-xs text-gray-500">Đăng trong <span className='underline font-bold'>{category_name}</span></p>
                        <span className='flex gap-2 items-center'><FaCommentAlt /> {comments}</span>
                        <span className='flex gap-2 items-center'>
                            {isLiked === 1 ? (
                                <FaHeart className='size-4 text-primary-600' />
                            ) : (
                                <FaRegHeart className='size-4' />
                            )}
                            {likes}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
