/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Award, Star, Check } from 'lucide-react';



//Certifiaction Detail on Modal
const CertificateDetail = ({ certificate, course }: { certificate: any, course: any }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <Award className="text-purple-600" size={20} />
          </div>
          <h3 className="font-semibold text-lg">Certificación</h3>
        </div>
        <img 
          src="/accentureLogo.png" 
          alt="Accenture Logo" 
          className="h-8 w-auto" 
        />
      </div>
      
      <h4 className="font-bold text-lg mb-1">{course.title}</h4>
      <p className="text-gray-600 text-sm mb-4">{course.category}</p>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium">ID Credencial:</p>
          <p className="text-gray-500">{certificate.credentialID}</p>
        </div>
        <div>
          <p className="font-medium">Fecha Emisión:</p>
          <p className="text-gray-500">{new Date(certificate.issueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-medium">Válido Hasta:</p>
          <p className="text-gray-500">{new Date(certificate.validUntil).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-medium">Estado:</p>
          <p className="font-medium text-green-600">Activo</p>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-purple-600 font-medium text-sm hover:text-purple-800 flex items-center justify-center w-full">
          <Star className="mr-1" size={16} /> Ver Credencial Completa
        </button>
      </div>
    </div>
  );
};

// Course detail modal component
const CourseDetailModal = ({ course, onClose }: { course: any, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-gradient-to-br from-gray-900/40 to-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      ></div>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Información del Curso</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Categoría:</p>
                    <p className="text-gray-500">{course.category}</p>
                  </div>
                  <div>
                    <p className="font-medium">Ruta Relacionada:</p>
                    <p className="text-gray-500">{course.relatedPath}</p>
                  </div>
                  <div>
                    <p className="font-medium">Fecha Completado:</p>
                    <p className="text-gray-500">{new Date(course.completionDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Módulos del Curso</h3>
                <div className="space-y-3">
                  {course.modules.map((module: { name: string; completed: boolean }, idx: number) => (
                    <div key={idx} className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                        <Check size={16} />
                      </div>
                      <div className="ml-3 flex-grow">
                        <div className="text-sm font-medium">{module.name}</div>
                        <div className="text-xs text-green-600">Completado</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
                {course.certificate && (
                  <CertificateDetail 
                    certificate={course.certificate} 
                    course={course} 
                  />
                )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
          <button className="bg-purple-600 rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
            Descargar Certificado
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailModal;