import React from 'react';
import { MapPin, TrendingUp } from 'lucide-react';

interface NoPathFoundProps {
  onStartQuestionnaire: () => void;
}

const NoPathFound: React.FC<NoPathFoundProps> = ({ onStartQuestionnaire }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center my-8">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
          <TrendingUp className="text-purple-600" size={32} />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-3">No has seleccionado una trayectoria profesional</h2>
      <p className="text-gray-600 mb-6 max-w-lg mx-auto">
        Selecciona una trayectoria profesional para visualizar tu progreso y acceder a recomendaciones de cursos personalizadas basadas en tus habilidades y objetivos.
      </p>
      
      <div className="flex flex-col items-center">
        <button
          onClick={onStartQuestionnaire}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
        >
          <MapPin size={18} />
          Encontrar mi trayectoria profesional
        </button>
        <p className="text-sm text-gray-500 mt-3">
          Te haremos algunas preguntas para recomendarte la mejor trayectoria para ti
        </p>
      </div>
    </div>
  );
};

export default NoPathFound;