import { useState } from "react";
import { getGoogleAuthorizationUrl, register } from "../services/authService.js";

export default function Register({ onBackToLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!acceptedTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({
        username: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });
      setSuccess("Account created successfully. You can now sign in.");
    } catch (registrationError) {
      setError(registrationError.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    window.location.assign(getGoogleAuthorizationUrl());
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1558741072-b7db02d64308?w=1920&q=80)] px-4 py-10">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-900/60 to-blue-900/80" />
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-xl border border-white/70">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-green-600 text-white mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                <path d="M12 2C8.134 2 5 5.134 5 9c0 3.866 3.134 7 7 7s7-3.134 7-7c0-3.866-3.134-7-7-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                <path d="M4 20.5c0-2.485 3.582-4.5 8-4.5s8 2.015 8 4.5V22H4v-1.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">Iriva</h1>
            <p className="mt-2 text-sm text-slate-500">Join the movement and make informed choices for a healthier planet.</p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="flex items-center justify-center gap-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                <svg viewBox="0 0 533.5 544.3" className="h-4 w-4" aria-hidden="true">
                  <path fill="#4285F4" d="M533.5 278.4c0-17.6-1.5-34.5-4.3-50.9H272v96.3h146.9c-6.4 34.5-25 63.7-53.3 83.2v69.4h86.1c50.4-46.5 79.8-114.8 79.8-197z" />
                  <path fill="#34A853" d="M272 544.3c72.5 0 133.4-24.1 177.8-65.5l-86.1-69.4c-24.1 16.2-55.2 25.7-91.7 25.7-70.4 0-130.1-47.5-151.5-111.3H34.2v69.8c44.4 88.1 135.8 150.7 237.8 150.7z" />
                  <path fill="#FBBC05" d="M120.5 322.8c-10.2-30.8-10.2-64.4 0-95.2V157.8H34.2c-39.3 77.9-39.3 170.6 0 248.5l86.3-83.5z" />
                  <path fill="#EA4335" d="M272 107.1c39.3 0 74.5 13.5 102.4 40.1l76.6-76.6C399.4 24.5 335.8 0 272 0 170.1 0 78.7 62.6 34.2 157.8l86.3 69.8c21.4-63.8 81.1-111.3 151.5-111.3z" />
                </svg>
              </span>
              Sign up with Google
            </button>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
              Or register with email
            </div>
          </div>

          <form onSubmit={handleRegister} className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full Name</span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                placeholder="Jane Smith"
                autoComplete="name"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </label>

            <label className="flex items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>
                I agree to Iriva&apos;s <button type="button" className="font-semibold text-emerald-600 hover:text-emerald-700">Terms of Service</button> and{' '}
                <button type="button" className="font-semibold text-emerald-600 hover:text-emerald-700">Privacy Policy</button>.
              </span>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-700">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onBackToLogin}
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
