$ErrorActionPreference = "Stop"

$repo = "https://github.com/Missyrupert/sofa2slugger.git"
$branch = "clean"
$here = (Get-Location).Path.Replace("\", "/")

Write-Host "Preparing rebuilt Sofa2Slugger for GitHub..."
Write-Host "Folder: $here"
Write-Host "Target: $repo"
Write-Host "Branch: $branch"
Write-Host ""

git config --global --add safe.directory $here

$envFiles = Get-ChildItem -Force -Recurse -File |
  Where-Object { $_.Name -match '^\.env($|\.|local)' }

if ($envFiles.Count -gt 0) {
  Write-Host "Stopping: env files were found."
  $envFiles | ForEach-Object { Write-Host " - $($_.FullName)" }
  exit 1
}

git init
git remote add origin $repo
git checkout -B $branch

if (-not (git config user.name)) { git config user.name "Chris" }
if (-not (git config user.email)) { git config user.email "chris@example.local" }

git add -A
git commit -m "chore: soft launch rebuild"

Write-Host ""
Write-Host "Pushing to GitHub. If GitHub asks you to sign in, complete the browser prompt."
git push -u origin $branch --force

Write-Host ""
Write-Host "Push succeeded. Netlify should now rebuild automatically from branch '$branch'."
Write-Host "Correct deploy log should show 12 routes and no /fightiq."
