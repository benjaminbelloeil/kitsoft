'use client';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Tabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-md mb-6">
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Mis Proyectos
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
