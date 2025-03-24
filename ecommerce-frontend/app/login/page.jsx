'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import axios from 'axios';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            toast.error('Please enter both email and password');
            return;
        }

        setLoading(true);

        try {
            console.log('Attempting login with:', { email, passwordLength: password.length });

            try {
                // Using axios instead of fetch
                const response = await axios.post('http://localhost:3001/api/users/login', {
                    email,
                    password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Login response status:', response.status);
                console.log('Login response data:', response.data);

                // With axios, the response is already parsed as JSON
                const data = response.data;

                // Safely extract data from the response with fallbacks
                const token = data.token;
                const userId = data.user?.id || data.userId;
                const user = data.user || { id: userId, email };

                console.log('Login response data:', {
                    token: !!token, // Just log if exists, not the actual token
                    userId,
                    userName: user?.name,
                    userEmail: user?.email
                });

                if (!token) {
                    throw new Error('No authentication token received');
                }

                if (!user?.name) {
                    console.warn('User name missing in login response');
                }

                // Store token in localStorage in the format expected by profile page
                localStorage.setItem('userData', JSON.stringify({
                    token,
                    userId,
                    user: {
                        id: userId,
                        name: user?.name || '', // Make sure name is included
                        email: user?.email || email
                    }
                }));

                toast.success('Login successful!');
                router.push('/');
            } catch (apiError) {
                console.error('API call error:', apiError);

                // Handle axios error specifically
                if (apiError.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Error response data:', apiError.response.data);
                    console.error('Error response status:', apiError.response.status);

                    // Use the server's error message if available
                    setError(`Server error: ${apiError.response.data.message || apiError.response.statusText}`);
                } else if (apiError.request) {
                    // The request was made but no response was received
                    console.error('Error request:', apiError.request);
                    setError('No response from server. Please check if the server is running.');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    setError(`Error: ${apiError.message}`);
                }

                toast.error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Failed to login');
            toast.error(error.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Login</CardTitle>
                        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">Password</label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="text-center">
                        <p className="text-sm text-gray-500 w-full">
                            Don't have an account? <Link href="/register" className="font-semibold hover:underline">Register</Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
} 