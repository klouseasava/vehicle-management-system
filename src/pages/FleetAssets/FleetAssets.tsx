import React, { useMemo, useState } from 'react'
// FleetAssets.tsx — shared fleet register, assignments, and client-side vehicle imagery.
import {
  EyeIcon,
  ImagePlusIcon,
  LinkIcon,
  PlusIcon,
  UploadCloudIcon,
} from 'lucide-react'
import { useFleetData } from '../../context/FleetDataContext'
import { useToast } from '../../components/Toast/ToastProvider'
import { ImageGalleryModal } from '../../components/ImageGalleryModal/ImageGalleryModal'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { EmptyState } from '../../components/StateViews/StateViews'
import { StatusBadge } from '../../components/StatusBadge/StatusBadge'
import './FleetAssets.css'
const TABS = ['All', 'Assigned', 'Unassigned', 'Archived'] as const
export function FleetAssets() {
  const { vehicles, drivers, addVehicle, assignDriver, updateVehicleImages } =
    useFleetData()
  const toast = useToast()
  const [tab, setTab] = useState<(typeof TABS)[number]>('All')
  const [plate, setPlate] = useState('')
  const [model, setModel] = useState('')
  const [cc, setCc] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [assignPlate, setAssignPlate] = useState('')
  const [assignEmp, setAssignEmp] = useState('')
  const [gallery, setGallery] = useState<{
    title: string
    images: string[]
  } | null>(null)
  const filtered = useMemo(
    () =>
      tab === 'All'
        ? vehicles
        : vehicles.filter(
            (v) => (v.status || '').toLowerCase() === tab.toLowerCase(),
          ),
    [vehicles, tab],
  )
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!plate || !model || !cc)
      return toast.error('Plate, model and engine size are required.')
    setBusy(true)
    try {
      await addVehicle({
        plate_number: plate,
        model,
        engine_size_cc: Number(cc),
        image_urls: images.map((f) => URL.createObjectURL(f)),
      })
      toast.success(`${plate} added to the fleet.`)
      setPlate('')
      setModel('')
      setCc('')
      setImages([])
    } catch {
      toast.error('Could not add vehicle.')
    } finally {
      setBusy(false)
    }
  }
  async function assign(e: React.FormEvent) {
    e.preventDefault()
    const result = await assignDriver(assignPlate, assignEmp)
    result.ok
      ? (toast.success('Assignment authorized.'),
        setAssignPlate(''),
        setAssignEmp(''))
      : toast.error(result.message || 'Assignment failed.')
  }
  return (
    <div className="fleet stack">
      <PageHeader
        title="Manage Fleet Assets"
        subtitle="One shared fleet register, synced across tracking, maintenance and fuel."
      />
      <div className="fleet__actions">
        <form className="card fleet__panel" onSubmit={submit}>
          <div className="fleet__panel-head">
            <PlusIcon size={16} />
            Add a vehicle
          </div>
          <div className="field">
            <label className="field__label">
              Plate number<span className="req">*</span>
            </label>
            <input
              className="input"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="KDM 420X"
            />
          </div>
          <div className="field">
            <label className="field__label">
              Model<span className="req">*</span>
            </label>
            <input
              className="input"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Toyota Hiace"
            />
          </div>
          <div className="field">
            <label className="field__label">
              Engine size (cc)<span className="req">*</span>
            </label>
            <input
              className="input"
              type="number"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
            />
          </div>
          <label className="fleet__images">
            <ImagePlusIcon size={16} />
            <span>
              {images.length
                ? `${images.length} photo(s) ready`
                : 'Add vehicle photos'}
            </span>
            <input
              hidden
              multiple
              accept="image/*"
              type="file"
              onChange={(e) => setImages(Array.from(e.target.files || []))}
            />
          </label>
          {images.length > 0 && (
            <div className="fleet__previews">
              {images.map((f) => (
                <img
                  key={f.name}
                  src={URL.createObjectURL(f)}
                  alt="Vehicle preview"
                />
              ))}
            </div>
          )}
          <button className="btn btn--primary btn--block" disabled={busy}>
            {busy ? 'Adding…' : 'Add vehicle'}
          </button>
        </form>
        <div className="card fleet__panel">
          <div className="fleet__panel-head">
            <UploadCloudIcon size={16} />
            Bulk upload
          </div>
          <p className="fleet__panel-hint">
            CSV/XLSX upload remains connected to the backend. Image files are
            saved per asset locally until a media endpoint exists.
          </p>
          <label className="fleet__dropzone">
            <UploadCloudIcon size={26} />
            <span>Choose fleet sheet</span>
            <input
              hidden
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={() =>
                toast.info(
                  'Bulk import is available through the backend integration.',
                )
              }
            />
          </label>
        </div>
        <form className="card fleet__panel" onSubmit={assign}>
          <div className="fleet__panel-head">
            <LinkIcon size={16} />
            Assign driver
          </div>
          <div className="field">
            <label className="field__label">Vehicle</label>
            <select
              className="select"
              value={assignPlate}
              onChange={(e) => setAssignPlate(e.target.value)}
            >
              <option value="">Select vehicle</option>
              {vehicles
                .filter((v) => v.status !== 'Archived')
                .map((v) => (
                  <option key={v.plate_number} value={v.plate_number}>
                    {v.plate_number}
                  </option>
                ))}
            </select>
          </div>
          <div className="field">
            <label className="field__label">Driver</label>
            <select
              className="select"
              value={assignEmp}
              onChange={(e) => setAssignEmp(e.target.value)}
            >
              <option value="">Select driver</option>
              {drivers.map((d) => (
                <option key={d.employee_id} value={d.employee_id}>
                  {d.full_name} · {d.employee_id}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn--forest btn--block">
            Authorize assignment
          </button>
        </form>
      </div>
      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Fleet register</h2>
          <span className="fleet__count mono">{vehicles.length} vehicles</span>
        </div>
        <div className="tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t}
              className={`tab ${tab === t ? 'tab--active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
              {tab === t && <span className="tab__indicator" />}
            </button>
          ))}
        </div>
        {filtered.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Plate</th>
                  <th>Make / model</th>
                  <th>Year</th>
                  <th>Meter</th>
                  <th>Status</th>
                  <th>Images</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.plate_number}>
                    <td>
                      {v.image_urls?.[0] ? (
                        <img
                          className="fleet__thumb"
                          src={v.image_urls[0]}
                          alt=""
                        />
                      ) : (
                        <span className="fleet__thumb fleet__thumb--empty">
                          —
                        </span>
                      )}
                    </td>
                    <td className="mono">
                      <b>{v.plate_number}</b>
                    </td>
                    <td>
                      {v.make || ''} {v.model}
                    </td>
                    <td className="mono">{v.year || '—'}</td>
                    <td className="mono">
                      {v.meter_reading?.toLocaleString() || '—'}
                    </td>
                    <td>
                      <StatusBadge status={v.status || 'Unassigned'} />
                    </td>
                    <td>
                      <div className="fleet__image-actions">
                        <button
                          className="btn btn--icon"
                          onClick={() =>
                            setGallery({
                              title: v.plate_number,
                              images: v.image_urls || [],
                            })
                          }
                          aria-label="View vehicle images"
                        >
                          <EyeIcon size={15} />
                        </button>
                        <label className="btn btn--icon">
                          <ImagePlusIcon size={15} />
                          <input
                            hidden
                            multiple
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              updateVehicleImages(
                                v.plate_number,
                                Array.from(e.target.files || []),
                              )
                            }
                          />
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No fleet assets here"
            hint="Add a vehicle or restore demo records from Profile."
          />
        )}
      </div>
      <ImageGalleryModal
        open={!!gallery}
        title={gallery?.title || ''}
        images={gallery?.images || []}
        onClose={() => setGallery(null)}
      />
    </div>
  )
}
