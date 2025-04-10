"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { UserProfile, UserProfileUpdate } from '@/interfaces/user';
import { getAuthUserEmail } from '@/utils/database/client/userSync';
import { Skeleton } from "@/components/ui/skeleton";
import ProfileEditForm from './header/ProfileEditForm';
import ProfileDisplay from './header/ProfileDisplay';

interface ProfileHeaderProps {
  userData: UserProfile;
  onProfileUpdate: (updatedData: UserProfileUpdate) => void;
  isNewUser?: boolean;
  isSaving?: boolean;
  loading?: boolean;
}

export default function ProfileHeader({ 
  userData, 
  onProfileUpdate, 
  isNewUser = false,
  isSaving = false,
  loading = false
}: ProfileHeaderProps) {
  // Initialize with empty profile data if the profile is new
  const emptyProfile: UserProfile = {
    ID_Usuario: userData?.ID_Usuario || '',
    Nombre: '',
    Apellido: '',
    Titulo: '',
    Bio: '',
    URL_Avatar: 'placeholder-avatar.png',
    direccion: {
      ID_Direccion: crypto.randomUUID(),
      Pais: '',
      Estado: '',
      Ciudad: '',
      ID_Usuario: userData?.ID_Usuario || '',
      Tipo: '',
    },
    telefono: {
      ID_Telefono: crypto.randomUUID(),
      Codigo_Pais: '',
      Codigo_Estado: '',
      Numero: '',
      ID_Usuario: userData?.ID_Usuario || '',
      Tipo: '',
    },
    correo: {
      ID_Correo: crypto.randomUUID(),
      Correo: '',
      ID_Usuario: userData?.ID_Usuario || '',
      Tipo: ''
    }
  };
  
  // Use the provided data or empty profile
  const initialProfile = isNewUser ? emptyProfile : { ...emptyProfile, ...userData };
  
  // Start in NON-editing mode by default (false), regardless of isNewUser
  // We'll handle the specific new user case in useEffect
  const [isEditing, setIsEditing] = useState(false);
  
  // When user data changes or component mounts, determine if we should be in edit mode
  useEffect(() => {
    // Only auto-enter edit mode for true new users without data
    const shouldBeInEditMode = isNewUser && 
      (!userData?.Nombre || !userData?.Apellido || !userData?.Titulo);
      
    setIsEditing(shouldBeInEditMode);
  }, [isNewUser, userData]);
  
  // Initialize form data with userData if available
  const [formData, setFormData] = useState(initialProfile);
  
  // When userData changes, update the form data to prevent blank forms on reload
  useEffect(() => {
    if (!isNewUser && userData && Object.keys(userData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...userData
      }));
    }
  }, [userData, isNewUser]);
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  
  // Fetch the authenticated user's email
  useEffect(() => {
    async function fetchAuthEmail() {
      const email = await getAuthUserEmail();
      setAuthEmail(email);
      
      // Update the form data with the auth email
      if (email) {
        setFormData(prev => ({
          ...prev,
          correo: {
            // Ensure all required fields have default values
            ID_Correo: prev.correo?.ID_Correo || crypto.randomUUID(),
            ID_Usuario: prev.correo?.ID_Usuario || prev.ID_Usuario,
            Tipo: prev.correo?.Tipo || email.split('@')[1]?.split('.')[0] || '',
            Correo: email
          }
        }));
      }
    }
    
    fetchAuthEmail();
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission - Current form data:", formData);
    
    // Ensure IDs exist for new records and match database schema
    const dataToSubmit = {
      // Main user data - matches Usuarios table
      ID_Usuario: formData.ID_Usuario,
      Nombre: formData.Nombre,
      Apellido: formData.Apellido,
      Titulo: formData.Titulo, 
      Bio: formData.Bio,
      // Optional fields that are left blank for now
      URL_Avatar: formData.URL_Avatar || undefined,
      URL_Curriculum: undefined,
      Fecha_Inicio_Empleo: undefined,
      ID_PeopleLead: undefined,
      
      // Address data - matches Direcciones table
      direccion: {
        ID_Direccion: formData.direccion?.ID_Direccion || crypto.randomUUID(),
        Pais: formData.direccion?.Pais || '',
        Estado: formData.direccion?.Estado || '',
        Ciudad: formData.direccion?.Ciudad || '',
        ID_Usuario: formData.ID_Usuario,
        Tipo: '' // Blank field as requested
      },
      
      // Phone data - matches Telefonos table
      telefono: formData.telefono ? {
        ID_Telefono: formData.telefono.ID_Telefono || crypto.randomUUID(),
        Codigo_Pais: formData.telefono.Codigo_Pais,
        Codigo_Estado: formData.telefono.Codigo_Estado || '',
        Numero: formData.telefono.Numero,
        ID_Usuario: formData.ID_Usuario,
        Tipo: '' // Blank field as requested
      } : undefined,
      
      // Email data
      correo: formData.correo ? {
        ID_Correo: formData.correo.ID_Correo || crypto.randomUUID(),
        Correo: formData.correo.Correo,
        ID_Usuario: formData.ID_Usuario,
        Tipo: formData.correo.Tipo || ''
      } : undefined
    };
    
    console.log("Submitting profile data:", dataToSubmit);
    onProfileUpdate(dataToSubmit);
    setIsEditing(false);
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
      
      // In a production environment, upload to usuarios/Avatars bucket
      // and get the resulting URL to store in URL_Avatar
      setFormData(prev => ({ 
        ...prev, 
        URL_Avatar: imageUrl // In production, this would be the actual URL from the bucket
      }));
    }
  };

  // Helper function to ensure URL has proper format
  const getValidImageUrl = (url: string | null | undefined): string => {
    if (!url) return 'placeholder-avatar.png';
    
    // If URL is already absolute (has protocol or starts with slash), return as is
    if (url.startsWith('http') || url.startsWith('/')) {
      return url;
    }
    
    // Otherwise, add leading slash
    return `/${url}`;
  };

  if (loading) {
    return (
      <header className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 animate-pulse">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Avatar skeleton */}
          <div className="relative">
            <div className="p-2 bg-gray-100 rounded-full">
              <div className="w-40 h-40 relative rounded-full border-4 border-white shadow overflow-hidden">
                <Skeleton className="absolute inset-0" />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-gray-200 p-2 rounded-full">
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-4">
            {/* Name and title skeletons */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-60" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-32 rounded-md mx-auto md:mx-0 mt-4 md:mt-0" />
            </div>
            
            {/* Contact info skeletons */}
            <div className="mt-4 space-y-2 pt-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            
            {/* Border divider skeleton */}
            <div className="my-4">
              <Skeleton className="h-[1px] w-full" />
            </div>
            
            {/* Bio skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative">
          <div className="p-2 bg-gradient-to-r from-[#A100FF20] to-[#8500D420] rounded-full">
            <div 
              className="w-40 h-40 relative rounded-full border-4 border-white shadow overflow-hidden"
            >
              <Image 
                src={previewImage ? getValidImageUrl(previewImage) : getValidImageUrl(initialProfile.URL_Avatar)}
                alt={`${initialProfile.Nombre ? initialProfile.Nombre : 'Usuario'} ${initialProfile.Apellido || ''}`}
                fill
                sizes="160px"
                className="object-cover scale-140"
                style={{ objectPosition: "center" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "placeholder-avatar.png";
                }}
              />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button 
            className="absolute bottom-1 right-1 bg-[#A100FF20] p-2 rounded-full text-[#A100FF] hover:bg-[#A100FF30] fast-transition shadow-sm"
            onClick={handleImageClick}
            title="Cambiar foto de perfil"
          >
            <FiEdit2 size={14} className="text-[#A100FF]" />
          </button>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <ProfileEditForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => setIsEditing(false)}
              previewImage={previewImage}
              isNewUser={isNewUser}
              isSaving={isSaving}
              fileInputRef={fileInputRef}
              authEmail={authEmail}
            />
          ) : (
            <ProfileDisplay
              profile={initialProfile}
              onEditClick={() => setIsEditing(true)}
              authEmail={authEmail}
              isNewUser={isNewUser}
            />
          )}
        </div>
      </div>
    </header>
  );
}