'use client';

import { useState } from 'react';
import { Edit3, Lock, Sparkles, Plus, Trash2, X } from 'lucide-react';
import api from '@/lib/axios';

interface UserManagementTableProps {
  users: Array<{
    id: string;
    email: string;
    role: string;
    emailVerified: boolean;
    createdAt: string;
  }>;
  loading: boolean;
  error: string | null;
  onUsersUpdate: () => void;
}

interface UserFormData {
  email: string;
  password: string;
  role: string;
}

const formatUserName = (email: string) => {
  const [localPart] = email.split('@');
  return localPart
    .split(/[._-]/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

export default function UserManagementTable({ users, loading, error, onUsersUpdate }: UserManagementTableProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState<UserFormData>({ email: '', password: '', role: 'USER' });
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  const resetForm = () => {
    setFormData({ email: '', password: '', role: 'USER' });
    setActionError('');
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionError('');

    try {
      await api.post('/auth/signup', formData);
      setShowAddModal(false);
      resetForm();
      onUsersUpdate();
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to add user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionError('');

    try {
      await api.put(`/users/${editingUser.id}`, { role: formData.role });
      setShowEditModal(false);
      resetForm();
      onUsersUpdate();
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${userId}`);
      onUsersUpdate();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({ email: user.email, password: '', role: user.role });
    setShowEditModal(true);
  };

  return (
    <>
      <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-softGlow">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">User Management</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Manage Registered Users</h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#b27548] to-[#8b5a3c] px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-105"
            >
              <Plus className="h-4 w-4" />
              Add User
            </button>
            <button
              onClick={onUsersUpdate}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#c0894e] via-[#b16c35] to-[#e2c99d] px-4 py-3 text-sm font-semibold text-[#1c1107] shadow-glow transition hover:brightness-105"
            >
              <Sparkles className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 text-center text-sm text-slate-400">
            Fetching live user data from the TechexaVision backend...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 text-center text-sm text-slate-300">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 text-center text-sm text-slate-400">
            No user records available. Ensure an admin JWT token is configured to access protected user data.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80 shadow-softGlow">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-800 transition hover:bg-slate-900/70">
                    <td className="px-5 py-4 text-white">{formatUserName(user.email)}</td>
                    <td className="px-5 py-4 text-slate-400">{user.email}</td>
                    <td className="px-5 py-4 text-slate-300">{user.role}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${user.emailVerified ? 'bg-emerald-500/15 text-emerald-200' : 'bg-amber-500/15 text-amber-200'}`}>
                        {user.emailVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="rounded-lg bg-[#b27548]/20 p-2 text-[#b27548] hover:bg-[#b27548]/30 transition"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="rounded-lg bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900/90 border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Add New User</h3>
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              {actionError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{actionError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b27548]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b27548]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b27548]/50"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#b27548] to-[#8b5a3c] hover:from-[#a06a42] hover:to-[#7a4f33] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                {submitting ? 'Adding...' : 'Add User'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900/90 border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Edit User Role</h3>
              <button
                onClick={() => { setShowEditModal(false); resetForm(); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="space-y-4">
              {actionError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{actionError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 bg-slate-800/30 border border-slate-600/30 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b27548]/50"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#b27548] to-[#8b5a3c] hover:from-[#a06a42] hover:to-[#7a4f33] disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                {submitting ? 'Updating...' : 'Update Role'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
