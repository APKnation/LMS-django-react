import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas-dark text-on-dark">
      <div className="flex-1">
        {/* HERO */}
        <div className="relative overflow-hidden bg-canvas-dark">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/student1.png')" }}
          ></div>
          <div className="absolute inset-0 bg-canvas-dark/80"></div>

          {/* Screenshot cards */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="hidden lg:block absolute top-24 left-8 w-64 h-40 bg-surface-card-dark/90 border border-hairline-on-dark rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/Screenshot from 2026-07-09 02-33-46.png"
                alt=""
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="hidden lg:block absolute top-24 right-8 w-64 h-40 bg-surface-card-dark/90 border border-hairline-on-dark rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/Screenshot from 2026-07-09 02-33-53.png"
                alt=""
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight">
              Next-Gen <br />
              <span className="text-primary">Learning Platform</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-body-on-dark mb-6 sm:mb-8 max-w-2xl mx-auto">
              Learn smarter, faster, and better with a platform built for the
              future of education.
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              {[
                { label: "HD Video Lessons" },
                { label: "Interactive Quizzes" },
                { label: "Certificates" },
                { label: "Learn Anywhere" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-body-on-dark backdrop-blur-sm shadow-sm"
                >
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <Link
              to="/login"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-on-primary font-semibold rounded-md hover:bg-primary-active transition-colors duration-200 text-sm sm:text-base"
            >
              Start Learning
            </Link>
          </div>
        </div>

        {/* STATS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
            {[
              { value: "10K+", label: "Active Students" },
              { value: "500+", label: "Courses" },
              { value: "98%", label: "Success Rate" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-4 sm:p-6 lg:p-8 text-center"
              >
                <div
                  className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 font-plex text-primary`}
                >
                  {stat.value}
                </div>
                <p className="text-sm sm:text-base text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Why Choose Our LMS?</h2>
            <p className="text-sm sm:text-base text-muted max-w-xl mx-auto">
              Designed to deliver the best learning experience for students and
              instructors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                title: "Rich Content",
                desc: "Access videos, PDFs, quizzes, and more",
              },
              {
                title: "Track Progress",
                desc: "Monitor your journey with analytics",
              },
              {
                title: "Certification",
                desc: "Get recognized for your achievements",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group bg-surface-card-dark border border-hairline-on-dark rounded-xl p-4 sm:p-6 lg:p-8 hover:bg-surface-elevated-dark transition-colors duration-200"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-surface-elevated-dark flex items-center justify-center text-primary text-lg sm:text-2xl mb-3 sm:mb-4">
                  ⚡
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-on-dark">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SCREENSHOTS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Platform Preview</h2>
            <p className="text-sm sm:text-base text-muted max-w-xl mx-auto">
              Explore the intuitive interface designed for seamless learning.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                src: "/Screenshot from 2026-07-09 02-33-46.png",
                alt: "Dashboard preview",
              },
              {
                src: "/Screenshot from 2026-07-09 02-33-53.png",
                alt: "Course view preview",
              },
              {
                src: "/Screenshot from 2026-07-09 02-34-38.png",
                alt: "Learning experience preview",
              },
            ].map((screenshot, i) => (
              <div
                key={i}
                className="bg-surface-card-dark border border-hairline-on-dark rounded-xl overflow-hidden"
              >
                <img
                  src={screenshot.src}
                  alt={screenshot.alt}
                  className="w-full h-auto object-cover max-h-48 sm:max-h-64"
                />
              </div>
            ))}
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="bg-canvas-dark py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">
              What Our Students Say
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-8"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={`https://picsum.photos/seed/student${i}/60`}
                      className="w-14 h-14 rounded-full border-2 border-primary"
                      alt=""
                    />
                    <div className="ml-4">
                      <h4 className="font-semibold text-on-dark">
                        Student {i}
                      </h4>
                      <p className="text-sm text-muted">LMS User</p>
                    </div>
                  </div>

                  <p className="text-body-on-dark italic mb-4">
                    “Amazing platform! The experience is smooth and engaging.”
                  </p>

                  <div className="text-primary text-lg">★★★★★</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative py-12 sm:py-16 lg:py-24 bg-surface-card-dark text-on-dark text-center overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Ready to Level Up Your Learning?
            </h2>

            <p className="text-base sm:text-lg mb-6 sm:mb-8 text-muted">
              Join thousands of learners today.
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                to="/register"
                className="inline-block px-5 sm:px-8 py-2.5 sm:py-3 bg-primary text-on-primary font-semibold rounded-md hover:bg-primary-active transition-colors duration-200 text-sm sm:text-base"
              >
                Sign Up
              </Link>

              <Link
                to="/courses"
                className="inline-block px-5 sm:px-8 py-2.5 sm:py-3 border-2 border-hairline-on-dark rounded-md text-on-dark hover:bg-surface-elevated-dark transition-colors duration-200 text-sm sm:text-base"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
