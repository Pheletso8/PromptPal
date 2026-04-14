import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import AdminLayout from '../components/AdminLayout';
import { Trash2, Power, Edit3, Plus, Mail, X, Save } from 'lucide-react';

const UserDirectory = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editUser, setEditUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await api.adminToggleUserStatus(id);
      setUsers(users.map(u => u._id === id ? { ...u, disabled: !u.disabled } : u));
    } catch (error) {
      alert("Failed to toggle status");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this user?")) {
      try {
        await api.adminDeleteUser(id);
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updated = await api.adminUpdateUser(editUser._id, {
        name: editUser.name,
        email: editUser.email
      });
      setUsers(users.map(u => u._id === updated._id ? updated : u));
      setEditUser(null);
    } catch (error) {
      alert("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const SkeletonRow = () => (
    <tr className="border-b border-brand-primary/5">
      <td className="px-8 py-6">
        <div className="flex items-center gap-5 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-brand-primary/5" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-brand-primary/10 rounded-full" />
            <div className="w-16 h-2 bg-brand-primary/5 rounded-full" />
          </div>
        </div>
      </td>
      <td className="px-8 py-6"><div className="w-20 h-6 bg-brand-primary/5 rounded-full animate-pulse" /></td>
      <td className="px-8 py-6"><div className="w-20 h-6 bg-brand-primary/5 rounded-full animate-pulse" /></td>
      <td className="px-8 py-6"><div className="w-24 h-6 bg-brand-primary/5 rounded-full mx-auto animate-pulse" /></td>
    </tr>
  );

  return (
    <AdminLayout title="STAFF DIRECTORY" subtitle={isLoading ? "Loading..." : `${users.length} STUDENTS`}>
      <div className="flex items-center justify-between mb-10">
        <div className="flex-1 max-w-2xl relative">
          <input 
            type="text" 
            placeholder="Search staff by email..." 
            className="w-full pl-14 pr-6 py-5 rounded-full border border-brand-primary/10 bg-white shadow-sm focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all text-sm font-bold text-brand-text"
          />
          <Mail className="w-6 h-6 text-brand-text/30 absolute left-6 top-1/2 -translate-y-1/2" />
        </div>
        <button className="px-8 py-4 bg-brand-primary hover:opacity-90 text-white rounded-2xl transition-all flex items-center gap-3 font-black italic uppercase tracking-widest shadow-xl shadow-brand-primary/20">
          <Plus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      <div className="bg-brand-secondary/5 backdrop-blur-md rounded-[2rem] p-2 shadow-sm border border-brand-primary/10">
        <div className="overflow-x-auto bg-white rounded-[1.8rem] shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="uppercase bg-brand-secondary/10 text-[10px] font-black tracking-[0.2em] text-brand-text/50">
                <th className="px-8 py-6 rounded-tl-[1.8rem]">Staff Member</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-center rounded-tr-[1.8rem]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : (
                <>
                  {users.map((user) => (
                    <tr key={user._id} className={`border-b border-brand-primary/5 last:border-0 hover:bg-brand-secondary/5 transition-colors ${user.disabled ? 'opacity-50' : ''}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-full border border-brand-primary/10 bg-brand-secondary/5 flex items-center justify-center shadow-sm shrink-0">
                            <span className="font-black text-brand-primary">{user.name?.[0] || 'A'}</span>
                          </div>
                          <div>
                            <p className="font-black italic text-brand-text mb-0.5">{user.name}</p>
                            <p className="text-[10px] text-brand-text/40 tracking-[0.1em] font-black">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-4 py-1.5 bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase rounded-full tracking-widest border border-amber-500/20">
                          {user.role === 'admin' ? 'ADMIN' : 'STUDENT'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {user.disabled ? (
                          <span className="px-4 py-1.5 bg-red-500/10 text-red-600 text-[10px] font-black uppercase rounded-full tracking-widest border border-red-500/20">
                            DISABLED
                          </span>
                        ) : (
                          <span className="px-4 py-1.5 bg-green-500/10 text-green-600 text-[10px] font-black uppercase rounded-full tracking-widest border border-green-500/20">
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-6">
                          <button onClick={() => handleToggleStatus(user._id)} className={`${user.disabled ? 'text-green-500' : 'text-amber-500'} hover:scale-110 transition-transform`} title={user.disabled ? "Enable" : "Suspend"}>
                            <Power className="w-5 h-5" />
                          </button>
                          <button onClick={() => setEditUser(user)} className="text-brand-text/40 hover:text-brand-primary hover:scale-110 transition-transform"><Edit3 className="w-5 h-5" /></button>
                          <button onClick={() => handleDelete(user._id)} className="text-red-400 hover:text-red-500 hover:scale-110 transition-transform"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-brand-text/40 font-bold italic">No students found.</td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-brand-bg/60 animate-in fade-in">
          <div className="bg-white border border-brand-primary/10 w-full max-w-md rounded-[2.5rem] shadow-2xl relative">
            <div className="p-8 border-b border-brand-primary/5 flex justify-between items-center bg-brand-secondary/5 rounded-t-[2.5rem]">
              <h2 className="text-2xl font-black italic text-brand-text">Edit <span className="text-brand-primary">Student</span></h2>
              <button onClick={() => setEditUser(null)} className="p-2 hover:bg-white rounded-full transition-colors"><X className="w-6 h-6 text-brand-text/40" /></button>
            </div>
            <form onSubmit={submitEdit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 px-1">Full Name</label>
                <input required value={editUser.name} onChange={(e) => setEditUser({...editUser, name: e.target.value})} className="w-full bg-brand-secondary/5 border border-brand-primary/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary/50 text-brand-text font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 px-1">Email Details</label>
                <input required type="email" value={editUser.email} onChange={(e) => setEditUser({...editUser, email: e.target.value})} className="w-full bg-brand-secondary/5 border border-brand-primary/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary/50 text-brand-text font-bold" />
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="px-8 py-4 bg-brand-primary hover:opacity-90 disabled:opacity-50 text-white rounded-2xl font-black italic uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-brand-primary/20">
                  <Save className="w-5 h-5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default UserDirectory;
