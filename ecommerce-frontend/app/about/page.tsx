'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, ShoppingBag, Heart, Shield, Clock, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 mt-16">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">About EcoShop</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        We're on a mission to make online shopping more convenient, affordable, and enjoyable for everyone.
                    </p>
                </div>

                {/* Our Story Section */}
                <section className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                            <p className="text-muted-foreground mb-4">
                                Founded in 2023, EcoShop began with a simple idea: create an online marketplace that offers quality products at competitive prices while providing exceptional customer service.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                What started as a small operation has grown into a thriving e-commerce platform serving thousands of customers. We've expanded our product range to include electronics, fashion, home goods, and much more.
                            </p>
                            <p className="text-muted-foreground">
                                Throughout our growth, we've remained committed to our core values of quality, customer satisfaction, and responsible business practices.
                            </p>
                        </div>
                        <div className="relative h-80 w-full rounded-lg overflow-hidden bg-gray-200">
                            {/* Replace with actual company image when available */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ShoppingBag className="h-24 w-24 text-primary opacity-50" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center">
                            <CardHeader>
                                <Heart className="h-12 w-12 text-red-500 mx-auto" />
                                <CardTitle className="mt-4">Customer First</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    We prioritize customer satisfaction in everything we do, from product selection to shipping and support.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <Shield className="h-12 w-12 text-green-500 mx-auto" />
                                <CardTitle className="mt-4">Quality Assurance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    We carefully curate our product selection to ensure everything we sell meets our high standards.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <Clock className="h-12 w-12 text-blue-500 mx-auto" />
                                <CardTitle className="mt-4">Timely Delivery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    We understand the importance of receiving your purchases promptly and work hard to minimize shipping times.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <Users className="h-12 w-12 text-purple-500 mx-auto" />
                                <CardTitle className="mt-4">Community</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    We strive to create a positive impact on our community through responsible business practices.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Team Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {['John Doe', 'Jane Smith', 'Michael Johnson', 'Sarah Williams'].map((name, index) => (
                            <Card key={index} className="overflow-hidden text-center">
                                <div className="h-40 w-full bg-gray-200 flex items-center justify-center">
                                    {/* Replace with actual team member photos when available */}
                                    <div className="h-20 w-20 rounded-full bg-primary-foreground flex items-center justify-center">
                                        <span className="text-2xl font-bold text-primary">{name.split(' ').map(n => n[0]).join('')}</span>
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg">{name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {index === 0 ? 'CEO & Founder' :
                                            index === 1 ? 'Marketing Director' :
                                                index === 2 ? 'Product Manager' : 'Customer Support Lead'}
                                    </p>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Contact Section */}
                <section className="mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 mr-2 text-primary" />
                                    <span>support@ecoshop.com</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 mr-2 text-primary" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                                    <span>123 Commerce St, Business City</span>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-center md:justify-start">
                                <Link href="/contact">
                                    <Button>Contact Us</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
}
