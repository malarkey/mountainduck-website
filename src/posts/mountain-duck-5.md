---
title: "Mountain Duck 5"
date: 2025-08-19
postAuthor: "David Kocher"
postSummary: "Mountain Duck 5 introduces Integrated Connect Mode, SMB support, an Activity panel, and custom versioning."
postCategories: ["Mountain Duck"]
postTags: ["Release", "Integrated Connect Mode", "SMB"]
---

We are thrilled to announce [Mountain Duck 5](https://mountainduck.io/), the latest major upgrade for mounting server and cloud storage as a disk in Finder on macOS and File Explorer on Windows. Version 5 has been in development for several years and adds major new features including Integrated Connect Mode, storage-independent file versioning, and SMB connectivity.

---

## New features

### Integrated Connect Mode

Mountain Duck 5 introduces [Integrated Connect Mode](https://docs.mountainduck.io/) using native APIs on Windows and macOS to integrate directly in the file explorer. There is no device driver installation or separate network mount required. File writes and file operations are significantly faster, and the experience feels much closer to OneDrive on Windows or iCloud Drive on macOS. Windows Search and Spotlight on macOS can also be used to search for files on remote storage in Integrated Connect Mode.

<img src="/images/posts/mountain-duck-5-1.png" alt="">

### SMB support

Mountain Duck 5 adds [SMB support](https://docs.mountainduck.io/) so you can connect to Windows file shares, Linux Samba servers, macOS File Sharing, and Azure File Shares from the same interface.

<img src="/images/posts/mountain-duck-5-2.png" alt="">

### Activity window

The new Activity panel lets you track and cancel running sync operations from the status bar on macOS or the tray menu on Windows. It shows active file operations, pending sync tasks, and any mount process still in progress.

<img src="/images/posts/mountain-duck-5-3.png" alt="">

### Custom versioning

The new [Custom versioning](https://docs.mountainduck.io/) feature safeguards previous file versions by stashing the old version before an overwrite happens. It works across protocols that do not offer native version history, including FTP, SFTP, and WebDAV, and previous versions can be viewed or restored from the [Info window](https://docs.cyberduck.io/).

<img src="/images/posts/mountain-duck-5-4.png" alt="">

## Pricing

Version 5 is the first paid upgrade since version 4 launched in June 2020. Customers with a version 4 licence receive an [upgrade discount](https://mountainduck.io/) ranging from 20% to 100%.
