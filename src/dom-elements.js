/**
 * A class responsible for managing and providing references to the DOM elements needed
 * for video player functionality, which are created and appended dynamically.
 */
class DOMElements {
    /**
     * Initializes the DOM elements, creates necessary HTML elements, 
     * and appends them to a container.
     */
    constructor(wrapper) {
      this.wrapper = wrapper;
      this.container = this.createContainer();
      this.videoElement = this.createVideoElement();
      this.canvas = this.createCanvasElement();
      this.ctx = this.canvas.getContext('2d');
      this.playButton = this.createPlayButton();
      this.loading = this.createLoadingIndicator();
  
      // Append the container to the body or any other parent element
      this.wrapper.appendChild(this.container);
    }
  
    /**
     * Creates the main container for all video player elements.
     * @returns {HTMLElement} The container element.
     */
    createContainer() {
      const container = document.createElement('div');
      container.classList.add('video-player-container');
      return container;
    }
  
    /**
     * Creates the video element.
     * @returns {HTMLVideoElement} The video element.
     */
    createVideoElement() {
      const video = document.createElement('video');
      video.id = 'video';
      this.container.appendChild(video);
      return video;
    }
  
    /**
     * Creates the canvas element.
     * @returns {HTMLCanvasElement} The canvas element.
     */
    createCanvasElement() {
      const canvas = document.createElement('canvas');
      canvas.id = 'canvas';
      this.container.appendChild(canvas);
      return canvas;
    }
  
    /**
     * Creates the play button element.
     * @returns {HTMLButtonElement} The play button element.
     */
    createPlayButton() {
      const playButton = document.createElement('button');
      playButton.id = 'playButton';
      playButton.textContent = 'Play';
      this.container.appendChild(playButton);
      return playButton;
    }
  
    /**
     * Creates the loading indicator element.
     * @returns {HTMLDivElement} The loading indicator element.
     */
    createLoadingIndicator() {
      const loading = document.createElement('div');
      loading.id = 'loading';
      loading.style.display = 'none'; // Hidden by default
      loading.textContent = 'Loading...';
      this.container.appendChild(loading);
      return loading;
    }
  
    /**
     * Resets the canvas element by clearing its width and height.
     */
    resetCanvas() {
      this.canvas.width = 0;
      this.canvas.height = 0;
    }
  
    /**
     * Toggles the visibility of the loading indicator.
     * @param {boolean} isVisible - True to show, false to hide the loading indicator.
     */
    toggleLoadingIndicator(isVisible) {
      this.loading.style.display = isVisible ? 'block' : 'none';
    }
  
    /**
     * Toggles the visibility of the play button.
     * @param {boolean} isVisible - True to show, false to hide the play button.
     */
    togglePlayButton(isVisible) {
      this.playButton.style.display = isVisible ? 'block' : 'none';
    }
  
    /**
     * Sets the canvas size to match the video element's size.
     */
    setCanvasSize() {
      this.canvas.style.width = `${this.videoElement.clientWidth}px`;
      this.canvas.style.height = `${this.videoElement.clientHeight}px`;
      this.canvas.width = this.videoElement.clientWidth;
      this.canvas.height = this.videoElement.clientHeight;
    }
  }
  
  export default DOMElements;
  