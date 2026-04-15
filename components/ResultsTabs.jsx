'use client';

import { useState } from 'react';
import OverviewTab     from './tabs/OverviewTab';
import AIVisibilityTab from './tabs/AIVisibilityTab';
import WebsiteHealthTab from './tabs/WebsiteHealthTab';
import LocalPresenceTab from './tabs/LocalPresenceTab';
import BrandGapTab      from './tabs/BrandGapTab';

const TABS = [
  { id: 'overview', label: '📊 Overview',           component: OverviewTab },
  { id: 'ai',       label: '🤖 AI Visibility',       component: AIVisibilityTab },
  { id: 'website',  label: '⚡ Website Health',       component: WebsiteHealthTab },
  { id: 'local',    label: '📍 Local & Search',       component: LocalPresenceTab },
  { id: 'brand',    label: '🎯 Brand Gap Analysis',   component: BrandGapTab },
];

export default function ResultsTabs({ auditData, onBook }) {
  const [activeTab, setActiveTab] = useState('overview');

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-white/10 mb-8 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-brand-orange text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      {ActiveComponent && <ActiveComponent auditData={auditData} onBook={onBook} />}
    </div>
  );
}
