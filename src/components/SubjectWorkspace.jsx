import { useState, useMemo, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Cell,
} from 'recharts';
import {
  ArrowLeft, Video, FileText, HelpCircle, CalendarClock, Plus, Trash2, Edit3,
  Clock, Target, TrendingUp, CheckCircle, BookOpen, Award, Calendar,
} from 'lucide-react';
import { getSubjectData, setSubjectData, getFuturePlans, setFuturePlans } from '../utils/storage';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm shadow-xl">
      <p className="text-slate-300 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function SubjectWorkspace({ exam, subject, onBack }) {
  const [activeTab, setActiveTab] = useState('videos');
  const [data, setData] = useState(() => getSubjectData(exam, subject.id));
  const [futurePlans, setFuturePlansState] = useState(() => getFuturePlans(exam));

  useEffect(() => {
    setSubjectData(exam, subject.id, data);
  }, [data, exam, subject.id]);

  useEffect(() => {
    setFuturePlans(exam, futurePlans);
  }, [futurePlans, exam]);

  const tabs = [
    { id: 'videos', label: 'Video Lectures', icon: <Video className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'pyq', label: 'PYQ / Practice', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'planning', label: 'Future Planning', icon: <CalendarClock className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
            <h1 className="text-xl font-bold text-white">{subject.name}</h1>
          </div>
          <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'videos' && (
          <VideoLecturesTab data={data} setData={setData} />
        )}
        {activeTab === 'notes' && (
          <NotesTab data={data} setData={setData} />
        )}
        {activeTab === 'pyq' && (
          <PYQTab data={data} setData={setData} />
        )}
        {activeTab === 'planning' && (
          <PlanningTab plans={futurePlans} setPlans={setFuturePlansState} />
        )}
      </div>
    </div>
  );
}

