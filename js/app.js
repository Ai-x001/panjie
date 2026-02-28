// ===== 全局状态 =====
let currentPage = 'home';
let currentCategory = 'all';
let searchKeyword = '';

// ===== 路由系统 =====
function showPage(page, data) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.navbar-links a').forEach(a => a.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) { target.classList.add('active'); currentPage = page; }
  const navLink = document.querySelector(`.navbar-links a[data-page="${page}"]`);
  if (navLink) navLink.classList.add('active');
  switch(page) {
    case 'home': renderHome(); break;
    case 'detail': renderDetail(data); break;
    case 'submit': renderSubmit(); break;
    case 'admin': renderAdmin(); break;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 导航点击
document.querySelectorAll('.navbar-links a').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); showPage(a.dataset.page); });
});

// ===== Toast 提示 =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== 工具函数 =====
function getStatusBadge(status) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return `<span class="badge badge-${status}">● ${s.label}</span>`;
}
function getCategoryName(id) {
  const c = CATEGORIES.find(x => x.id === id);
  return c ? c.icon + ' ' + c.name : id;
}

// ===== 首页渲染 =====
function renderHome() {
  const container = document.getElementById('page-home');
  const totalViews = PROJECTS.reduce((s, p) => s + p.views, 0);
  const activeCount = PROJECTS.filter(p => p.status === 'active').length;
  const hotCount = PROJECTS.filter(p => p.hot).length;

  container.innerHTML = `
    <div class="hero">
      <h1>盘界 · 项目导航聚合平台</h1>
      <p>收录最新最全的项目信息，一站式浏览、对比、推广</p>
    </div>
    <div class="stats-row">
      <div class="stat-card"><span class="num">${PROJECTS.length}</span><span class="label">收录项目</span></div>
      <div class="stat-card"><span class="num">${activeCount}</span><span class="label">运行中</span></div>
      <div class="stat-card"><span class="num">${hotCount}</span><span class="label">热门项目</span></div>
      <div class="stat-card"><span class="num">${totalViews.toLocaleString()}</span><span class="label">总浏览量</span></div>
    </div>
    <div class="filter-bar">
      <div class="search-box">
        <span class="icon">🔍</span>
        <input type="text" id="searchInput" placeholder="搜索项目名称..." value="${searchKeyword}">
      </div>
      <div class="category-tabs" id="categoryTabs"></div>
    </div>
    <div class="projects-grid" id="projectsGrid"></div>
  `;
  renderCategoryTabs();
  renderProjectCards();
  bindSearchEvent();
}

// ===== 分类标签渲染 =====
function renderCategoryTabs() {
  const tabs = document.getElementById('categoryTabs');
  tabs.innerHTML = CATEGORIES.map(c =>
    `<span class="cat-tab ${currentCategory === c.id ? 'active' : ''}" data-cat="${c.id}">${c.icon} ${c.name}</span>`
  ).join('');
  tabs.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentCategory = tab.dataset.cat;
      renderCategoryTabs();
      renderProjectCards();
    });
  });
}

// ===== 项目卡片渲染 =====
function renderProjectCards() {
  const grid = document.getElementById('projectsGrid');
  let filtered = PROJECTS;
  if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
  if (searchKeyword) {
    const kw = searchKeyword.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw));
  }
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">暂无匹配项目</div>`;
    return;
  }
  grid.innerHTML = filtered.map(p => `
    <div class="project-card" onclick="showPage('detail', ${p.id})">
      <div class="card-header">
        <div class="logo">${p.logo}</div>
        <div>
          <div class="card-title">${p.name}</div>
          <div style="display:flex;gap:6px;margin-top:4px;">
            ${getStatusBadge(p.status)}
            ${p.hot ? '<span class="badge badge-hot">🔥 热门</span>' : ''}
            ${p.verified ? '<span class="badge badge-verified">✓ 已验证</span>' : ''}
          </div>
        </div>
      </div>
      <div class="card-desc">${p.description}</div>
      <div class="card-stats">
        <div class="stat"><span class="val">${p.minInvest}</span><span class="lbl">最低投入</span></div>
        <div class="stat"><span class="val">${p.dailyReturn}</span><span class="lbl">日化收益</span></div>
        <div class="stat"><span class="val">${p.cycle}</span><span class="lbl">投资周期</span></div>
      </div>
      <div class="card-footer">
        <span style="font-size:.78rem;color:var(--text-muted);">${getCategoryName(p.category)}</span>
        <span class="card-views">👁 ${p.views.toLocaleString()}</span>
      </div>
    </div>
  `).join('');
}

