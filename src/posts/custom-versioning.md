---
title: "Custom versioning"
date: 2025-08-12
postAuthor: "David Kocher"
postSummary: "Mountain Duck 5 adds a storage-independent versioning option for protocols without native file history."
postCategories: ["Mountain Duck"]
postTags: ["Versioning", "FTP", "WebDAV"]
---

With [Mountain Duck](https://mountainduck.io/) 5, a new storage-independent versioning option is available for protocols that do not provide native file history, including FTP, SFTP, WebDAV, and OpenStack Swift.

Custom versioning helps protect against file loss by stashing changes to a file in a versioned folder on the server before an overwrite happens. The option can be enabled per bookmark or set by default in Preferences under the Versions tab.

Use [Info → Versions](https://docs.cyberduck.io/) to browse file history, preview earlier versions, delete them, or restore them. Previous versions are also stored in a folder named `.duckversions` next to the file.

More information about the setting is available in the [Mountain Duck documentation](https://docs.mountainduck.io/).
