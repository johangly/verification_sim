import { z } from 'zod';

const phoneRegex = /^\+\d{1,3}\d{2,4}\d{3,4}\d{4}$/;

export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'El número de teléfono es requerido')
    .regex(phoneRegex, 'El número de teléfono no tiene un formato válido'),
  status: z
    .enum(['no verificado', 'verificado', 'por verificar'])
    .optional()
    .default('por verificar'),
});

export const updatePhoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .regex(phoneRegex, 'El número de teléfono no tiene un formato válido')
    .optional(),
  status: z
    .enum(['no verificado', 'verificado', 'por verificar'])
    .optional(),
});

export type PhoneNumberFormData = z.infer<typeof phoneNumberSchema>;
export type UpdatePhoneNumberFormData = z.infer<typeof updatePhoneNumberSchema>;