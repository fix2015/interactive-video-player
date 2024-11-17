import VideoPlayer from './video-player';
import DOMElements from './dom-elements';
import FlowButtonGenerator from './flow-button-generator';
import InternetSpeedTester from './test-internet-speed';

jest.mock('./dom-elements');
jest.mock('./flow-button-generator');
jest.mock('./test-internet-speed');

// Mock the config file
const mockConfig = {
  VIDEO: {
    INTRO: [
      { order: 1, link: 'video1.mp4', poster: 'poster1.jpg' },
      { order: 2, link: 'video2.mp4', poster: 'poster2.jpg' },
    ],
    OTHER: [
      { order: 1, link: 'video3.mp4', poster: 'poster3.jpg' },
    ],
  },
  testSpeedLink: 'http://example.com/test-speed',
  startFlow: 'INTRO',
};

describe('VideoPlayer', () => {
  let videoPlayer;
  let wrapper;
  let mockSpeedTester;

  beforeEach(() => {
    // Mock the wrapper element (usually document.body)
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);

    // Mock the speed tester class methods
    mockSpeedTester = new InternetSpeedTester();
    mockSpeedTester.testSpeed = jest.fn();

    // Create an instance of VideoPlayer with mock config
    videoPlayer = new VideoPlayer(wrapper, mockConfig);

    // Reset mocks between tests
    jest.clearAllMocks();
  });

  it('should initialize correctly and set up DOM elements', () => {
    // Check if DOM elements are initialized
    expect(DOMElements).toHaveBeenCalled();
    expect(FlowButtonGenerator).toHaveBeenCalledWith(
      'INTRO', 
      expect.any(Function), 
      mockConfig.VIDEO, 
      expect.any(HTMLElement)
    );
    expect(videoPlayer.currentFlow).toBe('INTRO');
  });

  it('should prepare files and select video quality based on internet speed', async () => {
    mockSpeedTester.testSpeed.mockResolvedValueOnce('link_low');  // Simulating fast internet speed
    
    const files = await videoPlayer.prepareFiles('INTRO');
    
    expect(files).toHaveLength(2);  // Ensure we get two video files
    expect(files[0].link).toBe('video1.mp4');  // The link should match the correct one for 'link_low'
    expect(mockSpeedTester.testSpeed).toHaveBeenCalled();
  });

  it('should run flow and update video files', async () => {
    mockSpeedTester.testSpeed.mockResolvedValueOnce('link');  // Simulating slower internet speed
    
    // Prepare files for a given flow
    await videoPlayer.runFlow('OTHER');
    
    expect(videoPlayer.videoFiles).toHaveLength(1);  // Only one file in the OTHER flow
    expect(videoPlayer.videoFiles[0].link).toBe('video3.mp4');  // Ensure correct video file is chosen
  });

  it('should play the video at the specified index', () => {
    const playSpy = jest.spyOn(videoPlayer.domElements.videoElement, 'play');
    
    videoPlayer.playVideo(0);
    
    // Ensure the video element is set with correct attributes
    expect(videoPlayer.domElements.videoElement.src).toBe('video1.mp4');
    expect(playSpy).toHaveBeenCalled();
  });

  it('should handle video end event and go to the next video', async () => {
    videoPlayer.currentVideoIndex = 0;
    videoPlayer.videoFiles = [
      { link: 'video1.mp4', poster: 'poster1.jpg' },
      { link: 'video2.mp4', poster: 'poster2.jpg' }
    ];

    const nextSpy = jest.spyOn(videoPlayer, 'loadAndPlayVideo');
    
    // Simulate the 'ended' event
    videoPlayer.handleVideoEnd();
    
    // Ensure the video index is incremented and the next video is loaded
    expect(videoPlayer.currentVideoIndex).toBe(1);
    expect(nextSpy).toHaveBeenCalled();
  });

  it('should adjust video height according to aspect ratio', () => {
    const videoElement = videoPlayer.domElements.videoElement;
    videoElement.clientWidth = 600;  // Mock the video element width
    videoPlayer.adjustVideoHeight();
    
    // Expect the height to be calculated based on the aspect ratio
    expect(videoElement.height).toBeCloseTo(600 / 0.460093896713615);
  });

  it('should destroy the video player and clean up resources', () => {
    const removeSpy = jest.spyOn(videoPlayer.domElements.videoElement, 'removeEventListener');
    
    videoPlayer.destroy();
    
    // Ensure event listeners are removed and resources cleaned up
    expect(removeSpy).toHaveBeenCalledTimes(2);  // play and ended listeners
    expect(videoPlayer.videoFiles).toEqual([]);
    expect(videoPlayer.currentVideoIndex).toBe(0);
  });
});
