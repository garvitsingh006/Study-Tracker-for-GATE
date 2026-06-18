import { BookOpen, Calendar, Target, Clock, FileText, Award, Lock } from 'lucide-react'

const PYQ_YEARS = [2025, 2024, 2023, 2022]

const CSE_WEIGHTAGE = [
  { subject: 'General Aptitude', marks: 15, percent: '15%' },
  { subject: 'Engineering Mathematics', marks: 13, percent: '13%' },
  { subject: 'Discrete Mathematics / Digital Logic', marks: 6, percent: '6%' },
  { subject: 'Computer Organization & Architecture', marks: 8, percent: '8%' },
  { subject: 'Programming & Data Structures', marks: 15, percent: '15%' },
  { subject: 'Algorithms', marks: 7, percent: '7%' },
  { subject: 'Theory of Computation', marks: 6, percent: '6%' },
  { subject: 'Compiler Design', marks: 4, percent: '4%' },
  { subject: 'Operating System', marks: 9, percent: '9%' },
  { subject: 'Databases', marks: 7, percent: '7%' },
  { subject: 'Computer Networks', marks: 10, percent: '10%' },
]

export default function MockTests() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Mock Tests & Exam Pattern</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Practice with previous year papers and understand the GATE exam pattern.
        </p>
      </div>

      {/* PYQ Coming Soon - Horizontal Layout */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Calendar size={18} color="var(--accent-primary)" aria-hidden="true" />
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Previous Year Papers</h2>
        </div>
        
        <div className="mocks-pyq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* CSE Column */}
          <div className="bento-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(43, 216, 196, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={14} color="var(--accent-cyan)" aria-hidden="true" />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-cyan)' }}>CSE Papers</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PYQ_YEARS.map(year => (
                <div key={`cse-${year}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>GATE CSE {year}</span>
                  <Lock size={12} color="var(--text-muted)" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>

          {/* DSAI Column */}
          <div className="bento-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(151, 117, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={14} color="var(--accent-purple)" aria-hidden="true" />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-purple)' }}>DSAI Papers</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PYQ_YEARS.map(year => (
                <div key={`dsai-${year}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>GATE DSAI {year}</span>
                  <Lock size={12} color="var(--text-muted)" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(245, 166, 35, 0.05)', borderRadius: '8px', border: '1px solid rgba(245, 166, 35, 0.15)', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
          <Lock size={12} color="var(--accent-orange)" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} aria-hidden="true" />
          Papers coming soon! Mock test feature with timed practice sessions is under development.
        </div>
      </div>

      {/* DSAI Exam Pattern - Full Details */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Target size={18} color="var(--accent-purple)" aria-hidden="true" />
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>GATE DSAI 2027 Exam Pattern</h2>
        </div>
        
        <div className="bento-card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(151, 117, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={16} color="var(--accent-purple)" aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mode</div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>Computer Based Test</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(43, 216, 196, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={16} color="var(--accent-cyan)" aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>3 Hours</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 166, 35, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={16} color="var(--accent-orange)" aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Marks</div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>100</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bento-card">
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Marking Scheme</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Section</th>
                <th style={{ textAlign: 'center', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Questions</th>
                <th style={{ textAlign: 'center', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px 12px', fontWeight: '500' }}>General Aptitude</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>10</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>15</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 12px', fontWeight: '500' }}>Core Discipline</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>55</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>85</td>
              </tr>
              <tr style={{ borderTop: '2px solid var(--border-subtle)', fontWeight: '700' }}>
                <td style={{ padding: '10px 12px' }}>Total</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>65</td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--accent-purple)' }}>100</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: '12px', padding: '10px 12px', background: 'rgba(245, 166, 35, 0.05)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--accent-orange)' }}>Negative Marking:</strong> Only for MCQs. 1/3 deduction for 1-mark questions, 2/3 deduction for 2-mark questions.
          </div>
        </div>
      </div>

      {/* CSE Exam Pattern - Full Details */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Target size={18} color="var(--accent-cyan)" aria-hidden="true" />
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>GATE CSE 2027 Exam Pattern</h2>
        </div>
        
        <div className="bento-card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(43, 216, 196, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={16} color="var(--accent-cyan)" aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mode</div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>Online (CBT)</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(151, 117, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={16} color="var(--accent-purple)" aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>3 Hours</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(64, 192, 87, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={16} color="var(--accent-green)" aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Marks</div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>100</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bento-card" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Question Pattern</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', padding: '12px', background: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>MCQs</div>
              <div style={{ fontSize: '13px', fontWeight: '600' }}>Multiple Choice Questions</div>
              <div style={{ fontSize: '11px', color: 'var(--accent-orange)', marginTop: '4px' }}>Negative marking applies</div>
            </div>
            <div style={{ flex: 1, minWidth: '200px', padding: '12px', background: 'var(--bg-base)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>NATs</div>
              <div style={{ fontSize: '13px', fontWeight: '600' }}>Numerical Answer Type</div>
              <div style={{ fontSize: '11px', color: 'var(--accent-green)', marginTop: '4px' }}>No negative marking</div>
            </div>
          </div>
        </div>
      </div>

      {/* CSE Marks Weightage - Full Table */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Award size={18} color="var(--accent-primary)" aria-hidden="true" />
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>GATE CSE 2027 Marks Weightage</h2>
        </div>
        
        <div className="bento-card">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marks</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weight</th>
              </tr>
            </thead>
            <tbody>
              {CSE_WEIGHTAGE.map((item, i) => (
                <tr key={item.subject} style={{ borderBottom: i < CSE_WEIGHTAGE.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 12px', fontWeight: '500' }}>{item.subject}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>{item.marks}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.marks}%`, height: '100%', background: 'var(--accent-cyan)', borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', minWidth: '32px' }}>{item.percent}</span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid var(--border-subtle)', fontWeight: '700' }}>
                <td style={{ padding: '10px 12px' }}>Total</td>
                <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>100</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--accent-cyan)' }}>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info note */}
      <div className="bento-card" style={{ padding: '20px', textAlign: 'center' }}>
        <BookOpen size={24} color="var(--text-muted)" style={{ marginBottom: '8px' }} aria-hidden="true" />
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
          Official GATE papers are released by IIT after each exam cycle. Mock test feature coming soon with timed practice sessions.
        </p>
      </div>
    </div>
  )
}
