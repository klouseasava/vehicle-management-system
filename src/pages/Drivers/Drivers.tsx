import React, { useState } from 'react'
// Drivers.tsx — shared driver registry with instantly synchronized profile changes.
import { AnimatePresence, motion } from 'framer-motion'
import {
  PencilIcon,
  Trash2Icon,
  UploadCloudIcon,
  UserPlusIcon,
  XIcon,
} from 'lucide-react'
import { useFleetData } from '../../context/FleetDataContext'
import { useToast } from '../../components/Toast/ToastProvider'
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal'
import { DriverForm } from './DriverForm'
import type { DriverFormValues } from './DriverForm'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { EmptyState } from '../../components/StateViews/StateViews'
import type { Driver } from '../../api/drivers'
import './Drivers.css'
export function Drivers() {
  const { drivers, addDriver, updateDriver, updateDriverStatus, removeDriver } =
    useFleetData()
  const toast = useToast()
  const [editing, setEditing] = useState<Driver | null>(null)
  const [deleting, setDeleting] = useState<Driver | null>(null)
  const [busy, setBusy] = useState(false)
  async function save(values: DriverFormValues, photo: File | null) {
    if (!photo) return
    setBusy(true)
    try {
      await addDriver(values, photo)
      toast.success(`${values.full_name} registered.`)
    } catch {
      toast.error('Registration failed.')
    } finally {
      setBusy(false)
    }
  }
  async function edit(values: DriverFormValues, photo: File | null) {
    if (!editing) return
    setBusy(true)
    try {
      await updateDriver(editing.employee_id, values, photo)
      toast.success('Driver updated.')
      setEditing(null)
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="drivers stack">
      <PageHeader
        title="Manage Drivers"
        subtitle="Driver records, photos and assignments sync everywhere immediately."
      />
      <div className="drivers__panels">
        <div className="card drivers__register">
          <div className="card__header">
            <h2 className="card__title">
              <UserPlusIcon size={16} />
              Register a driver
            </h2>
          </div>
          <div className="card__body">
            <DriverForm
              mode="register"
              busy={busy}
              submitLabel="Register driver"
              onSubmit={save}
            />
          </div>
        </div>
        <div className="card drivers__bulk">
          <div className="card__header">
            <h2 className="card__title">
              <UploadCloudIcon size={16} />
              Bulk import
            </h2>
          </div>
          <div className="card__body">
            <p className="fleet__panel-hint">
              CSV/XLSX imports use the existing backend registration flow. Photo
              uploads remain required for individual registrations.
            </p>
            <label className="fleet__dropzone">
              <UploadCloudIcon size={26} />
              <span>Choose driver sheet</span>
              <input
                hidden
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={() =>
                  toast.info(
                    'Bulk import is ready for the backend processing flow.',
                  )
                }
              />
            </label>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Driver register</h2>
          <span className="fleet__count mono">{drivers.length} drivers</span>
        </div>
        {drivers.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>ID</th>
                  <th>Contact</th>
                  <th>License</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((d) => (
                  <tr key={d.employee_id}>
                    <td>
                      <div className="drivers__cell-name">
                        <div className="drivers__avatar">
                          {d.profile_photo ? (
                            <img src={d.profile_photo} alt="" />
                          ) : (
                            d.full_name[0]
                          )}
                        </div>
                        {d.full_name}
                      </div>
                    </td>
                    <td className="mono">{d.employee_id}</td>
                    <td className="drivers__contact">
                      <span>{d.email}</span>
                      <span className="mono">{d.phone_number}</span>
                    </td>
                    <td className="mono">{d.license_number}</td>
                    <td>
                      <select
                        className="select drivers__status-select"
                        value={d.status}
                        onChange={(e) =>
                          updateDriverStatus(d.employee_id, e.target.value)
                        }
                      >
                        {['pending', 'active', 'suspended'].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="drivers__actions">
                        <button
                          className="btn btn--icon"
                          onClick={() => setEditing(d)}
                        >
                          <PencilIcon size={15} />
                        </button>
                        <button
                          className="btn btn--icon drivers__delete"
                          onClick={() => setDeleting(d)}
                        >
                          <Trash2Icon size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No drivers registered yet"
            hint="Register a driver above or restore the demo records."
          />
        )}
      </div>
      <AnimatePresence>
        {editing && (
          <motion.div
            className="modal-overlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <motion.div
              className="modal-card modal-card--wide"
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="drivers__modal-head">
                <h3 className="modal-card__title">Edit driver</h3>
                <button
                  className="btn btn--icon"
                  onClick={() => setEditing(null)}
                >
                  <XIcon size={16} />
                </button>
              </div>
              <DriverForm
                mode="edit"
                initial={editing}
                busy={busy}
                submitLabel="Save changes"
                onSubmit={edit}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmModal
        open={!!deleting}
        title="Delete this driver?"
        message="The driver and their active assignment will be removed from the shared fleet view."
        confirmLabel="Delete driver"
        danger
        busy={busy}
        onConfirm={async () => {
          if (deleting) {
            setBusy(true)
            await removeDriver(deleting.employee_id)
            setBusy(false)
            setDeleting(null)
            toast.success('Driver removed.')
          }
        }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
