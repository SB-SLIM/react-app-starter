import { createFileRoute } from '@tanstack/react-router'
import { ShowcasePage } from '@/features/showcase/ShowcasePage'

export const Route = createFileRoute('/showcase')({
  component: ShowcasePage,
})
