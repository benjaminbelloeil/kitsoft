/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import Select from 'react-select';
import ReactCountryFlag from "react-country-flag";
import { Country, State, City } from "country-state-city";
import * as countryCodes from "country-codes-list";
import { customSelectStyles } from './selectStyles';
import { CountryOption, StateOption, CityOption } from '@/interfaces/address';
import { PhoneCodeOption } from '@/interfaces/contact';
import { UserProfile, UserProfileUpdate } from '@/interfaces/user';
import { getAuthUserEmail } from '@/utils/database/client/userSync';

interface ProfileHeaderProps {
  userData: UserProfile;
  onProfileUpdate: (updatedData: UserProfileUpdate) => void;
  isNewUser?: boolean;
  isSaving?: boolean; // Add this prop
}

export default function ProfileHeader({ 
  userData, 
  onProfileUpdate, 
  isNewUser = false,
  isSaving = false // Default to false
}: ProfileHeaderProps) {
  // Initialize with empty profile data if the profile is new
  const emptyProfile: UserProfile = {
    ID_Usuario: userData?.ID_Usuario || '',
    Nombre: '',  // Changed from 'Nombre' to empty string
    Apellido: '',
    Titulo: '',
    Bio: '',
    URL_Avatar: 'placeholder-avatar.png', // Ensure proper URL format with leading slash
    direccion: {
      ID_Direccion: crypto.randomUUID(),
      CP: '',
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
  
  const [isEditing, setIsEditing] = useState(isNewUser); // Auto-edit mode for new users
  const [formData, setFormData] = useState(initialProfile);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  
  // State for dropdown options
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [phoneCodes, setPhoneCodes] = useState<PhoneCodeOption[]>([]);
  
  // Selected data
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState({
    countries: true, 
    phoneCodes: true,
    states: false,
    cities: false
  });
  
  // Load countries, states and cities from country-state-city package
  useEffect(() => {
    // Load all countries
    const countryData = Country.getAllCountries().map(country => ({
      value: country.name,
      label: country.name,
      code: country.isoCode
    }));
    setCountries(countryData);
    
    // Find the country code if a country is already selected
    if (formData.direccion?.Pais) {
      const foundCountry = countryData.find(country => country.value === formData.direccion?.Pais);
      if (foundCountry) {
        setSelectedCountry(foundCountry.code);
        
        // Load states for this country
        loadStatesForCountry(foundCountry.code);
      }
    }
    
    // Load phone codes from country-codes-list
    try {
      const myCountryCodesObject = countryCodes.customList(
        "countryCode",
        "[{countryCode}] {countryNameEn}: +{countryCallingCode}"
      );
      
      // Transform the data into the format we need for the dropdown
      const phoneCodeOptions = Object.entries(myCountryCodesObject).map(([code, label]) => {
        const callingCode = label.split(': ')[1]; // Extract "+XX" part
        return {
          value: callingCode,
          label: callingCode,
          code: code
        };
      });
      
      setPhoneCodes(phoneCodeOptions);
    } catch (error) {
      console.error("Error loading phone codes:", error);
      
      // Fallback phone codes in case of error
      const fallbackPhoneCodes = [
        { value: "+1", label: "+1", code: "US" },
        { value: "+52", label: "+52", code: "MX" },
        { value: "+34", label: "+34", code: "ES" }
      ];
      setPhoneCodes(fallbackPhoneCodes);
    }
    
    setIsLoading({
      countries: false,
      phoneCodes: false,
      states: false,
      cities: false
    });
  }, []);
  
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
  
  // Load states for selected country
  const loadStatesForCountry = (countryCode: string) => {
    if (!countryCode) return;
    
    setIsLoading(prev => ({...prev, states: true}));
    
    const stateData = State.getStatesOfCountry(countryCode).map(state => ({
      value: state.name,
      label: state.name,
      countryCode: state.countryCode,
      stateCode: state.isoCode
    }));
    
    setStates(stateData);
    
    // Find the state code if a state is already selected
    if (formData.direccion?.Estado) {
      const foundState = stateData.find(state => state.value === formData.direccion?.Estado);
      if (foundState) {
        setSelectedState(foundState.stateCode);
        
        // Load cities for this state and country
        loadCitiesForState(countryCode, foundState.stateCode);
      }
    }
    
    setIsLoading(prev => ({...prev, states: false}));
  };
  
  // Load cities for selected state and country
  const loadCitiesForState = (countryCode: string, stateCode: string) => {
    if (!countryCode || !stateCode) return;
    
    setIsLoading(prev => ({...prev, cities: true}));
    
    const cityData = City.getCitiesOfState(countryCode, stateCode).map(city => ({
      value: city.name,
      label: city.name
    }));
    
    setCities(cityData);
    setIsLoading(prev => ({...prev, cities: false}));
  };
  
  // Handler for country selection
  const handleCountryChange = (selectedOption: CountryOption | null) => {
    if (selectedOption) {
      setFormData(prev => ({
        ...prev,
        direccion: {
          // Ensure all required fields have string values
          CP: prev.direccion?.CP || '',
          Tipo: prev.direccion?.Tipo || '',
          Pais: selectedOption.value,
          // Reset the state and city when country changes
          Estado: '',
          Ciudad: ''
        }
      }));
      
      // Store the country code and load states for this country
      setSelectedCountry(selectedOption.code);
      setSelectedState(null);
      loadStatesForCountry(selectedOption.code);
      setCities([]); // Clear cities when country changes
    }
  };
  
  const handleStateChange = (selectedOption: StateOption | null) => {
    if (selectedOption) {
      setFormData(prev => ({
        ...prev,
        direccion: {
          // Ensure all required fields have string values
          CP: prev.direccion?.CP || '',
          Pais: prev.direccion?.Pais || '',
          Tipo: prev.direccion?.Tipo || '',
          Estado: selectedOption.value,
          // Reset the city when state changes
          Ciudad: ''
        }
      }));
      
      setSelectedState(selectedOption.stateCode);
      
      // Load cities for this state and country
      if (selectedCountry) {
        loadCitiesForState(selectedCountry, selectedOption.stateCode);
      }
    }
  };
  
  const handleCityChange = (selectedOption: CityOption | null) => {
    if (selectedOption) {
      setFormData(prev => ({
        ...prev,
        direccion: {
          // Ensure all required fields have string values
          CP: prev.direccion?.CP || '',
          Pais: prev.direccion?.Pais || '',
          Estado: prev.direccion?.Estado || '',
          Tipo: prev.direccion?.Tipo || '',
          // Then set the new city value
          Ciudad: selectedOption.value
        }
      }));
    }
  };
  
  // Handler for phone code selection
  const handlePhoneCodeChange = (selectedOption: PhoneCodeOption | null) => {
    if (selectedOption) {
      setFormData(prev => ({
        ...prev,
        telefono: {
          // Provide default values for all required fields
          Codigo_Estado: (prev.telefono?.Codigo_Estado || ''),
          Numero: (prev.telefono?.Numero || ''),
          Tipo: (prev.telefono?.Tipo || ''),
          // Then override with the new value
          Codigo_Pais: selectedOption.value
        }
      }));
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const parentValue = prev[parent as keyof typeof prev] || {};
        return {
          ...prev,
          [parent]: {
            ...(parentValue as Record<string, any>),
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
      direccion: formData.direccion ? {
        ID_Direccion: formData.direccion.ID_Direccion || crypto.randomUUID(),
        CP: formData.direccion.CP || '',
        Pais: formData.direccion.Pais,
        Estado: formData.direccion.Estado,
        Ciudad: formData.direccion.Ciudad,
        ID_Usuario: formData.ID_Usuario,
        Tipo: '' // Blank field as requested
      } : undefined,
      
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

  // Country option with flag
  const CountryOption = ({ innerProps, label, data }: any) => (
    <div {...innerProps} className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100">
      <ReactCountryFlag
        countryCode={data.code}
        svg
        style={{
          width: '1.5em',
          height: '1.5em',
          marginRight: '8px',
        }}
      />
      {label}
    </div>
  );

  // Country selected value with flag
  const CountrySingleValue = ({ data }: any) => (
    <div className="flex items-center">
      <ReactCountryFlag
        countryCode={data.code}
        svg
        style={{
          width: '1.5em',
          height: '1.5em',
          marginRight: '8px',
        }}
      />
      {data.label}
    </div>
  );

  // Phone code option with flag
  const PhoneCodeOption = ({ innerProps, data }: any) => (
    <div {...innerProps} className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100">
      <ReactCountryFlag
        countryCode={data.code}
        svg
        style={{
          width: '1.5em',
          height: '1.5em',
          marginRight: '8px',
        }}
      />
      {data.value}
    </div>
  );

  // Format for the selected phone code in the input
  const PhoneCodeSingleValue = ({ data }: any) => (
    <div className="flex items-center">
      <ReactCountryFlag
        countryCode={data.code}
        svg
        style={{
          width: '1.5em',
          height: '1.5em',
          marginRight: '8px',
        }}
      />
      {data.value}
    </div>
  );

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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="space-y-3 w-full md:w-2/3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                        placeholder="Tu nombre"
                        maxLength={20} // Match VARCHAR(20) in database
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="Apellido"
                        value={formData.Apellido}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                        placeholder="Tu apellido"
                        maxLength={20} // Match VARCHAR(20) in database
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="Titulo"
                      value={formData.Titulo}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                      placeholder="Ej: Desarrollador Full Stack"
                      maxLength={50} // Match VARCHAR(50) in database
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="correo.Correo"
                    value={authEmail || formData.correo?.Correo || ''}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed focus:outline-none"
                    style={{ height: '42px' }}
                    title="El email no se puede cambiar"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email asociado a tu cuenta</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código País <span className="text-red-500">*</span>
                    </label>
                    <Select
                      isLoading={isLoading.phoneCodes}
                      options={phoneCodes}
                      value={phoneCodes.find(option => option.value === formData.telefono?.Codigo_Pais)}
                      onChange={handlePhoneCodeChange}
                      placeholder="Código"
                      styles={customSelectStyles}
                      components={{ 
                        Option: PhoneCodeOption,
                        SingleValue: PhoneCodeSingleValue
                      }}
                      className="text-sm"
                      isSearchable
                      noOptionsMessage={() => "No se encontraron resultados"}
                      loadingMessage={() => "Cargando..."}
                      menuPosition="fixed"
                      menuPlacement="auto"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cod. Estado</label>
                    <input
                      type="text"
                      name="telefono.Codigo_Estado"
                      value={formData.telefono?.Codigo_Estado || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                      placeholder="55"
                      maxLength={3} // Match VARCHAR(3) in database
                      style={{ height: '42px' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="telefono.Numero"
                      value={formData.telefono?.Numero || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                      placeholder="1234567890"
                      maxLength={10} // Match VARCHAR(10) in database
                      style={{ height: '42px' }}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País <span className="text-red-500">*</span>
                  </label>
                  <Select
                    isLoading={isLoading.countries}
                    options={countries}
                    value={countries.find(option => option.value === formData.direccion?.Pais)}
                    onChange={handleCountryChange}
                    placeholder="Seleccionar país"
                    styles={customSelectStyles}
                    components={{ 
                      Option: CountryOption,
                      SingleValue: CountrySingleValue
                    }}
                    className="text-sm"
                    isSearchable
                    required
                    noOptionsMessage={() => "No se encontraron países"}
                    loadingMessage={() => "Cargando países..."}
                    menuPosition="fixed"
                    menuPlacement="auto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <Select
                    isLoading={isLoading.states}
                    options={states}
                    value={states.find(option => option.value === formData.direccion?.Estado)}
                    onChange={handleStateChange}
                    placeholder={
                      selectedCountry 
                        ? isLoading.states 
                          ? "Cargando estados..." 
                          : "Seleccionar estado"
                        : "Primero selecciona un país"
                    }
                    styles={customSelectStyles}
                    className="text-sm"
                    isSearchable
                    required
                    isDisabled={!selectedCountry || isLoading.states}
                    noOptionsMessage={() => "No se encontraron estados"}
                    loadingMessage={() => "Cargando estados..."}
                    menuPosition="fixed"
                    menuPlacement="auto"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad <span className="text-red-500">*</span>
                  </label>
                  <Select
                    isLoading={isLoading.cities}
                    options={cities}
                    value={cities.find(option => option.value === formData.direccion?.Ciudad)}
                    onChange={handleCityChange}
                    placeholder={
                      selectedState
                        ? isLoading.cities
                          ? "Cargando ciudades..."
                          : "Seleccionar ciudad"
                        : "Primero selecciona un estado"
                    }
                    styles={customSelectStyles}
                    className="text-sm"
                    isSearchable
                    required
                    isDisabled={!selectedState || isLoading.cities}
                    noOptionsMessage={() => "No se encontraron ciudades"}
                    loadingMessage={() => "Cargando ciudades..."}
                    menuPosition="fixed"
                    menuPlacement="auto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                  <input
                    type="text"
                    name="direccion.CP"
                    value={formData.direccion?.CP || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                    placeholder="12345"
                    maxLength={10} // Match VARCHAR(10) in database
                    style={{ height: '42px' }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="Bio"
                  value={formData.Bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                  placeholder="Cuéntanos sobre ti, tu experiencia y habilidades"
                  maxLength={500} // Match VARCHAR(500) in database
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                {!isNewUser && (
                  <button 
                    type="button"
                    disabled={isSaving}
                    onClick={() => setIsEditing(false)} 
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 fast-transition shadow font-medium flex items-center gap-1 disabled:opacity-50"
                  >
                    <FiX size={16} className="text-white !important" />
                    <span className="text-white !important">Cancelar</span>
                  </button>
                )}
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#A100FF] text-white rounded hover:bg-[#8500D4] fast-transition shadow font-medium flex items-center gap-1 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
                      <span className="ml-2 text-white !important">
                        {isNewUser ? 'Guardando...' : 'Guardando...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <FiSave size={16} className="text-white !important" />
                      <span className="text-white !important">
                        {isNewUser ? 'Crear perfil' : 'Guardar cambios'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Display mode - show placeholders when data is missing
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {initialProfile.Nombre ? initialProfile.Nombre : 'Nombre no especificado'} {initialProfile.Apellido || ''}
                  </h1>
                  <p className="text-[#A100FF] font-medium">
                    {initialProfile.Titulo || 'Título profesional no especificado'}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {initialProfile.direccion?.Ciudad && initialProfile.direccion?.Estado && initialProfile.direccion?.Pais ?
                      `${initialProfile.direccion.Ciudad}, ${initialProfile.direccion.Estado}, ${initialProfile.direccion.Pais}` : 
                      'Ubicación no especificada'}
                  </p>
                </div>
                <button 
                  className="mt-4 md:mt-0 px-4 py-2 bg-[#A100FF] text-white rounded-md hover:bg-[#8500D4] fast-transition flex items-center gap-2 mx-auto md:mx-0 shadow-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit2 size={16} className="text-white !important" />
                  <span className="text-white !important">
                    {isNewUser ? 'Completar perfil' : 'Editar perfil'}
                  </span>
                </button>
              </div>
              
              <div className="mt-4 space-y-1">
                <p className="text-gray-600">
                  <strong>Email:</strong> {authEmail || initialProfile.correo?.Correo || 'No disponible'}
                </p>
                <p className="text-gray-600">
                  <strong>Teléfono:</strong> 
                  {initialProfile.telefono?.Codigo_Pais && initialProfile.telefono?.Numero ? 
                    `${initialProfile.telefono.Codigo_Pais} ${initialProfile.telefono.Codigo_Estado || ''} ${initialProfile.telefono.Numero}` : 
                    'Teléfono no especificado'}
                </p>
              </div>
              
              <div className="mt-4 border-t pt-4">
                {initialProfile.Bio ? (
                  <p className="text-gray-700">{initialProfile.Bio}</p>
                ) : (
                  <div className="text-gray-500 italic">
                    <p>Bio no especificada</p>
                    <p className="text-sm mt-1">
                      Añade información sobre ti para que otros puedan conocerte mejor.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}