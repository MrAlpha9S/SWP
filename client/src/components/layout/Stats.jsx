function Stats() {
  const stats = [
    {
      value: '24/7',
      label: 'Support Available',
      description: 'Our team is always here to help you through your journey with round-the-clock guidance.'
    },
    {
      value: '2M+',
      label: 'Users Helped',
      description: 'Join our community of over 2 million people who have successfully quit smoking.'
    },
    {
      value: '40%',
      label: 'Success Rate Increase',
      description: 'Our program increases your chances of quitting by 40% compared to trying alone.'
    },
    {
      value: '96%',
      label: 'Satisfaction Rate',
      description: 'Over 96% of our users would recommend our program to friends and family.'
    }
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Our Program
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="card hover:shadow-lg hover:scale-105 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {stat.label}
              </h3>
              <p className="text-gray-600">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats