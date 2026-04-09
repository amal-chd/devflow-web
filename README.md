# DevFlow Landing Site

Standalone static marketing site for the DevFlow mobile app.

## Files

- `index.html`: Product landing page
- `privacy.html`: Public privacy policy
- `terms.html`: Public terms of service
- `support.html`: Support and contact page
- `account-deletion.html`: Account deletion instructions
- `styles.css`: Shared visual system
- `app.js`: Small enhancements for nav and footer year

## Local Preview

From the repo root:

```bash
cd landing-site
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Notes

- This site was written to match the current Flutter codebase and app-store-style public policy requirements.
- Update `support@devflow.com` if you want to use a different support address before publishing.
