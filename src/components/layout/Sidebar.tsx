import { NavLink } from "react-router-dom";
import { navigation } from "../../utils/navigation";
import Logo from "../../assets/Logo.png";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const Sidebar = ({
  collapsed,
  onToggle,
}: SidebarProps) => {
  return (
    <aside
      className={`
        hidden
        shrink-0
        border-r
        border-[var(--border)]
        bg-[var(--surface)]
        md:flex
        md:min-h-screen
        md:flex-col
        transition-[width]
        duration-300
        ease-out
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Logo */}
      <div
        className={`
          relative
          flex
          h-16
          items-center
          border-b
          border-[var(--border)]
          transition-all
          duration-300
          ${collapsed ? "justify-center px-3" : "px-6"}
        `}
      >
        <NavLink
          to="/"
          aria-label="Go to CashVault home"
          className="
            flex
            items-center
            gap-3
            min-w-0
            rounded-xl
            transition-all
            duration-200
            hover:opacity-90
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--accent)]/20
          "
        >
          {/* Logo */}
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              shadow-lg
              shadow-[var(--accent)]/20
              transition-all
              duration-200
              ease-out
              hover:-translate-y-0.5
              hover:shadow-[var(--accent)]/30
            "
          >
            <img
              src={Logo}
              alt="CashVault"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Brand */}
          <div
            className={`
              min-w-0
              overflow-hidden
              whitespace-nowrap
              transition-all
              duration-300
              ease-out
              ${collapsed
                ? "w-0 opacity-0"
                : "w-auto opacity-100"
              }
            `}
          >
            <h1 className="text-base font-bold tracking-tight text-[var(--text-primary)]">
              CashVault
            </h1>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Finance
            </p>
          </div>
        </NavLink>

        {/* Collapse button */}
        <button
          type="button"
          onClick={onToggle}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className={`
            absolute
            top-1/2
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-lg
            border
            border-[var(--border)]
            bg-[var(--surface)]
            text-[var(--text-muted)]
            shadow-sm
            transition-all
            duration-200
            hover:bg-[var(--surface-elevated)]
            hover:text-[var(--text-primary)]
            hover:shadow-md
            active:scale-95
            ${collapsed
              ? "right-[-14px]"
              : "right-[-14px]"
            }
          `}
        >
          <span
            className={`
              text-lg
              text-white
              transition-transform
              duration-300
              ${collapsed ? "rotate-180" : ""}
            `}
          >
            ‹
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`
          flex-1
          space-y-1
          py-6
          transition-all
          duration-300
          ${collapsed ? "px-2" : "px-3"}
        `}
      >
        {/* Section title */}
        <div
          className={`
            mb-3
            overflow-hidden
            transition-all
            duration-300
            ${collapsed
              ? "h-0 opacity-0"
              : "h-4 opacity-100"
            }
          `}
        >
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Overview
          </p>
        </div>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `
                  group
                  relative
                  flex
                  items-center
                  rounded-xl
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  ease-out
                  ${collapsed
                  ? "justify-center px-3"
                  : "gap-3 px-3"
                }

                  ${isActive
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:translate-x-0.5 hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`
                      h-5
                      w-5
                      shrink-0
                      transition-all
                      duration-200
                      ease-out
                      ${isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                      }
                    `}
                  />

                  {/* Label */}
                  <span
                    className={`
                      overflow-hidden
                      whitespace-nowrap
                      transition-all
                      duration-300
                      ${collapsed
                        ? "w-0 opacity-0"
                        : "w-auto opacity-100"
                      }
                    `}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <span
                      className={`
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-[var(--accent)]
                        shadow-sm
                        shadow-[var(--accent)]/50
                        ${collapsed
                          ? "absolute right-1.5 top-1.5"
                          : "ml-auto"
                        }
                      `}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        className={`
          border-t
          border-[var(--border)]
          transition-all
          duration-300
          ${collapsed ? "p-2" : "p-4"}
        `}
      >
        <NavLink
          to="/"
          title={collapsed ? "CashVault" : undefined}
          className={`
            block
            rounded-xl
            border
            border-[var(--border)]
            bg-[var(--background)]/50
            transition-all
            duration-200
            hover:border-[var(--border-hover)]
            hover:bg-[var(--surface-elevated)]
            ${collapsed ? "p-2" : "p-3"}
          `}
        >
          {collapsed ? (
            <div className="flex justify-center">
              <img
                src={Logo}
                alt="CashVault"
                className="h-7 w-7 object-contain"
              />
            </div>
          ) : (
            <>
              <p className="text-xs font-medium text-[var(--text-secondary)]">
                CashVault
              </p>

              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                Personal finance manager
              </p>
            </>
          )}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;