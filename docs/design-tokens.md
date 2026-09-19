# TripUp — Design Tokens (extracted from the hi-fi Figma screen)

Source of truth: Figma frame **iPhone 16 - 27** (node `2045:33233`).
No Figma variables exist yet by design — these are the raw values in use.

## Colors

| Token | Value | Used for |
|---|---|---|
| ink | `#131313` | Screen ground, primary buttons, text on light surfaces, avatar add button |
| surface | `#FFFFFF` | Cards (title, itinerary "next", idea cards), secondary buttons, tag chips, text on dark |
| peach | `#FFBB96` | Prompt/nudge card |
| periwinkle | `#BBCAF1` | Itinerary items (default state) |
| glass label | `#1A1A1A` | Symbol color on glass bars (iOS library: labels/vibrant/primary) |
| border | `#000000` | 1px hairline on cards, pills, chips |

iOS-library glass material (accessory bars / toolbar buttons):
- Shadow stack: `1.25px 0 0 -0.75px #D0D0D0`, `-1.25px 0 0 -0.75px #D0D0D0`, `0 0 0 0.5px #E8E8E8`, `0 8px 15px rgba(0,0,0,0.02)`
- Fill layers: white/black 25% overlays + `rgba(68,68,68,0.6)` plus-lighter + `rgba(248,248,248,0.2)` luminosity (approximated in code as `rgba(248,248,248,0.78)` + backdrop-blur)

Effects:
- Inner shadow on all imagery: `inset 0 4px 40px rgba(47,47,47,0.25)`

## Typography — SF Pro

| Role | Size | Weight |
|---|---|---|
| Trip name | 40 | Medium (510) |
| Headline (prompt) | 24 | Medium |
| Day number | 32 | Medium |
| Card titles, times, buttons-ish | 16 | Medium |
| Body/labels (eyebrow, section headers, day name, dates, buttons) | 16 | Regular |
| Glass-bar symbols | 17 | Medium / Semibold (590) |
| Meta (addresses, "Added by", tag chips) | 12 | Regular |

## Radii

| Token | Value | Used for |
|---|---|---|
| card | 40 | All cards, hero image, itinerary items, idea cards |
| media | 36 | Images nested inside cards (card radius − padding) |
| pill | 100 | Buttons, chips, glass bars |

## Spacing

- Page gutter: **4** (px-1) — cards run nearly edge to edge
- Gap between cards / grid gap: **4**
- Card padding: **24**; itinerary items: **24 × 16**
- Idea card: outer padding 4 (image inset), caption block: px 8 / pt 16 / pb 24
- Section: pt 8, gap 8 between header and content
- Micro-gaps inside text stacks: 2
- Avatar overlap: **−16**; avatars 40 (header) / 32 (idea cards)
- Hero: 350 tall; title card overlaps it by **−82**
- Glass bar: height 48, symbol tiles 36, gap 12

## SF Symbols in use (actual code points from the file)

| Symbol | Glyph | Code point |
|---|---|---|
| plus | 􀅼 | U+10017C |
| calendar | 􀉉 | U+100249 |
| arrow.up.right | 􀄯 | U+10012F |
| location | 􀋑 | U+1002D1 |
| chevron.backward | 􀯶 | U+100BF6 |
| pencil | 􀈊 | U+10020A |
| house | 􀎞 | U+10039E |
| banknote (expenses) | 􁎢 | U+1013A2 |

## Wireframe → Hi-Fi (the transformation rules)

1. Ground flips from wireframe gray to near-black ink `#131313`; content becomes white "stickers" with 40px radius and a 1px black hairline.
2. The gray header block becomes a full-bleed cover photo with glass controls; the trip identity moves onto a white card that overlaps the photo (−82).
3. Emphasis inverts: the *upcoming* itinerary item is white, the rest periwinkle (wireframe highlighted via light gray).
4. Exactly two accent colors, each owning one meaning: peach = the app asks something; periwinkle = scheduled/resting.
5. Ideas go from horizontal rail to 2×2 grid; every image carries the same inner shadow; social proof (voter avatars) sits ON the image.
6. Tab bar becomes iOS-26 liquid-glass accessory bars; labels become SF Symbols.
7. Copy warms up ("Tonight is still open!" → "Night's still young...", schedule → itinerary, "Breakfast" → "Breakfast of Champions").
