import styled from 'styled-components'
import { useGeolocation, type Coordinates } from '../hooks/useGeolocation.ts'
import { CloseIcon, CrosshairIcon } from './icons.tsx'

const Button = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.border)};
  background: ${({ theme, $active }) => ($active ? '#EAF3FA' : theme.colors.surface)};
  color: ${({ theme, $active }) => ($active ? theme.colors.secondary : theme.colors.text)};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`

interface NearMeButtonProps {
  active: boolean
  onLocated: (coords: Coordinates) => void
  onClear: () => void
}

export function NearMeButton({ active, onLocated, onClear }: NearMeButtonProps) {
  const { loading, error, request } = useGeolocation()

  const handleClick = () => {
    if (active) {
      onClear()
      return
    }
    request(onLocated)
  }

  return (
    <>
      <Button type="button" $active={active} onClick={handleClick} disabled={loading}>
        {active ? <CloseIcon size={16} /> : <CrosshairIcon size={16} />}
        {loading ? 'Locating…' : active ? 'Clear near me' : 'Near me'}
      </Button>
      {!active && error && <ErrorText role="alert">{error}</ErrorText>}
    </>
  )
}
