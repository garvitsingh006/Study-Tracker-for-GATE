import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import {
  BookOpen, Clock, Target, Flame, Calendar,
  RotateCcw, LayoutDashboard,
} from 'lucide-react';
import { getExamById } from '../utils/subjects';
import { getSubjectData } from '../utils/storage';

function calcStreak(dates) {
  if (!dates.length) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().slice(0, 10);
    if (sorted[i] === expectedStr) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function getHealthScore(data) {
  let score = 0;
  if (data.videoLectures.length > 0) score += 20;
  if (data.notes.length > 0) score += 20;
  if (data.pyqPractice.length > 0) score += 20;
  const recentVideos = data.videoLectures.filter((v) => {
    const d = new Date(v.date);
    const now = new Date();
    return (now - d) / (1000 * 60 * 60 * 24) <= 7;
  }).length;
  score += Math.min(recentVideos * 3, 20);
  const recentNotes = data.notes.filter((n) => {
    const d = new Date(n.date);
    const now = new Date();
    return (now - d) / (1000 * 60 * 60 * 24) <= 7;
  }).length;
  score += Math.min(recentNotes * 3, 20);
  return Math.min(score, 100);
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm shadow-xl">
      <p className="text-slate-300 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard({ exam, onSelectSubject, onSwitchExam }) {
  const examData = getExamById(exam);

  const subjectsWithStats = useMemo(() => {
    return examData.subjects.map((s) => {
      const data = getSubjectData(exam, s.id);
      const totalVideoMin = data.videoLectures.reduce((a, v) => a + v.timeStudied, 0);
      const totalNoteMin = data.notes.reduce((a, n) => a + n.timeSpent, 0);
      const totalQuestions = data.pyqPractice.reduce((a, p) => a + p.questionsAttempted, 0);
      const allDates = [
        ...data.videoLectures.map((v) => v.date),
        ...data.notes.map((n) => n.date),
        ...data.pyqPractice.map((p) => p.date),
      ];
      const lastActivity = allDates.length ? allDates.sort().reverse()[0] : null;
      const healthScore = getHealthScore(data);
      return {
        ...s,
        totalVideoHours: +(totalVideoMin / 60).toFixed(1),
        totalNoteHours: +(totalNoteMin / 60).toFixed(1),
        totalQuestions,
        lastActivity,
        healthScore,
      };
    });
  }, [exam]);

  const totalStudyHours = useMemo(() => {
    return subjectsWithStats.reduce((a, s) => a + s.totalVideoHours + s.totalNoteHours, 0).toFixed(1);
  }, [subjectsWithStats]);

  const totalQuestions = useMemo(() => {
    return subjectsWithStats.reduce((a, s) => a + s.totalQuestions, 0);
  }, [subjectsWithStats]);

  const activeSubjects = useMemo(() => {
    return subjectsWithStats.filter((s) => s.lastActivity).length;
  }, [subjectsWithStats]);

  const allDates = useMemo(() => {
    const dates = [];
    examData.subjects.forEach((s) => {
      const data = getSubjectData(exam, s.id);
      dates.push(...data.videoLectures.map((v) => v.date));
      dates.push(...data.notes.map((n) => n.date));
      dates.push(...data.pyqPractice.map((p) => p.date));
    });
    return dates;
  }, [exam]);

  const overallStreak = calcStreak(allDates);
  const lastStudyDate = allDates.length ? allDates.sort().reverse()[0] : 'N/A';

  const weeklyData = useMemo(() => {
    const weekMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      weekMap[key] = { date: key, hours: 0, questions: 0 };
    }
    examData.subjects.forEach((s) => {
      const data = getSubjectData(exam, s.id);
      data.videoLectures.forEach((v) => {
        if (weekMap[v.date]) weekMap[v.date].hours += v.timeStudied / 60;
      });
      data.notes.forEach((n) => {
        if (weekMap[n.date]) weekMap[n.date].hours += n.timeSpent / 60;
      });
      data.pyqPractice.forEach((p) => {
        if (weekMap[p.date]) weekMap[p.date].questions += p.questionsAttempted;
      });
    });
    return Object.values(weekMap).map((d) => ({
      ...d,
      hours: +d.hours.toFixed(1),
      label: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    }));
  }, [exam]);

  const monthlyData = useMemo(() => {
    const monthMap = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      monthMap[key] = { date: key, hours: 0 };
    }
    examData.subjects.forEach((s) => {
      const data = getSubjectData(exam, s.id);
      data.videoLectures.forEach((v) => {
        if (monthMap[v.date]) monthMap[v.date].hours += v.timeStudied / 60;
      });
      data.notes.forEach((n) => {
        if (monthMap[n.date]) monthMap[n.date].hours += n.timeSpent / 60;
      });
    });
    return Object.values(monthMap).map((d) => ({
      ...d,
      hours: +d.hours.toFixed(1),
      label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [exam]);

  const radarData = useMemo(() => {
    return subjectsWithStats.map((s) => ({
      subject: s.shortName,
      score: s.healthScore,
    }));
  }, [subjectsWithStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">GATE 2027</span>
              <span className="text-slate-400 text-sm ml-2">/ {examData.name}</span>
            </h1>
          </div>
          <button
            onClick={onSwitchExam}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm bg-slate-800 px-3 py-2 rounded-lg border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            Switch Exam
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon={<Clock className="w-5 h-5" />} label="Total Study Hours" value={totalStudyHours} color="text-blue-400" />
          <StatCard icon={<Target className="w-5 h-5" />} label="Questions Solved" value={totalQuestions} color="text-green-400" />
          <StatCard icon={<BookOpen className="w-5 h-5" />} label="Active Subjects" value={activeSubjects} color="text-purple-400" />
          <StatCard icon={<Flame className="w-5 h-5" />} label="Overall Streak" value={`${overallStreak}d`} color="text-orange-400" />
          <StatCard icon={<Calendar className="w-5 h-5" />} label="Last Study" value={lastStudyDate} color="text-cyan-400" />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Weekly Study Hours">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Monthly Study Progress">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} interval={4} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="hours" stroke="#06b6d4" strokeWidth={2} dot={false} name="Hours" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ChartCard title="Subject Comparison" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectsWithStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="shortName" stroke="#94a3b8" fontSize={10} angle={-30} textAnchor="end" height={60} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="totalVideoHours" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Video Hours" />
                <Bar dataKey="totalNoteHours" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Note Hours" />
                <Bar dataKey="totalQuestions" fill="#10b981" radius={[4, 4, 0, 0]} name="Questions" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Subject Health">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis stroke="#475569" fontSize={10} />
                <Radar name="Health" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Subject Cards */}
        <h2 className="text-xl font-bold text-white mb-4">Subjects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {subjectsWithStats.map((subject) => (
            <button
              key={subject.id}
              onClick={() => onSelectSubject(subject)}
              className="text-left bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-500 hover:bg-slate-800 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                <h3 className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors">{subject.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div>{subject.totalVideoHours}h videos</div>
                <div>{subject.totalNoteHours}h notes</div>
                <div>{subject.totalQuestions} questions</div>
                <div>
                  <HealthBadge score={subject.healthScore} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-5 ${className}`}>
      <h3 className="text-white font-semibold mb-4 text-sm">{title}</h3>
      {children}
    </div>
  );
}

function HealthBadge({ score }) {
  const color = score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400';
  return <span className={`font-medium ${color}`}>{score}/100</span>;
}
