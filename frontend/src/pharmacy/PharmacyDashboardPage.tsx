/**
 * Pharmacy Dashboard Page
 * ORHIMS Phase 07 - Pharmacy Management (Prompt 36)
 */

import { useState } from 'react'
import {
  PharmacyContext,
  PharmacyMetrics,
  PrescriptionQueueItem,
  MedicineInventoryItem,
  ExpiryMonitoringItem,
  StockMovement,
  PharmacyAlert,
  demoPharmacyContext,
  demoPharmacyMetrics,
  demoPrescriptionQueue,
  demoInventoryAlerts,
  demoExpiryMonitoring,
  demoStockMovements,
  demoPharmacyAlerts
} from './pharmacy-model'

import {
  DashboardHeader,
  MetricsCards,
  PrescriptionQueueSection,
  InventoryAlertsSection,
  ExpiryMonitoringSection,
  StockMovementsSection,
  PharmacyAlertsSection,
  SearchSection,
  DashboardLoadingState,
  DashboardErrorState
} from './pharmacy-components'

import './pharmacy.css'

interface PharmacyDashboardPageProps {
  onNavigate: (destination: string, params?: Record<string, unknown>) => void
}

export default function PharmacyDashboardPage({ onNavigate }: PharmacyDashboardPageProps) {
  const [context] = useState<PharmacyContext>(demoPharmacyContext)
  const [metrics] = useState<PharmacyMetrics>(demoPharmacyMetrics)
  const [prescriptionQueue] = useState<PrescriptionQueueItem[]>(demoPrescriptionQueue)
  const [inventoryAlerts] = useState<MedicineInventoryItem[]>(demoInventoryAlerts)
  const [expiryItems] = useState<ExpiryMonitoringItem[]>(demoExpiryMonitoring)
  const [stockMovements] = useState<StockMovement[]>(demoStockMovements)
  const [alerts] = useState<PharmacyAlert[]>(demoPharmacyAlerts)
  const [isLoading] = useState<boolean>(false)
  const [error] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleRefresh = () => {
    console.log('Refreshing pharmacy dashboard data...')
    // In real implementation, this would reload data from API
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    console.log('Searching for:', query)
    // In real implementation, this would navigate to search results
  }

  const handleMetricClick = (metricType: string) => {
    console.log('Navigating to:', metricType)
    if (metricType === 'pending' || metricType === 'in-progress' || metricType === 'dispensed') {
      onNavigate('prescriptions', { filter: metricType })
    } else if (metricType === 'low-stock' || metricType === 'out-of-stock') {
      onNavigate('inventory', { filter: metricType })
    } else if (metricType === 'expiry') {
      onNavigate('expiry-monitoring')
    }
  }

  const handlePrescriptionClick = (prescription: PrescriptionQueueItem) => {
    console.log('Opening prescription:', prescription.prescriptionNumber)
    onNavigate('prescriptions', { prescriptionId: prescription.prescriptionId })
  }

  const handleInventoryClick = (medicine: MedicineInventoryItem) => {
    console.log('Viewing inventory:', medicine.medicineName)
    onNavigate('inventory', { medicineId: medicine.medicineId })
  }

  const handleExpiryClick = (item: ExpiryMonitoringItem) => {
    console.log('Viewing expiry details:', item.batchNumber)
    onNavigate('expiry-monitoring', { batchId: item.batchId })
  }

  const handleAlertClick = (alert: PharmacyAlert) => {
    console.log('Handling alert:', alert.alertId)
    if (alert.actionLink) {
      // In real implementation, would parse and navigate to alert destination
      console.log('Navigate to:', alert.actionLink)
    }
  }

  if (isLoading) {
    return <DashboardLoadingState />
  }

  if (error) {
    return <DashboardErrorState error={error} onRetry={handleRefresh} />
  }

  return (
    <div className="pharmacy-dashboard">
      <DashboardHeader
        context={context}
        onRefresh={handleRefresh}
      />

      <div className="dashboard-content">
        <MetricsCards
          metrics={metrics}
          onMetricClick={handleMetricClick}
        />

        <SearchSection
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onNavigate={onNavigate}
        />

        <div className="dashboard-grid">
          <div className="dashboard-main-column">
            <PrescriptionQueueSection
              prescriptions={prescriptionQueue}
              onPrescriptionClick={handlePrescriptionClick}
              onViewAll={() => onNavigate('prescriptions')}
            />

            <InventoryAlertsSection
              items={inventoryAlerts}
              onItemClick={handleInventoryClick}
              onViewAll={() => onNavigate('inventory')}
            />
          </div>

          <div className="dashboard-side-column">
            <PharmacyAlertsSection
              alerts={alerts}
              onAlertClick={handleAlertClick}
            />

            <ExpiryMonitoringSection
              items={expiryItems.slice(0, 5)}
              onItemClick={handleExpiryClick}
              onViewAll={() => onNavigate('expiry-monitoring')}
            />

            <StockMovementsSection
              movements={stockMovements.slice(0, 5)}
              onViewAll={() => onNavigate('stock-movements')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
