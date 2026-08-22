window.FeedManagementPage = {
  storageKey: 'meiyou-cashback-feed-management',
  clone(value) {
    return JSON.parse(JSON.stringify(value));
  },
  createTab(data = {}) {
    return {
      id: data.id || `feed-tab-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      tabName: '',
      recordName: '',
      status: '待上线',
      resourceStatus: '待上线',
      iconImage: '',
      cornerImage: '',
      tailImage: '',
      targeting: window.ConfigurationSections.createTargeting(),
      ...data,
      targeting: window.ConfigurationSections.normalizeTargeting(data.targeting)
    };
  },
  createDefaultState() {
    const tabs = [
      this.createTab({ id: 'feed-live', tabName: '直播间返现', recordName: '直播间返现', status: '上线中', resourceStatus: '上线中' }),
      this.createTab({ id: 'feed-jd', tabName: '京东购物车', recordName: '京东购物车（896）', status: '上线中', resourceStatus: '上线中' }),
      this.createTab({ id: 'feed-takeout', tabName: '外卖返现', recordName: '外卖返现', status: '待上线', resourceStatus: '待上线' }),
      this.createTab({ id: 'feed-redpacket', tabName: '红包', recordName: '红包', status: '已下线', resourceStatus: '已下线' })
    ];
    return { tabs, activeTabId: 'feed-jd' };
  },
  loadState() {
    const fallback = this.createDefaultState();
    try {
      const saved = JSON.parse(window.localStorage.getItem(this.storageKey));
      if (!saved || !Array.isArray(saved.tabs)) return fallback;
      const tabs = saved.tabs.map((tab) => this.createTab(tab));
      return { tabs: tabs.length ? tabs : fallback.tabs, activeTabId: tabs.some((tab) => tab.id === saved.activeTabId) ? saved.activeTabId : tabs[0]?.id };
    } catch (error) {
      return fallback;
    }
  },
  saveState(state) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(state));
  },
  render() {
    return `<section class="content feed-management-page"><div class="page-heading"><div><h1>首页-信息流营销</h1><span class="heading-note">维护首页信息流 Tab、资源位状态及展示配置</span></div><div class="feed-page-actions" id="feed-page-actions"></div></div><section class="panel feed-filter-panel"><div class="feed-status-filter"><strong>Tab状态：</strong><div class="feed-filter-options" data-feed-filter="status"><label><input type="checkbox" value="上线中" checked />上线中</label><label><input type="checkbox" value="待上线" checked />待上线</label><label><input type="checkbox" value="已下线" checked />已下线</label></div></div><div class="feed-status-filter"><strong>资源位状态：</strong><div class="feed-filter-options" data-feed-filter="resourceStatus"><label><input type="checkbox" value="上线中" checked />上线中</label><label><input type="checkbox" value="待上线" checked />待上线</label><label><input type="checkbox" value="已下线" checked />已下线</label></div></div></section><section class="panel feed-tab-management"><div class="feed-tab-nav" id="feed-tab-nav" role="tablist" aria-label="首页信息流 Tab"></div><div class="feed-tab-workspace" id="feed-tab-workspace"></div></section></section>`;
  },
  renderEmbedded() {
    return `<section class="home-marketing-builder feed-marketing-builder" id="feed-marketing-builder"><aside class="home-marketing-tools feed-marketing-tools"><h2>组件</h2><p>按状态筛选并维护首页信息流 Tab</p><div class="feed-embedded-filters" id="feed-embedded-filters"></div><div class="feed-embedded-tab-list" id="feed-embedded-tab-list" role="tablist" aria-label="首页信息流 Tab"></div></aside><section class="home-marketing-preview feed-marketing-preview"><div class="style-panel-heading"><h2>页面预览</h2><span>当前 Tab 资源位</span></div><div class="feed-embedded-preview" id="feed-embedded-preview"></div></section><aside class="home-marketing-settings feed-marketing-settings"><div class="style-panel-heading"><h2>配置</h2><span id="feed-embedded-config-type">未选择 Tab</span></div><div class="home-config-content" id="feed-embedded-config-content"></div><div class="home-config-actions"><button class="button secondary" id="feed-embedded-undo" type="button">撤销本次修改</button><button class="button primary" id="feed-embedded-save" type="button">保存配置</button></div></aside></section>`;
  },
  renderEmbeddedPreview(tab) {
    if (!tab) return '<div class="feed-tab-empty"><b>当前筛选条件下暂无 Tab</b><span>可调整左侧状态筛选，或新增 Tab。</span></div>';
    const iconPreview = tab.iconImage ? `<img src="${tab.iconImage}" alt="" />` : '<span>Tab</span>';
    return `<section class="feed-tab-preview feed-embedded-preview-card" aria-label="Tab 前台预览"><div class="feed-app-tabs"><span class="feed-app-tab is-active"><i class="feed-app-icon">${iconPreview}</i>${this.escape(tab.tabName || '未命名 Tab')}${this.renderBadge(tab)}</span><span class="feed-app-tab">推荐</span><span class="feed-app-tab">好价</span></div><div class="feed-preview-card"><b>${this.escape(tab.tabName || '信息流 Tab')}</b><span>这里展示当前 Tab 的信息流资源位内容</span><div><i>精选返现</i><i>限时好价</i><i>热销推荐</i></div></div></section>`;
  },
  renderEmbeddedConfig(tab) {
    if (!tab) return '<div class="style-config-empty">请选择左侧 Tab，或点击新增 Tab 进行配置</div>';
    const field = (label, control) => `<div class="config-field"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    return `<div class="style-config-form feed-tab-form"><section class="home-entry-info-section shared-config-section"><h3>基本信息</h3>${field('<b class="field-required">*</b>Tab名称', `<input class="control" data-feed-embedded-field="tabName" value="${this.escape(tab.tabName)}" maxlength="12" placeholder="请输入 Tab 名称" />`)}${field('<b class="field-required">*</b>记录名称', `<input class="control" data-feed-embedded-field="recordName" value="${this.escape(tab.recordName)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}${this.renderImageControl('icon图片', 'iconImage', tab.iconImage)}${this.renderImageControl('角标图片', 'cornerImage', tab.cornerImage, '尾标图片优先于角标图片展示；尾标和角标互斥，前台仅展示一个。')}${this.renderImageControl('尾标图片', 'tailImage', tab.tailImage, '仅限 v8.95.0 及以上版本可用。')}</section>${window.ConfigurationSections.renderTargeting({ prefix: 'feed-tab', value: tab.targeting, required: true })}</div>`;
  },
  bindEmbedded() {
    const root = document.getElementById('feed-marketing-builder');
    if (!root) return;
    let saved = this.loadState();
    let draft = this.clone(saved);
    let filters = { status: new Set(['上线中', '待上线', '已下线']), resourceStatus: new Set(['上线中', '待上线', '已下线']) };
    const activeTab = () => draft.tabs.find((tab) => tab.id === draft.activeTabId);
    const readTargeting = (tab) => {
      const targeting = window.ConfigurationSections.normalizeTargeting(tab.targeting);
      targeting.identities = [...root.querySelectorAll('[data-feed-tab-identity]:checked')].map((input) => input.value);
      targeting.targetGroup = root.querySelector('[data-feed-tab-targeting-field="targetGroup"]')?.value || '';
      targeting.excludeGroup = root.querySelector('[data-feed-tab-targeting-field="excludeGroup"]')?.value || '';
      targeting.audiences = [...root.querySelectorAll('[data-feed-tab-audience]:checked')].map((input) => input.value);
      targeting.audienceInversion = root.querySelector('input[name="feed-tab-audience-inversion"]:checked')?.value || '否';
      targeting.experimentId = root.querySelector('[data-feed-tab-targeting-field="experimentId"]')?.value || '';
      targeting.excludeExperiment = root.querySelector('[data-feed-tab-targeting-field="excludeExperiment"]')?.value || '';
      root.querySelectorAll('[data-feed-tab-platform]').forEach((input) => { targeting.platformVersions[input.dataset.feedTabPlatform].enabled = input.checked; });
      root.querySelectorAll('[data-feed-tab-version]').forEach((input) => { const [key, type] = input.dataset.feedTabVersion.split(':'); targeting.platformVersions[key][type] = input.value; });
      targeting.onlineStart = root.querySelector('[data-feed-tab-targeting-field="onlineStart"]')?.value || '';
      targeting.onlineEnd = root.querySelector('[data-feed-tab-targeting-field="onlineEnd"]')?.value || '';
      targeting.status = root.querySelector('input[name="feed-tab-status"]:checked')?.value || '上线';
      tab.targeting = targeting;
    };
    const renderAll = () => {
      const visibleTabs = draft.tabs.filter((tab) => filters.status.has(tab.status) && filters.resourceStatus.has(tab.resourceStatus));
      const active = visibleTabs.find((tab) => tab.id === draft.activeTabId) || visibleTabs[0] || null;
      if (active && active.id !== draft.activeTabId) draft.activeTabId = active.id;
      const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
      root.querySelector('#feed-embedded-filters').innerHTML = `<div class="feed-embedded-filter"><strong>Tab状态</strong><div>${['上线中', '待上线', '已下线'].map((value) => `<label><input type="checkbox" data-feed-embedded-filter="status" value="${value}"${filters.status.has(value) ? ' checked' : ''} />${value}</label>`).join('')}</div></div><div class="feed-embedded-filter"><strong>资源位状态</strong><div>${['上线中', '待上线', '已下线'].map((value) => `<label><input type="checkbox" data-feed-embedded-filter="resourceStatus" value="${value}"${filters.resourceStatus.has(value) ? ' checked' : ''} />${value}</label>`).join('')}</div></div>`;
      root.querySelector('#feed-embedded-tab-list').innerHTML = `${visibleTabs.map((tab) => `<button class="feed-embedded-tab${tab.id === draft.activeTabId ? ' is-active' : ''}" type="button" data-feed-embedded-tab="${tab.id}">${this.escape(tab.tabName || '未命名 Tab')}${this.renderBadge(tab)}</button>`).join('')}<button class="feed-embedded-add" id="feed-embedded-add" type="button">+ 新增 Tab</button>`;
      root.querySelector('#feed-embedded-preview').innerHTML = this.renderEmbeddedPreview(active);
      root.querySelector('#feed-embedded-config-type').textContent = active ? `Tab · ${active.tabName || '未命名'}` : '未选择 Tab';
      root.querySelector('#feed-embedded-config-content').innerHTML = this.renderEmbeddedConfig(active);
      root.querySelector('#feed-embedded-undo').disabled = !dirty;
      root.querySelector('#feed-embedded-save').disabled = !dirty;
      window.BackofficeLayout.bindGlobalTooltips();
    };
    root.addEventListener('click', (event) => {
      const tabButton = event.target.closest('[data-feed-embedded-tab]');
      if (tabButton) { draft.activeTabId = tabButton.dataset.feedEmbeddedTab; renderAll(); return; }
      if (event.target.closest('#feed-embedded-add')) { const tab = this.createTab(); draft.tabs.push(tab); draft.activeTabId = tab.id; renderAll(); return; }
      const deleteButton = event.target.closest('[data-feed-image-delete]');
      if (deleteButton) { const tab = activeTab(); if (tab) { tab[deleteButton.dataset.feedImageDelete] = ''; renderAll(); } return; }
      if (event.target.closest('#feed-embedded-undo')) { draft = this.clone(saved); renderAll(); return; }
      if (event.target.closest('#feed-embedded-save')) { const tab = activeTab(); if (tab) readTargeting(tab); const invalid = draft.tabs.map((item) => this.validate(item)).find(Boolean); if (invalid) { window.BackofficeLayout.showToast?.(invalid); return; } saved = this.clone(draft); this.saveState(saved); renderAll(); window.BackofficeLayout.showToast?.('信息流配置已保存'); }
    });
    root.addEventListener('input', (event) => { const tab = activeTab(); if (!tab) return; if (event.target.matches('[data-feed-embedded-field]')) { tab[event.target.dataset.feedEmbeddedField] = event.target.value; renderAll(); return; } if (event.target.closest('.feed-tab-form')) { readTargeting(tab); const dirty = JSON.stringify(draft) !== JSON.stringify(saved); root.querySelector('#feed-embedded-undo').disabled = !dirty; root.querySelector('#feed-embedded-save').disabled = !dirty; } });
    root.addEventListener('change', async (event) => {
      const filter = event.target.closest('[data-feed-embedded-filter]');
      if (filter) { const group = filter.dataset.feedEmbeddedFilter; filter.checked ? filters[group].add(filter.value) : filters[group].delete(filter.value); renderAll(); return; }
      const imageInput = event.target.closest('[data-feed-image]');
      if (imageInput?.files?.[0]) { const tab = activeTab(); if (tab) { tab[imageInput.dataset.feedImage] = await this.readImage(imageInput.files[0]); renderAll(); } return; }
      const tab = activeTab(); if (tab && event.target.closest('.feed-tab-form')) { readTargeting(tab); const dirty = JSON.stringify(draft) !== JSON.stringify(saved); root.querySelector('#feed-embedded-undo').disabled = !dirty; root.querySelector('#feed-embedded-save').disabled = !dirty; }
    });
    renderAll();
  },
  renderWorkspace(draft, filters) {
    const nav = document.getElementById('feed-tab-nav');
    const workspace = document.getElementById('feed-tab-workspace');
    if (!nav || !workspace) return;
    const visibleTabs = draft.tabs.filter((tab) => filters.status.has(tab.status) && filters.resourceStatus.has(tab.resourceStatus));
    const active = visibleTabs.find((tab) => tab.id === draft.activeTabId) || visibleTabs[0] || null;
    if (active && active.id !== draft.activeTabId) draft.activeTabId = active.id;
    nav.innerHTML = `${visibleTabs.map((tab) => `<button class="feed-tab-item${tab.id === draft.activeTabId ? ' is-active' : ''}" type="button" role="tab" aria-selected="${tab.id === draft.activeTabId}" data-feed-tab="${tab.id}">${this.escape(tab.tabName || '未命名 Tab')}${this.renderBadge(tab)}</button>`).join('')}<button class="feed-tab-add" id="feed-tab-add" type="button" title="新增 Tab" aria-label="新增 Tab">+</button>`;
    const content = active ? this.renderTabDetail(active) : `<div class="feed-tab-empty"><b>当前筛选条件下暂无 Tab</b><span>可调整状态筛选，或点击右上角加号新增 Tab。</span></div>`;
    workspace.innerHTML = `${content}<div class="feed-tab-reference-overlay" role="note"><p>首页信息流营销整体配置如「返现」信息流营销配置。</p></div>`;
  },
  renderBadge(tab) {
    if (tab.tailImage) return `<img class="feed-tab-tail-badge" src="${tab.tailImage}" alt="" />`;
    if (tab.cornerImage) return `<img class="feed-tab-corner-badge" src="${tab.cornerImage}" alt="" />`;
    return '';
  },
  escape(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  },
  renderImageControl(label, field, image, note = '') {
    return `<div class="config-field feed-tab-image-field"><span class="config-field-label">${label}</span><div class="config-field-control"><div class="feed-tab-image-control">${image ? `<span class="feed-tab-image-preview"><img src="${image}" alt="已上传${label}" /></span>` : ''}<span class="feed-tab-image-actions"><label class="button secondary feed-tab-upload">上传图片<input type="file" accept="image/*" data-feed-image="${field}" /></label>${image ? `<button class="feed-tab-delete" type="button" data-feed-image-delete="${field}">删除图片</button>` : ''}</span></div>${note ? `<p class="feed-tab-image-note">${note}</p>` : ''}</div></div>`;
  },
  renderTabDetail(tab) {
    const field = (label, control) => `<div class="config-field"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    const iconPreview = tab.iconImage ? `<img src="${tab.iconImage}" alt="" />` : '<span>Tab</span>';
    return `<div class="feed-tab-layout"><section class="feed-tab-preview" aria-label="Tab 前台预览"><div class="feed-app-tabs"><span class="feed-app-tab is-active"><i class="feed-app-icon">${iconPreview}</i>${this.escape(tab.tabName || '未命名 Tab')}${this.renderBadge(tab)}</span><span class="feed-app-tab">推荐</span><span class="feed-app-tab">好价</span></div><div class="feed-preview-card"><b>${this.escape(tab.tabName || '信息流 Tab')}</b><span>这里展示当前 Tab 的信息流资源位内容</span><div><i>精选返现</i><i>限时好价</i><i>热销推荐</i></div></div></section><section class="feed-tab-detail"><h2>Tab详情</h2><div class="style-config-form feed-tab-form"><section class="home-entry-info-section shared-config-section"><h3>基本信息</h3>${field('<b class="field-required">*</b>Tab名称', `<input class="control" data-feed-field="tabName" value="${this.escape(tab.tabName)}" maxlength="12" placeholder="请输入 Tab 名称" />`)}${field('<b class="field-required">*</b>记录名称', `<input class="control" data-feed-field="recordName" value="${this.escape(tab.recordName)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}${this.renderImageControl('icon图片', 'iconImage', tab.iconImage)}${this.renderImageControl('角标图片', 'cornerImage', tab.cornerImage, '尾标图片优先于角标图片展示；尾标和角标互斥，前台仅展示一个。')}${this.renderImageControl('尾标图片', 'tailImage', tab.tailImage, '仅限 v8.95.0 及以上版本可用。')}</section>${window.ConfigurationSections.renderTargeting({ prefix: 'feed-tab', value: tab.targeting, required: true })}</div></section></div>`;
  },
  readImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result));
      reader.addEventListener('error', () => reject(reader.error));
      reader.readAsDataURL(file);
    });
  },
  validate(tab) {
    if (!tab.tabName.trim()) return '请填写 Tab名称';
    if (!tab.recordName.trim()) return '请填写 记录名称';
    return '';
  },
  bind() {
    let saved = this.loadState();
    let draft = this.clone(saved);
    let filters = { status: new Set(['上线中', '待上线', '已下线']), resourceStatus: new Set(['上线中', '待上线', '已下线']) };
    const updateActions = () => {
      const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
      document.getElementById('feed-page-actions').innerHTML = `<button class="button secondary" id="feed-undo" type="button"${dirty ? '' : ' disabled'}>撤销本次修改</button><button class="button primary" id="feed-save" type="button"${dirty ? '' : ' disabled'}>保存</button>`;
    };
    const renderAll = () => { this.renderWorkspace(draft, filters); updateActions(); window.BackofficeLayout.bindGlobalTooltips(); };
    const activeTab = () => draft.tabs.find((tab) => tab.id === draft.activeTabId);
    const readTargeting = (tab) => {
      const targeting = window.ConfigurationSections.normalizeTargeting(tab.targeting);
      document.querySelectorAll('[data-feed-tab-identity]').forEach((input) => { if (input.checked) targeting.identities.push(input.value); });
      targeting.targetGroup = document.querySelector('[data-feed-tab-targeting-field="targetGroup"]')?.value || '';
      targeting.excludeGroup = document.querySelector('[data-feed-tab-targeting-field="excludeGroup"]')?.value || '';
      targeting.audiences = [...document.querySelectorAll('[data-feed-tab-audience]:checked')].map((input) => input.value);
      targeting.audienceInversion = document.querySelector('input[name="feed-tab-audience-inversion"]:checked')?.value || '否';
      targeting.experimentId = document.querySelector('[data-feed-tab-targeting-field="experimentId"]')?.value || '';
      targeting.excludeExperiment = document.querySelector('[data-feed-tab-targeting-field="excludeExperiment"]')?.value || '';
      document.querySelectorAll('[data-feed-tab-platform]').forEach((input) => { targeting.platformVersions[input.dataset.feedTabPlatform].enabled = input.checked; });
      document.querySelectorAll('[data-feed-tab-version]').forEach((input) => { const [key, type] = input.dataset.feedTabVersion.split(':'); targeting.platformVersions[key][type] = input.value; });
      targeting.onlineStart = document.querySelector('[data-feed-tab-targeting-field="onlineStart"]')?.value || '';
      targeting.onlineEnd = document.querySelector('[data-feed-tab-targeting-field="onlineEnd"]')?.value || '';
      targeting.status = document.querySelector('input[name="feed-tab-status"]:checked')?.value || '上线';
      tab.targeting = targeting;
    };
    document.getElementById('page-root').addEventListener('click', async (event) => {
      const tabButton = event.target.closest('[data-feed-tab]');
      if (tabButton) { draft.activeTabId = tabButton.dataset.feedTab; renderAll(); return; }
      if (event.target.closest('#feed-tab-add')) { const tab = this.createTab(); draft.tabs.push(tab); draft.activeTabId = tab.id; renderAll(); return; }
      const deleteButton = event.target.closest('[data-feed-image-delete]');
      if (deleteButton) { activeTab()[deleteButton.dataset.feedImageDelete] = ''; renderAll(); return; }
      if (event.target.closest('#feed-undo')) { draft = this.clone(saved); renderAll(); return; }
      if (event.target.closest('#feed-save')) {
        const tab = activeTab();
        if (tab) readTargeting(tab);
        const invalid = draft.tabs.map((item) => this.validate(item)).find(Boolean);
        if (invalid) { window.BackofficeLayout.showToast?.(invalid); return; }
        saved = this.clone(draft); this.saveState(saved); updateActions(); window.BackofficeLayout.showToast?.('信息流配置已保存');
      }
    });
    document.getElementById('page-root').addEventListener('input', (event) => {
      const tab = activeTab(); if (!tab) return;
      if (event.target.matches('[data-feed-field]')) { tab[event.target.dataset.feedField] = event.target.value; updateActions(); return; }
      if (event.target.closest('.feed-tab-form')) { readTargeting(tab); updateActions(); }
    });
    document.getElementById('page-root').addEventListener('change', async (event) => {
      const filter = event.target.closest('[data-feed-filter] input');
      if (filter) { const group = filter.closest('[data-feed-filter]').dataset.feedFilter; filter.checked ? filters[group].add(filter.value) : filters[group].delete(filter.value); renderAll(); return; }
      const imageInput = event.target.closest('[data-feed-image]');
      if (imageInput?.files?.[0]) { activeTab()[imageInput.dataset.feedImage] = await this.readImage(imageInput.files[0]); renderAll(); return; }
      const tab = activeTab(); if (tab && event.target.closest('.feed-tab-form')) { readTargeting(tab); updateActions(); }
    });
    renderAll();
  }
};
