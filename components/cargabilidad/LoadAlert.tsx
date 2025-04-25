'use client';

import { AlertCircle } from 'lucide-react';

interface LoadAlertProps {
  totalLoad: number;
  showAlways?: boolean;
}

export const LoadAlert = ({ totalLoad, showAlways = false }: LoadAlertProps) => {
  // Comprobar si hay baja carga (menos del 50%)
  const isUnderload = totalLoad < 50;
  
  // Si no hay baja carga y no se solicita mostrar siempre, no mostrar nada
  if (!isUnderload && !showAlways) {
    return null;
  }
  
  return (
    <div className="mb-4">
      {isUnderload && (
        <div className="flex items-center p-4 bg-blue-50 border-l-4 border-blue-400 rounded-md">
          <AlertCircle className="h-5 w-5 text-blue-500 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Carga baja</h3>
            <p className="text-sm text-blue-700 mt-1">
              La cargabilidad está por debajo del 50% ({Math.round(totalLoad)}%). 
              Considera tomar más proyectos o tareas.
            </p>
          </div>
        </div>
      )}
      
      {!isUnderload && showAlways && (
        <div className="flex items-center p-4 bg-green-50 border-l-4 border-green-400 rounded-md">
          <div className="h-5 w-5 bg-green-500 rounded-full mr-3 flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-800">Carga óptima</h3>
            <p className="text-sm text-green-700 mt-1">
              La cargabilidad está en un nivel óptimo ({Math.round(totalLoad)}%).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};