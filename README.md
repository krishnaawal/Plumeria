# Plumeria Plant Shop

A production-ready single-product e-commerce website for selling the White Flower Plumeria Plant in Nepal.

## What is included

- Home page with hero, embedded product shop, product details, about, plant care, reviews, contact, and footer.
- Checkout page with React Hook Form, Zod validation, Nepali mobile validation, quantity updates, COD, and manual eSewa QR payment.
- Thank You page with session-based order confirmation.
- Google Apps Script backend for saving orders to Google Sheets.
- Editable product data in `src/data/product.ts`.
- Vercel-ready Next.js App Router project using TypeScript, Tailwind CSS, and Framer Motion.

## Install Node.js

1. Open https://nodejs.org.
2. Download the LTS version.
3. Install it using the default options.
4. Open Terminal and check:

```bash
node -v
npm -v
```

## Open in VS Code

1. Open VS Code.
2. Choose File -> Open Folder.
3. Select this project folder.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown in Terminal, usually `http://localhost:3000`.

## Change the product price

Open `src/data/product.ts` and edit:

```ts
price: 1250
```

You can also change `originalPrice`, `discountPercentage`, stock, descriptions, care details, and delivery text in the same file.

## Change the delivery charge

Open `src/data/product.ts` and edit:

```ts
export const DELIVERY_CHARGE = 150;
```

## Replace product images

Replace these files with real photos using the same filenames:

- `public/images/hero/plumeria-hero.png`
- `public/images/product/plumeria-product-1.png`
- `public/images/product/plumeria-product-2.png`
- `public/images/product/plumeria-product-3.png`
- `public/images/about/plumeria-about.png`

Use clear product photos with good lighting. Keep the files reasonably compressed for faster loading.

## Add the eSewa QR image

Replace:

```text
public/images/esewa-qr.png
```

with the real eSewa QR image. Keep the same filename.

## Create the Google Sheet

1. Go to https://sheets.google.com.
2. Create a new blank spreadsheet.
3. Rename it to something like `Plumeria Plant Shop Orders`.

## Add the Apps Script backend

1. In the Google Sheet, click Extensions -> Apps Script.
2. Delete any starter code.
3. Paste the contents of `scripts/google-apps-script.js`.
4. Click Save.
5. From the function dropdown, choose `setup`.
6. Click Run.
7. Google will ask for authorization. Approve the script for your own Google account.

The `setup()` function creates the order sheet, dashboard sheet, submission log sheet, headers, frozen header row, money formatting, status dropdowns, and automatic formulas.

The order sheet automatically calculates:

- Subtotal = Quantity x Unit Price
- Total Amount = Subtotal + Delivery Charge
- Dashboard totals for orders, plant quantity, sales, COD orders, online orders, new orders, delivered orders, and payments to verify

Each successful order is saved immediately. A background Apps Script trigger then creates a printable PDF receipt in a Google Drive folder named `Plumeria Receipts`. The `Plumeria Orders` sheet includes a `Receipt PDF` column that first says `Receipt pending`, then changes to `Download / Print Receipt`.

The `Submission Logs` sheet shows every order attempt. If an order does not appear, check this tab for the exact reason, such as validation failed, duplicate order, receipt failed, or Apps Script permission error.

## Deploy Apps Script as a Web App

1. In Apps Script, click Deploy -> New deployment.
2. Select Web app.
3. Set Execute as: Me.
4. Set Who has access: Anyone.
5. Click Deploy.
6. Copy the Web App URL.

After editing the Apps Script later, create a new deployment version so the live URL uses the latest code.

## Connect the website to Apps Script

Create a file named `.env.local` in the project folder:

```env
NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace the first value with your Apps Script Web App URL.

Restart the dev server after changing environment variables.

## Test Cash on Delivery orders

1. Open the home page.
2. Click Buy Now.
3. Complete checkout.
4. Choose Cash on Delivery.
5. Submit the order.
6. Check the Google Sheet for the new row.

COD does not require a transaction code.

## Test online QR payment orders

1. Open checkout.
2. Choose Pay Online - Manual eSewa QR Payment.
3. Confirm the QR code appears.
4. Enter a transaction or reference code.
5. Submit the order.
6. Check the Google Sheet for the new row.

Online QR payments are manually verified. Do not collect eSewa passwords, PINs, OTPs, card details, or login information.

## Push to GitHub

```bash
git init
git add .
git commit -m "Build Plumeria Plant Shop"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Deploy to Vercel

1. Go to https://vercel.com.
2. Import the GitHub repository.
3. Keep the default Next.js settings.
4. Add environment variables:

```env
NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

5. Deploy.

## Troubleshooting

- If orders do not save, confirm the Apps Script deployment URL is in `.env.local`.
- If you changed Apps Script code, create a new deployment version.
- If Apps Script says permission denied, confirm the Web App access is set to Anyone.
- If checkout says the API returned a webpage instead of JSON, confirm the URL ends with `/exec`, not `/dev`, and paste the latest Apps Script code before deploying.
- If checkout says invalid JSON, run `setup()` again in Apps Script, save, deploy a new Web App version, then update `.env.local` if Google gives you a new URL.
- If the dashboard updates but orders appear missing, run the latest `setup()` once. It cleans old blank formula rows so new orders appear directly under the header.
- If the dashboard updates but `Plumeria Orders` stays empty, check the `Submission Logs` sheet. It records whether the website request reached Apps Script and where it stopped.
- If receipts do not generate, run `setup()` manually and approve the Google Drive/Docs permissions, then deploy a new Web App version.
- Receipt PDFs are generated by the `generatePendingReceipts` background trigger. They may appear up to one minute after the order is saved.
- If checkout shows an API configuration error, restart the dev server after editing `.env.local`.
- If online payment submits without a code, confirm Pay Online is selected and the form is refreshed.
- If CORS causes trouble, keep the frontend request content type as `text/plain;charset=utf-8`, as used in `src/lib/order-service.ts`.

## Final checklist

- Home page and product shop are on the same page.
- No separate Shop page is created.
- Shop navigation scrolls to the product section.
- Only the White Flower Plumeria Plant is displayed.
- No product categories, filters, sorting, FAQ, or Why Choose Us section.
- Checkout product data survives refresh through localStorage.
- COD does not require a transaction code.
- Pay Online displays the QR code and requires a transaction/reference code.
- Successful orders store confirmation details and redirect to Thank You.
- Failed submissions stay on checkout and show an error.
