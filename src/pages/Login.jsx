import { useState } from "react";
import { login } from "../services/authService.js";
import Register from "./Register.jsx";

export default function Login({ onLoginSuccess }) {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      onLoginSuccess();
    } catch (loginError) {
      setError(loginError.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (view === "register") {
    return <Register onBackToLogin={() => setView("login")} />;
  }

  return (
    <div className="min-h-screen bg-repeat-round bg-[url(https://images.unsplash.com/photo-1558741072-b7db02d64308?w=1920&q=80)] px-4 py-10">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-emerald-800/60 to-blue-900/70 flex items-center justify-center">
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

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
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
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

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
              onClick={() => setView("register")}
              className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 bg-white shadow-sm transition hover:bg-slate-50"
            >
              Sign up with email
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
    </div>
  );
}
