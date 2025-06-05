/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Plus } from 'lucide-react';

interface Role {
  id_rol: number;
  nombre: string;
  descripción: string;
}

interface Habilidad {
  id_habilidad: number;
  titulo: string;
}

interface TrajectoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const TrajectoryFormModal: React.FC<TrajectoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: new Date().toISOString().split('T')[0], // Today's date
    roles: [] as number[],
    habilidades: [] as number[],
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Search states for roles and skills
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Habilidad[]>([]);

  // Load roles and habilidades when modal opens
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [rolesResponse, habilidadesResponse] = await Promise.all([
        fetch('/api/project-manager/roles'),
        fetch('/api/skills/all'),
      ]);

      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);
      }

      if (habilidadesResponse.ok) {
        const habilidadesData = await habilidadesResponse.json();
        setHabilidades(habilidadesData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del proyecto/meta es requerido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (selectedRoles.length === 0) {
      newErrors.roles = 'Selecciona al menos un rol';
    }

    if (selectedSkills.length === 0) {
      newErrors.habilidades = 'Selecciona al menos una habilidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    const submitData = {
      ...formData,
      roles: selectedRoles.map(r => r.id_rol),
      habilidades: selectedSkills.map(h => h.id_habilidad),
    };

    // First, trigger the skeleton display
    onSubmit(submitData);
    handleClose();

    try {
      const response = await fetch('/api/trajectory/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const result = await response.json();
        // The skeleton will be hidden and data refreshed in the parent component
        console.log('Trajectory created successfully:', result);
      } else {
        const errorData = await response.json();
        console.error('Error creating trajectory:', errorData.message);
        // You might want to add error handling here to hide the skeleton and show an error
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // You might want to add error handling here to hide the skeleton and show an error
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      fecha_inicio: new Date().toISOString().split('T')[0],
      roles: [],
      habilidades: [],
    });
    setSelectedRoles([]);
    setSelectedSkills([]);
    setRoleSearchQuery('');
    setSkillSearchQuery('');
    setErrors({});
    onClose();
  };

  const handleAddRole = (role: Role) => {
    if (!selectedRoles.find(r => r.id_rol === role.id_rol)) {
      setSelectedRoles([...selectedRoles, role]);
      setRoleSearchQuery('');
    }
  };

  const handleRemoveRole = (roleId: number) => {
    setSelectedRoles(selectedRoles.filter(r => r.id_rol !== roleId));
  };

  const handleAddSkill = (skill: Habilidad) => {
    if (!selectedSkills.find(s => s.id_habilidad === skill.id_habilidad)) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillSearchQuery('');
    }
  };

  const handleRemoveSkill = (skillId: number) => {
    setSelectedSkills(selectedSkills.filter(s => s.id_habilidad !== skillId));
  };

  // Filter roles and skills based on search
  const filteredRoles = roles.filter(role => 
    role.nombre.toLowerCase().includes(roleSearchQuery.toLowerCase()) &&
    !selectedRoles.find(r => r.id_rol === role.id_rol)
  );

  const filteredSkills = habilidades.filter(skill => 
    skill.titulo.toLowerCase().includes(skillSearchQuery.toLowerCase()) &&
    !selectedSkills.find(s => s.id_habilidad === skill.id_habilidad)
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
      className="mt-6 bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden"
    >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Agregar Nueva Trayectoria Profesional
              </h3>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre del proyecto/meta */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Proyecto/Meta *
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Desarrollo de aplicación web full-stack"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción de la Trayectoria *
                </label>
                <textarea
                  id="descripcion"
                  rows={4}
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.descripcion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe los objetivos, metodología y resultados esperados de esta trayectoria..."
                />
                {errors.descripcion && (
                  <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                )}
              </div>

              {/* Roles Involucrados */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Roles Involucrados *
                </label>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                {/* Role Search Bar */}
                <div className="relative mb-4">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar y agregar roles..."
                    value={roleSearchQuery}
                    onChange={(e) => setRoleSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 pl-10 pr-4 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  
                  {/* Search Suggestions Dropdown */}
                  {roleSearchQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {filteredRoles.length > 0 ? (
                        filteredRoles.map((role) => (
                          <button
                            key={role.id_rol}
                            type="button"
                            onClick={() => handleAddRole(role)}
                            className="w-full flex items-center space-x-3 p-3 hover:bg-purple-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                          >
                            <Plus className="h-4 w-4 text-purple-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{role.nombre}</p>
                              {role.descripción && (
                                <p className="text-xs text-gray-500 truncate">{role.descripción}</p>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-500 text-center">
                          No se encontraron roles disponibles
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Roles Display */}
                <div className="min-h-[60px] max-h-32 overflow-y-auto">
                  {selectedRoles.length > 0 ? (
                    <div className="space-y-2">
                      {selectedRoles.map((role) => (
                        <div
                          key={role.id_rol}
                          className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{role.nombre}</p>
                            {role.descripción && (
                              <p className="text-xs text-gray-500 truncate">{role.descripción}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(role.id_rol)}
                            className="ml-3 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                      <Search className="h-6 w-6 mb-2 text-gray-400" />
                      <p className="text-sm font-medium">No hay roles seleccionados</p>
                      <p className="text-xs text-gray-400 text-center">Usa la barra de búsqueda para agregar roles</p>
                    </div>
                  )}
                </div>
                </div>
                {errors.roles && (
                  <p className="mt-1 text-sm text-red-600">{errors.roles}</p>
                )}
              </div>

              {/* Habilidades a Desarrollar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Habilidades a Desarrollar *
                </label>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                {/* Skills Search Bar */}
                <div className="relative mb-4">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar y agregar habilidades..."
                    value={skillSearchQuery}
                    onChange={(e) => setSkillSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 pl-10 pr-4 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  
                  {/* Search Suggestions Dropdown */}
                  {skillSearchQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {filteredSkills.length > 0 ? (
                        filteredSkills.map((skill) => (
                          <button
                            key={skill.id_habilidad}
                            type="button"
                            onClick={() => handleAddSkill(skill)}
                            className="w-full flex items-center space-x-3 p-3 hover:bg-purple-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                          >
                            <Plus className="h-4 w-4 text-purple-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{skill.titulo}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-500 text-center">
                          No se encontraron habilidades disponibles
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Skills Display */}
                <div className="min-h-[60px] max-h-32 overflow-y-auto">
                  {selectedSkills.length > 0 ? (
                    <div className="space-y-2">
                      {selectedSkills.map((skill) => (
                        <div
                          key={skill.id_habilidad}
                          className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{skill.titulo}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill.id_habilidad)}
                            className="ml-3 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                      <Search className="h-6 w-6 mb-2 text-gray-400" />
                      <p className="text-sm font-medium">No hay habilidades seleccionadas</p>
                      <p className="text-xs text-gray-400 text-center">Usa la barra de búsqueda para agregar habilidades</p>
                    </div>
                  )}
                </div>
                </div>
                {errors.habilidades && (
                  <p className="mt-1 text-sm text-red-600">{errors.habilidades}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 rounded-lg transition-colors flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    'Guardar Trayectoria'
                  )}
                </button>
              </div>
            </form>
          </div>
    </motion.div>
  );
};
export default TrajectoryFormModal;