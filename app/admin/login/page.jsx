"use client";

import { useState } from "react";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData) {
    setLoading(true);
    setError("");
    const result = await login(formData);
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-5">
      <form action={handleSubmit} className="bg-white border border-line rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <h1 className="font-display font-extrabold text-xl text-ink mb-1">Admin Login</h1>
        <p className="text-sm text-muted mb-6">Blanks In Bulk dashboard</p>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold">Email</label>
          <input
            type="email"
            name="email"
            required
            className="bg-[#F5F5F3] border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-olive"
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-semibold">Password</label>
          <input
            type="password"
            name="password"
            required
            className="bg-[#F5F5F3] border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-olive"
          />
        </div>

        {error && <p className="text-sm text-[#B23B3B] mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-[#222] text-white font-semibold text-sm py-3 rounded-full transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
