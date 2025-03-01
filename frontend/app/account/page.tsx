"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, User, Package, Heart, CreditCard, LogOut, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { orderHistory } from "@/lib/data";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AccountPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
  };

  return (
    <><Navbar />
    <div className="container py-8 lg:ml-20 md:ml-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground">My Account</span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://i.pravatar.cc/150?img=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
            </div>

            <nav className="space-y-1">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant={activeTab === "orders" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("orders")}
              >
                <Package className="mr-2 h-4 w-4" />
                Orders
              </Button>
              <Button
                variant={activeTab === "wishlist" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("wishlist")}
              >
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
              </Button>
              <Button
                variant={activeTab === "payment" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("payment")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Payment Methods
              </Button>
              <Button
                variant={activeTab === "notifications" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Separator className="my-2" />
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </div>

        <div className="md:col-span-3">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Profile Information</h2>
                <p className="text-muted-foreground">Update your account details and profile information</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile}>
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First name</Label>
                          <Input id="firstName" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last name</Label>
                          <Input id="lastName" defaultValue="Doe" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" defaultValue="United States" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" defaultValue="New York" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue="123 Main St, Apt 4B" />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" defaultValue="NY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP code</Label>
                          <Input id="zipCode" defaultValue="10001" />
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSavePassword}>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSavePassword}>Update Password</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Order History</h2>
                <p className="text-muted-foreground">View and track your orders</p>
              </div>

              <div className="space-y-4">
                {orderHistory.map((order) => (
                  <Card key={order.id}>
                    <CardHeader className="pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <CardTitle className="text-base">Order #{order.id}</CardTitle>
                          <CardDescription>{order.date}</CardDescription>
                        </div>
                        <Badge className="mt-2 sm:mt-0" variant={order.status === "Delivered" ? "default" : order.status === "Processing" ? "secondary" : "outline"}>
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.color}, {item.size} × {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">${order.total.toFixed(2)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                      <Button size="sm">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">My Wishlist</h2>
                <p className="text-muted-foreground">Products you've saved for later</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {orderHistory[0].items.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                      <Button size="sm">Add to Cart</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Payment Methods</h2>
                <p className="text-muted-foreground">Manage your payment methods</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Saved Payment Methods</CardTitle>
                  <CardDescription>Your saved cards and payment options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-16 bg-muted rounded flex items-center justify-center">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <Badge>Default</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-16 bg-muted rounded flex items-center justify-center">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 5678</p>
                          <p className="text-sm text-muted-foreground">Expires 08/26</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Set as Default
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Add New Payment Method</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                  <CardDescription>Your default billing address</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">123 Main St, Apt 4B</p>
                    <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                    <p className="text-sm text-muted-foreground">United States</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Edit Address</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Notification Preferences</h2>
                <p className="text-muted-foreground">Manage how you receive notifications</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Choose what emails you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="order-updates">Order updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about your order status
                      </p>
                    </div>
                    <Switch id="order-updates" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="promotions">Promotions</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about promotions and discounts
                      </p>
                    </div>
                    <Switch id="promotions" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newsletter">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive our weekly newsletter
                      </p>
                    </div>
                    <Switch id="newsletter" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="product-updates">Product updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates on products you've viewed or wishlisted
                      </p>
                    </div>
                    <Switch id="product-updates" defaultChecked />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Account Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Language and Region</CardTitle>
                  <CardDescription>Set your preferred language and region</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Settings</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Manage your privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-collection">Data collection</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow us to collect data to improve your shopping experience
                      </p>
                    </div>
                    <Switch id="data-collection" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="personalized-ads">Personalized ads</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow us to show you personalized ads based on your browsing history
                      </p>
                    </div>
                    <Switch id="personalized-ads" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cookies">Cookies</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow us to use cookies to enhance your browsing experience
                      </p>
                    </div>
                    <Switch id="cookies" defaultChecked />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Settings</Button>
                </CardFooter>
              </Card>

              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive">Delete Account</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer/></>
  );
}