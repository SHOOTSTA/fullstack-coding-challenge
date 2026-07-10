import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 100;
`

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadow.modal};
  padding: 24px;
  width: 100%;
  max-width: 380px;

  h2 {
    margin: 0 0 8px;
    font-size: 18px;
  }
  p {
    margin: 0 0 20px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

const CancelButton = styled.button`
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-weight: 600;
  cursor: pointer;
`

const ConfirmButton = styled.button`
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  font-weight: 600;
  cursor: pointer;
`

const InlineError = styled.p`
  color: ${({ theme }) => theme.colors.danger} !important;
`

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  busy?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ title, message, confirmLabel = 'Delete', busy, error, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Overlay onClick={onCancel}>
      <Dialog role="alertdialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        {error && <InlineError role="alert">{error}</InlineError>}
        <Actions>
          <CancelButton type="button" onClick={onCancel} disabled={busy}>
            Cancel
          </CancelButton>
          <ConfirmButton type="button" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : confirmLabel}
          </ConfirmButton>
        </Actions>
      </Dialog>
    </Overlay>
  )
}
