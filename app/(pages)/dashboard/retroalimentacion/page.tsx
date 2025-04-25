/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';
import { getUserCompleteProfile } from '@/utils/database/client/profileSync';
import { userData as staticUserData } from "@/app/lib/data";
import { feedbackData, feedbackStats, feedbackRecipients } from "@/app/lib/data";
import { Star, Award, ThumbsUp, Calendar, TrendingUp, TrendingDown, User, Send } from "lucide-react";

// Feedback components
import FeedbackSkeleton from "@/components/feedback/FeedbackSkeleton";

export default function FeedbackPage() {
  const [loading, setLoading] = useState(true);
  const [, setUserData] = useState(staticUserData);
  const [feedbackItems,] = useState(feedbackData);
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  // Calculate rating average from data
  const avgRating = parseFloat((feedbackItems.reduce((sum, item) => sum + item.rating, 0) / feedbackItems.length).toFixed(1)) || 4.5;

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to your backend in a real app
    console.log({
      recipient: selectedRecipient,
      rating,
      category,
      message
    });
    
    // Reset form
    setSelectedRecipient("");
    setRating(0);
    setCategory("");
    setMessage("");
    
    // Show success notification (you could add a toast component here)
    alert("Retroalimentación enviada con éxito!");
  };

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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page title with decorative elements */}
        <div className="flex items-center mb-6">
          <div className="h-6 w-1.5 bg-indigo-600 rounded-full mr-3"></div>
          <h1 className="text-2xl font-bold text-gray-900">Retroalimentación</h1>
        </div>
        
        {/* Stats row with improved styling */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {formattedStats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-3.5 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="flex justify-between items-center mb-1.5">
                <div className={`${stat.bgGradient} p-2 rounded-md shadow-sm`}>
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
          ))}
        </div>
        
        {/* Two column layout for feedback form and competency chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* Left column: Send feedback form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-transparent p-3.5 border-b border-gray-100">
                <h3 className="font-medium text-gray-800 flex items-center gap-2">
                  <span className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Send className="h-3 w-3 text-white" />
                  </span>
                  Enviar retroalimentación
                </h3>
              </div>
              
              <form onSubmit={handleSubmitFeedback} className="p-4 flex flex-col">
                {/* Improved recipient selector with active states */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center">
                    <span className="h-2 w-2 bg-indigo-400 mr-1.5 rounded-full"></span>
                    Seleccionar destinatario:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {feedbackRecipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        onClick={() => setSelectedRecipient(recipient.id)}
                        className={`flex items-center p-2 rounded-md border ${
                          selectedRecipient === recipient.id
                            ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-300" 
                            : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                        } cursor-pointer transition-all`}
                      >
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border border-gray-200">
                          <User className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="ml-2 overflow-hidden">
                          <p className="text-xs font-medium text-gray-800 truncate">{recipient.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{recipient.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Rating box with fixed height */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center">
                      <span className="h-2 w-2 bg-amber-400 mr-1.5 rounded-full"></span>
                      Valoración:
                    </label>
                    <div className="feedback-form-box bg-gradient-to-r from-gray-50 to-white rounded-md border border-gray-200 shadow-inner">
                      <div className="rating-box-top">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 mx-1.5 cursor-pointer transition-all ${
                              (hoverRating || rating) >= star 
                                ? "text-amber-400 fill-amber-400 scale-110" 
                                : "text-gray-300"
                            }`}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                          />
                        ))}
                      </div>
                      
                      <div className="rating-box-bottom text-xs font-medium text-gray-700">
                        {rating > 0 
                          ? `${rating}/5 - ${rating > 3 ? 'Excelente' : rating > 2 ? 'Bueno' : 'Regular'}`
                          : 'Selecciona una valoración'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Category selector with fixed height */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center">
                      <span className="h-2 w-2 bg-emerald-400 mr-1.5 rounded-full"></span>
                      Categoría:
                    </label>
                    <div className="feedback-form-box bg-gradient-to-r from-gray-50 to-white rounded-md border border-gray-200 shadow-inner">
                      <div className="category-box-top">
                        {["Colaboración", "Calidad", "Cumplimiento", "Comunicación"].map((cat) => (
                          <button
                            type="button"
                            key={cat}
                            className={`category-button px-2.5 py-1 text-xs rounded-full transition-all ${
                              category === cat
                                ? "bg-indigo-100 text-indigo-700 border border-indigo-300 shadow-sm" 
                                : "bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                            onClick={() => setCategory(cat)}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      
                      <div className="category-box-bottom text-xs font-medium text-gray-500">
                        {!category && 'Selecciona una categoría'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced message area with fixed height */}
                <div className="mb-5">
                  <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center">
                    <span className="h-2 w-2 bg-blue-400 mr-1.5 rounded-full"></span>
                    Mensaje:
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-[100px] rounded-md border border-gray-200 p-3 text-sm 
                              focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 resize-none
                              shadow-inner bg-gradient-to-r from-gray-50 to-white"
                    placeholder="Escribe tu retroalimentación detallada aquí..."
                  ></textarea>
                </div>
                
                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!selectedRecipient || !rating || !category || !message}
                  className={`w-full py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    selectedRecipient && rating && category && message
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md transform hover:-translate-y-0.5" 
                      : "bg-gray-200 cursor-not-allowed"
                  }`}
                  style={{color: 'white'}}
                >
                  <Send className="h-4 w-4 text-white" />
                  <span className="text-white">Enviar Retroalimentación</span>
                </button>
              </form>
            </div>
          </div>
          
          {/* Right column: Competency evolution chart */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-transparent p-3.5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-medium text-gray-800 flex items-center gap-2">
                  <span className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Award className="h-3 w-3 text-white" />
                  </span>
                  Evolución de competencias
                </h3>
                <div className="inline-flex rounded-md shadow-sm bg-white p-0.5 border border-gray-200">
                  {['3M', '6M', '12M'].map((period) => (
                    <button
                      key={period}
                      type="button"
                      className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                        (period === '3M' && selectedPeriod === '3m') ||
                        (period === '6M' && selectedPeriod === '6m') ||
                        (period === '12M' && selectedPeriod === '12m')
                          ? 'bg-indigo-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedPeriod(period.toLowerCase() as any)}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Enhanced radar chart with more visual appeal */}
              <div className="flex-grow flex items-center justify-center py-4">
                <div className="relative h-[180px] w-[180px]">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                    {/* Improved grid lines with gradient */}
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
                    
                    {/* Axis lines with enhanced styling */}
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
                    
                    {/* Enhanced data polygon with better gradient */}
                    <polygon
                      points={
                        skillRatings.map((skill, i) => {
                          const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                          const radius = (skill.value / 5) * 40;
                          return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
                        }).join(' ')
                      }
                      fill="url(#skillGradient)"
                      stroke="url(#lineGradient)"
                      strokeWidth="1.5"
                    />
                    
                    {/* Enhanced gradients */}
                    <defs>
                      <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(79, 70, 229, 0.25)" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.15)" />
                      </linearGradient>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                    
                    {/* Enhanced data points with glow effect */}
                    {skillRatings.map((skill, i) => {
                      const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                      const radius = (skill.value / 5) * 40;
                      return (
                        <g key={i}>
                          <circle
                            cx={50 + radius * Math.cos(angle)}
                            cy={50 + radius * Math.sin(angle)}
                            r="2"
                            fill="#4338ca"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            filter="url(#glow)"
                          />
                          {/* Skill value label with better positioning */}
                          <text
                            x={50 + (radius + 3) * Math.cos(angle)}
                            y={50 + (radius + 3) * Math.sin(angle)}
                            fontSize="4"
                            fill="#4338ca"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {skill.value}
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Glow filter for data points */}
                    <defs>
                      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feFlood floodColor="#4338ca" floodOpacity="0.3" result="color" />
                        <feComposite in="color" in2="blur" operator="in" result="shadowBlur" />
                        <feComposite in="SourceGraphic" in2="shadowBlur" operator="over" />
                      </filter>
                    </defs>
                    
                    {/* Central point with glow */}
                    <circle cx="50" cy="50" r="2.5" fill="#4338ca" filter="url(#glow)" />
                  </svg>
                  
                  {/* Improved skill labels with better bg */}
                  {skillRatings.map((skill, i) => {
                    const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                    const radius = 48; // Position labels closer to the edge
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
                  
                  {/* Enhanced center score */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full w-14 h-14 flex flex-col items-center justify-center shadow-lg">
                      <div className="text-xl font-bold text-white leading-none mt-0.5">{avgRating}</div>
                      <div className="text-[7px] uppercase tracking-wider text-indigo-100">Promedio</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced bottom summary bar */}
              <div className="border-t border-gray-100 p-3 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    <span className="font-medium">{feedbackItems.length}</span> evaluaciones
                  </div>
                  <div className="flex gap-1.5">
                    <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium border border-green-100">
                      Fortaleza: Calidad
                    </span>
                    <span className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium border border-amber-100">
                      Mejora: Cumplimiento
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feedback list */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-3.5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-transparent">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <span className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center">
                <Star className="h-3 w-3 text-white" />
              </span>
              Retroalimentación recibida
            </h3>
            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors border border-indigo-100 shadow-sm">
              Ver historial completo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
            {feedbackItems.slice(0, 4).map((item) => (
              <div 
                key={item.id} 
                className="p-3 hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  {/* Enhanced user icon */}
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm overflow-hidden">
                      <User className="h-4.5 w-4.5 text-indigo-600" />
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">{item.from.name}</div>
                      <div className="text-[11px] text-gray-500">{formatDate(item.date)}</div>
                    </div>
                  </div>
                  
                  {/* Enhanced rating display */}
                  <div className="flex items-center bg-amber-50 rounded-md px-2 py-1 border border-amber-100 shadow-sm">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(item.rating) 
                            ? "text-amber-400 fill-amber-400" 
                            : i < item.rating 
                              ? "text-amber-400 fill-amber-400 opacity-50" 
                              : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-medium ml-1 text-amber-800">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                {/* Category tags with specific category-tag class */}
                <div className="flex gap-1.5 mb-2.5">
                  <span className="category-tag inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-800 border border-indigo-100 shadow-sm">
                    {item.category}
                  </span>
                  {item.project && (
                    <span className="category-tag inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-sm">
                      {item.project}
                    </span>
                  )}
                </div>
                
                {/* Message with better presentation */}
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-md p-3 border border-gray-100 shadow-inner relative">
                  <p className="text-xs text-gray-600 line-clamp-3">{item.message}</p>
                  
                  {item.message.length > 150 && (
                    <button className="absolute bottom-1.5 right-1.5 text-[10px] font-medium text-indigo-600 hover:text-indigo-800 bg-white px-2 py-0.5 rounded-full border border-indigo-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Leer más
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced footer */}
          <div className="p-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-center">
            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-white px-4 py-2 rounded-md border border-indigo-100 hover:border-indigo-300 shadow-sm transition-all flex items-center gap-1.5 hover:shadow">
              <span>Ver todas las retroalimentaciones</span>
              <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
