# 虚拟海洋文史馆 (Vue Ocean Museum)

![海洋文史馆Logo](/public/images/logo.png)

## 项目介绍

虚拟海洋文史馆是一个使用Vue 3开发的交互式数字平台，致力于展示和保存人类与海洋互动的丰富历史。从古代文明的早期航海技术到现代的深海探索，该项目记录了那些改变世界格局的重要海洋历史事件，让用户能够通过互动方式了解海洋在人类文明发展中的重要作用。

## 作品简介

本项目结合Vue Web界面与Quest 3 VR应用，旨在打造沉浸式海洋历史文化体验。设计目标是通过Web端便捷浏览海洋文史资料，并通过VR应用深入体验海洋场景与历史事件，提升用户对海洋文明的认知与兴趣。

关键技术包括Vue 3前端框架、Vue Router路由管理、Element Plus UI组件库，以及Three.js 3D模型渲染和Quest 3 VR开发技术。

作品特色在于Web端与VR端的联动，用户可在Web端浏览信息后，通过VR设备身临其境地感受海洋历史场景，例如古代航海、沉船遗迹等。

## 特色功能

- **交互式历史时间线**: 按时间顺序展示从公元前3000年到当代的重要海洋历史事件，包含详细描述、图片和相关知识
- **海洋知识库**: 提供海洋生物学、海洋学、海洋技术、海洋保护和海洋文化等领域的专业知识
- **响应式设计**: 适配不同设备尺寸，提供最佳用户体验
- **视觉化展示**: 通过精美图片、详细解说和互动组件增强用户体验

## 技术栈

- **Vue 3**: 前端框架，使用Composition API开发
- **Vue Router**: 页面路由管理
- **Element Plus**: UI组件库
- **CSS3**: 样式和动画

## 技术应用与特色

- **Vue 3**: 使用 Vue 3 框架构建，采用 Composition API 提升代码组织性和可维护性。
- **Vue Router**: 利用 Vue Router 实现客户端路由，支持单页应用 (SPA) 的流畅导航体验。
- **Element Plus**: 采用 Element Plus UI 组件库，快速构建美观、一致的用户界面。
- **Three.js**: 使用 Three.js 库实现 3D 海洋生物模型展示，增强互动性和视觉效果。
- **Google Generative AI**: 集成 Google Generative AI 模型，实现海洋生物图像识别功能。
- **响应式设计**: 采用响应式布局，适配各种屏幕尺寸，保证在不同设备上的最佳浏览体验。
- **Markdown**: 使用 Markdown 格式化识别结果，方便展示详细信息。
- **Element Plus Icons**: 使用 Element Plus Icons 图标库，提供丰富的图标支持。
- **Axios**: 使用 Axios 库进行 HTTP 请求，与后端 API 进行数据交互。
- **.env**: 使用 .env 文件存储 API 密钥等敏感信息，提高安全性。

## 安装和运行

### 前提条件

- Node.js (v14.0.0+)
- npm 或 yarn

### 安装步骤

1. 克隆项目仓库
   ```bash
   git clone https://github.com/yourusername/vue-ocean-museum.git
   cd vue-ocean-museum
   ```

2. 安装依赖
   ```bash
   npm install
   # 或
   yarn install
   ```

3. 启动开发服务器
   ```bash
   npm run serve
   # 或
   yarn serve
   ```

4. 构建生产版本
   ```bash
   npm run build
   # 或
   yarn build
   ```

## 项目结构

```
vue-ocean-museum/
├── public/                  # 静态资源
│   ├── images/              # 图片资源
│   └── index.html           # HTML模板
├── src/
│   ├── components/          # 公共组件
│   │   ├── NavHeader.vue    # 导航栏组件
│   │   └── Timeline.vue     # 时间线组件
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── utils/               # 工具函数
│   │   └── timelineUtils.js # 时间线工具函数
│   ├── views/               # 页面组件
│   │   ├── Home.vue         # 首页
│   │   ├── IntroPage.vue    # 关于页面
│   │   ├── KnowledgeBase.vue # 知识库页面
│   │   └── TimelinePage.vue # 时间线完整页面
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── .gitignore               # Git忽略文件
├── babel.config.js          # Babel配置
├── package.json             # 包管理配置
└── README.md                # 项目说明文档
```

## 使用指南

### 首页
首页展示海洋文史馆的主要内容，包括轮播图、项目介绍和精选历史事件。用户可以通过首页了解项目概况并导航到感兴趣的内容区域。

### 历史时间线
历史时间线页面按照时间顺序展示重要海洋历史事件。用户可以：
* 查看事件的简要描述
* 点击事件卡片展开查看详细信息和图片
* 加载更多历史事件

### 知识库
知识库页面分为多个类别，包括海洋生物学、海洋学、海洋技术、海洋保护和海洋文化。用户可以通过左侧菜单切换不同类别，获取相关领域的专业知识。

### 关于页面
关于页面介绍海洋文史馆的使命、愿景和团队情况，让用户了解项目的目标和价值。

## 项目截图

首页 时间线 知识库 关于页面

## 贡献指南
欢迎对本项目提出改进建议和贡献代码。请遵循以下步骤：
1. Fork本仓库
2. 创建您的特性分支 (git checkout -b feature/AmazingFeature)
3. 提交您的更改 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 开启一个Pull Request

## 许可证
**本项目仅供学习和教育目的使用。未经授权，请勿用于商业目的。**

## 联系方式
如有任何问题或建议，请联系：**cuvo@foxmail.com**

## 致谢
感谢所有为海洋历史研究和保护做出贡献的研究者和组织

感谢Vue.js和Element Plus等开源项目提供的技术支持