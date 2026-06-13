"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-soft w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-semibold text-text-primary mb-2">
          Welcome Back
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 px-4 rounded-sm border border-border outline-none text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-12 px-4 rounded-sm border border-border outline-none text-sm"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-sm bg-text-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-text-secondary text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-text-primary font-medium">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}