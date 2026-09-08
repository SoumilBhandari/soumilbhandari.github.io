# Card artwork

Two-page PDFs — **page 1 is the front (dark), page 2 is the back (QR)**. All text is
live vector with Helvetica Neue embedded, and the QR is drawn as vector squares, so
everything stays crisp at any size. Verified: the QR decodes correctly when the PDF
is rendered at 300 DPI.

| File | Page size | Use it for |
|---|---|---|
| `card-trim.pdf` | 85.5 × 54 mm | **UV printing onto the blank NTAG215 cards you bought.** Exact CR80, no bleed, no marks — the printer aligns to the card edge. |
| `card-bleed.pdf` | 100.7 × 69.2 mm | **Ordering custom-printed cards from a vendor.** 3 mm bleed on all sides plus crop marks outside the bleed. |
| `card-proof.png` | — | Visual proof with rounded corners. Not for printing. |

Trim is 85.5 × 54 mm (CR80) in both. Content is kept 4 mm inside the trim, so nothing
important dies at the cut.

## Which one do I send?

**Printing onto your own blanks** → `card-trim.pdf`. Ask a local shop for "UV flatbed
printing on PVC cards." A home inkjet or laser **cannot** print on PVC — don't try it,
you'll jam the printer and the ink won't cure.

**Ordering finished cards** → `card-bleed.pdf`, and tell them CR80, 4/4 (both sides).

## Regenerating

If your title, employer, or URL changes, edit the constants at the top of the build
script and re-run it. Nothing is hardcoded twice — the QR is generated from `URL`, so
changing that one string updates the code and the printed address together.

The QR encodes `https://soumilbhandari.github.io` at error-correction level Q, which
tolerates roughly 25% damage — enough to survive a card living in a wallet.

## Before you order 100 of anything

Print one on paper at 100% scale, cut it out, and scan the QR with your phone. Costs
nothing and catches the mistakes that are expensive at volume.
