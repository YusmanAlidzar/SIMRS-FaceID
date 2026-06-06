import React, { useState } from "react";

interface LoginViewProps {
  onLoginSuccess: (user: { username: string; avatarUrl: string }) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredUsername = username.trim();
    const enteredPassword = password.trim();

    if (!enteredUsername) {
      setError("Username tidak boleh kosong");
      return;
    }
    if (!enteredPassword) {
      setError("Password tidak boleh kosong");
      return;
    }
    if (enteredPassword !== "Admin123") {
      setError("Password salah. Silakan coba lagi.");
      return;
    }

    setError("");
    // Login with username and anonymous avatar
    onLoginSuccess({
      username: enteredUsername,
      avatarUrl: "https://www.gravatar.com/avatar/?d=mp",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f8f9ff] to-[#e0fff0]">
      <main className="w-full max-w-[440px]">
        <div className="glass-card rounded-2xl p-8 flex flex-col gap-6 shadow-2xl bg-white/90 backdrop-blur-md">
          {/* Logo and Header */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <span
                className="material-symbols-outlined text-[40px] text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_hospital
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-primary tracking-tight leading-none">
                SIMRSUD
              </h1>
              <p className="text-sm text-outline font-medium mt-1">
                RSUD Management System
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-error-container text-on-error-container text-xs font-semibold animate-shake">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-4">
              {/* Username Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold text-on-surface-variant px-1"
                  htmlFor="username"
                >
                  Username
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">
                    person
                  </span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline/50"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold text-on-surface-variant px-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">
                    lock
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-11 pr-11 py-3 bg-white border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Leftover Options */}
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer text-sm"
            >
              Masuk
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </form>

          {/* Secondary Action / Hospital Branding Logo */}
          <div className="border-t border-outline-variant/60 pt-5 flex flex-col items-center gap-3">
            <p className="text-[11px] text-on-surface-variant text-center leading-relaxed">
              Gunakan kredensial yang diberikan oleh departemen IT RSUD.
            </p>
            <div className="flex items-center gap-2">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHii2hNLuxYqz3Jj0CKBX2ZMl9tLmfIz1TR5iOLnCTkPSh1_eEGmDZR1_yYtMWhEMb5CD_c14NCJg2WrMItL-xZxHLk9OU11uNujU4dW94kIoH79bXCSqcP9VfGlfmfhkseHYLe_Wy45oHGY-V_i-S2xudgqzloKMQaPBDv9GOCOIcIW5fzQ5DFousK_IiM1ckFuLrQXY-1FDhIiDXr4jMNp8LyjkNretYkr6MKD7DnTS8C1H5VhvKbEv6ADl-TJRCnWwuYNXubuY"
                alt="RSUD Logo"
                referrerPolicy="no-referrer"
                className="h-9 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-default"
              />
            </div>
          </div>
        </div>

        {/* System copyright footer */}
        <footer className="mt-6 text-center">
          <p className="text-[10px] text-outline-variant tracking-wider uppercase">
            © 2026 SIMRSUD - RSUD Official System
          </p>
        </footer>
      </main>
    </div>
  );
}
