# RiderSafe Setup Instructions

## Prerequisites

- Node.js 18+
- MongoDB Database (e.g., MongoDB Atlas)
- SMTP Server details (for Email OTPs, e.g., Resend, Sendgrid, or Gmail App Passwords)

## Setup Steps

1. **Environment Variables**
   Create a `.env` file in the root directory based on the following template:

   ```env
   # Database connection string
   DATABASE_URL="mongodb+srv://<user>:<password>@cluster0.mongodb.net/ridersafe"

   # NextAuth
   AUTH_SECRET="your-generated-secret" # Run `npx auth secret` to generate

   # Email Configuration (Nodemailer)
   EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
   EMAIL_FROM="noreply@ridersafe.app"
   ```

2. **Generate Auth Secret**
   Run the following command to securely generate `AUTH_SECRET`:

   ```bash
   npx auth secret
   ```

3. **Prisma Setup**
   Push the schema definitions to your MongoDB instance and generate the Prisma client:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

## Usage

- **Login**: Go to `http://localhost:3000/api/auth/signin` or `http://localhost:3000/dashboard` and enter your email address to receive an OTP/Magic Link.
- **Manage Profile**: Upon successful login, you will be redirected to the Dashboard where you can update your basic details, emergency contacts, and up to 10 dynamic custom fields.
- **QR Sticker**: Once your profile is saved, the QR Sticker Builder will appear allowing you to customize and print your sticker.
- **Public Profile**: Scan the QR code or visit `http://localhost:3000/r/[your-slug]` to view the public emergency profile layout.
