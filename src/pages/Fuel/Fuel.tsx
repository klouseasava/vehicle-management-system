import React, { useState } from 'react'
// Fuel.tsx — shared derived fuel overview, session-persisted daily logs, and Work Ticket Administration.
import { format } from 'date-fns'
import {
  CalendarSearchIcon,
  FuelIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  WalletIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  SearchIcon,
  Edit3Icon,
  UserIcon,
  MapPinIcon
} from 'lucide-react'
import { useFleetData } from '../../context/FleetDataContext'
import { useToast } from '../../components/Toast/ToastProvider'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { EmptyState } from '../../components/StateViews/StateViews'
import { formatKsh, formatNumber } from '../../utils/format'
import './Fuel.css'

// --- MOCK WORK TICKET DATA ---
interface WorkTicket {
  id: string
  driverName: string
  driverLicense: string
  destination: string
  fuelRequested: number // in Litres
  purpose: string
  dateRequested: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

const INITIAL_TICKETS: WorkTicket[] = [
  {
    id: "WT-2026-041",
    driverName: "John Kamau",
    driverLicense: "DL-VIH-8821",
    destination: "Luanda Sub-County HQ",
    fuelRequested: 45,
    purpose: "Routine fleet inspection and staff dispatch",
    dateRequested: "2026-07-15",
    status: "Pending"
  },
  {
    id: "WT-2026-042",
    driverName: "Mary Harrison",
    driverLicense: "DL-VIH-3094",
    destination: "Chavakali Water Plant",
    fuelRequested: 30,
    purpose: "Emergency generator diesel delivery",
    dateRequested: "2026-07-16",
    status: "Pending"
  },
  {
    id: "WT-2026-043",
    driverName: "David Ochieng",
    driverLicense: "DL-VIH-4952",
    destination: "Mbale Central Office",
    fuelRequested: 20,
    purpose: "Inter-departmental mail delivery",
    dateRequested: "2026-07-14",
    status: "Approved"
  },
  {
    id: "WT-2026-044",
    driverName: "Erick Ombogo",
    driverLicense: "DL-VIH-1102",
    destination: "Hamisi Sub-County Office",
    fuelRequested: 60,
    purpose: "Heavy machinery mobilization",
    dateRequested: "2026-07-13",
    status: "Rejected"
  }
]

export function Fuel() {
  // Existing Fuel State
  const { fuelSummary, getDailyLog, synchronizeFuel } = useFleetData()
  const toast = useToast()
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [looked, setLooked] = useState(false)
  const rows = getDailyLog(date)

  // Work Ticket Administration State
  const [tickets, setTickets] = useState<WorkTicket[]>(INITIAL_TICKETS)
  const [editingTicket, setEditingTicket] = useState<WorkTicket | null>(null)
  const [adjustedFuel, setAdjustedFuel] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState('')

  // --- WORK TICKET ACTIONS ---
  const handleApprove = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Approved' } : t))
    toast.success(`Ticket ${id} approved successfully.`)
  }

