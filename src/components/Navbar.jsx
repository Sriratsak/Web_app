import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/Web_app/backend/api",
  withCredentials: true,
});

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bursting, setBursting] = useState(false);
  const [particles, setParticles] = useState([]);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/current_user.php");
      if (res.data.loggedIn) setUser(res.data.user);
      else setUser(null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCurrentUser(); }, []);

  const emojis = ["💥", "✨", "🌟", "🚀", "⚡", "🎇", "🔥", "💫", "🎉", "👋"];

  const handleLogout = async () => {
    // 🎆 Trigger particle burst
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      angle: (360 / 12) * i,
      distance: 60 + Math.random() * 40,
    }));
    setParticles(newParticles);
    setBursting(true);

    setTimeout(async () => {
      setBursting(false);
      setParticles([]);
      try {
        const res = await api.post("/logout.php");
        if (res.data.success) {
          setUser(null);
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("logout error:", err);
      }
    }, 900);
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(99,102,241,0.4); }
          50%       { box-shadow: 0 0 20px rgba(99,102,241,0.8); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes burst {
          0%   { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0px);    opacity: 1; font-size: 18px; }
          100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--dist)); opacity: 0; font-size: 10px; }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-4px) rotate(-3deg); }
          40%     { transform: translateX(4px)  rotate(3deg);  }
          60%     { transform: translateX(-4px) rotate(-2deg); }
          80%     { transform: translateX(4px)  rotate(2deg);  }
        }
        @keyframes avatarPop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .navbar-bar {
          animation: slideDown 0.4s ease;
        }
        .logout-btn {
          position: relative;
          background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c);
          background-size: 200% auto;
          transition: all 0.3s ease;
          overflow: visible;
        }
        .logout-btn:hover {
          background-position: right center;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239,68,68,0.5);
        }
        .logout-btn:active {
          transform: translateY(0) scale(0.95);
        }
        .logout-btn.bursting {
          animation: shake 0.4s ease;
        }
        .particle {
          position: absolute;
          top: 50%; left: 50%;
          pointer-events: none;
          animation: burst 0.9s ease-out forwards;
        }
        .user-badge {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }
        .username-text {
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s linear infinite;
        }
        .avatar {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          animation: pulse-glow 2.5s ease-in-out infinite;
        }
        .avatar:hover {
          animation: avatarPop 0.3s ease;
        }
      `}</style>

      <header className="navbar-bar h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between w-full"
        style={{ boxShadow: "0 2px 20px rgba(99,102,241,0.08)" }}>

        {/* Logo zone */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
            S
          </div>
          <span className="text-sm font-semibold text-gray-700 tracking-wide">StoreMS</span>
        </div>

        {/* Right zone */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0.15s" }} />
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
            </div>
          ) : user ? (
            <>
              {/* User badge */}
              <div className="user-badge flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-100 bg-white">
                {/* Avatar */}
                <div className="avatar w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm cursor-default">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] text-gray-400">ผู้ใช้งาน</span>
                  <span className="username-text text-sm font-bold">{user.name}</span>
                </div>
              </div>

              {/* Logout button */}
              <div className="relative">
                <button
                  onClick={handleLogout}
                  className={`logout-btn text-sm px-4 py-1.5 rounded-full text-white font-medium flex items-center gap-1.5 ${bursting ? "bursting" : ""}`}
                >
                  <span>ออกจากระบบ</span>
                  <span className="text-base">👋</span>
                </button>

                {/* Particles */}
                {particles.map((p) => (
                  <span
                    key={p.id}
                    className="particle text-base select-none"
                    style={{
                      "--angle": `${p.angle}deg`,
                      "--dist": `${p.distance}px`,
                      animationDuration: `${0.7 + Math.random() * 0.4}s`,
                    }}
                  >
                    {p.emoji}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-400 italic">ไม่ได้เข้าสู่ระบบ</span>
          )}
        </div>
      </header>
    </>
  );
}