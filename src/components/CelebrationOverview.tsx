import React, { useState } from 'react';
import { Calendar, Users, Sparkles, ChevronRight } from 'lucide-react';
import { weddingEvents } from '../data/events';
import { wedding } from '../data/wedding';

interface CelebrationOverviewProps {
  selectedTeam: 'bride' | 'groom' | null;
  onSelectEvent?: (eventId: string) => void;
}

export const CelebrationOverview: React.FC<CelebrationOverviewProps> = ({
  selectedTeam,
  onSelectEvent,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'pulse'>('schedule');

  // Realistic mock data reflecting wedding community engagement
  const brideCheers = 142 + (selectedTeam === 'bride' ? 1 : 0);
  const groomCheers = 128 + (selectedTeam === 'groom' ? 1 : 0);
  const totalCheers = brideCheers + groomCheers;
  const bridePercent = Math.round((brideCheers / totalCheers) * 100);
  const groomPercent = 100 - bridePercent;

  const eventAttendance = [
    { id: 'haldi', name: 'Haldi', attendees: 185, max: 220, color: '#f59e0b', day: 'Day 1' },
    { id: 'mehndi', name: 'Mehndi', attendees: 210, max: 240, color: '#c46d4c', day: 'Day 2' },
    { id: 'sangeet', name: 'Sangeet', attendees: 280, max: 300, color: '#861633', day: 'Day 3' },
    { id: 'wedding', name: 'The Wedding', attendees: 320, max: 350, color: '#c59b27', day: 'Day 4' },
  ];

  return (
    <section className="celebration-overview-section" aria-labelledby="overview-heading">
      <div className="overview-header">
        <span className="overview-tag">AT A GLANCE</span>
        <h2 id="overview-heading" className="overview-title">Celebration Overview</h2>
        <p className="overview-sub">
          A visual overview of the sacred celebrations and guest community pulse
        </p>

        {/* Tab Switcher */}
        <div className="overview-tabs-pill">
          <button
            type="button"
            className={`overview-tab-btn ${activeTab === 'schedule' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={14} />
            <span>4-Day Itinerary Flow</span>
          </button>
          <button
            type="button"
            className={`overview-tab-btn ${activeTab === 'pulse' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('pulse')}
          >
            <Users size={14} />
            <span>Celebration Pulse</span>
          </button>
        </div>
      </div>

      {activeTab === 'schedule' ? (
        /* Visual Schedule Flow */
        <div className="schedule-flow-card deckled-paper">
          <div className="schedule-timeline-grid">
            {weddingEvents.map((event, idx) => {
              const accents = ['#f59e0b', '#c46d4c', '#861633', '#c59b27'];
              const accentColor = accents[idx % accents.length];

              return (
                <div
                  key={event.id}
                  className="schedule-step-card"
                  onClick={() => onSelectEvent?.(event.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectEvent?.(event.id);
                    }
                  }}
                  title={`View ${event.title} details`}
                >
                  <div className="step-badge" style={{ backgroundColor: accentColor }}>
                    <span>{idx + 1}</span>
                  </div>

                  <div className="step-info">
                    <span className="step-day-label">DAY {idx + 1}</span>
                    <h4 className="step-title">{event.title}</h4>
                    <span className="step-date-text">{event.date}</span>
                    <span className="step-time-text">{event.startTime}</span>
                    <span className="step-dress-tag">{event.dressCode}</span>
                  </div>

                  <ChevronRight size={16} className="step-arrow" />
                </div>
              );
            })}
          </div>

          <div className="schedule-footer-note">
            <Sparkles size={13} className="note-icon" />
            <span>All ceremonies held at The Taj Palace, Banjara Hills, Hyderabad</span>
          </div>
        </div>
      ) : (
        /* Celebration Pulse & Clean Minimalist Charts */
        <div className="pulse-summary-card deckled-paper">
          <div className="pulse-card-header">
            <h4 className="pulse-heading">Guest Rivalry &amp; RSVP Pulse</h4>
            <span className="pulse-subtitle">Live votes and attendance distribution</span>
          </div>

          <div className="pulse-grid">
            {/* Minimalist SVG Donut Chart for Team Rivalry */}
            <div className="pulse-donut-block">
              <div className="donut-chart-container">
                <svg viewBox="0 0 120 120" className="donut-svg">
                  {/* Background Circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="#f5ede0"
                    strokeWidth="12"
                  />
                  {/* Team Groom */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="#c59b27"
                    strokeWidth="12"
                    strokeDasharray={`${(groomPercent / 100) * 282.7} 282.7`}
                    strokeDashoffset="0"
                    transform="rotate(-90 60 60)"
                    strokeLinecap="round"
                  />
                  {/* Team Bride */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="#861633"
                    strokeWidth="12"
                    strokeDasharray={`${(bridePercent / 100) * 282.7} 282.7`}
                    strokeDashoffset={`-${(groomPercent / 100) * 282.7}`}
                    transform="rotate(-90 60 60)"
                    strokeLinecap="round"
                  />
                  <text
                    x="60"
                    y="56"
                    textAnchor="middle"
                    fontFamily="var(--font-serif)"
                    fontSize="17"
                    fontWeight="600"
                    fill="#22201d"
                  >
                    {totalCheers}
                  </text>
                  <text
                    x="60"
                    y="70"
                    textAnchor="middle"
                    fontFamily="var(--font-sans)"
                    fontSize="8.5"
                    fontWeight="500"
                    fill="#8e887f"
                    letterSpacing="0.05em"
                  >
                    CHEERS
                  </text>
                </svg>
              </div>

              {/* Donut Legend */}
              <div className="donut-legend">
                <div className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: '#861633' }} />
                  <span className="legend-name">Team Bride ({wedding.couple.brideName})</span>
                  <span className="legend-val">{bridePercent}%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: '#c59b27' }} />
                  <span className="legend-name">Team Groom ({wedding.couple.groomName})</span>
                  <span className="legend-val">{groomPercent}%</span>
                </div>
              </div>
            </div>

            {/* Attendance Progress Bars */}
            <div className="pulse-bars-block">
              <h5 className="bars-title">Expected Attendance by Ceremony</h5>
              <div className="attendance-bars-list">
                {eventAttendance.map((ev) => {
                  const pct = Math.round((ev.attendees / ev.max) * 100);
                  return (
                    <div key={ev.id} className="bar-row">
                      <div className="bar-label-line">
                        <span className="bar-name">{ev.name}</span>
                        <span className="bar-count">{ev.attendees} confirmed</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: ev.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
