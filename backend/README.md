# Backend - Zen Home

This is the backend for the Zen Home application, built using **Node.js, Express, TypeScript, Prisma, and PostgreSQL**.

## 🚀 **Getting Started**

### **1. Prerequisites**

- [Node.js](https://nodejs.org/en/download/) installed
- PostgreSQL installed and running
- [Prisma CLI](https://www.prisma.io/docs/getting-started/quickstart) installed (`npm install -g prisma`)

### **2. Installation**

Navigate to the `backend` folder:

```bash
git clone https://github.com/mirage-p/Zen-Home.git
cd Zen-Home/backend
```

Install Dependencies

```bash
npm install
```

### **3. Set Up Environment Variables**

Rename .env.example to .env and update it with your database credentials:

```bash
cp .env.example .env
```

### **4. Apply Database Migrations**

```bash
npx prisma migrate dev --name init
```

### **5. Start the Server**

Start the development server

```bash
npm install
```

or build and run:

```bash
npm run build
npm start
```

## 🛠 \*\*Tools & Technologies

- Express.js - Backend framework

- TypeScript - Typed JavaScript

- Prisma - ORM for PostgreSQL

- PostgreSQL - Relational database

- dotenv - Environment variable management
