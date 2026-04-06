# Nohemi Font Setup Guide

## Step 1: Place Your Font Files
Copy all your Nohemi font files (`.woff`, `.woff2`, `.otf`, `.ttf`) into this directory (`src/assets/fonts/`).

Your files might have names like:
- `Nohemi-Bold-BF6438cc587b5b5.ttf`
- `Nohemi-Light-BF6438cc583f70b.otf`
- `Nohemi-ExtraBold-BF6438cc58a4c3c.woff`
- etc.

## Step 2: Rename Your Font Files (Automatic)
Run the rename script to automatically remove the hash suffixes:

```bash
node src/assets/fonts/rename-fonts.js
```

This will convert:
- `Nohemi-Bold-BF6438cc587b5b5.ttf` → `Nohemi-Bold.ttf`
- `Nohemi-Light-BF6438cc583f70b.otf` → `Nohemi-Light.otf`
- `Nohemi-ExtraBold-BF6438cc58a4c3c.woff` → `Nohemi-ExtraBold.woff`

The script automatically detects the pattern `FontName-Weight-Hash.extension` and renames to `FontName-Weight.extension`.

## Step 3: Use Your Font
After running the rename script, the font is ready to use! The CSS and Tailwind config are already set up for Nohemi.

```tsx
// Using Tailwind class
<div className="font-nohemi">Your text here</div>
<div className="font-nohemi font-bold">Bold text</div>
<div className="font-nohemi font-light">Light text</div>

// Or in CSS
.my-element {
  font-family: 'Nohemi', sans-serif;
}
```

## Available Font Weights
- `font-extralight` (200) - ExtraLight
- `font-light` (300) - Light
- `font-normal` (400) - Regular
- `font-medium` (500) - Medium
- `font-semibold` (600) - SemiBold
- `font-bold` (700) - Bold
- `font-extrabold` (800) - ExtraBold

## Manual Renaming (Alternative)
If you prefer to rename manually, your files should follow this naming convention:
- `Nohemi-ExtraLight.woff` (or `.woff2`, `.otf`, `.ttf`)
- `Nohemi-Light.woff`
- `Nohemi-Regular.woff`
- `Nohemi-Medium.woff`
- `Nohemi-SemiBold.woff`
- `Nohemi-Bold.woff`
- `Nohemi-ExtraBold.woff`

## Notes
- The CSS is already configured for Nohemi in `src/index.css`
- Tailwind config includes `font-nohemi` class in `tailwind.config.js`
- The rename script handles multiple file formats (woff, woff2, otf, ttf)
- If a target filename already exists, the script will skip that file

