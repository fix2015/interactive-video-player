let cachedSpeed = null;

/**
 * Tests the internet speed by fetching a sample video file.
 * If the test has already been performed, returns the cached result.
 * @param {string} url - The URL of the video file to fetch for testing speed.
 * @returns {Promise<string>} The quality of the video file to use ('link_low' or 'link').
 */
export const testInternetSpeed = async (url) => {
  // If we've already tested the speed, return the cached result
  if (cachedSpeed !== null) {
    return cachedSpeed;
  }

  // Perform the speed test
  const start = Date.now();
  await fetch(url);
  const end = Date.now();
  const duration = (end - start) / 1000;

  // Determine the speed quality based on the duration
  cachedSpeed = duration < 10 ? 'link_low' : 'link';
  return cachedSpeed;
};
