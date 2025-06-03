# 🚀 SautiDesk Backend

Welcome to the **SautiDesk Backend**, a powerful AI-driven customer support platform designed for resource-constrained environments. This backend is built using [Strapi](https://strapi.io/) and supports PostgreSQL as the database and Cloudinary for media storage.

> 📍 Frontend repository: [SautiDesk Frontend](https://github.com/AristideI/SautiDesk-fn)

---

## 📝 Project Description

**SautiDesk** is an intelligent customer support solution that leverages voice analytics and ticket classification to streamline communication in sectors like education, telecom, and public services. This backend manages content, user roles, authentication, ticket lifecycle, and more.

---

## 📦 Tech Stack

- **Backend Framework:** Strapi v5
- **Database:** PostgreSQL
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

Create a .env file by copying the .env.example:

```bash
cp .env.example .env
```

### Update the .env with your credentials:

- PostgreSQL connection
- Cloudinary API keys
- JWT secret
- Admin panel URL

## 📥 Install Dependencies

```bash
npm install
# or
yarn install
```

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

Ensure PostgreSQL is properly configured with the values from your .env. If deploying, provision a production PostgreSQL database.

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
  "seed:example": "node ./scripts/seed.js",
  "start": "strapi start",
  "strapi": "strapi",
  "upgrade": "npx @strapi/upgrade latest",
  "upgrade:dry": "npx @strapi/upgrade latest --dry"
}
```
