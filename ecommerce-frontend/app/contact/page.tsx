'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, MapPin, Phone, SendIcon, CheckCircle } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        try {
            // In a real application, you would send this data to your API here
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSubmitted(true);
            toast.success('Your message has been sent successfully!');

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

            // Reset submission status after a delay
            setTimeout(() => {
                setIsSubmitted(false);
            }, 5000);
        } catch (error) {
            toast.error('Failed to send your message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 mt-16">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        We'd love to hear from you! Feel free to reach out with any questions, feedback, or inquiries.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Get In Touch</CardTitle>
                                <CardDescription>
                                    Here's how you can reach us
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 mr-3 text-primary" />
                                    <div>
                                        <h3 className="font-medium">Email</h3>
                                        <p className="text-sm text-muted-foreground">support@ecoshop.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 mr-3 text-primary" />
                                    <div>
                                        <h3 className="font-medium">Phone</h3>
                                        <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                                    <div>
                                        <h3 className="font-medium">Address</h3>
                                        <p className="text-sm text-muted-foreground">
                                            123 Commerce St<br />
                                            Business City, BC 12345<br />
                                            United States
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <h3 className="font-medium mb-2">Business Hours</h3>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p className="flex justify-between">
                                            <span>Monday - Friday</span>
                                            <span>9:00 AM - 6:00 PM</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Saturday</span>
                                            <span>10:00 AM - 4:00 PM</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Sunday</span>
                                            <span>Closed</span>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Send Us a Message</CardTitle>
                                <CardDescription>
                                    Fill out the form below and we'll get back to you as soon as possible
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isSubmitted ? (
                                    <div className="text-center py-8">
                                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                                        <p className="text-muted-foreground">
                                            Your message has been sent successfully. We'll get back to you shortly.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium">
                                                    Your Name
                                                </label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium">
                                                    Email Address
                                                </label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="your.email@example.com"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium">
                                                Subject
                                            </label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="How can we help you?"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium">
                                                Message
                                            </label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Your message here..."
                                                rows={6}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full md:w-auto"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <SendIcon className="mr-2 h-4 w-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Map Section */}
                <Card className="mb-8">
                    <CardContent className="p-0">
                        <div className="aspect-video w-full bg-gray-200 flex items-center justify-center">
                            {/* Placeholder for Google Maps or other map service */}
                            <div className="text-center p-8">
                                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Find Us</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    123 Commerce St, Business City, BC 12345, United States
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => window.open('https://maps.google.com', '_blank')}
                                >
                                    Open in Google Maps
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* FAQ Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">What are your shipping times?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Standard shipping typically takes 3-5 business days within the continental US.
                                    Express shipping options are available at checkout for 1-2 day delivery.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">How can I track my order?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Once your order ships, you'll receive a confirmation email with tracking information.
                                    You can also check your order status in the "My Orders" section of your account.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">What is your return policy?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    We offer a 30-day return policy for most items. Products must be in original condition
                                    with tags attached. Some exceptions apply for personal items and sale merchandise.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Do you ship internationally?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Yes, we ship to many countries worldwide. International shipping rates and delivery times
                                    vary by location. You can see specific shipping options during checkout.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>
        </div>
    );
} 