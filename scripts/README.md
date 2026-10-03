# Cabinet tour and verification

## Video

`cabinet-tour.jsx` is the native Higgsedit composition used in the Higgsfield
sandbox. It creates a silent, 25-second, 1280 x 720 H.264 tour from the five
existing cabinet photographs. The photographs are animated, not AI-reconstructed.
Each room has a five-second chapter. No patient or synthetic doctor imagery is used.

To reproduce in a Higgsfield sandbox with Higgsedit installed:

1. Copy `assets/images/1.jpg` through `5.jpg` to `/home/user/`.
2. Run `higgsedit build cabinet-tour.jsx`.
3. Optimize playback with
   `ffmpeg -i /home/user/tour.mp4 -c copy -movflags +faststart visite-cabinet.mp4`.
4. Export the movie and preview before the sandbox expires.

The delivered movie is `assets/video/visite-cabinet.mp4`; its poster is
`assets/images/tour-poster.jpg`. Playback is user-initiated with `preload="none"`.
The photo gallery provides the same rooms as an alternative to the silent video.

The player now includes five room chapters (0, 5, 10, 15 and 20 seconds), active
chapter feedback. The custom fullscreen button was removed; native fullscreen
controls are hidden where the browser supports `controlslist="nofullscreen"`. If the movie is replaced,
update those timestamps and the duration labels along with the chapter logic.

## Generative walkthrough status

A Seedance 2.5 image-reference walkthrough was requested through Higgsfield
(five real cabinet photos, 20 seconds, 1080p, silent). Submission was rejected:
the connected account is on the free plan with zero credits and an expired trial.
No generative video was produced or integrated. The current delivered movie is
still the original animated photographic montage; do not describe it as a filmed
or AI-generated spatial walkthrough. No campaign settings or budget were changed.

## Website checks performed

- Chrome desktop at 1440, 1024 and 768 pixels; mobile layouts at 430, 390 and
  320 pixels: no horizontal page overflow or broken loaded images.
- Mobile menu opening, navigation and closing.
- Gallery dialog, next photo, arrow keys and Escape dismissal.
- Review scrolling, video playback and reduced-motion preference.
- Main content and navigation remain available without JavaScript.
- Internal anchors resolve; one H1; valid JSON-LD; no JavaScript page errors.
- One Ads conversion event per tracked telephone click in the local test.
  External Ads requests were blocked during testing to avoid polluting metrics.

Telephone tracking measures a click, not an answered call, confirmed booking or
patient visit. No patient details are collected by a form or sent as `user_data`.
The old disconnected form has been replaced by actual telephone/WhatsApp links.
Old page URLs redirect to the matching section of the single-page site.

These checks do not verify Google Ads attribution, regulatory compliance, Google
approval, or a production deployment. No campaign setting or budget was changed.
