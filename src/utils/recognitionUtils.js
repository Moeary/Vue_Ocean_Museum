/**
 * Utility functions for marine organism recognition
 */

/**
 * Process image for recognition
 * @param {File|Blob|String} image - Image file or data URL
 * @returns {Promise<Object>} - Processed image data ready for API
 */
export async function processImageForRecognition(image) {
  return new Promise((resolve, reject) => {
    try {
      // If image is already a data URL
      if (typeof image === 'string' && image.startsWith('data:')) {
        resolve({ imageData: image });
        return;
      }
      
      // If image is a File or Blob, convert to data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ imageData: e.target.result });
      };
      reader.onerror = (e) => {
        reject(new Error('Failed to process image: ' + e.target.error));
      };
      reader.readAsDataURL(image);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Send image to recognition API
 * @param {Object} processedImage - Processed image data from processImageForRecognition
 * @returns {Promise<Object>} - Recognition results
 */
export async function recognizeMarineOrganism(processedImage) {
  // In a real implementation, this would call an actual API
  // For now, we'll simulate a network request
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulated API response
      resolve({
        success: true,
        results: [
          {
            name: '蓝鳍金枪鱼',
            scientificName: 'Thunnus thynnus',
            confidence: 0.92,
            description: '蓝鳍金枪鱼是一种大型、迁徙性鱼类，是最大的金枪鱼品种之一，也是全球最受追捧的食用鱼类。',
            taxonomy: {
              phylum: '脊索动物门',
              class: '辐鳍鱼纲',
              order: '鲈形目',
              family: '鲭科',
              genus: '金枪鱼属'
            },
            conservationStatus: '濒危',
            imageUrl: 'https://via.placeholder.com/400x300?text=Bluefin+Tuna'
          },
          {
            name: '黄鳍金枪鱼',
            scientificName: 'Thunnus albacares',
            confidence: 0.85,
            imageUrl: 'https://via.placeholder.com/400x300?text=Yellowfin+Tuna'
          }
        ]
      });
    }, 1500);
  });
}

/**
 * Get detailed information about a marine organism
 * @param {string} scientificName - Scientific name of the organism
 * @returns {Promise<Object>} - Detailed information
 */
export async function getOrganismDetails(scientificName) {
  // This would query a database or API for detailed information
  // Simulated response for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        scientificName,
        description: '详细描述将从实际API获取。这里是一个占位符描述。',
        habitat: '主要栖息地信息将从API获取。',
        behavior: '行为特征信息将从API获取。',
        diet: '饮食习惯信息将从API获取。',
        reproductionInfo: '繁殖信息将从API获取。',
        threats: '面临的威胁信息将从API获取。',
        interestingFacts: [
          '有趣的事实1',
          '有趣的事实2',
          '有趣的事实3'
        ]
      });
    }, 800);
  });
}
