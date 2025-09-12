'use client';

import './login.css';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@supabase/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/dashboard';

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // Si ya hay sesión, salta el login
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(next);
    });
  }, [supabase, router, next]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) return setErr(error.message);
    router.replace(next);
  }

  async function onGoogle() {
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/api/auth?next=${encodeURIComponent(next)}` },
    });
  }

  return (
    <div className="tw-login">
        <div className="tw-login__content">
            <div className="tw-login__top-content">
                <div className="tw-login__logo"></div>
                <h1 className="tw-login__title">Welcome to Trustwards</h1>
                <p className="tw-login__text">Start complying in a few minutes.</p>
            </div>

            <form onSubmit={onSubmit} className="tw-login__form">
                <input id="email" name="email" type="email" required placeholder="Email" className="tw-login__email"/>
                <input id="password" name="password" type="password" required placeholder="Password" className="tw-login__password"/>

                <button type="submit" disabled={loading} className="tw-login__continue">
                    {loading ? 'Entering…' : 'Continue'}
                </button>
            </form>

            <div className="tw-login__or-separator-container">
                <span className="tw-login__or-separator">or</span>
            </div>

            <button className="tw-login__continue-with-google" onClick={onGoogle}>Continue with Google</button>

            {err && <p>{err}</p>}
        </div>

        <div className="tw-login__blur"></div>
    </div>
  );
}