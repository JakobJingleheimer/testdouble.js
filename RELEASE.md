# Cutting a release for testdouble to npm

## Verify your environment

To release to npm, testdouble has quite a lot going on in its `preversion`, `version`,
and `postversion` scripts. First, you'll want to make sure your environment is happy
enough:

```
$ npm install
$ npm run test:ci
$ echo $?
```

This should pass within a couple minutes and print 0 afterward, indicating it exited
cleanly.

## Pre-flight checklist

Before releasing, make sure:

- [ ] You're on the `main` branch and have a clean working directory
- [ ] It's in sync with `origin/main` (e.g `git pull` status indicates up-to-date)
- [ ] `npm run test:ci` passes

## Publishing a release:

To publish a release, just bump the appropriate version segment:

```
$ npm version patch #<-- or "minor" or "major"
```

This will run a full build, tag the release, push everything to github, update CHANGELOG.md, and publish to npm.

## If something goes wrong

If anything goes wrong, odds are good that they went wrong before you published to npm, since that's the last
step.  You'll probably find you need to:

- [ ] reset to wherever you were prior to the attempt `git reset --hard PREVIOUS_REF` and `git push -f origin/main`
- [ ] delete the local tag `git tag -d vX.Y.Z` and remotely with `git push origin :vX.Y.Z`
- [ ] You may want to `git clean -xdf` in case any unstaged build artifacts are present before re-attempting
