export default function EmptyProjectsState() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 className="text-xl font-medium mb-2 text-gray-800">No tienes proyectos asignados</h2>
      <p className="text-gray-500">Cuando el project manager te asigne proyectos, aparecerán aquí.</p>
    </div>
  );
}
