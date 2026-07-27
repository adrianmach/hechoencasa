import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'
import { createClient } from '@/lib/supabase/server'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar email={user.email ?? ''} />
      <div className="flex-1 p-6 md:p-10">{children}</div>
    </div>
  )
}
