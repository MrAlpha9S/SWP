import { FiUser, FiMessageSquare, FiUserCheck } from 'react-icons/fi'

function Tools() {
  const tools = [
    {
      icon: <FiUser className="w-6 h-6" />,
      bgColor: 'bg-secondary-500',
      title: 'Personal Plan',
      description: 'Get a customized quit plan tailored to your smoking habits, triggers, and lifestyle factors.',
      buttonText: 'Create Plan',
      buttonColor: 'bg-secondary-500 hover:bg-secondary-600'
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      bgColor: 'bg-accent-500',
      title: '24/7 Chat Support',
      description: 'Access our support team anytime through chat for guidance, motivation, and answers to your questions.',
      buttonText: 'Chat Now',
      buttonColor: 'bg-accent-500 hover:bg-accent-600'
    },
    {
      icon: <FiUserCheck className="w-6 h-6" />,
      bgColor: 'bg-success-500',
      title: 'Expert Counseling',
      description: 'Schedule one-on-one sessions with our cessation specialists for personalized guidance.',
      buttonText: 'Book Session',
      buttonColor: 'bg-success-500 hover:bg-success-600'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
          Smoking Cessation Tools
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Access these powerful tools to support your journey to becoming smoke-free.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <div 
              key={index} 
              className="card hover:shadow-lg overflow-hidden flex flex-col"
            >
              <div className={`p-4 text-white ${tool.bgColor} self-start rounded-lg mb-4`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {tool.title}
              </h3>
              <p className="text-gray-600 mb-6 flex-grow">
                {tool.description}
              </p>
              <button className={`btn text-white ${tool.buttonColor} w-full mt-auto`}>
                {tool.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Tools