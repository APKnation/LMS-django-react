import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">

        {/* HERO */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 animate-gradient-x"></div>

          {/* Glow effect */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 opacity-30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-30 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-6 py-28 text-center text-white">
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Next-Gen Learning <br />
              <span className="text-indigo-300">Management System</span>
            </h1>

            <p className="text-xl lg:text-2xl text-indigo-200 mb-10 max-w-3xl mx-auto">
              Learn smarter, faster, and better with a platform built for the future of education.
            </p>

            <Link
              to="/login"
              className="px-10 py-4 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              🚀 Get Started
            </Link>
          </div>
        </div>

        {/* STATS */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { value: "10K+", label: "Active Students", color: "text-indigo-600" },
              { value: "500+", label: "Courses", color: "text-emerald-600" },
              { value: "98%", label: "Success Rate", color: "text-purple-600" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className={`text-5xl font-extrabold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Our LMS?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Designed to deliver the best learning experience for students and instructors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Rich Content",
                desc: "Access videos, PDFs, quizzes, and more",
                color: "from-indigo-500 to-indigo-700"
              },
              {
                title: "Track Progress",
                desc: "Monitor your journey with analytics",
                color: "from-emerald-500 to-emerald-700"
              },
              {
                title: "Certification",
                desc: "Get recognized for your achievements",
                color: "from-purple-500 to-purple-700"
              }
            ].map((f, i) => (
              <div key={i} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${f.color} flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition`}>
                  ⚡
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">
              What Our Students Say
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <img
                      src={`https://picsum.photos/seed/student${i}/60`}
                      className="w-14 h-14 rounded-full border-2 border-indigo-500"
                      alt=""
                    />
                    <div className="ml-4">
                      <h4 className="font-semibold">Student {i}</h4>
                      <p className="text-sm text-gray-500">LMS User</p>
                    </div>
                  </div>

                  <p className="text-gray-600 italic mb-4">
                    “Amazing platform! The experience is smooth and engaging.”
                  </p>

                  <div className="text-yellow-400 text-lg">★★★★★</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative py-24 bg-gradient-to-r from-indigo-700 to-purple-700 text-white text-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <div className="relative">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Level Up Your Learning?
            </h2>

            <p className="text-lg mb-10">
              Join thousands of learners today.
            </p>

            <div className="space-x-6">
              <Link
                to="/register"
                className="px-10 py-4 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:scale-105 transition"
              >
                Sign Up
              </Link>

              <Link
                to="/courses"
                className="px-10 py-4 border-2 border-white rounded-xl hover:bg-white hover:text-indigo-700 transition"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Home;