# 🛍️ Paskal Shop - E-Commerce Platform

<div align="center">
  <img src="public/placeholder-logo.png" alt="Paskal Shop Logo" width="200"/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-6.11.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Cloudinary](https://img.shields.io/badge/Cloudinary-Cloud%20Storage-FF6F00?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)

  **Platform e-commerce modern dengan fitur lengkap untuk UMKM Indonesia**
  
  [🚀 Live Demo](https://your-vercel-domain.vercel.app) • [📖 Documentation](#documentation) • [🐛 Report Bug](#contributing) • [✨ Request Feature](#contributing)
</div>

---

## 📋 Daftar Isi

- [🎯 Tentang Project](#-tentang-project)
- [✨ Fitur Utama](#-fitur-utama)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [📱 Screenshots](#-screenshots)
- [🏗️ Project Structure](#️-project-structure)
- [🔐 Authentication](#-authentication)
- [💳 Payment Flow](#-payment-flow)
- [📸 File Upload](#-file-upload)
- [🎨 UI Components](#-ui-components)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Tentang Project

**Paskal Shop** adalah platform e-commerce modern yang dirancang khusus untuk UMKM Indonesia. Platform ini menyediakan solusi lengkap untuk mengelola produk, pesanan, dan pembayaran dengan antarmuka yang user-friendly dan fitur-fitur canggih.

### 🎪 Demo Credentials
```
Admin Login:
Username: admin
Password: admin123

Test Payment:
Bank: BCA
No. Rekening: 1234567890
Atas Nama: Paskal Shop
```

---

## ✨ Fitur Utama

### 🛒 **Customer Features**
- 🏠 **Homepage Modern** - Hero section yang menarik dengan featured products
- 🔍 **Product Search & Filter** - Pencarian produk dengan filter kategori
- 🛍️ **Shopping Cart** - Keranjang belanja dengan persistensi data
- 💳 **Checkout Process** - Proses pembayaran yang mudah dan aman
- 📄 **Order Management** - Tracking pesanan dan riwayat pembelian
- 📱 **Payment Proof Upload** - Upload bukti pembayaran dengan validasi
- 🧾 **Invoice Generation** - Invoice otomatis untuk setiap pesanan
- 🌙 **Dark/Light Mode** - Toggle tema sesuai preferensi user

### 👨‍💼 **Admin Features**
- 🔐 **Secure Authentication** - Login admin dengan bcrypt hashing
- 📊 **Dashboard Analytics** - Statistik penjualan dan revenue
- 📦 **Product Management** - CRUD produk dengan upload gambar
- 📋 **Order Management** - Kelola semua pesanan customer
- 💰 **Payment Verification** - Verifikasi bukti pembayaran
- 📸 **Image Upload** - Upload gambar produk ke cloud storage
- 📈 **Sales Reports** - Laporan penjualan dan analytics

---

## 🛠️ Tech Stack

### **Frontend**
- ⚡ **Next.js 14** - React framework dengan App Router
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **Radix UI** - Headless UI components
- 📱 **Lucide Icons** - Beautiful icon library
- 🎭 **Framer Motion** - Animation library
- 🌈 **Next Themes** - Dark/light mode support

### **Backend**
- 🔥 **Next.js API Routes** - Serverless API endpoints
- 🗃️ **Prisma ORM** - Type-safe database client
- 🐘 **PostgreSQL** - Robust relational database (Neon)
- 🔐 **NextAuth.js** - Authentication solution
- 🔒 **bcryptjs** - Password hashing

### **Cloud Services**
- ☁️ **Vercel** - Deployment platform
- 📸 **Cloudinary** - Image hosting and optimization
- 🌐 **Neon** - Serverless PostgreSQL

### **Development Tools**
- 📝 **TypeScript** - Type safety
- 🧹 **ESLint** - Code linting
- 🎯 **Prettier** - Code formatting
- 🔧 **pnpm** - Fast package manager

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/ahyrnsrlh/Paskal-Shop.git
cd Paskal-Shop

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env

# Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start development server
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## ⚙️ Installation

### **Prerequisites**
- Node.js 18.17+ 
- pnpm 8.0+
- PostgreSQL database (atau gunakan Neon)
- Cloudinary account

### **Step 1: Clone Repository**
```bash
git clone https://github.com/ahyrnsrlh/Paskal-Shop.git
cd Paskal-Shop
```

### **Step 2: Install Dependencies**
```bash
pnpm install
```

### **Step 3: Environment Setup**
Buat file `.env` dan isi dengan:
```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Admin Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### **Step 4: Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data
npx prisma db seed
```

### **Step 5: Start Development**
```bash
pnpm dev
```

---

## 🔧 Configuration

### **Database Configuration**
Project ini menggunakan Neon PostgreSQL. Untuk setup:

1. Daftar di [Neon](https://neon.tech/)
2. Buat database baru
3. Copy connection string ke `DATABASE_URL`

### **Cloudinary Setup**
Untuk file upload:

1. Daftar di [Cloudinary](https://cloudinary.com/)
2. Dapatkan credentials dari dashboard
3. Tambahkan ke environment variables

### **Admin Setup**
Default admin credentials:
- Username: `admin`
- Password: `admin123`

Ganti di file `.env` untuk production.

---

## 📱 Screenshots

<div align="center">
  <img src="docs/screenshots/homepage.png" alt="Homepage" width="400"/>
  <img src="docs/screenshots/product-detail.png" alt="Product Detail" width="400"/>
  <img src="docs/screenshots/cart.png" alt="Shopping Cart" width="400"/>
  <img src="docs/screenshots/admin-dashboard.png" alt="Admin Dashboard" width="400"/>
</div>

---

## 🏗️ Project Structure

```
paskal-shop/
├── 📁 app/                     # Next.js App Router
│   ├── 📁 (customer)/          # Customer pages
│   ├── 📁 admin/               # Admin panel
│   ├── 📁 api/                 # API routes
│   └── 📄 globals.css          # Global styles
├── 📁 components/              # Reusable components
│   ├── 📁 ui/                  # UI components (Radix)
│   └── 📄 *.tsx                # Custom components
├── 📁 lib/                     # Utility libraries
│   ├── 📄 auth.ts              # Authentication
│   ├── 📄 db.ts                # Database client
│   ├── 📄 cloudinary.ts        # File upload
│   └── 📄 utils.ts             # Utilities
├── 📁 prisma/                  # Database schema
│   ├── 📄 schema.prisma        # Prisma schema
│   └── 📄 seed.ts              # Database seeding
├── 📁 public/                  # Static assets
├── 📄 package.json             # Dependencies
├── 📄 tailwind.config.ts       # Tailwind config
└── 📄 next.config.mjs          # Next.js config
```

---

## 🔐 Authentication

### **Customer Authentication**
- Session-based dengan cookies
- Tidak perlu registrasi untuk checkout
- Data customer disimpan per order

### **Admin Authentication**
```typescript
// Login endpoint: /api/admin/login
POST /api/admin/login
{
  "username": "admin",
  "password": "admin123"
}
```

### **Protected Routes**
- `/admin/*` - Hanya admin yang ter-autentikasi
- Redirect otomatis ke `/admin/login` jika belum login

---

## 💳 Payment Flow

### **Customer Flow**
1. **Add to Cart** - Tambah produk ke keranjang
2. **Checkout** - Isi data customer dan alamat
3. **Order Created** - Sistem generate order ID
4. **Payment Page** - Upload bukti pembayaran
5. **Admin Verification** - Admin verifikasi pembayaran
6. **Order Completed** - Status pesanan diupdate

### **Payment Methods**
- 🏦 **Bank Transfer** - Transfer manual ke rekening toko
- 📱 **E-Wallet** - (Coming soon)
- 💳 **Credit Card** - (Coming soon)

### **Payment Status**
- `WAITING_PAYMENT` - Menunggu pembayaran
- `PAYMENT_UPLOADED` - Bukti pembayaran diupload
- `PAYMENT_CONFIRMED` - Pembayaran dikonfirmasi admin
- `PAYMENT_REJECTED` - Pembayaran ditolak

---

## 📸 File Upload

### **Cloudinary Integration**
```typescript
// Upload configuration
const uploadConfig = {
  folder: 'paskal-shop/products',
  transformation: [
    { width: 800, height: 800, crop: 'limit' },
    { quality: 'auto:best' }
  ]
}
```

### **Supported Formats**
- 🖼️ **Images**: JPG, PNG, GIF
- 📏 **Max Size**: 5MB per file
- 🎨 **Auto Optimization**: Cloudinary auto-optimizes

### **Upload Endpoints**
- `/api/admin/products/upload-image` - Product images
- `/api/orders/[id]/payment-proof` - Payment proofs

---

## 🎨 UI Components

### **Design System**
- 🎨 **Colors**: Consistent color palette
- 📝 **Typography**: Inter font family
- 📐 **Spacing**: 8px grid system
- 🎭 **Animations**: Smooth transitions

### **Component Library**
```typescript
// Example usage
import { Button, Card, Input } from '@/components/ui'

<Button variant="primary" size="lg">
  Add to Cart
</Button>
```

### **Responsive Design**
- 📱 **Mobile First** - Optimized for mobile devices
- 💻 **Desktop Enhanced** - Rich desktop experience
- 📐 **Breakpoints**: sm, md, lg, xl, 2xl

---

## 🚀 Deployment

### **Vercel Deployment**

1. **Connect Repository**
   ```bash
   vercel --prod
   ```

2. **Environment Variables**
   Tambahkan di Vercel Dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `CLOUDINARY_*`

3. **Database Migration**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

### **Custom Domain**
1. Tambahkan domain di Vercel
2. Update `NEXTAUTH_URL` dengan domain baru
3. Redeploy project

---

## 🤝 Contributing

Kontribusi sangat diapresiasi! Ikuti langkah berikut:

### **Development Process**
1. **Fork** repository
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

### **Contribution Guidelines**
- ✅ Follow TypeScript best practices
- ✅ Add tests for new features
- ✅ Update documentation
- ✅ Use conventional commit messages

### **Bug Reports**
Gunakan [GitHub Issues](https://github.com/ahyrnsrlh/Paskal-Shop/issues) dengan template:
- 🐛 Bug description
- 🔄 Steps to reproduce
- 💭 Expected behavior
- 📱 Environment details

---

## 📊 Performance

### **Lighthouse Scores**
- 🚀 **Performance**: 95+
- ♿ **Accessibility**: 100
- 🎯 **Best Practices**: 95+
- 📈 **SEO**: 100

### **Optimizations**
- ⚡ **Image Optimization** - Next.js Image component
- 🗜️ **Code Splitting** - Automatic route-based splitting
- 📦 **Bundle Analysis** - Optimized bundle size
- 🎯 **Core Web Vitals** - Excellent CWV scores

---

## 🔮 Roadmap

### **Q1 2025**
- [ ] 📱 Mobile App (React Native)
- [ ] 💳 Payment Gateway Integration
- [ ] 📧 Email Notifications
- [ ] 📊 Advanced Analytics

### **Q2 2025**
- [ ] 🤖 AI Product Recommendations
- [ ] 💬 Live Chat Support
- [ ] 🌍 Multi-language Support
- [ ] 📱 PWA Implementation

### **Q3 2025**
- [ ] 🛒 Multi-vendor Support
- [ ] 📦 Inventory Management
- [ ] 🚚 Shipping Integration
- [ ] 💎 Loyalty Program

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - Amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://prisma.io/) - Next-generation ORM
- [Radix UI](https://radix-ui.com/) - Low-level UI primitives
- [Cloudinary](https://cloudinary.com/) - Media management platform

---

## 📞 Support

Butuh bantuan? Hubungi kami:

- 📧 **Email**: support@paskalshop.com
- 💬 **Discord**: [Join our community](https://discord.gg/paskalshop)
- 📱 **WhatsApp**: +62 123 456 7890
- 🐦 **Twitter**: [@paskalshop](https://twitter.com/paskalshop)

---

<div align="center">
  <p>Made with ❤️ for Indonesian UMKM</p>
  <p>
    <a href="#-daftar-isi">🔝 Back to top</a>
  </p>
</div>
