// 项目数据
const PROJECTS = [
  {
    id: 1,
    name: "StarFund",
    category: "defi",
    status: "active",
    logo: "🌟",
    description: "去中心化收益聚合平台，日化1.2%-2.5%，支持USDT/ETH双币种投入。",
    minInvest: "100 USDT",
    dailyReturn: "1.2%-2.5%",
    cycle: "30天",
    website: "https://example.com/starfund",
    submitDate: "2026-02-20",
    submitter: "用户A",
    promotionLink: "",
    views: 3842,
    hot: true,
    verified: true
  },
  {
    id: 2,
    name: "MoonRise矿业",
    category: "mining",
    status: "active",
    logo: "🌙",
    description: "云算力挖矿平台，提供BTC/ETH算力租赁，周期灵活，收益稳定。",
    minInvest: "500 USDT",
    dailyReturn: "0.8%-1.5%",
    cycle: "60天",
    website: "https://example.com/moonrise",
    submitDate: "2026-02-18",
    submitter: "用户B",
    promotionLink: "",
    views: 2156,
    hot: true,
    verified: true
  },
  {
    id: 3,
    name: "GoldChain生态",
    category: "defi",
    status: "active",
    logo: "⛓️",
    description: "链上质押生态，多级推荐奖励机制，支持多链资产质押。",
    minInvest: "200 USDT",
    dailyReturn: "1.0%-2.0%",
    cycle: "45天",
    website: "https://example.com/goldchain",
    submitDate: "2026-02-15",
    submitter: "用户C",
    promotionLink: "",
    views: 1893,
    hot: false,
    verified: true
  },
  {
    id: 4,
    name: "PhoenixDAO",
    category: "dao",
    status: "active",
    logo: "🔥",
    description: "DAO治理型资金池，社区投票决定资金流向，透明度高。",
    minInvest: "300 USDT",
    dailyReturn: "0.5%-1.8%",
    cycle: "90天",
    website: "https://example.com/phoenixdao",
    submitDate: "2026-02-12",
    submitter: "用户D",
    promotionLink: "",
    views: 1245,
    hot: false,
    verified: false
  },
  {
    id: 5,
    name: "TigerPay",
    category: "payment",
    status: "active",
    logo: "🐯",
    description: "跨境支付+理财一体化平台，法币与加密货币无缝兑换。",
    minInvest: "50 USDT",
    dailyReturn: "0.6%-1.2%",
    cycle: "15天",
    website: "https://example.com/tigerpay",
    submitDate: "2026-02-10",
    submitter: "用户E",
    promotionLink: "",
    views: 4521,
    hot: true,
    verified: true
  },
  {
    id: 6,
    name: "DragonMeta",
    category: "nft",
    status: "warning",
    logo: "🐉",
    description: "NFT质押挖矿平台，持有指定NFT即可参与分红。",
    minInvest: "1000 USDT",
    dailyReturn: "2.0%-3.5%",
    cycle: "20天",
    website: "https://example.com/dragonmeta",
    submitDate: "2026-02-08",
    submitter: "用户F",
    promotionLink: "",
    views: 6234,
    hot: true,
    verified: false
  }
];

// 分类数据
const CATEGORIES = [
  { id: "all", name: "全部", icon: "📋" },
  { id: "defi", name: "DeFi", icon: "💎" },
  { id: "mining", name: "矿业", icon: "⛏️" },
  { id: "dao", name: "DAO", icon: "🏛️" },
  { id: "payment", name: "支付", icon: "💳" },
  { id: "nft", name: "NFT", icon: "🖼️" },
  { id: "gamefi", name: "GameFi", icon: "🎮" },
  { id: "other", name: "其他", icon: "📦" }
];

// 状态映射
const STATUS_MAP = {
  active: { label: "运行中", color: "#22c55e" },
  warning: { label: "需关注", color: "#f59e0b" },
  closed: { label: "已关闭", color: "#ef4444" },
  pending: { label: "审核中", color: "#6b7280" }
};
