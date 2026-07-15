import React, { useState, useRef } from 'react'
// Profile.tsx — account details plus the guarded, clearly scoped local project-data reset.
import {
  AlertTriangleIcon,
  CameraIcon,
  RotateCcwIcon,
  SaveIcon,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useFleetData } from '../../context/FleetDataContext'
import { useToast } from '../../components/Toast/ToastProvider'
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import './Profile.css'
export function Profile() {
  const { user, updateProfile } = useAuth()
  const { resetSystem, restoreDemoRecords, vehicles, drivers } = useFleetData()
  const toast = useToast()
  const ref = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(user?.full_name || '')
  const [role, setRole] = useState(user?.role || '')
  const [office, setOffice] = useState(user?.regional_office || '')
  const [avatar, setAvatar] = useState(user?.avatar)
  const [confirm, setConfirm] = useState(false)
  const initials = (name || 'U')
    .split(' ')
    .map((x) => x[0])
    .slice(0, 2)
    .join('')
  return (
    <div className="profile stack">
      <PageHeader
        title="Profile"
        subtitle="Manage your account and local fleet workspace."
      />
      <form
        className="card profile__card"
        onSubmit={(e) => {
          e.preventDefault()
          updateProfile({
            full_name: name,
            role,
            regional_office: office,
            avatar,
          })
          toast.success('Profile saved locally.')
        }}
      >
        <div className="card__body">
          <div className="profile__avatar-row">
            <div className="profile__avatar">
              {avatar ? <img src={avatar} alt="Your profile" /> : initials}
              <button
                type="button"
                className="profile__avatar-btn"
                onClick={() => ref.current?.click()}
              >
                <CameraIcon size={16} />
              </button>
              <input
                hidden
                ref={ref}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) setAvatar(URL.createObjectURL(f))
                }}
              />
            </div>
            <div>
              <h3 className="profile__name">{name}</h3>
              <p className="profile__email">{user?.email}</p>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label className="field__label">Username</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field__label">Role</label>
              <input
                className="input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="field__label">Regional office</label>
            <input
              className="input"
              value={office}
              onChange={(e) => setOffice(e.target.value)}
            />
          </div>
          <button className="btn btn--primary">
            <SaveIcon size={16} />
            Save changes
          </button>
        </div>
      </form>
      <section className="card profile__reset">
        <div>
          <span className="profile__reset-icon">
            <AlertTriangleIcon size={20} />
          </span>
          <h2>Reset System</h2>
          <p>
            Clear the locally cached frontend project workspace:{' '}
            {vehicles.length} vehicle(s), {drivers.length} driver(s),
            assignments, image previews, maintenance, fuel logs, charts,
            notifications and simulated GPS. Your signed-in account stays
            active. Remote backend records are not affected.
          </p>
        </div>
        <div className="profile__reset-actions">
          <button
            className="btn btn--ghost"
            onClick={() => {
              restoreDemoRecords()
              toast.success('Original demo records restored.')
            }}
          >
            <RotateCcwIcon size={16} />
            Restore demo records
          </button>
          <button className="btn btn--danger" onClick={() => setConfirm(true)}>
            Reset local workspace
          </button>
        </div>
      </section>
      <ConfirmModal
        open={confirm}
        title="Clear local VFMS project data?"
        message="This immediately clears cached demo records, uploaded previews, assignments, maintenance, fuel, charts, notifications and the live simulation from this browser session. It cannot delete remote backend records because no reset endpoint exists."
        confirmLabel="Clear local data"
        danger
        onConfirm={() => {
          resetSystem()
          setConfirm(false)
          toast.success('Local VFMS workspace reset.')
        }}
        onCancel={() => setConfirm(false)}
      />
    </div>
  )
}
