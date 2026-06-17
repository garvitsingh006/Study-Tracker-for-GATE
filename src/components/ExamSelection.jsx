import { getExamList } from '../utils/subjects';

export default function ExamSelection({ onSelect }) {
  const examList = getExamList();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          GATE 2027
        </h1>
        <p className="text-slate-400 text-lg">Your personalized study tracker</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {examList.map((exam) => (
          <button
            key={exam.id}
            onClick={() => onSelect(exam.id)}
            className="group relative overflow-hidden rounded-2xl p-8 bg-slate-800/50 border border-slate-700 hover:border-slate-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 w-64"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${exam.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-2">{exam.id}</div>
              <div className="text-slate-400 text-sm">{exam.name}</div>
              <div className="mt-4 text-xs text-slate-500">
                {exam.subjects.length} subjects
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-12 text-slate-600 text-sm">Select your exam to begin tracking</p>
    </div>
  );
}
