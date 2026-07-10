import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme } from '../test/renderWithTheme.tsx'
import { Pagination } from './Pagination.tsx'

describe('Pagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = renderWithTheme(<Pagination page={1} totalPages={1} onPageChange={jest.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a button per page when the page count is small', () => {
    renderWithTheme(<Pagination page={1} totalPages={3} onPageChange={jest.fn()} />)

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
  })

  it('disables previous on the first page and next on the last page', () => {
    renderWithTheme(<Pagination page={1} totalPages={3} onPageChange={jest.fn()} />)
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled()
  })

  it('calls onPageChange with the target page', () => {
    const onPageChange = jest.fn()
    renderWithTheme(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />)

    fireEvent.click(screen.getByRole('button', { name: '3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)

    fireEvent.click(screen.getByRole('button', { name: /next page/i }))
    expect(onPageChange).toHaveBeenCalledWith(3)

    fireEvent.click(screen.getByRole('button', { name: /previous page/i }))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('collapses long page ranges with an ellipsis', () => {
    renderWithTheme(<Pagination page={10} totalPages={20} onPageChange={jest.fn()} />)
    expect(screen.getAllByText('…').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument()
  })
})
