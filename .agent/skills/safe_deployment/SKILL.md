---
name: Safe Deployment & Verification (Netlify/Flutter)
description: Checklist and rules for safely deploying the Sofa2Slugger Flutter app to Netlify, avoiding common pitfalls like redirect loops and build failures.
---

# Pre-Flight Checks
- [ ] **Pubspec Validation**: Check `pubspec.yaml` for duplicate keys (e.g., `google_fonts`). This causes immediate build failure.
- [ ] **Netlify Config**: 
    - Ensure `netlify.toml` does NOT contain a root (`/`) 301 redirect if the landing page is also on Netlify (prevents infinite loop).
    - Ensure `/*` -> `/index.html` (200) rewrite exists for SPA routing.

# Deployment Steps
1. `git status` - Confirm clean working tree.
2. `git add .` - Stage changes.
3. `git commit -m "Desc"` - Commit.
4. `git push origin master` - Trigger Netlify build.

# Post-Deploy Verification
After waiting 2-3 minutes for the build:

1. **Redirect Sanity (Curl)**:
   ```bash
   curl -I https://sofa2slugger.netlify.app/
   # Expect: 301 Redirect (if configured in Dashboard) OR 200 OK (if Landing Page is served from root).
   # If 301, allow strict redirect.
   ```

2. **App Deep Link**:
   ```bash
   curl -I https://sofa2slugger.netlify.app/gym
   # Expect: 200 OK (Must NOT redirect to landing page).
   ```

3. **Routing Check**:
   - Verify "Start" button on Landing Page links to `/gym` (not `/`).
   - Verify App can navigate between tabs (Gym, Tape, Corner).

# Recovery
- If **Infinite Loop**: Emergency Revert `netlify.toml`. Configure redirect in Netlify Dashboard only.
- If **Build Fail**: Check `pubspec.yaml` syntax immediately.
