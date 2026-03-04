# RiderSafe

RiderSafe is a full-stack Next.js web application designed to help motorcycle and bicycle riders stay safe. It allows users to create customizable emergency profiles and generate print-ready QR code stickers to place on their helmets or bikes.

If a rider is in an accident, first responders can scan the QR code to instantly access the rider's critical medical information and emergency contacts.

## Features

- **User Authentication**: Secure login flow using NextAuth.
- **Dynamic Emergency Profiles**: Store essential health information, blood type, and emergency contact numbers.
- **Custom QR Creator Studio**: A fully-featured drag-and-drop canvas studio to design your own QR stickers. Configure colors, add text, import custom background images, and export as high-resolution PNGs.
- **Admin Dashboard**: Bulk QR generation system for printing pre-made stickers that can be claimed later by new users.

## Technology Stack

- Next.js (App Router)
- React
- Prisma ORM
- TailwindCSS & shadcn/ui
- react-rnd (Drag & Drop Canvas)
- html-to-image (High-resolution export)

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Set up your `.env` file with your Database and Auth configurations, then run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
