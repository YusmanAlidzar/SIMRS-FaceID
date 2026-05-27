import React, { useState } from 'react';

interface LoginViewProps {
  onLoginSuccess: (user: { name: string; title: string; avatarUrl: string }) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<'sarah' | 'hermawan'>('sarah');
  const [error, setError] = useState('');

  const docProfiles = {
    sarah: {
      name: "Dr. Sarah Wijaya",
      title: "Admin Medis",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdM452Mkm-aPuEtHpoPbiaPW4780X3HBLS7nM-uGzvzz3-EHml7ria69GbUUK1KVfqTsj0nWI64a_it8iGC84hbp-L5Aj8o1NKgFPfxKPnDPcp6tK6KzzuAOQ5WU2lDof6W-bp-ArDC8kRIgL9JIlJeR22_G8S8bO-RPR-sJlizZlCLnSvTZz-xl2yaw6neiOeVxPUFqrH0n-8XeIfbu44tfxf7i173eFAPA3gqefIRiZm8KfSBtM7AYoO83i_tO8CdcPqBIBtvjY"
    },
    hermawan: {
      name: "dr. Hermawan",
      title: "Kepala Pelayanan Medis",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqiOgfLKgCAu9pi4P7bB_tbcHAC95EYdZmvnemtiGXgox5dXP-jqMr35h1b6YavExQo1TonKqosdtMg-K4TwwNSUy6JQI4ySQReSwPCh49_QDyYFsu5wJDRroT-Bolb3ItrBxQIFHYLkzASwykfpF8II58sMO1haBjKqXzrmdJjPUEWJViQbo5q-uBFCrwCJfoNPvH2isnBT6rfofAFdKeFEL4teC6IOmoDtx7eqw-FL9EWDosOHV_gt339qmSmtb-uHcxwfv4tQ0"
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username tidak boleh kosong');
      return;
    }
    if (!password.trim()) {
      setError('Password tidak boleh kosong');
      return;
    }
    setError('');
    // Any username is accepted for easy testing! Just select profile based on switch
    const selectedProfile = docProfiles[selectedDoctor];
    onLoginSuccess(selectedProfile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f8f9ff] to-[#e0fff0]">
      <main className="w-full max-w-[440px]">
        <div className="glass-card rounded-2xl p-8 flex flex-col gap-6 shadow-2xl bg-white/90 backdrop-blur-md">
          
          {/* Logo and Header */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <span className="material-symbols-outlined text-[40px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_hospital
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-primary tracking-tight leading-none">SIMRSUD</h1>
              <p className="text-sm text-outline font-medium mt-1">RSUD Management System</p>
            </div>
          </div>

          {/* Quick Doctor Profile Switcher to experience both medical viewpoints */}
          <div className="bg-surface-container/60 p-1.5 rounded-xl border border-outline-variant flex gap-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedDoctor('sarah')}
              className={`flex-1 py-2 text-center rounded-lg font-medium transition-all cursor-pointer ${
                selectedDoctor === 'sarah'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high/50'
              }`}
            >
              Dr. Sarah W. (Admin)
            </button>
            <button
              type="button"
              onClick={() => setSelectedDoctor('hermawan')}
              className={`flex-1 py-2 text-center rounded-lg font-medium transition-all cursor-pointer ${
                selectedDoctor === 'hermawan'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high/50'
              }`}
            >
              dr. Hermawan (Medis)
            </button>
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
                <label className="text-xs font-semibold text-on-surface-variant px-1" htmlFor="username">
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
                <label className="text-xs font-semibold text-on-surface-variant px-1" htmlFor="password">
                  Password
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl">
                    lock
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
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
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Leftover Options */}
            <div className="flex justify-between items-center px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="text-xs font-medium text-on-surface-variant">Ingat Saya</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Fitur pemulihan password: Hubungi departemen IT untuk mereset kredensial.')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Lupa Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer text-sm"
            >
              Masuk
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
