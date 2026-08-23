import {
  Home,
  Wallet,
  ArrowLeftRight,
  ChartColumn,
  FileText,
  Tags,
  Settings,
} from "lucide-react";

import { ROUTES } from "./Routes";

export const navigation = [
  {
    label: "Dashboard",
    path: ROUTES.dashboard,
    icon: Home,
  },
  {
    label: "Wallets",
    path: ROUTES.wallets,
    icon: Wallet,
  },
  {
    label: "Transactions",
    path: ROUTES.transactions,
    icon: ArrowLeftRight,
  },
  {
    label: "Categories",
    path: ROUTES.categories,
    icon: Tags,
  },
  {
    label: "Settings",
    path: ROUTES.settings,
    icon: Settings,
  },
  {
    label: "Reports",
    path: ROUTES.reports,
    icon: ChartColumn,
  },
  {
    label: "Invoices",
    path: ROUTES.invoices,
    icon: FileText,
  },
];