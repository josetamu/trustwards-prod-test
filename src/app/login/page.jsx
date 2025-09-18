'use client';

import './login.css';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@supabase/supabaseClient';

import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '@animations/animations';
import { ThemeProvider } from 'next-themes';

export default function LoginPage() {
    const router = useRouter();
    const search = useSearchParams();
    const next = search.get('next') || '/'; // To redirect to the home after the login

    const [loading, setLoading] = useState(false); // To disable the Continue button when is submitting
    const [err, setErr] = useState(null); // To catch an error message and show it later

    const [sentEmail, setSentEmail] = useState(false); // To store if an email was sent, then display check your inbox message
    const [email, setEmail] = useState(''); // To store the email for the resend link
    const [resendEmail, setResendEmail] = useState(false); // To store if an email was resent, then hide resend email message

    // If there is a session, redirect to the home
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) router.replace(next);
        });
    }, [router, next]);

    // Submit email
    async function onSubmit(e) {
        e.preventDefault();
        setErr(null);
        setLoading(true);

        const form = e.currentTarget;
        const email = form.email.value;
        setEmail(email);
        sendEmail(email);
    }

    // Send email used by submit email and resend email
    async function sendEmail(email) {
        const origin = window.location.origin;
        const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true,
            emailRedirectTo: `${origin}/api/auth?next=${encodeURIComponent(next)}`,
        },
        });
        setLoading(false);

        // If there is an error, show the error message
        if (error) {
        const msg = (error.message || '').toLowerCase();
        if (msg.includes('not found') || msg.includes('no user')) {
            setErr('User not found');
            return false;
        }
        setErr(error.message);
        return false;
        }

        // Magic link sent to sign in. Then update UI to show the resend email message
        setSentEmail(true);
        return true;
    }

    // Handle resend click to avoid hiding link before success
    async function onResendClick() {
        if (!email) return; // No email captured yet
        setErr(null);
        setLoading(true);
        const ok = await sendEmail(email);
        if (ok) setResendEmail(true);
    }

    // Submit Google
    async function onGoogle() {
        const origin = window.location.origin;
        await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${origin}/api/auth?next=${encodeURIComponent(next)}` },
        });
    }

    // Submit Github
    async function onGithub() {
        const origin = window.location.origin;
        await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: `${origin}/api/auth?next=${encodeURIComponent(next)}` },
        });
    }

    //Remove padding from html from the dashboard
    useEffect(() => {
    document.documentElement.classList.add('trustwards-login')

    return () => {
        document.documentElement.classList.remove('trustwards-login')
    }
    }, [])

    return (
        <ThemeProvider>
            <div className="tw-login">
                <AnimatePresence>
                    {sentEmail && (
                        <motion.div
                            {...ANIM_TYPES.find(anim => anim.name === 'SCALE_BOTTOM')}
                            className="tw-login__sent-email"
                        >
                            <svg className="tw-login__sent-email-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" color="#fff" fill="none">
                                <path strokeWidth="1.5" strokeLinejoin="round" d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z" />
                                <path strokeWidth="1.5" strokeLinejoin="round" d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6" />
                            </svg>
                            <span className="tw-login__sent-email-title">Check your inbox</span>
                            <span className="tw-login__sent-email-text">
                                We sent you an activation link.
                                Please <br/> be sure to check your spam folder too.
                                {!resendEmail && (
                                    <>
                                        <br/>
                                        <br/>
                                        <span onClick={onResendClick} className="tw-login__sent-email-link">Click here</span> if you didn't receive the email.
                                    </>
                                )}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
                {!sentEmail && (
                    <div className="tw-login__content">
                        <div className="tw-login__top-content">
                            <div className="tw-login__logo"></div>
                            <h1 className="tw-login__title">Welcome to Trustwards</h1>
                            <p className="tw-login__text">Start complying in a few minutes.</p>
                        </div>

                        <form onSubmit={onSubmit} className="tw-login__form">
                            <input id="email" name="email" type="email" required placeholder="Email" className="tw-login__email"/>

                            <button type="submit" disabled={loading} className="tw-login__continue">Continue</button>
                        </form>

                        <div className="tw-login__or-separator-container">
                            <span className="tw-login__or-separator">or</span>
                        </div>

                        <button className="tw-login__continue-with tw-login__continue-with--google" onClick={onGoogle}>Continue with Google</button>
                        <button className="tw-login__continue-with tw-login__continue-with--github" onClick={onGithub}>Continue with Github</button>

                        {err && <p className="tw-login__error">{err}</p>}
                    </div>
                )}

                <div className="tw-login__blur"></div>
            </div>
        </ThemeProvider>
    );
}