/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

interface ProfileHeaderProps {
  userData: {
    name: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    bio: string;
    avatar: string;
  };
  onProfileUpdate: (updatedData: any) => void;
}

export default function ProfileHeader({ userData, onProfileUpdate }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileUpdate(formData);
    setIsEditing(false);
    // Reset preview image after update
    setPreviewImage(null);
  };
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      
      // Update formData with new image info (in production, you'd handle actual upload)
      setFormData(prev => ({ 
        ...prev, 
        avatar: imageUrl // In a real app, this would be the uploaded image URL
      }));
    }
  };

  return (
    <header className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative">
          <div className="p-2 bg-gradient-to-r from-[#A100FF20] to-[#8500D420] rounded-full">
            <div 
              className="w-40 h-40 relative rounded-full border-4 border-white shadow overflow-hidden cursor-pointer"
              onClick={handleImageClick}
              title="Change profile image"
            >
              <Image 
                src={previewImage || userData.avatar}
                alt={userData.name}
                fill
                sizes="160px"
                className="object-cover scale-140"
                style={{ objectPosition: "center" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/160";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Change Photo</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button className="absolute bottom-1 right-1 bg-[#A100FF20] p-2 rounded-full text-[#A100FF] hover:bg-[#A100FF30] fast-transition shadow-sm">
            <FiEdit2 size={14} className="text-[#A100FF]" onClick={handleImageClick} />
          </button>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="space-y-3 w-full md:w-2/3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 fast-transition shadow font-medium flex items-center gap-1"
                >
                  <FiX size={16} className="text-white !important" />
                  <span className="text-white !important">Cancelar</span>
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#A100FF] text-white rounded hover:bg-[#8500D4] fast-transition shadow font-medium flex items-center gap-1"
                >
                  <FiSave size={16} className="text-white !important" />
                  <span className="text-white !important">Guardar</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
                  <p className="text-[#A100FF] font-medium">{userData.title}</p>
                  <p className="text-gray-500 text-sm mt-1">{userData.location}</p>
                </div>
                <button 
                  className="mt-4 md:mt-0 px-4 py-2 bg-[#A100FF] text-white rounded-md hover:bg-[#8500D4] fast-transition flex items-center gap-2 mx-auto md:mx-0 shadow-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit2 size={16} className="text-white !important" />
                  <span className="text-white !important">Editar perfil</span>
                </button>
              </div>
              
              <div className="mt-4 space-y-1">
                <p className="text-gray-600"><strong>Email:</strong> {userData.email}</p>
                <p className="text-gray-600"><strong>Teléfono:</strong> {userData.phone}</p>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <p className="text-gray-700">{userData.bio}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
