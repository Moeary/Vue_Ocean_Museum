<template>
  <div class="recognition-container">
    <el-row>
      <el-col :span="24">
        <div class="page-header">
          <h1>海洋生物识别</h1>
          <p>上传图片，AI将帮您识别海洋生物并提供详细信息</p>
        </div>
      </el-col>
    </el-row>
    
    <div :class="['content-wrapper', {'overlay-mode': isOverlayMode}]">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="isOverlayMode ? 24 : 12" :lg="isOverlayMode ? 24 : 12" :xl="isOverlayMode ? 24 : 12">
          <div class="upload-section" :class="{'clickable': recognitionResult}" @click="toggleViewMode">
            <el-upload
              class="image-uploader"
              action="#"
              :http-request="handleImageUpload"
              :show-file-list="false"
              :before-upload="beforeUpload"
              accept="image/*"
            >
              <img v-if="imageUrl" :src="imageUrl" class="uploaded-image" />
              <el-icon v-else class="upload-icon"><Upload /></el-icon>
              <div class="el-upload__text" v-if="!imageUrl">
                拖拽图片到此处，或 <em>点击上传</em>
              </div>
            </el-upload>
            
            <el-button 
              type="primary" 
              :disabled="!imageUrl" 
              @click.stop="recognizeImage" 
              :loading="loading"
              class="recognize-button"
              v-show="!isOverlayMode || !recognitionResult"
            >
              开始识别
            </el-button>
          </div>
        </el-col>
        
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-show="!isOverlayMode">
          <div class="result-section" v-if="recognitionResult">
            <div class="result-header">
              <h2>识别结果</h2>
              <el-button type="text" @click="toggleViewMode" class="view-toggle-btn">
                <el-icon><FullScreen /></el-icon>
              </el-button>
            </div>
            
            <div class="result-content markdown-body" v-html="recognitionResult"></div>
          </div>
          
          <div v-else-if="loading" class="placeholder-content">
            <el-skeleton :rows="10" animated />
          </div>
          
          <div v-else class="placeholder-content">
            <div class="placeholder-icon">
              <el-icon><InfoFilled /></el-icon>
            </div>
            <h3>上传图片开始识别</h3>
            <p>支持常见图片格式: JPEG, PNG, WebP</p>
            <p>图片清晰度越高，识别准确度越高</p>
          </div>
        </el-col>
      </el-row>
      
      <div class="overlay-result" v-if="isOverlayMode && recognitionResult">
        <div class="result-floating-card">
          <div class="result-header">
            <h2>识别结果</h2>
            <el-button type="text" @click="toggleViewMode" class="view-toggle-btn">
              <el-icon><SwitchButton /></el-icon>
            </el-button>
          </div>
          <div class="result-content markdown-body" v-html="recognitionResult"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue';
import { Upload, InfoFilled, FullScreen, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from 'marked';

export default defineComponent({
  name: 'MarineRecognition',
  components: {
    Upload,
    InfoFilled,
    FullScreen,
    SwitchButton
  },
  setup() {
    const imageUrl = ref('');
    const loading = ref(false);
    const recognitionResult = ref(null);
    const isOverlayMode = ref(false);
    
    // Toggle between split view and overlay view
    const toggleViewMode = () => {
      if (recognitionResult.value) {
        isOverlayMode.value = !isOverlayMode.value;
      }
    };
    
    // Initialize Google Generative AI with proper environment variable access
    const apiKey = process.env.VUE_APP_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('Gemini API key not found! Please check your environment variables.');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 检查文件类型和大小
    const beforeUpload = (file) => {
      const isImage = file.type.startsWith('image/');
      const isLt5M = file.size / 1024 / 1024 < 5;
      
      if (!isImage) {
        ElMessage.error('只能上传图片文件!');
        return false;
      }
      if (!isLt5M) {
        ElMessage.error('图片大小不能超过 5MB!');
        return false;
      }
      return true;
    };
    
    // 处理图片上传
    const handleImageUpload = (options) => {
      const file = options.file;
      // 使用FileReader预览图片
      const reader = new FileReader();
      reader.onload = (e) => {
        imageUrl.value = e.target.result;
      };
      reader.readAsDataURL(file);
    };
    
    // Use Google Generative AI for image recognition
    const recognizeImage = async () => {
      if (!imageUrl.value) {
        ElMessage.warning('请先上传图片');
        return;
      }
      
      loading.value = true;
      
      try {
        // Get base64 image data without the prefix
        const imageData = imageUrl.value.split(',')[1];
        
        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        // Create image part with inline data
        const imagePart = {
          inlineData: {
            data: imageData,
            mimeType: "image/jpeg" // Assuming JPEG, could be dynamic based on upload
          }
        };
        
        // Simplified prompt for marine species identification
        const prompt = `
        分析这张图片中的海洋生物。
        请用中文回答，直接提供以下信息,不要出现像"好的,我来帮你识别这张图片中的生物"和"希望我的上述答案对你有帮助"这样的开头语和结尾语这样的话,只需要提供下面的回答即可：

        # 名称
        # 学名
        # 简介
        # 分类
        # 生态信息
        # 分布区域
        # 保护状态
        `;
        
        // Generate content
        const result = await model.generateContent([prompt, imagePart]);
        const textResponse = result.response.text();
        console.log("AI Response:", textResponse);
        
        // Convert markdown to HTML and set as result
        recognitionResult.value = marked(textResponse);
        
        // Automatically switch to overlay mode when result is ready
        isOverlayMode.value = true;
      } catch (error) {
        console.error("Recognition error:", error);
        ElMessage.error("识别失败: " + (error.message || "未知错误"));
      } finally {
        loading.value = false;
      }
    };

    return {
      imageUrl,
      loading,
      recognitionResult,
      isOverlayMode,
      beforeUpload,
      handleImageUpload,
      recognizeImage,
      toggleViewMode
    };
  }
});
</script>

<style scoped>
.recognition-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 80px;
}

.content-wrapper {
  position: relative;
  transition: all 0.5s ease;
}

.overlay-mode {
  min-height: 600px;
}

.upload-section {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.upload-section.clickable {
  cursor: pointer;
}

.upload-section.clickable:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-uploader {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
  background-color: #ffffff;
  min-height: 300px;
}

.image-uploader:hover {
  border-color: #409EFF;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.recognize-button {
  width: 100%;
  margin-top: 20px;
  height: 50px;
  font-size: 16px;
}

.result-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: all 0.3s ease;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
}

.overlay-result {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10;
  border-radius: 8px;
  animation: fadeIn 0.3s ease;
}

.result-floating-card {
  background-color: white;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.view-toggle-btn {
  font-size: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Keep existing styles */
.result-content {
  padding: 10px;
}

.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  line-height: 1.6;
}

/* ...existing markdown styling... */

@media (max-width: 768px) {
  .upload-section, .result-section, .placeholder-content {
    margin-bottom: 20px;
  }
  
  .result-floating-card {
    width: 95%;
    max-height: 70vh;
  }
}
</style>
