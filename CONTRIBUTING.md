# CONTRIBUTING

### Updating the Changelog
- All pull requests must have an update to [CHANGELOG.md](CHANGELOG.md).

- List changes in reverse-chronological order (newest on top).

- Changes should be grouped under any of the following categories:
    * `Added` for new features.
    * `Changed` for changes in existing functionality.
    * `Deprecated` for once stable features removed in upcoming releases.
    * `Removed` for deprecated features removed in this release.
    * `Fixed` for any bug fixes.
 
- Changes should include link to a JIRA issue where applicable.

- **Creating feature PR to develop**
    * List the change under the `New version` part of the document in the category it falls under.

- **Creating hotfix PR to master**
    * Bump up the version in the package.json file (ensure to run `npm update` to update the package-lock.json).
    * Add the new version to the top of the changelog.
    * List the change under the added version in the category it falls under

- **Creating release PR to master**
    * Bump up the version in the package.json file (ensure to run `npm update` to update the package-lock.json).
    * Add the new version to the top of the changelog.
    * Move the changes under the `New version` to the newly added version.
