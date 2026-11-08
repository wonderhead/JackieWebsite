# Jacqueline Trinh-Juarez Portfolio

A static React and TypeScript portfolio designed for GitHub Pages. It has no backend, database, form processor, or other hosted application service.

## Local development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm test
npm run build
npm run preview
```

## Updating the site

- Edit all public copy and external links in `src/content/siteContent.ts`.
- Follow [IMAGE_GUIDE.md](./IMAGE_GUIDE.md) to replace photos, add gallery images, or replace the resume without changing components.
- Search the repository for `REPLACE_ME` before publishing.

## GitHub Pages

The site is configured for **https://jacqueline-trinh-juarez.com/**. Vite uses the root base path `/`, and the `404.html` fallback preserves zero path segments so direct links such as `/about` work on the custom domain.

The workflow in `.github/workflows/deploy-pages.yml` runs linting, tests, and the production build before deploying. In the repository settings, set **Pages → Source** to **GitHub Actions**.

### First-time hosting setup

1. Open [Settings → Pages](https://github.com/wonderhead/JackieWebsite/settings/pages) and select **GitHub Actions** as the publishing source.
2. Set **Custom domain** to `jacqueline-trinh-juarez.com` and save it **before** changing DNS. With the Actions workflow, a `CNAME` file in the repository is not required.
3. In Porkbun, open **Domain Management → jacqueline-trinh-juarez.com → DNS Records**. If Porkbun manages the domain's nameservers, add these records:

   | Type | Host | Answer/value |
   | --- | --- | --- |
   | A | Leave blank (root domain) | `185.199.108.153` |
   | A | Leave blank (root domain) | `185.199.109.153` |
   | A | Leave blank (root domain) | `185.199.110.153` |
   | A | Leave blank (root domain) | `185.199.111.153` |
   | CNAME | `www` | `wonderhead.github.io` |

   Remove conflicting parking or forwarding records for the root domain and `www`; preserve email records. Porkbun's **Quick DNS Config → GitHub** is another way to configure these records.
4. Once GitHub's DNS check passes and the certificate is available, enable **Enforce HTTPS**. DNS and certificate setup can take up to 24 hours.
5. If the first workflow ran before Pages was enabled, rerun it from the repository's **Actions** tab. Confirm the deployment succeeds, then check the home page, a direct `/about` link, and a resume download.

GitHub redirects `www.jacqueline-trinh-juarez.com` to the configured root domain when both DNS records are correct. Subsequent pushes to `main` automatically deploy updates after the checks pass.

References: [GitHub custom-domain setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) and [Porkbun's GitHub Pages guide](https://kb.porkbun.com/article/64-how-to-connect-your-domain-to-github-pages).
