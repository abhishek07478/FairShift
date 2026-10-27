import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Check, 
  X, 
  Shield, 
  Building2, 
  Phone, 
  Calendar, 
  DollarSign,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkerProfile } from '../../types';

export const WorkerManagement: React.FC<{ onSelectWorkerPassport?: (workerId: string) => void }> = ({ 
  onSelectWorkerPassport 
}) => {
  const { 
    industry, 
    workers, 
    addWorker, 
    updateWorkerWageRate, 
    toggleWorkerStatus, 
    language 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);
  const [editRateValue, setEditRateValue] = useState<number>(140);

  // New worker form state
  const [newName, setNewName] = useState('');
  const [newNameTamil, setNewNameTamil] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newPhone, setNewPhone] = useState('+91 9');
  const [newRate, setNewRate] = useState<number>(industry === 'construction' ? 140 : 125);

  const industryWorkers = workers.filter(w => w.industry === industry);

  const departments = Array.from(new Set(industryWorkers.map(w => w.department)));

  const filteredWorkers = industryWorkers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === 'all' || w.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const handleAddWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) return;

    addWorker({
      name: newName,
      nameTamil: newNameTamil || undefined,
      role: newRole,
      industry,
      department: newDept || (industry === 'construction' ? 'General Civil' : 'Campus Maintenance'),
      phone: newPhone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      hourlyRate: Number(newRate),
      joinedDate: new Date().toISOString().split('T')[0],
      activeStatus: 'active',
      dailyTargetHours: 8,
      badgeNumber: `${industry === 'construction' ? 'CONST' : 'CAMPUS'}-2026-${Math.floor(100 + Math.random() * 900)}`,
    });

    setNewName('');
    setNewNameTamil('');
    setNewRole('');
    setShowAddModal(false);
  };

  const startEditRate = (w: WorkerProfile) => {
    setEditingWorkerId(w.id);
    setEditRateValue(w.hourlyRate);
  };

  const saveEditRate = (workerId: string) => {
    updateWorkerWageRate(workerId, Number(editRateValue));
    setEditingWorkerId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-teal-400" />
            <span>{language === 'ta' ? 'தொழிலாளர் பட்டியல் & நிர்வாகம்' : 'Worker Directory & Wage Management'}</span>
          </h1>
          <p className="text-sm text-slate-400">
            Maintain authorized rosters, configure statutory hourly rates, and enforce UN SDG 8 fair wage compliance.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-teal-500/25 transition cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Worker</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search worker name, badge, trade..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Departments ({industryWorkers.length})</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Workers Roster Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Worker Profile</th>
                <th className="pb-3 px-3">Trade / Role</th>
                <th className="pb-3 px-3">Department</th>
                <th className="pb-3 px-3">Base Wage Rate</th>
                <th className="pb-3 px-3">Overtime Rate (1.5×)</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredWorkers.map(w => (
                <tr key={w.id} className="hover:bg-slate-800/40 transition">
                  {/* Profile */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={w.avatar}
                        alt={w.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-white text-xs">{w.name}</div>
                        <div className="text-[10px] font-mono text-teal-400">{w.badgeNumber}</div>
                      </div>
                    </div>
                  </td>

                  {/* Trade */}
                  <td className="py-3 px-3 text-slate-200 font-medium">
                    {w.role}
                  </td>

                  {/* Department */}
                  <td className="py-3 px-3 text-slate-400">
                    {w.department}
                  </td>

                  {/* Wage Rate (Inline Editable) */}
                  <td className="py-3 px-3">
                    {editingWorkerId === w.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editRateValue}
                          onChange={(e) => setEditRateValue(Number(e.target.value))}
                          className="w-20 px-2 py-1 bg-slate-950 border border-teal-500 rounded text-xs text-white"
                          min={80}
                          max={1000}
                        />
                        <button
                          onClick={() => saveEditRate(w.id)}
                          className="p-1 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded cursor-pointer"
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </button>
                        <button
                          onClick={() => setEditingWorkerId(null)}
                          className="p-1 bg-slate-800 text-slate-400 rounded cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>₹{w.hourlyRate}/hr</span>
                        <button
                          onClick={() => startEditRate(w)}
                          className="text-slate-500 hover:text-teal-400 p-0.5 rounded cursor-pointer"
                          title="Edit wage rate"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Overtime Rate */}
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">
                    ₹{w.hourlyRate * 1.5}/hr
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3 px-3">
                    <button
                      onClick={() => toggleWorkerStatus(w.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                        w.activeStatus === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                    >
                      {w.activeStatus.replace('_', ' ')}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onSelectWorkerPassport && (
                        <button
                          onClick={() => onSelectWorkerPassport(w.id)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Award className="w-3 h-3" />
                          <span>Passport</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Worker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-400" />
                <span>Register New Worker Account</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddWorkerSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Worker Full Name:</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Anbarasan K"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tamil Name (Optional):</label>
                  <input
                    type="text"
                    value={newNameTamil}
                    onChange={(e) => setNewNameTamil(e.target.value)}
                    placeholder="e.g., அன்பரசன் கே"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trade / Job Title:</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g., Master Welder / Security Guard"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department:</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    placeholder="e.g., Structural Steel & Rigging"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Base Hourly Wage (₹/hr):</label>
                  <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                    min={80}
                    max={1000}
                    required
                  />
                  <span className="text-[10px] text-teal-400 mt-0.5 block">
                    OT will be auto-calculated at ₹{newRate * 1.5}/hr
                  </span>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone:</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl"
                >
                  Register Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
