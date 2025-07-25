import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiMail, FiPhone, FiMapPin, FiLinkedin, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                  <FiBook className="h-7 w-7 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  Articademy
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Empowering careers through education and opportunity. Connect with leading companies and advance your professional journey with our comprehensive platform.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-br from-slate-700 to-slate-600 p-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  <FiLinkedin className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-br from-slate-700 to-slate-600 p-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  <FiTwitter className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-br from-slate-700 to-slate-600 p-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  <FiFacebook className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Home', to: '/' },
                  { name: 'Browse Jobs', to: '/jobs' },
                  { name: 'About Us', to: '/about' },
                  { name: 'Contact', to: '/contact' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to} 
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Popular Categories</h3>
              <ul className="space-y-3">
                {[
                  'Software Development',
                  'Data Science & AI',
                  'Digital Marketing',
                  'UI/UX Design',
                  'Product Management',
                  'Cybersecurity'
                ].map((category, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Get in Touch</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-4 group">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                    <FiMapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 group-hover:text-white transition-colors">
                      123 Education Boulevard<br />
                      Innovation District, Tech City
                    </p>
                  </div>
                </li>
                <li className="flex items-center space-x-4 group">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                    <FiPhone className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    +1 (555) 123-4567
                  </span>
                </li>
                <li className="flex items-center space-x-4 group">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                    <FiMail className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    hello@articademy.com
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 bg-gradient-to-r from-slate-900/80 to-indigo-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                &copy; 2024 Articademy. All rights reserved. Built with ❤️ for career growth.
              </p>
              <div className="flex flex-wrap justify-center md:justify-end gap-6">
                {[
                  'Privacy Policy',
                  'Terms of Service',
                  'Cookie Policy',
                  'Security'
                ].map((link, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200 relative group"
                  >
                    {link}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;