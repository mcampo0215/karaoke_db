'use client';
import React, { useState } from 'react';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Here you would typically redirect to the next page
            // router.push('/dashboard') or window.location.href = '/dashboard'
        }, 3000);
    };

    return (
        <>
            {/* Full Screen Loading Overlay */}
            {loading && (
                <div className='fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center'>
                    <div className='bg-surface p-8 rounded-xl shadow-lg text-center space-y-4'>
                        <div className='animate-spin mx-auto h-12 w-12 border-4 border-primary border-t-transparent rounded-full'></div>
                        <h3 className='text-lg font-semibold text-primary'>Signing you in...</h3>
                        <p className='text-muted text-sm'>Please wait while we authenticate your account</p>
                    </div>
                </div>
            )}
            
            <div className='flex min-h-screen items-center justify-center bg-background text-foreground'>
                <div className='w-full max-w-xl p-10 space-y-6 bg-surface dark:bg-surface roundex-xl shadow-lg'>
                <div className='flex justify-center'>
                    <span className='inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20'>
                        <svg className='h-20 w-20 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9.001 9.001 0 0112 15c2.21 0 4.21.805 5.879 2.146M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </span>
                </div>
                <h2 className='text-2xl font-bold text-center text-primary'>Sign In</h2>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <p className='text-center text-muted'>Welcome back! Please enter your details to sign in.</p>
                    <div>
                        <label className='block text-sm font-medium text-primary'>Username</label>
                        <input
                            type='username'
                            className='w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:border-primary bg-background text-foreground'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-primary'>Password</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className='w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:border-primary bg-background text-foreground pr-10'
                                required
                            />
                            <button
                                type='button'
                                className='absolute right-2 top-1/2 -translate-y-1/2 text-blue-500'
                                onClick={() => setShowPassword((v) => !v)}
                                tabIndex={-1}
                                style={{ pointerEvents: 'auto', zIndex: 10 }}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    // Material Design eye-off icon
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-5.05 0-9.27-3.81-10-8.75a9.98 9.98 0 0 1 2.06-4.19M6.1 6.1A9.98 9.98 0 0 1 12 5c5.05 0 9.27 3.81 10 8.75a9.98 9.98 0 0 1-2.06 4.19M1 1l22 22" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ) : (
                                    // Material Design eye icon
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <ellipse cx="12" cy="12" rx="10" ry="7" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className='text-right mt-1'>
                            <a href='#' className='text-xs text-primary hover:underline'>Forgot password</a>
                        </div>
                    </div>
                    <button
                        type='submit'
                        className='w-full py-2 font-semibold text-white bg-primary rounded hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={loading}
                    >
                        Sign In
                    </button>
                    <p className='text-center text-sm text-muted'>
                        Don't have an account? <a href='#' className='text-primary hover:underline'>Sign up</a>
                    </p>
                </form>
            </div>
        </div>
        </>
    );
}