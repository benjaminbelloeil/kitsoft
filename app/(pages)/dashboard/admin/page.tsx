/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { getUserCompleteProfile } from '@/utils/database/client/profileSync';
import { Usuario } from '@/interfaces/user';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailedProfiles, setDetailedProfiles] = useState<{[key: string]: any}>({});

  // Fetch users using our existing client-side functions
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Use the built-in client from our file system rather than creating a new one
        const { getAllUsersClient } = await import('@/utils/database/client');

        // If getAllUsersClient exists, use it
        if (typeof getAllUsersClient === 'function') {
          const usersData = await getAllUsersClient();
          processUsers(usersData || []);
        } else {
          // Fallback to direct Supabase query but using the existing client
          const supabase = createClient();
          const { data: usersData, error: usersError } = await supabase
            .from('usuarios')
            .select('*')
            .order('id_usuario');
          
          if (usersError) throw usersError;
          
          processUsers(usersData || []);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
        setLoading(false);
      }
    };

    // Process and validate users, then fetch detailed profiles
    const processUsers = async (usersData: any[]) => {
      // Filter out users without an ID to prevent errors
      const validUsers = usersData.filter(user => 
        user && (user.id_usuario || user.ID_Usuario)
      );
      
      setUsers(validUsers);
      
      // For each user, get their detailed profile
      const profiles: {[key: string]: any} = {};
      for (const user of validUsers) {
        try {
          // Handle both lowercase and uppercase ID fields
          const userId = user.id_usuario || user.ID_Usuario;
          if (userId) {
            const profile = await getUserCompleteProfile(userId);
            if (profile) {
              profiles[userId] = profile;
            }
          }
        } catch (profileError) {
          console.error(`Error fetching profile for user:`, profileError);
        }
      }
      
      setDetailedProfiles(profiles);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and system settings</p>
          
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="bg-purple-50 rounded-lg p-4 flex-1 min-w-[180px]">
              <div className="text-sm text-purple-600 mb-1">Total Users</div>
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 flex-1 min-w-[180px]">
              <div className="text-sm text-blue-600 mb-1">Active Profiles</div>
              <div className="text-2xl font-bold text-gray-900">
                {Object.keys(detailedProfiles).length}
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4 flex-1 min-w-[180px]">
              <div className="text-sm text-amber-600 mb-1">Incomplete Profiles</div>
              <div className="text-2xl font-bold text-gray-900">
                {users.length - Object.keys(detailedProfiles).length}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500">View and manage all users in the system</p>
        </div>
        
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#A100FF]"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-red-500 text-center">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  // Handle both lowercase and uppercase ID fields
                  const userId = user.id_usuario || user.ID_Usuario;
                  const profile = userId ? detailedProfiles[userId] : null;
                  
                  // Skip rendering users without IDs to prevent errors
                  if (!userId) return null;
                  
                  return (
                    <tr key={userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            {profile?.URL_Avatar ? (
                              <Image
                                src={profile.URL_Avatar}
                                alt={`${profile.Nombre || 'User'} ${profile.Apellido || ''}`}
                                className="h-10 w-10 rounded-full object-cover"
                                width={40}
                                height={40}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-medium">
                                {profile?.Nombre ? profile.Nombre.charAt(0) : '?'}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {profile?.Nombre && profile?.Apellido 
                                ? `${profile.Nombre} ${profile.Apellido}`
                                : 'Unnamed User'}
                            </div>
                            {profile?.correo && (
                              <div className="text-sm text-gray-500">
                                {profile.correo.Correo}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="font-mono">
                          {userId.length > 8 ? `${userId.substring(0, 8)}...` : userId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{profile?.Titulo || 'No title'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {profile?.telefono && profile.telefono.Numero ? (
                          <div className="text-sm text-gray-500">
                            {profile.telefono.Codigo_Pais} {profile.telefono.Numero}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">No phone</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {profile?.direccion && profile.direccion.Ciudad ? (
                          <div className="text-sm text-gray-500">
                            {profile.direccion.Ciudad}, {profile.direccion.Pais}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">No location</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/profile/${userId}`}
                          className="text-[#A100FF] hover:text-purple-900"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
