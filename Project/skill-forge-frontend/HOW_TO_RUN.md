# 🚀 How to Run Skill Forge

Quick guide to running the Skill Forge LMS application on your local machine.

---

## 📋 Prerequisites

Make sure you have installed:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Edge, Safari)

**Check if installed:**
```bash
node --version   # Should show v16 or higher
npm --version    # Should show 7 or higher
```

---

## 🏃 Quick Start (3 Steps)

### **Step 1: Install Dependencies** (First time only)
```bash
npm install
```
- Downloads all required packages (~2-3 minutes)
- Creates `node_modules/` folder
- Only needs to be done once

### **Step 2: Start Development Server**
```bash
npm run dev
```
- Starts the Vite development server
- Application will be available at: **http://localhost:5173/**
- Server runs in the terminal (keep it open)

### **Step 3: Open in Browser**
- Navigate to: **http://localhost:5173/**
- The landing page should load automatically

---

## 🔑 Demo Login Accounts

### Admin Account
```
Email:    admin@skillforge.com
Password: admin123
```
**Features:** View analytics, manage users, approve instructors

### Student Account
```
Email:    john@student.com
Password: password123
```
**Features:** Browse courses, watch videos, take quizzes, download certificates

### Instructor Account
```
Email:    emily@instructor.com
Password: password123
```
**Features:** Create courses, manage lessons, build quizzes

**More accounts:** See `docs/guides/DEMO_CREDENTIALS.md` for full list

---

## 🛑 Stopping the Server

When you're done:
1. Go to the terminal where `npm run dev` is running
2. Press **Ctrl + C**
3. Confirm with **Y** if prompted

---

## 🔧 Alternative Commands

### Build for Production
```bash
npm run build
```
Creates optimized production build in `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing

### Run Linter
```bash
npm run lint
```
Checks code for errors and style issues

---

## 📱 Access from Mobile/Other Devices

When the dev server starts, you'll see:
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

Use the **Network** URL to access from:
- Your phone (on same WiFi)
- Other computers on your network

---

## ⚠️ Common Issues & Solutions

### Issue: "npm: command not found"
**Solution:** Node.js is not installed. Download from [nodejs.org](https://nodejs.org/)

### Issue: Port 5173 already in use
**Solution:** 
- Option 1: Stop the other process using port 5173
- Option 2: Vite will automatically try port 5174, 5175, etc.

### Issue: Blank white screen
**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Hard refresh: **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)

### Issue: Changes not showing
**Solution:**
- Hard refresh: **Ctrl + Shift + R**
- Clear browser cache
- Restart dev server (Ctrl+C, then `npm run dev` again)

### Issue: "Module not found" errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 What to Test

### As a Student:
1. Browse courses on catalog page
2. Click a course to see details
3. Enroll in a course (requires login)
4. Watch video lessons
5. Take the course quiz
6. Download your certificate

### As an Instructor:
1. View your dashboard
2. Create a new course
3. Add modules and lessons
4. Upload course thumbnail
5. Build a quiz with questions
6. View course statistics

### As an Admin:
1. View platform dashboard
2. Browse user management
3. Check instructor approvals
4. Review course moderation

---

## 📚 Additional Resources

- **Full Documentation:** See `README.md`
- **Project Summary:** See `PROJECT_SUMMARY.md`
- **Demo Credentials:** See `docs/guides/DEMO_CREDENTIALS.md`
- **Folder Structure:** See `docs/guides/FOLDER_STRUCTURE.md`

---

## 🆘 Getting Help

1. Check the documentation files listed above
2. Review error messages in the browser console (F12)
3. Search the error message online
4. Contact: Bilal Shabbir & Maira Fatima

---

## 💡 Pro Tips

- **Auto-open browser:** Some systems auto-open the URL when server starts
- **Hot reload:** Save any file and see changes instantly (no refresh needed)
- **Multiple browsers:** Test in different browsers simultaneously
- **Network access:** Share the Network URL with team members for testing
- **Keep terminal open:** Don't close the terminal window while testing

---

**Happy testing! 🎉**

*Last updated: April 6, 2026*
