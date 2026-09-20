import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/storefront')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/storefront"!</div>
}
