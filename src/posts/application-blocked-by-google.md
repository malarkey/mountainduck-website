---
title: "Application blocked by Google"
date: 2024-08-18
postAuthor: "David Kocher"
postSummary: "An OAuth consent screen issue temporarily blocked access to Google Drive and Google Cloud Storage connections."
postCategories: ["Mountain Duck", "Cyberduck"]
postTags: ["Google Drive", "Google Storage", "OAuth"]
---

> This issue was resolved on September 11 after OAuth app verification was completed, including the required CASA assessment.

To access [Google Drive](https://docs.cyberduck.io/) or [Google Cloud Storage](https://docs.cyberduck.io/) using [Cyberduck](https://cyberduck.io/) or [Mountain Duck](https://mountainduck.io/), an OAuth 2.0 client registration is required so users can grant access through Google’s consent screen.

Google temporarily blocked that consent screen and showed the following error when attempting to create a new connection:

> This app tried to access sensitive info in your Google Account. To keep your account safe, Google blocked this access.

We were aware of the problem and worked on getting the consent screen re-approved by Google.

No user data is collected or shared when accessing Google Drive or Google Cloud Storage with Cyberduck or Mountain Duck. Any data accessed is processed solely on the device in use.

As a workaround, you can register your own [custom OAuth 2.0 client ID for Google Cloud Storage and Google Drive](https://docs.cyberduck.io/) and use it with a custom connection profile.
