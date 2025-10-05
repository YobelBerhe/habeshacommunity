import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { Search, Filter, Download, Eye, Edit, MoreVertical, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage all registered users and their profiles</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 lg:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filterStatus === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Users
            </button>
            <button 
              onClick={() => setFilterStatus('verified')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filterStatus === 'verified' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Verified
            </button>
            <button 
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filterStatus === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Users Table - Desktop */}
        <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Location</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Joined</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-white font-bold text-sm">{user.display_name?.[0] || 'U'}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.display_name || 'Anonymous'}</p>
                          <p className="text-sm text-gray-500">{user.bio?.slice(0, 40)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.city && user.country ? `${user.city}, ${user.country}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Users Grid - Mobile */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl p-6 text-center text-gray-500">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center text-gray-500">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-bold">{user.display_name?.[0] || 'U'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{user.display_name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">{user.city && user.country ? `${user.city}, ${user.country}` : '-'}</p>
                    <p className="text-xs text-gray-400 mt-1">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                  <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
