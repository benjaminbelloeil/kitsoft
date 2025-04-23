import { FiDatabase, FiActivity } from "react-icons/fi";

export default function AdminDashboard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
        <div className="bg-purple-100 p-2 rounded-lg mr-3">
          <FiDatabase className="text-purple-600" />
        </div>
        Datos y Configuraciones
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col p-6 rounded-xl border border-gray-200 bg-white transition-all hover:shadow-md hover:border-gray-300">
          <div className="flex items-center mb-4">
            <span className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <FiActivity size={20} />
            </span>
            <h3 className="ml-3 font-medium text-lg">Reportes</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Genera y exporta reportes del sistema
          </p>
        </div>
        
        <div className="flex items-center justify-center p-6 rounded-xl border border-gray-200 bg-gray-50">
          <p className="text-gray-500 text-center">
            Más funcionalidades próximamente...
          </p>
        </div>
      </div>
    </div>
  );
}
