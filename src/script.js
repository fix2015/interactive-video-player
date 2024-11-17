import config from './config.json';
import './style.scss';
import FlowButtonGenerator from './flow-button-generator';
import DOMElements from './dom-elements';
import InternetSpeedTester from './test-internet-speed';

const ASPECT_RATIO = 0.460093896713615;

/**
 * A class responsible for handling the video player functionality, including playing videos,
 * rendering on the canvas, managing flow button generation, and handling video preparation based on internet speed.
 */
class VideoPlayer {
  /**
   * Initializes the video player with the necessary configuration, video wrapper, and DOM elements.
   * 
   * @param {HTMLElement} wrapper - The DOM element where the video player will be attached.
   * @param {Object} config - Configuration object containing video data and settings.
   * @param {Array} config.VIDEO - A collection of video data (URLs, posters, etc.).
   * @param {string} config.testSpeedLink - A URL for testing internet speed to determine video quality.
   * @param {string} config.startFlow - The initial flow to start playing (e.g., 'INTRO').
   */
  constructor(wrapper, config) {
    const { VIDEO, testSpeedLink, startFlow } = config;
    this.VIDEO = VIDEO;
    this.testSpeedLink = testSpeedLink;
    this.startFlow = startFlow;

    this.currentFlow = this.startFlow;
    this.currentVideoIndex = 0;
    this.videoFiles = [];
    this.speedTester = new InternetSpeedTester();
    this.wrapper = wrapper;

    this.domElements = new DOMElements(this.wrapper);
    this.flowButtonGenerator = new FlowButtonGenerator(
      this.currentFlow,
      this.runFlow.bind(this),
      this.VIDEO,
      this.domElements.container
    );

    this.initialize();
  }

  /**
   * Prepares the video files for the given scene, selecting the video quality based on internet speed.
   * If internet speed is available, it tests the speed and chooses the appropriate video quality.
   * 
   * @param {string} scene - The name of the scene to load video files for.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of video objects with the selected quality.
   */
  async prepareFiles(scene) {
    const quality = this.testSpeedLink 
      ? await this.speedTester.testSpeed(this.testSpeedLink) 
      : 'link';

    return this.VIDEO[scene].map(video => ({
      ...video,
      link: video[quality],
    }));
  }

  /**
   * Runs a video flow by preparing video files and appending them to the current video list.
   * 
   * @param {string} name - The name of the flow to run.
   */
  async runFlow(name) {
    const cache = await this.prepareFiles(name);
    cache.sort((a, b) => a.order - b.order);
    this.videoFiles[this.currentVideoIndex].loop = false;
    this.videoFiles.push(...cache);
  }

  /**
   * Plays the video at the specified index in the videoFiles array.
   * 
   * @param {number} index - The index of the video to play.
   */
  playVideo(index) {
    if (index < this.videoFiles.length) {
      const { link, poster } = this.videoFiles[index];
      this.domElements.videoElement.poster = poster;
      this.domElements.videoElement.src = link;
      this.domElements.videoElement.play();
    }
  }

  /**
   * Handles the video end event, either advancing to the next video or generating flow buttons if the video is looped.
   */
  async handleVideoEnd() {
    if (!this.videoFiles[this.currentVideoIndex]) return;

    if (!this.isLoopedVideo(this.currentVideoIndex)) {
      this.currentVideoIndex++;
    } else {
      this.flowButtonGenerator.generate();
    }

    this.loadAndPlayVideo();
  }

  /**
   * Loads and plays the next video while adjusting the canvas and video element sizes.
   */
  loadAndPlayVideo() {
    this.playVideo(this.currentVideoIndex);

    this.domElements.videoElement.height = this.domElements.videoElement.clientWidth / ASPECT_RATIO;

    if (this.currentVideoIndex === 0) {
      this.domElements.canvas.style.width = `${this.domElements.videoElement.clientWidth}px`;
      this.domElements.canvas.style.height = `${this.domElements.videoElement.clientHeight}px`;
      this.domElements.canvas.width = this.domElements.videoElement.clientWidth;
      this.domElements.canvas.height = this.domElements.videoElement.clientHeight;
    }
  }

  /**
   * Renders the current video frame on the canvas at 60 FPS.
   */
  renderVideoOnCanvas() {
    this.domElements.ctx.drawImage(this.domElements.videoElement, 0, 0, this.domElements.canvas.width, this.domElements.canvas.height);
    requestAnimationFrame(this.renderVideoOnCanvas.bind(this));
  }

  /**
   * Initializes the video player by preparing video files, setting up event listeners,
   * and displaying the initial loading screen and play button.
   */
  async initialize() {
    this.domElements.toggleLoadingIndicator(true);
    this.videoFiles = await this.prepareFiles(this.currentFlow);
    this.videoFiles.sort((a, b) => a.order - b.order);
    this.domElements.toggleLoadingIndicator(false);
    this.domElements.togglePlayButton(true);

    this.domElements.videoElement.addEventListener('play', () => {
      this.domElements.setCanvasSize();
      requestAnimationFrame(this.renderVideoOnCanvas.bind(this));
    });

    this.domElements.videoElement.addEventListener('ended', this.handleVideoEnd.bind(this));

    this.domElements.playButton.addEventListener('click', () => {
      this.adjustVideoHeight();
      this.domElements.togglePlayButton(false);
      this.playVideo(this.currentVideoIndex);
    });
  }

  /**
   * Adjusts the video height to maintain the correct aspect ratio based on the width of the video element.
   */
  adjustVideoHeight() {
    this.domElements.videoElement.height = this.domElements.videoElement.clientWidth / ASPECT_RATIO;
  }

  /**
   * Checks if the video at the specified index is a looped video.
   * 
   * @param {number} index - The index of the video to check.
   * @returns {boolean} True if the video is looped, false otherwise.
   */
  isLoopedVideo(index) {
    const { loop } = this.videoFiles[index];
    return loop;
  }

  /**
   * Destroys the video player instance by removing event listeners and cleaning up resources.
   */
  destroy() {
    this.domElements.videoElement.removeEventListener('play', this.onVideoPlay);
    this.domElements.videoElement.removeEventListener('ended', this.handleVideoEnd);
    this.domElements.playButton.removeEventListener('click', this.onPlayButtonClick);

    this.domElements.videoElement.src = '';
    this.domElements.videoElement.poster = '';

    this.domElements.resetCanvas();

    this.videoFiles = [];
    this.currentVideoIndex = 0;

    this.flowButtonGenerator.reset();
  }
}

// Initialize the video player instance with configuration and wrapper (body element)
const wrapper = document.body;
const videoPlayer = new VideoPlayer(wrapper, config);
