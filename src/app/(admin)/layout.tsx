import type { ReactNode } from "react";
import Link from "next/link";
import { Users, Bell } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { NotificationBadge } from "@/components/notification-badge";
import { AdminLogoutButton } from "@/components/admin-logout-button";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar className="!p-0">
          <SidebarHeader className="!p-0 !m-0 !gap-0 !h-auto">
            <Logo className="!p-0 !m-0 !h-48 !w-48 sm:!h-52 sm:!w-52 md:!h-56 md:!w-56 !block" />
          </SidebarHeader>
          <SidebarContent className="!p-0 !m-0 !gap-0 !-mt-2">
            <SidebarMenu className="!m-0 !p-0 !gap-0">
              <SidebarMenuItem>
                <Link href="/admin">
                  <SidebarMenuButton tooltip="Users">
                    <Users />
                    <span>Users</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/notifications">
                  <SidebarMenuButton tooltip="Notifications" className="relative">
                    <Bell />
                    <span>Notifications</span>
                    <NotificationBadge />
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-lg font-semibold md:text-xl font-headline">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/notifications" className="relative">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                  <NotificationBadge />
                </Button>
              </Link>
              <AdminLogoutButton />
            </div>
          </header>
          <SidebarInset>
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
