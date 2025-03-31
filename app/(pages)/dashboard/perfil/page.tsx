"use client";
import { useState } from "react";
import { FiEdit2, FiDownload, FiPlus, FiTrash2, FiFileText, FiCheckCircle } from "react-icons/fi";

// Dummy data for demonstration
const userData = {
  name: "Carlos Rodríguez",
  title: "Senior Software Engineer",
  location: "Madrid, España",
  email: "carlos.rodriguez@accenture.com",
  phone: "+34 612 345 678",
  bio: "Ingeniero de software con más de 7 años de experiencia en desarrollo fullstack. Especializado en React, Node.js y arquitecturas cloud.",
  avatar: "/profile-placeholder.jpg",
  projects: [
    { name: "Project Nova", cargabilidad: 70, color: "emerald" },
    { name: "Accenture Cloud First", cargabilidad: 20, color: "blue" },
    { name: "Digital Transformation", cargabilidad: 10, color: "purple" }
  ],
  skills: ["JavaScript", "React", "TypeScript", "Node.js", "AWS", "Azure", "Docker", "CI/CD", "Agile"],
  experience: [
    {
      company: "Accenture",
      position: "Senior Software Engineer",
      period: "2020 - Presente",
      description: "Desarrollo de soluciones cloud-native para clientes del sector financiero."
    },
    {
      company: "Telefónica",
      position: "Developer",
      period: "2017 - 2020",
      description: "Implementación de aplicaciones web y móviles para servicios de telecomunicaciones."
    }
  ]
};

