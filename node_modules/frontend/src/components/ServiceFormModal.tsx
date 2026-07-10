import { useState, type FormEvent } from 'react'
import styled from 'styled-components'
import type { Service, ServiceInput, ServiceType } from '../types.ts'
import { useGeolocation } from '../hooks/useGeolocation.ts'
import { CloseIcon, CrosshairIcon } from './icons.tsx'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 100;
  overflow-y: auto;
`

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadow.modal};
  padding: 24px;
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
`

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: 18px;
  }
`

const CloseButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

const inputStyles = `
  padding: 9px 12px;
  border-radius: 8px;
  font-weight: 400;
  font-size: 14px;
`

const StyledInput = styled.input`
  ${inputStyles}
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const StyledTextarea = styled.textarea`
  ${inputStyles}
  border: 1px solid ${({ theme }) => theme.colors.border};
  resize: vertical;
  min-height: 72px;
  font-family: inherit;
`

const StyledSelect = styled.select`
  ${inputStyles}
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 400;
  font-size: 12px;
`

const Row = styled.div`
  display: flex;
  gap: 12px;

  ${Field} {
    flex: 1;
  }
`

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const LocateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`

const FormError = styled.div`
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.ambulanceBg};
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 13px;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`

const CancelButton = styled.button`
  padding: 9px 18px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-weight: 600;
  cursor: pointer;
`

const SubmitButton = styled.button`
  padding: 9px 18px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

interface FormValues {
  type: ServiceType
  title: string
  description: string
  location: string
  imageUrl: string
  lat: string
  lng: string
}

type FieldErrors = Partial<Record<keyof FormValues, string>>

function toFormValues(initial: Service | null | undefined): FormValues {
  return {
    type: initial?.type ?? 'ambulance',
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    location: initial?.location ?? '',
    imageUrl: initial?.imageUrl ?? '',
    lat: initial?.lat != null ? String(initial.lat) : '',
    lng: initial?.lng != null ? String(initial.lng) : '',
  }
}

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.title.trim()) errors.title = 'Title is required'
  if (!values.description.trim()) errors.description = 'Description is required'
  if (!values.location.trim()) errors.location = 'Location is required'

  if (values.lat.trim()) {
    const lat = Number(values.lat)
    if (Number.isNaN(lat) || lat < -90 || lat > 90) errors.lat = 'Latitude must be between -90 and 90'
  }
  if (values.lng.trim()) {
    const lng = Number(values.lng)
    if (Number.isNaN(lng) || lng < -180 || lng > 180) errors.lng = 'Longitude must be between -180 and 180'
  }

  return errors
}

interface ServiceFormModalProps {
  initial?: Service | null
  submitting?: boolean
  serverError?: string | null
  onClose: () => void
  onSubmit: (input: ServiceInput) => void
}

export function ServiceFormModal({ initial, submitting, serverError, onClose, onSubmit }: ServiceFormModalProps) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(initial))
  const [errors, setErrors] = useState<FieldErrors>({})
  const { loading: locating, request } = useGeolocation()

  const isEdit = Boolean(initial)

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleUseLocation = () => {
    request((coords) => {
      setValues((prev) => ({ ...prev, lat: String(coords.lat), lng: String(coords.lng) }))
    })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const fieldErrors = validate(values)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return

    onSubmit({
      type: values.type,
      title: values.title.trim(),
      description: values.description.trim(),
      location: values.location.trim(),
      imageUrl: values.imageUrl.trim() || null,
      lat: values.lat.trim() ? Number(values.lat) : null,
      lng: values.lng.trim() ? Number(values.lng) : null,
    })
  }

  return (
    <Overlay onClick={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Edit record' : 'Add record'}
        onClick={(e) => e.stopPropagation()}
      >
        <Head>
          <h2>{isEdit ? 'Edit record' : 'Add record'}</h2>
          <CloseButton type="button" onClick={onClose} aria-label="Close">
            <CloseIcon size={18} />
          </CloseButton>
        </Head>
        <Form onSubmit={handleSubmit} noValidate>
          {serverError && <FormError role="alert">{serverError}</FormError>}

          <Field>
            Type
            <StyledSelect value={values.type} onChange={(e) => setField('type', e.target.value as ServiceType)}>
              <option value="ambulance">Ambulance</option>
              <option value="doctor">Doctor</option>
            </StyledSelect>
          </Field>

          <Field>
            Title
            <StyledInput
              value={values.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="e.g. Berlin Mitte Rapid Response"
            />
            {errors.title && <ErrorText>{errors.title}</ErrorText>}
          </Field>

          <Field>
            Description
            <StyledTextarea
              value={values.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="A short description shown on the card"
            />
            {errors.description && <ErrorText>{errors.description}</ErrorText>}
          </Field>

          <Field>
            Location
            <StyledInput
              value={values.location}
              onChange={(e) => setField('location', e.target.value)}
              placeholder="e.g. Mitte, Berlin, Germany"
            />
            {errors.location && <ErrorText>{errors.location}</ErrorText>}
          </Field>

          <Field>
            Image URL (optional)
            <StyledInput
              value={values.imageUrl}
              onChange={(e) => setField('imageUrl', e.target.value)}
              placeholder="https://…"
            />
          </Field>

          <Row>
            <Field>
              Latitude (optional)
              <StyledInput value={values.lat} onChange={(e) => setField('lat', e.target.value)} placeholder="52.52" />
              {errors.lat && <ErrorText>{errors.lat}</ErrorText>}
            </Field>
            <Field>
              Longitude (optional)
              <StyledInput value={values.lng} onChange={(e) => setField('lng', e.target.value)} placeholder="13.40" />
              {errors.lng && <ErrorText>{errors.lng}</ErrorText>}
            </Field>
          </Row>

          <LocationRow>
            <LocateButton type="button" onClick={handleUseLocation} disabled={locating}>
              <CrosshairIcon size={14} />
              {locating ? 'Locating…' : 'Use my current location'}
            </LocateButton>
          </LocationRow>

          <Actions>
            <CancelButton type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add record'}
            </SubmitButton>
          </Actions>
        </Form>
      </Dialog>
    </Overlay>
  )
}
