import { FiCheck } from 'react-icons/fi'

function Membership() {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      features: [
        'Access to community forums',
        'Basic tracking tools',
        'Educational resources',
        'Email support'
      ],
      buttonText: 'Sign Up',
      popular: false
    },
    {
      name: 'Premium',
      price: '$9.99/month',
      features: [
        'Everything in Basic',
        'Personalized quit plan',
        'Advanced tracking tools',
        '24/7 chat support',
        'Weekly check-ins'
      ],
      buttonText: 'Get Started',
      popular: true
    },
    {
      name: 'Pro',
      price: '$19.99/month',
      features: [
        'Everything in Premium',
        'One-on-one counseling',
        'Priority support',
        'Customized resources',
        'Family support resources'
      ],
      buttonText: 'Choose Pro',
      popular: false
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
          Membership Plans
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Choose the right level of support for your quit journey.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`card hover:shadow-lg relative ${plan.popular ? 'border-2 border-primary-500 transform md:scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                {plan.name}
              </h3>
              <p className="text-2xl md:text-3xl font-bold text-center text-primary-600 mb-6">
                {plan.price}
              </p>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <FiCheck className="text-success-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                className={`btn w-full ${plan.popular ? 'btn-primary' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Membership