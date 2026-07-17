// vehicle-fleet/src/pages/Reports/Reports.tsx
import { PageHeader } from '../../components/PageHeader/PageHeader'

export function Reports() {
  return (
    <div className="reports-page" style={{ padding: '24px' }}>
      <PageHeader
        title="Official Reports & Statements"
        subtitle="Generate and download verified vehicle logs, driver metrics, and work tickets."
      />
      
      <div 
        className="card" 
        style={{ 
          background: 'var(--vfms-surface)', 
          padding: '24px', 
          borderRadius: 'var(--vfms-radius)', 
          border: '1px solid var(--vfms-border)', 
          marginTop: '20px' 
        }}
      >
        <h2 style={{ color: 'var(--vfms-forest)', marginBottom: '10px' }}>System Report Panel</h2>
        <p style={{ color: 'var(--vfms-ink-2)', fontSize: '0.9rem', marginBottom: '20px' }}>
          Select parameters below to extract operational data from Vihiga County fleet systems.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.85rem' }}>Report Type</label>
            <select style={{ width: '100%', padding: '10px', borderRadius: 'var(--vfms-radius-sm)', border: '1px solid var(--vfms-border)' }}>
              <option>Driver Performance Report</option>
              <option>Vehicle Log Sheet</option>
              <option>Fuel Consumption Ledger</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.85rem' }}>Export Format</label>
            <select style={{ width: '100%', padding: '10px', borderRadius: 'var(--vfms-radius-sm)', border: '1px solid var(--vfms-border)' }}>
              <option>Adobe PDF (.pdf)</option>
              <option>Spreadsheet Excel (.xlsx)</option>
            </select>
          </div>
        </div>

        <button 
          className="btn" 
          style={{ 
            marginTop: '24px', 
            background: 'var(--vfms-forest)', 
            color: 'white', 
            border: 'none', 
            padding: '12px 20px', 
            borderRadius: 'var(--vfms-radius-sm)',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => alert('Compiling records for export...')}
        >
          Compile and Export
        </button>
      </div>
    </div>
  )
}