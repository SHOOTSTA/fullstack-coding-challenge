import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme } from '../test/renderWithTheme.tsx'
import { makeService } from '../test/fixtures.ts'
import { ServiceList } from './ServiceList.tsx'

describe('ServiceList', () => {
  it('shows a loading state', () => {
    renderWithTheme(
      <ServiceList items={[]} loading error={null} onRetry={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    )

    expect(screen.getByRole('status', { name: /loading services/i })).toBeInTheDocument()
  })

  it('shows an error state with a retry action', () => {
    const onRetry = jest.fn()
    renderWithTheme(
      <ServiceList
        items={[]}
        loading={false}
        error="Failed to load services."
        onRetry={onRetry}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Failed to load services.')
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('shows an empty state when there are no results', () => {
    renderWithTheme(
      <ServiceList items={[]} loading={false} error={null} onRetry={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    )

    expect(screen.getByText(/no results found/i)).toBeInTheDocument()
  })

  it('renders a card per service when data is available', () => {
    const items = [makeService({ id: '1', title: 'First' }), makeService({ id: '2', title: 'Second' })]
    renderWithTheme(
      <ServiceList items={items} loading={false} error={null} onRetry={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />,
    )

    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })
})
