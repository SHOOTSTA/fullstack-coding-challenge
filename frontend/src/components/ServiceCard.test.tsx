import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme } from '../test/renderWithTheme.tsx'
import { makeService } from '../test/fixtures.ts'
import { ServiceCard } from './ServiceCard.tsx'

describe('ServiceCard', () => {
  it('renders title, description, location and image', () => {
    const service = makeService()
    renderWithTheme(<ServiceCard service={service} onEdit={jest.fn()} onDelete={jest.fn()} />)

    expect(screen.getByText(service.title)).toBeInTheDocument()
    expect(screen.getByText(service.description)).toBeInTheDocument()
    expect(screen.getByText(service.location)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: service.title })).toHaveAttribute(
      'src',
      expect.stringContaining('/images/ambulance-1.svg'),
    )
  })

  it('falls back to a placeholder icon when the image fails to load', () => {
    const service = makeService()
    renderWithTheme(<ServiceCard service={service} onEdit={jest.fn()} onDelete={jest.fn()} />)

    const img = screen.getByRole('img', { name: service.title })
    fireEvent.error(img)

    expect(screen.queryByRole('img', { name: service.title })).not.toBeInTheDocument()
    expect(screen.getByText('🚑')).toBeInTheDocument()
  })

  it('falls back to a placeholder icon when there is no image at all', () => {
    const service = makeService({ imageUrl: null, type: 'doctor' })
    renderWithTheme(<ServiceCard service={service} onEdit={jest.fn()} onDelete={jest.fn()} />)

    expect(screen.getByText('🩺')).toBeInTheDocument()
  })

  it('shows a distance badge when distanceKm is provided', () => {
    const service = makeService()
    renderWithTheme(<ServiceCard service={service} distanceKm={2.5} onEdit={jest.fn()} onDelete={jest.fn()} />)

    expect(screen.getByText('2.5 km away')).toBeInTheDocument()
  })

  it('calls onEdit and onDelete with the service', () => {
    const service = makeService()
    const onEdit = jest.fn()
    const onDelete = jest.fn()
    renderWithTheme(<ServiceCard service={service} onEdit={onEdit} onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    expect(onEdit).toHaveBeenCalledWith(service)
    expect(onDelete).toHaveBeenCalledWith(service)
  })
})
