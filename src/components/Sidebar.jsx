import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const menuItems = [
  {
    to: "/Receive",
    label: "รับสินค้าเข้าคลัง",
    emoji: "📤",
    particles: ["🚚", "📦", "⬆️", "💨", "✨", "🎯", "⚡", "💥"],
    activeFrom: "from-cyan-500",
    activeTo: "to-cyan-400",
    activeShadow: "shadow-cyan-200",
  },
  {
    to: "/withdraw",
    label: "เบิกสินค้าออกจากคลัง",
    emoji: "📥",
    particles: ["🛒", "📦", "⬇️", "💨", "🌟", "🎁", "✨", "💫"],
    activeFrom: "from-emerald-500",
    activeTo: "to-emerald-400",
    activeShadow: "shadow-emerald-200",
  },
];

const particleStyles = `
  @keyframes navParticleBurst {
    0%   { transform: translate(-50%,-50%) rotate(var(--pa)) translateX(0); opacity:1; font-size:var(--ps); }
    60%  { opacity:.8; }
    100% { transform: translate(-50%,-50%) rotate(var(--pa)) translateX(var(--pd)); opacity:0; font-size:var(--pe); }
  }
  @keyframes navItemPop {
    0%,100% { transform: scale(1); }
    30%     { transform: scale(.93); }
    70%     { transform: scale(1.04); }
  }
  @keyframes emojiWiggle {
    0%,100% { transform: rotate(0deg); }
    25%     { transform: rotate(-15deg); }
    75%     { transform: rotate(15deg); }
  }
  @keyframes titleShimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes drawerSlideIn {
    from { transform: translateX(-100%); }
    to   { transform: translateX(0); }
  }
  @keyframes overlayFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes activeGlow { 0%,100%{opacity:.6} 50%{opacity:1} }

  .particle-burst   { animation: navParticleBurst var(--pd-dur,.8s) ease-out forwards; }
  .item-pop         { animation: navItemPop .35s ease; }
  .emoji-wiggle     { animation: emojiWiggle .4s ease; }
  .title-shimmer    {
    background: linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#6366f1);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: titleShimmer 3s linear infinite;
  }
  .active-dot-pulse { animation: activeGlow 1.5s ease-in-out infinite; }
  .drawer-slide     { animation: drawerSlideIn .28s cubic-bezier(.34,1.2,.64,1); }
  .overlay-fade     { animation: overlayFadeIn .2s ease; }
`;

