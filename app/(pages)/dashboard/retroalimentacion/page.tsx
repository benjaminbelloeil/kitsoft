"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@/utils/supabase/client';
import { getUserCompleteProfile } from '@/utils/database/client/profileSync';
import { getUserFeedbackEnhanced, getFeedbackStats, type EnhancedFeedbackItem, type FeedbackStats } from '@/utils/database/client/feedbackSync';
import { userData as staticUserData } from "@/app/lib/data";
import { Star, Award, ThumbsUp, Calendar } from "lucide-react";
import FeedbackSkeleton from "@/components/feedback/FeedbackSkeleton";
import FeedbackHeader from "@/components/feedback/FeedbackHeader";
import StatsRow from "@/components/feedback/StatsRow";
import FeedbackList from "@/components/feedback/FeedbackList";
import CompetencyChart from "@/components/feedback/CompetencyChart";

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
        {/* Header */}
        <FeedbackHeader 
          avgRating={avgRating}
          getCurrentPeriod={getCurrentPeriod}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Stats row */}
          <StatsRow formattedStats={formattedStats} />
          
          {/* Main content area */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {/* Feedback list */}
            <FeedbackList 
              feedbackItems={feedbackItems}
              currentItems={currentItems}
              currentPage={currentPage}
              totalPages={totalPages}
              formatDate={formatDate}
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
              handlePageClick={handlePageClick}
            />
            
            {/* Competency chart */}
            <CompetencyChart 
              skillRatings={skillRatings}
              generalAverage={generalAverage}
              avgRating={avgRating}
              feedbackItemsLength={feedbackItems.length}
              strength={strength}
              improvement={improvement}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
