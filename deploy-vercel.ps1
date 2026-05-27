# Deploy portfolio to Vercel (always online)
# Usage: set token once per session, then run script
#   $env:VERCEL_TOKEN = "your_token_from_vercel_dashboard"
#   .\deploy-vercel.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$scope = "ogembobyron8-3423s-projects"

if (-not $env:VERCEL_TOKEN) {
  Write-Host "Set VERCEL_TOKEN first (Vercel Dashboard -> Settings -> Tokens)" -ForegroundColor Red
  exit 1
}

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

npx --yes vercel@latest deploy --prod --yes --scope $scope

Write-Host "`nProduction URL is shown above (Aliased line).`n" -ForegroundColor Green
