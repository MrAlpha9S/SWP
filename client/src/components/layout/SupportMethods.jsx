import { FiRefreshCw, FiSearch, FiZap } from 'react-icons/fi'

function SupportMethods() {
  const methods = [
    {
      icon: <FiRefreshCw className="w-10 h-10 text-primary-500" />,
      title: 'Change Your Habits',
      description: 'Identify your smoking triggers, break negative patterns, and build healthier habits to replace smoking.'
    },
    {
      icon: <FiSearch className="w-10 h-10 text-primary-500" />,
      title: 'Find Support',
      description: 'Access 24/7 counseling, join our community, and connect with others on the same journey.'
    },
    {
      icon: <FiZap className="w-10 h-10 text-primary-500" />,
      title: 'Replacement Strategies',
      description: 'Use scientifically-backed nicotine replacement therapies and techniques to manage cravings.'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
          How QuitEase Helps You Quit
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          QuitEase combines proven methods with modern technology to help you quit smoking effectively and permanently.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {methods.map((method, index) => (
            <div 
              key={index} 
              className="card hover:shadow-lg group"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {method.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {method.title}
              </h3>
              <p className="text-gray-600">
                {method.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SupportMethods