import React from "react";

const FEATURES = [
  {
    icon: "🎯",
    title: "Daily Job Applications",
    text: "We apply to 20-25 relevant positions daily on your behalf, using advanced matching algorithms to find roles that perfectly align with your skills and career goals.",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: "🚀",
    title: "ATS-Optimized Resumes",
    text: "Our intelligent resume builder creates ATS-friendly documents that pass through Applicant Tracking Systems used by Fortune 500 companies and top startups.",
    gradient: "from-green-500 to-green-600"
  },
  {
    icon: "💼",
    title: "Career Partnership",
    text: "More than a service - we're your dedicated career partner, providing personalized guidance, interview prep, and strategic job search support throughout your journey.",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: "📊",
    title: "Smart Job Matching",
    text: "Our AI-powered system analyzes job requirements and matches them with your profile, ensuring every application has the highest chance of success.",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    icon: "⚡",
    title: "Time Efficiency",
    text: "Save 20+ hours weekly on job applications. Focus your energy on interview preparation, skill development, and networking while we handle the applications.",
    gradient: "from-yellow-500 to-yellow-600"
  },
  {
    icon: "🎓",
    title: "Student-Focused",
    text: "Specifically designed for Indian students and graduates in the U.S., understanding visa requirements, cultural nuances, and unique career challenges.",
    gradient: "from-indigo-500 to-indigo-600"
  },
];

export const Features = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="mx-auto lg:max-w-7xl px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 
            className="text-5xl font-bold mb-6 leading-tight"
            style={{ 
              fontFamily: "'Noto Sans', sans-serif",
              color: '#1E1E1E'
            }}
          >
            Why Choose{" "}
            <span 
              className="italic bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 bg-clip-text text-transparent"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Apply Wizz
            </span>
            ?
          </h2>
          <p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Noto Sans', sans-serif" }}
          >
            Your career partner that simplifies the job hunt for Indian students and graduates in the U.S.
          </p>
        </div>
        
        <dl className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3 lg:gap-10">
          {FEATURES.map(({ icon, title, text, gradient }) => (
            <div className="group relative" key={title}>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 h-full">
                {/* Icon with gradient background */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${gradient} mb-6 shadow-lg`}>
                  <span className="text-2xl">{icon}</span>
                </div>
                
                <dt className="mb-4">
                  <h3 
                    className="text-xl font-bold text-gray-900 leading-tight"
                    style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  >
                    {title}
                  </h3>
                </dt>
                
                <dd 
                  className="text-gray-600 leading-relaxed text-base"
                  style={{ fontFamily: "'Noto Sans', sans-serif" }}
                >
                  {text}
                </dd>
                
                {/* Hover effect border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}></div>
              </div>
            </div>
          ))}
        </dl>
        
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 shadow-2xl">
            <h3 
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "'Noto Sans', sans-serif" }}
            >
              Ready to Accelerate Your Career?
            </h3>
            <p 
              className="text-blue-100 mb-6 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: "'Noto Sans', sans-serif" }}
            >
              Join 500+ successful professionals who transformed their job search with Apply Wizz
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://apply-wizz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-blue-700 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                🚀 Start Your Success Journey
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">FREE TRIAL</span>
              </a>
              <a
                href="https://apply-wizz.com/success-stories"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                📈 View Success Stories
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
