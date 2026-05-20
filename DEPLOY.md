# Deploy portfolio (always online)

Your site will stay live 24/7 on GitHub Pages — no laptop, tunnel, or local server needed.

## One-time setup

1. Create a new repository on GitHub: https://github.com/new  
   - Name: `byron-ogembo-portfolio`  
   - Public  
   - Do **not** add README, .gitignore, or license (empty repo)

2. In PowerShell, from this folder:

```powershell
cd C:\Users\Jungle\Desktop\portfolio
git remote add origin https://github.com/Byron-Ogembo/byron-ogembo-portfolio.git
git branch -M main
git push -u origin main
```

3. Enable GitHub Pages:  
   - Repo → **Settings** → **Pages**  
   - **Source:** Deploy from a branch  
   - **Branch:** `main` / **Folder:** `/ (root)`  
   - Save

4. After 1–3 minutes, your permanent link:

**https://byron-ogembo.github.io/byron-ogembo-portfolio/**

CV download:

**https://byron-ogembo.github.io/byron-ogembo-portfolio/assets/docs/Ogembo-CV.pdf**

## Update the site later

```powershell
git add .
git commit -m "Update portfolio"
git push
```

Changes go live automatically after the push.
