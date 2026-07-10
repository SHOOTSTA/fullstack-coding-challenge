import styled from 'styled-components'

const Wrap = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px 0;
`

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.border)};
  background: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.surface)};
  color: ${({ $active }) => ($active ? 'white' : 'inherit')};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const Ellipsis = styled.span`
  padding: 0 4px;
  color: ${({ theme }) => theme.colors.textMuted};
`

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageWindow(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1])
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)

  const result: (number | 'ellipsis')[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('ellipsis')
    result.push(p)
  })
  return result
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <Wrap aria-label="Pagination">
      <PageButton type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
        ‹
      </PageButton>
      {getPageWindow(page, totalPages).map((entry, i) =>
        entry === 'ellipsis' ? (
          <Ellipsis key={`ellipsis-${i}`}>…</Ellipsis>
        ) : (
          <PageButton
            key={entry}
            type="button"
            $active={entry === page}
            aria-current={entry === page ? 'page' : undefined}
            onClick={() => onPageChange(entry)}
          >
            {entry}
          </PageButton>
        ),
      )}
      <PageButton
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        ›
      </PageButton>
    </Wrap>
  )
}
