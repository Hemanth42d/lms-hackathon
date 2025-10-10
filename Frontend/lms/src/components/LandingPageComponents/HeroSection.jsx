import React from "react";
import { Link } from "react-router";
import {
  FaPlay,
  FaUsers,
  FaGraduationCap,
  FaTrophy,
  FaStar,
  FaArrowRight,
  FaBookOpen,
  FaChartLine,
  FaLaptop,
} from "react-icons/fa";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full bg-slate-50 overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-50 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-50 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute top-40 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute top-60 right-1/3 w-3 h-3 bg-indigo-400 rounded-full opacity-40"></div>
        <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-slate-400 rounded-full opacity-50"></div>
      </div>
      <div className="relative z-10 min-h-screen grid lg:grid-cols-2 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-24 space-y-8">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
            <FaStar className="text-amber-400 w-4 h-4" />
            <span className="text-slate-700 text-sm font-medium">
              Rated #1 LMS Platform 2024
            </span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Transform
              <span className="block text-blue-600">Education</span>
              <span className="block">Experience</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-lg leading-relaxed">
              Empower your institution with cutting-edge learning management
              tools that drive engagement and success.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-slate-900">
            <div>
              <div className="text-2xl sm:text-3xl font-bold">50K+</div>
              <div className="text-slate-600 text-sm">Active Students</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold">1,200+</div>
              <div className="text-slate-600 text-sm">Institutions</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold">99.9%</div>
              <div className="text-slate-600 text-sm">Uptime</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <button className="group bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <FaGraduationCap className="w-5 h-5" />
                Start Free Trial
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/demo">
              <button className="group bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                <FaPlay className="w-4 h-4" />
                Watch Demo
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
            <div className="flex items-center gap-3 text-slate-800">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaBookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Smart Learning</div>
                <div className="text-sm text-slate-600">AI-powered courses</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-800">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FaChartLine className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="font-medium">Analytics</div>
                <div className="text-sm text-slate-600">Real-time insights</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-800">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FaLaptop className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-medium">Multi-device</div>
                <div className="text-sm text-slate-600">Access anywhere</div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative lg:pl-16 py-16">
          <div className="relative">
            <div className="absolute inset-0 bg-slate-900/10 rounded-3xl blur-2xl scale-105 translate-y-4"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                    eduflow.com
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Dashboard
                    </h3>
                    <p className="text-slate-600">Welcome back, John!</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FaBookOpen className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-1">
                      React Course
                    </h4>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                      <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                    </div>
                    <p className="text-xs text-slate-600">75% Complete</p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <FaChartLine className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        New
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-1">
                      Data Science
                    </h4>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                      <div className="bg-indigo-500 h-2 rounded-full w-1/3"></div>
                    </div>
                    <p className="text-xs text-slate-600">33% Complete</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3">
                    This Week
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">12</div>
                      <div className="text-xs text-slate-600">Lessons</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-emerald-600">
                        8.5h
                      </div>
                      <div className="text-xs text-slate-600">Hours</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-indigo-600">
                        94%
                      </div>
                      <div className="text-xs text-slate-600">Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-indigo-500 rounded-full animate-bounce shadow-lg"></div>
            <div className="absolute top-1/2 -right-8 w-6 h-6 bg-emerald-500 rounded-full animate-ping"></div>
          </div>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 right-10 w-20 h-20 border-2 border-blue-200 rounded-lg transform rotate-12 animate-pulse"></div>
            <div className="absolute bottom-20 left-0 w-16 h-16 bg-slate-100 rounded-full blur-sm"></div>
            <div className="absolute top-1/3 left-5 w-4 h-4 bg-blue-400 rounded-full animate-bounce animation-delay-1000"></div>
            <svg
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="lineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="rgb(59, 130, 246)"
                    stopOpacity="0.2"
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(99, 102, 241)"
                    stopOpacity="0.2"
                  />
                </linearGradient>
              </defs>
              <path
                d="M50,100 Q150,50 250,100 T450,100"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
