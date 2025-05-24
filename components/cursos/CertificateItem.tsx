/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Award, Check, Calendar, Info, ChevronRight } from 'lucide-react';



// Certificate item component
const CertificateItem = ({ course, onClick, viewMode }: { course: any, onClick: (course: any) => void, viewMode: string }) => {
  if (viewMode === 'grid') {
    return (
      <div 
        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative"
        onClick={() => onClick(course)}
      >
        <div className="absolute top-2 right-2 bg-purple-100 rounded-full p-1 z-10">
          <Award className="text-purple-600" size={16} />
        </div>
        <div className="h-36 bg-gray-50 relative overflow-hidden">
          <img src={course.imgUrl} alt={course.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{course.title}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Check className="mr-1" size={12} /> Certificado
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
          
          <div className="text-xs text-gray-600 mb-2">
            <div className="flex items-center">
              <Calendar className="mr-1" size={12} />
              <span>Emitido: {new Date(course.certificate.issueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center mt-1">
              <Info className="mr-1" size={12} />
              <span>ID: {course.certificate.credentialID}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3 text-sm">
            <span className="text-gray-500">{course.category}</span>
            <span className="text-purple-600 font-medium flex items-center">
              Ver Certificado <ChevronRight className="ml-1" size={16} />
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div 
        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative"
        onClick={() => onClick(course)}
      >
        <div className="absolute top-4 right-4 bg-purple-100 rounded-full p-1 z-10">
          <Award className="text-purple-600" size={14} />
        </div>
        <div className="p-4 flex">
          <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden">
            <img src={course.imgUrl} alt={course.title} className="w-full h-full object-cover" />
          </div>
          <div className="ml-4 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Check className="mr-1" size={12} /> Certificado
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">{course.description}</p>
            <div className="flex flex-wrap gap-x-4 text-xs text-gray-600">
              <div className="flex items-center">
                <Calendar className="mr-1" size={12} />
                <span>Emitido: {new Date(course.certificate.issueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Info className="mr-1" size={12} />
                <span>ID: {course.certificate.credentialID}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between items-end ml-4 text-sm">
            <span className="text-gray-500">{course.category}</span>
            <span className="text-purple-600 font-medium flex items-center">
              Ver Certificado <ChevronRight className="ml-1" size={16} />
            </span>
          </div>
        </div>
      </div>
    );
  }
};

export default CertificateItem;