"use client";

import { FiSettings } from "react-icons/fi";

export default function SettingsPanel() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 admin-content-panel" 
         id="admin-panel-settings" 
         style={{ display: 'none' }}> {/* Initially hidden */}
      <div className="flex items-center text-purple-800 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg mr-3">
          <FiSettings className="text-2xl text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Configuración del Sistema</h2>
          <p className="text-sm text-gray-500">Ajusta parámetros y preferencias generales</p>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-6 text-center bg-gray-50">
        <p className="text-gray-500">La configuración del sistema estará disponible próximamente.</p>
      </div>
    </div>
  );
}