export default function ProfilePage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  // Add certificates state
  const [certificates, setCertificates] = useState<{name: string, file: File}[]>([]);
  const [experiences, setExperiences] = useState(userData.experience);
  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    period: "",
    description: ""
  });
  const [isAddingExperience, setIsAddingExperience] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleAddExperience = () => {
    setExperiences([...experiences, newExperience]);
    setNewExperience({ company: "", position: "", period: "", description: "" });
    setIsAddingExperience(false);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    setExperiences(updatedExperiences);
  };

  // Add certificate upload handler
  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Add the new certificate to the array
      setCertificates([...certificates, {
        name: e.target.files[0].name.includes('.') 
          ? e.target.files[0].name.split('.').slice(0, -1).join('.')  // Remove extension
          : e.target.files[0].name,
        file: e.target.files[0]
      }]);
      
      // Reset the input value to allow uploading the same file again if needed
      e.target.value = '';
    }
  };

  // Add certificate removal handler
  const handleRemoveCertificate = (index: number) => {
    const updatedCertificates = [...certificates];
    updatedCertificates.splice(index, 1);
    setCertificates(updatedCertificates);
  };

  // Progress circle component for cargabilidad - enhanced
  const ProgressCircle = ({ percentage, color }: { percentage: number, color: string }) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const colorClasses: Record<string, string> = {
      emerald: "stroke-emerald-500",
      blue: "stroke-blue-500",
      purple: "stroke-purple-500"
    };

    const bgColorClasses: Record<string, string> = {
      emerald: "bg-emerald-50",
      blue: "bg-blue-50",
      purple: "bg-purple-50"
    };
    
    return (
      <div className={`relative h-[120px] w-[120px] flex items-center justify-center rounded-full ${bgColorClasses[color] || "bg-emerald-50"} p-2`}>
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="40"
            fill="transparent"
            stroke="#e6e6e6"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="40"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${colorClasses[color] || "stroke-emerald-500"} drop-shadow-sm`}
            strokeLinecap="round"
          />
        </svg>
        <span className="text-2xl font-bold">{percentage}%</span>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header section - enhanced */}
      <header className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative">
            <div className="p-2 bg-gradient-to-r from-[#A100FF20] to-[#8500D420] rounded-full">
              <img 
                src={userData.avatar}
                alt={userData.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow"
                onError={(e) => {
                  // Fallback for missing image
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/128";
                }}
              />
            </div>
            <button className="absolute bottom-1 right-1 bg-[#A100FF] p-2 rounded-full text-white hover:bg-[#8500D4] fast-transition shadow-md">
              <FiEdit2 size={14} />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
                <p className="text-[#A100FF] font-medium">{userData.title}</p>
                <p className="text-gray-500 text-sm mt-1">{userData.location}</p>
              </div>
              <button className="mt-4 md:mt-0 px-4 py-2 bg-[#A100FF20] text-[#A100FF] rounded-md hover:bg-[#A100FF30] fast-transition flex items-center gap-2 mx-auto md:mx-0 shadow-sm">
                <FiEdit2 size={16} className="text-[#A100FF]" />
                <span className="text-[#A100FF] font-medium">Editar perfil</span>
              </button>
            </div>
            
            <div className="mt-4 space-y-1">
              <p className="text-gray-600"><strong>Email:</strong> {userData.email}</p>
              <p className="text-gray-600"><strong>Teléfono:</strong> {userData.phone}</p>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <p className="text-gray-700">{userData.bio}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Add margin-bottom to the grid container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Cargabilidad section - adjusted to align with certificates */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100">
              <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A100FF]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
              </span>
              Cargabilidad actual
            </h2>
            
            <div className="flex flex-wrap gap-6 flex-1">
              {userData.projects.map((project, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-5 flex-1 min-w-[200px] text-center border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 hover:border-[#A100FF40] flex flex-col justify-center"
                >
                  <h3 className="font-medium text-lg mb-4 text-gray-800">{project.name}</h3>
                  <div className="flex justify-center">
                    <ProgressCircle percentage={project.cargabilidad} color={project.color} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resume and Certificate column */}
        <div className="md:col-span-1 flex flex-col h-full">
          {/* Resume upload section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300">
            <h2 className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100">
              <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A100FF]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </span>
              Currículum
            </h2>
            
            <div className="border-2 border-dashed border-[#A100FF30] rounded-lg p-6 text-center bg-[#A100FF05]">
              {resumeFile ? (
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-700">
                    <span className="block truncate">{resumeFile.name}</span>
                    <span className="block text-gray-500 mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded flex items-center gap-1 hover:bg-gray-200 fast-transition shadow">
                      <FiDownload size={16} />
                      <span>Descargar</span>
                    </button>
                    <button 
                      className="px-3 py-2 bg-red-50 text-red-600 rounded flex items-center gap-1 hover:bg-red-100 fast-transition shadow"
                      onClick={() => setResumeFile(null)}
                    >
                      <FiTrash2 size={16} />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-[#A100FF10] rounded-full inline-flex mx-auto">
                    <svg className="h-12 w-12 text-[#A100FF]" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex justify-center text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-[#A100FF] hover:text-[#8500D4]">
                      <span>Subir archivo</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                    </label>
                    <p className="pl-1">o arrastra y suelta</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX hasta 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* NEW: Certificate section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300 flex-grow">
            <h2 className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100">
              <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
                <FiCheckCircle className="h-5 w-5 text-[#A100FF]" />
              </span>
              Certificados
            </h2>
            
            <div className="space-y-4">
              {certificates.length > 0 ? (
                <div className="space-y-3">
                  {certificates.map((cert, index) => (
                    <div 
                      key={index} 
                      className="p-3 border border-gray-200 rounded-lg flex justify-between items-center hover:border-[#A100FF20] bg-white shadow-sm"
                    >
                      <div className="flex items-center">
                        <FiFileText className="text-[#A100FF] mr-2" size={18} />
                        <div className="truncate max-w-[150px]">
                          <p className="font-medium text-sm text-gray-800">{cert.name}</p>
                          <p className="text-xs text-gray-500">{(cert.file.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button 
                          className="p-1.5 text-gray-500 hover:text-[#A100FF] hover:bg-gray-50 rounded"
                          title="Descargar"
                        >
                          <FiDownload size={14} />
                        </button>
                        <button 
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-50 rounded"
                          onClick={() => handleRemoveCertificate(index)}
                          title="Eliminar"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 text-sm italic">No hay certificados subidos</p>
              )}
              
              <div className="border-2 border-dashed border-[#A100FF20] rounded-lg p-4 text-center hover:bg-[#A100FF05] transition-colors duration-200">
                <label htmlFor="certificate-upload" className="cursor-pointer block py-2">
                  <div className="flex flex-col items-center">
                    <FiPlus size={20} className="text-[#A100FF] mb-1" />
                    <span className="text-sm font-medium text-[#A100FF]">Añadir certificado</span>
                    <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG hasta 5MB</span>
                  </div>
                  <input 
                    id="certificate-upload" 
                    type="file" 
                    className="sr-only" 
                    onChange={handleCertificateUpload} 
                    accept=".pdf,.jpg,.jpeg,.png" 
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills section - enhanced */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300">
        <h2 className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100">
          <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A100FF]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </span>
          Habilidades
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {userData.skills.map((skill, index) => (
            <span key={index} className="px-4 py-2 bg-[#A100FF15] text-[#A100FF] rounded-full text-sm border border-[#A100FF20] shadow-sm hover:bg-[#A100FF20] cursor-default transition-colors duration-200">
              {skill}
            </span>
          ))}
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center gap-1 hover:bg-gray-200 fast-transition shadow-sm">
            <FiPlus size={14} />
            <span>Añadir</span>
          </button>
        </div>
      </div>

      {/* Experience section - enhanced */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
          <h2 className="text-xl font-bold flex items-center">
            <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A100FF]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </span>
            Experiencia
          </h2>
          <button 
            className="px-3 py-2 bg-[#A100FF20] text-[#A100FF] rounded-md hover:bg-[#A100FF30] fast-transition flex items-center gap-1 shadow-sm"
            onClick={() => setIsAddingExperience(true)}
          >
            <FiPlus size={16} className="text-[#A100FF]" />
            <span className="text-[#A100FF] font-medium">Añadir</span>
          </button>
        </div>
        
        {isAddingExperience && (
          <div className="mb-6 p-6 border border-[#A100FF20] rounded-lg bg-[#A100FF05] shadow-md">
            <h3 className="font-medium mb-4 text-lg text-gray-800">Nueva experiencia</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posición</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                    value={newExperience.position}
                    onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                  placeholder="Ej: 2020 - Presente"
                  value={newExperience.period}
                  onChange={(e) => setNewExperience({...newExperience, period: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                  rows={3}
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 fast-transition shadow"
                  onClick={() => setIsAddingExperience(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="px-4 py-2 bg-[#A100FF20] text-[#A100FF] rounded hover:bg-[#A100FF30] fast-transition shadow-sm font-medium"
                  onClick={handleAddExperience}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div 
              key={index} 
              className="border-l-3 border-gray-200 pl-6 relative hover:border-l-[#A100FF] fast-transition group p-4 rounded-r-lg hover:bg-[#A100FF05] mb-2"
            >
              <div className="absolute -left-1.5 top-6 h-4 w-4 rounded-full bg-gray-200 group-hover:bg-[#A100FF] fast-transition shadow"></div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <h3 className="font-medium text-lg text-gray-800">{exp.position}</h3>
                  <p className="text-[#A100FF] font-medium">{exp.company}</p>
                  <p className="text-gray-600 text-sm">{exp.period}</p>
                  <p className="text-gray-700 mt-2">{exp.description}</p>
                </div>
                <div className="mt-2 md:mt-0 md:ml-4">
                  <button 
                    className="text-red-500 hover:text-red-700 fast-transition p-2 hover:bg-red-50 rounded-full"
                    onClick={() => handleRemoveExperience(index)}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}