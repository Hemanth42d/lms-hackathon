import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Course Creation",
      description:
        "Easily design and build comprehensive course content with our intuitive content management system.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      reverse: false,
    },
    {
      title: "Grading",
      description:
        "Streamline your grading process with automated grading and detailed feedback tools.",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      reverse: true,
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor student progress in real-time, identify areas for improvement, and provide targeted support.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      reverse: false,
    },
    {
      title: "Analytics",
      description:
        "Gain valuable insights into student performance and course effectiveness with comprehensive analytics.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      reverse: true,
    },
  ];

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Features
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                feature.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center gap-6 sm:gap-8 lg:gap-12`}
            >
              <div className="flex-1 w-full">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="flex-1 text-center lg:text-left px-4 sm:px-0">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Ready to transform your institution's learning experience?
          </h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 sm:py-3 sm:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-base">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
