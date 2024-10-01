## Macord
An electron wrapper for Discord web app with tray icon, which can show amount (or presence) of unread messages.

## Installation
```bash
npm i
```

## Launch in dev mode
```bash
npm run start
```

## Build
```bash
npm run make
```
then copy zip from `out/make/zip/darwin/arm64/Macord-darwin-arm64-<VERSION>.zip` to your preffered location,
unzip, and copy `Macord.app` executable to `Applications` directory.

## Known issues
- tested only on MacOS (most likely won't work in Windows or Linux)
- screen sharing is not working for now
