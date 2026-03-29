import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const menuItems = [
  {
    to: "/dashboard_admin",
    label: "แดชบอร์ด",
    emoji: "📊",
    particles: ["📈", "📉", "💹", "📊", "✨", "⚡", "💡", "🔥"],
    activeFrom: "from-indigo-500",
    activeTo: "to-indigo-400",
    activeShadow: "shadow-indigo-200",
  },
  {
    to: "/products_admin",
    label: "จัดการสินค้า",
    emoji: "📝",
    particles: ["📦", "🏷️", "✏️", "📋", "💫", "⭐", "🌟", "✨"],
    activeFrom: "from-violet-500",
    activeTo: "to-violet-400",
    activeShadow: "shadow-violet-200",
  },
  {
    to: "/withdraw_admin",
    label: "รับสินค้าเข้าคลัง",
    emoji: "📤",
    particles: ["🚚", "📦", "⬆️", "💨", "✨", "🎯", "⚡", "💥"],
    activeFrom: "from-cyan-500",
    activeTo: "to-cyan-400",
    activeShadow: "shadow-cyan-200",
  },
  {
    to: "/receive_admin",
    label: "เบิกสินค้าออกจากคลัง",
    emoji: "📥",
    particles: ["🛒", "📦", "⬇️", "💨", "🌟", "🎁", "✨", "💫"],
    activeFrom: "from-emerald-500",
    activeTo: "to-emerald-400",
    activeShadow: "shadow-emerald-200",
  },

  // ✅ เพิ่มตรงนี้
  {
    to: "/users_admin",
    label: "จัดการผู้ใช้",
    emoji: "👤",
    particles: ["👨‍💻", "👩‍💻", "🧑", "✨", "💫", "⭐"],
    activeFrom: "from-pink-500",
    activeTo: "to-pink-400",
    activeShadow: "shadow-pink-200",
  },
];

const particleStyles = `
  @keyframes navParticleBurst {
    0%   { transform: translate(-50%,-50%) rotate(var(--pa)) translateX(0); opacity:1; font-size:var(--ps); }
    100% { transform: translate(-50%,-50%) rotate(var(--pa)) translateX(var(--pd)); opacity:0; font-size:var(--pe); }
  }
  .particle-burst { animation: navParticleBurst .8s ease-out forwards; }
`;

function NavItem({ item, iconOnly = false, onNavigate }) {
  const { pathname } = useLocation();

  // ✅ แก้ active ให้รองรับ path ย่อย
  const isActive = pathname.startsWith(item.to);

  const [particles, setParticles] = useState([]);

  const handleClick = () => {
    const burst = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      emoji: item.particles[Math.floor(Math.random() * item.particles.length)],
      angle: Math.random() * 360,
      dist: 30 + Math.random() * 40,
    }));
    setParticles(burst);
    setTimeout(() => setParticles([]), 700);
    onNavigate?.();
  };

  return (
    <li className="relative">
      <Link
        to={item.to}
        onClick={handleClick}
        className={[
          "flex items-center gap-2.5 rounded-xl transition-all",
          iconOnly ? "justify-center px-2 py-2.5" : "px-3.5 py-2.5",
          isActive
            ? `bg-gradient-to-r ${item.activeFrom} ${item.activeTo} text-white shadow`
            : "hover:bg-gray-100",
        ].join(" ")}
      >
        <span className={iconOnly ? "text-xl" : "text-lg"}>
          {item.emoji}
        </span>

        {!iconOnly && <span>{item.label}</span>}

        {particles.map((p) => (
          <span
            key={p.id}
            className="particle-burst absolute top-1/2 left-6"
            style={{
              "--pa": `${p.angle}deg`,
              "--pd": `${p.dist}px`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </Link>
    </li>
  );
}

function SidebarContent({ iconOnly = false, onNavigate }) {
  return (
    <div className="flex flex-col h-full px-3 py-5">
      <div className="flex items-center gap-2 pb-4">
        <div className="w-9 h-9 bg-indigo-500 text-white flex items-center justify-center rounded-xl">
          📦
        </div>
        {!iconOnly && <div>Stock Management</div>}
      </div>

      <ul className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            iconOnly={iconOnly}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <>
      <style>{particleStyles}</style>

      {/* Mobile */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button onClick={() => setMobileOpen(true)}>☰</button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {mobileOpen && (
        <aside className="fixed left-0 top-0 w-64 h-full bg-white z-50">
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </aside>
      )}

      {/* Desktop */}
      <aside className="hidden md:flex w-56 bg-white h-screen border-r">
        <SidebarContent />
      </aside>
    </>
  );
}