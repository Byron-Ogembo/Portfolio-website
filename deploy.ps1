# One-click deploy: portfolio -> GitHub Pages (always online)
# Run in PowerShell: .\deploy.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$repo = "byron-ogembo-portfolio"
$owner = "Byron-Ogembo"

Write-Host "`n=== Byron Ogembo Portfolio Deploy ===`n" -ForegroundColor Cyan

# Ensure gh is on PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host "GitHub CLI not found. Install: winget install GitHub.cli" -ForegroundColor Red
  exit 1
}

$auth = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "Sign in to GitHub (browser will open)...`n" -ForegroundColor Yellow
  gh auth login --hostname github.com --git-protocol https --web
}

Write-Host "Creating/updating repository and pushing..." -ForegroundColor Green
$exists = gh repo view "$owner/$repo" 2>$null
if ($LASTEXITCODE -ne 0) {
  gh repo create "$owner/$repo" --public --description "Byron Ogembo - Data Analyst & Business IT Portfolio" --source . --remote origin --push
} else {
  if (-not (git remote get-url origin 2>$null)) {
    git remote add origin "https://github.com/$owner/$repo.git"
  }
  git push -u origin main
}

Write-Host "Enabling GitHub Pages..." -ForegroundColor Green
gh api -X PUT "repos/$owner/$repo/pages" -f build_type=legacy -f "source[branch]=main" -f "source[path]=/" 2>$null

$liveUrl = "https://$owner.github.io/$repo/"
$cvUrl = "https://$owner.github.io/$repo/assets/docs/Ogembo-CV.pdf"

Write-Host "`nDone! Your site will be live in 1-3 minutes:`n" -ForegroundColor Green
Write-Host "  Portfolio: $liveUrl"
Write-Host "  CV:        $cvUrl`n"
Write-Host "Share these links - they work 24/7 without your PC.`n" -ForegroundColor Cyan
