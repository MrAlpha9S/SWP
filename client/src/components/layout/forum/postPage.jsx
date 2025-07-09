// PostPage.tsx
import SideBar from "./sideBar.jsx";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {getComments, getPosts} from "../../utils/forumUtils.js";
import React, {useEffect, useState} from "react";
import {convertYYYYMMDDStrToDDMMYYYYStr} from "../../utils/dateUtils.js";
import {FaCommentAlt, FaRegHeart, FaFlag} from "react-icons/fa";

export default function PostPage() {

    const [post, setPost] = useState();
    const [comments, setComments] = useState([]);

    const { category, postId } = useParams();

    const { isPending : isPostPending, data : postData } = useQuery({
        queryKey: ['get-single-post'],
        queryFn: () =>
            getPosts({
                postId : postId,
            }),
    });

    const { isPending : isCommentsPending, data : commentsData } = useQuery({
        queryKey: ['get-post-comments'],
        queryFn: () =>
            getComments({
                postId: postId,
            }),
    });

    useEffect(() => {
        if (!isPostPending && postData) {
            setPost(postData.data.records[0])
            console.log(postData.data.records);
        }
    }, [postData, isPostPending])

    useEffect(() => {
        if (!isCommentsPending && commentsData) {
            setComments(commentsData.data);
            console.log(commentsData.data);
        }
    }, [commentsData, isCommentsPending])

    return (
        <div className="flex min-h-screen mx-auto px-14 pt-14 pb-8 gap-8">
            <div className="space-y-6 w-[92%]">
                <div>
                    <h1 className="text-3xl font-bold text-primary-800 mb-2">{post?.title}</h1>
                    <p className="text-sm text-gray-600">
                        Posted in <span className="text-primary-600 font-medium">{post?.category_name}</span>
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full">
                            <img className='rounded-full' src={post?.avatar} alt={post?.username}/>
                        </div>
                        <div>
                            <p className="font-semibold">By {post?.username}</p>

                        </div>
                    </div>

                    <div className="text-gray-800 space-y-3 text-[15px] leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: post?.content }} />
                    </div>

                    <div className="flex gap-6 text-sm text-gray-500 pt-2 border-t">
                        <button className='flex items-center gap-2'><FaRegHeart className='size-4'/> {post?.likes} Likes</button>
                        <button className='flex items-center gap-2'><FaCommentAlt/> {post?.comments} Reply</button>
                        <button className='flex items-center gap-2'><FaFlag/> Report</button>
                    </div>
                </div>

                <div className="space-y-4 mt-6">
                    <h2 className="text-lg font-semibold">3 comments</h2>

                    <div className="space-y-4">
                        {comments?.map((comment) =>
                            <Comment key={comment.comment_id} date={comment.created_at} author={comment.username} content={comment.content} role={comment.role} avatar={comment.avatar} likes={comment.like_count} />
                        )}
                    </div>
                </div>
            </div>

            <SideBar isInPost={true}/>
        </div>
    );
}


export function Comment({ author, date, content, role , likes, avatar  }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow space-y-2">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full">
                    <img src={avatar} alt="avatar" className="rounded-full" />
                </div>
                <div>
                    <p className="font-semibold flex items-center">
                        {author}{" "}
                        {role && <span className="text-xs text-primary-600 font-medium ml-1">• {role}</span>}
                    </p>
                    <p className="text-sm text-gray-500">{date && convertYYYYMMDDStrToDDMMYYYYStr(date?.split('T')[0])}</p>
                </div>
            </div>
            <p className="text-sm text-gray-800">{content}</p>
            <div className="flex gap-4 text-xs text-gray-500 pt-2">
                <button className='flex items-center gap-2'><FaRegHeart className='size-4'/> {likes} Likes</button>
                <button className='flex items-center gap-2'><FaCommentAlt/> Reply</button>
                <button className='flex items-center gap-2'><FaFlag/> Report</button>
            </div>
        </div>
    );
}
