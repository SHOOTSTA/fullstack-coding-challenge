import { useState } from 'react'
import styled from 'styled-components'
import type { Service } from '../types.ts'
import { resolveImageUrl } from '../api/client.ts'
import { formatDistanceKm } from '../utils/distance.ts'
import { PencilIcon, PinIcon, TrashIcon } from './icons.tsx'

const Card = styled.article`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.card};
`

const ImageWrap = styled.div`
  aspect-ratio: 16 / 10;
  background: ${({ theme }) => theme.colors.background};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  flex: 1;
`

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`

const Badge = styled.span<{ $type: 'ambulance' | 'doctor' }>`
  align-self: flex-start;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme, $type }) => ($type === 'ambulance' ? theme.colors.ambulanceBg : theme.colors.doctorBg)};
  color: ${({ theme, $type }) => ($type === 'ambulance' ? theme.colors.primaryDark : theme.colors.secondary)};
`

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
`

const Description = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Distance = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
`

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

const DeleteButton = styled(ActionButton)`
  color: ${({ theme }) => theme.colors.danger};
  &:hover {
    border-color: ${({ theme }) => theme.colors.danger};
  }
`

function FallbackImage({ type }: { type: 'ambulance' | 'doctor' }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 40,
      }}
      aria-hidden="true"
    >
      {type === 'ambulance' ? '🚑' : '🩺'}
    </div>
  )
}

interface ServiceCardProps {
  service: Service
  distanceKm?: number
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
}

export function ServiceCard({ service, distanceKm, onEdit, onDelete }: ServiceCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = resolveImageUrl(service.imageUrl)

  return (
    <Card>
      <ImageWrap>
        {imageUrl && !imageFailed ? (
          <img src={imageUrl} alt={service.title} onError={() => setImageFailed(true)} />
        ) : (
          <FallbackImage type={service.type} />
        )}
      </ImageWrap>
      <Body>
        <TopRow>
          <Badge $type={service.type}>{service.type}</Badge>
          {typeof distanceKm === 'number' && <Distance>{formatDistanceKm(distanceKm)} away</Distance>}
        </TopRow>
        <Title>{service.title}</Title>
        <Description>{service.description}</Description>
        <Location>
          <PinIcon size={14} />
          {service.location}
        </Location>
        <Actions>
          <ActionButton type="button" onClick={() => onEdit(service)}>
            <PencilIcon size={14} /> Edit
          </ActionButton>
          <DeleteButton type="button" onClick={() => onDelete(service)}>
            <TrashIcon size={14} /> Delete
          </DeleteButton>
        </Actions>
      </Body>
    </Card>
  )
}
