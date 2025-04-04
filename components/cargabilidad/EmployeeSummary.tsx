'use client';

import { FiActivity, FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';
import { CircularProgress } from './CircularProgress';

interface Props {
  name: string;
  role: string;
  totalLoad: number;
  totalUsedHours: number;
  availableHours: number;
  totalHoursPerWeek: number;
}

export const EmployeeSummary = ({
  name,
  role,
  totalLoad,
  totalUsedHours,
  availableHours,
  totalHoursPerWeek,
}: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <FiFileText className="text-indigo-600" />
            Mi Cargabilidad
          </h1>
          <p className="text-gray-500 mt-1">{name} - {role}</p>
        </div>

        <div className="mt-4 md:mt-0">
          <CircularProgress value={totalLoad} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryItem icon={<FiActivity />} title="Carga Total" value={`${totalLoad.toFixed(1)}%`} color="indigo" />
        <SummaryItem icon={<FiClock />} title="Horas Asignadas" value={`${totalUsedHours} de ${totalHoursPerWeek}h`} color="blue" />
        <SummaryItem icon={<FiCheckCircle />} title="Horas Disponibles" value={`${availableHours}h`} color={availableHours >= 0 ? 'green' : 'red'} />
      </div>
    </div>
  );
};

const SummaryItem = ({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) => (
  <div className={`bg-${color}-50 p-4 rounded-lg flex items-center gap-3`}>
    <div className={`p-2 bg-${color}-100 rounded-full text-${color}-600`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{title}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);
