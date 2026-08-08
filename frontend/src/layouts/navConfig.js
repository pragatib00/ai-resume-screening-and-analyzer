import {
  LayoutDashboard,
  Search,
  FileStack,
  ScanSearch,
  Briefcase,
  PlusCircle,
  Users,
  ShieldCheck,
  ScrollText,
  Mail,
} from "lucide-react";

export const candidateNav = [
  { to: "/candidate/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/candidate/jobs", label: "Browse Jobs", icon: Search },
  { to: "/candidate/applications", label: "My Applications", icon: FileStack },
  { to: "/candidate/resume-analyzer", label: "Resume Analyzer", icon: ScanSearch },
];

export const recruiterNav = [
  { to: "/recruiter/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/recruiter/jobs", label: "My Jobs", icon: Briefcase },
  { to: "/recruiter/jobs/new", label: "Post a Job", icon: PlusCircle },
];

export const adminNav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/jobs", label: "Jobs", icon: ShieldCheck },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/logs", label: "Logs", icon: ScrollText },
];
