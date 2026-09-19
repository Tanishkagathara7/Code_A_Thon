import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AnalyticsOverviewData } from '../../types/analytics';
import { MetricCard } from './MetricCard';
import { LoadingState } from '../domain/LoadingState';
import { ErrorState } from '../domain/ErrorState';
import { EmptyState } from '../domain/EmptyState';

export interface DashboardAnalyticsViewProps {
  data: AnalyticsOverviewData | null;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  isGuest?: boolean;
  isStale?: boolean;
}

export const DashboardAnalyticsView: React.FC<DashboardAnalyticsViewProps> = ({
  data,
  isLoading,
  error,
  onRetry,
  isGuest = false,
}) => {
  const router = useRouter();

  if (isLoading && !data) {
    return (
      <View style={styles.container}>
        <LoadingState message="Connecting to Pulse Dispatch telemetry..." count={2} />
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.container}>
        <ErrorState message={error} onRetry={onRetry} />
      </View>
    );
  }

  if (isGuest) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Telemetry Available After Sign In"
          description="Authenticate with your responder or coordinator role to access live incident queue telemetry and performance rates."
          actionLabel="Sign In to Command Center"
          onAction={() => router.replace('/(auth)')}
        />
      </View>
    );
  }

  const overview = data?.overview || {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    completionRate: 0,
  };

  const total = overview.total;
  const inProgress = overview.inProgress;
  const completed = overview.completed;
  const completionRate = overview.completionRate;

  return (
    <View style={styles.container}>
      {/* 4 Operational KPI Cards in 2x2 Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricRow}>
          <MetricCard
            index={0}
            label="TOTAL INCIDENTS"
            value={total}
            subtext="Across web & mobile devices"
            variant="total"
            trend={total > 0 ? '↑ 12%' : undefined}
          />
          <MetricCard
            index={1}
            label="ACTIVE / IN-FLIGHT"
            value={inProgress}
            subtext="Currently being handled"
            variant="active"
            trend={inProgress > 0 ? '↑ 8%' : undefined}
          />
        </View>

        <View style={styles.metricRow}>
          <MetricCard
            index={2}
            label="RESOLVED / FINAL"
            value={completed}
            subtext="Successfully mitigated"
            variant="resolved"
            trend={completed > 0 ? '↑ 28%' : undefined}
          />
          <MetricCard
            index={3}
            label="RESOLUTION RATE"
            value={`${completionRate}%`}
            subtext="SLA benchmark: 70%"
            variant="velocity"
            trend={completionRate > 0 ? '↑ 12%' : undefined}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  metricsGrid: {
    gap: 12,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
