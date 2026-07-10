import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { SearchIcon } from './icons.tsx'

const Wrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 360px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const Input = styled.input`
  width: 100%;
  padding: 10px 12px 10px 36px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  background: ${({ theme }) => theme.colors.surface};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 1px;
  }
`

interface SearchBarProps {
  onSearch: (value: string) => void
  placeholder?: string
  debounceMs?: number
}

export function SearchBar({ onSearch, placeholder = 'Search by name or location…', debounceMs = 300 }: SearchBarProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), debounceMs)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, debounceMs])

  return (
    <Wrapper>
      <SearchIcon size={16} />
      <Input
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label="Search services"
        onChange={(e) => setValue(e.target.value)}
      />
    </Wrapper>
  )
}
