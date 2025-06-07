import React from 'react';
import { Card } from 'antd';
import { useParams } from 'react-router-dom';

const topics = [
    {
        title: 'Health risks of smoking',
        description:
            'Learn the health risks of smoking and the life-changing benefits of quitting. See how smoking harms your body and how quitting lowers risks like cancer, lung disease and heart problems - at any age or stage.',
    },
    {
        title: 'Chemicals in tobacco products',
        description:
            'Explore the 7,000+ chemicals in tobacco smoke, including 69 cancer-causing substances. Learn how additives like ammonia boost addiction in tobacco products.',
    },
    {
        title: 'How smoking affects the body',
        description:
            'Discover how smoking harms nearly every part of your body. Learn the effects of smoking on your organs and why quitting is the best choice for your health.',
    },
];

const Topic = () => {
    const { topicId } = useParams();
    
    console.log('Current topic ID:', topicId);
    return (
        <div className="bg-purple-50 min-h-screen pb-16">
            {/* Header */}
            <div className="px-6 md:px-20 py-12 bg-purple-100 text-purple-900">
                <h1 className="text-4xl font-bold mb-4">Smoking and your health</h1>
                <p className="text-lg max-w-3xl">
                    The moment you quit smoking, your body starts to heal and your health begins to improve. Discover how smoking affects your body, the risks of passive smoking, and what happens during withdrawal as you start your journey to better health.
                </p>
            </div>

            {/* Topics */}
            <div className="max-w-5xl mx-auto mt-10 space-y-6 px-4">
                {topics.map((topic, index) => (
                    <Card key={index} className="shadow-sm border border-gray-200">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500 font-medium">Topics</p>
                            <h2 className="text-xl font-semibold text-purple-900">{topic.title}</h2>
                            <p className="text-gray-700">{topic.description}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Topic;
