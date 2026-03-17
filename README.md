# ClapKit Website (GitHub Pages)

Static site for `clapkit.pro`.

## Structure

- `index.html` - landing page
- `privacy.html` - privacy policy
- `support.html` - support page
- `styles.css` - shared styles
- `script.js` - RU/EN switching + footer year
- `CNAME` - custom domain (`clapkit.pro`)
- `assets/` - logo and screenshots

## Deploy (GitHub Pages via Actions)

1. Push this branch and merge changes into `main`.
2. In GitHub repository settings, open `Pages`.
3. In `Build and deployment`, select `Source: GitHub Actions`.
4. After push to `main`, workflow `Deploy github-pages-site` publishes the site.

## Namecheap DNS for GitHub Pages

Set these DNS records for root domain (`clapkit.pro`):

- `A` -> `185.199.108.153`
- `A` -> `185.199.109.153`
- `A` -> `185.199.110.153`
- `A` -> `185.199.111.153`
- `CNAME` for `www` -> `<your-github-username>.github.io`

Notes:
- Keep `CNAME` file as `clapkit.pro` in this folder.
- DNS propagation usually takes from a few minutes up to 24 hours.

## App Store links

- Support URL: `https://clapkit.pro/support.html`
- Privacy Policy URL: `https://clapkit.pro/privacy.html`
- Marketing URL: `https://clapkit.pro`
