import { NavLink } from "react-router-dom";
import { navigation } from "../../utils/navigation";
import Logo from '../../assets/Logo.png';

const Sidebar = () => {
  return (
    <aside
      className="
        hidden
        w-64
        shrink-0
        border-r
        border-[var(--border)]
        bg-[var(--surface)]
        md:flex
        md:min-h-screen
        md:flex-col
      "
    >

      {/* Logo */}
      <div
        className="
          flex
          h-16
          items-center
          border-b
          border-[var(--border)]
          px-6
        "
      >
        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-9
              w-9
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
            <img src={Logo} />
          </div>

          <div>
            <h1 className="text-base font-bold tracking-tight text-[var(--text-primary)]">
              CashVault
            </h1>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Finance
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Overview
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out ${isActive
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:translate-x-0.5 hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`
                      h-5
                      w-5
                      transition-all
                      duration-200
                      ease-out
                      ${isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                      }
                    `}
                  />

                  <span>{item.label}</span>

                  {isActive && (
                    <span
                      className="
                        ml-auto
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-[var(--accent)]
                        shadow-sm
                        shadow-[var(--accent)]/50
                      "
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--border)] p-4">

        <div
          className="
            rounded-xl
            border
            border-[var(--border)]
            bg-[var(--background)]/50
            p-3
            transition-all
            duration-200
            hover:border-[var(--border-hover)]
            hover:bg-[var(--surface-elevated)]
          "
        >

          <p className="text-xs font-medium text-[var(--text-secondary)]">
            CashVault
          </p>

          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Personal finance manager
          </p>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;
