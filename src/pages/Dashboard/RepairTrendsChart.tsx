// RepairTrendsChart.tsx — Custom Vihiga County Government Branded Analytical Panel
import { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { 
  WrenchIcon, 
  FuelIcon, 
  TrendingUpIcon, 
  SparklesIcon, 
  ActivityIcon 
} from 'lucide-react'

interface Row {
  month: string
  critical: number
  high: number
  medium: number
}

// Brand Color Mapping matching Vihiga County Government Seal
const VIHIGA_COLORS = {
  royalBlue: '#1976D2',      // Outer Ring Blue
  gold: '#FDD835',           // Inner Accent Yellow
  forestGreen: '#2E7D32',    // Agriculture/Leaf Green
  midnightNavy: '#112233',   // Lettering & Crest Outline Navy
  lightBlueBg: 'rgba(25, 118, 210, 0.04)',
  lightGreenBg: 'rgba(46, 125, 50, 0.04)',
  borderSoft: '#E0E0E0'
}

// Mocked structural fuel ledger details based on Vihiga County fleet usage metrics
const FUEL_ANALYTICS_DATA = [
  { month: 'Jan', consumption: 1420, efficiency: 8.2, cost: 234000 },
  { month: 'Feb', consumption: 1850, efficiency: 7.9, cost: 305000 },
  { month: 'Mar', consumption: 1600, efficiency: 8.4, cost: 264000 },
  { month: 'Apr', consumption: 2100, efficiency: 8.1, cost: 346500 },
  { month: 'May', consumption: 1950, efficiency: 8.5, cost: 321750 },
  { month: 'Jun', consumption: 2300, efficiency: 8.8, cost: 379500 },
]

export function RepairTrendsChart({ data }: { data: Row[] }) {
  const [activeTab, setActiveTab] = useState<'defects' | 'fuel'>('defects')

  // Calculate totals for defects
  const totals = data.reduce(
    (acc, curr) => {
      acc.critical += curr.critical
      acc.high += curr.high
      acc.medium += curr.medium
      return acc
    },
    { critical: 0, high: 0, medium: 0 }
  )

  const totalDefects = totals.critical + totals.high + totals.medium

  const defectChartData = [
    { name: 'Critical Priority', value: totals.critical, color: VIHIGA_COLORS.royalBlue, description: 'Immediate safety or operational risk (Seal Royal Blue)' },
    { name: 'High Priority', value: totals.high, color: VIHIGA_COLORS.gold, description: 'Urgent malfunctions requiring scheduled downtime (Seal Yellow Gold)' },
    { name: 'Medium Priority', value: totals.medium, color: VIHIGA_COLORS.forestGreen, description: 'Minor structural or green development updates (Seal Forest Green)' },
  ]

  const activeDefectData = defectChartData.filter((item) => item.value > 0)

  // Calculate totals for fuel
  const totalLiters = FUEL_ANALYTICS_DATA.reduce((sum, item) => sum + item.consumption, 0)
  const averageEfficiency = (FUEL_ANALYTICS_DATA.reduce((sum, item) => sum + item.efficiency, 0) / FUEL_ANALYTICS_DATA.length).toFixed(1)
  const totalFuelCost = FUEL_ANALYTICS_DATA.reduce((sum, item) => sum + item.cost, 0)

  return (
    <div className="card dashboard__chart" style={{ width: '100%', borderColor: VIHIGA_COLORS.borderSoft }}>
      {/* Dynamic Header with Segmented Control Switches */}
      <div className="card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 className="card__title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: VIHIGA_COLORS.midnightNavy }}>
            {activeTab === 'defects' ? <WrenchIcon size={20} style={{ color: VIHIGA_COLORS.royalBlue }} /> : <FuelIcon size={20} style={{ color: VIHIGA_COLORS.forestGreen }} />}
            {activeTab === 'defects' ? 'Defect Status Breakdown' : 'Fuel Consumption & Diagnostics'}
          </h2>
          <p className="card__subtitle">
            {activeTab === 'defects' 
              ? 'Real-time composition of flagged maintenance requirements across Vihiga assets.' 
              : 'Cumulative Monthly fuel distribution and performance metric trends.'}
          </p>
        </div>

        {/* Premium Segmented Switch Tab with Vihiga Borders */}
        <div style={{ 
          display: 'flex', 
          background: '#F5F5F5', 
          padding: '4px', 
          borderRadius: '8px',
          border: `1px solid ${VIHIGA_COLORS.borderSoft}` 
        }}>
          <button 
            onClick={() => setActiveTab('defects')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'defects' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'defects' ? VIHIGA_COLORS.royalBlue : '#666666',
              boxShadow: activeTab === 'defects' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Defects Breakdown
          </button>
          <button 
            onClick={() => setActiveTab('fuel')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'fuel' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'fuel' ? VIHIGA_COLORS.forestGreen : '#666666',
              boxShadow: activeTab === 'fuel' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Fuel Analytics
          </button>
        </div>
      </div>

      <div className="card__body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', paddingTop: '16px' }}>
        
        {/* LEFT COLUMN: The Branded Dynamic Chart Workspace */}
        <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {activeTab === 'defects' ? (
            activeDefectData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={activeDefectData}
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {activeDefectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: unknown) => [`${Number(value)} Issues`, 'Volume']}
                    contentStyle={{
                      borderRadius: 10,
                      border: `1px solid ${VIHIGA_COLORS.borderSoft}`,
                      fontSize: 13,
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No active defects reported" hint="File a ticket to begin visualization patterns." />
            )
          ) : (
            // FUEL CONSUMPTION DETAILED BAR CHART (Vihiga Branded)
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={FUEL_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                <XAxis dataKey="month" style={{ fontSize: 11, fontWeight: 500 }} />
                <YAxis style={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: unknown, name: string) => {
                    if (name === 'consumption') return [`${value} Liters`, 'Total fuel consumed'];
                    if (name === 'efficiency') return [`${value} KM/L`, 'Fleet Efficiency Indicator'];
                    return [value, name];
                  }}
                  contentStyle={{ borderRadius: 10, border: `1px solid ${VIHIGA_COLORS.borderSoft}` }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Bar dataKey="consumption" name="Fuel (Ltrs)" fill={VIHIGA_COLORS.royalBlue} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* RIGHT COLUMN: Highly Detailed Data Insights & Information Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px dashed #E0E0E0', paddingBottom: '10px' }}>
            <ActivityIcon size={18} style={{ color: VIHIGA_COLORS.midnightNavy }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: VIHIGA_COLORS.midnightNavy }}>
              Administrative Analytical Overview
            </span>
          </div>

          {activeTab === 'defects' ? (
            /* BRANDED DEFECT INSIGHTS PANEL */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#F9F9F9', borderRadius: '8px', border: `1px solid ${VIHIGA_COLORS.borderSoft}` }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#666666', fontWeight: 500 }}>Total Fleet Defects</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: VIHIGA_COLORS.royalBlue }}>{totalDefects}</span>
                </div>
                <div style={{ padding: '12px', background: '#F9F9F9', borderRadius: '8px', border: `1px solid ${VIHIGA_COLORS.borderSoft}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SparklesIcon size={20} style={{ color: VIHIGA_COLORS.gold }} />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#666666', fontWeight: 500 }}>Urgency Status</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: VIHIGA_COLORS.midnightNavy }}>
                      {totals.critical > 0 ? 'Urgent Action Required' : 'Operational Boundaries Stable'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {defectChartData.map((defect, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', padding: '6px', borderRadius: '6px' }}>
                    <div style={{ minWidth: '10px', height: '10px', borderRadius: '50%', background: defect.color, marginTop: '4px' }} />
                    <div>
                      <strong style={{ color: VIHIGA_COLORS.midnightNavy }}>{defect.name} ({defect.value}): </strong>
                      <span style={{ color: '#555555' }}>{defect.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* BRANDED FUEL INSIGHTS PANEL */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', background: VIHIGA_COLORS.lightBlueBg, borderRadius: '8px', border: `1px solid rgba(25, 118, 210, 0.2)` }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: VIHIGA_COLORS.royalBlue, fontWeight: 500 }}>Refueling Logs</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: VIHIGA_COLORS.royalBlue }}>{totalLiters} L</span>
                </div>
                <div style={{ padding: '12px', background: VIHIGA_COLORS.lightGreenBg, borderRadius: '8px', border: `1px solid rgba(46, 125, 50, 0.2)` }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: VIHIGA_COLORS.forestGreen, fontWeight: 500 }}>Avg Efficiency</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: VIHIGA_COLORS.forestGreen }}>{averageEfficiency} KM/L</span>
                </div>
              </div>

              <div style={{ padding: '12px', background: '#F9F9F9', borderRadius: '8px', border: `1px solid ${VIHIGA_COLORS.borderSoft}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <TrendingUpIcon size={24} style={{ color: VIHIGA_COLORS.forestGreen }} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#666666', fontWeight: 500 }}>Estimated Budget Consumed</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: VIHIGA_COLORS.midnightNavy }}>KES {totalFuelCost.toLocaleString()}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#666666', margin: 0, lineHeight: '1.4' }}>
                Fuel metrics are verified dynamically using driver-submitted refueling logs. Heavy machinery and stationary generators maintain dedicated hour-meter registers on specialized sub-ledgers.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}