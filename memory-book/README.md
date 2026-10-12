This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Guest share links

`share_links` associates one reusable 32-byte random token with each user. The
Copy Link action looks up or creates the row and copies `/share/<token>`. Guests
can view that user's books and submit memories without logging in. The token is
preserved through book, contribution, and collection-download links; user IDs
are not accepted as guest authorization.

For an existing database, run `node scripts/create-share-links.mjs` from
`memory-book` (using the existing `.env.local` database configuration). New
installations include the table in `scripts/database-schema.sql`. Delete a
user's `share_links` row to revoke their link; clicking Copy Link again
creates a new link. Treat tokens as secrets and do not log or commit them.

Run focused tests with `node scripts/test-share-links.mjs`. Owner dashboards currently allow any existing user ID at `/dashboard/<userId>`
and are intended for development until login is connected. Each dashboard uses
its own share token for book viewing, contributions, and downloads; Copy Link
also targets that dashboard user. The dashboard initializes a token for these
links, and Copy Link retrieves or recreates it as needed. `lib/currentUser.ts`
still returns account 1 for default owner routes. Connect real owner-session
authentication and restrict share-link creation to that owner before treating
the application as private.
