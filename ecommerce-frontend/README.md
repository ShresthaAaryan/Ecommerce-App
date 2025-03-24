# E-Commerce Frontend

A modern e-commerce frontend built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Modern and responsive design
- User authentication (login/register)
- Product browsing and search
- Shopping cart functionality
- Order management
- User profile
- Product reviews

## Prerequisites

- Node.js 18.x or later
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following environment variables:
```env
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:3004
NEXT_PUBLIC_CART_SERVICE_URL=http://localhost:3005
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=http://localhost:3006
NEXT_PUBLIC_REVIEW_SERVICE_URL=http://localhost:3007
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
ecommerce-frontend/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── products/          # Product pages
│   ├── cart/              # Cart page
│   ├── profile/           # User profile page
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── public/                # Static assets
└── styles/               # Global styles
```

## API Integration

The frontend integrates with the following microservices:

- User Service (Port 3001)
- Product Service (Port 3002)
- Order Service (Port 3003)
- Payment Service (Port 3004)
- Cart Service (Port 3005)
- Notification Service (Port 3006)
- Review Service (Port 3007)

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Headless UI](https://headlessui.dev/) - UI components
- [Heroicons](https://heroicons.com/) - Icons
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications
- [Zustand](https://github.com/pmndrs/zustand) - State management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 