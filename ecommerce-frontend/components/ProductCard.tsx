'use client';

import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/20/solid';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
    reviewCount: number;
}

export default function ProductCard({
    id,
    name,
    price,
    image,
    rating,
    reviewCount,
}: ProductCardProps) {
    return (
        <div className="group relative">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <Image
                    src={image}
                    alt={name}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm text-gray-700">
                        <Link href={`/products/${id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {name}
                        </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{name}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${price}</p>
            </div>
            <div className="mt-2 flex items-center">
                <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                            key={rating}
                            className={`h-5 w-5 flex-shrink-0 ${rating < Math.floor(rating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-200'
                                }`}
                            aria-hidden="true"
                        />
                    ))}
                </div>
                <p className="ml-2 text-sm text-gray-500">{reviewCount} reviews</p>
            </div>
        </div>
    );
} 