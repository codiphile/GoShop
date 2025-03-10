# GoShop - Ecommerce

This is a modern e-commerce application built with [Next.js](https://nextjs.org/), leveraging server-side rendering and dynamic imports for optimal performance.

## Features

- **Dynamic Product Listings**: Fetch and display products dynamically from Firestore.
- **Animated UI**: Smooth animations using Framer Motion.
- **Responsive Design**: Fully responsive design for all devices.
- **Customer Reviews**: Display customer reviews.
- **Brand Showcases**: Highlight different brands.
- **Collections and Categories**: Organized product collections and categories.

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/yourusername/ecommerce.git
cd ecommerce
```

Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```env
NEXT_PUBLIC_DOMAIN=yourdomain.com
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

## Project Structure

- `app/page.js`: Main page of the application.
- `components/`: Contains all the React components used in the application.
- `lib/firestore/`: Firestore utility functions for fetching data.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

This project is licensed under the MIT License.
