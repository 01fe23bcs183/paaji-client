# 🚀 XAMPP + MySQL Setup Guide

## ✨ Quick Setup for XAMPP Users

Since you're using XAMPP, the setup is super easy! Follow these steps:

---

## Step 1: Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Start **Apache** (for phpMyAdmin)
3. Start **MySQL** (for the database)

Both should show green "Running" status.

---

## Step 2: Create Database

### **Option A: Using phpMyAdmin (Easier)**

1. Open browser and go to: **<http://localhost/phpmyadmin>**
2. Click on **"New"** in the left sidebar
3. Enter database name: `jmc_ecommerce`
4. Click **"Create"**

✅ That's it! The database is ready.

### **Option B: Using SQL Command**

In phpMyAdmin SQL tab, run:

```sql
CREATE DATABASE jmc_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Step 3: Setup Backend

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

---

## Step 4: Configure .env File

Open `server/.env` and use these **XAMPP default values**:

```env
# Server
PORT=5000
NODE_ENV=development

# MySQL (XAMPP Defaults - No password!)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=jmc_ecommerce
DB_USER=root
DB_PASSWORD=

# JWT Secret (change this!)
JWT_SECRET=my-super-secret-key-12345

# Frontend
FRONTEND_URL=http://localhost:5173
```

**⚠️ Important:** Leave `DB_PASSWORD=` empty (blank) - XAMPP's default root has no password!

---

## Step 5: Start Backend Server

```bash
cd server
npm run dev
```

You should see:

```
✅ MySQL database connected successfully
✅ Database models synchronized
🚀 Server running on port 5000 in development mode
📊 Using MySQL database
```

---

## Step 6: Verify Everything Works

### **Test 1: Health Check**

Open browser: **<http://localhost:5000/api/health>**

Should return:

```json
{
  "status": "ok",
  "timestamp": "2026-01-04...",
  "environment": "development",
  "database": "MySQL"
}
```

### **Test 2: Check Database Tables**

Go to **phpMyAdmin → jmc_ecommerce database**

You should see **4 tables** automatically created:

- `users`
- `products`
- `orders`
- `reviews`

---

## 🎯 Your Complete Setup

Now you have:

### **Frontend (Already Running)**

- URL: <http://localhost:5173>
- Status: ✅ Running

### **Backend (New!)**

- URL: <http://localhost:5000>
- Database: MySQL via XAMPP
- Status: ✅ Ready to start

### **Database**

- Type: MySQL (via XAMPP)
- Name: jmc_ecommerce
- phpMyAdmin: <http://localhost/phpmyadmin>
- Status: ✅ Created

---

## 🔍 Troubleshooting

### **Issue: "Access denied for user 'root'@'localhost'"**

**Solution:** XAMPP root password might be set. In `.env`, try:

```env
DB_PASSWORD=
```

If still fails, reset MySQL password in XAMPP.

### **Issue: "Can't connect to MySQL server"**

**Solution:**

1. Open XAMPP Control Panel
2. Make sure MySQL is running (green)
3. Try restarting MySQL service

### **Issue: Port 5000 already in use**

**Solution:** Change PORT in `.env`:

```env
PORT=5001
```

---

## 📊 View Your Data

### **Using phpMyAdmin:**

1. Go to <http://localhost/phpmyadmin>
2. Click `jmc_ecommerce` database
3. Browse tables to see your data

### **Useful SQL Queries:**

```sql
-- View all users
SELECT * FROM users;

-- View all products
SELECT * FROM products;

-- View all orders
SELECT * FROM orders ORDER BY createdAt DESC;

-- Count total orders
SELECT COUNT(*) as total_orders FROM orders;
```

---

## 🚀 Next Steps

1. **Start Frontend:**

   ```bash
   npm run dev
   ```

2. **Start Backend:**

   ```bash
   cd server
   npm run dev
   ```

3. **Test the full stack:**
   - Frontend will connect to backend
   - Backend will store data in MySQL
   - You can view data in phpMyAdmin

---

## 💡 Pro Tips

### **Keep XAMPP Running**

Always keep MySQL running in XAMPP while developing.

### **Backup Your Database**

In phpMyAdmin:

1. Go to `jmc_ecommerce`
2. Click **"Export"**
3. Click **"Go"**
4. Save the `.sql` file

### **Reset Database**

If you need to start fresh:

```sql
DROP DATABASE jmc_ecommerce;
CREATE DATABASE jmc_ecommerce;
```

Then restart the backend server - tables will be recreated automatically!

---

## ✅ Verification Checklist

- [ ] XAMPP MySQL is running (green in control panel)
- [ ] Database `jmc_ecommerce` exists (check in phpMyAdmin)
- [ ] `.env` file created with XAMPP defaults
- [ ] Backend dependencies installed (`npm install` in server/)
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Health check works (<http://localhost:5000/api/health>)
- [ ] 4 tables created automatically in phpMyAdmin

---

**All set! Your MySQL backend is ready to use with XAMPP! 🎉**
