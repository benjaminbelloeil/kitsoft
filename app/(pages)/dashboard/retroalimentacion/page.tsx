"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@/utils/supabase/client';
import { getUserCompleteProfile } from '@/utils/database/client/profileSync';
import { getUserFeedbackEnhanced, getFeedbackStats, type EnhancedFeedbackItem, type FeedbackStats } from '@/utils/database/client/feedbackSync';
import { userData as staticUserData } from "@/app/lib/data";
import { Star, Award, ThumbsUp, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { FiStar } from "react-icons/fi";
import FeedbackSkeleton from "@/components/feedback/FeedbackSkeleton";
import UserAvatar from "@/components/feedback/UserAvatar";

export default function FeedbackPage() {
  const [loading, setLoading] = useState(true);
  const [, setUserData] = useState(staticUserData);
  const [feedbackItems, setFeedbackItems] = useState<EnhancedFeedbackItem[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Always show exactly 4 cards

  // Calculate rating average from category stats (matches pentagon chart)
  const avgRating = feedbackStats.length > 0 
    ? parseFloat((feedbackStats.reduce((sum, stat) => sum + parseFloat(stat.value), 0) / feedbackStats.length).toFixed(1))
    : 0;

  // Default stats when no feedback is available
  const defaultStats = [
    { title: "Comunicación", value: "0.0", trend: "0.0", color: "blue" },
    { title: "Calidad", value: "0.0", trend: "0.0", color: "indigo" },
    { title: "Colaboración", value: "0.0", trend: "0.0", color: "cyan" },
    { title: "Cumplimiento", value: "0.0", trend: "0.0", color: "emerald" }
  ];

  // Get current stats or use defaults
  const currentStats = feedbackStats.length > 0 ? feedbackStats : defaultStats;

  // Convert feedback stats to expected format with icons
  const formattedStats = currentStats.map(stat => {
    let icon;
    switch(stat.title) {
      case "Comunicación":
        icon = <Star className="h-5 w-5 text-white" />;
        break;
      case "Calidad":
        icon = <Award className="h-5 w-5 text-white" />;
        break;
      case "Colaboración":
        icon = <ThumbsUp className="h-5 w-5 text-white" />;
        break;
      case "Cumplimiento":
        icon = <Calendar className="h-5 w-5 text-white" />;
        break;
      default:
        icon = <Star className="h-5 w-5 text-white" />;
    }
    
    return {
      ...stat,
      icon
    };
  });

  // Calculate strength (highest scoring) and improvement (lowest scoring) categories
  // Only show when there are actual feedback scores (not 0)
  const getStrengthAndImprovement = () => {
    if (feedbackStats.length === 0) {
      return { strength: null, improvement: null };
    }

    // Filter out categories with 0 scores
    const nonZeroStats = feedbackStats.filter(stat => parseFloat(stat.value) > 0);
    
    if (nonZeroStats.length === 0) {
      return { strength: null, improvement: null };
    }

    // Find highest and lowest scoring categories
    const sortedStats = [...nonZeroStats].sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
    const strength = sortedStats[0];
    const improvement = sortedStats[sortedStats.length - 1];

    // Only show improvement if it's different from strength (i.e., we have multiple categories)
    return {
      strength: strength,
      improvement: sortedStats.length > 1 ? improvement : null
    };
  };

  const { strength, improvement } = getStrengthAndImprovement();

  // Calculate skill ratings for pentagon chart (always 5 points)
  const mainSkills = [
    "Comunicación",
    "Calidad", 
    "Colaboración",
    "Cumplimiento"
  ];
  
  const skillRatings = mainSkills.map(skillName => {
    const stat = feedbackStats.find(s => s.title === skillName);
    return {
      name: skillName,
      value: stat ? parseFloat(stat.value) : 0
    };
  });

  // Add "General" as the average of the 4 main areas
  const generalAverage = skillRatings.length > 0 
    ? skillRatings.reduce((sum, skill) => sum + skill.value, 0) / skillRatings.length 
    : 0;
  
  skillRatings.push({
    name: "General",
    value: parseFloat(generalAverage.toFixed(1))
  });

  // Function to determine color based on average score
  const getCompetencyColor = (average: number) => {
    if (average === 0) {
      return {
        fill: "rgba(156, 163, 175, 0.10)", // Gray tint
        stroke: "#9CA3AF", // Gray stroke
        pointFill: "#9CA3AF" // Gray points
      };
    } else if (average >= 4.0) {
      return {
        fill: "rgba(16, 185, 129, 0.10)", // Green tint
        stroke: "#10B981", // Green stroke
        pointFill: "#10B981" // Green points
      };
    } else if (average >= 3.0) {
      return {
        fill: "rgba(245, 158, 11, 0.10)", // Yellow tint
        stroke: "#F59E0B", // Yellow stroke
        pointFill: "#F59E0B" // Yellow points
      };
    } else {
      return {
        fill: "rgba(239, 68, 68, 0.10)", // Red tint
        stroke: "#EF4444", // Red stroke
        pointFill: "#EF4444" // Red points
      };
    }
  };

  const competencyColors = getCompetencyColor(generalAverage);

  // Function to get color classes for text and background based on score
  const getColorClasses = (average: number) => {
    if (average === 0) {
      return {
        text: "text-gray-600",
        bg: "bg-gray-500"
      };
    } else if (average >= 4.0) {
      return {
        text: "text-green-600",
        bg: "bg-green-500"
      };
    } else if (average >= 3.0) {
      return {
        text: "text-yellow-600", 
        bg: "bg-yellow-500"
      };
    } else {
      return {
        text: "text-red-600",
        bg: "bg-red-500"
      };
    }
  };

  // Fetch user data and feedback when component mounts
  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createClient();
        // Get current authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get complete profile data for the user
          const profileData = await getUserCompleteProfile(user.id);
          
          if (profileData) {
            // Update user data with fetched profile
            setUserData({
              ...staticUserData, // Keep static data for other properties
              name: `${profileData.Nombre || ''} ${profileData.Apellido || ''}`.trim() || "Usuario",
              title: profileData.Titulo || "Completar perfil"
            });
          } else {
            // New user - set appropriate fallback values
            setUserData({
              ...staticUserData, // Keep static data for other properties
              name: "Usuario",
              title: "Completar perfil"
            });
          }

          // Fetch real feedback data
          try {
            const realFeedback = await getUserFeedbackEnhanced(user.id);
            setFeedbackItems(realFeedback);
            
            const realStats = await getFeedbackStats(user.id);
            setFeedbackStats(realStats);
          } catch (feedbackError) {
            console.error("Error fetching feedback data:", feedbackError);
            // Keep empty arrays if there's an error
            setFeedbackItems([]);
            setFeedbackStats([]);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    }
    
    fetchUserData();
  }, []);

  // Helper function to format dates
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Function to get current quarter and year
  const getCurrentPeriod = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11, so add 1
    
    let quarter;
    if (currentMonth >= 1 && currentMonth <= 3) {
      quarter = 'Q1';
    } else if (currentMonth >= 4 && currentMonth <= 6) {
      quarter = 'Q2';
    } else if (currentMonth >= 7 && currentMonth <= 9) {
      quarter = 'Q3';
    } else {
      quarter = 'Q4';
    }
    
    return `${quarter} ${currentYear}`;
  };

  // Calculate pagination
  const totalPages = Math.ceil(feedbackItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = feedbackItems.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <FeedbackSkeleton />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gray-50 py-6"
      >
        {/* Header card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8"
        >
          <motion.div 
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden"
            whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-6 justify-between">
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div 
                    className="bg-gradient-to-br from-[#A100FF20] to-[#A100FF10] p-3 rounded-lg mr-4 shadow-sm"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiStar size={24} className="text-[#A100FF]" />
                  </motion.div>
                  <div>
                    <motion.h1 
                      className="text-2xl font-bold text-black"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      Retroalimentación
                    </motion.h1>
                    <motion.p 
                      className="text-gray-600 mt-2 max-w-2xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      Este espacio permite compartir valoraciones con tu equipo para promover el crecimiento profesional.
                    </motion.p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col items-end"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div 
                    className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
                    whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-gray-600">Último periodo evaluado</p>
                    <p className="text-lg font-bold text-gray-900">{getCurrentPeriod()}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#A100FF20] text-[#A100FF] font-medium">
                        Promedio: {avgRating}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Stats row */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {formattedStats.map((stat, index) => {
              // Create a varied color scheme
              let bgColor;
              switch(index) {
                case 0: bgColor = "bg-[#3B82F6]"; break;
                case 1: bgColor = "bg-[#10B981]"; break;
                case 2: bgColor = "bg-[#F59E0B]"; break;
                case 3: bgColor = "bg-[#6366F1]"; break;
                default: bgColor = "bg-gray-500";
              }
              
              return (
                <motion.div 
                  key={index} 
                  className="bg-white rounded-lg p-3.5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                  whileHover={{ y: -2, scale: 1.02, boxShadow: "0 8px 12px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <div className={`${bgColor} p-2 rounded-md shadow-sm`}>
                      {stat.icon}
                    </div>
                    <div className="flex items-center">
                      {parseFloat(stat.trend) > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 text-green-600 mr-1" />
                      ) : parseFloat(stat.trend) < 0 ? (
                        <TrendingDown className="h-3.5 w-3.5 text-red-600 mr-1" />
                      ) : null}
                      <span className={parseFloat(stat.trend) > 0 
                        ? "text-xs font-medium text-green-600" 
                        : parseFloat(stat.trend) < 0 
                          ? "text-xs font-medium text-red-600" 
                          : "text-xs font-medium text-gray-500"
                      }>
                        {stat.trend !== "0.0" ? stat.trend : "="}
                      </span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-xs text-gray-600 truncate">{stat.title}</div>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* Main content area */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {/* Feedback list */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.div 
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col"
                whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="p-4 border-b border-gray-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div className="flex items-center">
                    <motion.div 
                      className="w-8 h-8 bg-gradient-to-br from-[#F59E0B10] to-[#F59E0B20] rounded-full flex items-center justify-center mr-3 shadow-sm border border-[#F59E0B10]"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Star className="w-4 h-4 text-[#F59E0B]" />
                    </motion.div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Retroalimentación recibida
                      </h2>
                      <p className="text-xs text-gray-500">
                        Feedback de tu equipo y supervisores
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex-1 flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  {feedbackItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 flex-1 min-h-[400px]">
                      <AnimatePresence mode="popLayout">
                        {currentItems.map((item, index) => (
                          <motion.div 
                            key={item.id} 
                            layout
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0, 
                              scale: 1,
                              transition: {
                                duration: 0.3,
                                delay: index * 0.05,
                                ease: [0.25, 0.46, 0.45, 0.94]
                              }
                            }}
                            exit={{ 
                              opacity: 0, 
                              y: -10, 
                              scale: 0.98,
                              transition: {
                                duration: 0.2,
                                ease: [0.25, 0.46, 0.45, 0.94]
                              }
                            }}
                            whileHover={{ 
                              y: -2, 
                              scale: 1.01,
                              transition: { duration: 0.2, ease: "easeOut" }
                            }}
                            className="h-[180px] p-3 hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group cursor-pointer flex flex-col"
                          >
                            <div className="flex justify-between items-start mb-2 flex-shrink-0">
                              <motion.div 
                                className="flex items-center"
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 + index * 0.02 }}
                              >
                                <motion.div 
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <UserAvatar 
                                    name={item.from.name}
                                    avatarUrl={item.from.avatar}
                                    size="md"
                                  />
                                </motion.div>
                                <div className="ml-2 min-w-0">
                                  <div className="text-xs font-medium text-gray-900 truncate">{item.from.name}</div>
                                  <div className="text-[10px] text-gray-500">{formatDate(item.date)}</div>
                                </div>
                              </motion.div>
                              
                              <div className="flex items-center bg-gray-100 rounded-md px-1.5 py-0.5 border border-gray-200 shadow-sm flex-shrink-0">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`h-2.5 w-2.5 ${
                                      i < Math.floor(item.rating) 
                                        ? "text-[#F59E0B] fill-[#F59E0B]" 
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-[10px] font-medium ml-1 text-gray-700">
                                  {item.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-2 flex-shrink-0">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-[#6366F110] text-[#6366F1] border border-[#6366F120] shadow-sm whitespace-nowrap overflow-hidden max-w-full text-ellipsis">
                                {item.category}
                              </span>
                              {item.project && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-[#10B98110] text-[#10B981] border border-[#10B98120] shadow-sm whitespace-nowrap overflow-hidden max-w-full text-ellipsis">
                                  {item.project}
                                </span>
                              )}
                            </div>
                            
                            <div className="bg-gray-50 rounded-md p-2 border border-gray-200 shadow-inner relative flex-1 overflow-hidden">
                              <p 
                                className="text-[10px] text-gray-600 leading-tight"
                                style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 4,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}
                              >
                                {item.message}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    // Show placeholder when no feedback available  
                    <div className="flex-1 flex items-center justify-center">
                      <motion.div 
                        className="text-center p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                      >
                        <FiStar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 text-xs">Los comentarios de tu equipo aparecerán aquí cuando recibas retroalimentación</p>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
                
                <div className="p-3 border-t border-gray-100 bg-[#F59E0B05] flex justify-center">
                  {totalPages > 1 && (
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <motion.button 
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="text-xs font-medium text-[#F59E0B] hover:text-[#EA580C] bg-white px-3 py-1.5 rounded-md border border-[#F59E0B20] hover:border-[#F59E0B40] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ←
                      </motion.button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <motion.button
                            key={page}
                            onClick={() => handlePageClick(page)}
                            className={`text-xs font-medium px-2 py-1.5 rounded-md border shadow-sm transition-all ${
                              currentPage === page
                                ? 'bg-[#F59E0B] text-white border-[#F59E0B]'
                                : 'text-[#F59E0B] hover:text-[#EA580C] bg-white border-[#F59E0B20] hover:border-[#F59E0B40]'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {page}
                          </motion.button>
                        ))}
                      </div>
                      
                      <motion.button 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="text-xs font-medium text-[#F59E0B] hover:text-[#EA580C] bg-white px-3 py-1.5 rounded-md border border-[#F59E0B20] hover:border-[#F59E0B40] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        →
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
            
            {/* Competency chart */}
            <motion.div 
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.div 
                className="bg-white rounded-lg shadow-sm border border-gray-100 h-full overflow-hidden flex flex-col"
                whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#10B98110] to-[#10B98120] rounded-full flex items-center justify-center mr-3 shadow-sm border border-[#10B98110]">
                      <TrendingUp className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Evolución de competencias
                      </h2>
                      <p className="text-xs text-gray-500">
                        Seguimiento de tu progreso profesional
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-grow flex items-center justify-center p-4 bg-[#10B98102]">
                  <div className="relative h-[300px] w-[300px]">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                      {/* Grid pentagons */}
                      {[1, 2, 3, 4, 5].map((level) => {
                        const pentagonPoints = Array.from({ length: 5 }, (_, i) => {
                          const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
                          const radius = level * 8.5;
                          const x = 50 + radius * Math.cos(angle);
                          const y = 50 + radius * Math.sin(angle);
                          return `${x},${y}`;
                        }).join(' ');
                        
                        return (
                          <polygon
                            key={level}
                            points={pentagonPoints}
                            fill="none" 
                            stroke={level === 5 ? '#e5e7eb' : `rgba(243, 244, 246, ${level * 0.15})`}
                            strokeWidth={level === 5 ? 1.5 : 1} 
                            strokeDasharray={level === 5 ? "" : "2,2"} 
                          />
                        );
                      })}
                      
                      {/* Axis lines */}
                      {skillRatings.map((_, i) => {
                        const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                        return (
                          <line
                            key={i}
                            x1="50"
                            y1="50"
                            x2={50 + 42.5 * Math.cos(angle)}
                            y2={50 + 42.5 * Math.sin(angle)}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                          />
                        );
                      })}
                      
                      {/* Data polygon */}
                      <polygon
                        points={
                          skillRatings.map((skill, i) => {
                            const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                            const radius = (skill.value / 5) * 42.5;
                            return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
                          }).join(' ')
                        }
                        fill={competencyColors.fill}
                        stroke={competencyColors.stroke}
                        strokeWidth="1.5"
                      />
                      
                      {/* Data points */}
                      {skillRatings.map((skill, i) => {
                        const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                        const radius = (skill.value / 5) * 42.5;
                        return (
                          <g key={i}>
                            <circle
                              cx={50 + radius * Math.cos(angle)}
                              cy={50 + radius * Math.sin(angle)}
                              r="2"
                              fill={competencyColors.pointFill}
                              stroke="#ffffff"
                              strokeWidth="1.5"
                            />
                            {/* Skill value label */}
                            <text
                              x={50 + (radius + 3) * Math.cos(angle)}
                              y={50 + (radius + 3) * Math.sin(angle)}
                              fontSize="4"
                              fill="#666666"
                              fontWeight="bold"
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              {skill.value}
                            </text>
                          </g>
                        );
                      })}
                      
                      {/* Central point */}
                      <circle cx="50" cy="50" r="2.5" fill={competencyColors.pointFill} />
                    </svg>
                    
                    {/* Skill labels */}
                    {skillRatings.map((skill, i) => {
                      const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                      // Adjust radius based on specific skills for larger pentagon
                      let radius = 50; // Default position (increased from 48)
                      
                      // Specific adjustments for each skill
                      if (skill.name === 'Comunicación') radius = 47; // Closer to pentagon (increased from 45)
                      else if (skill.name === 'Colaboración') radius = 52; // Slightly more space (increased from 50)
                      else if (skill.name === 'Cumplimiento') radius = 50; // Default (increased from 48)
                      else if (skill.name === 'Calidad') radius = 56; // Further out (increased from 54)
                      else if (skill.name === 'General') radius = 56; // Further out (increased from 54)
                      
                      const x = 50 + radius * Math.cos(angle);
                      const y = 50 + radius * Math.sin(angle);
                      
                      return (
                        <div
                          key={i}
                          className="absolute text-[9px] font-medium text-gray-700 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 px-2 py-0.5 rounded border border-gray-100 shadow-sm"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            minWidth: skill.name === 'Comunicación' ? '70px' : '55px',
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {skill.name}
                        </div>
                      );
                    })}
                    
                    {/* Center score */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`${getColorClasses(generalAverage).bg} rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg`}>
                        <div className="text-2xl font-bold text-white leading-none mt-0.5">{avgRating}</div>
                        <div className="text-[8px] uppercase tracking-wider text-white opacity-80">Promedio</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 p-3 bg-[#10B98105] mt-auto">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="text-xs text-gray-600 flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 bg-[#10B981] rounded-full"></span>
                      <span className="font-medium">{feedbackItems.length}</span> evaluaciones
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {strength && (
                        <span className="bg-white text-[#10B981] text-xs px-2 py-0.5 rounded-full font-medium border border-[#10B98120]">
                          Fortaleza: {strength.title}
                        </span>
                      )}
                      {improvement && (
                        <span className="bg-white text-[#F59E0B] text-xs px-2 py-0.5 rounded-full font-medium border border-[#F59E0B20]">
                          Mejora: {improvement.title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
