"use client";

import { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';
import { getUserCompleteProfile } from '@/utils/database/client/profileSync';
import { userData as staticUserData } from "@/app/lib/data";
import { feedbackData, feedbackStats } from "@/app/lib/data";
import { Star, Award, ThumbsUp, Calendar, TrendingUp, TrendingDown, User } from "lucide-react";
import { FiStar } from "react-icons/fi";

// Feedback components
import FeedbackSkeleton from "@/components/feedback/FeedbackSkeleton";

export default function FeedbackPage() {
  const [loading, setLoading] = useState(true);
  const [, setUserData] = useState(staticUserData);
  const [feedbackItems] = useState(feedbackData);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  // Calculate rating average from data
  const avgRating = parseFloat((feedbackItems.reduce((sum, item) => sum + item.rating, 0) / feedbackItems.length).toFixed(1)) || 4.5;

  // Convert feedback stats to expected format with icons
  const formattedStats = feedbackStats.map(stat => {
    let icon;
    switch(stat.title) {
      case "Promedio General":
        icon = <Star className="h-5 w-5 text-white" />;
        break;
      case "Calidad de Código":
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
    
    // Map color strings to actual gradient values for icon backgrounds
    let bgGradient;
    switch(stat.color) {
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

  // Example skill ratings for radar chart
  const skillRatings = [
    { name: "Calidad", value: 4.8 },
    { name: "Colaboración", value: 4.6 },
    { name: "Comunicación", value: 4.5 },
    { name: "Cumplimiento", value: 4.2 },
    { name: "Problemas", value: 4.7 }
  ];

  // Fetch user data when component mounts
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

  // Helper function to format dates
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return <FeedbackSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* Header card with purple icon but no decorative bubbles */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-6 justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-[#A100FF20] to-[#A100FF10] p-3 rounded-lg mr-4 shadow-sm">
                  <FiStar size={24} className="text-[#A100FF]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-black">
                    Retroalimentación
                  </h1>
                  <p className="text-gray-600 mt-2 max-w-2xl">
                    Este espacio permite compartir valoraciones con tu equipo para promover el crecimiento profesional. El feedback constructivo es clave para mejorar nuestro trabajo conjunto.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Último periodo evaluado</p>
                  <p className="text-lg font-bold text-gray-900">Q1 2023</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#A100FF20] text-[#A100FF] font-medium">
                      Promedio: {avgRating}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 font-medium">
                      Participación: 92%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats row with updated colors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {formattedStats.map((stat, index) => {
            // Create a varied color scheme
            let bgColor;
            switch(index) {
              case 0: bgColor = "bg-[#3B82F6]"; break; // Blue
              case 1: bgColor = "bg-[#10B981]"; break; // Green
              case 2: bgColor = "bg-[#F59E0B]"; break; // Amber
              case 3: bgColor = "bg-[#6366F1]"; break; // Indigo
              default: bgColor = "bg-gray-500";
            }
            
            return (
              <div 
                key={index} 
                className="bg-white rounded-lg p-3.5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
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
              </div>
            );
          })}
        </div>
        
        {/* Two column layout: Feedback list on left, Competency chart on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* Left column: Feedback list */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden h-full">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#F59E0B10] to-[#F59E0B20] rounded-full flex items-center justify-center mr-3 shadow-sm border border-[#F59E0B10]">
                    <Star className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Retroalimentación recibida
                    </h2>
                    <p className="text-xs text-gray-500">
                      Feedback de tu equipo y supervisores
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
                {feedbackItems.slice(0, 4).map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      {/* User icon */}
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden">
                          <User className="h-4.5 w-4.5 text-gray-600" />
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">{item.from.name}</div>
                          <div className="text-[11px] text-gray-500">{formatDate(item.date)}</div>
                        </div>
                      </div>
                      
                      {/* Rating display with updated colors */}
                      <div className="flex items-center bg-gray-100 rounded-md px-2 py-1 border border-gray-200 shadow-sm">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(item.rating) 
                                ? "text-[#F59E0B] fill-[#F59E0B]" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-medium ml-1 text-gray-700">
                          {item.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Category tags with updated colors */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#6366F110] text-[#6366F1] border border-[#6366F120] shadow-sm whitespace-nowrap overflow-hidden max-w-full text-ellipsis">
                        {item.category}
                      </span>
                      {item.project && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#10B98110] text-[#10B981] border border-[#10B98120] shadow-sm whitespace-nowrap overflow-hidden max-w-full text-ellipsis">
                          {item.project}
                        </span>
                      )}
                    </div>
                    
                    {/* Message with updated colors */}
                    <div className="bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner relative">
                      <p className={`text-xs text-gray-600 ${expandedMessages.has(item.id) ? '' : 'line-clamp-3'}`}>
                        {item.message}
                      </p>
                      
                      {item.message.length > 150 && (
                        <button 
                          onClick={() => {
                            const newExpanded = new Set(expandedMessages);
                            if (expandedMessages.has(item.id)) {
                              newExpanded.delete(item.id);
                            } else {
                              newExpanded.add(item.id);
                            }
                            setExpandedMessages(newExpanded);
                          }}
                          className="absolute bottom-1.5 right-1.5 text-[10px] font-medium text-[#3B82F6] hover:text-[#2563EB] bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {expandedMessages.has(item.id) ? 'Leer menos' : 'Leer más'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Footer with updated colors */}
              <div className="p-3 border-t border-gray-100 bg-[#3B82F605] flex justify-center mt-auto">
                <button className="text-xs font-medium text-[#3B82F6] hover:text-[#2563EB] bg-white px-4 py-2 rounded-md border border-[#3B82F620] hover:border-[#3B82F640] shadow-sm transition-all flex items-center gap-1.5 hover:shadow">
                  <span>Ver todas las retroalimentaciones</span>
                  <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Right column: Competency chart */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full overflow-hidden flex flex-col">
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
              
              {/* Radar chart with updated colors */}
              <div className="flex-grow flex items-center justify-center p-4 bg-[#10B98102]">
                <div className="relative h-[250px] w-[250px]">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                    {/* Grid circles - keep the same */}
                    {[1, 2, 3, 4, 5].map((level) => (
                      <circle 
                        key={level}
                        cx="50" 
                        cy="50" 
                        r={level * 8} 
                        fill="none" 
                        stroke={level === 5 ? '#e5e7eb' : `rgba(243, 244, 246, ${level * 0.15})`}
                        strokeWidth={level === 5 ? 1.5 : 1} 
                        strokeDasharray={level === 5 ? "" : "2,2"} 
                      />
                    ))}
                    
                    {/* Axis lines - keep the same */}
                    {skillRatings.map((_, i) => {
                      const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                      return (
                        <line
                          key={i}
                          x1="50"
                          y1="50"
                          x2={50 + 40 * Math.cos(angle)}
                          y2={50 + 40 * Math.sin(angle)}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      );
                    })}
                    
                    {/* Data polygon with updated colors */}
                    <polygon
                      points={
                        skillRatings.map((skill, i) => {
                          const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                          const radius = (skill.value / 5) * 40;
                          return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
                        }).join(' ')
                      }
                      fill="rgba(16, 185, 129, 0.10)" // Green tint
                      stroke="#10B981" // Green stroke
                      strokeWidth="1.5"
                    />
                    
                    {/* Data points with updated colors */}
                    {skillRatings.map((skill, i) => {
                      const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                      const radius = (skill.value / 5) * 40;
                      return (
                        <g key={i}>
                          <circle
                            cx={50 + radius * Math.cos(angle)}
                            cy={50 + radius * Math.sin(angle)}
                            r="2"
                            fill="#10B981" // Green fill
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
                    
                    {/* Central point with updated color */}
                    <circle cx="50" cy="50" r="2.5" fill="#10B981" />
                  </svg>
                  
                  {/* Skill labels */}
                  {skillRatings.map((skill, i) => {
                    const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                    const radius = 48;
                    const x = 50 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle);
                    
                    return (
                      <div
                        key={i}
                        className="absolute text-[9px] font-medium text-gray-700 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-85 px-1.5 py-0.5 rounded border border-gray-100 shadow-sm"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          maxWidth: '60px',
                          textAlign: 'center'
                        }}
                      >
                        {skill.name}
                      </div>
                    );
                  })}
                  
                  {/* Center score with updated color */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-[#10B981] rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg">
                      <div className="text-2xl font-bold text-white leading-none mt-0.5">{avgRating}</div>
                      <div className="text-[8px] uppercase tracking-wider text-white opacity-80">Promedio</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom summary bar with updated colors */}
              <div className="border-t border-gray-100 p-3 bg-[#10B98105] mt-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 bg-[#10B981] rounded-full"></span>
                    <span className="font-medium">{feedbackItems.length}</span> evaluaciones
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-white text-[#10B981] text-xs px-2 py-0.5 rounded-full font-medium border border-[#10B98120]">
                      Fortaleza: Calidad
                    </span>
                    <span className="bg-white text-[#F59E0B] text-xs px-2 py-0.5 rounded-full font-medium border border-[#F59E0B20]">
                      Mejora: Cumplimiento
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

