# 🔑 Skill Forge - Demo Login Credentials

## 🌐 Access the Application
**URL:** http://localhost:5173/

---

## 👥 Demo Accounts

### 🔐 ADMIN PANEL
```
Email:    admin@skillforge.com
Password: admin123
```
**Features to Test:**
- View platform statistics (10 users, 6 courses)
- Manage users (view, ban, change roles)
- Approve instructor applications (2 pending)
- Moderate courses (1 pending approval)
- Create announcements

---

### 👨‍🎓 STUDENT ACCOUNTS

#### Student 1: John Doe
```
Email:    john@student.com
Password: password123
```
**Profile:**
- 3 enrolled courses
- 1 completed course (Modern JavaScript ES6+)
- 1 certificate issued
- 45% progress on Web Development Bootcamp

#### Student 2: Sarah Wilson
```
Email:    sarah@student.com
Password: password123
```
**Profile:**
- 3 enrolled courses
- 1 completed course (Python for Data Science & ML)
- 1 certificate issued
- 75% progress on Web Development Bootcamp

#### Student 3: Mike Chen
```
Email:    mike@student.com
Password: password123
```
**Profile:**
- 2 enrolled courses
- 60% progress on Python for Data Science

#### Student 4: Emma Davis
```
Email:    emma@student.com
Password: password123
```
**Profile:**
- 2 enrolled courses
- 85% progress on Modern JavaScript ES6+

#### Student 5: David Kim
```
Email:    david@student.com
Password: password123
```
**Profile:**
- 2 enrolled courses
- 55% progress on Node.js & Express API

---

### 👨‍🏫 INSTRUCTOR ACCOUNTS

#### Instructor 1: Dr. Emily Rodriguez ✅ (Approved)
```
Email:    emily@instructor.com
Password: password123
```
**Profile:**
- 3 published courses
- 2,855 total students
- 4.8⭐ rating
- Expertise: Web Development, React, Node.js

**Courses:**
1. Complete Web Development Bootcamp 2024 (1,234 students)
2. Advanced React & Redux Masterclass (856 students)
3. Modern JavaScript ES6+ (765 students)

#### Instructor 2: Prof. James Thompson ✅ (Approved)
```
Email:    james@instructor.com
Password: password123
```
**Profile:**
- 2 published courses
- 1,630 total students
- 4.7⭐ rating
- Expertise: Backend Development, Python, Data Science

**Courses:**
1. Node.js & Express API Development (643 students)
2. Python for Data Science & Machine Learning (987 students)

#### Instructor 3: Maria Garcia ⏳ (Pending Approval)
```
Email:    maria@instructor.com
Password: password123
Status:   ❌ CANNOT LOGIN (Awaiting admin approval)
```
**Profile:**
- 1 unpublished course (UI/UX Design Fundamentals)
- Pending instructor approval
- Bio: UX/UI Designer with 8 years experience

**Note:** This account demonstrates the instructor approval workflow. Login will fail until admin approves.

#### Instructor 4: Dr. Alex Johnson ⏳ (Pending Approval)
```
Email:    alex@instructor.com
Password: password123
Status:   ❌ CANNOT LOGIN (Awaiting admin approval)
```
**Profile:**
- No courses yet (newly joined)
- Pending instructor approval
- Bio: Senior Software Engineer at Google

---

## 📊 Platform Statistics

### Data Overview
- **Total Users:** 10 (5 students, 4 instructors, 1 admin)
- **Total Courses:** 6 (5 published, 1 pending)
- **Total Enrollments:** 12
- **Certificates Issued:** 2
- **Announcements:** 6
- **Pending Instructor Approvals:** 2 (Maria Garcia, Dr. Alex Johnson)
- **Pending Course Approvals:** 1 (UI/UX Design Fundamentals)

---

## 🎯 Testing Scenarios

### Scenario 1: Student Experience
1. Login as `john@student.com`
2. View dashboard → See 3 enrolled courses
3. Check "My Certificates" → Download certificate
4. Click "Continue Learning" → Resume from lesson 6
5. View profile → See complete student information

### Scenario 2: Instructor Analytics
1. Login as `emily@instructor.com`
2. View dashboard → See 3 courses with analytics
3. Check total students (2,855) and revenue
4. View individual course performance
5. Update profile with new bio/expertise

### Scenario 3: Admin Management
1. Login as `admin@skillforge.com`
2. Dashboard → View platform statistics
3. Go to "Instructor Approvals" → See 2 pending (Maria, Alex)
4. Go to "Course Moderation" → See 1 pending course
5. Go to "User Management" → View all 10 users
6. Test user ban/role change functionality

### Scenario 4: Approval Workflow
1. Try login as `maria@instructor.com` → See "Pending approval" error
2. Login as `admin@skillforge.com`
3. Go to Instructor Approvals
4. Approve Maria Garcia
5. Logout and login as Maria → Should work now

---

## 📚 Available Courses

1. **Complete Web Development Bootcamp 2024**
   - Instructor: Dr. Emily Rodriguez
   - Price: $89.99 | Level: Beginner | 40 hours
   - 1,234 students | 4.8⭐

2. **Advanced React & Redux Masterclass**
   - Instructor: Dr. Emily Rodriguez
   - Price: $79.99 | Level: Advanced | 30 hours
   - 856 students | 4.9⭐

3. **Node.js & Express API Development**
   - Instructor: Prof. James Thompson
   - Price: $69.99 | Level: Intermediate | 25 hours
   - 643 students | 4.7⭐

4. **UI/UX Design Fundamentals** ⏳ (Pending)
   - Instructor: Maria Garcia
   - Price: $59.99 | Level: Beginner | 20 hours
   - 421 students | 4.6⭐ | Status: Pending Approval

5. **Python for Data Science & Machine Learning**
   - Instructor: Prof. James Thompson
   - Price: $94.99 | Level: Intermediate | 45 hours
   - 987 students | 4.8⭐

6. **Modern JavaScript ES6+**
   - Instructor: Dr. Emily Rodriguez
   - Price: $49.99 | Level: Beginner | 18 hours
   - 765 students | 4.7⭐

---

## 🎓 Issued Certificates

1. **John Doe** - Modern JavaScript ES6+
   - Verification Code: SF-2024-001-JD
   - Issued: Feb 28, 2024

2. **Sarah Wilson** - Python for Data Science & ML
   - Verification Code: SF-2024-002-SW
   - Issued: Mar 10, 2024

---

## 📢 Platform Announcements

1. **Platform Maintenance Scheduled** (High Priority)
2. **New Courses Available!** (Medium Priority)
3. **Certificate Download Feature** (Low Priority)
4. **Instructor Payout Updates** (Medium Priority)
5. **Welcome to Skill Forge!** (Low Priority)
6. **New Analytics Dashboard for Instructors** (Medium Priority)

---

## 🔧 Technical Notes

- All data is **mock/demo data** stored in `/src/data/` directory
- No backend required - uses local `AuthContext` with fake JWT
- Data persists in browser `localStorage` during session
- **Page refresh clears non-authenticated state**
- All passwords are intentionally simple for demo purposes
- Profile images use Dicebear API for consistent avatars

---

## 🚀 Quick Start Guide

1. **Start Server:** `npm run dev`
2. **Open Browser:** http://localhost:5173/
3. **Try Admin Login:** admin@skillforge.com / admin123
4. **Explore Features:** Dashboard, users, courses, approvals
5. **Test Student View:** Login as john@student.com
6. **Test Instructor View:** Login as emily@instructor.com

---

**Last Updated:** March 23, 2024
**Version:** 1.0
**Status:** ✅ Ready for Demo/Testing
