import styled from 'styled-components'
import type { ServiceFilter } from '../types.ts'

const List = styled.div`
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.pill};
`

const Tab = styled.button<{ $active: boolean }>`
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 14px;
  font-weight: 600;
  background: ${({ theme, $active }) => ($active ? theme.colors.surface : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.textMuted)};
  box-shadow: ${({ theme, $active }) => ($active ? theme.shadow.card : 'none')};
  transition: color 0.15s ease;
`

interface TabsProps {
  active: ServiceFilter
  onChange: (filter: ServiceFilter) => void
  totals: { all: number; ambulance: number; doctor: number }
}

const OPTIONS: { key: ServiceFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ambulance', label: 'Ambulances' },
  { key: 'doctor', label: 'Doctors' },
]

export function Tabs({ active, onChange, totals }: TabsProps) {
  return (
    <List role="tablist" aria-label="Filter by service type">
      {OPTIONS.map((option) => (
        <Tab
          key={option.key}
          type="button"
          role="tab"
          aria-selected={active === option.key}
          $active={active === option.key}
          onClick={() => onChange(option.key)}
        >
          {option.label} ({totals[option.key]})
        </Tab>
      ))}
    </List>
  )
}
