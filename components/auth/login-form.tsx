"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  UserPlus, 
  LogIn,
} from "lucide-react";

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Handle authentication logic here
  };

  return (
    <div className="w-full max-w-md">
      <motion.div 
        className="mb-10 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome to <span className="text-[#A100FF]">Accenture</span>
        </h1>
        <p className="text-gray-500">
          {isLogin ? "Sign in to access your account" : "Create an account to get started"}
        </p>
      </motion.div>
      
      <AnimatePresence mode="wait">
        <motion.form 
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#A100FF] focus:border-[#A100FF] transition"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#A100FF] focus:border-[#A100FF] transition"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#A100FF] focus:border-[#A100FF] transition"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-[#A100FF] focus:ring-[#A100FF] border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-[#A100FF] hover:text-[#8500D4]">
                  Forgot password?
                </a>
              </div>
            </div>
          )}
          
          <motion.button
            type="submit"
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#A100FF] hover:bg-[#8500D4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A100FF] transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-b-transparent border-white"></div>
            ) : (
              <>
                {isLogin ? (
                  <>
                    <LogIn className="h-5 w-5 mr-2" /> 
                    Sign in
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" /> 
                    Create account
                  </>
                )}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>
          
          <div className="mt-6 text-center">
            <motion.button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#A100FF] hover:text-[#8500D4] font-medium text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </motion.button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A100FF]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </motion.button>
              <motion.button
                type="button"
                className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A100FF]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
                Facebook
              </motion.button>
            </div>
          </div>
        </motion.form>
      </AnimatePresence>
    </div>
  );
}
