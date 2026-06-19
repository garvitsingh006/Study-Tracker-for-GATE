import { useState } from 'react'
import { TrendingUp, BarChart3, GraduationCap, Users, Search, Target, Hash } from 'lucide-react'
import {
  HISTORICAL_CUTOFFS,
  EXAM_STATISTICS,
  MARKS_VS_RANK,
  COLLEGE_CUTOFFS,
  COLLEGE_TYPES,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from '../data/gateStats'

function SectionHeader({ icon: Icon, color, title, subtitle }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <Icon size={18} color={color} aria-hidden="true" />
        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{title}</h2>
      </div>
      {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{subtitle}</p>}
    </div>
  )
}

function CutoffTable({ data, label }) {
  const maxCutoff = Math.max(...data.map(d => d.general))
  return (
    <div className="bento-card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
        <Target size={14} color={label === 'CSE' ? 'var(--accent-cyan)' : 'var(--accent-purple)'} aria-hidden="true" />
        <span style={{ fontSize: '14px', fontWeight: '600', color: label === 'CSE' ? 'var(--accent-cyan)' : 'var(--accent-purple)' }}>GATE {label}</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Year</th>
            {Object.keys(CATEGORY_LABELS).map(cat => (
              <th key={cat} style={{ textAlign: 'center', padding: '8px 12px', color: CATEGORY_COLORS[cat], fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{CATEGORY_LABELS[cat]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.year} style={{ borderBottom: i < data.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <td style={{ padding: '10px 12px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{row.year}</td>
              {Object.keys(CATEGORY_LABELS).map(cat => (
                <td key={cat} style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', fontSize: '13px' }}>{row[cat]}</span>
                    <div style={{ width: '80px', height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${(row[cat] / maxCutoff) * 100}%`, height: '100%', background: CATEGORY_COLORS[cat], borderRadius: '2px' }}></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatsCard({ icon: Icon, color, label, value, sub }) {
  return (
    <div className="bento-card" style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
        <Icon size={18} color={color} aria-hidden="true" />
      </div>
      <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>{label}</div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

export default function GateStats() {
  const [collegeFilter, setCollegeFilter] = useState('All')
  const [search, setSearch] = useState('')

  const latestStats = EXAM_STATISTICS[0]
  const filteredColleges = COLLEGE_CUTOFFS.filter(c => {
    const matchesType = collegeFilter === 'All' || c.type === collegeFilter
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>GATE Cutoffs & Statistics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Historical cutoff scores, exam statistics, and college-wise requirements for CSE and DSAI.
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        <StatsCard icon={Users} color="var(--accent-cyan)" label="Total Registered" value={`${(latestStats.totalReg / 100000).toFixed(1)}L`} sub={`GATE ${latestStats.year}`} />
        <StatsCard icon={BarChart3} color="var(--accent-purple)" label="Avg Marks" value={latestStats.avgMarks} sub="Out of 100" />
        <StatsCard icon={TrendingUp} color="var(--accent-green)" label="Topper Score" value={latestStats.topperScore} sub="GATE Score" />
        <StatsCard icon={GraduationCap} color="var(--accent-orange)" label="CSE Registered" value={`${(latestStats.cseReg / 1000).toFixed(0)}K`} sub={`${latestStats.year} CSE`} />
      </div>

      {/* Historical Cutoffs */}
      <section style={{ marginBottom: '48px' }}>
        <SectionHeader icon={TrendingUp} color="var(--accent-cyan)" title="Historical Qualifying Cutoffs" subtitle="Minimum marks required to qualify GATE (out of 100)" />
        <CutoffTable data={HISTORICAL_CUTOFFS.CSE} label="CSE" />
        <CutoffTable data={HISTORICAL_CUTOFFS.DSAI} label="DSAI" />
        <div style={{ padding: '12px 16px', background: 'rgba(245, 166, 35, 0.05)', borderRadius: '8px', border: '1px solid rgba(245, 166, 35, 0.15)', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--accent-orange)' }}>Note:</strong> Cutoffs are based on qualifying marks released by GATE organizing IIT. Actual admission cutoffs at institutes are significantly higher.
        </div>
      </section>

      {/* Exam Statistics */}
      <section style={{ marginBottom: '48px' }}>
        <SectionHeader icon={BarChart3} color="var(--accent-purple)" title="Exam Statistics" subtitle="Registration and performance data from official GATE releases" />
        <div className="bento-card">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Year</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Reg.</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--accent-cyan)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CSE Reg.</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--accent-purple)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DSAI Reg.</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CSE Appeared</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--accent-green)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Topper</th>
              </tr>
            </thead>
            <tbody>
              {EXAM_STATISTICS.map((row, i) => (
                <tr key={row.year} style={{ borderBottom: i < EXAM_STATISTICS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 12px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{row.year}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{(row.totalReg / 100000).toFixed(1)}L</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{(row.cseReg / 1000).toFixed(0)}K</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>{(row.dsaiReg / 1000).toFixed(1)}K</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{(row.cseAppeared / 1000).toFixed(0)}K</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: '600' }}>{row.topperScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(151, 117, 250, 0.05)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--accent-purple)' }}>Source:</strong> Official GATE qualifying data released by IIT Guwahati (2026) and IIT Roorkee (2025).
        </div>
      </section>

      {/* Marks vs Rank */}
      <section style={{ marginBottom: '48px' }}>
        <SectionHeader icon={Hash} color="var(--accent-cyan)" title="Marks vs Rank vs Score" subtitle="Typical GATE CSE mapping based on recent year data" />
        <div className="bento-card">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rank (AIR)</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--accent-cyan)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marks (out of 100)</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--accent-purple)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>GATE Score</th>
              </tr>
            </thead>
            <tbody>
              {MARKS_VS_RANK.map((row, i) => (
                <tr key={row.rank} style={{ borderBottom: i < MARKS_VS_RANK.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 12px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{row.rank}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{row.marks}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* College-wise Cutoffs */}
      <section style={{ marginBottom: '48px' }}>
        <SectionHeader icon={GraduationCap} color="var(--accent-orange)" title="College-Wise Cutoffs" subtitle="Typical GATE score requirements for M.Tech admission (out of 1000)" />

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search colleges..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 34px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '13px', color: 'var(--text-primary)', outline: 'none' }}
              aria-label="Search colleges"
            />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {COLLEGE_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setCollegeFilter(type)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: collegeFilter === type ? 'var(--accent-primary)' : 'transparent',
                  color: collegeFilter === type ? '#fff' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="bento-card">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Institute</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--accent-cyan)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>General</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--accent-purple)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OBC</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--accent-orange)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SC/ST</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--accent-green)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>EWS</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seats</th>
              </tr>
            </thead>
            <tbody>
              {filteredColleges.map((college, i) => (
                <tr key={college.name} style={{ borderBottom: i < filteredColleges.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 12px', fontWeight: '600' }}>{college.name}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: college.type === 'IIT' ? 'rgba(43, 216, 196, 0.1)' : college.type === 'NIT' ? 'rgba(151, 117, 250, 0.1)' : 'rgba(245, 166, 35, 0.1)', color: college.type === 'IIT' ? 'var(--accent-cyan)' : college.type === 'NIT' ? 'var(--accent-purple)' : 'var(--accent-orange)' }}>
                      {college.type}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{college.score.general}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>{college.score.obc}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)' }}>{college.score.scSt}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>{college.score.ews}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{college.seats}</td>
                </tr>
              ))}
              {filteredColleges.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No colleges match your search</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(245, 166, 35, 0.05)', borderRadius: '8px', border: '1px solid rgba(245, 166, 35, 0.15)', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--accent-orange)' }}>Disclaimer:</strong> Cutoff scores are approximate estimates based on past admission trends. Actual cutoffs vary each year based on difficulty, number of applicants, and seat availability. Check official institute websites for accurate data.
        </div>
      </section>
    </div>
  )
}
