
import {
  LayoutDashboard,
  Map,
  Smartphone,
  History,
  Bell,
  User,
  type LucideIcon,
} from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_LINKS: NavLink[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/map",
    label: "Live Map",
    icon: Map,
  },
  {
    href: "/devices",
    label: "Devices",
    icon: Smartphone,
  },
  {
    href: "/history",
    label: "History",
    icon: History,
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];
