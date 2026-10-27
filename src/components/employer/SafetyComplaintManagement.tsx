import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  UserCheck, 
  FileText, 
  MapPin, 
  Image, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafetyReport, SafetyStatus, SafetySeverity } from '../../types';

export const SafetyComplaintManagement: React.FC = () => {
  const { industry, safetyReports, updateSafetyReportStatus, language } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<SafetyStatus>('in_progress');
  const [assigneeInput, setAssigneeInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  const industryReports = safetyReports.filter(r => r.industry === industry);

  const filteredReports = industryReports.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || r.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  const activeReport = industryReports.find(r => r.id === activeReportId);

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReportId) return;

    updateSafetyReportStatus(activeReportId, newStatus, notesInput, assigneeInput);
    setActiveReportId(null);
    setNotesInput('');
    setAssigneeInput('');
  };

  const openStatusModal = (r: SafetyReport) => {
    setActiveReportId(r.id);
    setNewStatus(r.status);
    setAssigneeInput(r.assignedTo || '');
    setNotesInput(r.resolutionNotes || '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-red-400" />
            <span>{language === 'ta' ? 'பாதுகாப்பு புகார்கள் மேலாண்மை' : 'Safety Hazard Investigation & Audit'}</span>
          </h1>
          <p className="text-sm text-slate-400">
            Investigate reported worker hazards, assign inspectors, and log tamper-evident resolution records (UN SDG 8.8).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-teal-300">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Zero Retaliation Whistleblower Shield</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Filter Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Statuses ({industryReports.length})</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Filter Severity:</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Severities</option>
              <option value="critical_emergency">Critical Emergency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-white">{filteredReports.length}</strong> reports
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map(report => (
          <div
            key={report.id}
            className={`border rounded-2xl p-5 shadow-xl space-y-3 transition ${
              report.severity === 'critical_emergency'
                ? 'bg-red-950/20 border-red-500/50'
                : report.status === 'resolved'
                ? 'bg-slate-900/60 border-slate-800'
                : 'bg-slate-900/90 border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-400">{report.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    report.severity === 'critical_emergency'
                      ? 'bg-red-600 text-white animate-pulse'
                      : report.severity === 'high'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {report.severity.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400 text-xs">• {report.category.replace('_', ' ')}</span>
                </div>
                <h3 className="text-base font-bold text-white">{report.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {report.location} ({report.department})
                  </span>
                  <span>• Reported by: {report.workerName}</span>
                </div>
              </div>

              {/* Status Badge & Action Button */}
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  report.status === 'resolved'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : report.status === 'in_progress'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {report.status.replace('_', ' ')}
                </span>
                <button
                  onClick={() => openStatusModal(report)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Manage Status
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {report.description}
            </p>

            {report.photoUrl && (
              <div className="flex items-center gap-2 text-xs text-teal-400">
                <Image className="w-4 h-4" />
                <a 
                  href={report.photoUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:underline flex items-center gap-1"
                >
                  View Attached Hazard Photo Evidence <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Audit & Resolution Notes */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
              <div>
                Assigned Inspector: <strong className="text-slate-200">{report.assignedTo || 'Unassigned'}</strong>
              </div>
              {report.resolutionNotes && (
                <div className="text-emerald-300 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20">
                  <strong>Action:</strong> {report.resolutionNotes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Manage Status Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-400" />
                <span>Update Safety Complaint Audit ({activeReport.id})</span>
              </h3>
              <button
                onClick={() => setActiveReportId(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Update Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as SafetyStatus)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                >
                  <option value="submitted">Submitted (Awaiting Review)</option>
                  <option value="under_review">Under Review</option>
                  <option value="in_progress">In Progress (Corrective Work Scheduled)</option>
                  <option value="resolved">Resolved (Corrective Action Complete)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Safety Officer / Engineer:</label>
                <input
                  type="text"
                  value={assigneeInput}
                  onChange={(e) => setAssigneeInput(e.target.value)}
                  placeholder="e.g., S. Natarajan (Site Safety Officer)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Resolution & Corrective Audit Notes:</label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Detail the physical corrective action taken (e.g. Scaffolding re-coupled and re-certified for weight limit)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveReportId(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl"
                >
                  Save Status & Audit Trail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
