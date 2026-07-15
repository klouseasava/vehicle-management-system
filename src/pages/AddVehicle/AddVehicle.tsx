import React, { useState } from 'react'
// AddVehicle.tsx — focused asset intake wired into the shared fleet context.
import { ImagePlusIcon, InfoIcon, SaveIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFleetData } from '../../context/FleetDataContext'
import { useToast } from '../../components/Toast/ToastProvider'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import './AddVehicle.css'
export function AddVehicle() {
  const { addVehicle } = useFleetData()
  const toast = useToast()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [plate, setPlate] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [vin, setVin] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !plate || !model)
      return toast.error('Vehicle name, plate and model are required.')
    setBusy(true)
    await addVehicle({
      name,
      plate_number: plate,
      model,
      make,
      year: Number(year) || undefined,
      vin,
      image_urls: images.map((f) => URL.createObjectURL(f)),
    })
    setBusy(false)
    toast.success('Vehicle asset saved across VFMS.')
    navigate('/fleet')
  }
  return (
    <div className="add-vehicle">
      <PageHeader
        title="Add Vehicle"
        subtitle="Create a connected asset record with optional vehicle imagery."
      />
      <div className="add-vehicle__layout">
        <form className="card add-vehicle__form" onSubmit={submit}>
          <div className="card__body">
            <div className="field">
              <label className="field__label">
                Vehicle name<span className="req">*</span>
              </label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label className="field__label">VIN / serial</label>
                <input
                  className="input mono"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                />
              </div>
              <div className="field">
                <label className="field__label">
                  Plate<span className="req">*</span>
                </label>
                <input
                  className="input"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label className="field__label">Make</label>
                <input
                  className="input"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
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
                />
              </div>
            </div>
            <div className="field">
              <label className="field__label">Model year</label>
              <input
                className="input"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <label className="fleet__images">
              <ImagePlusIcon size={16} />
              Add vehicle images
              <input
                hidden
                multiple
                type="file"
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
              />
            </label>
            <button className="btn btn--primary btn--block" disabled={busy}>
              <SaveIcon size={16} />
              {busy ? 'Saving…' : 'Save vehicle asset'}
            </button>
          </div>
        </form>
        <div className="add-vehicle__side">
          <div className="info-callout">
            <InfoIcon size={16} />
            <span>
              <b>Assignment rule:</b> one active vehicle per driver. Images are
              stored in this browser session until a backend media endpoint is
              available.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}