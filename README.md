# soumilbhandari.github.io

My digital business card. One page, no build step, no dependencies, no vendor.

**Live:** https://soumilbhandari.github.io

Tap an NFC card or scan the QR → this page opens → **Save Contact** writes a vCard
into the phone, **View Resume** opens the PDF. The recipient installs nothing.

## What's here

| File | What it does |
|---|---|
| `index.html` | The card. Self-contained — all CSS and JS inline. |
| `contact.vcf` | The vCard behind "Save Contact" (vCard 3.0, CRLF). |
| `resume.pdf` | The resume behind "View Resume". |
| `qr.png` / `qr.svg` | QR pointing at the site. SVG is the one to hand a printer. |
| `qr.html` | Big scannable QR for a laptop screen or a printed table card. |
| `og.png` | Link preview image — what shows when someone texts your link on. |
| `share.html` | Fullscreen QR to show someone. Add to your home screen; it opens like an app. |
| `manifest.webmanifest` | Makes `share.html` installable and chrome-free. |
| `robots.txt` | Card indexable; resume and vCard are not (see below). |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is. |

## Updating anything

Edit the file, then:

```bash
git add -A && git commit -m "update" && git push
```

Live in under a minute. **The NFC card never needs rewriting** — the chip stores
the URL, not the data. Same reason a new job title costs you one push, not a reprint.

### Swapping in a new resume

```bash
cp ~/Downloads/YourNewResume.pdf resume.pdf && git add -A && git commit -m "resume" && git push
```

Keep the filename `resume.pdf` and every card, QR, and vCard already in circulation
keeps working.

### Changing what the card says

Everything is plain text in `index.html` — name, role, the "Currently" bullets, the
links. Edit `contact.vcf` to match if you change the email or phone.

### Adding a photo

Drop `photo.jpg` in this folder and replace the monogram line in `index.html`:

```html
<div class="avatar">SB</div>
<!-- becomes -->
<img class="avatar" src="photo.jpg" alt="Soumil Bhandari">
```

## Writing the NFC card

Buy **NTAG215** stickers or cards — ~$10 for 10 on Amazon. NTAG215 has 504 bytes,
far more than a URL needs, and it's the chip Apple and Android both read without an app.

1. Install **NFC Tools** (free, iOS and Android).
2. Write → Add a record → **URL/URI** → `https://soumilbhandari.github.io`
3. Write to the tag, hold the phone against it.
4. **Lock the tag** in the app once you've tested it — otherwise anyone with a
   phone can overwrite what your card points to.

Test before you order anything printed. iPhone 7 and newer read tags with the screen
on and unlocked, no app open — hold the very top edge of the phone (where the cameras
are) against the card. Android needs NFC switched on in settings, and its antenna is
usually mid-back.

For a printed card, send the printer `qr.svg` — it's vector, so it stays crisp at
any size. Put the QR on the back; it's the fallback for anyone whose NFC is off.

## Showing it phone-to-phone

**There is no phone-to-phone NFC.** Android Beam was deprecated in Android 10 and
removed entirely by Android 14; its replacement, Quick Share, uses Bluetooth and
Wi-Fi, not NFC. iOS has never allowed it — third-party card emulation needs an
Apple entitlement limited to payments, transit, keys, badges and tickets, so
"emulate a business-card tag" is not an option any app can build. Apple's NameDrop
is the one exception and it is iPhone-to-iPhone only, exchanges Contacts entries
only, and can't be pointed at this page.

So when you have no card on you, the answer is the QR:

```
https://soumilbhandari.github.io/share.html
```

Open it, then Share → **Add to Home Screen**. It becomes an app icon that opens
straight to a fullscreen QR on a white field, holding the screen awake so it
doesn't dim mid-scan. Turn brightness up manually — a web page can't do that part.

The other way to get a genuine tap: **stick an NFC tag on the back of your phone
case.** It's a passive tag, so their phone reads it exactly like a card — no
phone-to-phone protocol involved. Buy the ferrite-backed kind, sold as *on-metal*
or *anti-metal* NFC tags; a plain sticker detunes badly against a phone's chassis
and often won't read at all. Keep it clear of a MagSafe ring.

## Custom domain (optional)

`soumilbhandari.github.io` is already a real improvement on `blinq.me/xk39`, but a
domain you own is better still, and it means you can change hosts later without
reprinting cards.

1. Buy `soumilbhandari.com` (~$12/yr, Cloudflare or Namecheap).
2. At the registrar, add these DNS records:

   | Type | Name | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | soumilbhandari.github.io |

3. Repo → Settings → Pages → Custom domain → enter it → wait for the check, then
   tick **Enforce HTTPS**.
4. Regenerate the QR and update the URLs in `contact.vcf`, `robots.txt`, and
   `sitemap.xml`. Rewrite the NFC tag.

Do this *before* ordering printed cards if you're going to do it at all.

## A note on `robots.txt`

The card page is set to be indexable — being findable under your own name helps you.
The resume and vCard are **not**: an indexed PDF containing your personal phone
number is the standard way that number reaches scraper lists. Anyone you hand the
card to still gets both instantly; this only affects crawlers.

The phone number is deliberately **not** in the page HTML for the same reason — it
lives in `contact.vcf` and `resume.pdf`, both of which a person downloads on purpose
and a crawler is told to skip. "Save Contact" still hands over a complete card.

To index the resume too, delete the two `Disallow` lines. Note the asymmetry —
allowing it later is one commit, but un-indexing something Google already cached
is slow and partial.

## Local preview

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.
