import React from 'react';
import { useEffect } from 'react';
import { Card } from 'antd';
import { useParams } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const Topic = () => {
    const navigate = useNavigate();
    const { topicId } = useParams();
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

    const { isPending, error, data } = useQuery({
        queryKey: ['Topic', topicId],
        queryFn: async () => {
            const token = await getAccessTokenSilently();
            if (!isAuthenticated || !user || !token) return;
            const result = await fetch(`http://localhost:3000/topics/${topicId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            return await result.json();
        },
        enabled: isAuthenticated && !!user && !!topicId,
    });


    useEffect(() => {
        if (isPending || !data) return;
        console.log('Fetched topic data:', data);
    }, [data, isPending])


    if (isPending || !data || !data.data) {
        console.log('Loading or no data available');
        return null;
    } else {
        // data.data.map((blog) => {
        //     console.log('Blog ID:', blog.blog_id);
        //     console.log('Topic Name:', blog.title);
        //     console.log('Topic Content:', blog.content);
        // });
        const blogs = data.data;
        //console.log('Topic data:', data.data[0]);
        const topicTitle = data.data[0].topic_name;
        const topicContent = data.data[0].topic_content;
        // console.log('Topic title:', topicTitle);
        // console.log('Topic content:', topicContent);

        return (
            <div className="bg-primary-50 min-h-screen pb-16">
                {/* Header */}
                <div className="px-6 md:px-20 py-12 bg-primary-100 text-primary-900">
                    <h1 className="text-4xl font-bold mb-4">{topicTitle}</h1>
                    <p className="text-lg max-w-3xl">
                        {topicContent}
                    </p>
                </div>

                {/* Topics */}
                <div className="max-w-5xl mx-auto mt-10 space-y-6 px-4">
                    {blogs.map((blog, index) => (
                        <Card hoverable onClick={() => navigate(`/topics/${topicId}/${blog.blog_id}`)} key={index} className="shadow-sm border border-gray-200">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500 font-medium">Topics</p>
                                <h2 className="text-xl font-semibold text-primary-900">{blog.title}</h2>
                                <p className="text-gray-700">{blog.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }


};

const AuthTopic = withAuthenticationRequired(Topic);
export default AuthTopic;
