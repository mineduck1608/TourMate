"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  LifeBuoy,
  PieChart,
  Send,
  Settings2,
  ContactRound
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Logo from "@/public/Logo.png";


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Người dùng",
      url: "#",
      icon: ContactRound,
      isActive: true,
      items: [
        {
          title: "Khách hàng",
          url: "/admin/customer",
        },
        {
          title: "Hướng dẫn viên",
          url: "/admin/tour-guide",
        }
      ],
    },
    {
      title: "Bài đăng",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Tin tức",
          url: "/admin/news",
        },
        {
          title: "Địa điểm hoạt động",
          url: "/admin/active-area",
        }
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },

    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Hỗ trợ",
      url: "#",
      icon: LifeBuoy,
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: PieChart,
    },
    {
      name: "Liên hệ",
      url: "/admin/contact",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="size-10">
                  <Image
                    src={Logo}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">TourMate</span>
                  <span className="truncate text-xs">Reach the world your way</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
