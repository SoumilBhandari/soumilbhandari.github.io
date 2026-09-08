# Hammer Chip — landing page

Live at `/hammerchip/`. Single self-contained HTML file; images in `img/`.

## Turning the waitlist on

The form is built and tested, but it has nowhere to send emails yet. Right now it
falls back to opening a pre-filled email to `soumil.bhandari@gmail.com`, so the
button is never dead — but that loses maybe half the people who click it.

To make it collect properly, takes about two minutes:

1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month).
   Basin and Getform work identically if you prefer one of those.
2. Create a form. It gives you an endpoint like `https://formspree.io/f/abcdwxyz`.
3. Paste it into `index.html`:

```js
const WAITLIST_ENDPOINT = "https://formspree.io/f/abcdwxyz";
```

That's the only change. The form already sends `{ email, source }` as JSON with
`Accept: application/json`, which is the shape all three services expect.

### What's already handled

- Email validated before anything is sent
- Hidden honeypot field — a bot that fills it gets silently ignored
- Submit disabled while in flight, so no double-posts
- On failure the form re-enables and tells the visitor to email you instead,
  rather than silently swallowing the signup
- Success replaces the form rather than leaving a live one on screen

All five paths were exercised against a stubbed endpoint before shipping.

## A caveat about "hiding" the repo

The GitHub links are gone from the page, but **that does not make the source
private.** This site is served from a public repository — that's a requirement for
GitHub Pages on a free account — so anyone who guesses the repo URL from the live
card address can read everything.

If the source genuinely needs to be private, the options are:

- **GitHub Pro** (~$4/month) — Pages from a private repo.
- **Netlify or Vercel free tier** — both deploy from private repos at no cost. This
  is the usual answer.
- **Accept it** — reasonable while the product is a landing page and a waitlist.

Worth deciding before you point anyone at this.
