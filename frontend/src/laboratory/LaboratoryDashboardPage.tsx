import React, { useState, useMemo } from 'react';
import {
  DashboardState,
  DashboardFilters,
  demoWorkloadSummary,
  demoAttentionItems,
  demoDashboardOrders,
  filterOrders,
  sortOrders
} from './dashboard-model';
import {
  DashboardHeader,
  WorkloadSummaryCards,
  AttentionSection,
  DashboardFiltersToolbar,
  DashboardOrdersTable,
  DashboardEmptyState,
  DashboardLoadingState
} from './dashboard-components';

interface LaboratoryDashboardPageProps {
  onNavigate?: (destination: 'orders' | 'specimen-collection' | 'order-details', orderId?: string) => void;
}

export function LaboratoryDashboardPage({ onNavigate }: LaboratoryDashboardPageProps) {
  // Dashboard state
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    workloadSummary: demoWorkloadSummary,
    attentionItems: demoAttentionItems,
    orders: demoDashboardOrders,
    filters: {
      searchQuery: '',
      dateRangeFilter: 'today'
    },
    sortBy: 'order-time',
    sortDirection: 'desc'
  });

  const [loading, setLoading] = useState(false);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    const filtered = filterOrders(dashboardState.orders, dashboardState.filters);
    return sortOrders(filtered, dashboardState.sortBy, dashboardState.sortDirection);
  }, [dashboardState.orders, dashboardState.filters, dashboardState.sortBy, dashboardState.sortDirection]);

  // Handlers
  const handleFilterChange = (updates: Partial<DashboardFilters>) => {
    setDashboardState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...updates }
    }));
  };

  const handleClearFilters = () => {
    setDashboardState(prev => ({
      ...prev,
      filters: {
        searchQuery: '',
        dateRangeFilter: 'today'
      }
    }));
  };

  const handleSortChange = (sortBy: DashboardState['sortBy']) => {
    setDashboardState(prev => ({
      ...prev,
      sortBy,
      sortDirection: prev.sortBy === sortBy && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleWorkloadCardClick = (card: string) => {
    // Filter dashboard to show specific status
    if (card === 'newOrders') {
      handleFilterChange({ orderStatusFilter: 'requested' });
    } else if (card === 'awaitingSpecimen') {
      handleFilterChange({ orderStatusFilter: 'specimen-collection-pending' });
    } else if (card === 'inProgress') {
      handleFilterChange({ orderStatusFilter: 'in-progress' });
    } else if (card === 'awaitingReview') {
      handleFilterChange({ orderStatusFilter: 'result-available' });
    }
  };

  const handleAttentionItemAction = (itemId: string) => {
    const item = dashboardState.attentionItems.find(i => i.id === itemId);
    if (!item) return;

    // Navigate to appropriate action
    if (item.type === 'specimen-not-received' || item.type === 'specimen-rejected') {
      onNavigate?.('specimen-collection');
    } else if (item.type === 'awaiting-review') {
      onNavigate?.('order-details', item.orderId);
    } else {
      onNavigate?.('order-details', item.orderId);
    }
  };

  const handleOrderAction = (orderId: string, action: string) => {
    const order = dashboardState.orders.find(o => o.orderId === orderId);
    if (!order) return;

    if (action === 'Collect Specimen' || action === 'Verify Specimen' || action === 'Request Recollection') {
      onNavigate?.('specimen-collection');
    } else if (action === 'Review Result' || action === 'Enter Result') {
      onNavigate?.('order-details', orderId);
    } else {
      onNavigate?.('order-details', orderId);
    }
  };

  const handleViewAllOrders = () => {
    onNavigate?.('orders');
  };

  // Render
  if (loading) {
    return <DashboardLoadingState />;
  }

  return (
    <div className="laboratory-dashboard-page">
      <div className="laboratory-dashboard-container">
        <DashboardHeader onViewAllOrders={handleViewAllOrders} />

        {/* Workload Summary */}
        <WorkloadSummaryCards
          summary={dashboardState.workloadSummary}
          onCardClick={handleWorkloadCardClick}
        />

        {/* Attention Required */}
        {dashboardState.attentionItems.length > 0 && (
          <AttentionSection
            items={dashboardState.attentionItems}
            onActionClick={handleAttentionItemAction}
          />
        )}

        {/* Filters and Orders Table */}
        <div className="laboratory-dashboard-main">
          <div className="laboratory-dashboard-section">
            <div className="laboratory-section-header">
              <h2 className="laboratory-section-title">Laboratory Orders</h2>
              <span className="laboratory-section-count">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>

            <DashboardFiltersToolbar
              filters={dashboardState.filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              resultCount={filteredOrders.length}
            />

            {filteredOrders.length === 0 ? (
              <DashboardEmptyState
                hasActiveFilters={
                  dashboardState.filters.searchQuery.length >= 2 ||
                  !!dashboardState.filters.testTypeFilter ||
                  !!dashboardState.filters.orderStatusFilter ||
                  !!dashboardState.filters.specimenStatusFilter ||
                  !!dashboardState.filters.priorityFilter
                }
                onClearFilters={handleClearFilters}
              />
            ) : (
              <DashboardOrdersTable
                orders={filteredOrders}
                sortBy={dashboardState.sortBy}
                sortDirection={dashboardState.sortDirection}
                onSortChange={handleSortChange}
                onOrderAction={handleOrderAction}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaboratoryDashboardPage;
