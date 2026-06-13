"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/features/auth/actions";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(name, email, password);
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-soft w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-semibold text-text-primary mb-2">
          Create Account
        </h1>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-12 px-4 rounded-sm border border-border outline-none text-sm"
        />
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
          minLength={6}
          className="h-12 px-4 rounded-sm border border-border outline-none text-sm"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-sm bg-text-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-sm text-text-secondary text-center">
          Already have an account?{" "}
          <a href="/login" className="text-text-primary font-medium">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}