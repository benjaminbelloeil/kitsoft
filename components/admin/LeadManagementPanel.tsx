"use client";

import { motion } from "framer-motion";
import { FiUserPlus, FiMail, FiPhone, FiCalendar, FiDollarSign, FiTrendingUp } from "react-icons/fi";

export default function LeadManagementPanel() {
  // Mock data for leads
  const leads = [
    {
      id: 1,
      name: "Empresa ABC S.A.",
      contact: "María González",
      email: "maria.gonzalez@empresaabc.com",
      phone: "+52 55 1234-5678",
      status: "Nuevo",
      value: "$50,000",
      date: "2025-05-25",
      priority: "Alta"
    },
    {
      id: 2,
      name: "Tech Solutions Ltd.",
      contact: "Carlos Rivera",
      email: "carlos@techsolutions.com",
      phone: "+52 55 8765-4321",
      status: "Seguimiento",
      value: "$75,000",
      date: "2025-05-20",
      priority: "Media"
    },
    {
      id: 3,
      name: "Innovación Digital",
      contact: "Ana Martínez",
      email: "ana@innovaciondigital.mx",
      phone: "+52 55 5555-0123",
      status: "Propuesta",
      value: "$120,000",
      date: "2025-05-18",
      priority: "Alta"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nuevo": return "bg-blue-100 text-blue-800";
      case "Seguimiento": return "bg-yellow-100 text-yellow-800";
      case "Propuesta": return "bg-purple-100 text-purple-800";
      case "Cerrado": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-100 text-red-800";
      case "Media": return "bg-orange-100 text-orange-800";
      case "Baja": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 admin-content-panel" 
      id="admin-panel-leads" 
      style={{ display: 'none' }} // Initially hidden
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center">
          <motion.div 
            className="bg-blue-100 p-2 rounded-lg mr-3"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FiUserPlus className="text-2xl text-blue-600" />
          </motion.div>
          <div>
            <motion.h2 
              className="text-xl font-semibold text-gray-800"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              Gestión de Leads
            </motion.h2>
            <motion.p 
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              Administra y da seguimiento a los leads comerciales
            </motion.p>
          </div>
        </div>
        
        <motion.button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiUserPlus className="mr-2" />
          Nuevo Lead
        </motion.button>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {[
          { title: "Total Leads", value: "3", icon: FiUserPlus, color: "blue" },
          { title: "En Seguimiento", value: "1", icon: FiTrendingUp, color: "yellow" },
          { title: "Propuestas", value: "1", icon: FiCalendar, color: "purple" },
          { title: "Valor Total", value: "$245K", icon: FiDollarSign, color: "green" }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white border border-gray-200 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-center">
              <motion.div 
                className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 mr-3`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <stat.icon size={20} />
              </motion.div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Leads Table */}
      <motion.div 
        className="bg-gray-50 rounded-lg p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lista de Leads</h3>
        
        <div className="space-y-3">
          {leads.map((lead, index) => (
            <motion.div
              key={lead.id}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" 
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-semibold text-gray-800 mr-3">{lead.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getPriorityColor(lead.priority)}`}>
                      {lead.priority}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FiMail className="mr-1" size={14} />
                      {lead.email}
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="mr-1" size={14} />
                      {lead.phone}
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="mr-1" size={14} />
                      {lead.date}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-green-600">{lead.value}</span>
                  <motion.button
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Ver Detalles
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