  const handleReject = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Rejected' } : t))
    toast.success(`Ticket ${id} rejected.`)
  }

  const startEdit = (ticket: WorkTicket) => {
    setEditingTicket(ticket)
    setAdjustedFuel(ticket.fuelRequested)
  }

  const saveFuelAdjustment = () => {
    if (!editingTicket) return
    setTickets(prev => prev.map(t => 
      t.id === editingTicket.id 
        ? { ...t, fuelRequested: adjustedFuel, status: 'Approved' } 
        : t
    ))
    setEditingTicket(null)
    toast.success(`Ticket ${editingTicket.id} adjusted and approved.`)
  }

  const filteredTickets = tickets.filter(t => 
    t.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadgeStyle = (status: string) => {
    if (status === 'Approved') return { background: '#ebfbee', color: '#40c057', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }
    if (status === 'Rejected') return { background: '#fff5f5', color: '#fa5252', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }
    return { background: '#fff4e6', color: '#fd7e14', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }
  }

  return (
    <div className="fuel stack">
      <PageHeader
        title="Fuel & Work Tickets"
        subtitle="Review work tickets and monitor automated fleet fuel consumption."
        actions={
          <button
            className="btn btn--forest"
            onClick={() => {
              synchronizeFuel()
              toast.success('Fuel summary synchronized.')
            }}
          >
            <RefreshCwIcon size={16} />
            Synchronize logs
          </button>
        }
      />

      {/* --- SECTION 1: WORK TICKET ADMINISTRATION --- */}
      <h3 style={{ marginTop: '12px', color: 'var(--vfms-forest-500)' }}>Work Ticket Requests</h3>
      
      {/* Work Ticket Stats Cards */}
      <div className="fuel__cards" style={{ marginBottom: '16px' }}>
        <div className="fuel__card">
          <span className="fuel__card-icon" style={{ color: '#fd7e14', background: '#fff4e6' }}>
            <ClockIcon size={20} />
          </span>
          <span className="fuel__card-value mono">{tickets.filter(t => t.status === 'Pending').length}</span>
          <span className="fuel__card-label">Pending Review</span>
        </div>
        <div className="fuel__card">
          <span className="fuel__card-icon" style={{ color: '#40c057', background: '#ebfbee' }}>
            <CheckCircle2Icon size={20} />
          </span>
          <span className="fuel__card-value mono">{tickets.filter(t => t.status === 'Approved').length}</span>
          <span className="fuel__card-label">Approved Tickets</span>
        </div>
        <div className="fuel__card">
          <span className="fuel__card-icon" style={{ color: '#fa5252', background: '#fff5f5' }}>
            <XCircleIcon size={20} />
          </span>
          <span className="fuel__card-value mono">{tickets.filter(t => t.status === 'Rejected').length}</span>
          <span className="fuel__card-label">Rejected Tickets</span>
        </div>
      </div>

      <div className="card">
        <div className="card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h2 className="card__title">Pending & Processed Tickets</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8f9fa', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e9ecef' }}>
            <SearchIcon size={16} color="#adb5bd" />
            <input 
              type="text" 
              placeholder="Search driver or destination..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', width: '220px' }}
            />
          </div>
        </div>
        
        {filteredTickets.length > 0 ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket / Date</th>
                  <th>Driver Details</th>
                  <th>Destination</th>
                  <th>Fuel Req.</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td>
                      <div className="mono" style={{ fontWeight: 'bold' }}>{ticket.id}</div>
                      <div style={{ fontSize: '12px', color: '#868e96' }}>{ticket.dateRequested}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <UserIcon size={14} color="#adb5bd" />
                        <strong>{ticket.driverName}</strong>
                      </div>
                      <div className="mono" style={{ fontSize: '12px', color: '#868e96', marginLeft: '20px' }}>{ticket.driverLicense}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPinIcon size={14} color="#adb5bd" />
                        <span>{ticket.destination}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#868e96', marginLeft: '20px' }}>{ticket.purpose}</div>
                    </td>
                    <td className="mono" style={{ fontWeight: 'bold' }}>
                      {ticket.fuelRequested} L
                    </td>
                    <td>
                      <span style={getStatusBadgeStyle(ticket.status)}>
                        {ticket.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {ticket.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button className="btn btn--forest" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => handleApprove(ticket.id)}>
                            Approve
                          </button>
                          <button className="btn" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => startEdit(ticket)}>
                            <Edit3Icon size={14} />
                          </button>
                          <button className="btn" style={{ padding: '6px 10px', fontSize: '12px', color: '#fa5252', borderColor: '#ffe3e3' }} onClick={() => handleReject(ticket.id)}>
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#adb5bd', fontStyle: 'italic' }}>Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState 
            title="No work tickets found" 
            hint="Try adjusting your search criteria." 
          />
        )}
      </div>

      <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e9ecef' }} />


      {/* --- SECTION 2: EXISTING FUEL ANALYTICS --- */}
      <h3 style={{ color: 'var(--vfms-forest-500)' }}>Automated Fuel Analytics</h3>
      
      <div className="fuel__cards">
        {[
          [
            <FuelIcon size={20} />,
            'litres',
            `${formatNumber(fuelSummary.summary.total_fleet_litres)} L`,
            'Total fleet litres',
          ],
          [
            <WalletIcon size={20} />,
            'cost',
            formatKsh(fuelSummary.summary.total_fleet_cost),
            'Total fleet cost',
          ],
          [
            <TrendingUpIcon size={20} />,
            'forecast',
            formatKsh(fuelSummary.forecast.estimated_next_month_budget_ksh),
            'Next-month forecast',
          ],
        ].map(([icon, tone, value, label], i) => (
          <div className="fuel__card" key={i}>
            <span className={`fuel__card-icon fuel__card-icon--${tone}`}>
              {icon as React.ReactNode}
            </span>
            <span className="fuel__card-value mono">{value as string}</span>
            <span className="fuel__card-label">{label as string}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Per-vehicle burn rate</h2>
        </div>
        {fuelSummary.vehicles.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Plate</th>
                  <th>Model</th>
                  <th>Monthly litres</th>
                  <th>Monthly cost</th>
                  <th>Daily avg.</th>
                </tr>
              </thead>
              <tbody>
                {fuelSummary.vehicles.map((v) => (
                  <tr key={v.plate_number}>
                    <td className="mono">{v.plate_number}</td>
                    <td>{v.model}</td>
                    <td className="mono">
                      {formatNumber(v.monthly_total_litres)}
                    </td>
                    <td className="mono">{formatKsh(v.monthly_total_cost)}</td>
                    <td className="mono">
                      {formatNumber(v.daily_average_litres)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No fuel records yet"
            hint="Add vehicles or restore demo records to populate fleet consumption."
          />
        )}
      </div>

      <div className="card">
        <div className="card__header">
          <h2 className="card__title">
            <CalendarSearchIcon size={16} />
            Daily log lookup
          </h2>
        </div>
        <div className="card__body">
          <div className="fuel__lookup">
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button
              className="btn btn--primary"
              onClick={() => setLooked(true)}
            >
              Fetch log
            </button>
          </div>
          {looked &&
            (rows.length ? (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Plate</th>
                      <th>Distance</th>
                      <th>Litres</th>
                      <th>Cost</th>
                      <th>Speed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.plate_number}>
                        <td className="mono">{r.plate_number}</td>
                        <td>{r.distance} km</td>
                        <td>{r.litres}</td>
                        <td>{formatKsh(r.cost)}</td>
                        <td>{r.speed} km/h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No entries for this date"
                hint="Daily logs were cleared with the local project data."
              />
            ))}
        </div>
      </div>

      {/* --- EDIT TICKET MODAL OVERLAY --- */}
      {editingTicket && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '24px', position: 'relative' }}>
            <h2 className="card__title" style={{ marginBottom: '16px' }}>Adjust Fuel Allocation</h2>
            
            <div style={{ marginBottom: '16px', background: '#f8f9fa', padding: '12px', borderRadius: '6px', border: '1px solid #e9ecef' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#868e96' }}>Driver / Ticket ID</p>
              <strong style={{ display: 'block', color: '#212529' }}>{editingTicket.driverName} <span className="mono" style={{ fontWeight: 'normal', color: '#6c757d' }}>({editingTicket.id})</span></strong>
              <p style={{ margin: '8px 0 4px 0', fontSize: '13px', color: '#868e96' }}>Destination</p>
              <span style={{ color: '#212529' }}>{editingTicket.destination}</span>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Requested Fuel (Litres)</label>
              <input 
                className="input" 
                type="number" 
                value={adjustedFuel}
                onChange={(e) => setAdjustedFuel(Math.max(0, parseInt(e.target.value) || 0))}
                style={{ width: '100%', fontSize: '16px' }}
              />
              <p style={{ fontSize: '12px', color: '#868e96', marginTop: '6px' }}>Saving will automatically approve this ticket with the new amount.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn" onClick={() => setEditingTicket(null)}>Cancel</button>
              <button className="btn btn--forest" onClick={saveFuelAdjustment}>
                <CheckCircle2Icon size={16} /> Approve & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}