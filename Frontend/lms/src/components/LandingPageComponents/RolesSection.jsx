import React from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaCog } from "react-icons/fa";

const RolesSection = () => {
  const roles = [
    {
      icon: (
        <FaUserGraduate className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
      ),
      title: "Students",
      description:
        "Engage with interactive course content and track your progress efficiently.",
    },
    {
      icon: (
        <FaChalkboardTeacher className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
      ),
      title: "Teachers",
      description:
        "Create dynamic learning experiences and manage your classes seamlessly.",
    },
    {
      icon: <FaCog className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />,
      title: "Administrators",
      description:
        "Oversee your institution's learning ecosystem with powerful admin tools.",
    },
  ];

  return (
    <section id="roles" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Roles
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {roles.map((role, index) => (
            <div key={index} className="text-center group p-4">
              <div className="bg-gray-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-blue-50 transition-colors duration-300">
                {role.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                {role.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
