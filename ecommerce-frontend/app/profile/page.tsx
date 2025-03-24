'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
    User,
    Mail,
    Calendar,
    Package,
    Edit2,
    Save,
    X,
    LogOut,
    CheckCircle2,
    Clock,
    AlertCircle,
    Phone,
    MapPin,
    Lock,
    Loader2
} from 'lucide-react';
import axios from 'axios';
import { AxiosError } from 'axios';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    memberSince: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    phoneNumber?: string;
    avatar?: string;
}

interface Order {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    items: {
        id: string;
        name: string;
        quantity: number;
        price: number;
    }[];
}

interface UserData {
    token: string;
    userId: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export default function ProfilePage() {
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);

    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userDataStr = localStorage.getItem('userData');
                if (!userDataStr) {
                    toast.error('Please log in to view your profile');
                    router.push('/login');
                    return;
                }

                await fetchProfileData();
            } catch (err) {
                console.error('Error checking auth:', err);
                handleAuthError(err);
            }
        };

        checkAuth();
    }, [router]);

    useEffect(() => {
        if (window.location.hash === '#orders') {
            setActiveTab('orders');
        }
    }, []);

    const getUserData = (): UserData => {
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            throw new Error('No user data found');
        }
        return JSON.parse(userDataStr);
    };

    const fetchProfileData = async () => {
        setLoading(true);
        setError(null);

        try {
            const userData = getUserData();
            const userId = userData.userId || userData.user?.id;

            if (!userData.token) {
                throw new Error('Authentication token not found');
            }

            if (!userId) {
                throw new Error('User ID not found');
            }

            console.log('About to fetch profile data for userId:', userId);

            // Get user profile data
            const profileResponse = await axios.get(
                `http://localhost:3001/api/users/profile/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${userData.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const profileData = profileResponse.data;
            console.log('Profile data received:', {
                profileData,
                hasName: !!profileData.name,
                nameValue: profileData.name,
                id: profileData.id
            });

            // Get name from userData if it's missing in the profile response
            const userName = profileData.name || userData.user?.name || 'User';

            console.log('User name resolution:', {
                fromProfile: profileData.name,
                fromUserData: userData.user?.name,
                finalName: userName
            });

            // Check all fields coming from server
            console.log('Full profile data object keys:', Object.keys(profileData));

            // Set the profile data in state with the resolved name
            setProfile({
                id: profileData.id,
                name: userName,
                email: profileData.email,
                memberSince: profileData.memberSince,
                phoneNumber: profileData.phoneNumber,
                address: profileData.address,
                avatar: profileData.avatar
            });

            // Update the form with the resolved name
            setProfileForm({
                name: userName || '',
                phoneNumber: profileData.phoneNumber || '',
                street: profileData.address?.street || '',
                city: profileData.address?.city || '',
                state: profileData.address?.state || '',
                zipCode: profileData.address?.zipCode || '',
                country: profileData.address?.country || ''
            });

            try {
                const ordersResponse = await axios.get(
                    `http://localhost:3003/api/orders/user/${userId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${userData.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
            } catch (orderErr) {
                console.warn('Error fetching orders:', orderErr);
                setOrders([]);
            }
        } catch (err) {
            console.error('Error fetching profile data:', err);
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async () => {
        if (!profile) return;

        setIsSubmitting(true);

        try {
            const userData = getUserData();
            const userId = userData.userId || userData.user?.id;

            console.log('Updating profile with form data:', {
                name: profileForm.name,
                phoneNumber: profileForm.phoneNumber,
                address: {
                    street: profileForm.street,
                    city: profileForm.city,
                    state: profileForm.state,
                    zipCode: profileForm.zipCode,
                    country: profileForm.country
                }
            });

            const response = await axios.put(
                `http://localhost:3001/api/users/profile/${userId}`,
                {
                    name: profileForm.name,
                    phoneNumber: profileForm.phoneNumber,
                    address: {
                        street: profileForm.street,
                        city: profileForm.city,
                        state: profileForm.state,
                        zipCode: profileForm.zipCode,
                        country: profileForm.country
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${userData.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Profile update response:', {
                status: response.status,
                data: response.data,
                hasName: !!response.data.name
            });

            // Set the profile data with safer handling for potentially missing fields
            setProfile({
                ...profile,
                ...response.data,
                name: response.data.name || profile.name || 'User'
            });

            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (err) {
            console.error('Error updating profile:', err);
            handleAuthError(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdatePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordForm;

        if (!currentPassword) {
            toast.error('Current password is required');
            return;
        }

        if (!newPassword) {
            toast.error('New password is required');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('New password must be at least 8 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setIsSubmitting(true);

        try {
            const userData = getUserData();
            const userId = userData.userId || userData.user?.id;

            await axios.put(
                `http://localhost:3001/api/users/profile/${userId}/password`,
                {
                    currentPassword,
                    newPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${userData.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            toast.success('Password updated successfully');
        } catch (err) {
            console.error('Error updating password:', err);

            if (err instanceof AxiosError && err.response?.status === 401) {
                toast.error('Current password is incorrect');
            } else {
                handleAuthError(err);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAuthError = (err: unknown) => {
        if (
            err instanceof Error &&
            (err.message.includes('auth') ||
                err.message.includes('token') ||
                (err instanceof AxiosError && err.response?.status === 401))
        ) {
            toast.error('Your session has expired. Please log in again');
            localStorage.removeItem('userData');
            router.push('/login');
        } else {
            setError(err instanceof Error ? err.message : 'An error occurred');
            toast.error('An error occurred while loading your data');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userData');
        toast.success('Logged out successfully');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-8 mt-16 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 mt-16">
                <div className="max-w-4xl mx-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">My Account</h1>
                        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full">
                            <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
                            <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
                            <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Personal Information</span>
                                        {!isEditing ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-2"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                                Edit
                                            </Button>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setIsEditing(false)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={handleUpdateProfile}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    ) : (
                                                        <Save className="h-4 w-4 mr-2" />
                                                    )}
                                                    Save
                                                </Button>
                                            </div>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your personal information and contact details
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    Full Name
                                                </label>
                                                {isEditing ? (
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={profileForm.name}
                                                        onChange={handleProfileInputChange}
                                                        disabled={isSubmitting}
                                                    />
                                                ) : (
                                                    <p className="p-2 border rounded-md bg-gray-50">{profile?.name}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    Email Address
                                                </label>
                                                <p className="p-2 border rounded-md bg-gray-50">{profile?.email}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="memberSince" className="text-sm font-medium flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Member Since
                                                </label>
                                                <p className="p-2 border rounded-md bg-gray-50">
                                                    {profile?.memberSince ? new Date(profile.memberSince).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    Phone Number
                                                </label>
                                                {isEditing ? (
                                                    <Input
                                                        id="phoneNumber"
                                                        name="phoneNumber"
                                                        value={profileForm.phoneNumber}
                                                        onChange={handleProfileInputChange}
                                                        placeholder="Your phone number"
                                                        disabled={isSubmitting}
                                                    />
                                                ) : (
                                                    <p className="p-2 border rounded-md bg-gray-50">
                                                        {profile?.phoneNumber || 'Not provided'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Address Information
                                        </h3>
                                        {isEditing ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2 md:col-span-2">
                                                    <label htmlFor="street" className="text-sm font-medium">Street Address</label>
                                                    <Input
                                                        id="street"
                                                        name="street"
                                                        value={profileForm.street}
                                                        onChange={handleProfileInputChange}
                                                        placeholder="123 Main St."
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="city" className="text-sm font-medium">City</label>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        value={profileForm.city}
                                                        onChange={handleProfileInputChange}
                                                        placeholder="City"
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="state" className="text-sm font-medium">State/Province</label>
                                                    <Input
                                                        id="state"
                                                        name="state"
                                                        value={profileForm.state}
                                                        onChange={handleProfileInputChange}
                                                        placeholder="State"
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="zipCode" className="text-sm font-medium">ZIP/Postal Code</label>
                                                    <Input
                                                        id="zipCode"
                                                        name="zipCode"
                                                        value={profileForm.zipCode}
                                                        onChange={handleProfileInputChange}
                                                        placeholder="12345"
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="country" className="text-sm font-medium">Country</label>
                                                    <Input
                                                        id="country"
                                                        name="country"
                                                        value={profileForm.country}
                                                        onChange={handleProfileInputChange}
                                                        placeholder="Country"
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            profile?.address ? (
                                                <div className="p-3 border rounded-md bg-gray-50">
                                                    <p>{profile.address.street}</p>
                                                    <p>
                                                        {profile.address.city}, {profile.address.state} {profile.address.zipCode}
                                                    </p>
                                                    <p>{profile.address.country}</p>
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground">No address information provided</p>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="orders">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order History</CardTitle>
                                    <CardDescription>View your past orders and check their status</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order.id} className="border rounded-md p-4">
                                                    <div className="flex flex-wrap justify-between items-center mb-4">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="font-medium mr-2">Status:</span>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : order.status === 'processing'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {order.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                                {order.status === 'processing' && <Clock className="w-3 h-3 mr-1" />}
                                                                {order.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="border-t pt-4">
                                                        <h4 className="font-medium mb-2">Items</h4>
                                                        <div className="space-y-2">
                                                            {order.items.map((item) => (
                                                                <div key={item.id} className="flex justify-between text-sm">
                                                                    <div>
                                                                        <span className="font-medium">{item.name}</span>
                                                                        <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                                                                    </div>
                                                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="border-t mt-4 pt-4 flex justify-between items-center">
                                                        <span className="font-bold">Total</span>
                                                        <span className="font-bold">${order.total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-medium">No orders yet</h3>
                                            <p className="text-muted-foreground">
                                                Once you make a purchase, your orders will appear here
                                            </p>
                                            <Button
                                                className="mt-4"
                                                onClick={() => router.push('/products')}
                                            >
                                                Browse Products
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="h-5 w-5" />
                                        Password & Security
                                    </CardTitle>
                                    <CardDescription>
                                        Update your password and manage security settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Change Password</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label htmlFor="currentPassword" className="text-sm font-medium">
                                                    Current Password
                                                </label>
                                                <Input
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    type="password"
                                                    value={passwordForm.currentPassword}
                                                    onChange={handlePasswordInputChange}
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="newPassword" className="text-sm font-medium">
                                                    New Password
                                                </label>
                                                <Input
                                                    id="newPassword"
                                                    name="newPassword"
                                                    type="password"
                                                    value={passwordForm.newPassword}
                                                    onChange={handlePasswordInputChange}
                                                    disabled={isSubmitting}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Password must be at least 8 characters long
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="confirmPassword" className="text-sm font-medium">
                                                    Confirm New Password
                                                </label>
                                                <Input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={handlePasswordInputChange}
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <Button
                                                onClick={handleUpdatePassword}
                                                disabled={isSubmitting}
                                                className="mt-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Updating...
                                                    </>
                                                ) : (
                                                    'Update Password'
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
