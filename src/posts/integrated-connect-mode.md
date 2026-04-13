---
title: "Integrated Connect Mode"
date: 2025-08-12
postAuthor: "David Kocher"
postSummary: "Integrated Connect Mode uses native platform APIs on macOS and Windows for faster sync and tighter file explorer integration."
postCategories: ["Mountain Duck"]
postTags: ["Integrated Connect Mode", "Synchronisation", "Windows"]
---

The new [Integrated Connect Mode](https://docs.cyberduck.io/) in Mountain Duck 5 synchronises files and folders from a directory on the local disk with support from macOS and Windows.

While the existing [Online](https://docs.mountainduck.io/) and [Smart Synchronization](https://docs.mountainduck.io/) modes rely on a device driver on Windows and NFS on macOS, Integrated Connect Mode uses the native File Provider framework on macOS and Cloud Files on Windows. That gives faster write performance, quicker file operations, and access to cached content when offline.

## Synchronisation

Using operating system features for synchronisation makes the mode more future-proof. As with Smart Synchronization, files are displayed as placeholders, cached locally, and can be marked to keep offline.

The improved user experience adds familiar file management controls directly in Finder and Windows Explorer, making it easier to keep files offline, remove cached data, or exclude items from synchronisation. Visual indicators and progress overlays also make upload and download status easier to follow.

### Additional context menu items

Additional context menu items in Windows Explorer and Finder make it possible to download files on demand or free up space for files that are already cached.

### Spotlight

Windows Search and Spotlight on macOS can be used to search for files on remote storage in Integrated Connect Mode.

### New default

Integrated Connect Mode is the default for new connections. Existing bookmarks keep their current connect mode when a matching cache location is found.
