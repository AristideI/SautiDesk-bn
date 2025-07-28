# 🚀 SautiDesk Backend

Welcome to the **SautiDesk Backend**, a powerful AI-driven customer support platform designed for resource-constrained environments. This backend is built using [Strapi](https://strapi.io/) and supports SQLite as the database and Cloudinary for media storage.

> 📍 Frontend repository: [SautiDesk Frontend](https://github.com/AristideI/SautiDesk-fn)

---

## 📝 Project Description

**SautiDesk** is an intelligent customer support solution that leverages voice analytics and ticket classification to streamline communication in sectors like education, telecom, and public services. This backend manages content, user roles, authentication, ticket lifecycle, and more.

---

## 📦 Tech Stack

- **Backend Framework:** Strapi v5
- **Database:** SQLite (better-sqlite3)
- **Media Storage:** Cloudinary
- **Language:** JavaScript (Node.js)
- **Authentication:** Role-based via `@strapi/plugin-users-permissions`

---

## 📂 Getting Started

### 📁 Clone the Repository

```bash
git clone https://github.com/AristideI/SautiDesk-bn.git
cd SautiDesk-bn
```

## ⚙️ Environment Configuration

Create a .env file in the root directory with the following configuration:

```env
# Database Configuration (SQLite)
DATABASE_FILENAME=.tmp/data.db

# App Keys (generate these for production)
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt-here
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
JWT_SECRET=your-jwt-secret-here
TRANSFER_TOKEN_SALT=your-transfer-token-salt-here
ENCRYPTION_KEY=your-encryption-key-here

# Host and Port
HOST=0.0.0.0
PORT=1337

# Environment
NODE_ENV=development

# Cloudinary Configuration (for media storage)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-key
CLOUDINARY_SECRET=your-cloudinary-secret
```

## 📥 Install Dependencies

```bash
npm install
# or
yarn install
```

## ⚙️ Quick Setup

Run the setup script to automatically create your `.env` file with generated keys:

```bash
npm run setup
# or
yarn setup
```

This will:
- Create the `.tmp` directory for the SQLite database
- Generate a `.env` file with secure random keys
- Set up the basic configuration for development

**Note:** You'll still need to update the Cloudinary credentials in the `.env` file.

## 🚧 Development

Start the development server with hot reload:

```bash
npm run develop
# or
yarn develop
```

## 🚀 Production

### 🛠 Build the Admin Panel

```bash
npm run build
# or
yarn build
```

## 🔥 Start the Production Server

```bash
npm run start
# or
yarn start
```

## 🚚 Deployment

To deploy with supported platforms (Strapi Cloud, Heroku, Render, etc.):

```bash
npx strapi deploy
```

Refer to the Strapi deployment docs for advanced options.

## 🗃 Database

This project uses SQLite as the database, which is perfect for development and small to medium production deployments. The database file will be created automatically at `.tmp/data.db` when you first start the application.

### Database Features:
- **Zero Configuration:** No need to install or configure a separate database server
- **File-based:** The entire database is stored in a single file
- **Portable:** Easy to backup and move between environments
- **Production Ready:** SQLite can handle moderate traffic loads efficiently

### For Production:
If you need to scale to handle high traffic, consider migrating to PostgreSQL or MySQL. The database schema and migrations will work across different database types.

## ☁️ Cloudinary Storage

Media uploads are handled through Cloudinary. Configure your Cloudinary keys in the .env:

```env
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
```

## 📜 Scripts

```json
"scripts": {
  "build": "strapi build",
  "console": "strapi console",
  "deploy": "strapi deploy",
  "dev": "strapi develop",
  "develop": "strapi develop",
  "setup": "node ./scripts/setup-env.js",
  "seed:example": "node ./scripts/seed.js",
  "start": "strapi start",
  "strapi": "strapi",
  "upgrade": "npx @strapi/upgrade latest",
  "upgrade:dry": "npx @strapi/upgrade latest --dry"
}
```
