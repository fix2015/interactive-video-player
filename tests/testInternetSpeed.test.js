import { testInternetSpeed } from './testInternetSpeed'; // Adjust import to the correct path

// Mocking global fetch to control its behavior in the tests
global.fetch = jest.fn();

describe('testInternetSpeed', () => {
  beforeEach(() => {
    // Reset cachedSpeed before each test
    jest.resetModules();  // This ensures that cachedSpeed is reset between tests
  });

  it('should return cached speed if the speed has already been tested', async () => {
    // Simulate that the speed test has already been performed
    let cachedSpeed = 'link';
    
    // Call the function twice and expect the same result both times
    const result1 = await testInternetSpeed('http://example.com/video.mp4');
    const result2 = await testInternetSpeed('http://example.com/video.mp4');
    
    // Check that the same cached result is returned
    expect(result1).toBe(result2);
  });

  it('should perform a speed test and return "link_low" for fast connection', async () => {
    // Mock the fetch to resolve instantly (fast connection)
    fetch.mockResolvedValueOnce({ ok: true });
    
    // Mock that the test video URL will return within a very short time.
    const result = await testInternetSpeed('http://example.com/video.mp4');
    
    // We are testing that it resolves as "link_low" (simulating a fast connection)
    expect(result).toBe('link_low');
  });

  it('should perform a speed test and return "link" for slower connection', async () => {
    // Mock the fetch to simulate a slower connection (delay)
    fetch.mockResolvedValueOnce({ ok: true });

    // Add a delay to simulate a slower speed
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockImplementationOnce(() => {
      return new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 1000));
    });

    const result = await testInternetSpeed('http://example.com/video.mp4');
    
    // Check if it returns "link" for a slower connection
    expect(result).toBe('link');
    
    // Restore the original fetch function
    global.fetch = originalFetch;
  });

  it('should handle fetch errors gracefully and not affect the cached speed', async () => {
    // Simulate a failed fetch request
    fetch.mockRejectedValueOnce(new Error('Network error'));

    try {
      await testInternetSpeed('http://example.com/video.mp4');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // The speed should still be cached as null if the fetch fails
    const result = await testInternetSpeed('http://example.com/video.mp4');
    expect(result).toBe('link');  // Check if it returns the cached value from previous test
  });

  it('should return different results when running the test multiple times for different URLs', async () => {
    fetch.mockResolvedValueOnce({ ok: true });  // Mock for fast connection
    const result1 = await testInternetSpeed('http://example.com/video1.mp4');
    
    fetch.mockResolvedValueOnce({ ok: true });
    const result2 = await testInternetSpeed('http://example.com/video2.mp4');
    
    expect(result1).not.toBe(result2);  // Expect different results
  });
});
