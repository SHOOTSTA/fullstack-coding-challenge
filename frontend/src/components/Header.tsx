import styled from 'styled-components'
import { PlusIcon } from './icons.tsx'

const Bar = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px clamp(16px, 4vw, 48px);
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Titles = styled.div`
  h1 {
    margin: 0;
    font-size: 22px;
    letter-spacing: -0.02em;
  }
  p {
    margin: 4px 0 0;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
  }
`

const Stats = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

const Stat = styled.div<{ $tone: 'all' | 'ambulance' | 'doctor' }>`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 13px;
  font-weight: 600;
  background: ${({ theme, $tone }) =>
    $tone === 'ambulance' ? theme.colors.ambulanceBg : $tone === 'doctor' ? theme.colors.doctorBg : theme.colors.background};
  color: ${({ theme, $tone }) =>
    $tone === 'ambulance' ? theme.colors.primaryDark : $tone === 'doctor' ? theme.colors.secondary : theme.colors.text};
`

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`

interface HeaderProps {
  totals: { all: number; ambulance: number; doctor: number }
  onAddClick: () => void
}

export function Header({ totals, onAddClick }: HeaderProps) {
  return (
    <Bar>
      <Titles>
        <h1>Nearby Ambulances &amp; Doctors</h1>
        <p>Find emergency services and medical professionals close to you.</p>
      </Titles>
      <Stats>
        <Stat $tone="all">{totals.all} total</Stat>
        <Stat $tone="ambulance">{totals.ambulance} ambulances</Stat>
        <Stat $tone="doctor">{totals.doctor} doctors</Stat>
      </Stats>
      <AddButton type="button" onClick={onAddClick}>
        <PlusIcon size={16} />
        Add record
      </AddButton>
    </Bar>
  )
}
