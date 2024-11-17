/**
 * Class responsible for testing internet speed by fetching a video file.
 * The result of the speed test is cached to avoid redundant requests.
 */
class InternetSpeedTester {
    /**
     * Creates an instance of the InternetSpeedTester class.
     * Initializes the cache for the speed test result.
     */
    constructor() {
      this.cachedSpeed = null;
    }
  
    /**
     * Tests the internet speed by fetching a sample video file.
     * If the test has already been performed and the result is cached,
     * it returns the cached result to avoid making another request.
     *
     * @param {string} url - The URL of the video file to fetch for testing speed.
     * @returns {Promise<string>} A promise that resolves to the quality of the video file to use.
     *                            The result can be either 'link_low' or 'link'.
     */
    async testSpeed(url) {
      // If we've already tested the speed, return the cached result
      if (this.cachedSpeed !== null) {
        return this.cachedSpeed;
      }
  
      // Perform the speed test by fetching the video file
      const start = Date.now();
      await fetch(url);
      const end = Date.now();
      const duration = (end - start) / 1000;
  
      // Determine the speed quality based on the duration
      this.cachedSpeed = duration < 10 ? 'link_low' : 'link';
      return this.cachedSpeed;
    }
  
    /**
     * Resets the cached speed test result.
     * This method clears the stored speed result, allowing for a fresh test the next time.
     */
    resetCache() {
      this.cachedSpeed = null;
    }
  }
  
  export default InternetSpeedTester;
  