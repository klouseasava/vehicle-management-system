// Dashboard.tsx — Premium Vihiga County Government Branded Fleet Dashboard
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BellRingIcon,
  AlertOctagonIcon,
  LinkIcon,
  CircleCheckIcon,
  FileSearchIcon,
  CheckSquareIcon,
  FuelIcon,
  XIcon
} from 'lucide-react'
import { useFleetData } from '../../context/FleetDataContext'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { RepairTrendsChart } from './RepairTrendsChart'
import { EmptyState } from '../../components/StateViews/StateViews'
import './Dashboard.css'

// Vihiga Official County Color Palette Configuration
const VIHIGA_THEME = {
  royalBlue: '#1976D2',      // Outer Circular Seal Ring Blue
  gold: '#FDD835',           // Seal Accent Yellow
  forestGreen: '#2E7D32',    // Agricultural/Crest Green
  midnightNavy: '#112233',   // Text & Border Navy Black
  clayRed: '#D45B12'         // Secondary Alert/Fuel Ochre
}

export function Dashboard() {
  const { dashboard, trends, vehicles } = useFleetData()
  const navigate = useNavigate()
  
  // Interactive Analysis Options state control
  const [activeAnalysisType, setActiveAnalysisType] = useState<'report' | 'tickets' | 'fuel' | null>(null)

  const handleOptionClick = (route: string) => {
    setActiveAnalysisType(null)
    navigate(route)
  }

  return (
    <div className="dashboard">
      <PageHeader
        title="Fleet Overview"
        subtitle="Live system configurations for Vihiga County Government fleet assets."
      />

      {/* SECTION 1: Live Fleet Diagnostics (Row of 4 Cards Branded to Vihiga Seal) */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: VIHIGA_THEME.midnightNavy, marginBottom: '12px', marginTop: '8px' }}>
        Live Fleet Diagnostics
      </h2>
      <div 
        className="analysis-cards__grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '16px',
          marginBottom: '28px' 
        }}
      >
        {/* Service Reminders Card — Vihiga Gold */}
        <div className="analysis-card" onClick={() => navigate('/maintenance')} style={{ borderLeft: `4px solid ${VIHIGA_THEME.gold}` }}>
          <div className="analysis-card__header">
            <h3 className="analysis-card__title" style={{ color: VIHIGA_THEME.midnightNavy }}>
              Service Reminders ({dashboard.reminders})
            </h3>
            <BellRingIcon size={22} className="summary-card__go" style={{ color: VIHIGA_THEME.gold }} />
          </div>
          <p className="analysis-card__desc">Priority units due for service.</p>
        </div>

        {/* Open Critical Issues Card — Vihiga Clay/Red Alert */}
        <div className="analysis-card" onClick={() => navigate('/maintenance')} style={{ borderLeft: `4px solid ${VIHIGA_THEME.clayRed}` }}>
          <div className="analysis-card__header">
            <h3 className="analysis-card__title" style={{ color: VIHIGA_THEME.midnightNavy }}>
              Critical Issues ({dashboard.critical})
            </h3>
            <AlertOctagonIcon size={22} className="summary-card__go" style={{ color: VIHIGA_THEME.clayRed }} />
          </div>
          <p className="analysis-card__desc">Defects flagged critical.</p>
        </div>

        {/* Active Assignments Card — Vihiga Royal Blue */}
        <div className="analysis-card" onClick={() => navigate('/fleet')} style={{ borderLeft: `4px solid ${VIHIGA_THEME.royalBlue}` }}>
          <div className="analysis-card__header">
            <h3 className="analysis-card__title" style={{ color: VIHIGA_THEME.midnightNavy }}>
              Active Assignments ({dashboard.activeAssignments})
            </h3>
            <LinkIcon size={22} className="summary-card__go" style={{ color: VIHIGA_THEME.royalBlue }} />
          </div>
          <p className="analysis-card__desc">Vehicles with an active driver.</p>
        </div>

        {/* Fleet Functional Card — Vihiga Forest Green */}
        <div className="analysis-card" onClick={() => navigate('/tracking')} style={{ borderLeft: `4px solid ${VIHIGA_THEME.forestGreen}` }}>
          <div className="analysis-card__header">
            <h3 className="analysis-card__title" style={{ color: VIHIGA_THEME.midnightNavy }}>
              Fleet Functional ({dashboard.functional}/{dashboard.total})
            </h3>
            <CircleCheckIcon size={22} className="summary-card__go" style={{ color: VIHIGA_THEME.forestGreen }} />
          </div>
          <p className="analysis-card__desc">Vehicles in active service.</p>
        </div>
      </div>

      {/* SECTION 2: Administrative Controls & Actions (Row of 3 Cards Branded to Vihiga Seal) */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: VIHIGA_THEME.midnightNavy, marginBottom: '12px' }}>
        Administrative Controls & Actions
      </h2>
      <div 
        className="analysis-cards__grid"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div className="analysis-card" onClick={() => setActiveAnalysisType('report')}>
          <div className="analysis-card__header">
            <h3 className="analysis-card__title" style={{ color: VIHIGA_THEME.midnightNavy }}>Find Report</h3>
            <FileSearchIcon size={22} className="summary-card__go" style={{ color: VIHIGA_THEME.royalBlue }} />
          </div>
          <p className="analysis-card__desc">Generate performance, diagnostic, or activity sheets instantly.</p>
        </div>

        <div className="analysis-card" onClick={() => setActiveAnalysisType('tickets')}>
          <div className="analysis-card__header">
            <h3 className="analysis-card__title" style={{ color: VIHIGA_THEME.midnightNavy }}>Work Tickets Approval</h3>
            <CheckSquareIcon size={22} className="summary-card__go" style={{ color: VIHIGA_THEME.forestGreen }} />
          </div>
          <p className="analysis-card__desc">Approve, reject, or audit digital driver task tickets.</p>
        </div>

        <div className="analysis-card" onClick={() => setActiveAnalysisType('fuel')}>
          <div className="analysis-card__header">
            <h3 className="analysis-card__title" style={{ color: VIHIGA_THEME.midnightNavy }}>Fuel Consumption</h3>
            <FuelIcon size={22} className="summary-card__go" style={{ color: VIHIGA_THEME.clayRed }} />
          </div>
          <p className="analysis-card__desc">Audit efficient refueling histories and fuel-to-kilometers indicators.</p>
        </div>
      </div>

      {/* SECTION 3: Branded Charts & Diagnostics Component */}
      <div className="card dashboard__chart" style={{ borderColor: '#E0E0E0' }}>
        <div className="card__body" style={{ padding: 0 }}>
          {trends.length ? (
            <RepairTrendsChart data={trends} />
          ) : (
            <EmptyState
              title="No active defects found"
              hint={
                vehicles.length
                  ? 'File a new driver ticket defect to initialize the live overview trends.'
                  : 'Add assets or restore demo datasets to view charts.'
              }
            />
          )}
        </div>
      </div>

      {/* Interactive Modal Popovers for Analysis Cards with Vihiga Brand Accents */}
      <AnimatePresence>
        {activeAnalysisType && (
          <div className="modal-overlay" onClick={() => setActiveAnalysisType(null)}>
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ borderTop: `6px solid ${VIHIGA_THEME.royalBlue}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: VIHIGA_THEME.midnightNavy, fontWeight: 700 }}>
                  {activeAnalysisType === 'report' && 'Find Report Panel'}
                  {activeAnalysisType === 'tickets' && 'Work Tickets Portal'}
                  {activeAnalysisType === 'fuel' && 'Fuel Analytics Control'}
                </h3>
                <button onClick={() => setActiveAnalysisType(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <XIcon size={20} style={{ color: '#666666' }} />
                </button>
              </div>

              {activeAnalysisType === 'report' && (
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#555555' }}>Select a query action to view or configure administrative reports:</p>
                  <button className="modal-option-btn" style={{ borderColor: VIHIGA_THEME.royalBlue }} onClick={() => handleOptionClick('/reports')}>Go to Driver & Vehicle Reports</button>
                  <button className="modal-option-btn" style={{ borderColor: VIHIGA_THEME.royalBlue }} onClick={() => handleOptionClick('/reports')}>Generate Log Summaries</button>
                </div>
              )}

              {activeAnalysisType === 'tickets' && (
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#555555' }}>Perform fast-track administrative actions on Work Tickets:</p>
                  <button className="modal-option-btn" style={{ borderColor: VIHIGA_THEME.forestGreen }} onClick={() => handleOptionClick('/fuel')}>Review Pending Tickets</button>
                  <button className="modal-option-btn" style={{ borderColor: VIHIGA_THEME.forestGreen }} onClick={() => handleOptionClick('/fuel')}>View Approved Ledgers</button>
                </div>
              )}

              {activeAnalysisType === 'fuel' && (
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#555555' }}>Query refuel details, balances, and efficiency matrices:</p>
                  <button className="modal-option-btn" style={{ borderColor: VIHIGA_THEME.clayRed }} onClick={() => handleOptionClick('/fuel')}>Open Fuel Logbook</button>
                  <button className="modal-option-btn" style={{ borderColor: VIHIGA_THEME.clayRed }} onClick={() => handleOptionClick('/fuel')}>Review Heavy Machinery Usage</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}