// ===== 搜索绑定 =====
function bindSearchEvent() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', e => {
    searchKeyword = e.target.value.trim();
    renderProjectCards();
  });
}

// ===== 复制推广链接 =====
function copyPromoLink() {
  const input = document.getElementById('promoLink');
  if (!input) return;
  input.select();
  document.execCommand('copy');
  showToast('推广链接已复制到剪贴板');
}

// ===== 详情页渲染 =====
function renderDetail(projectId) {
  const container = document.getElementById('page-detail');
  const p = PROJECTS.find(x => x.id === projectId);
  if (!p) {
    container.innerHTML = '<p style="text-align:center;padding:3rem;color:var(--text-muted);">项目不存在</p>';
    return;
  }
  const promoUrl = location.origin + location.pathname + '#/project/' + p.id;
  container.innerHTML = `
    <div style="margin-bottom:1rem;">
      <a href="#" onclick="event.preventDefault();showPage('home')" style="font-size:.85rem;">← 返回首页</a>
    </div>
    <div class="detail-header">
      <div class="detail-logo">${p.logo}</div>
      <div>
        <div class="detail-title">${p.name}</div>
        <div class="detail-badges">
          ${getStatusBadge(p.status)}
          ${p.hot ? '<span class="badge badge-hot">🔥 热门</span>' : ''}
          ${p.verified ? '<span class="badge badge-verified">✓ 已验证</span>' : ''}
          <span style="font-size:.78rem;color:var(--text-muted);">${getCategoryName(p.category)}</span>
        </div>
      </div>
    </div>
    <div class="detail-body">
      <div class="detail-info">
        <h3 style="color:var(--gold);margin-bottom:1rem;font-size:1rem;">项目介绍</h3>
        <p style="color:var(--text-secondary);line-height:1.8;font-size:.9rem;">${p.description}</p>
        <h3 style="color:var(--gold);margin:1.5rem 0 1rem;font-size:1rem;">推广链接</h3>
        <div style="background:var(--bg-secondary);border-radius:8px;padding:12px;display:flex;align-items:center;gap:8px;">
          <input type="text" id="promoLink" value="${promoUrl}"
            readonly style="flex:1;background:transparent;border:none;color:var(--text-primary);font-size:.85rem;outline:none;">
          <button class="btn btn-gold btn-sm" onclick="copyPromoLink()">复制</button>
        </div>
        <p style="color:var(--text-muted);font-size:.75rem;margin-top:6px;">分享此链接，通过你的推广带来的流量将被记录</p>
      </div>
      <div class="detail-sidebar">
        <div class="sidebar-card">
          <h3>投资参数</h3>
          <div class="info-row"><span class="info-label">最低投入</span><span class="info-value">${p.minInvest}</span></div>
          <div class="info-row"><span class="info-label">日化收益</span><span class="info-value">${p.dailyReturn}</span></div>
          <div class="info-row"><span class="info-label">投资周期</span><span class="info-value">${p.cycle}</span></div>
          <div class="info-row"><span class="info-label">提交日期</span><span class="info-value">${p.submitDate}</span></div>
          <div class="info-row"><span class="info-label">浏览量</span><span class="info-value">${p.views.toLocaleString()}</span></div>
        </div>
        <a href="${p.website}" target="_blank" class="btn btn-gold" style="text-align:center;width:100%;">🔗 访问官网</a>
      </div>
    </div>
  `;
}

