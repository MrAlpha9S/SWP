import React from 'react';
import { useEffect } from 'react';
import { Typography, Table } from 'antd';
import { useParams } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';

const { Title, Paragraph, Text, Link } = Typography;

const dataSource = [
  {
    key: '1',
    belief: 'Smoking manages my anxiety',
    result: 'Anxiety reduces by 37%',
  },
  {
    key: '2',
    belief: 'Smoking lifts my low mood',
    result: 'Depression symptoms decrease by 25%',
  },
  {
    key: '3',
    belief: 'Smoking relieves my stress',
    result: 'Stress reduces by 27%',
  },
  {
    key: '4',
    belief: 'Smoking is what makes me feel happy',
    result: 'Positive emotions increase by 40%',
  },
  {
    key: '5',
    belief: 'Smoking is all I have and I enjoy it',
    result: 'Quality of life improves by 22%',
  },
];

const columns = [
  {
    title: 'What you might think as someone who smokes',
    dataIndex: 'belief',
    key: 'belief',
  },
  {
    title: 'What actually happens when you quit',
    dataIndex: 'result',
    key: 'result',
  },
];

const BlogPost = () => {
  const { topicId, blogId } = useParams();

  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const { isPending, error, data } = useQuery({
    queryKey: ['Blog', topicId],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      if (!isAuthenticated || !user || !token) return;
      const result = await fetch(`http://localhost:3000/topics/${topicId}/${blogId}`, {
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
    console.log('Fetched blog data:', data);
  }, [data, isPending])

  if (isPending || !data || !data.data) {
    console.log('Loading or no data available');
    return null;
  } else {
    const blogTitle = data.data.title;
    const blogDescription = data.data.description;
    const blogContent = data.data.content;
    console.log('blogContent:', blogContent);
    return (
      <div className="bg-primary-50 min-h-screen pb-16">
        <div className="bg-white max-w-5xl mx-auto p-6">
          <section className="bg-white-50 p-6 rounded-md shadow-sm mb-10">
            <Title level={1} className="!text-primary-800">{blogTitle}</Title>
            <Paragraph>
              {blogDescription}
            </Paragraph>
          </section>

          <section className="mb-10">
            <div dangerouslySetInnerHTML={{ __html: blogContent }} />
            
          </section>

          
        </div>
      </div>
    );
  }


};

export default BlogPost;
