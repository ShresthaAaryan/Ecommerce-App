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

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Update state when input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Validate form data on the client
    const validateForm = () => {
        const { name, email, password, confirmPassword } = formData;
        if (!name.trim()) {
            toast.error('Name is required');
            return false;
        }
        if (!email.trim()) {
            toast.error('Email is required');
            return false;
        }
        if (!password) {
            toast.error('Password is required');
            return false;
        }
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return false;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/api/users/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            // Expected response contains token, user, and userId
            const { token, user, userId } = response.data;

            console.log('Registration API response:', {
                hasToken: !!token,
                userId: userId,
                user: user,
                userName: user?.name
            });

            if (!token) {
                throw new Error('Registration successful but no token received');
            }

            // Store user data in localStorage
            const userData = {
                token,
                userId: userId || user?.id,
                user: {
                    id: userId || user?.id,
                    name: user?.name || formData.name,
                    email: user?.email || formData.email
                }
            };

            console.log('Storing in localStorage:', userData);

            localStorage.setItem('userData', JSON.stringify(userData));

            toast.success('Account created successfully!');
            setTimeout(() => router.push('/'), 500);
        } catch (err) {
            console.error('Registration error:', err);
            // Detailed error handling
            if (err.response) {
                // The server responded with a status code outside of the 2xx range
                const message = err.response.data?.message || err.response.statusText;
                setError(`Registration failed: ${message}`);
                toast.error(`Registration failed: ${message}`);
            } else if (err.request) {
                // Request was made but no response received
                setError('Server not responding. Please try again later.');
                toast.error('Server not responding. Please try again later.');
            } else {
                // Something else happened
                setError(err.message || 'Failed to register');
                toast.error(err.message || 'Failed to register');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Create an Account</CardTitle>
                        <CardDescription className="text-center">
                            Sign up to start shopping
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">Password</label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                />
                                <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <span>Creating Account...</span> : <span>Create Account</span>}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="text-center">
                        <p className="text-sm text-gray-500 w-full">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-primary hover:underline">
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
