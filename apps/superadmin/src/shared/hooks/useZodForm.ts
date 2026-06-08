import {
  useForm,
  type FieldValues,
  type Resolver,
  type UseFormProps,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'

export function useZodForm<TSchema extends z.ZodObject<z.ZodRawShape>>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.input<TSchema> & FieldValues>, 'resolver'>,
) {
  return useForm<z.input<TSchema> & FieldValues>({
    ...options,
    resolver: zodResolver(schema) as Resolver<z.input<TSchema> & FieldValues>,
  })
}
