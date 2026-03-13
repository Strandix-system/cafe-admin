import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sideBarItems } from "../../configs/sideBarItems";

// Inject keyframes + Google Font once
const styleTag = document.createElement("style");
styleTag.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15); }
    50%       { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
  }
  .sidebar-item-enter {
    animation: fadeUp 0.25s ease both;
  }
  .active-pill {
    animation: pulseGlow 2.4s ease infinite;
  }
  .logo-ring {
    background: conic-gradient(
      from 0deg,
      rgba(255,213,150,0.9),
      rgba(255,255,255,0.4),
      rgba(255,213,150,0.9)
    );
    animation: spin 6s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector("[data-sidebar-styles]")) {
  styleTag.setAttribute("data-sidebar-styles", "true");
  document.head.appendChild(styleTag);
}

export function Sidebar() {
  const { isSuperAdmin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLarge, setIsLarge] = useState(window.innerWidth >= 1200);
  const [isMedium, setIsMedium] = useState(window.innerWidth >= 900);
  const [open, setOpen] = useState(window.innerWidth >= 1200);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, label: "", y: 0 });

  useEffect(() => {
    const handleResize = () => {
      const lg = window.innerWidth >= 1200;
      const md = window.innerWidth >= 900;
      setIsLarge(lg);
      setIsMedium(md);
      setOpen(lg);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarMenu = isSuperAdmin
    ? sideBarItems.superAdmin
    : sideBarItems.admin;

  const handleMenuClick = (path) => {
    navigate(path);
    if (!isMedium) setOpen(false);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const handleMouseEnter = (key, label, e) => {
    setHoveredKey(key);
    if (!open) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({ visible: true, label, y: rect.top + rect.height / 2 });
    }
  };

  const handleMouseLeave = () => {
    setHoveredKey(null);
    setTooltip({ visible: false, label: "", y: 0 });
  };

  return (
    <>
      {/* Sidebar */}
      <div
        style={{
          width: open ? 264 : 72,
          transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          fontFamily: "'DM Sans', sans-serif",
          position: !isMedium && open ? "fixed" : "relative",
          zIndex: !isMedium && open ? 1200 : "auto",
          flexShrink: 0,
        }}
        className="h-screen flex flex-col justify-between overflow-hidden select-none"
        // Warm coffee gradient background
        style2={{}} // merged below via inline
      >
        {/* Background layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(160deg, #5C3D1E 0%, #7B4F2E 45%, #6B3F22 100%)",
          }}
        />
        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "150px",
          }}
        />
        {/* Top edge accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,213,150,0.6), transparent)",
          }}
        />

        {/* Content wrapper (above background) */}
        <div className="relative flex flex-col h-full">
          {/* ── Header ── */}
          <div className="px-3 pt-4 pb-3">
            <div className="flex items-center gap-3">
              {/* Logo / Avatar */}
              <div
                className="relative flex-shrink-0 cursor-pointer"
                onClick={() => setOpen((p) => !p)}
                title={open ? "Collapse sidebar" : "Expand sidebar"}
              >
                {/* Spinning ring */}
                <div
                  className="logo-ring absolute inset-0 rounded-full"
                  style={{ padding: 2, borderRadius: "50%" }}
                />
                <div
                  className="relative flex items-center justify-center rounded-full overflow-hidden"
                  style={{
                    width: 44,
                    height: 44,
                    background: "rgba(0,0,0,0.25)",
                    border: "2px solid rgba(255,213,150,0.4)",
                  }}
                >
                  {!isSuperAdmin && user?.logo ? (
                    <img
                      src={user.logo}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span style={{ fontSize: 20 }}>☕</span>
                  )}
                </div>
              </div>

              {/* Name + role */}
              {open && (
                <div
                  className="min-w-0 overflow-hidden"
                  style={{ animation: "slideIn 0.3s ease both" }}
                >
                  <p
                    className="text-white font-semibold truncate leading-tight"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 15,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {isSuperAdmin ? "Super Admin" : user?.cafeName || "Admin"}
                  </p>
                  <p
                    className="truncate"
                    style={{
                      fontSize: 11,
                      color: "rgba(255,213,150,0.75)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    {isSuperAdmin ? "Root Access" : "Dashboard"}
                  </p>
                </div>
              )}

              {/* Collapse toggle (only when open) */}
              {open && (
                <button
                  onClick={() => setOpen(false)}
                  className="ml-auto flex-shrink-0 rounded-lg p-1.5 transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.08)")
                  }
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                marginBottom: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,213,150,0.3), transparent)",
              }}
            />
          </div>

          {/* ── Nav Items ── */}
          <nav
            className="flex-1 px-2 pb-2 overflow-y-auto overflow-x-hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {sidebarMenu.map((item, idx) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const hovered = hoveredKey === item.key;

              return (
                <div
                  key={item.key}
                  className="sidebar-item-enter"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <button
                    onClick={() => handleMenuClick(item.path)}
                    onMouseEnter={(e) =>
                      handleMouseEnter(item.key, item.label, e)
                    }
                    onMouseLeave={handleMouseLeave}
                    className={`w-full flex items-center gap-3 rounded-xl text-left transition-all duration-200 relative overflow-hidden
                      ${active ? "active-pill" : ""}`}
                    style={{
                      marginBottom: 1,
                      padding: open ? "6px 12px" : "6px",
                      justifyContent: open ? "flex-start" : "center",
                      background: active
                        ? "rgba(255,213,150,0.18)"
                        : hovered
                          ? "rgba(255,255,255,0.09)"
                          : "transparent",
                      border: active
                        ? "1px solid rgba(255,213,150,0.35)"
                        : "1px solid transparent",
                      color: active ? "#FFD596" : "rgba(255,255,255,0.82)",
                    }}
                  >
                    {/* Active left accent */}
                    {active && (
                      <div
                        className="absolute left-0 top-2 bottom-2 rounded-full"
                        style={{
                          width: 3,
                          background:
                            "linear-gradient(180deg, #FFD596, #FFA552)",
                        }}
                      />
                    )}

                    {/* Icon wrapper */}
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded-lg transition-all duration-200"
                      style={{
                        width: 34,
                        height: 34,
                        background: active
                          ? "rgba(255,213,150,0.2)"
                          : hovered
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(255,255,255,0.06)",
                        color: active ? "#FFD596" : "rgba(255,255,255,0.75)",
                      }}
                    >
                      <Icon style={{ fontSize: 18 }} />
                    </div>

                    {/* Label */}
                    {open && (
                      <span
                        className="truncate"
                        style={{
                          fontSize: 13.5,
                          fontWeight: active ? 600 : 400,
                          letterSpacing: "0.01em",
                          animation: "slideIn 0.25s ease both",
                        }}
                      >
                        {item.label}
                      </span>
                    )}

                    {/* Active dot (collapsed) */}
                    {!open && active && (
                      <div
                        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full"
                        style={{ width: 4, height: 4, background: "#FFD596" }}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* ── Footer ── */}
          <div className="px-3 pb-4">
            <div
              style={{
                height: 1,
                marginBottom: 12,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,213,150,0.2), transparent)",
              }}
            />
            <div
              className="flex items-center gap-3 rounded-xl px-2 py-2"
              style={{
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-lg"
                style={{
                  width: 34,
                  height: 34,
                  background: "rgba(255,255,255,0.08)",
                  fontSize: 16,
                }}
              >
                {isSuperAdmin ? "🔑" : "👤"}
              </div>
              {open && (
                <div
                  className="min-w-0"
                  style={{ animation: "slideIn 0.3s ease both" }}
                >
                  <p
                    className="text-white truncate"
                    style={{ fontSize: 12, fontWeight: 500 }}
                  >
                    {user?.name || (isSuperAdmin ? "Super Admin" : "Admin")}
                  </p>
                  <p
                    style={{ fontSize: 10.5, color: "rgba(255,255,255,0.45)" }}
                  >
                    {isSuperAdmin
                      ? "superadmin@app.com"
                      : user?.email || "admin@cafe.com"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating tooltip for collapsed mode */}
      {tooltip.visible && !open && (
        <div
          className="fixed pointer-events-none z-50 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap"
          style={{
            left: 82,
            top: tooltip.y,
            transform: "translateY(-50%)",
            background: "#3B1F0A",
            color: "#FFD596",
            border: "1px solid rgba(255,213,150,0.3)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            animation: "slideIn 0.15s ease both",
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {tooltip.label}
          {/* Arrow */}
          <div
            className="absolute"
            style={{
              left: -5,
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderRight: "5px solid #3B1F0A",
            }}
          />
        </div>
      )}

      {/* Mobile overlay backdrop */}
      {!isMedium && open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
