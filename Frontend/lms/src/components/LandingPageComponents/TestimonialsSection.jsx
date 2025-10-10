import React from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Professor, Computer Science",
      institution: "Tech University",
      rating: 5,
      comment:
        "This LMS has revolutionized how I deliver my courses. The intuitive interface and powerful analytics help me understand my students better than ever before.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Michael Chen",
      role: "Student",
      institution: "Business College",
      rating: 5,
      comment:
        "As a student, I love how easy it is to access all my course materials and track my progress. The mobile-friendly design means I can study anywhere.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Emily Rodriguez",
      role: "Academic Administrator",
      institution: "Global Institute",
      rating: 5,
      comment:
        "The administrative tools are fantastic. I can easily manage multiple departments and get comprehensive reports on institutional performance.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <FaQuoteLeft className="text-blue-600 w-6 h-6 mr-3" />
                <div className="flex">{renderStars(testimonial.rating)}</div>
              </div>

              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed italic">
                "{testimonial.comment}"
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {testimonial.role}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-600">
                    {testimonial.institution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
