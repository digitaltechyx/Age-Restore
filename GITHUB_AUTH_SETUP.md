# 🔐 GitHub Authentication Setup

## **Issue:** Permission Denied
You're trying to push to `digitaltechyx/Age-Restore` but authenticated as `ZainSheikh0308`.

## **Solution Options:**

### **Option 1: Use Personal Access Token (Recommended)**

1. **Create Personal Access Token:**
   - Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
   - Click **"Generate new token (classic)"**
   - Give it a name: "Age-Restore Deployment"
   - Select scopes: **repo** (full control of private repositories)
   - Click **"Generate token"**
   - **Copy the token** (you won't see it again!)

2. **Use Token for Authentication:**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/digitaltechyx/Age-Restore.git
   git push -u origin main
   ```

### **Option 2: Create New Repository Under Your Account**

1. **Create new repository:**
   - Go to [GitHub](https://github.com)
   - Click **"New repository"**
   - Name: `Age-Restore`
   - Make it **Public**
   - Don't initialize with README
   - Click **"Create repository"**

2. **Update remote:**
   ```bash
   git remote set-url origin https://github.com/ZainSheikh0308/Age-Restore.git
   git push -u origin main
   ```

### **Option 3: Transfer Repository (If you own digitaltechyx account)**

1. Go to repository settings
2. Scroll to "Danger Zone"
3. Click "Transfer ownership"
4. Enter `ZainSheikh0308` as new owner

## **Recommended Next Steps:**

1. **Choose Option 1 or 2** above
2. **Follow the authentication steps**
3. **Push your code**
4. **Proceed with Vercel deployment**

---

**Which option would you like to use?**
