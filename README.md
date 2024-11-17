# Interactive Video Animation Player

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Explanation of Config](#explanation-of-config)
  - [VIDEO: Contains video flows such as `"INTRO"`](#video-contains-video-flows-such-as-intro)
  - [testSpeedLink: A URL for Testing Internet Speed](#testspeedlink-a-url-for-testing-internet-speed)
  - [startFlow: The Initial Flow to Play](#startflow-the-initial-flow-to-play)
- [Usage](#usage)
- [Generate Posters](#generate-posters)
- [License](#license)

## Introduction

The **Interactive Video Animation Player** is a powerful library designed to create interactive video animations by seamlessly stitching together different video clips. This repository allows you to combine multiple video files into a cohesive animation or interactive game. It works across all major browsers, features caching to reduce buffering, and adjusts the video quality based on the user's internet speed.

With just one click, you can create an interactive game, control video playback, and even display dynamic video flows with interactive buttons. The player will automatically select a lower video quality if the internet speed is slow to ensure smooth playback, making it ideal for a wide range of users with varying network conditions.

## Features

- **Interactive Video Animations**: Combine multiple video clips into an interactive animation or branching game. Create rich experiences with minimal setup.
- **Cross-browser Compatibility**: Fully functional across all modern browsers (Chrome, Firefox, Safari, Edge).
- **Caching & Buffering**: Utilizes caching to minimize buffering, ensuring smooth and faster video playback.
- **Dynamic Video Quality Adjustment**: The player detects internet speed and automatically adjusts video quality (low or high) based on the user's connection.
- **Seamless Playback Flow**: Automatically progresses through video clips and triggers events when certain points in the video are reached.
- **Create Interactive Games**: With a simple configuration, you can create interactive games that use video content as the primary medium, enabling decision points, user interaction, and more.
- **Easy Integration**: Easily integrate with your web projects using just a few lines of code.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/interactive-video-player.git
   ```

2. **Navigate to the project folder:**

   ```bash
   cd interactive-video-player
   ```

3. **Install the dependencies using npm:**

   ```bash
   npm install
   ```

4. **Run the project:**

   ```bash
   npm start
   ```

## Configuration

The project uses a `config.json` file for configuration, which allows you to define video content, internet speed testing, and the video flow sequence. Below are the key configuration settings:

### Explanation of Config

The `config.json` file contains the following settings:

#### VIDEO: Contains video flows such as `"INTRO"`

The `VIDEO` section contains video files for each flow. A flow represents a sequence of videos (e.g., intro videos, game sequences, etc.) that are played in a defined order. You can configure multiple video files for each flow with URLs for each quality (low and high).

Example:
```json
{
  "VIDEO": {
    "INTRO": [
      {
        "link_low": "video/intro_low.mp4",
        "link": "video/intro_high.mp4",
        "poster": "images/intro_poster.jpg",
        "order": 1
      },
      {
        "link_low": "video/intro_part2_low.mp4",
        "link": "video/intro_part2_high.mp4",
        "poster": "images/intro_part2_poster.jpg",
        "order": 2
      }
    ]
  }
}
```

#### testSpeedLink: A URL for Testing Internet Speed

The `testSpeedLink` is a URL to a small video file used for testing the user's internet speed. The player uses this URL to determine whether to serve a low-quality or high-quality video based on the detected speed.

Example:
```json
{
  "testSpeedLink": "https://example.com/test-speed-video.mp4"
}
```

#### startFlow: The Initial Flow to Play

The `startFlow` setting defines the initial flow that starts playing when the video player is initialized. You can set this to any of the available video flow names.

Example:
```json
{
  "startFlow": "INTRO"
}
```

## Usage

1. **Initialize the Video Player**

   Once you've configured the `config.json` file, initialize the video player by passing the configuration and a wrapper element for the player:

   ```js
   const wrapper = document.body;
   const videoPlayer = new VideoPlayer(wrapper, config);
   ```

2. **Control Video Playback**

   You can interact with the video player through various methods like:

   - **Play a Video:**
     ```js
     videoPlayer.playVideo(index);  // Plays the video at the specified index
     ```

   - **Load and Play the Next Video:**
     ```js
     videoPlayer.handleVideoEnd();  // Moves to the next video in the sequence
     ```

3. **Generate Flow Buttons**

   For interactive game or branching scenarios, generate flow buttons that allow the user to navigate between different video flows:

   ```js
   videoPlayer.flowButtonGenerator.generate();
   ```

## Generate Posters

A powerful feature of this library is the ability to generate posters for your video files automatically. This ensures that users do not encounter any blinking or white screens between videos, as the poster is pre-generated from the first frame of each video.

If you'd like to generate posters, you can use a separate repository called **[generate_poster](https://github.com/your-username/generate_poster)**, which provides a simple Bash script to automatically extract the first frame from each video and save it as a poster image.

### Steps to Generate Posters:

1. **Clone the `generate_poster` Repository**

   First, clone the **[generate_poster](https://github.com/your-username/generate_poster)** repository:

   ```
   git clone https://github.com/your-username/generate_poster.git
   ```

2. **Navigate to the Project Folder**

   After cloning, navigate to the `generate_poster` project folder:

   ```
   cd generate_poster
   ```

3. **Run the Script to Generate Posters**

   The repository contains a Bash script (`generate_poster.sh`) that will automatically extract the first frame from each `.mp4` video in the directory and save it as a `.jpg` image. Run the script with:

   ```
   bash generate_poster.sh
   ```

   This script will find all `.mp4` video files in the current folder, extract the first frame from each, and save it as a `.jpg` file with the same name as the video (e.g., `video.mp4` will generate `video_poster.jpg`).

### How it Works:

- The script uses `ffmpeg` to extract the first frame of each `.mp4` video.
- The first frame is saved as a `.jpg` image in the same folder as the video, with the `_poster` suffix added to the filename.
- This process allows you to generate high-quality posters to be used in your interactive video player.

## License

MIT License
