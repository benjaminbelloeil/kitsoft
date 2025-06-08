"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiRefreshCw, FiActivity, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

interface WorkloadStats {
  peopleLeadsCount: number;
  teamMembersCount: number;
  recentNotifications: {
    lowWorkload: number;
    overload: number;
    total: number;
  };
  lastWeek: string;
}

export default function WorkloadMonitoringDashboard() {
  const [stats, setStats] = useState<WorkloadStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications/workload-check');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setMessage('Error al cargar las estadísticas');
      }
    } catch (error) {
      console.error('Error fetching workload stats:', error);
      setMessage('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerWorkloadCheck = async () => {
    setIsChecking(true);
    setMessage(null);
    try {
      const response = await fetch('/api/notifications/workload-check', {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage(`Verificación completada: ${data.processed} usuarios procesados, ${data.notifications} notificaciones enviadas`);
        setLastCheck(new Date().toLocaleString());
        // Refresh stats after check
        await fetchStats();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error triggering workload check:', error);
      setMessage('Error al ejecutar la verificación');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <motion.h2 
        className="text-xl font-semibold mb-6 flex items-center text-gray-800"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.div 
          className="bg-blue-100 p-2 rounded-lg mr-3"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FiActivity className="text-blue-600" />
        </motion.div>
        Monitoreo de Carga de Trabajo
      </motion.h2>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div 
            className="p-4 rounded-lg bg-blue-50 border border-blue-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">People Leads</p>
                <p className="text-2xl font-bold text-blue-700">{stats.peopleLeadsCount}</p>
              </div>
              <FiUsers className="text-blue-500" size={24} />
            </div>
          </motion.div>

          <motion.div 
            className="p-4 rounded-lg bg-green-50 border border-green-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Miembros del Equipo</p>
                <p className="text-2xl font-bold text-green-700">{stats.teamMembersCount}</p>
              </div>
              <FiUsers className="text-green-500" size={24} />
            </div>
          </motion.div>

          <motion.div 
            className="p-4 rounded-lg bg-amber-50 border border-amber-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Notificaciones (7 días)</p>
                <p className="text-2xl font-bold text-amber-700">{stats.recentNotifications.total}</p>
              </div>
              <FiAlertTriangle className="text-amber-500" size={24} />
            </div>
          </motion.div>
        </div>
      )}

      {/* Recent Notifications Breakdown */}
      {stats && stats.recentNotifications.total > 0 && (
        <motion.div 
          className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h3 className="text-sm font-medium text-gray-700 mb-3">Desglose de Notificaciones (Últimos 7 días)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Baja carga: {stats.recentNotifications.lowWorkload}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Sobrecarga: {stats.recentNotifications.overload}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          onClick={fetchStats}
          disabled={isLoading}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Cargando...' : 'Actualizar Estadísticas'}
        </motion.button>

        <motion.button
          onClick={triggerWorkloadCheck}
          disabled={isChecking}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiCheckCircle className={`mr-2 ${isChecking ? 'animate-pulse' : ''}`} />
          {isChecking ? 'Verificando...' : 'Ejecutar Verificación'}
        </motion.button>
      </div>

      {/* Message Display */}
      {message && (
        <motion.div 
          className={`mt-4 p-3 rounded-lg ${
            message.includes('Error') 
              ? 'bg-red-50 border border-red-200 text-red-700' 
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm">{message}</p>
        </motion.div>
      )}

      {/* Last Check Time */}
      {lastCheck && (
        <motion.div 
          className="mt-3 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          Última verificación manual: {lastCheck}
        </motion.div>
      )}

      {/* Info */}
      <motion.div 
        className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <p className="text-xs text-blue-600">
          <strong>Configuración automática:</strong> Las verificaciones se ejecutan automáticamente cada lunes a las 9:00 AM.
          Se envían notificaciones a People Leads cuando los miembros de su equipo tienen:
        </p>
        <ul className="text-xs text-blue-600 mt-1 ml-4">
          <li>• Carga de trabajo menor al 50% (baja carga)</li>
          <li>• Carga de trabajo mayor al 80% (sobrecarga)</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
