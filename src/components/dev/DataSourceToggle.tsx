import React from 'react'
import { Database, FlaskConical, RotateCcw } from 'lucide-react'
import {
  clearDataSourceOverride,
  dataSource,
  defaultDataSource,
  setDataSource,
} from '@/lib/api/config'

interface DataSourceToggleProps {
  isCollapsed?: boolean
}

/**
 * Dev-only switch between the real Express API and the MSW fixtures.
 * Production builds use VITE_DATA_SOURCE only.
 */
export const DataSourceToggle: React.FC<DataSourceToggleProps> = ({ isCollapsed = false }) => {
  if (!import.meta.env.DEV) return null

  const isMock = dataSource === 'mock'
  const isOverridden = dataSource !== defaultDataSource
  const next = isMock ? 'api' : 'mock'

  return (
    <div className={isCollapsed ? 'px-2 pb-2' : 'px-[var(--sidebar-padding-x)] pb-2'}>
      <div
        className={`flex items-center rounded-[var(--radius-input)] border border-[var(--sidebar-border)] bg-[var(--neutral-subtle)]/40 ${
          isCollapsed ? 'justify-center p-1.5' : 'justify-between gap-2 px-2 py-1.5'
        }`}
      >
        <button
          type="button"
          onClick={() => setDataSource(next)}
          title={`Estás usando ${isMock ? 'datos simulados (MSW)' : 'la API real'}. Click para usar ${
            next === 'mock' ? 'datos simulados' : 'la API real'
          }.`}
          className={`flex min-w-0 items-center gap-1.5 text-[10px] font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] ${
            isCollapsed ? '' : 'flex-1'
          }`}
        >
          {isMock ? (
            <FlaskConical className="h-3.5 w-3.5 shrink-0 stroke-[1.75] text-amber-500" />
          ) : (
            <Database className="h-3.5 w-3.5 shrink-0 stroke-[1.75] text-emerald-500" />
          )}
          {!isCollapsed && (
            <span className="truncate">{isMock ? 'Datos simulados' : 'API real'}</span>
          )}
        </button>

        {!isCollapsed && isOverridden && (
          <button
            type="button"
            onClick={clearDataSourceOverride}
            title={`Volver al valor de .env (${defaultDataSource}).`}
            className="shrink-0 rounded p-0.5 text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]"
          >
            <RotateCcw className="h-3 w-3 stroke-[1.75]" />
          </button>
        )}
      </div>
    </div>
  )
}
