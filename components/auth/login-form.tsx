"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { useLoginForm } from "@/components/auth/auth-utils";

export default function LoginForm() {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    isLoading, 
    error, 
    handleSubmit 
  } = useLoginForm();
  
  return (
    <div className="w-full max-w-md">
      <motion.div 
        className="mb-8 text-left"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-black">
          Welcome to <span className="text-accenture bg-gradient-to-r from-accenture to-accenture-dark bg-clip-text text-transparent">Accenture</span>
        </h1>
        <p className="text-gray-700 text-lg">
          Sign in to access your account
        </p>
      </motion.div>
      
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-red-50 text-red-700 flex items-center gap-2 shadow-sm"
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}
        
        <motion.div 
          className="space-y-2 text-left"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${focusedField === 'email' ? 'text-[#A100FF]' : 'text-gray-400'}`}>
              <Mail className="h-5 w-5" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className="focus-accenture pl-10 w-full px-4 py-3.5 border border-gray-200 rounded-lg transition-all shadow-sm text-black hover:border-gray-300 focus:shadow-md focus:outline-none"
              placeholder="your@email.com"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="space-y-2 text-left"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <motion.a 
              href="#" 
              className="text-sm font-medium text-[#A100FF] hover:text-[#8c00d9]"
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              Forgot password?
            </motion.a>
          </div>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${focusedField === 'password' ? 'text-[#A100FF]' : 'text-gray-400'}`}>
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className="focus-accenture pl-10 w-full px-4 py-3.5 border border-gray-200 rounded-lg transition-all shadow-sm text-black hover:border-gray-300 focus:shadow-md focus:outline-none"
              placeholder="••••••••"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center text-left"
          whileHover={{ scale: 1.02, x: 2 }}
          transition={{ duration: 0.2 }}
        >
          <input
            id="remember_me"
            name="remember_me"
            type="checkbox"
            className="h-4 w-4 text-[#A100FF] focus:ring-[#A100FF] border-gray-300 rounded focus:ring-offset-0 focus:outline-none"
          />
          <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </motion.div>
        
        <motion.button
          type="submit"
          className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-md text-white bg-accenture hover:bg-accenture-dark focus:outline-none transition-all relative overflow-hidden group"
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0 10px 15px -3px rgba(161, 0, 255, 0.2), 0 4px 6px -2px rgba(161, 0, 255, 0.1)" 
          }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          <span className="absolute right-full w-12 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:translate-x-96"></span>
          
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-b-transparent border-white"></div>
          ) : (
            <span className="flex items-center font-medium">
              Sign in
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </motion.button>
        
        <motion.div
          className="text-left text-gray-600 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p>Need access? <a href="#" className="text-[#A100FF] hover:underline font-medium">Request access</a></p>
        </motion.div>
      </motion.form>
    </div>
  );
}