// ─── NavItem ────────────────────────────────────────────────────────────────
function NavItem({ item, iconOnly = false, onNavigate }) {
  const { pathname } = useLocation();
  const isActive = pathname === item.to;
  const [particles, setParticles] = useState([]);
  const [clicking, setClicking] = useState(false);

  const handleClick = () => {
    const burst = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      emoji: item.particles[Math.floor(Math.random() * item.particles.length)],
      angle: Math.random() * 360,
      dist: 40 + Math.random() * 50,
      dur: 0.6 + Math.random() * 0.4,
      size: 14 + Math.random() * 8,
    }));
    setParticles(burst);
    setClicking(true);
    setTimeout(() => { setParticles([]); setClicking(false); }, 1000);
    onNavigate?.();
  };

  return (
    <li className="relative">
      <Link
        to={item.to}
        onClick={handleClick}
        title={iconOnly ? item.label : undefined}
        className={[
          "relative flex items-center gap-2.5 rounded-xl no-underline",
          "transition-all duration-200 overflow-visible",
          iconOnly ? "justify-center px-2 py-2.5" : "px-3.5 py-2.5",
          clicking ? "item-pop" : "",
          isActive
            ? `bg-gradient-to-r ${item.activeFrom} ${item.activeTo} shadow-lg ${item.activeShadow} ${!iconOnly ? "translate-x-1" : ""}`
            : "hover:bg-indigo-50 hover:translate-x-0.5",
        ].join(" ")}
      >
        <span className={`flex-shrink-0 ${iconOnly ? "text-2xl" : "text-lg"} ${isActive || clicking ? "emoji-wiggle" : ""}`}>
          {item.emoji}
        </span>

        {!iconOnly && (
          <span className={[
            "text-[13px] leading-snug transition-colors duration-200 whitespace-nowrap",
            isActive ? "text-white font-semibold" : "text-gray-600 font-medium",
          ].join(" ")}>
            {item.label}
          </span>
        )}

        {isActive && !iconOnly && (
          <span className="active-dot-pulse ml-auto w-1.5 h-1.5 rounded-full bg-white/80 flex-shrink-0" />
        )}

        {particles.map((p) => (
          <span
            key={p.id}
            className="particle-burst absolute top-1/2 left-7 pointer-events-none z-50 leading-none select-none"
            style={{
              "--pa": `${p.angle}deg`,
              "--pd": `${p.dist}px`,
              "--pd-dur": `${p.dur}s`,
              "--ps": `${p.size}px`,
              "--pe": `${p.size * 0.5}px`,
              fontSize: `${p.size}px`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </Link>
    </li>
  );
}

// ─── Sidebar inner content ───────────────────────────────────────────────────
function SidebarContent({ iconOnly = false, onNavigate }) {
  return (
    <div className="flex flex-col h-full px-3 py-5 gap-1.5 relative">
      {/* Decorative blobs */}
     <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-emerald-50/50 pointer-events-none" />

      {/* Logo */}
      <div className={`flex items-center gap-2.5 pb-4 ${iconOnly ? "justify-center px-0" : "px-3.5"}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shadow-md shadow-indigo-200 flex-shrink-0 select-none">
          📦
        </div>
        {!iconOnly && (
          <div className="min-w-0">
            <div className="title-shimmer text-[15px] font-bold tracking-tight leading-tight truncate">
              Stock management
            </div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-normal">
              ระบบคลังสินค้า
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px mx-2 mb-2 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Section label */}
      {!iconOnly && (
        <p className="px-3.5 mb-1 text-[10px] font-semibold text-gray-300 uppercase tracking-widest">
          เมนูหลัก
        </p>
      )}

      {/* Nav */}
      <nav className="flex-1">
        <ul className="flex flex-col gap-0.5 list-none m-0 p-0">
          {menuItems.map((item) => (
            <NavItem
              key={item.to}
              item={item}
              iconOnly={iconOnly}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!iconOnly && (
        <div className="mt-auto pt-3 border-t border-gray-100 px-3.5">
          <p className="text-[10px] text-gray-300 text-center tracking-wide">
            StoreMS v1.0 • ระบบคลังสินค้า
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Hamburger Button (exported so Navbar can use it) ───────────────────────
export function HamburgerButton({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center gap-1.5 bg-white border border-gray-100 shadow-sm hover:bg-indigo-50 transition-all duration-200 active:scale-95 ${className}`}
      aria-label="Toggle menu"
    >
      <span className="w-4 h-0.5 bg-gray-600 rounded-full transition-all" />
      <span className="w-4 h-0.5 bg-gray-600 rounded-full transition-all" />
      <span className="w-3 h-0.5 bg-gray-600 rounded-full transition-all" />
    </button>
  );
}

// ─── Main Sidebar export ─────────────────────────────────────────────────────
export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close on resize to md+
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <style>{particleStyles}</style>

      {/* ── Mobile: Hamburger button (fixed top-left) ── */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <HamburgerButton onClick={() => setMobileOpen(true)} />
      </div>

      {/* ── Mobile: Overlay ── */}
      {mobileOpen && (
        <div
          className="overlay-fade md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile: Drawer ── */}
      {mobileOpen && (
        <aside className="drawer-slide md:hidden fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-2xl overflow-y-auto">
          {/* Close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition-all active:scale-95"
          >
            ✕
          </button>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </aside>
      )}

      {/* ── Tablet (md): Icon-only sidebar ── */}
      <aside className="hidden md:flex lg:hidden w-16 bg-white h-screen border-r border-gray-100 shadow-[3px_0_25px_rgba(99,102,241,0.07)] flex-col overflow-hidden relative flex-shrink-0">
        <SidebarContent iconOnly />
      </aside>

      {/* ── Desktop (lg+): Full sidebar ── */}
      <aside className="hidden lg:flex w-56 bg-white h-screen border-r border-gray-100 shadow-[3px_0_25px_rgba(99,102,241,0.07)] flex-col overflow-hidden relative flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
