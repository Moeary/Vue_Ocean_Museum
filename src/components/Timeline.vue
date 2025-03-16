<template>
  <div class="timeline-container">
    <el-timeline>
      <el-timeline-item
        v-for="event in currentEvents"
        :key="event.date"
        :timestamp="event.date"
        placement="top"
        :color="event.color || '#409EFF'"
      >
        <el-card 
          class="timeline-card" 
          :body-style="{ padding: '0px' }"
          @click="toggleEventDetails(event)"
        >
          <div class="image-container">
            <el-image :src="event.image" fit="cover" class="event-image" :preview-src-list="[event.image]">
              <template #error>
                <div class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div class="event-content">
            <h3>{{ event.title }}</h3>
            <p>{{ event.description }}</p>
            
            <!-- Event details expansion indicator -->
            <div class="expand-indicator">
              <el-icon v-if="!event.expanded"><ArrowDown /></el-icon>
              <el-icon v-else><ArrowUp /></el-icon>
              <span>{{ event.expanded ? '收起详情' : '查看详情' }}</span>
            </div>
          </div>
          
          <!-- Expanded details section -->
          <div class="event-details" v-if="event.expanded">
            <el-divider></el-divider>
            
            <!-- Image carousel -->
            <div v-if="event.detailImages && event.detailImages.length > 0" class="detail-carousel">
              <el-carousel 
                :interval="4000" 
                type="card" 
                height="300px"
                :autoplay="true"
                indicator-position="outside"
                @click.stop
              >
                <el-carousel-item v-for="(image, index) in event.detailImages" :key="index">
                  <el-image 
                    :src="image.url" 
                    fit="cover" 
                    class="carousel-image"
                  >
                    <template #error>
                      <div class="image-placeholder">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                  <div class="image-caption" v-if="image.caption">{{ image.caption }}</div>
                </el-carousel-item>
              </el-carousel>
            </div>
            
            <!-- Detailed description -->
            <div class="detail-description">
              <p v-html="event.detailedDescription || event.description"></p>
              
              <!-- Additional facts if available -->
              <div v-if="event.facts && event.facts.length > 0" class="event-facts">
                <h4>相关事实：</h4>
                <ul>
                  <li v-for="(fact, index) in event.facts" :key="index">{{ fact }}</li>
                </ul>
              </div>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    
    <!-- 添加加载更多按钮 -->
    <div class="load-more-container" v-if="showMoreButton">
      <el-button type="primary" @click="handleMoreEvents" :loading="loading">
        查看更多历史事件
      </el-button>
    </div>
    
    <!-- 观察元素，用于触发自动加载 -->
    <div class="observer-element" ref="observerTarget"></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { Picture, ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { createTimelineEvent } from '../utils/timelineUtils';

export default {
  name: 'OceanTimeline',
  components: {
    Picture,
    ArrowDown,
    ArrowUp
  },
  props: {
    // True when showing all events on the timeline page, false for homepage limited view
    showAll: {
      type: Boolean,
      default: false
    },
    // Number of events to show on homepage
    homeLimit: {
      type: Number,
      default: 5
    }
  },
  setup(props) {
    const router = useRouter();
    const loading = ref(false);
    const visibleEvents = ref([]);
    const observer = ref(null);
    const observerTarget = ref(null);
    
    // Toggle event details expansion
    const toggleEventDetails = (event) => {
      // Toggle expanded state
      event.expanded = !event.expanded;
      
      // Force component update
      visibleEvents.value = [...visibleEvents.value];
    };
    
    // Compute whether to show the load more button
    const showMoreButton = computed(() => {
      // On homepage and not all events are loaded
      return !props.showAll && visibleEvents.value.length < allEvents.length;
    });
    
    // Sorting function to get oldest events first
    
    
    // Create enriched events with detailed data
    const allEvents = [
      // Ancient Egypt
      createTimelineEvent({
        date: '公元前3000年',
        title: '古埃及航海技术',
        description: '古埃及人开始在尼罗河和地中海进行航行，发展了早期的航海技术和船只建造技术。',
        image: '/images/ancient-egypt-ships.jpg',
        color: '#8E44AD',
        detailedDescription: `古埃及文明的发展与尼罗河息息相关，早在公元前3000年，古埃及人就已经开始掌握了较为成熟的造船和航海技术。他们首先在尼罗河上发展航运，后来逐渐扩展至地中海沿岸。<br/><br/>
        古埃及最早的船只主要由纸莎草捆绑而成，后来发展出以木材为主要材料的船只。考古学家在吉萨金字塔附近发现了一艘保存完好的"太阳船"，长约43米，这艘船被认为是为法老库夫王（Khufu）准备的来世交通工具，同时也展示了古埃及人精湛的造船技术。<br/><br/>
        古埃及的商船主要用于尼罗河上的贸易往来，而军船则用于保护贸易路线。哈特谢普苏特女王时期（约公元前1479-1458年），埃及曾派出大型船队前往神秘的旁特国（可能位于今天的索马里或也门），带回香料、黄金、象牙和珍贵木材。这些贸易航线对古埃及经济和文化发展有着重要影响。`,
        detailImages: [
          {
            url: '/images/ancient-egypt-ships-wall.jpg',
            caption: '古埃及船只壁画'
          },
          {
            url: '/images/ancient-egypt-solar-boat.jpg',
            caption: '复原的古埃及太阳船'
          },
          {
            url: '/images/ancient-egypt-maritime-trade.jpg',
            caption: '古埃及海上贸易路线图'
          }
        ],
        facts: [
          '古埃及人在公元前3200年就已经使用帆船在尼罗河上航行',
          '太阳船是为了让死去的法老在来世可以跟随太阳神拉在天空中航行',
          '古埃及人使用星象导航，特别是北极星作为指示方向的重要参考'
        ]
      }),

      // Sample implementation for Phoenicians
      createTimelineEvent({
        date: '公元前1500年',
        title: '腓尼基人航海贸易',
        description: '腓尼基人成为地中海地区最早的航海贸易民族之一，他们的航海网络遍布整个地中海。',
        image: '/images/phoenician-ships.jpg',
        color: '#D35400',
        detailedDescription: `腓尼基人是古代居住在现今黎巴嫩、叙利亚沿海地区的闪族人，约在公元前1500年开始崛起，他们建立了以航海贸易为主的强大商业网络。作为历史上最伟大的海上商人，腓尼基人的航海网络遍布整个地中海，甚至可能到达不列颠群岛和西非海岸。<br/><br/>
        腓尼基人发明并使用了高效的单层桨帆船，这种船只机动性强，适合远洋航行。他们利用观察北极星导航，创造了与地中海航行相关的丰富知识体系。最著名的是，腓尼基人创造了字母表，这是现代西方字母的前身，极大地促进了商业记录和文化交流。<br/><br/>
        腓尼基人主要通过贸易香料、紫色染料（又称"泰尔紫"，来自海洋软体动物，非常珍贵）、玻璃制品、香柏木和各类手工艺品而闻名于世。他们在地中海各地建立了众多殖民地和贸易站，其中最著名的是迦太基（位于现今突尼斯），后来发展成为地中海西部的主要海上强权。`,
        detailImages: [
          {
            url: '/images/phoenician-ships-fuyuan.jpg',
            caption: '腓尼基商船复原图'
          },
          {
            url: '/images/phoenician-trade-routes.jpg',
            caption: '腓尼基贸易航线图'
          },
          {
            url: '/images/phoenician-purple-dye.jpg',
            caption: '珍贵的腓尼基紫色染料'
          },
          {
            url: '/images/phoenician-alphabet.jpg',
            caption: '腓尼基字母表'
          }
        ],
        facts: [
          '腓尼基人创造了世界上第一个真正的字母表，包含22个字母',
          '他们可能是第一个环绕非洲航行的民族，据希罗多德记载',
          '泰尔紫染料极其珍贵，1克需要大约10,000只海螺提取'
        ]
      }),

      // Ancient Greece
      createTimelineEvent({
        date: '公元前8世纪 - 公元前6世纪',
        title: '古希腊的航海与殖民',
        description: '古希腊人继承并发展了航海技术，积极进行海外殖民和贸易，对地中海历史产生了深远影响。',
        image: '/images/ancient-greece.jpg',
        color: '#2980B9',
        detailedDescription: `古希腊的航海活动在公元前8世纪至公元前6世纪进入繁荣时期。希腊人凭借其优越的地理位置和对航海技术的掌握，在地中海和黑海地区积极开展殖民活动和贸易往来。<br/><br/>
        古希腊人建造了坚固的桨帆船，例如三列桨座战船（Trireme），成为当时地中海地区重要的海军力量。他们不仅在地中海沿岸建立了众多城邦和殖民地，还将航线扩展到更远的地方，例如埃及、西西里岛、以及黑海沿岸。<br/><br/>
        航海贸易为古希腊带来了丰富的资源和财富，也促进了文化交流。希腊的葡萄酒、橄榄油、陶器和手工艺品通过海运销往各地，同时他们也从其他地区进口粮食、金属和木材等资源。航海和海外殖民活动是古希腊文明扩张和文化传播的重要途径。`,
        detailImages: [
          {
            url: '/images/ancient-greece-ships.jpg',
            caption: '古希腊三列桨座战船'
          },
          {
            url: '/images/ancient-greece-colonies.jpg',
            caption: '古希腊殖民地分布图'
          },
          {
            url: '/images/ancient-greece-trade.jpg',
            caption: '古希腊海上贸易场景'
          }
        ],
        facts: [
          '古希腊人发明了三列桨座战船，是古代最先进的战舰之一',
          '他们利用季风和洋流进行航行，提高了航海效率',
          '著名的特洛伊战争的起因也与海上贸易路线的争夺有关'
        ]
      }),

      // Roman Empire
      createTimelineEvent({
        date: '公元前27年 - 公元476年',
        title: '罗马帝国的海上霸权',
        description: '罗马帝国建立后，控制了地中海，发展了庞大的海军和海上商路，地中海成为罗马帝国的“内湖”。',
        image: '/images/roman-empire-navy.jpg',
        color: '#C0392B',
        detailedDescription: `罗马帝国崛起后，为了维护其庞大帝国的统治和经济利益，建立了强大的海军力量。从公元前3世纪的布匿战争开始，罗马逐渐击败了迦太基等海上强国，最终完全控制了地中海，将其变为罗马帝国的“内湖”（Mare Nostrum）。<br/><br/>
        罗马海军不仅用于军事征服和防御，也承担着维护海上航线安全、打击海盗、以及运输粮食和物资的重要任务。罗马人建造了大型港口、灯塔和 морские 道路，极大地促进了 морские 贸易的发展。<br/><br/>
        罗马帝国的 морские 贸易网络非常发达，从帝国各地运往罗马的商品琳琅满目，包括埃及的 зерно, 北非的橄榄油, 高卢的葡萄酒, 以及 восточные 的香料和奢侈品。 морские 贸易为罗马带来了巨大的财富，也支撑了帝国的繁荣和扩张。`,
        detailImages: [
          {
            url: '/images/roman-empire-navy.jpg',
            caption: '罗马海军战舰'
          },
          {
            url: '/images/roman-empire-port.jpg',
            caption: '古罗马港口 Ostia 的遗址'
          },
          {
            url: '/images/roman-empire-trade-routes.jpg',
            caption: '罗马帝国的贸易路线图'
          }
        ],
        facts: [
          '罗马帝国海军在地中海地区消灭了海盗，保障了贸易的安全',
          '罗马人修建了发达的道路和灯塔，例如著名的亚历山大灯塔',
          '地中海在罗马帝国时期被称为 "Mare Nostrum" (我们的海)'
        ]
      }),

      // 三国时期 - 吴国探索夷洲 (台湾)
      createTimelineEvent({
        date: '公元230年',
        title: '三国吴国探索夷洲',
        description: '三国时期，吴国派遣船队到达夷洲（一说为台湾），是中国历史上较早的海上探索事件之一。',
        image: '/images/wu-ships-taiwan.jpg',
        color: '#1E8449',
        detailedDescription: `三国时期，为了开辟新的资源和拓展疆域，吴王孙权派遣大将卫温、诸葛直率领水军到达夷洲。关于夷洲的具体位置历来有争议，但多数学者认为夷洲即为今天的台湾。<br/><br/>
        据史书记载，卫温、诸葛直的船队由上万士兵组成，虽然此行目的带有军事性质，但也被认为是中原政权较早有组织地到达台湾的事件。这次航行加强了中国大陆与台湾地区之间的联系，为后来的交往奠定了基础。<br/><br/>
        虽然史料对此次航行的具体细节记载有限，但它反映了三国时期吴国已经具备一定的 морские 航行能力和海外探索意识。这次事件在中国海洋史上具有一定的开创意义。`,
        detailImages: [
          {
            url: '/images/wu-ships-taiwan.jpg',
            caption: '根据史料推测的三国吴国船只'
          },
          {
            url: '/images/taiwan-ancient-map.jpg',
            caption: '古代地图中标注的夷洲'
          }
        ],
        facts: [
          '夷洲被认为是古代对台湾的称呼之一',
          '卫温、诸葛直的航行比郑和下西洋早了一千多年',
          '此次航行也被视为中国与台湾地区交往的早期历史事件'
        ]
      }),

      // Viking Age
      createTimelineEvent({
        date: '公元8世纪 - 11世纪',
        title: '维京人的海上扩张',
        description: '维京人以其精湛的造船技术和航海技能，从斯堪的纳维亚半岛出发，向欧洲各地进行海上扩张和探险。',
        image: '/images/viking-ships.jpg',
        color: '#E67E22',
        detailedDescription: `在公元8世纪至11世纪的维京时代，来自斯堪的纳维亚半岛的维京人（也称诺斯人）以其独特的长船（Longship）和卓越的航海技术，在海上领域留下了深刻的印记。他们不仅是令人生畏的战士和劫掠者，也是技艺高超的海上商人和探险家。<br/><br/>
        维京长船具有吃水浅、速度快、机动性强等特点，既能海上航行，也能溯流而上，深入内陆。维京人利用长船进行海上劫掠、贸易和殖民活动，其足迹遍布欧洲沿海地区、俄罗斯内陆河流、甚至远至冰岛、格陵兰岛和北美洲。<br/><br/>
        维京人的海上扩张对欧洲历史产生了重大影响，他们建立了海上贸易网络，促进了文化交流，同时也对当时的政治格局造成了冲击。维京人的航海探险精神和造船技术在海上史上占据着重要地位。`,
        detailImages: [
          {
            url: '/images/viking-ships.jpg',
            caption: '维京长船复原图'
          },
          {
            url: '/images/viking-raids.jpg',
            caption: '维京人海上劫掠场景'
          },
          {
            url: '/images/viking-exploration.jpg',
            caption: '维京人海上探险路线图'
          }
        ],
        facts: [
          '维京长船可以海上和内河航行，是当时最先进的船只之一',
          '维京人使用太阳罗盘和星象导航，能够进行远洋航行',
          '维京人可能是最早发现美洲大陆的欧洲人，比哥伦布早数百年'
        ]
      }),

      // 郑和下西洋
      createTimelineEvent({
        date: '公元1405年 - 1433年',
        title: '郑和七下西洋',
        description: '明朝郑和率领庞大舰队七次远航西太平洋和印度洋，是世界航海史上的壮举。',
        image: '/images/zheng-he-fleet.jpg',
        color: '#9B59B6',
        detailedDescription: `明朝永乐年间至宣德年间，郑和奉命率领当时世界上最庞大的 морские 舰队，先后七次下西洋。舰队由数百艘 кораблей 组成，人员最多时达两万多人。郑和的航迹遍及东南亚、印度洋、阿拉伯海、甚至到达非洲东海岸。<br/><br/>
        郑和下西洋的目的包括宣扬国威、进行贸易和寻找失踪的建文帝等。他的舰队携带了大量的丝绸、瓷器、茶叶等中国商品，与沿途各国进行贸易和文化交流。郑和的航行促进了中国与亚非国家之间的 политические, 经济和文化联系。<br/><br/>
        郑和下西洋展示了明朝强大的 морские 实力和先进的造船、航海技术。他的远航比欧洲大航海时代早了半个多世纪，是世界航海史上的伟大壮举，体现了中国古代 морские 事业的辉煌成就。`,
        detailImages: [
          {
            url: '/images/zheng-he-fleet.jpg',
            caption: '郑和舰队的宏伟景象'
          },
          {
            url: '/images/zheng-he-map.jpg',
            caption: '郑和下西洋航线图'
          },
          {
            url: '/images/zheng-he-treasure-ship.jpg',
            caption: '郑和宝船模型'
          }
        ],
        facts: [
          '郑和舰队的规模在当时世界首屈一指',
          '郑和下西洋使用了罗盘导航、 морские 天文观测等先进技术',
          '郑和的航行促进了 морские 丝绸之路的繁荣'
        ]
      }),

      //  地理大发现 - 麦哲伦环球航行
      createTimelineEvent({
        date: '公元1519年 - 1522年',
        title: '麦哲伦环球航行',
        description: '葡萄牙航海家麦哲伦率领的船队首次完成环球航行，证明了地球是圆形的，极大地拓展了人类的 морские 视野。',
        image: '/images/magellan-circumnavigation.jpg',
        color: '#A9CCE3',
        detailedDescription: `1519年，葡萄牙航海家费尔南多·麦哲伦受西班牙国王查理五世派遣，率领 пяти кораблей 的船队，试图从 западном 方向到达香料群岛（摩鹿加群岛）。这次航行历时三年，途中麦哲伦在菲律宾去世，最终由他的船员胡安·塞巴斯蒂安·埃尔卡诺完成环球航行。<br/><br/>
        麦哲伦船队经历了重重困难，包括风暴、饥饿、疾病和与土著居民的冲突。他们穿越了大西洋、太平洋和印度洋，首次完成了环球航行，用实践证明了地球是圆形的。这次航行极大地拓展了人类的地理知识和 морские 视野，开启了全球 морские 时代。<br/><br/>
        虽然麦哲伦环球航行的商业回报有限，但其历史和科学意义非常重大。它标志着人类 морские 探险 достигло 了新的高度，也为后来的 морские 贸易和殖民扩张奠定了基础。`,
        detailImages: [
          {
            url: '/images/magellan-circumnavigation.jpg',
            caption: '麦哲伦环球航行路线图'
          },
          {
            url: '/images/victoria-ship.jpg',
            caption: '麦哲伦船队旗舰“维多利亚”号的复制品'
          },
          {
            url: '/images/magellan-portrait.jpg',
            caption: '费尔南多·麦哲伦画像'
          }
        ],
        facts: [
          '麦哲伦环球航行最初有五艘船，最终只有“维多利亚”号返回',
          '麦哲伦在环球航行途中命名了太平洋（Pacific Ocean）',
          '这次航行证明了地球是圆的，并大致测算了地球的周长'
        ]
      }),

      //  近代中国海军的建立 (晚清 - 北洋水师)
      createTimelineEvent({
        date: '公元19世纪后期',
        title: '晚清北洋水师的建立',
        description: '清朝晚期，为了应对 морские 威胁，开始建立近代海军，北洋水师是其中规模最大、装备最先进的一支。',
        image: '/images/beiyang-fleet.jpg',
        color: '#7B241C',
        detailedDescription: `19世纪中后期，面对西方列强的 морские 入侵和 национальные 危机，清朝统治者开始意识到建立近代海军的重要性。在洋务运动的推动下，清政府开始投入巨资建设海军，其中最重要的成果是北洋水师的建立。<br/><br/>
        北洋水师从德国和英国等西方国家购买先进的战舰和 морские 装备，并聘请外国 морские 专家进行指导。舰队拥有“定远”、“镇远”等当时世界一流的铁甲舰，在亚洲 морские 力量中占据重要地位。北洋水师的建立是中国 морские 防御近代化的重要一步。<br/><br/>
        然而，由于 политические 腐败和 управленческие 混乱，北洋水师在甲午中日战争中覆没，标志着中国 морские 防御 модернизации 的失败。但北洋水师的建立仍然是中国近代海军史上的重要篇章。`,
        detailImages: [
          {
            url: '/images/beiyang-fleet.jpg',
            caption: '北洋水师舰队'
          },
          {
            url: '/images/dingyuan-zhenyuan.jpg',
            caption: '北洋水师主力舰“定远”号和“镇远”号'
          },
          {
            url: '/images/li-hongzhang-navy.jpg',
            caption: '李鸿章视察北洋水师'
          }
        ],
        facts: [
          '北洋水师的建立者和主要 руководители 是李鸿章',
          '“定远”和“镇远”号铁甲舰是当时亚洲最强大的战舰',
          '北洋水师在甲午战争中全军覆没，对中国近代史影响深远'
        ]
      }),

      //  泰坦尼克号沉没事件 
      createTimelineEvent({
        date: '公元1912年',
        title: '泰坦尼克号沉没',
        description: '号称“永不沉没”的豪华邮轮泰坦尼克号在首次航行中撞击冰山沉没，是 мирный 时期最著名的 морские 灾难之一。',
        image: '/images/titanic-sinking.jpg',
        color: '#5D6D7E',
        detailedDescription: `1912年4月14日深夜，英国豪华邮轮泰坦尼克号在首次从英国南安普顿驶往美国纽约的航行中，撞击北大西洋的冰山后沉没。超过1500人在此次事故中丧生，是 мирный 时期最严重的 морские 灾难之一。<br/><br/>
        泰坦尼克号是当时世界上最大的邮轮，被誉为“永不沉没的梦幻之船”。然而，事故暴露出 морские 安全措施的不足和 человеческие 的疏忽。泰坦尼克号沉没事件促使国际社会加强 морские 安全规范，例如增加救生艇数量、加强冰山预警等。<br/><br/>
        泰坦尼克号沉没事件成为了一个 культурный и исторический 的符号，引发了人们对 морские 风险、 человеческие 命运和 технологические 局限性的深刻反思。`,
        detailImages: [
          {
            url: '/images/titanic-sinking.jpg',
            caption: '泰坦尼克号沉没场景绘画'
          },
          {
            url: '/images/titanic-lifeboats.jpg',
            caption: '泰坦尼克号的救生艇数量不足是灾难的重要原因之一'
          },
          {
            url: '/images/titanic-wreck.jpg',
            caption: '泰坦尼克号残骸照片'
          }
        ],
        facts: [
          '泰坦尼克号沉没时，救生艇数量仅能容纳一半乘客',
          '事故发生后，国际社会制定了《国际 морские 人命安全公约》（SOLAS公约）',
          '泰坦尼克号残骸于1985年被 обнаружены 在北大西洋海底'
        ]
      }),

      //  现代中国海军的发展 (新中国成立后至今)
      createTimelineEvent({
        date: '公元20世纪后期 - 至今',
        title: '中国人民解放军海军现代化',
        description: '新中国成立后，特别是改革开放以来，中国海军不断发展壮大，走向现代化，成为维护国家 морские 权益的重要力量。',
        image: '/images/chinese-navy-modern.jpg',
        color: '#154360',
        detailedDescription: `新中国成立初期，中国海军力量薄弱，主要以近岸防御为主。改革开放以来，随着中国经济的快速发展和 национальные 安全需求的提升，中国海军进入快速现代化发展阶段。<br/><br/>
        中国海军自主研发和建造了包括航空母舰、驱逐舰、护卫舰、潜艇等在内的大型现代化 морские 舰艇， морские 力量 значительно 增强。中国海军的活动范围也从近海走向远海， участвует 在国际护航、联合军演和人道主义救援等行动中。<br/><br/>
        现代中国海军的发展目标是建设一支 мирный 时期维护国家 морские 安全，战时能够有效 защищать 国家主权和海洋权益的强大海军。中国海军的现代化建设是国家综合国力提升和 морские 战略转型的体现。`,
        detailImages: [
          {
            url: '/images/chinese-navy-modern.jpg',
            caption: '中国海军现代化舰艇编队'
          },
          {
            url: '/images/liaoning-aircraft-carrier.jpg',
            caption: '中国海军航空母舰“辽宁舰”'
          },
          {
            url: '/images/type055-destroyer.jpg',
            caption: '中国海军055型驱逐舰'
          }
        ],
        facts: [
          '中国海军目前拥有多艘航空母舰和先进的 морские 舰艇',
          '中国海军 регулярно 派遣舰艇编队执行亚丁湾护航任务',
          '中国海军 морские 力量的快速发展引起了国际社会的广泛关注'
        ]
      }),

      //  中国加强海洋环境保护和可持续发展 (21世纪)
      createTimelineEvent({
        date: '公元21世纪',
        title: '中国的海洋环境保护与可持续发展',
        description: '进入21世纪，中国政府高度重视海洋环境保护和可持续利用，采取多项措施保护海洋生态环境，推动海洋经济绿色发展。',
        image: '/images/china-ocean-conservation.jpg',
        color: '#2ECC71',
        detailedDescription: `随着经济发展和 морские 产业的扩张，中国面临着日益严峻的海洋环境问题，包括 морские 污染、生态系统退化、 морские 生物多样性减少等。中国政府开始加大力度推动海洋环境保护和可持续发展。<br/><br/>
        中国实施了“ морские 生态文明建设”战略，加强 морские 污染防治，划定 морские 生态红线，建立 морские 自然保护区，开展 морские 生态修复工程。同时，中国积极发展海洋可再生能源、海洋生物医药等 морские 新兴产业，推动海洋经济向绿色、可持续方向转型。<br/><br/>
        中国的海洋环境保护和可持续发展努力不仅关乎自身 национальные 利益，也对全球海洋治理和 морские 可持续发展具有重要意义。中国在 морские 环保领域的实践和经验值得国际社会借鉴。`,
        detailImages: [
          {
            url: '/images/china-ocean-conservation.jpg',
            caption: '中国的海洋环境保护行动'
          },
          {
            url: '/images/marine-protected-area-china.jpg',
            caption: '中国 морские 自然保护区'
          },
          {
            url: '/images/offshore-wind-china.jpg',
            caption: '中国 морские 风力发电场'
          }
        ],
        facts: [
          '中国设立了 морские 生态红线制度，保护重要 морские 生态功能区',
          '中国积极发展 морские 可再生能源，如海上风电',
          '中国参与全球海洋治理，推动构建 морские 命运共同体'
        ]
      }),

       // 2024年 -  （可以根据实际情况添加最新的海洋相关事件，例如最新的海洋科考、国际海洋合作、新的海洋保护政策等）
      createTimelineEvent({
        date: '公元2024年',
        title: '全球海洋观测与合作深化',
        description: '全球海洋 научное исследование 和国际合作持续深化，各国加强海洋观测技术研发和数据共享，共同应对全球海洋挑战。',
        image: '/images/global-ocean-research-2024.jpg', // 需要替换为2024年相关的图片
        color: '#5499C7',
        detailedDescription: `进入2024年，全球海洋面临气候变化、 морские 污染、生物多样性丧失等多重挑战。国际社会进一步加强海洋观测和 научное исследование 合作，共同应对这些挑战。<br/><br/>
        各国投入更多资源研发先进的海洋观测技术，包括 морские 卫星、无人 морские 载具、深海探测设备等，以更全面、更精确地了解海洋状况。国际海洋 научные организации и институты 之间加强数据共享和信息交流，共同推动海洋 научное исследование 的深入发展。<br/><br/>
        在 морские 保护领域，国际社会也在努力加强合作，推动建立更有效的 морские 保护区网络，打击非法捕捞，减少 морские 塑料污染。全球海洋治理体系正在不断完善，以期实现海洋的可持续发展和健康海洋的目标。`,
        detailImages: [
          {
            url: '/images/global-ocean-research-2024-1.jpg', // 需要替换为2024年相关的图片
            caption: '最新的海洋 научное исследование 考察船'
          },
          {
            url: '/images/global-ocean-research-2024-2.jpg', // 需要替换为2024年相关的图片
            caption: '国际海洋 научные 研究合作项目'
          },
          {
            url: '/images/global-ocean-research-2024-3.jpg', // 需要替换为2024年相关的图片
            caption: '先进的海洋观测技术应用'
          }
        ],
        facts: [
          '2024年，全球海洋 научное исследование и 合作项目持续增加',
          '新的 морские 观测技术不断涌现，提升了海洋数据获取能力',
          '国际社会在 морские 保护和可持续发展领域达成更多共识'
        ]
      }),
    ];
    
    // Sort events by date (oldest first)
    const sortedEvents = allEvents;
    
    // Current events to display based on mode
    const currentEvents = computed(() => {
      if (props.showAll) {
        // Show all events for the full timeline page
        return visibleEvents.value;
      } else {
        // Show only the oldest 5 events for homepage
        return sortedEvents.slice(0, props.homeLimit);
      }
    });
    
    // Handle the "Load More" button click - navigate to timeline page
    const handleMoreEvents = () => {
      router.push('/timeline');
    };
    
    // Load more events function for the full timeline view
    const loadMoreEvents = () => {
      if (!props.showAll) return; // Only for full timeline page
      
      loading.value = true;
      
      // Simulate network delay
      setTimeout(() => {
        const currentLength = visibleEvents.value.length;
        const nextBatch = sortedEvents.slice(
          currentLength, 
          Math.min(currentLength + 5, sortedEvents.length)
        );
        
        visibleEvents.value = [...visibleEvents.value, ...nextBatch];
        loading.value = false;
      }, 300);
    };
    
    onMounted(() => {
      if (props.showAll) {
        // Set up infinite scroll for full timeline page
        observer.value = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && !loading.value) {
            if (visibleEvents.value.length < sortedEvents.length) {
              loadMoreEvents();
            }
          }
        }, {
          rootMargin: '200px',
          threshold: 0.1
        });
        
        // Monitor observer target
        if (observerTarget.value) {
          observer.value.observe(observerTarget.value);
        }
        
        // Initial load of 10 events for full timeline page
        visibleEvents.value = sortedEvents.slice(0, 10);
      } else {
        // For homepage, just set the first 5 oldest events
        visibleEvents.value = sortedEvents.slice(0, props.homeLimit);
      }
    });
    
    onUnmounted(() => {
      if (observer.value) {
        observer.value.disconnect();
      }
    });
    
    // Watch for showAll prop changes to reset the timeline
    watch(() => props.showAll, (newValue) => {
      if (newValue) {
        visibleEvents.value = sortedEvents.slice(0, 10);
      } else {
        visibleEvents.value = sortedEvents.slice(0, props.homeLimit);
      }
    });
    
    return {
      currentEvents,
      visibleEvents,
      loading,
      observerTarget,
      showMoreButton,
      handleMoreEvents,
      toggleEventDetails,
      allEvents
    };
  }
};
</script>

