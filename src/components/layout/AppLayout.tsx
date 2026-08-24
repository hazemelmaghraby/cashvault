import { Outlet, NavLink, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { navigation } from "../../utils/navigation";
import { useAuth } from "../../context/AuthContext";
import PleaseSignInPage from "../constants/PleaseSignInPage";

const ROLE_STYLES = {
  user: {
    label: "User",
    avatar:
      "bg-gradient-to-br from-slate-500 to-slate-700",
    avatarShadow:
      "shadow-slate-500/20",
    accent:
      "text-slate-500",
    active:
      "bg-slate-500/10 text-slate-600",
    glow:
      "from-slate-500/5",
  },

  moderator: {
    label: "Moderator",
    avatar:
      "bg-gradient-to-br from-blue-500 to-indigo-600",
    avatarShadow:
      "shadow-blue-500/25",
    accent:
      "text-blue-500",
    active:
      "bg-blue-500/10 text-blue-500",
    glow:
      "from-blue-500/10",
  },

  staff: {
    label: "Staff",
    avatar:
      "bg-gradient-to-br from-emerald-500 to-teal-600",
    avatarShadow:
      "shadow-emerald-500/25",
    accent:
      "text-emerald-500",
    active:
      "bg-emerald-500/10 text-emerald-500",
    glow:
      "from-emerald-500/10",
  },

  admin: {
    label: "Administrator",
    avatar:
      "bg-gradient-to-br from-amber-400 to-orange-600",
    avatarShadow:
      "shadow-amber-500/30",
    accent:
      "text-amber-500",
    active:
      "bg-amber-500/10 text-amber-500",
    glow:
      "from-amber-500/10",
  },

  owner: {
    label: "Owner",
    avatar:
      "bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600",
    avatarShadow:
      "shadow-amber-400/40",
    accent:
      "text-amber-400",
    active:
      "bg-amber-400/10 text-amber-400",
    glow:
      "from-amber-400/15",
  },
} as const;

const AppLayout = () => {
  const location = useLocation();

  const { profile, user } = useAuth();

  const currentPage =
    navigation.find(
      (item) => item.path === location.pathname
    )?.label ?? "Dashboard";

  const role = profile?.role ?? "user";

  const roleStyle =
    ROLE_STYLES[role as keyof typeof ROLE_STYLES] ??
    ROLE_STYLES.user;

  const firstName = profile?.firstName ?? "User";
  const lastName = profile?.lastName ?? "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase();

  if (!user) {
    return <PleaseSignInPage />;
  }

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-[var(--background)]
        text-[var(--text-primary)]
      "
    >

      {/* ========================================================= */}
      {/* ROLE BACKGROUND GLOW */}
      {/* ========================================================= */}

      <div
        className={`
          pointer-events-none
          fixed
          right-0
          top-0
          z-0
          h-96
          w-96
          rounded-full
          bg-gradient-to-bl
          ${roleStyle.glow}
          to-transparent
          blur-3xl
          opacity-70
        `}
      />

      {/* ========================================================= */}
      {/* DESKTOP / TABLET */}
      {/* ========================================================= */}

      <div className="relative z-10 flex min-h-screen">

        {/* Sidebar */}
        <Sidebar />

        {/* Main area */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* ===================================================== */}
          {/* TOPBAR */}
          {/* ===================================================== */}

          <header
            className="
              sticky
              top-0
              z-30
              flex
              h-16
              items-center
              justify-between
              border-b
              border-[var(--border)]
              bg-[var(--background)]/90
              px-4
              backdrop-blur-xl
              sm:px-6
            "
          >

            {/* Left */}
            <div className="min-w-0">

              <p
                className={`
                  hidden
                  text-xs
                  font-medium
                  sm:block
                  ${roleStyle.accent}
                `}
              >
                CashVault
              </p>

              <h2
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-[var(--text-primary)]
                  sm:text-base
                "
              >
                {currentPage}
              </h2>

            </div>

            {/* ================================================= */}
            {/* ACTIONS */}
            {/* ================================================= */}

            <div className="flex items-center gap-3">

              {/* ================================================= */}
              {/* NOTIFICATIONS */}
              {/* ================================================= */}

              <button
                type="button"
                aria-label="Notifications"
                className="
                  relative
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  text-[var(--text-muted)]
                  transition-all
                  duration-200
                  ease-out
                  hover:-translate-y-0.5
                  hover:bg-[var(--surface-elevated)]
                  hover:text-[var(--text-primary)]
                  hover:shadow-md
                  active:translate-y-0
                  active:scale-[0.96]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--accent)]/20
                "
              >

                <span className="text-sm">
                  ●
                </span>

              </button>

              {/* ================================================= */}
              {/* PROFILE */}
              {/* ================================================= */}

              <NavLink
                to="/profile"
                className={`
                  group
                  flex
                  items-center
                  gap-2.5
                  border-l
                  border-[var(--border)]
                  pl-3
                  transition-all
                  duration-200
                  hover:opacity-95
                `}
              >

                {/* Avatar */}

                <div
                  aria-label="Profile"
                  className={`
                    relative
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    text-sm
                    font-bold
                    text-white
                    shadow-md
                    ${roleStyle.avatar}
                    ${roleStyle.avatarShadow}
                    transition-all
                    duration-300
                    ease-out
                    group-hover:-translate-y-0.5
                    group-hover:scale-105
                    group-hover:shadow-lg
                    group-active:translate-y-0
                    group-active:scale-[0.96]
                  `}
                >

                  {/* Avatar shine */}

                  <span
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-br
                      from-white/25
                      via-transparent
                      to-transparent
                    "
                  />

                  <span className="relative">
                    {initials || "U"}
                  </span>

                </div>

                {/* User information */}

                <div className="hidden min-w-0 sm:block">

                  <p
                    className="
                      max-w-40
                      truncate
                      text-sm
                      font-semibold
                      text-[var(--text-primary)]
                    "
                  >
                    {fullName}
                  </p>

                  <div className="mt-0.5 flex items-center gap-1.5">

                    {/* Role indicator */}

                    <span
                      className={`
                        h-1.5
                        w-1.5
                        rounded-full
                        ${roleStyle.avatar}
                      `}
                    />

                    <p
                      className={`
                        text-[10px]
                        font-medium
                        ${roleStyle.accent}
                      `}
                    >
                      {roleStyle.label}
                    </p>

                  </div>

                </div>

              </NavLink>

            </div>

          </header>

          {/* ===================================================== */}
          {/* PAGE */}
          {/* ===================================================== */}

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">

            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>

          </main>

        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM NAVIGATION */}
      {/* ========================================================= */}

      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-40
          border-t
          border-[var(--border)]
          bg-[var(--background)]/95
          px-2
          py-2
          backdrop-blur-xl
          md:hidden
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-md
            items-center
            justify-around
          "
        >

          {navigation
            .slice(0, 6)
            .map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                      flex
                      min-w-16
                      flex-col
                      items-center
                      gap-1
                      rounded-xl
                      px-3
                      py-2
                      text-xs
                      transition-all
                      duration-300
                      ease-out

                      ${isActive
                      ? `${roleStyle.active} -translate-y-0.5`
                      : `
                            text-[var(--text-muted)]
                            hover:bg-[var(--surface)]
                            hover:text-[var(--text-secondary)]
                          `
                    }
                    `
                  }
                >

                  <Icon
                    className="
                      h-5
                      w-5
                      transition-transform
                      duration-300
                    "
                  />

                  <span>
                    {item.label}
                  </span>

                </NavLink>
              );
            })}

        </div>

      </nav>

    </div>
  );
};

export default AppLayout;