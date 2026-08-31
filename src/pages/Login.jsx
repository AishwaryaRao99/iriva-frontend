import { useState } from "react";
import UI_CONFIG from "../config/uiConfig";
import { login, getGoogleAuthorizationUrl } from "../services/authService.js";
import Register from "./Register.jsx";
import CustomAlertModal from "../components/CustomAlertModal";

export default function Login({ onLoginSuccess }) {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState('info');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const nextFieldErrors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) nextFieldErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) nextFieldErrors.email = "Enter a valid email address.";
    if (!password) nextFieldErrors.password = "Password is required.";
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;
    setLoading(true);

    try {
      await login(trimmedEmail, password);
      // On successful login proceed immediately without showing a modal
      setModalOpen(false);
      onLoginSuccess();
    } catch (loginError) {
      const msg = loginError?.message || 'Login failed. Please try again.';
      setModalType('error');
      setModalMessage(msg);
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // auto-close value will be passed from UI config

  if (view === "register") {
    return <Register onBackToLogin={() => setView("login")} />;
  }

  return (
    <div className="min-h-screen bg-repeat-round bg-[url(https://images.unsplash.com/photo-1558741072-b7db02d64308?w=1920&q=80)] px-4 py-10">
      <div className="absolute inset-0 bg-linear-to-br from-emerald-900/70 via-emerald-800/60 to-blue-900/70 flex items-center justify-center">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-10 py-8 text-center bg-white/90">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-green-600 text-white mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                <path d="M12 2C8.134 2 5 5.134 5 9c0 3.866 3.134 7 7 7s7-3.134 7-7c0-3.866-3.134-7-7-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                <path d="M4 20.5c0-2.485 3.582-4.5 8-4.5s8 2.015 8 4.5V22H4v-1.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 mb-1">Iriva</h1>
            <p className="text-sm text-slate-500 mb-8">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5 text-left">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                  placeholder="you@example.com"
                  autoComplete="username"
                />
                {fieldErrors.email && <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                {fieldErrors.password && <p className="mt-2 text-sm text-red-600">{fieldErrors.password}</p>}
              </label>

              

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-emerald-600 text-white py-3 font-semibold transition hover:bg-emerald-500 disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              <button type="button" className="text-green-600 hover:text-emerald-700">
                Forgot password?
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200"></div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Or continue with</div>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={() => (window.location.href = getGoogleAuthorizationUrl())}
              className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 bg-white shadow-sm transition hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chrome w-5 h-5" data-fg-caxq49=":0:node_modules/lucide-react:122:13:4909:30:e:Chrome::::::C1yS" data-fgid-caxq49=":r44:"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" x2="12" y1="8" y2="8"></line><line x1="3.95" x2="8.54" y1="6.06" y2="14"></line><line x1="10.88" x2="15.46" y1="21.94" y2="14"></line></svg>
              Continue with Google
            </button>

            <p className="mt-6 text-xs text-slate-500">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="font-semibold text-green-600 hover:text-emerald-700"
                onClick={() => setView("register")}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
      <CustomAlertModal
        open={modalOpen}
        title={modalType === 'success' ? 'Success' : modalType === 'error' ? 'Error' : 'Notice'}
        message={modalMessage}
        type={modalType}
        autoCloseMs={UI_CONFIG.modalAutoCloseMs}
        onClose={() => {
          setModalOpen(false);
          if (modalType === 'success') onLoginSuccess();
        }}
      />
    </div>
  );
}

