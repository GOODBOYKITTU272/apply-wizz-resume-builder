import React from 'react';
import { ApplyWizzLogo } from './ApplyWizzLogo';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white py-20 px-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <ApplyWizzLogo size="lg" className="mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              Your Career Partner for Success
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6 max-w-lg">
              Empowering Indian students and graduates in the U.S. with personalized job applications, 
              ATS-optimized resumes, and career guidance. Transform your job search today.
            </p>
            
            {/* Success Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">500+</div>
                <div className="text-sm text-gray-600">Success Stories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">25</div>
                <div className="text-sm text-gray-600">Daily Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
                <div className="text-sm text-gray-600">Interview Rate</div>
              </div>
            </div>
            
            {/* CTA Button */}
            <a
              href="https://apply-wizz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              🚀 Start Your Success Journey
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://apply-wizz.com/how-it-works" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  How It Works
                </a>
              </li>
              <li>
                <a href="https://apply-wizz.com/success-stories" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="https://apply-wizz.com/pricing" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Pricing
                </a>
              </li>
              <li>
                <a href="https://apply-wizz.com/faq" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-6">Connect with Us</h4>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-1">Email</div>
                <a 
                  href="mailto:hello@apply-wizz.com" 
                  className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  hello@apply-wizz.com
                </a>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-1">Support</div>
                <a 
                  href="https://apply-wizz.com/contact" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  Get Help
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-4">Follow Us</div>
              <div className="flex gap-3">
                <a 
                  href="https://linkedin.com/company/apply-wizz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all duration-200 hover:scale-110 shadow-md"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://twitter.com/apply_wizz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-black transition-all duration-200 hover:scale-110 shadow-md"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com/apply.wizz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center hover:from-pink-600 hover:to-purple-700 transition-all duration-200 hover:scale-110 shadow-md"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348 0-1.297 1.051-2.348 2.348-2.348 1.297 0 2.348 1.051 2.348 2.348 0 1.297-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348 0-1.297 1.051-2.348 2.348-2.348 1.297 0 2.348 1.051 2.348 2.348 0 1.297-1.051 2.348-2.348 2.348z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © 2024 Apply Wizz. All rights reserved. | 
              <a href="https://apply-wizz.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors ml-1">
                Privacy Policy
              </a> | 
              <a href="https://apply-wizz.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors ml-1">
                Terms of Service
              </a>
            </div>
            <div className="text-sm text-gray-500">
              Made with ❤️ for your career success
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};