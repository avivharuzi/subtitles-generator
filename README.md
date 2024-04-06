<div align="center">
  <h1>subtitles-generator</h1>
  <p>Generate subtitles easily with ffmpeg and whisper.</p>
  <p>    
    <img alt="NPM" src="https://img.shields.io/npm/v/subtitles-generator?style=for-the-badge">
    <img alt="GitHub" src="https://img.shields.io/github/license/avivharuzi/subtitles-generator?style=for-the-badge">
  </p>
  <p>
    <a href="https://github.com/avivharuzi/subtitles-generator/issues">Report Bug</a>
    ·
    <a href="https://github.com/avivharuzi/subtitles-generator/issues">Request Feature</a>
  </p>
</div>

---

## 📖 Table of Contents

- [Features](#-Features)
- [Prerequisites](#-Prerequisites)
- [Installation](#-Installation)
- [Usage](#-Usage)
- [License](#-License)

## ✨ Features

✅ Can be used via CLI or in code

✅ Support video or audio files as input

## 🎯 Prerequisites

- [ffmpeg](https://ffmpeg.org) (ffmpeg will be used as to generate wav file from the video file)

## 🛠️ Installation

Using via code (for CLI no need to install locally).

> NOTE: The package is using esm modules!

Install the package locally.

```
npm i subtitles-generator
```

Basic example.

```ts
import { subtitlesGenerator } from 'subtitles-generator';

await subtitlesGenerator('something.mp4');
```

With options.

```ts
import { subtitlesGenerator } from 'subtitles-generator';

const srtFilePath = await subtitlesGenerator('something.mp4', {
  outputFilePath: './',
  modelType: 'base.en',
  shouldTryToDownloadModel: true,
  language: 'en',
  translateToEnglish: false,
});

console.log(srtFilePath); // 'something.srt'
```

## ⚡️ Usage

Using via CLI.

```sh
npx subtitles-generator --help
```

Create srt file from mp4 file.

```sh
npx subtitles-generator -i something.mp4 -m base.en
```

## 📜 License

[MIT](LICENSE)
