'use client';

import { useState } from 'react';
import OverviewTab      from './tabs/OverviewTab';
import AIVisibilityTab  from './tabs/AIVisibilityTab';
import WebsiteHealthTab from './tabs/WebsiteHealthTab';
import LocalPresenceTab from './tabs/LocalPresenceTab';
import BrandGapTab      from './tabs/BrandGapTab';

// Compute a count badge for each tab based on audit data
function getBadge(id, auditData) {
  if (id === 'website') {
    const issues = auditData?.pageSpeed?.issues ?? {};
    const crawl  = auditData?.crawl ?? {};
    let count = 0;
    if (issues.missingAltTags)    count++;
    if (issues.missingMetaDesc)   count++;
    if (issues.notMobileFriendly) count++;
    if (issues.httpLinks)         count++;
    if (!crawl.hasSchema)         count++;
    if (!crawl.hasCanonical)      count++;
    return count > 0 ? count : null;
  }
  if (id === 'local') {
    return auditData?.places?.found ? null : '!';
  }
  if (id === 'ai') {
    const score = auditData?.claude?.aiVisibilityScore ?? 100;
    return score < 40 ? '!' : null;
  }
  return null;
}

const TABS = [
  { id: 'overview', label: 'Overview',         icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>, component: OverviewTab },
  { id: 'ai',       label: 'AI Visibility',    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>, component: AIVisibilityTab },
  { id: 'website',  label: 'Website Health',   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, component: WebsiteHealthTab },
  { id: 'local',    label: 'Local & Search',   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, component: LocalPresenceTab },
  { id: 'brand',    label: 'Brand Gap',        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, component: BrandGapTab },
];

export default function ResultsTabs({ auditData, onBook }) {
  const [activeTab, setActiveTab] = useState('overview');
  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component;

  return (
    <div>
      {/* Pill-style tab bar */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const badge   = getBadge(tab.id, auditData);
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-brand-orange text-white shadow-[0_0_16px_rgba(232,93,4,0.3)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-gray-500'}>{tab.icon}</span>
              {tab.label}
              {badge !== null && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full leading-none ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active tab content */}
      {ActiveComponent && <ActiveComponent auditData={auditData} onBook={onBook} />}
    </div>
  );
}
