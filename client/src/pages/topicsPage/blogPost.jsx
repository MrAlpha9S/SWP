import React from 'react';
import { Typography, Table } from 'antd';

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
  return (
    <div className="bg-primary-50 max-w-5xl mx-auto p-6">
      <section className="bg-primary-50 p-6 rounded-md shadow-sm mb-10">
        <Title level={1} className="!text-primary-800">Common concerns about quitting</Title>
        <Paragraph>
          Quitting smoking is one of the best things you can do for your health,
          your family and your lifestyle. The journey can be challenging, with
          peaks and troughs along the way, but with the support of your friends,
          family and iCanQuit, you’ll get there.
        </Paragraph>
      </section>

      <section className="mb-10">
        <Title level={3}>The effect on your appearance</Title>
        <Paragraph>One of the biggest benefits of quitting smoking is the positive impact it can have on the way you look.</Paragraph>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Healthier hair, skin, nails and eyes</li>
          <li>Fewer wrinkles</li>
          <li>Reduced risk of macular degeneration or cataracts</li>
          <li>Lower chance of acne and psoriasis</li>
          <li>Less risk of losing your teeth, having yellow teeth, or having bad breath</li>
        </ul>
      </section>

      <section className="mb-10">
        <Title level={3}>Weight gain</Title>
        <Paragraph>
          It’s understandable to have concerns about <Link href="#">gaining weight</Link> when you quit smoking.
          But don’t be too concerned – the benefits to your health and appearance when you quit are amazing.
          In the longer term, people who used to smoke don’t tend to weigh more than people who’ve never smoked.
        </Paragraph>
        <Paragraph>
          Most people seem to gain about 4kg – but some people don’t put on any extra kilos at all.
          Around 60% of this weight is added in the first year after quitting.
          Putting on excessive weight (over 10kg) isn’t common.
        </Paragraph>
      </section>

      <section>
        <Title level={3}>The effect on mental wellbeing</Title>
        <Paragraph>
          Quitting can improve <Link href="#">mental health</Link>, and reduce feelings of anxiety and stress.
          You’ll feel a positive improvement in your wellbeing that’s chemical-free.
        </Paragraph>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          className="mt-4"
        />
      </section>
    </div>
  );
};

export default BlogPost;
