import DOMElements from '../src/dom-elements';

describe('DOMElements Class', () => {
  let wrapper;
  let domElements;

  beforeEach(() => {
    // Set up a mock wrapper element to attach the DOM elements
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
    domElements = new DOMElements(wrapper);
  });

  afterEach(() => {
    // Clean up after each test to avoid memory leaks or leftover DOM elements
    document.body.innerHTML = '';
  });

  it('should create and append the container element', () => {
    expect(domElements.container).toBeInTheDocument();
    expect(domElements.container).toHaveClass('video-player-container');
    expect(wrapper.contains(domElements.container)).toBe(true);
  });

  it('should create and append the video element', () => {
    expect(domElements.videoElement).toBeInTheDocument();
    expect(domElements.videoElement).toHaveAttribute('id', 'video');
    expect(domElements.container.contains(domElements.videoElement)).toBe(true);
  });

  it('should create and append the canvas element', () => {
    expect(domElements.canvas).toBeInTheDocument();
    expect(domElements.canvas).toHaveAttribute('id', 'canvas');
    expect(domElements.container.contains(domElements.canvas)).toBe(true);
  });

  it('should create and append the play button', () => {
    expect(domElements.playButton).toBeInTheDocument();
    expect(domElements.playButton).toHaveAttribute('id', 'playButton');
    expect(domElements.playButton).toHaveTextContent('Play');
    expect(domElements.container.contains(domElements.playButton)).toBe(true);
  });

  it('should create and append the loading indicator', () => {
    expect(domElements.loading).toBeInTheDocument();
    expect(domElements.loading).toHaveAttribute('id', 'loading');
    expect(domElements.loading).toHaveTextContent('Loading...');
    expect(domElements.container.contains(domElements.loading)).toBe(true);
    expect(domElements.loading.style.display).toBe('none'); // Initially hidden
  });

  it('should toggle the visibility of the loading indicator', () => {
    domElements.toggleLoadingIndicator(true);
    expect(domElements.loading.style.display).toBe('block');
    
    domElements.toggleLoadingIndicator(false);
    expect(domElements.loading.style.display).toBe('none');
  });

  it('should toggle the visibility of the play button', () => {
    domElements.togglePlayButton(true);
    expect(domElements.playButton.style.display).toBe('block');
    
    domElements.togglePlayButton(false);
    expect(domElements.playButton.style.display).toBe('none');
  });

  it('should reset the canvas size to zero', () => {
    domElements.canvas.width = 500;
    domElements.canvas.height = 500;
    
    domElements.resetCanvas();
    
    expect(domElements.canvas.width).toBe(0);
    expect(domElements.canvas.height).toBe(0);
  });

  it('should set the canvas size to match the video element', () => {
    domElements.videoElement.clientWidth = 640;
    domElements.videoElement.clientHeight = 360;
    
    domElements.setCanvasSize();
    
    expect(domElements.canvas.style.width).toBe('640px');
    expect(domElements.canvas.style.height).toBe('360px');
    expect(domElements.canvas.width).toBe(640);
    expect(domElements.canvas.height).toBe(360);
  });
});
