# AUTOTEK

Professional Texa diagnostic tool sales — St. Louis, MO & Minneapolis, MN.

## Quick Start

This is a static website deployed via GitHub Pages.

### Enable GitHub Pages
1. Go to **Settings → Pages** in this repo
2. Under **Source**, select **Deploy from a branch**
3. Choose **main** branch, **/ (root)** folder
4. Click **Save**
5. Your site will be live at `https://davidmday99-lgtm.github.io/AUTOTEK-/`

### Custom Domain (when ready)
1. In **Settings → Pages**, enter your custom domain
2. Add a `CNAME` file to the repo root with your domain name
3. Configure DNS: CNAME record pointing to `davidmday99-lgtm.github.io`

## Daily Blog
A GitHub Action runs every day at 9:00 AM CT and automatically publishes a new blog post under Mike Miller's name. Posts are stored in `data/posts.json` and rendered via JavaScript.

To trigger manually: **Actions → Daily Blog Post → Run workflow**

## Lead Form
Contact form powered by [Formspree](https://formspree.io/f/xkoqnvzy). Submissions are emailed to the connected Formspree account.

## File Structure
```
├── index.html          # Homepage
├── products.html       # Product details
├── videos.html         # Video gallery
├── blog.html           # Blog listing
├── contact.html        # Contact form
├── assets/
│   ├── css/style.css   # All styles
│   └── js/main.js      # All scripts
├── data/
│   └── posts.json      # Blog post data
└── .github/
    └── workflows/
        └── daily-blog.yml  # Auto blog action
```

## Contact
📞 314-922-3083
