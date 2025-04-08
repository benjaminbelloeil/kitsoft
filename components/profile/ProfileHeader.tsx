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

interface ProfileHeaderProps {
  userData: UserProfile;
  onProfileUpdate: (updatedData: UserProfileUpdate) => void;
}

export default function ProfileHeader({ userData, onProfileUpdate }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    onProfileUpdate(formData);
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

  // Country option with flag (update to show flag more prominently)
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

  // Phone code option with flag only (no country name)
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

  // Format for the selected phone code in the input - only flag and code
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
                src={previewImage || userData.URL_Avatar}
                alt={`${userData.Nombre} ${userData.Apellido}`}
                fill
                sizes="160px"
                className="object-cover scale-140"
                style={{ objectPosition: "center" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "placeholder.png";
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
            title="Change profile image"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                      <input
                        type="text"
                        name="Apellido"
                        value={formData.Apellido}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      name="Titulo"
                      value={formData.Titulo}
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
                    name="correo.Correo"
                    value={formData.correo?.Correo || ''}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed focus:outline-none"
                    style={{ height: '42px' }}
                    title="El correo no se puede cambiar"
                  />
                  <p className="text-xs text-gray-500 mt-1"></p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código País</label>
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
                      loadingMessage={() => "Cargando..."
                      }
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
                      style={{ height: '42px' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                    <input
                      type="text"
                      name="telefono.Numero"
                      value={formData.telefono?.Numero || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                      style={{ height: '42px' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
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
                    noOptionsMessage={() => "No se encontraron países"}
                    loadingMessage={() => "Cargando países..."
                    }
                    menuPosition="fixed"
                    menuPlacement="auto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
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
                    isDisabled={!selectedCountry || isLoading.states}
                    noOptionsMessage={() => "No se encontraron estados"}
                    loadingMessage={() => "Cargando estados..."
                    }
                    menuPosition="fixed"
                    menuPlacement="auto"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
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
                    isDisabled={!selectedState || isLoading.cities}
                    noOptionsMessage={() => "No se encontraron ciudades"}
                    loadingMessage={() => "Cargando ciudades..."
                    }
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
                    style={{ height: '42px' }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="Bio"
                  value={formData.Bio}
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
            // No changes to the non-editing view
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{userData.Nombre} {userData.Apellido}</h1>
                  <p className="text-[#A100FF] font-medium">{userData.Titulo}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {userData.direccion ? 
                      `${userData.direccion.Ciudad}, ${userData.direccion.Estado}, ${userData.direccion.Pais}` : 
                      'No location provided'}
                  </p>
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
                <p className="text-gray-600"><strong>Email:</strong> {userData.correo?.Correo || 'No email provided'}</p>
                <p className="text-gray-600">
                  <strong>Teléfono:</strong> 
                  {userData.telefono ? 
                    `${userData.telefono.Codigo_Pais} ${userData.telefono.Codigo_Estado} ${userData.telefono.Numero}` : 
                    'No phone provided'}
                </p>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <p className="text-gray-700">{userData.Bio}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}