const STEPS = [
  { 
    title: "Share Your Profile", 
    text: "Upload your resume or create one with our ATS-optimized builder. Tell us about your career goals and preferences.",
    icon: "📄",
    color: "from-blue-500 to-blue-600"
  },
  { 
    title: "We Apply Daily", 
    text: "Our expert team and AI system apply to 20-25 relevant positions daily, customizing each application to match job requirements.",
    icon: "🎯",
    color: "from-green-500 to-green-600"
  },
  { 
    title: "Land Your Dream Job", 
    text: "Focus on interview preparation and skill development while we handle the tedious application process. Get ready for success!",
    icon: "🎆",
    color: "from-purple-500 to-purple-600"
  },
];

export const Steps = () => {
  return (
    <section className="mx-auto mt-12 rounded-3xl bg-gradient-to-br from-white via-blue-50 to-white px-8 pb-16 pt-16 lg:mt-8 shadow-2xl border border-blue-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-200/30 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl font-bold mb-6 leading-tight"
            style={{ 
              fontFamily: "'Noto Sans', sans-serif",
              color: '#1E1E1E'
            }}
          >
            How{" "}
            <span 
              className="italic bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Apply Wizz
            </span>
            {" "}Works
          </h2>
          <p 
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Noto Sans', sans-serif" }}
          >
            Simple, efficient, and designed specifically for Indian students and graduates in the U.S.
          </p>
        </div>
        <div className="mt-12 flex justify-center">
          <dl className="flex flex-col gap-y-12 lg:flex-row lg:justify-center lg:gap-x-20">
            {STEPS.map(({ title, text, icon, color }, idx) => (
              <div className="relative self-start text-center lg:text-left max-w-sm group" key={idx}>
                <dt className="text-lg font-bold mb-4">
                  <div className="relative mb-6">
                    <div 
                      className={`mx-auto lg:mx-0 flex h-20 w-20 select-none items-center justify-center rounded-2xl shadow-xl bg-gradient-to-r ${color} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="text-3xl">{icon}</span>
                    </div>
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100">
                      <span className="text-sm font-bold text-gray-700">{idx + 1}</span>
                    </div>
                  </div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-3"
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
                {idx < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-10 top-12 text-3xl text-gray-300 animate-pulse">
                    →
                  </div>
                )}
              </div>
            ))}
          </dl>
        </div>
      
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-xl">
            <h3 
              className="text-2xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Noto Sans', sans-serif" }}
            >
              Ready to Transform Your Career?
            </h3>
            <p 
              className="text-gray-800 mb-4 text-base"
              style={{ fontFamily: "'Noto Sans', sans-serif" }}
            >
              Join 500+ professionals who accelerated their career success with Apply Wizz
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://apply-wizz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gray-900 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                🚀 Begin Your Success Story
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">FREE TRIAL</span>
              </a>
              <a
                href="https://apply-wizz.com/how-it-works"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-700 font-semibold px-6 py-3 rounded-full border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-100 transition-all duration-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                📈 Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
