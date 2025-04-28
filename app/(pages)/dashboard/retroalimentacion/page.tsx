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
  // Change category from string to string array to support multiple selections
  const [categories, setCategories] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  // Calculate rating average from data
  const avgRating = parseFloat((feedbackItems.reduce((sum, item) => sum + item.rating, 0) / feedbackItems.length).toFixed(1)) || 4.5;

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to your backend in a real app
    console.log({
      recipient: selectedRecipient,
      rating,
      categories, // Updated to use multiple categories
      message
    });
    
    // Reset form
    setSelectedRecipient("");
    setRating(0);
    setCategories([]); // Clear categories array
    setMessage("");
    
    // Show success notification (you could add a toast component here)
    alert("Retroalimentación enviada con éxito!");
  };

  // Toggle category selection - new function
  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(cat => cat !== category));
    } else {
      setCategories([...categories, category]);
    }
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
      {/* New header card spanning the full width */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#A100FF10] to-transparent rounded-full -mt-32 -mr-32"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#A100FF10] to-transparent rounded-full -mb-16 -ml-16"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-6 justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <div className="h-7 w-7 bg-[#A100FF] rounded-full flex items-center justify-center mr-3">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  Plataforma de Retroalimentación
                </h1>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  Este espacio permite compartir valoraciones con tu equipo para promover el crecimiento profesional. El feedback constructivo es clave para mejorar nuestro trabajo conjunto en Accenture.
                </p>
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
        {/* Stats row with more consistent styling */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {formattedStats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-3.5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
            >
              <div className="flex justify-between items-center mb-1.5">
                <div className="bg-[#A100FF] p-2 rounded-md shadow-sm">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full overflow-hidden">
              <div className="p-3.5 border-b border-gray-100">
                <h3 className="font-medium text-gray-800 flex items-center gap-2">
                  <span className="h-5 w-5 bg-[#A100FF] rounded-full flex items-center justify-center">
                    <Send className="h-3 w-3 text-white" />
                  </span>
                  Enviar retroalimentación
                </h3>
              </div>
              
              <form onSubmit={handleSubmitFeedback} className="p-4 flex flex-col">
                {/* Recipient selector with better styling */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center">
                    <span className="h-2 w-2 bg-[#A100FF] mr-1.5 rounded-full"></span>
                    Seleccionar destinatario:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {feedbackRecipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        onClick={() => setSelectedRecipient(recipient.id)}
                        className={`flex items-center p-2 rounded-md border ${
                          selectedRecipient === recipient.id
                            ? "border-[#A100FF] bg-[#A100FF08]" 
                            : "border-gray-200 hover:border-[#A100FF80] hover:bg-[#A100FF05]"
                        } cursor-pointer transition-all`}
                      >
                        <div className="h-8 w-8 rounded-full bg-[#A100FF10] flex items-center justify-center overflow-hidden border border-gray-200">
                          <User className="h-4 w-4 text-[#A100FF]" />
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
                  {/* Rating box with consistent purple */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center">
                      <span className="h-2 w-2 bg-[#A100FF] mr-1.5 rounded-full"></span>
                      Valoración:
                    </label>
                    <div className="flex flex-col h-[65px] p-2.5 bg-[#A100FF05] rounded-md border border-gray-200 shadow-inner">
                      {/* Stars container */}
                      <div className="flex justify-center items-center flex-grow">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 mx-1.5 cursor-pointer transition-all ${
                              (hoverRating || rating) >= star 
                                ? "text-[#A100FF] fill-[#A100FF] scale-110" 
                                : "text-gray-300"
                            }`}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                          />
                        ))}
                      </div>
                      
                      {/* Rating text */}
                      <div className="text-center text-xs font-medium text-gray-700 pt-1">
                        {rating > 0 
                          ? `${rating}/5 - ${rating > 3 ? 'Excelente' : rating > 2 ? 'Bueno' : 'Regular'}`
                          : 'Selecciona una valoración'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Category selector with consistent purple */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center">
                      <span className="h-2 w-2 bg-[#A100FF] mr-1.5 rounded-full"></span>
                      Categoría: <span className="ml-1 text-xs text-gray-500 font-normal">(múltiple)</span>
                    </label>
                    <div className="flex flex-col h-[65px] p-2.5 bg-[#A100FF05] rounded-md border border-gray-200 shadow-inner">
                      <div className="flex flex-wrap gap-1.5 content-start">
                        {["Colaboración", "Calidad", "Cumplimiento", "Comunicación"].map((cat) => (
                          <button
                            type="button"
                            key={cat}
                            className={`px-2.5 py-0.5 text-xs rounded-full whitespace-nowrap outline-none focus:outline-none focus:ring-0 transition-all ${
                              categories.includes(cat)
                                ? "bg-[#A100FF15] text-[#A100FF] border border-[#A100FF40]" 
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-[#A100FF05]"
                            }`}
                            onClick={() => toggleCategory(cat)}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Message area with consistent styling */}
                <div className="mb-5">
                  <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center">
                    <span className="h-2 w-2 bg-[#A100FF] mr-1.5 rounded-full"></span>
                    Mensaje:
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-[100px] rounded-md border border-gray-200 p-3 text-sm 
                              focus:border-[#A100FF40] focus:ring-1 focus:ring-[#A100FF20] resize-none
                              shadow-inner bg-[#A100FF05]"
                    placeholder="Escribe tu retroalimentación detallada aquí..."
                  ></textarea>
                </div>
                
                {/* Submit button with consistent purple */}
                <button
                  type="submit"
                  disabled={!selectedRecipient || !rating || categories.length === 0 || !message}
                  className={`w-full py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    selectedRecipient && rating && categories.length > 0 && message
                      ? "bg-[#A100FF] hover:bg-[#8A00FF] shadow-md" 
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
          
          {/* Right column: Competency chart with consistent styling */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full overflow-hidden flex flex-col">
              <div className="p-3.5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-medium text-gray-800 flex items-center gap-2">
                  <span className="h-5 w-5 bg-[#A100FF] rounded-full flex items-center justify-center">
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
                          ? 'bg-[#A100FF] text-white' 
                          : 'text-gray-700 hover:bg-[#A100FF15] hover:text-[#A100FF]'
                      }`}
                      onClick={() => setSelectedPeriod(period.toLowerCase() as any)}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Radar chart with consistent styling */}
              <div className="flex-grow flex items-center justify-center p-4 bg-[#A100FF02]">
                <div className="relative h-[250px] w-[250px]">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                    {/* Grid circles */}
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
                    
                    {/* Axis lines */}
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
                    
                    {/* Data polygon */}
                    <polygon
                      points={
                        skillRatings.map((skill, i) => {
                          const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                          const radius = (skill.value / 5) * 40;
                          return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
                        }).join(' ')
                      }
                      fill="rgba(161, 0, 255, 0.10)"
                      stroke="#A100FF"
                      strokeWidth="1.5"
                    />
                    
                    {/* Data points */}
                    {skillRatings.map((skill, i) => {
                      const angle = (i / skillRatings.length) * 2 * Math.PI - Math.PI / 2;
                      const radius = (skill.value / 5) * 40;
                      return (
                        <g key={i}>
                          <circle
                            cx={50 + radius * Math.cos(angle)}
                            cy={50 + radius * Math.sin(angle)}
                            r="2"
                            fill="#A100FF"
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
                    <circle cx="50" cy="50" r="2.5" fill="#A100FF" />
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
                  
                  {/* Center score */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-[#A100FF] rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg">
                      <div className="text-2xl font-bold text-white leading-none mt-0.5">{avgRating}</div>
                      <div className="text-[8px] uppercase tracking-wider text-white opacity-80">Promedio</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom summary bar with consistent styling */}
              <div className="border-t border-gray-100 p-3 bg-[#A100FF05] mt-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 bg-[#A100FF] rounded-full"></span>
                    <span className="font-medium">{feedbackItems.length}</span> evaluaciones
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-white text-[#A100FF] text-xs px-2 py-0.5 rounded-full font-medium border border-[#A100FF20]">
                      Fortaleza: Calidad
                    </span>
                    <span className="bg-white text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium border border-gray-200">
                      Mejora: Cumplimiento
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feedback list with consistent styling */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-3.5 border-b border-gray-100">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <span className="h-5 w-5 bg-[#A100FF] rounded-full flex items-center justify-center">
                <Star className="h-3 w-3 text-white" />
              </span>
              Retroalimentación recibida
            </h3>
            <button className="text-xs font-medium text-[#A100FF] hover:text-[#8A00FF] bg-[#A100FF05] px-3 py-1.5 rounded-md hover:bg-[#A100FF10] transition-colors border border-[#A100FF20] shadow-sm">
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
                  
                  {/* Rating display - simplified */}
                  <div className="flex items-center bg-gray-100 rounded-md px-2 py-1 border border-gray-200 shadow-sm">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(item.rating) 
                            ? "text-[#A100FF] fill-[#A100FF]" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-medium ml-1 text-gray-700">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                {/* Category tags - simplified */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200 shadow-sm whitespace-nowrap overflow-hidden max-w-full text-ellipsis">
                    {item.category}
                  </span>
                  {item.project && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200 shadow-sm whitespace-nowrap overflow-hidden max-w-full text-ellipsis">
                      {item.project}
                    </span>
                  )}
                </div>
                
                {/* Message - simplified */}
                <div className="bg-gray-50 rounded-md p-3 border border-gray-200 shadow-inner relative">
                  <p className="text-xs text-gray-600 line-clamp-3">{item.message}</p>
                  
                  {item.message.length > 150 && (
                    <button className="absolute bottom-1.5 right-1.5 text-[10px] font-medium text-[#A100FF] hover:text-[#8A00FF] bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Leer más
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer with consistent styling */}
          <div className="p-3 border-t border-gray-100 bg-[#A100FF05] flex justify-center">
            <button className="text-xs font-medium text-[#A100FF] hover:text-[#8A00FF] bg-white px-4 py-2 rounded-md border border-[#A100FF20] hover:border-[#A100FF40] shadow-sm transition-all flex items-center gap-1.5 hover:shadow">
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

