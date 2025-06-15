import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Header from '../components/header'
import { useSelector } from 'react-redux'

const Home = () => {

  const { userInfo, user } = useSelector((state) => state.auth)


  return (
    <>
      <Header />
      {user ? (
        <div className="min-h-screen bg-gray-800 text-white px-4 py-12 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <h1 className="text-4xl font-bold text-cyan-400 mb-4">Welcome to DevCraft!</h1>
                <p className="text-gray-300 mb-6 text-lg">Your development workspace is ready. Start building your next amazing project.</p>
                <NavLink 
                  to="/projects" 
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 py-3 rounded-lg transition-colors inline-flex items-center"
                >
                  Go to Your Projects
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </NavLink>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img src="../../../public/logo1.svg" alt="DevCraft Logo" className="max-w-full h-auto max-h-64" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 ">
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-cyan-400 transition-colors">
                <h2 className="text-xl font-bold text-cyan-400 mb-2">Useful sources</h2>
                <p className="text-gray-300 mb-4">Store your helpful resources to improve your development.</p>
                <NavLink to="/useful-sources" className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center">
                  View sources
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </NavLink>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-cyan-400 transition-colors">
                <h2 className="text-xl font-bold text-cyan-400 mb-2">Browse Ideas</h2>
                <p className="text-gray-300 mb-4">Explore your project ideas and get inspired for your next build.</p>
                <NavLink to="/ideas" className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center">
                  Explore Ideas
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </NavLink>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-cyan-400 transition-colors">
                <h2 className="text-xl font-bold text-cyan-400 mb-2">Code Fragments</h2>
                <p className="text-gray-300 mb-4">Organize useful code snippets to accelerate your development.</p>
                <NavLink to="/code-fragments" className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center">
                  View Fragments
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </NavLink>
              </div>
            </div>
            
            <div className="mt-12 bg-gray-700 p-8 rounded-lg border border-gray-600 text-center hover:border-cyan-400 transition-colors">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Ready to boost your development workflow?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Explore powerful tools, helpful resources, and a vibrant community—everything you need to bring your ideas to life.</p>
              <NavLink 
                to="/learn-more" 
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 py-3 rounded-lg transition-colors inline-block"
              >
                Learn more
              </NavLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-800 text-white px-4 py-12 md:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <h1 className="text-4xl font-bold text-cyan-400 mb-4">Welcome to DevCraft</h1>
                <p className="text-gray-300 mb-6 text-lg">The ultimate platform for developers to organize projects, store code fragments, and explore new ideas.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <NavLink 
                    to="/signup" 
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 py-3 rounded-lg transition-colors text-center"
                  >
                    Create Account
                  </NavLink>
                  <NavLink 
                    to="/login" 
                    className="bg-gray-700 hover:bg-gray-600 text-cyan-400 font-bold px-6 py-3 rounded-lg border border-cyan-400 transition-colors text-center"
                  >
                    Log In
                  </NavLink>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img src="../../../public/logo1.svg" alt="DevCraft Logo" className="max-w-full h-auto max-h-64" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-cyan-400">
                <h2 className="text-xl font-bold text-cyan-400 mb-2">Organize Projects</h2>
                <p className="text-gray-300">Keep all your development projects in one place with powerful organization tools. Work with friends and devolop your skils!</p>
                <NavLink to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center mt-2">
      Get Started
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </NavLink>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-cyan-400">
                <h2 className="text-xl font-bold text-cyan-400 mb-2">Store Code Fragments</h2>
                <p className="text-gray-300">Save and categorize useful code snippets for easy access when you need them.</p>
                <NavLink to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center mt-2">
      Get Started
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </NavLink>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-cyan-400">
                <h2 className="text-xl font-bold text-cyan-400 mb-2">Discover Ideas</h2>
                <p className="text-gray-300">Browse through project ideas and resources to inspire your next development journey.</p>
                <NavLink to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center mt-2">
      Get Started
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </NavLink>
              </div>
            </div>
            
            <div className="mt-12 bg-gray-700 p-8 rounded-lg border border-gray-600 text-center hover:border-cyan-400">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Ready to boost your development workflow?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Explore powerful tools, helpful resources, and a vibrant community—everything you need to bring your ideas to life.</p>
              <NavLink 
                to="/learn-more" 
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 py-3 rounded-lg transition-colors inline-block"
              >
                Learn more
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Home