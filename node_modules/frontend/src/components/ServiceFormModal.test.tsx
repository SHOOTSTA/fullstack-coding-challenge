import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme } from '../test/renderWithTheme.tsx'
import { makeService } from '../test/fixtures.ts'
import { ServiceFormModal } from './ServiceFormModal.tsx'

describe('ServiceFormModal', () => {
  it('shows validation errors and does not submit when required fields are empty', () => {
    const onSubmit = jest.fn()
    renderWithTheme(<ServiceFormModal onClose={jest.fn()} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: /add record/i }))

    expect(screen.getByText('Title is required')).toBeInTheDocument()
    expect(screen.getByText('Description is required')).toBeInTheDocument()
    expect(screen.getByText('Location is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a well-formed payload', () => {
    const onSubmit = jest.fn()
    renderWithTheme(<ServiceFormModal onClose={jest.fn()} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText(/berlin mitte/i), { target: { value: 'Test Ambulance' } })
    fireEvent.change(screen.getByPlaceholderText(/short description/i), { target: { value: 'A description' } })
    fireEvent.change(screen.getByPlaceholderText(/mitte, berlin/i), { target: { value: 'Test City' } })

    fireEvent.click(screen.getByRole('button', { name: /add record/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      type: 'ambulance',
      title: 'Test Ambulance',
      description: 'A description',
      location: 'Test City',
      imageUrl: null,
      lat: null,
      lng: null,
    })
  })

  it('pre-fills fields from an existing record when editing', () => {
    const service = makeService({ title: 'Existing Title' })
    renderWithTheme(<ServiceFormModal initial={service} onClose={jest.fn()} onSubmit={jest.fn()} />)

    expect(screen.getByDisplayValue('Existing Title')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /edit record/i })).toBeInTheDocument()
  })

  it('rejects an out-of-range latitude', () => {
    const onSubmit = jest.fn()
    renderWithTheme(<ServiceFormModal onClose={jest.fn()} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText(/berlin mitte/i), { target: { value: 'Test' } })
    fireEvent.change(screen.getByPlaceholderText(/short description/i), { target: { value: 'Desc' } })
    fireEvent.change(screen.getByPlaceholderText(/mitte, berlin/i), { target: { value: 'Loc' } })
    fireEvent.change(screen.getByPlaceholderText('52.52'), { target: { value: '999' } })

    fireEvent.click(screen.getByRole('button', { name: /add record/i }))

    expect(screen.getByText('Latitude must be between -90 and 90')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onClose when the cancel button is clicked', () => {
    const onClose = jest.fn()
    renderWithTheme(<ServiceFormModal onClose={onClose} onSubmit={jest.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
