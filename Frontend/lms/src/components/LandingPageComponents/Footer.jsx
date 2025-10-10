import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Demo", href: "#demo" },
      { name: "API", href: "#api" },
    ],
    Company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Blog", href: "#blog" },
      { name: "Press", href: "#press" },
    ],
    Support: [
      { name: "Help Center", href: "#help" },
      { name: "Documentation", href: "#docs" },
      { name: "Contact", href: "#contactus" },
      { name: "Status", href: "#status" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "GDPR", href: "#gdpr" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: FaFacebook, href: "#" },
    { name: "Twitter", icon: FaTwitter, href: "#" },
    { name: "LinkedIn", icon: FaLinkedin, href: "#" },
    { name: "Instagram", icon: FaInstagram, href: "#" },
    { name: "GitHub", icon: FaGithub, href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-bold">LMS NAME</h3>
            </div>
            <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Empowering education through innovative learning management
              solutions. Transform your institution's learning experience with
              our comprehensive platform.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="sm:col-span-1">
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                {category}
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0">
            <div className="mb-4 lg:mb-0">
              <h4 className="text-base sm:text-lg font-semibold mb-2">
                Stay Updated
              </h4>
              <p className="text-gray-400 text-sm sm:text-base">
                Subscribe to our newsletter for the latest updates and features.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white placeholder-gray-400 w-full sm:w-64 lg:w-80 text-sm sm:text-base"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-colors duration-300 whitespace-nowrap text-sm sm:text-base">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 gap-4 md:gap-0">
            <p className="mb-0 text-sm sm:text-base">
              © {currentYear} LMS NAME. All rights reserved.
            </p>
            <p className="text-sm">Made with ❤️ for education</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
