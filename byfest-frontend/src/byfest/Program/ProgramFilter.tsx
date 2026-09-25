'use client';

import React from 'react';
import "./program.css";

interface ProgramFilterProps {
  activeFilter?: string;
  onSelectFilter: (filter: string) => void;
}

const filterOptions = [
  "All Programs",
  "Program 1",
  "Program 2",
  "Program 3",
  "Program 4",
  "Program 5",
  "Program 6",
];

export default function ProgramFilter({ activeFilter, onSelectFilter }: ProgramFilterProps) {
  const currentFilter = typeof activeFilter === 'string' && activeFilter ? activeFilter : "All Programs";

  return (
    <div className="filter-container-main">
      
      {/* Versi Mobile: Dropdown */}
      <div className="mobile-dropdown-wrapper">
        <select
          value={currentFilter}
          onChange={(e) => onSelectFilter(e.target.value)}
          className="mobile-select-box"
        >
          {filterOptions.map((filter) => (
            <option key={filter} value={filter} className="bg-zinc-900 text-white">
              {filter}
            </option>
          ))}
        </select>
      </div>

      {/* Versi Desktop: Single Pill Container */}
      <div className="desktop-filter-pill-container">
        {filterOptions.map((filter) => {
          const isActive = currentFilter.toLowerCase() === filter.toLowerCase();

          return (
            <button
              key={filter}
              type="button"
              onClick={() => onSelectFilter(filter)}
              className={`filter-pill-item ${isActive ? "active" : ""}`}
            >
              {filter}
            </button>
          );
        })}
      </div>

    </div>
  );
}