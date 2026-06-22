"use client";

import { ArrowRight, Eye, Mail } from "lucide-react";

export default function LoginForm() {
  return (
    <form
      className="w-full space-y-lg"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* Email */}
      <div className="space-y-sm">
        <label
          htmlFor="email"
          className="font-label-md text-label-md text-on-surface-variant block"
        >
          E-mail institucional
        </label>

        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder="nome@empresa.ao"
            className="w-full h-[56px] px-md pr-12 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary font-body-md text-body-md transition-all"
          />

          <Mail className="absolute right-md top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5" />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-sm">
        <div className="flex justify-between items-center">
          <label
            htmlFor="password"
            className="font-label-md text-label-md text-on-surface-variant block"
          >
            Password
          </label>

          <a
            href="#"
            className="font-label-md text-label-md text-primary hover:underline transition-all"
          >
            Esqueceu a password?
          </a>
        </div>

        <div className="relative">
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full h-[56px] px-md pr-12 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary font-body-md text-body-md transition-all"
          />

          <button
            type="button"
            className="absolute right-md top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full h-[56px] bg-primary-container text-white font-label-md text-label-md font-bold rounded-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-sm"
      >
        Entrar

        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Divider */}
      <div className="flex items-center gap-md py-sm">
        <div className="flex-grow h-[1px] bg-outline-variant" />

        <span className="font-label-md text-label-md text-outline">
          ou
        </span>

        <div className="flex-grow h-[1px] bg-outline-variant" />
      </div>

      {/* Register */}
      <div className="text-center">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Ainda não tem conta?
        </span>

        <a
          href="#"
          className="font-label-md text-label-md text-secondary ml-xs font-bold hover:underline"
        >
          Registar-se
        </a>
      </div>
    </form>
  );
}