import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section id="contactus" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Ready to transform your educational experience? Get in touch with us
            today!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Get in Touch
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 sm:mb-8">
                We'd love to hear from you. Send us a message and we'll respond
                as soon as possible.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center">
                <div className="bg-blue-600 rounded-full p-2 sm:p-3 mr-3 sm:mr-4">
                  <FaPhone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Phone
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-blue-600 rounded-full p-2 sm:p-3 mr-3 sm:mr-4">
                  <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Email
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    contact@lmsname.com
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-blue-600 rounded-full p-2 sm:p-3 mr-3 sm:mr-4">
                  <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Address
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    123 Education Street
                    <br />
                    Learning City, LC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors text-sm sm:text-base"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors text-sm sm:text-base"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors text-sm sm:text-base"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors resize-none text-sm sm:text-base"
                  placeholder="Tell us more about your needs..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
