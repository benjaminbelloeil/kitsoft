/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { FiSave, FiX, FiUser, FiBriefcase, FiMapPin, FiPhone, FiMail, FiFileText } from "react-icons/fi";
import Select from 'react-select';
import ReactCountryFlag from "react-country-flag";
import { Country, State, City } from "country-state-city";
import * as countryCodes from "country-codes-list";
import { customSelectStyles } from '../selectStyles';
import { CountryOption, StateOption, CityOption, Direccion } from '@/interfaces/address';
import { PhoneCodeOption } from '@/interfaces/contact';
import { UserProfile } from '@/interfaces/user';

interface ProfileEditFormProps {
  formData: UserProfile;
  setFormData: React.Dispatch<React.SetStateAction<UserProfile>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  previewImage: string | null;
  isNewUser: boolean;
  isSaving: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  authEmail: string | null;
}

export default function ProfileEditForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isNewUser,
  isSaving,
  authEmail
}: ProfileEditFormProps) {
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
  
  // Load initial countries and related data
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
      }
    }
    
    // Load all phone codes
    try {
      const myCountryCodesObject = countryCodes.customList(
        "countryCode",
        "[{countryCode}] {countryNameEn}: +{countryCallingCode}"
      );
      
      // Transform the data into the format we need for the dropdown
      const phoneCodeOptions = Object.entries(myCountryCodesObject).map(([code, label]) => {
        return {
          value: `+${label.split('+')[1]}`,
          label: `+${label.split('+')[1]}`,
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
    
    setIsLoading(prev => ({...prev, countries: false, phoneCodes: false}));
  }, [formData.direccion?.Pais]);

  // Load cities for selected state and country
  const loadCitiesForState = useCallback((countryCode: string, stateCode: string) => {
    if (!countryCode || !stateCode) return;
    
    setIsLoading(prev => ({...prev, cities: true}));
    
    const cityData = City.getCitiesOfState(countryCode, stateCode).map(city => ({
      value: city.name,
      label: city.name
    }));
    
    setCities(cityData);
    setIsLoading(prev => ({...prev, cities: false}));
  }, []);
  
  // Load states for a selected country
  const loadStatesForCountry = useCallback((countryCode: string) => {
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
  }, [formData.direccion?.Estado, loadCitiesForState]);
  
  // Load states if the country is selected or changes
  useEffect(() => {
    if (formData.direccion?.Pais && selectedCountry) {
      loadStatesForCountry(selectedCountry);
    }
  }, [formData.direccion?.Pais, selectedCountry, loadStatesForCountry]);
  
  // Load initial state and city data if values exist
  useEffect(() => {
    if (formData.direccion?.Pais) {
      const foundCountry = countries.find(country => country.value === formData.direccion?.Pais);
      if (foundCountry) {
        setSelectedCountry(foundCountry.code);
        loadStatesForCountry(foundCountry.code);
      }
    }
  }, [formData.direccion?.Pais, countries, loadStatesForCountry]);

  // Handler for country selection
  const handleCountryChange = (selectedOption: CountryOption | null) => {
    if (selectedOption) {
      console.log("Country selected:", selectedOption);
      
      setFormData(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion as Direccion,
          Pais: selectedOption.value,
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
          ...prev.direccion as Direccion,
          Estado: selectedOption.value,
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
          ...prev.direccion as Direccion,
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
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Form sections with improved styling */}
      <div className="bg-purple-50 rounded-lg p-4 mb-2 -mt-1">
        <p className="text-sm text-purple-700">
          {isNewUser 
            ? 'Completa tu información profesional para comenzar.' 
            : 'Actualiza tu información profesional.'}
        </p>
      </div>
      
      {/* Personal Information Section with icons */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <FiUser className="text-[#A100FF]" />
          <h3 className="text-lg font-medium text-gray-700">Información personal</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="Nombre"
              value={formData.Nombre}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
              placeholder="Tu nombre"
              maxLength={20}
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
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
              placeholder="Tu apellido"
              maxLength={20}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título profesional <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FiBriefcase size={16} />
            </span>
            <input
              type="text"
              name="Titulo"
              value={formData.Titulo}
              onChange={handleChange}
              className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
              placeholder="Ej: Desarrollador Full Stack"
              maxLength={50}
              required
            />
          </div>
        </div>
      </div>
      
      {/* Contact Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <FiPhone className="text-[#A100FF]" />
          <h3 className="text-lg font-medium text-gray-700">Contacto</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FiMail size={16} />
              </span>
              <input
                type="email"
                name="correo.Correo"
                value={authEmail || formData.correo?.Correo || ''}
                disabled
                className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-none"
                title="El email no se puede cambiar"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Email asociado a tu cuenta
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="w-32">
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
                menuPlacement="auto"
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cod. Estado</label>
              <input
                type="text"
                name="telefono.Codigo_Estado"
                value={formData.telefono?.Codigo_Estado || ''}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                placeholder="55"
                maxLength={3}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="telefono.Numero"
                value={formData.telefono?.Numero || ''}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                placeholder="1234567890"
                maxLength={10}
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Location Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <FiMapPin className="text-[#A100FF]" />
          <h3 className="text-lg font-medium text-gray-700">Ubicación</h3>
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
              required
              noOptionsMessage={() => "No se encontraron países"}
              loadingMessage={() => "Cargando países..."}
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
              menuPlacement="auto"
            />
          </div>
        </div>
      </div>
      
      {/* Bio Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <FiFileText className="text-[#A100FF]" />
          <h3 className="text-lg font-medium text-gray-700">Biografía</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            name="Bio"
            value={formData.Bio}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
            placeholder="Cuéntanos sobre ti, tu experiencia y habilidades profesionales..."
            maxLength={500}
            required
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {formData.Bio?.length || 0}/500 caracteres
          </p>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-2">
        {!isNewUser && (
          <button 
            type="button"
            disabled={isSaving}
            onClick={onCancel} 
            className="px-4 py-2.5 bg-red-600 border border-red-700 text-white rounded-lg hover:bg-red-700 transition-all shadow-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <FiX size={16} />
            <span>Cancelar</span>
          </button>
        )}
        <button 
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 bg-[#A100FF] text-white rounded-lg hover:bg-[#8500D4] transition-all shadow-md font-medium flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
              <span className="ml-2">
                {isNewUser ? 'Guardando...' : 'Guardando...'}
              </span>
            </>
          ) : (
            <>
              <FiSave size={16} />
              <span>
                {isNewUser ? 'Crear perfil' : 'Guardar cambios'}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}