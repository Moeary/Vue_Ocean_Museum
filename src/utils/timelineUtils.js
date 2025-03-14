/**
 * Creates a standardized timeline event object with all necessary properties
 * 
 * @param {Object} eventData - The event data object
 * @param {string} eventData.date - Date or time period of the event
 * @param {string} eventData.title - Brief title of the event
 * @param {string} eventData.description - Short description (1-2 sentences)
 * @param {string} eventData.image - Main image URL
 * @param {string} [eventData.color] - Optional color for the timeline dot
 * @param {string} [eventData.detailedDescription] - Detailed description (about 200 words)
 * @param {Array} [eventData.detailImages] - Array of image objects for carousel
 * @param {Array} [eventData.facts] - Array of interesting facts
 * @returns {Object} Formatted timeline event object
 */
export function createTimelineEvent(eventData) {
  // Ensure required fields exist
  if (!eventData.date || !eventData.title || !eventData.description || !eventData.image) {
    console.error('Missing required fields for timeline event:', eventData);
    throw new Error('Timeline event missing required fields');
  }
  
  // Return formatted event with defaults for optional fields
  return {
    date: eventData.date,
    title: eventData.title,
    description: eventData.description,
    image: eventData.image,
    color: eventData.color || '#409EFF',
    detailedDescription: eventData.detailedDescription || null,
    detailImages: eventData.detailImages || [],
    facts: eventData.facts || [],
    expanded: false // Track expansion state
  };
}

/**
 * Adds detail data to an existing timeline event
 * 
 * @param {Object} event - Existing timeline event
 * @param {Object} detailData - Detail data to add
 * @returns {Object} Updated event with detail data
 */
export function addEventDetails(event, detailData) {
  return {
    ...event,
    detailedDescription: detailData.detailedDescription || event.detailedDescription,
    detailImages: detailData.detailImages || event.detailImages,
    facts: detailData.facts || event.facts
  };
}
