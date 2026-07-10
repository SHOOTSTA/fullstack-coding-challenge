import { z } from 'zod'

export const serviceInputSchema = z.object({
  type: z.enum(['ambulance', 'doctor']),
  title: z.string().trim().min(1, 'Title is required').max(120),
  description: z.string().trim().min(1, 'Description is required').max(1000),
  location: z.string().trim().min(1, 'Location is required').max(200),
  imageUrl: z.string().trim().min(1).max(500).nullable().optional().or(z.literal('')),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
})

export type ServiceInputPayload = z.infer<typeof serviceInputSchema>
