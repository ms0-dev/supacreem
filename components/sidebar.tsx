"use client";

import {
  CreditCard,
  DollarSign,
  FileLock,
  Github,
  LayoutDashboard,
  Settings,
  UserLock,
  WalletIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";

type NavItem = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  isActive?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

type SidebarData = {
  logo: {
    src: string;
    alt: string;
    title: string;
    description: string;
  };
  navGroups: NavGroup[];
  footerGroup: NavGroup;
};

const sidebarData: SidebarData = {
  logo: {
    src: "/hero-image.svg",
    alt: "supacreem",
    title: "SupaCreem",
    description: "creembase?",
  },
  navGroups: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Plans", icon: DollarSign, href: "/dashboard/plans" },
        { label: "Wallet", icon: WalletIcon, href: "/dashboard/wallet" },
        { label: "Settings", icon: Settings, href: "/dashboard/settings" },
        { label: "Billing", icon: CreditCard, href: "/dashboard/billing" },
        { label: "Protected (Creem)", icon: FileLock, href: "/protected-2" },
        { label: "Protected (Auth)", icon: UserLock, href: "/protected" },
      ],
    },
  ],
  footerGroup: {
    title: "Source Code",
    items: [
      {
        label: "GitHub",
        icon: Github,
        href: "https://github.com/ms0-dev/supacreem",
      },
    ],
  },
};

function SidebarLogo({ logo }: { logo: SidebarData["logo"] }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={40}
            height={40}
            className="size-10"
          />

          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">{logo.title}</span>
            <span className="text-xs text-muted-foreground">
              {logo.description}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarLogo logo={sidebarData.logo} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup className="p-0">
          <SidebarGroupLabel>{sidebarData.footerGroup.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarData.footerGroup.items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="size-4" />
                      {item.label}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
