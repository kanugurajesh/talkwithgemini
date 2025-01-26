"use client";

import { FaCheck } from "react-icons/fa";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with Gemini AI",
    features: [
      "Voice conversations",
      "Basic chat history",
      "Text export",
      "Dark mode support",
    ],
    buttonText: "Get Started",
    buttonStyle: "border-blue-600 text-blue-600 hover:bg-blue-50",
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "Enhanced features for power users",
    features: [
      "Everything in Free",
      "Unlimited chat history",
      "Priority support",
      "Advanced exports (JSON)",
      "Custom chat organization",
      "API access",
    ],
    buttonText: "Coming Soon",
    buttonStyle: "bg-blue-600 text-white hover:bg-blue-700",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per organization",
    description: "For organizations needing advanced features",
    features: [
      "Everything in Pro",
      "Custom deployment",
      "Dedicated support",
      "SLA guarantees",
      "User management",
      "Analytics dashboard",
    ],
    buttonText: "Contact Us",
    buttonStyle: "border-blue-600 text-blue-600 hover:bg-blue-50",
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Plans for everyone
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Choose the perfect plan for your needs. Start for free and upgrade as you grow.
          </p>
        </div>

        <div className="mt-20 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex flex-col
                ${plan.featured ? 'ring-2 ring-blue-600 scale-105' : ''}
              `}
            >
              {plan.featured && (
                <span className="absolute top-0 -translate-y-1/2 bg-blue-600 text-white px-3 py-0.5 text-sm font-semibold tracking-wide rounded-full">
                  Most Popular
                </span>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-300">/{plan.period}</span>
                </p>
                <p className="mt-6 text-gray-500 dark:text-gray-300">{plan.description}</p>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <FaCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="ml-3 text-gray-500 dark:text-gray-300">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`mt-8 block w-full py-3 px-6 border-2 rounded-md text-center font-medium ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
