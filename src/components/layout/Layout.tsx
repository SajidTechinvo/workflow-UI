import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-background hidden md:block">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border/50 bg-background">
          <Navbar />
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="container max-w-7xl mx-auto p-6 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

