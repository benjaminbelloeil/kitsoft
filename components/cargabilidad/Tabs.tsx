'use client';

type TabOptions = 'projects' | 'dashboard';

interface Props {
  activeTab: TabOptions;
  setActiveTab: (tab: TabOptions) => void;
}

export const Tabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="w-full px-4 pt-4">
      <div className="flex gap-2 md:gap-4">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 
            ${activeTab === 'projects'
              ? 'bg-purple-100 text-purple-700 shadow-sm'
              : 'text-gray-500 hover:text-purple-600'}`}
        >
          Mis Proyectos
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 
            ${activeTab === 'dashboard'
              ? 'bg-purple-100 text-purple-700 shadow-sm'
              : 'text-gray-500 hover:text-purple-600'}`}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};