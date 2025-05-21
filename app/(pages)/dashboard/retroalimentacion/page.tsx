"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import styles from './page.module.css';
import { userData as staticUserData } from "@/app/lib/data";
import { feedbackData, feedbackStats, feedbackRecipients } from "@/app/lib/data";
import { Star, Award, ThumbsUp, Calendar, TrendingUp, TrendingDown, User, Send, CheckCircle, MessageSquare, Clock } from "lucide-react";
import { FiStar } from "react-icons/fi";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getUserCompleteProfile } from "@/utils/database/client/profileSync";
import FeedbackSkeleton from "@/components/feedback/FeedbackSkeleton";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [userData, setUserData] = useState(staticUserData);
  const [loading, setLoading] = useState(true);
  const feedbackItems = feedbackData;

  const avgRating = parseFloat(
    (feedbackItems.reduce((sum, item) => sum + item.rating, 0) / feedbackItems.length).toFixed(1)
  ) || 4.5;

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(cat => cat !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  // Submit feedback
  const handleSubmitFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      recipient: selectedRecipient,
      rating,
      categories,
      message
    });

    setSelectedRecipient("");
    setRating(0);
    setCategories([]);
    setMessage("");
  };

  // Format stats
  const formattedStats = feedbackStats.map(stat => {
    let icon;
    switch (stat.title) {
      case "Promedio General":
        icon = <Star className="h-5 w-5 text-white" />;
        break;
      case "Calidad de Código":
        icon = <Award className="h-5 w-5 text-white" />;
        break;
      case "Colaboración":
        icon = <ThumbsUp className="h-5 w-5 text-white" />;
        break;
      default:
        icon = <Star className="h-5 w-5 text-white" />;
    }

    let bgGradient;
    switch (stat.color) {
      case "blue":
        bgGradient = "bg-blue-500";
        break;
      case "indigo":
        bgGradient = "bg-indigo-500";
        break;
      case "cyan":
        bgGradient = "bg-cyan-500";
        break;
      case "emerald":
        bgGradient = "bg-emerald-500";
        break;
      default:
        bgGradient = "bg-gray-500";
    }

    return {
      ...stat,
      icon,
      bgGradient
    };
  });

  // Load user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const profileData = await getUserCompleteProfile(user.id);
          if (profileData) {
            setUserData({
              ...staticUserData,
              name: `${profileData.Nombre || ''} ${profileData.Apellido || ''}`.trim() || staticUserData.name,
              title: profileData.Titulo || staticUserData.title
            });
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) return <FeedbackSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* La UI permanece igual */}
    </div>
  );
}
