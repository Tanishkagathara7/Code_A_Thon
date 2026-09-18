'use client';

import React from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

interface ServiceItem {
  name: string;
  status: 'Healthy' | 'Degraded';
  uptime: string;
  latency: string;
  iconColor: string;
}

export const ServiceHealthSection: React.FC = () => {
  const services: ServiceItem[] = [
    {
      name: 'API Gateway',
      status: 'Healthy',
      uptime: '99.98% uptime',
      latency: '24ms',
      iconColor: '#10B981',
    },
    {
      name: 'Auth Service',
      status: 'Healthy',
      uptime: '99.95% uptime',
      latency: '37ms',
      iconColor: '#10B981',
    },
    {
      name: 'Database',
      status: 'Degraded',
      uptime: '99.80% uptime',
      latency: '120ms',
      iconColor: '#F59E0B',
    },
    {
      name: 'Worker Queue',
      status: 'Healthy',
      uptime: '99.97% uptime',
      latency: '42ms',
      iconColor: '#10B981',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E6E9F0] p-6 shadow-xs flex flex-col justify-between">
      {/* Section Header */}
      <div className="flex items-start justify-between gap-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16B981] flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#101226]">Service Health</h3>
            <p className="text-xs text-[#68728A]">Core infrastructure and subsystem status</p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-semibold text-[#5B45F5] hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <span>&rarr;</span>
        </Link>
      </div>

      {/* 4 Service Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {services.map((svc) => {
          const isDegraded = svc.status === 'Degraded';

          return (
            <div
              key={svc.name}
              className="p-4 rounded-xl border border-[#E6E9F0] bg-white hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
            >
              {/* Card top */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Service icon/dot */}
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: svc.iconColor }}
                  />
                  <h4 className="text-xs font-bold text-[#101226] truncate">
                    {svc.name}
                  </h4>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isDegraded
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : 'bg-[#DCFCE7] text-[#16B981]'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isDegraded ? '#D97706' : '#16B981' }}
                  />
                  <span>{svc.status}</span>
                </span>
              </div>

              {/* Uptime text */}
              <div className="text-[11px] text-[#68728A] mt-2 font-medium">
                {svc.uptime}
              </div>

              {/* Latency sparkline bar row & latency number */}
              <div className="flex items-center justify-between gap-3 mt-3 pt-1">
                {/* Mini vertical bars */}
                <div className="flex items-end gap-1 flex-1 h-5">
                  {[40, 60, 50, 70, 60, 90, 80, 65, 85, 75, 95, 80, 90].map((h, idx) => (
                    <div
                      key={idx}
                      className="flex-1 rounded-t-xs"
                      style={{
                        height: `${h}%`,
                        backgroundColor:
                          isDegraded && idx >= 8 ? '#F59E0B' : '#10B981',
                      }}
                    />
                  ))}
                </div>

                <span className="text-xs font-bold text-[#101226] shrink-0 font-mono">
                  {svc.latency}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
