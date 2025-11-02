# How to Deploy This Project to GitHub Pages

This guide will walk you through deploying your Personal Recipe Book application to GitHub Pages, making it a live website accessible to anyone.

**Your Live Site URL will be: https://fsiceangel.github.io/CookingRecipe**

---

### Prerequisites

1.  **Node.js and npm:** You must have Node.js and npm installed. (You've done this already).
2.  **Git:** You must have Git installed. You can get it from [git-scm.com](https://git-scm.com/downloads).
3.  **Code Editor:** A code editor like VS Code.
4.  **Terminal:** A command-line interface like Windows Terminal, Command Prompt, or Git Bash.

---

### Step-by-Step Deployment Instructions

#### Step 1: Initial Project Setup (If you haven't already)

1.  Open your terminal in the project's root directory.
2.  Install all the necessary packages by running:
    ```bash
    npm install
    ```
    This command reads your `package.json` file and downloads all the required libraries (like React, Vite, and gh-pages) into a `node_modules` folder.

#### Step 2: Initialize Git and Connect to GitHub

1.  **Initialize Git:** If you haven't already, turn your project folder into a Git repository.
    ```bash
    git init
    ```

2.  **Add your GitHub repository as the remote origin:** This tells Git where to upload your code.
    ```bash
    git remote add origin https://github.com/fsiceangel/CookingRecipe.git
    ```
    *If you get an error that `origin` already exists, you can either remove it with `git remote remove origin` first, or use `git remote set-url origin https://github.com/fsiceangel/CookingRecipe.git`.*

3.  **Switch to the `main` branch:** It's best practice to use `main` as your primary branch name.
    ```bash
    git branch -M main
    ```

#### Step 3: First Commit and Push

1.  **Add all files to Git:** This stages all your project files for the first commit. The `.gitignore` file will ensure that unnecessary files (like `node_modules`) are excluded.
    ```bash
    git add .
    ```

2.  **Commit your files:** This creates a snapshot of your project.
    ```bash
    git commit -m "Initial commit of Personal Recipe Book application"
    ```

3.  **Push your code to GitHub:** This uploads your project source code to the `main` branch on your GitHub repository.
    ```bash
    git push -u origin main
    ```

#### Step 4: Deploy to GitHub Pages

This is the final and easiest step, thanks to our setup!

1.  In your terminal, simply run the deploy script:
    ```bash
    npm run deploy
    ```

**What does this command do?**
*   It first runs the `predeploy` script (`npm run build`), which uses Vite to create a production-ready, optimized version of your app in a new folder called `dist`.
*   Then, it runs the `deploy` script (`gh-pages -d dist`), which takes the contents of the `dist` folder and pushes them to a special branch on your GitHub repository called `gh-pages`.

#### Step 5: Check Your Live Site!

1.  GitHub Pages will automatically detect the new `gh-pages` branch and host it.
2.  Wait a minute or two for the deployment to complete.
3.  Go to your repository settings on GitHub, click on the "Pages" tab in the left sidebar, and you should see a confirmation that your site is live at:
    **https://fsiceangel.github.io/CookingRecipe**

That's it! Your application is now live.

---

### Future Updates

Whenever you make changes to your application and want to update the live website, just follow these two steps:

1.  **Commit and push your source code changes:**
    ```bash
    git add .
    git commit -m "Describe your new changes here"
    git push origin main
    ```

2.  **Re-deploy the application:**
    ```bash
    npm run deploy
    ```