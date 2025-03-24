import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import hero from '@/public/images/hero.jpg';
const featuredProducts = [
    {
        id: '1',
        name: 'Product 1',
        price: 99.99,
        image: 'https://via.placeholder.com/500',
        rating: 4.5,
        reviewCount: 128,
    },
    {
        id: '2',
        name: 'Product 2',
        price: 149.99,
        image: 'https://via.placeholder.com/500',
        rating: 4.8,
        reviewCount: 256,
    },
    {
        id: '3',
        name: 'Product 3',
        price: 199.99,
        image: 'https://via.placeholder.com/500',
        rating: 4.2,
        reviewCount: 89,
    },
    {
        id: '4',
        name: 'Product 4',
        price: 299.99,
        image: 'https://via.placeholder.com/500',
        rating: 4.9,
        reviewCount: 512,
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero section */}
            <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20">
                <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
                    <div className="px-6 lg:px-0 lg:pt-4">
                        <div className="mx-auto max-w-2xl">
                            <div className="max-w-lg">
                                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    Your One-Stop Shop for Everything
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600">
                                    Discover amazing products at great prices. Shop with confidence and enjoy our wide selection of items.
                                </p>
                                <div className="mt-10 flex items-center gap-x-6">
                                    <Link
                                        href="/products"
                                        className="btn btn-primary"
                                    >
                                        Shop Now
                                    </Link>
                                    <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                                        Learn more <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
                        <div className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl ring-1 ring-gray-900/10 md:-mr-20 lg:-mr-36" aria-hidden="true" />
                        <div className="shadow-lg md:rounded-3xl">
                            <div className="bg-primary-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                                <div className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-primary-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36" aria-hidden="true" />
                                <div className="px-6 pt-6 pb-14">
                                    <Image
                                        src={ hero }
                                        alt="App screenshot"
                                        width={800}
                                        height={600}
                                        className="rounded-lg shadow-xl ring-1 ring-gray-900/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured products */}
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Products</h2>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>
        </div>
    );
} 