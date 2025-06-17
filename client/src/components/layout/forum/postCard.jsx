// components/forum/PostCard.jsx
import React from 'react';
import {Card, Divider} from 'antd';
import {FaCommentAlt, FaRegClock} from "react-icons/fa";
import {FcLikePlaceholder} from "react-icons/fc";
import {convertYYYYMMDDStrToDDMMYYYYStr} from '../../utils/dateUtils.js';

export default function PostCard({title, username, created_at, content, category_name, isPinned, comments, likes, avatar}) {
    return (
        <Card hoverable style={{borderColor: '#0f766e'}}>
            <div className='flex'>
                <div className='w-[13%]'>
                    <img className='size-50 rounded-full' src={avatar} alt={username}/>
                </div>
                <div className="w-[87%]">
                    <div className="flex justify-between items-start">
                        <div className='w-full h-full'>
                            <div className='flex justify-between'>
                                <h3 className="text-lg font-semibold text-primary-800">{title}</h3>
                                <p className='flex gap-2 items-center'>
                                    {convertYYYYMMDDStrToDDMMYYYYStr(created_at.split('T')[0])} <FaRegClock/>
                                </p>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Đăng bởi <strong>{username}</strong></p>
                            <p className="text-sm text-gray-700 mb-1">{content}</p>
                            <Divider/>
                        </div>
                        {isPinned && <span className="text-xs text-primary-500">📌</span>}
                    </div>
                    <div className="flex gap-4 text-sm text-primary-600 items-center">
                        <p className="text-xs text-gray-500">Đăng trong <span className='underline font-bold'>{category_name}</span></p>
                        <span className='flex gap-2 items-center'><FaCommentAlt/> {comments}</span>
                        <span className='flex gap-2 items-center'><FcLikePlaceholder className='size-4'/> {likes}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
