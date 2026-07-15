import React, { useMemo, useState } from 'react'
// Maintenance.tsx — shared parts ledger and defect reporting.
import { AlertTriangleIcon, SirenIcon } from 'lucide-react'
import { useFleetData } from '../../context/FleetDataContext'
import { useToast } from '../../components/Toast/ToastProvider'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { EmptyState } from '../../components/StateViews/StateViews'
import { StatusBadge } from '../../components/StatusBadge/StatusBadge'
import './Maintenance.css'
export function Maintenance() {
  const { ledger, vehicles, reportDefect } = useFleetData()
  const toast = useToast()
  const [plate, setPlate] = useState('')
  const [part, setPart] = useState('')
  const [urgency, setUrgency] = useState('Medium')
  const [sort, setSort] = useState('agency_priority')
  const rows = useMemo(
    () =>
      [...ledger].sort((a, b) =>
        sort === 'model_asc'
          ? a.model.localeCompare(b.model)
          : sort === 'cost_asc'
            ? a.ai_quote.localeCompare(b.ai_quote)
            : 0,
      ),
    [ledger, sort],
  )
  return (
    <div className="maint stack">
      <PageHeader
        title="Service & Maintenance"
        subtitle="Shared defect records update dashboard trends instantly."
      />
      <div className="card maint__legend">
        <div className="maint__legend-bands">
          <div className="maint__band maint__band--green">
            Green · under 4,500 km
          </div>
          <div className="maint__band maint__band--amber">
            Amber · schedule service
          </div>
          <div className="maint__band maint__band--red">Red · overdue</div>
        </div>
      </div>
      <div className="maint__grid">
        <form
          className="card maint__report"
          onSubmit={async (e) => {
            e.preventDefault()
            if (!plate || !part) return toast.error('Choose a plate and part.')
            await reportDefect({
              plate_number: plate,
              part_name: part,
              urgency_level: urgency,
            })
            toast.success('Defect added to the shared ledger.')
            setPart('')
          }}
        >
          <div className="card__header">
            <h2 className="card__title">
              <AlertTriangleIcon size={16} />
              Report a defect
            </h2>
          </div>
          <div className="card__body">
            <div className="field">
              <label className="field__label">Vehicle</label>
              <select
                className="select"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
              >
                <option value="">Select asset</option>
                {vehicles.map((v) => (
                  <option key={v.plate_number}>{v.plate_number}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label">Part</label>
              <input
                className="input"
                value={part}
                onChange={(e) => setPart(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field__label">Urgency</label>
              <select
                className="select"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                {['Low', 'Medium', 'High', 'Critical'].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            <button className="btn btn--primary btn--block">
              Submit defect report
            </button>
          </div>
        </form>
        <div className="card maint__ledger">
          <div className="card__header">
            <h2 className="card__title">Parts ledger</h2>
            <select
              className="select maint__sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="agency_priority">Agency Priority</option>
              <option value="cost_asc">Cost Low–High</option>
              <option value="model_asc">Vehicle Model</option>
            </select>
          </div>
          {rows.length ? (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Agency</th>
                    <th>Plate</th>
                    <th>Model</th>
                    <th>Part</th>
                    <th>Urgency</th>
                    <th>AI quote</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td>
                        {['Ambulance', 'Governor Escort'].includes(
                          r.agency,
                        ) && <SirenIcon size={13} />}{' '}
                        {r.agency}
                      </td>
                      <td className="mono">{r.plate_number}</td>
                      <td>{r.model}</td>
                      <td>{r.part_name}</td>
                      <td>
                        <StatusBadge status={r.urgency} />
                      </td>
                      <td className="mono">{r.ai_quote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No open parts requests"
              hint="Report a defect to begin the ledger."
            />
          )}
        </div>
      </div>
    </div>
  )
}
