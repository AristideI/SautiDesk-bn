#!/usr/bin/env node

const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

/**
 * Generate a random string for app keys and secrets
 * @param {number} length - Length of the string to generate
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

/**
 * Generate app keys (comma-separated for multiple keys)
 * @returns {string} Comma-separated app keys
 */
const generateAppKeys = () => {
  return Array.from({ length: 2 }, () => generateRandomString()).join(",");
};

/**
 * Create .env file with SQLite configuration
 */
const createEnvFile = () => {
  const envPath = path.join(process.cwd(), ".env");

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log("⚠️  .env file already exists. Skipping creation.");
    return;
  }

  const envContent = `# Database Configuration (SQLite)
DATABASE_FILENAME=.tmp/data.db

# App Keys (auto-generated)
APP_KEYS=${generateAppKeys()}
API_TOKEN_SALT=${generateRandomString()}
ADMIN_JWT_SECRET=${generateRandomString()}
JWT_SECRET=${generateRandomString()}
TRANSFER_TOKEN_SALT=${generateRandomString()}
ENCRYPTION_KEY=${generateRandomString()}

# Host and Port
HOST=0.0.0.0
PORT=1337

# Environment
NODE_ENV=development

# Cloudinary Configuration (update with your credentials)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-key
CLOUDINARY_SECRET=your-cloudinary-secret
`;

  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env file created successfully!");
  console.log("📝 Please update the Cloudinary credentials in the .env file.");
};

/**
 * Create .tmp directory for SQLite database
 */
const createTmpDirectory = () => {
  const tmpPath = path.join(process.cwd(), ".tmp");

  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath, { recursive: true });
    console.log("✅ .tmp directory created for SQLite database");
  } else {
    console.log("ℹ️  .tmp directory already exists");
  }
};

// Main execution
console.log("🚀 Setting up SautiDesk environment for SQLite...\n");

try {
  createTmpDirectory();
  createEnvFile();

  console.log("\n🎉 Environment setup complete!");
  console.log("\nNext steps:");
  console.log("1. Update Cloudinary credentials in .env file");
  console.log("2. Run: npm install");
  console.log("3. Run: npm run develop");
  console.log("\n📚 For more information, see README.md");
} catch (error) {
  console.error("❌ Error setting up environment:", error.message);
  process.exit(1);
}