<style scoped>
.timeline-container {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.timeline-card {
  transition: transform 0.3s ease;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.timeline-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.image-container {
  height: 240px;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.timeline-card:hover .event-image {
  transform: scale(1.05);
}

.event-content {
  padding: 20px;
}

.event-content h3 {
  margin-top: 0;
  color: #303133;
  font-size: 1.5rem;
}

.event-content p {
  color: #606266;
  line-height: 1.6;
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 24px;
}

.load-more-container {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 20px;
}

.text-muted {
  color: #909399;
  margin-top: 10px;
  font-size: 0.9rem;
}

.observer-element {
  height: 20px;
  margin-bottom: 20px;
  visibility: hidden;
}

/* New styles for expandable details */
.expand-indicator {
  display: flex;
  align-items: center;
  color: #409EFF;
  margin-top: 10px;
  cursor: pointer;
}

.expand-indicator .el-icon {
  margin-right: 5px;
}

.event-details {
  padding: 0 20px 20px;
  animation: fade-in 0.3s ease-in-out;
}

.detail-carousel {
  margin: 20px 0;
}

.carousel-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px 15px;
  text-align: center;
  font-size: 0.9rem;
}

.detail-description {
  margin-top: 20px;
  line-height: 1.8;
  color: #606266;
}

.event-facts {
  margin-top: 20px;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.event-facts h4 {
  color: #303133;
  margin-bottom: 10px;
}

.event-facts ul {
  padding-left: 20px;
}

.event-facts li {
  margin-bottom: 5px;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