// ===== 提交页渲染 =====
function renderSubmit() {
  const container = document.getElementById('page-submit');
  const catOptions = CATEGORIES.filter(c => c.id !== 'all').map(c =>
    '<option value="' + c.id + '">' + c.icon + ' ' + c.name + '</option>'
  ).join('');

  container.innerHTML = `
    <div class="hero">
      <h1>📤 提交项目</h1>
      <p>上传一个项目，审核通过即奖励 <span style="color:var(--gold);font-weight:700;">20元</span></p>
    </div>
    <div style="max-width:600px;margin:0 auto;">
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:1.5rem;">
        <div class="form-group">
          <label>项目名称 *</label>
          <input type="text" id="f_name" placeholder="例：StarFund">
        </div>
        <div class="form-group">
          <label>项目分类 *</label>
          <select id="f_category">${catOptions}</select>
        </div>
        <div class="form-group">
          <label>项目简介 *</label>
          <textarea id="f_desc" placeholder="简要描述项目玩法、收益模式等..."></textarea>
        </div>
        <div class="form-group">
          <label>最低投入</label>
          <input type="text" id="f_minInvest" placeholder="例：100 USDT">
        </div>
        <div class="form-group">
          <label>日化收益</label>
          <input type="text" id="f_dailyReturn" placeholder="例：1.2%-2.5%">
        </div>
        <div class="form-group">
          <label>投资周期</label>
          <input type="text" id="f_cycle" placeholder="例：30天">
        </div>
        <div class="form-group">
          <label>官网链接 *</label>
          <input type="text" id="f_website" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>你的推广链接（选填）</label>
          <input type="text" id="f_promoLink" placeholder="带上你的邀请码链接">
        </div>
        <div class="form-group">
          <label>收款方式（用于发放奖励）</label>
          <input type="text" id="f_payment" placeholder="微信/支付宝/USDT地址">
        </div>
        <button class="btn btn-gold" style="width:100%;padding:12px;font-size:.95rem;" onclick="handleSubmit()">
          提交项目
        </button>
      </div>
    </div>
  `;
}

// ===== 提交处理 =====
function handleSubmit() {
  const name = document.getElementById('f_name').value.trim();
  const category = document.getElementById('f_category').value;
  const desc = document.getElementById('f_desc').value.trim();
  const website = document.getElementById('f_website').value.trim();

  if (!name || !desc || !website) {
    showToast('请填写必填项（名称、简介、官网）');
    return;
  }

  const newProject = {
    id: PROJECTS.length + 1,
    name: name,
    category: category,
    status: 'pending',
    logo: '📦',
    description: desc,
    minInvest: document.getElementById('f_minInvest').value.trim() || '待定',
    dailyReturn: document.getElementById('f_dailyReturn').value.trim() || '待定',
    cycle: document.getElementById('f_cycle').value.trim() || '待定',
    website: website,
    submitDate: new Date().toISOString().slice(0, 10),
    submitter: '匿名用户',
    promotionLink: document.getElementById('f_promoLink').value.trim(),
    views: 0,
    hot: false,
    verified: false
  };

  PROJECTS.push(newProject);
  showToast('🎉 提交成功！审核通过后将展示并发放20元奖励');
  setTimeout(function() { showPage('home'); }, 1500);
}

// ===== 管理页渲染 =====
function renderAdmin() {
  const container = document.getElementById('page-admin');
  const rows = PROJECTS.map(function(p) {
    var statusInfo = STATUS_MAP[p.status] || STATUS_MAP.pending;
    return '<tr>' +
      '<td>' + p.id + '</td>' +
      '<td><span style="font-size:1.2rem">' + p.logo + '</span> ' + p.name + '</td>' +
      '<td>' + getCategoryName(p.category) + '</td>' +
      '<td><span class="badge badge-' + p.status + '">● ' + statusInfo.label + '</span></td>' +
      '<td>' + p.views.toLocaleString() + '</td>' +
      '<td>' + p.submitDate + '</td>' +
      '<td>' +
        '<button class="btn btn-outline btn-sm" onclick="approveProject(' + p.id + ')">✓ 通过</button> ' +
        '<button class="btn btn-outline btn-sm" style="border-color:#ef4444;color:#ef4444" onclick="rejectProject(' + p.id + ')">✗ 拒绝</button>' +
      '</td>' +
    '</tr>';
  }).join('');

  container.innerHTML = '<div class="hero">' +
    '<h1>🔧 管理后台</h1>' +
    '<p>审核项目、管理状态</p>' +
  '</div>' +
  '<div style="overflow-x:auto">' +
    '<table class="admin-table">' +
      '<thead><tr>' +
        '<th>ID</th><th>项目</th><th>分类</th><th>状态</th><th>浏览</th><th>提交日期</th><th>操作</th>' +
      '</tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
    '</table>' +
  '</div>';
}

// ===== 审核操作 =====
function approveProject(id) {
  var p = PROJECTS.find(function(x) { return x.id === id; });
  if (p) {
    p.status = 'active';
    p.verified = true;
    showToast('项目 ' + p.name + ' 已通过审核');
    renderAdmin();
  }
}

function rejectProject(id) {
  var p = PROJECTS.find(function(x) { return x.id === id; });
  if (p) {
    p.status = 'closed';
    showToast('项目 ' + p.name + ' 已拒绝');
    renderAdmin();
  }
}

// ===== 初始化 =====
showPage('home');
