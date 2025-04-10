"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { UserProfile, UserProfileUpdate } from '@/interfaces/user';
import { getAuthUserEmail } from '@/utils/database/client/userSync';
import PlaceholderAvatar from "@/components/ui/placeholder-avatar";
import ProfileEditForm from './header/ProfileEditForm';
import ProfileDisplay from './header/ProfileDisplay';
import { updateUserAvatar } from '@/utils/database/client/avatarSync';
import { SkeletonProfileHeader } from './SkeletonProfile';

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
    URL_Avatar: null,
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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
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
      // Avatar URL - this is already set correctly after upload
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
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Show local preview immediately
      const localPreview = URL.createObjectURL(file);
      setPreviewImage(localPreview);
      
      setIsUploadingAvatar(true);
      
      try {
        // Upload the file to Supabase storage
        const result = await updateUserAvatar(
          formData.ID_Usuario, 
          file, 
          (msg) => console.log(msg) // Status messages could be shown in UI
        );
        
        if (result.success && result.url) {
          // Update form data with the real URL from Supabase
          setFormData(prev => ({ 
            ...prev, 
            URL_Avatar: result.url || null 
          }));
          console.log("Avatar uploaded successfully:", result.url);
        } else {
          console.error("Avatar upload failed:", result.error);
          // Optionally show an error message to the user
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  // Check if the avatar URL is empty or not valid
  const hasValidAvatar = (url: string | null | undefined): boolean => {
    return !!url && 
      url !== 'placeholder-avatar.png' &&
      !url.includes('undefined') &&
      !url.includes('null');
  };

  if (loading) {
    return <SkeletonProfileHeader />;
  }

  return (
    <header className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative">
          <div className="p-2 bg-gradient-to-r from-[#A100FF20] to-[#8500D420] rounded-full">
            <div className="w-40 h-40 relative rounded-full border-4 border-white shadow overflow-hidden">
              {(previewImage || hasValidAvatar(initialProfile.URL_Avatar)) ? (
                <Image 
                  src={previewImage || (initialProfile.URL_Avatar as string)}
                  alt={`${initialProfile.Nombre ? initialProfile.Nombre : 'Usuario'} ${initialProfile.Apellido || ''}`}
                  fill
                  sizes="160px"
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                  onError={() => {
                    // If image fails to load, URL_Avatar will be set to null
                    // which will trigger the PlaceholderAvatar component to render
                    if (!previewImage) {
                      setFormData(prev => ({ ...prev, URL_Avatar: null }));
                    }
                  }}
                />
              ) : (
                <PlaceholderAvatar 
                  size={160}
                  className="w-full h-full"
                  color="#A100FF"
                  bgColor="#F9F0FF"
                />
              )}
              
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="h-10 w-10 rounded-full border-[3px] border-[#A100FF] border-t-transparent animate-spin"></div>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploadingAvatar}
            />
          </div>
          <button 
            className={`absolute bottom-1 right-1 p-2 rounded-full shadow-sm transition-colors ${
              isUploadingAvatar 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#A100FF20] text-[#A100FF] hover:bg-[#A100FF30]'
            }`}
            onClick={handleImageClick}
            title="Cambiar foto de perfil"
            disabled={isUploadingAvatar}
          >
            <FiEdit2 size={14} />
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