function VideoLecturesTab({ data, setData }) {
  const today = new Date().toISOString().slice(0, 10);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', date: today, timeStudied: '', remarks: '' });

  const resetForm = () => {
    setForm({ title: '', date: today, timeStudied: '', remarks: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.timeStudied) return;
    const entry = {
      id: editingId || `vl_${Date.now()}`,
      title: form.title,
      date: form.date,
      timeStudied: parseInt(form.timeStudied),
      remarks: form.remarks,
    };
    if (editingId) {
      setData((prev) => ({
        ...prev,
        videoLectures: prev.videoLectures.map((v) => (v.id === editingId ? entry : v)),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        videoLectures: [...prev.videoLectures, entry],
      }));
    }
    resetForm();
  };

  const handleEdit = (entry) => {
    setForm({ title: entry.title, date: entry.date, timeStudied: entry.timeStudied.toString(), remarks: entry.remarks || '' });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setData((prev) => ({
      ...prev,
      videoLectures: prev.videoLectures.filter((v) => v.id !== id),
    }));
  };

  const totalHours = +(data.videoLectures.reduce((a, v) => a + v.timeStudied, 0) / 60).toFixed(1);

  const allDates = data.videoLectures.map((v) => v.date);
  const streak = calcStreak(allDates);

  const monthlyData = useMemo(() => {
    const map = {};
    data.videoLectures.forEach((v) => {
      const key = v.date.slice(0, 7);
      map[key] = (map[key] || 0) + v.timeStudied / 60;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => ({ month: k, hours: +v.toFixed(1) }));
  }, [data.videoLectures]);

  const heatmapData = useMemo(() => {
    const map = {};
    data.videoLectures.forEach((v) => {
      map[v.date] = (map[v.date] || 0) + v.timeStudied;
    });
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, minutes: map[key] || 0 });
    }
    return days;
  }, [data.videoLectures]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatBox icon={<Clock className="w-5 h-5 text-blue-400" />} label="Total Video Hours" value={totalHours} />
        <StatBox icon={<TrendingUp className="w-5 h-5 text-orange-400" />} label="Study Streak" value={`${streak} days`} />
        <StatBox icon={<BookOpen className="w-5 h-5 text-green-400" />} label="Total Lectures" value={data.videoLectures.length} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 text-sm">Monthly Video Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 text-sm">Study Heatmap (30 days)</h3>
          <div className="grid grid-cols-10 gap-1">
            {heatmapData.map((d) => {
              const intensity = Math.min(d.minutes / 120, 1);
              const bg = d.minutes === 0 ? 'bg-slate-700' :
                intensity < 0.25 ? 'bg-blue-900' :
                intensity < 0.5 ? 'bg-blue-700' :
                intensity < 0.75 ? 'bg-blue-500' : 'bg-blue-400';
              return (
                <div
                  key={d.date}
                  className={`${bg} rounded-sm aspect-square cursor-default`}
                  title={`${d.date}: ${d.minutes} min`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
            <span>Less</span>
            <div className="w-3 h-3 bg-slate-700 rounded-sm" />
            <div className="w-3 h-3 bg-blue-900 rounded-sm" />
            <div className="w-3 h-3 bg-blue-700 rounded-sm" />
            <div className="w-3 h-3 bg-blue-500 rounded-sm" />
            <div className="w-3 h-3 bg-blue-400 rounded-sm" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Add / Edit Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Lecture Entries</h3>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Entry
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="e.g. Graph Algorithms Lecture 12"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Time Studied (min) *</label>
              <input
                type="number"
                value={form.timeStudied}
                onChange={(e) => setForm({ ...form, timeStudied: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="e.g. 90"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Remarks</label>
              <input
                type="text"
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {editingId ? 'Update' : 'Save'}
            </button>
            <button type="button" onClick={resetForm} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Entries Table */}
      <div className="space-y-2">
        {[...data.videoLectures].sort((a, b) => b.date.localeCompare(a.date)).map((entry) => (
          <div key={entry.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:border-slate-600 transition-colors">
            <div className="flex-1">
              <div className="text-white font-medium text-sm">{entry.title}</div>
              <div className="flex gap-4 mt-1 text-xs text-slate-400">
                <span>{entry.date}</span>
                <span>{entry.timeStudied} min</span>
                {entry.remarks && <span className="text-slate-500">{entry.remarks}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(entry)} className="text-slate-400 hover:text-blue-400 p-1">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(entry.id)} className="text-slate-400 hover:text-red-400 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesTab({ data, setData }) {
  const today = new Date().toISOString().slice(0, 10);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ topic: '', date: today, timeSpent: '', completion: '' });

  const resetForm = () => {
    setForm({ topic: '', date: today, timeSpent: '', completion: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.topic || !form.date || !form.timeSpent || !form.completion) return;
    const entry = {
      id: editingId || `nt_${Date.now()}`,
      topic: form.topic,
      date: form.date,
      timeSpent: parseInt(form.timeSpent),
      completion: parseInt(form.completion),
    };
    if (editingId) {
      setData((prev) => ({
        ...prev,
        notes: prev.notes.map((n) => (n.id === editingId ? entry : n)),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        notes: [...prev.notes, entry],
      }));
    }
    resetForm();
  };

  const handleEdit = (entry) => {
    setForm({ topic: entry.topic, date: entry.date, timeSpent: entry.timeSpent.toString(), completion: entry.completion.toString() });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
  };

  const totalHours = +(data.notes.reduce((a, n) => a + n.timeSpent, 0) / 60).toFixed(1);
  const avgCompletion = data.notes.length
    ? Math.round(data.notes.reduce((a, n) => a + n.completion, 0) / data.notes.length)
    : 0;

  const monthlyData = useMemo(() => {
    const map = {};
    data.notes.forEach((n) => {
      const key = n.date.slice(0, 7);
      map[key] = (map[key] || 0) + n.timeSpent / 60;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => ({ month: k, hours: +v.toFixed(1) }));
  }, [data.notes]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatBox icon={<Clock className="w-5 h-5 text-purple-400" />} label="Total Note Hours" value={totalHours} />
        <StatBox icon={<CheckCircle className="w-5 h-5 text-green-400" />} label="Avg Completion" value={`${avgCompletion}%`} />
        <StatBox icon={<FileText className="w-5 h-5 text-blue-400" />} label="Total Sessions" value={data.notes.length} />
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6">
        <h3 className="text-white font-semibold mb-4 text-sm">Monthly Note Activity</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Hours" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Note Sessions</h3>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Session
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Topic *</label>
              <input type="text" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                placeholder="e.g. Dynamic Programming Notes" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Time Spent (min) *</label>
              <input type="number" value={form.timeSpent} onChange={(e) => setForm({ ...form, timeSpent: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                placeholder="e.g. 60" min="1" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Completion % *</label>
              <input type="number" value={form.completion} onChange={(e) => setForm({ ...form, completion: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                placeholder="e.g. 75" min="0" max="100" required />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {editingId ? 'Update' : 'Save'}
            </button>
            <button type="button" onClick={resetForm} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {[...data.notes].sort((a, b) => b.date.localeCompare(a.date)).map((entry) => (
          <div key={entry.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:border-slate-600 transition-colors">
            <div className="flex-1">
              <div className="text-white font-medium text-sm">{entry.topic}</div>
              <div className="flex gap-4 mt-1 text-xs text-slate-400">
                <span>{entry.date}</span>
                <span>{entry.timeSpent} min</span>
                <span className="text-purple-400">{entry.completion}% complete</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(entry)} className="text-slate-400 hover:text-purple-400 p-1">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(entry.id)} className="text-slate-400 hover:text-red-400 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PYQTab({ data, setData }) {
  const today = new Date().toISOString().slice(0, 10);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ date: today, topic: '', questionsAttempted: '', questionsCorrect: '', difficulty: 'Medium', remarks: '' });

  const resetForm = () => {
    setForm({ date: today, topic: '', questionsAttempted: '', questionsCorrect: '', difficulty: 'Medium', remarks: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.topic || !form.questionsAttempted || !form.questionsCorrect) return;
    const entry = {
      id: editingId || `pyq_${Date.now()}`,
      date: form.date,
      topic: form.topic,
      questionsAttempted: parseInt(form.questionsAttempted),
      questionsCorrect: parseInt(form.questionsCorrect),
      difficulty: form.difficulty,
      remarks: form.remarks,
    };
    if (editingId) {
      setData((prev) => ({
        ...prev,
        pyqPractice: prev.pyqPractice.map((p) => (p.id === editingId ? entry : p)),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        pyqPractice: [...prev.pyqPractice, entry],
      }));
    }
    resetForm();
  };

  const handleEdit = (entry) => {
    setForm({
      date: entry.date, topic: entry.topic,
      questionsAttempted: entry.questionsAttempted.toString(),
      questionsCorrect: entry.questionsCorrect.toString(),
      difficulty: entry.difficulty, remarks: entry.remarks || '',
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setData((prev) => ({
      ...prev,
      pyqPractice: prev.pyqPractice.filter((p) => p.id !== id),
    }));
  };

  const stats = useMemo(() => {
    const pyqs = data.pyqPractice;
    const totalQ = pyqs.reduce((a, p) => a + p.questionsAttempted, 0);
    const totalC = pyqs.reduce((a, p) => a + p.questionsCorrect, 0);
    const practiceDays = new Set(pyqs.map((p) => p.date)).size;
    const accuracy = totalQ ? Math.round((totalC / totalQ) * 100) : 0;
    const sorted = pyqs.map((p) => p.date).sort().reverse();
    const lastDate = sorted[0] || 'N/A';

    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const thisWeek = pyqs.filter((p) => new Date(p.date) >= weekAgo).reduce((a, p) => a + p.questionsAttempted, 0);
    const thisMonth = pyqs.filter((p) => new Date(p.date) >= monthAgo).reduce((a, p) => a + p.questionsAttempted, 0);

    return { totalQ, totalC, practiceDays, accuracy, lastDate, thisWeek, thisMonth };
  }, [data.pyqPractice]);

  const dailyData = useMemo(() => {
    const map = {};
    data.pyqPractice.forEach((p) => {
      if (!map[p.date]) map[p.date] = { date: p.date, questions: 0, correct: 0 };
      map[p.date].questions += p.questionsAttempted;
      map[p.date].correct += p.questionsCorrect;
    });
    return Object.values(map)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({ ...d, label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }));
  }, [data.pyqPractice]);

  const accuracyTrend = useMemo(() => {
    const map = {};
    data.pyqPractice.forEach((p) => {
      if (!map[p.date]) map[p.date] = { date: p.date, correct: 0, total: 0 };
      map[p.date].correct += p.questionsCorrect;
      map[p.date].total += p.questionsAttempted;
    });
    return Object.values(map)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({
        date: d.date,
        accuracy: d.total ? Math.round((d.correct / d.total) * 100) : 0,
        label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      }));
  }, [data.pyqPractice]);

  const topicData = useMemo(() => {
    const map = {};
    data.pyqPractice.forEach((p) => {
      map[p.topic] = (map[p.topic] || 0) + p.questionsAttempted;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [data.pyqPractice]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatBox icon={<Target className="w-5 h-5 text-green-400" />} label="Total Questions" value={stats.totalQ} />
        <StatBox icon={<Calendar className="w-5 h-5 text-blue-400" />} label="Practice Days" value={stats.practiceDays} />
        <StatBox icon={<Award className="w-5 h-5 text-yellow-400" />} label="Accuracy" value={`${stats.accuracy}%`} />
        <StatBox icon={<Calendar className="w-5 h-5 text-purple-400" />} label="Last Practice" value={stats.lastDate} />
        <StatBox icon={<TrendingUp className="w-5 h-5 text-cyan-400" />} label="This Week" value={stats.thisWeek} />
        <StatBox icon={<BarChart className="w-5 h-5 text-orange-400" />} label="This Month" value={stats.thisMonth} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 text-sm">Daily Question Count</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} interval={2} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="questions" fill="#10b981" radius={[4, 4, 0, 0]} name="Attempted" />
              <Bar dataKey="correct" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Correct" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 text-sm">Accuracy Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={accuracyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} interval={2} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="accuracy" stroke="#f59e0b" strokeWidth={2} dot={false} name="Accuracy %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6">
        <h3 className="text-white font-semibold mb-4 text-sm">Topic-wise Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topicData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94a3b8" fontSize={12} />
            <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={150} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Questions">
              {topicData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Practice Sessions</h3>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Session
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Topic *</label>
              <input type="text" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                placeholder="e.g. Previous Year 2025" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Questions Attempted *</label>
              <input type="number" value={form.questionsAttempted} onChange={(e) => setForm({ ...form, questionsAttempted: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" min="1" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Questions Correct *</label>
              <input type="number" value={form.questionsCorrect} onChange={(e) => setForm({ ...form, questionsCorrect: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" min="0" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Difficulty *</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Remarks</label>
              <input type="text" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500" placeholder="Optional" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {editingId ? 'Update' : 'Save'}
            </button>
            <button type="button" onClick={resetForm} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {[...data.pyqPractice].sort((a, b) => b.date.localeCompare(a.date)).map((entry) => {
          const acc = entry.questionsAttempted ? Math.round((entry.questionsCorrect / entry.questionsAttempted) * 100) : 0;
          return (
            <div key={entry.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:border-slate-600 transition-colors">
              <div className="flex-1">
                <div className="text-white font-medium text-sm">{entry.topic}</div>
                <div className="flex gap-4 mt-1 text-xs text-slate-400 flex-wrap">
                  <span>{entry.date}</span>
                  <span>{entry.questionsAttempted} attempted</span>
                  <span className="text-green-400">{entry.questionsCorrect} correct</span>
                  <span className="text-yellow-400">{acc}% accuracy</span>
                  <DifficultyBadge level={entry.difficulty} />
                  {entry.remarks && <span className="text-slate-500">{entry.remarks}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(entry)} className="text-slate-400 hover:text-green-400 p-1">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(entry.id)} className="text-slate-400 hover:text-red-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlanningTab({ plans, setPlans }) {
  const today = new Date().toISOString().slice(0, 10);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: today, task: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.task) return;
    setPlans((prev) => [
      ...prev,
      { id: `fp_${Date.now()}`, date: form.date, task: form.task, completed: false },
    ]);
    setForm({ date: '', task: '' });
    setShowForm(false);
  };

  const toggleComplete = (id) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p)));
  };

  const handleDelete = (id) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const upcoming = plans.filter((p) => !p.completed).sort((a, b) => a.date.localeCompare(b.date));
  const completed = plans.filter((p) => p.completed).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Future Plans</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Plan
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Task *</label>
              <input type="text" value={form.task} onChange={(e) => setForm({ ...form, task: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Watch DP Lecture" required />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Add
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Cancel
            </button>
          </div>
        </form>
      )}

      {upcoming.length > 0 && (
        <div className="mb-6">
          <h4 className="text-slate-300 text-sm font-medium mb-3">Upcoming ({upcoming.length})</h4>
          <div className="space-y-2">
            {upcoming.map((plan) => (
              <div key={plan.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:border-slate-600 transition-colors">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleComplete(plan.id)}
                    className="w-5 h-5 rounded border-2 border-slate-600 hover:border-cyan-400 transition-colors" />
                  <div>
                    <div className="text-white text-sm">{plan.task}</div>
                    <div className="text-xs text-slate-400">{plan.date}</div>
                  </div>
                </div>
                <button onClick={() => handleDelete(plan.id)} className="text-slate-400 hover:text-red-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h4 className="text-slate-300 text-sm font-medium mb-3">Completed ({completed.length})</h4>
          <div className="space-y-2">
            {completed.map((plan) => (
              <div key={plan.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleComplete(plan.id)}
                    className="w-5 h-5 rounded bg-cyan-600 border-2 border-cyan-600 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </button>
                  <div>
                    <div className="text-white text-sm line-through">{plan.task}</div>
                    <div className="text-xs text-slate-400">{plan.date}</div>
                  </div>
                </div>
                <button onClick={() => handleDelete(plan.id)} className="text-slate-400 hover:text-red-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {plans.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <CalendarClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No future plans yet. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <div className="mb-2">{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}

function DifficultyBadge({ level }) {
  const colors = {
    Easy: 'bg-green-900/50 text-green-300 border-green-700',
    Medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    Hard: 'bg-red-900/50 text-red-300 border-red-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs border ${colors[level] || ''}`}>
      {level}
    </span>
  );
}

function calcStreak(dates) {
  if (!dates.length) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    if (sorted[i] === expected.toISOString().slice(0, 10)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
