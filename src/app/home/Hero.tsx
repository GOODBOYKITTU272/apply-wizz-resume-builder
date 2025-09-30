"use client";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#diagonalHatch)"/>
        </svg>
      </div>
      
      {/* Floating Profile Images - Exact positioning from Apply Wizz */}
      <div className="absolute inset-0 hidden lg:block">
        {/* Top Left - SDE */}
        <div className="absolute" style={{ top: '15%', left: '8%' }}>
          <div className="relative animate-float">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" 
                alt="Software Engineer" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-400 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg">SDE</span>
            </div>
          </div>
        </div>
        
        {/* Middle Left - Analyst */}
        <div className="absolute" style={{ top: '45%', left: '15%' }}>
          <div className="relative animate-float-delayed">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face" 
                alt="Business Analyst" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-cyan-400 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg">Analyst</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Left - AI */}
        <div className="absolute" style={{ bottom: '20%', left: '12%' }}>
          <div className="relative animate-float">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face" 
                alt="AI Specialist" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-pink-300 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg">AI</span>
            </div>
          </div>
        </div>
        
        {/* Top Right - Medical */}
        <div className="absolute" style={{ top: '12%', right: '8%' }}>
          <div className="relative animate-float-delayed">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face" 
                alt="Medical Professional" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-orange-400 text-black px-3 py-2 rounded-full text-sm font-semibold shadow-lg">Medical</span>
            </div>
          </div>
        </div>
        
        {/* Middle Right - Finance */}
        <div className="absolute" style={{ top: '35%', right: '12%' }}>
          <div className="relative animate-float">
            <div className="w-26 h-26 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" 
                alt="Finance Professional" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-black px-3 py-2 rounded-full text-sm font-semibold shadow-lg">Finance</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Right - CS */}
        <div className="absolute" style={{ bottom: '15%', right: '6%' }}>
          <div className="relative animate-float-delayed">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face" 
                alt="Computer Science" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">CS</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] xl:text-[80px] font-bold leading-tight lg:leading-[85px] text-black mb-8">
            Transform Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 bg-clip-text text-transparent">Career Journey</span>
            <br />
            <span className="text-black">with Apply Wizz</span>
          </h1>
          
          <p className="text-lg lg:text-xl xl:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
            Your dedicated career partner for landing dream jobs in the U.S.
            <br className="hidden sm:block" />
            We handle 20-25 daily applications tailored to your profile,
            <br className="hidden sm:block" />
            so you can focus on interviews and career growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="https://apply-wizz.com/" target="_blank" rel="noopener noreferrer">
              <button className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-10 py-5 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3">
                🚀 Start Your Success Story
                <svg className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </a>
            
            <Link href="/resume-builder">
              <button className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-10 py-5 rounded-2xl text-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                📄 Build ATS Resume
              </button>
            </Link>
          </div>
          
          {/* Success Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Success Stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">25</div>
              <div className="text-gray-600 font-medium">Daily Applications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-600 font-medium">Interview Rate</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
