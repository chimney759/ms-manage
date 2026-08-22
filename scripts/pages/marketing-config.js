window.MarketingConfigPage = {
  storageKey: 'meiyou-cashback-home-marketing-config',
  benefitsFeedStorageKey: 'meiyou-cashback-benefits-feed-management',
  benefitsCheckInStorageKey: 'meiyou-cashback-benefits-check-in-management',
  cloneHomeState(state) {
    return JSON.parse(JSON.stringify(state));
  },
  loadHomeState(defaultState) {
    try {
      const saved = JSON.parse(window.localStorage.getItem(this.storageKey));
      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return this.cloneHomeState(defaultState);
      return {
        components: Array.isArray(saved.components) ? saved.components : defaultState.components,
        fixedEntries: Array.isArray(saved.fixedEntries) ? saved.fixedEntries : defaultState.fixedEntries,
        fixedEntriesComponentEnabled: typeof saved.fixedEntriesComponentEnabled === 'boolean'
          ? saved.fixedEntriesComponentEnabled
          : defaultState.fixedEntriesComponentEnabled
      };
    } catch (error) {
      return this.cloneHomeState(defaultState);
    }
  },
  saveHomeState(state) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(state));
  },
  cloneBenefitsFeedState(state) {
    return JSON.parse(JSON.stringify(state));
  },
  createBenefitsFeedComponent(type) {
    const definitions = {
      mosaic: { label: '信息流-拼图', hint: '多素材拼接展示，适用于活动主会场' },
      grid: { label: '信息流-宫格', hint: '多入口宫格展示，适用于分类运营' },
      'red-packet': { label: '信息流-红包', hint: '红包权益展示，适用于福利发放' }
    };
    const definition = definitions[type];
    return {
      id: `benefits-feed-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      label: definition.label,
      hint: definition.hint,
      recordName: '',
      sort: '',
      image: '',
      darkImage: '',
      routeType: 'page',
      routeValue: '',
      slotOrder: this.getBenefitsFeedSlotDefinitions(type).map((slot) => slot.id),
      targeting: window.ConfigurationSections.createTargeting(),
      testPlan: window.ConfigurationSections.createTestPlan()
    };
  },
  getBenefitsFeedSlotDefinitions(type) {
    const definitions = {
      mosaic: [
        { id: 'main', label: '主会场', detail: '福利活动主会场' },
        { id: 'limit', label: '限时' },
        { id: 'gift', label: '好礼' }
      ],
      grid: [
        { id: 'newcomer', label: '新人福利' },
        { id: 'coupon', label: '每日好券' },
        { id: 'task', label: '省钱任务' },
        { id: 'benefit', label: '精选权益' }
      ],
      'red-packet': [
        { id: 'content', label: '福利红包' },
        { id: 'action', label: '立即领取' }
      ]
    };
    return definitions[type] || [];
  },
  getBenefitsFeedSlots(component) {
    const definitions = this.getBenefitsFeedSlotDefinitions(component.type);
    const ids = new Set(definitions.map((slot) => slot.id));
    const savedOrder = Array.isArray(component.slotOrder) ? component.slotOrder.filter((id) => ids.has(id)) : [];
    const order = [...savedOrder, ...definitions.map((slot) => slot.id).filter((id) => !savedOrder.includes(id))];
    return order.map((id) => definitions.find((slot) => slot.id === id));
  },
  createDefaultBenefitsFeedState() {
    return { components: [] };
  },
  loadBenefitsFeedState() {
    const defaults = this.createDefaultBenefitsFeedState();
    try {
      const saved = JSON.parse(window.localStorage.getItem(this.benefitsFeedStorageKey));
      if (!saved || !Array.isArray(saved.components)) return defaults;
      return {
        components: saved.components.filter((item) => ['mosaic', 'grid', 'red-packet'].includes(item?.type)).map((item) => ({
          ...this.createBenefitsFeedComponent(item.type),
          ...item,
          slotOrder: this.getBenefitsFeedSlots({ type: item.type, slotOrder: item.slotOrder }).map((slot) => slot.id),
          targeting: window.ConfigurationSections.normalizeTargeting(item.targeting),
          testPlan: window.ConfigurationSections.normalizeTestPlan(item.testPlan)
        }))
      };
    } catch (error) {
      return defaults;
    }
  },
  saveBenefitsFeedState(state) {
    window.localStorage.setItem(this.benefitsFeedStorageKey, JSON.stringify(state));
  },
  createDefaultBenefitsCheckInState() {
    const record = (id, recordName, conflictPriority, createdAt, updatedAt) => ({
      id,
      recordName,
      targeting: {
        ...window.ConfigurationSections.createTargeting(),
        identities: ['辣妈'],
        audiences: ['大促活动用户'],
        onlineStart: '2026-01-07T00:00',
        onlineEnd: '2026-01-08T23:59'
      },
      status: '已下线',
      conflictPriority,
      creator: '罗至玲',
      createdAt,
      editor: '罗至玲',
      updatedAt
    });
    return { records: [
      record('1', '260107预发测试', true, '2026-01-07 13:41:31', '2026-08-05 16:26:01'),
      record('4', 'copy260107预发测试', false, '2026-01-07 14:53:20', '2026-01-07 20:29:44')
    ] };
  },
  normalizeBenefitsCheckInRecord(record = {}) {
    return {
      id: String(record.id || Date.now()),
      recordName: record.recordName || '',
      targeting: window.ConfigurationSections.normalizeTargeting(record.targeting),
      status: ['上线中', '待上线', '已下线'].includes(record.status) ? record.status : '待上线',
      conflictPriority: Boolean(record.conflictPriority),
      creator: record.creator || '当前运营',
      createdAt: record.createdAt || '',
      editor: record.editor || '当前运营',
      updatedAt: record.updatedAt || ''
    };
  },
  loadBenefitsCheckInState() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(this.benefitsCheckInStorageKey));
      if (!saved || !Array.isArray(saved.records)) return this.createDefaultBenefitsCheckInState();
      return { records: saved.records.map((record) => this.normalizeBenefitsCheckInRecord(record)) };
    } catch (error) {
      return this.createDefaultBenefitsCheckInState();
    }
  },
  saveBenefitsCheckInState(state) {
    window.localStorage.setItem(this.benefitsCheckInStorageKey, JSON.stringify(state));
  },
  formatCheckInDate(value) {
    return value ? String(value).replace('T', ' ') : '-';
  },
  formatCheckInTargeting(value) {
    const targeting = window.ConfigurationSections.normalizeTargeting(value);
    const summary = [];
    if (targeting.identities.length) summary.push(`指定人群身份:${targeting.identities.join('、')}`);
    if (targeting.audiences.length) summary.push(`定制人群:${targeting.audiences.join('、')}`);
    if (targeting.targetGroup) summary.push(`指定人群包:${targeting.targetGroup}`);
    return summary.join(' 与 ') || '全部用户';
  },
  currentCheckInTime() {
    const date = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  },
  renderBenefitsCheckInList() {
    return `<section class="benefits-check-in-management" aria-label="打卡功能营销配置列表">
      <div class="filters benefits-check-in-filters">
        <div class="field"><label for="check-in-name-filter">记录名称：</label><input class="control" id="check-in-name-filter" placeholder="请输入名称进行搜索" /></div>
        <div class="field"><label for="check-in-status-filter">状态：</label><select class="control" id="check-in-status-filter"><option value="">请选择状态</option><option value="上线中">上线中</option><option value="待上线">待上线</option><option value="已下线">已下线</option></select></div>
        <div class="field check-in-date-filter"><label>上线时间：</label><span class="check-in-date-controls"><input class="control" id="check-in-start-filter" type="datetime-local" aria-label="上线开始时间" /><i>-</i><input class="control" id="check-in-end-filter" type="datetime-local" aria-label="上线结束时间" /></span></div>
        <div class="filter-checkboxes"><label><input id="check-in-priority-filter" type="checkbox" />仅看冲突时优先展示</label></div>
      </div>
      <div class="actions benefits-check-in-actions"><button class="button primary" id="search-check-in" type="button">查询</button><button class="button secondary" id="add-check-in" type="button">新增配置</button></div>
      <div class="table-wrap"><table class="benefits-check-in-table"><thead><tr><th>ID</th><th>记录名称</th><th>定向信息</th><th>上线时间</th><th>下线时间</th><th>状态</th><th>冲突时优先展示 <button class="help-tooltip" type="button" data-tooltip="同一时间命中多条配置时，优先展示已勾选的配置。">?</button></th><th>创建人</th><th>创建时间</th><th>最后编辑</th><th>最后更新时间</th><th>操作</th></tr></thead><tbody id="check-in-table-body"></tbody></table></div>
      <div class="empty" id="check-in-empty" hidden><div class="empty-inner"><div class="empty-icon">▰</div><div>暂无配置数据</div></div></div>
      <div class="modal" id="check-in-modal" hidden></div>
    </section>`;
  },
  renderBenefitsCheckInModal(record, isNew) {
    const value = this.normalizeBenefitsCheckInRecord(record);
    const field = (label, control) => `<div class="config-field"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    return `<div class="modal-card check-in-modal-card" role="dialog" aria-modal="true" aria-labelledby="check-in-modal-title"><div class="modal-header"><h2 id="check-in-modal-title">${isNew ? '新增打卡功能营销配置' : '编辑打卡功能营销配置'}</h2><button class="icon-close" id="close-check-in-modal" type="button" aria-label="关闭">×</button></div><div class="modal-body check-in-modal-body"><div class="style-config-form home-component-form check-in-form"><section class="home-entry-info-section shared-config-section"><h3>基本信息</h3>${field('<b class="field-required">*</b>记录名称', `<input class="control" id="check-in-record-name" value="${this.escapeHtml(value.recordName)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}${field('<b class="field-required">*</b>上线时间', `<div class="config-date-range"><label><span>开始</span><input class="control" id="check-in-online-start" type="datetime-local" value="${this.escapeHtml(value.targeting.onlineStart)}" /></label><label><span>结束</span><input class="control" id="check-in-online-end" type="datetime-local" value="${this.escapeHtml(value.targeting.onlineEnd)}" /></label></div>`)}${field('<b class="field-required">*</b>状态', `<span class="home-entry-status-control"><label><input name="check-in-status" type="radio" value="上线中"${value.status === '上线中' ? ' checked' : ''} />上线中</label><label><input name="check-in-status" type="radio" value="待上线"${value.status === '待上线' ? ' checked' : ''} />待上线</label><label><input name="check-in-status" type="radio" value="已下线"${value.status === '已下线' ? ' checked' : ''} />已下线</label></span>`)}${field('冲突时优先展示', `<label class="check-in-priority-control"><input id="check-in-conflict-priority" type="checkbox"${value.conflictPriority ? ' checked' : ''} />优先展示</label>`)}</section>${window.ConfigurationSections.renderTargeting({ prefix: 'check-in', value: value.targeting, includeSchedule: false, required: true })}</div></div><div class="modal-footer"><button class="button secondary" id="cancel-check-in-modal" type="button">取消</button><button class="button primary" id="save-check-in-modal" type="button">保存</button></div></div>`;
  },
  bindBenefitsCheckInList() {
    const state = this.loadBenefitsCheckInState();
    const records = state.records;
    const tableBody = document.getElementById('check-in-table-body');
    const empty = document.getElementById('check-in-empty');
    const modal = document.getElementById('check-in-modal');
    const getFilters = () => ({
      name: document.getElementById('check-in-name-filter').value.trim().toLowerCase(),
      status: document.getElementById('check-in-status-filter').value,
      start: document.getElementById('check-in-start-filter').value,
      end: document.getElementById('check-in-end-filter').value,
      priority: document.getElementById('check-in-priority-filter').checked
    });
    const renderTable = () => {
      const filters = getFilters();
      const visible = records.filter((record) => {
        const start = record.targeting.onlineStart || '';
        return (!filters.name || record.recordName.toLowerCase().includes(filters.name))
          && (!filters.status || record.status === filters.status)
          && (!filters.start || start >= filters.start)
          && (!filters.end || start <= filters.end)
          && (!filters.priority || record.conflictPriority);
      });
      tableBody.innerHTML = visible.map((record) => `<tr><td>${this.escapeHtml(record.id)}</td><td>${this.escapeHtml(record.recordName)}</td><td><span class="check-in-targeting" title="${this.escapeHtml(this.formatCheckInTargeting(record.targeting))}">${this.escapeHtml(this.formatCheckInTargeting(record.targeting))}</span></td><td>${this.escapeHtml(this.formatCheckInDate(record.targeting.onlineStart))}</td><td>${this.escapeHtml(this.formatCheckInDate(record.targeting.onlineEnd))}</td><td><span class="status-badge${record.status === '已下线' ? ' is-inactive' : ''}">${this.escapeHtml(record.status)}</span></td><td>${record.conflictPriority ? '是' : '否'}</td><td>${this.escapeHtml(record.creator)}</td><td>${this.escapeHtml(record.createdAt)}</td><td>${this.escapeHtml(record.editor)}</td><td>${this.escapeHtml(record.updatedAt)}</td><td><div class="check-in-table-actions"><button class="check-in-table-action" type="button" data-check-in-edit="${this.escapeHtml(record.id)}">编辑</button><button class="check-in-table-action" type="button" data-check-in-copy="${this.escapeHtml(record.id)}">复制</button></div></td></tr>`).join('');
      empty.hidden = visible.length > 0;
    };
    const closeModal = () => { modal.hidden = true; modal.innerHTML = ''; };
    const readModalRecord = (base) => {
      const targeting = window.ConfigurationSections.normalizeTargeting(base.targeting);
      targeting.identities = [...modal.querySelectorAll('[data-check-in-identity]:checked')].map((input) => input.value);
      targeting.audiences = [...modal.querySelectorAll('[data-check-in-audience]:checked')].map((input) => input.value);
      targeting.targetGroup = modal.querySelector('[data-check-in-targeting-field="targetGroup"]')?.value.trim() || '';
      targeting.excludeGroup = modal.querySelector('[data-check-in-targeting-field="excludeGroup"]')?.value.trim() || '';
      targeting.audienceInversion = modal.querySelector('[name="check-in-audience-inversion"]:checked')?.value || '否';
      targeting.experimentId = modal.querySelector('[data-check-in-targeting-field="experimentId"]')?.value.trim() || '';
      targeting.excludeExperiment = modal.querySelector('[data-check-in-targeting-field="excludeExperiment"]')?.value.trim() || '';
      ['ios', 'android', 'harmony'].forEach((platform) => {
        targeting.platformVersions[platform].enabled = modal.querySelector(`[data-check-in-platform="${platform}"]`)?.checked ?? false;
        targeting.platformVersions[platform].start = modal.querySelector(`[data-check-in-version="${platform}:start"]`)?.value.trim() || '';
        targeting.platformVersions[platform].end = modal.querySelector(`[data-check-in-version="${platform}:end"]`)?.value.trim() || '';
      });
      targeting.onlineStart = modal.querySelector('#check-in-online-start').value;
      targeting.onlineEnd = modal.querySelector('#check-in-online-end').value;
      return { ...base, recordName: modal.querySelector('#check-in-record-name').value.trim(), targeting, status: modal.querySelector('[name="check-in-status"]:checked')?.value || '待上线', conflictPriority: modal.querySelector('#check-in-conflict-priority').checked };
    };
    const openModal = (record = null) => {
      const isNew = !record;
      const now = this.currentCheckInTime();
      const draft = this.normalizeBenefitsCheckInRecord(record || { id: String(Date.now()), creator: '当前运营', editor: '当前运营', createdAt: now, updatedAt: now });
      modal.innerHTML = this.renderBenefitsCheckInModal(draft, isNew);
      modal.hidden = false;
      const handleModalClick = (event) => {
        if (event.target === modal || event.target.closest('#close-check-in-modal, #cancel-check-in-modal')) { closeModal(); return; }
        if (!event.target.closest('#save-check-in-modal')) return;
        const next = readModalRecord(draft);
        if (!next.recordName || !next.targeting.onlineStart || !next.targeting.onlineEnd) {
          window.BackofficeLayout.showToast('请完善必填项', '请填写记录名称和上线时间');
          return;
        }
        if (next.targeting.onlineStart > next.targeting.onlineEnd) {
          window.BackofficeLayout.showToast('上线时间有误', '上线结束时间不能早于开始时间');
          return;
        }
        next.updatedAt = this.currentCheckInTime();
        if (isNew) records.unshift(next);
        else Object.assign(records.find((item) => item.id === next.id), next);
        try { this.saveBenefitsCheckInState({ records }); } catch (error) { window.BackofficeLayout.showToast('保存失败', '本地演示数据无法保存，请稍后重试'); return; }
        closeModal();
        renderTable();
        window.BackofficeLayout.showToast(isNew ? '新增成功' : '保存成功', '打卡功能营销配置已更新');
      };
      modal.onclick = handleModalClick;
    };
    document.getElementById('search-check-in').addEventListener('click', renderTable);
    document.getElementById('check-in-name-filter').addEventListener('keydown', (event) => { if (event.key === 'Enter') renderTable(); });
    document.getElementById('add-check-in').addEventListener('click', () => openModal());
    tableBody.addEventListener('click', (event) => {
      const edit = event.target.closest('[data-check-in-edit]');
      if (edit) { openModal(records.find((record) => record.id === edit.dataset.checkInEdit)); return; }
      const copy = event.target.closest('[data-check-in-copy]');
      if (!copy) return;
      const source = records.find((record) => record.id === copy.dataset.checkInCopy);
      if (!source) return;
      const now = this.currentCheckInTime();
      const cloned = JSON.parse(JSON.stringify(source));
      cloned.id = String(Math.max(0, ...records.map((record) => Number(record.id) || 0)) + 1);
      cloned.recordName = `copy${source.recordName}`;
      cloned.conflictPriority = false;
      cloned.creator = '当前运营';
      cloned.editor = '当前运营';
      cloned.createdAt = now;
      cloned.updatedAt = now;
      records.unshift(cloned);
      try { this.saveBenefitsCheckInState({ records }); } catch (error) { window.BackofficeLayout.showToast('复制失败', '本地演示数据无法保存，请稍后重试'); return; }
      renderTable();
      window.BackofficeLayout.showToast('已复制配置', '已创建一条新的打卡功能营销配置');
    });
    renderTable();
  },
  readImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result));
      reader.addEventListener('error', () => reject(reader.error));
      reader.readAsDataURL(file);
    });
  },
  clearObjectUrl(value) {
    if (typeof value === 'string' && value.startsWith('blob:')) URL.revokeObjectURL(value);
  },
  render({ homeView = 'function' } = {}) {
    const isFeedView = homeView === 'feed';
    const heading = isFeedView
      ? { title: '首页-信息流营销', note: '维护首页信息流 Tab、资源位状态及展示配置' }
      : { title: '首页-功能区营销', note: '维护首页功能区对应的营销展示配置' };
    return `<section class="content marketing-config-page"><section class="marketing-navigation panel"><nav class="marketing-tabs" aria-label="底部Tab"><strong class="marketing-tabs-title">底部Tab</strong><div class="marketing-tabs-list" role="tablist"><button class="marketing-tab is-active" type="button" role="tab" aria-selected="true" data-marketing-tab="home">首页 <small>Home</small></button><button class="marketing-tab" type="button" role="tab" aria-selected="false" data-marketing-tab="benefits">福利页 <small>第2Tab</small></button><button class="marketing-tab" type="button" role="tab" aria-selected="false" data-marketing-tab="youzi-street">柚子街 <small>第3Tab</small></button><button class="marketing-tab" type="button" role="tab" aria-selected="false" data-marketing-tab="mine">我 <small>Mine</small></button></div></nav><nav class="marketing-home-subnav" aria-label="页面子导航">${this.renderPrimarySubnav('home', homeView)}</nav></section><section class="marketing-editor-workspace panel"><div class="marketing-workspace-heading"><div><h1>${heading.title}</h1><span class="heading-note">${heading.note}</span></div><div class="marketing-page-actions" id="marketing-page-actions"></div></div><div class="marketing-config-body" id="marketing-config-body">${isFeedView ? window.FeedManagementPage.renderEmbedded() : this.renderHomeBuilder()}</div></section></section>`;
  },
  renderPrimarySubnav(tab, homeView = 'function') {
    const items = {
      home: [
        { id: 'function', label: '功能区营销', target: 'home-function' },
        { id: 'feed', label: '信息流营销', target: 'home-feed' }
      ],
      benefits: [
        { id: 'feed', label: '福利页-信息流', target: 'benefits-feed' },
        { id: 'check-in', label: '打卡功能营销配置', target: 'benefits-check-in' },
        { id: 'check-in-success', label: '打卡成功弹窗营销配置', target: 'benefits-check-in-success' }
      ],
      'youzi-street': [
        { id: 'feed', label: '柚子街-信息流', target: 'youzi-street-feed' },
        { id: 'flash-sale', label: '柚子街-限时抢购', target: 'youzi-street-flash-sale' }
      ],
      mine: [{ id: 'feed', label: '我-信息流', target: 'mine-feed' }]
    };
    const activeView = items[tab].some((item) => item.id === homeView) ? homeView : items[tab][0].id;
    return `<div role="tablist">${items[tab].map((item) => `<button class="marketing-home-subtab${item.id === activeView ? ' is-active' : ''}" type="button" role="tab" aria-selected="${item.id === activeView}" data-marketing-primary-view="${item.target}">${item.label}</button>`).join('')}</div>`;
  },
  renderHomeBuilder() {
    return `<section class="home-marketing-builder" id="home-marketing-builder">
      <aside class="home-marketing-tools"><h2>组件</h2><p>点击组件添加至首页预览区域</p><div class="home-tool-list">
        <button class="home-tool" type="button" draggable="true" data-home-add="search" data-tooltip="支持在功能区排序"><b>⌕</b><span>功能区-橱窗</span></button>
        <button class="home-tool" type="button" draggable="true" data-home-add="shortcut" data-tooltip="支持在功能区排序"><b>▦</b><span>功能区-红包发放功能</span></button>
      </div></aside>
      <section class="home-marketing-preview"><div class="style-panel-heading"><h2>页面预览</h2><span>所见即所得</span></div><div class="home-phone-stage"><div class="home-component-editor" id="home-component-editor" aria-label="组件编辑入口"></div><p class="home-preview-source-note" role="note">信息流内容来自首页-信息流营销配置，仅供预览</p><div class="home-phone-frame"><section class="home-fixed-header" aria-label="首页固定功能预览"><img class="home-preview-fixed-header-image" src="assets/marketing-config/home-preview-fixed-header.png" alt="美柚省钱首页固定头部" /><div class="home-fixed-entries" id="home-fixed-entries"></div></section><section class="home-static-preview-module home-notification-module" aria-label="通知功能预览"><img class="home-preview-notification-image" src="assets/marketing-config/home-preview-notification.png" alt="红包到期通知" /></section><div class="home-function-slot" id="home-function-slot-after-notification"></div><section class="home-static-preview-module home-search-paste-module" aria-label="搜索粘贴功能预览"><img class="home-preview-search-paste-image" src="assets/marketing-config/home-preview-search-paste.png" alt="复制商品链接快速查返现" /></section><div class="home-function-slot" id="home-function-slot-after-search-paste"></div><div class="home-phone-canvas" id="home-phone-canvas"></div></div></div></section>
      <aside class="home-marketing-settings"><div class="style-panel-heading"><h2>配置</h2><span id="home-config-type">未选择组件</span></div><div class="home-config-content" id="home-config-content"><div class="style-config-empty">从左侧添加组件，或点击预览中的组件进行配置</div></div><div class="home-config-actions"><span class="home-component-save-tooltip" data-tooltip="保存当前组件配置后，仍需点击页面保存才能提交整页配置。"><button class="button primary" id="save-home-component" type="button">保存组件</button></span></div></aside>
    </section>`;
  },
  renderPrimaryTabPlaceholder(tab, view = 'feed') {
    const pages = {
      benefits: view === 'check-in'
        ? { title: '打卡功能营销配置', note: '福利页打卡功能的营销配置将在此处维护' }
        : view === 'check-in-success'
          ? { title: '打卡成功弹窗营销配置', note: '福利页打卡成功弹窗的营销配置将在此处维护' }
          : { title: '福利页', note: '第 2 Tab 的营销配置将在此处维护' },
      'youzi-street': view === 'flash-sale'
        ? { title: '柚子街-限时抢购', note: '【平移柚子街限时抢购功能】柚子街限时抢购配置将在此处维护。' }
        : { title: '柚子街（第3Tab）', note: '配置与「返现」的逛逛保持一致' },
      mine: { title: '我', note: 'Mine 页的营销配置将在此处维护，仅支持拼图配置' }
    };
    const page = pages[tab];
    return `<div class="marketing-primary-tab-placeholder${tab === 'youzi-street' ? ' marketing-primary-tab-placeholder--youzi-street' : ''}${tab === 'mine' ? ' marketing-primary-tab-placeholder--mine' : ''}"><b>${page.title}</b><span>${page.note}</span></div>`;
  },
  renderBenefitsFeedBuilder() {
    return `<section class="home-marketing-builder benefits-feed-builder" id="benefits-feed-builder">
      <aside class="home-marketing-tools benefits-feed-tools"><h2>组件</h2><p>选择组件添加至福利页信息流预览区域</p><div class="home-tool-list">
        <button class="home-tool" type="button" draggable="true" data-benefits-feed-add="mosaic"><b>◫</b><span>信息流-拼图</span><small>活动素材组合展示</small></button>
        <button class="home-tool" type="button" draggable="true" data-benefits-feed-add="grid"><b>▦</b><span>信息流-宫格</span><small>分类入口组合展示</small></button>
        <button class="home-tool" type="button" draggable="true" data-benefits-feed-add="red-packet"><b>￥</b><span>信息流-红包</span><small>红包权益内容展示</small></button>
      </div></aside>
      <section class="home-marketing-preview benefits-feed-preview"><div class="style-panel-heading"><h2>页面预览</h2><span>福利页信息流</span></div><div class="home-phone-stage"><div class="home-phone-frame benefits-feed-phone-frame"><div class="benefits-feed-phone-header"><b>福利中心</b><span>精选好礼</span></div><div class="benefits-feed-phone-content" id="benefits-feed-preview-content"></div></div></div></section>
      <aside class="home-marketing-settings benefits-feed-settings"><div class="style-panel-heading"><h2>配置</h2><span id="benefits-feed-config-type">未选择组件</span></div><div class="home-config-content" id="benefits-feed-config-content"></div><div class="benefits-feed-settings-overlay" role="note"><ol><li>配置与逛逛首页一致。</li><li>暂不支持 Tab 配置。</li><li>资源位类型调整为“组件”定义。</li></ol></div></aside>
    </section>`;
  },
  renderBenefitsFeedPreview(components, activeId) {
    const container = document.getElementById('benefits-feed-preview-content');
    if (!container) return;
    if (!components.length) {
      container.innerHTML = '<div class="benefits-feed-empty"><b>+</b><span>从左侧添加信息流组件</span></div>';
      return;
    }
    const preview = (component) => {
      const active = component.id === activeId ? ' is-active' : '';
      const image = component.image ? `<img src="${component.image}" alt="${component.label}素材" />` : '';
      const name = this.escapeHtml(component.recordName || component.label);
      const slot = (item, content, className = '') => `<span class="benefits-feed-slot ${className}" draggable="true" data-benefits-feed-slot="${item.id}">${content}</span>`;
      const slots = this.getBenefitsFeedSlots(component);
      if (component.type === 'mosaic') {
        const [main, ...side] = slots;
        return `<button class="benefits-feed-card benefits-feed-mosaic${active}" type="button" draggable="true" data-benefits-feed-component="${component.id}">${image || `${slot(main, `<b>${main.id === 'main' ? name : main.label}</b><small>${main.detail || '活动素材坑位'}</small>`, 'benefits-feed-mosaic-main')}<span class="benefits-feed-mosaic-side">${side.map((item) => slot(item, item.label)).join('')}</span>`}</button>`;
      }
      if (component.type === 'grid') return `<button class="benefits-feed-card benefits-feed-grid${active}" type="button" draggable="true" data-benefits-feed-component="${component.id}">${image || `<b>${name}</b><span>${slots.map((item) => slot(item, item.label)).join('')}</span>`}</button>`;
      return `<button class="benefits-feed-card benefits-feed-red-packet${active}" type="button" draggable="true" data-benefits-feed-component="${component.id}">${image || `<span>${slots.map((item) => item.id === 'content' ? slot(item, `<small>福利红包</small><b>${name}</b>`, 'benefits-feed-red-packet-content') : slot(item, item.label, 'benefits-feed-red-packet-action')).join('')}</span>`}</button>`;
    };
    container.innerHTML = components.map(preview).join('');
  },
  renderBenefitsFeedConfig(component) {
    const container = document.getElementById('benefits-feed-config-content');
    const type = document.getElementById('benefits-feed-config-type');
    if (!container || !type) return;
    if (!component) {
      type.textContent = '未选择组件';
      container.innerHTML = '<div class="style-config-empty">从左侧添加组件，或点击预览中的组件进行配置</div>';
      return;
    }
    type.textContent = component.label;
    const field = (label, control, className = '') => `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    const asset = (label, name, value) => `<span class="benefits-feed-asset"><span class="benefits-feed-asset-preview">${value ? `<img src="${value}" alt="已上传${label}" />` : '<b>图片</b>'}</span><span class="benefits-feed-asset-actions"><label class="button secondary benefits-feed-upload">上传图片<input type="file" accept="image/*" data-benefits-feed-image="${name}" /></label><button class="home-entry-delete" type="button" data-benefits-feed-delete="${name}"${value ? '' : ' disabled'}>删除图片</button></span></span>`;
    container.innerHTML = `<div class="style-config-form home-component-form benefits-feed-form"><section class="home-entry-info-section shared-config-section"><h3>资源位信息</h3>
      ${field('<b class="field-required">*</b>记录名称', `<input class="control" data-benefits-feed-field="recordName" value="${this.escapeHtml(component.recordName)}" placeholder="仅用于后台记录，前台不可见" />`)}
      ${field('<b class="field-required">*</b>组件', `<input class="control benefits-feed-type-control" value="${component.label}" disabled />`)}
      ${field('<b class="field-required">*</b>排序', `<input class="control" data-benefits-feed-field="sort" value="${this.escapeHtml(component.sort)}" inputmode="numeric" placeholder="越大展示越靠前" />`)}
      ${field('素材配置', `<div class="benefits-feed-assets">${asset('正常模式', 'image', component.image)}${asset('暗黑模式', 'darkImage', component.darkImage)}</div>`, 'benefits-feed-asset-field')}
      ${field('跳转类型', `<select class="control" data-benefits-feed-field="routeType"><option value="page"${component.routeType === 'page' ? ' selected' : ''}>页面跳转</option><option value="protocol"${component.routeType === 'protocol' ? ' selected' : ''}>自定义地址/协议</option></select>`)}
      ${field(component.routeType === 'protocol' ? '地址/协议' : '目标页面', `<input class="control" data-benefits-feed-field="routeValue" value="${this.escapeHtml(component.routeValue)}" placeholder="请输入${component.routeType === 'protocol' ? '地址或协议' : '目标页面'}" />`)}
    </section>${window.ConfigurationSections.renderTargeting({ prefix: 'benefits-feed', value: component.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'benefits-feed', value: component.testPlan })}<button class="text-button home-remove-component" type="button" data-benefits-feed-remove="${component.id}">移除组件</button></div>`;
  },
  bindBenefitsFeedBuilder(navigate) {
    const state = this.loadBenefitsFeedState();
    const components = state.components;
    let activeId = components[0]?.id || null;
    let isEditing = false;
    let savedState = this.cloneBenefitsFeedState({ components });
    let draggedToolType = null;
    let draggedComponentId = null;
    let draggedSlot = null;
    const activeComponent = () => components.find((item) => item.id === activeId);
    const snapshot = () => ({ components });
    const hasChanges = () => JSON.stringify(snapshot()) !== JSON.stringify(savedState);
    const activatePrimaryTab = (tab) => document.querySelectorAll('[data-marketing-tab]').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    const guardUnsavedNavigation = async (onProceed) => {
      if (!isEditing || !hasChanges()) { onProceed(); return; }
      const confirmed = await window.BackofficeLayout.confirm({ title: '确认关闭编辑？', message: '当前编辑的内容未保存，是否仍然要关闭', confirmText: '仍然关闭', cancelText: '继续编辑' });
      if (confirmed) onProceed();
    };
    const updateEditState = () => {
      const builder = document.getElementById('benefits-feed-builder');
      const actions = document.getElementById('marketing-page-actions');
      builder.classList.toggle('is-editing', isEditing);
      actions.innerHTML = `<span class="home-undo-tooltip" data-tooltip="本次修改可以一键恢复到最近一次保存的页面配置。"><button class="button secondary" id="cancel-benefits-feed" type="button"${!isEditing || !hasChanges() ? ' disabled' : ''}>撤销本次修改</button></span><button class="button primary${isEditing ? '' : ' is-edit-action'}" id="save-benefits-feed" type="button">${isEditing ? '保存页面' : '编辑'}</button>`;
      document.querySelectorAll('[data-benefits-feed-add], #benefits-feed-config-content input, #benefits-feed-config-content select, #benefits-feed-config-content [data-benefits-feed-delete], #benefits-feed-config-content [data-benefits-feed-remove]').forEach((control) => { control.disabled = !isEditing || control.classList.contains('benefits-feed-type-control'); });
      document.querySelectorAll('[data-benefits-feed-add], [data-benefits-feed-component], [data-benefits-feed-slot]').forEach((item) => { item.draggable = isEditing; });
    };
    const render = () => { this.renderBenefitsFeedPreview(components, activeId); this.renderBenefitsFeedConfig(activeComponent()); updateEditState(); };
    document.querySelectorAll('[data-marketing-tab]').forEach((tab) => tab.addEventListener('click', () => {
      if (tab.classList.contains('is-active')) return;
      guardUnsavedNavigation(() => { activatePrimaryTab(tab); this.showPrimaryTabContext(tab.dataset.marketingTab, 'feed', navigate); });
    }));
    document.querySelector('.marketing-home-subnav')?.addEventListener('click', (event) => {
      const subtab = event.target.closest('[data-marketing-primary-view]');
      if (!subtab || subtab.classList.contains('is-active')) return;
      const target = subtab.dataset.marketingPrimaryView;
      guardUnsavedNavigation(() => {
        if (target === 'home-function') navigate?.('marketing-config');
        else if (target === 'home-feed') navigate?.('feed-management');
        else {
          const views = { 'youzi-street-flash-sale': 'flash-sale', 'benefits-check-in': 'check-in', 'benefits-check-in-success': 'check-in-success' };
          const tab = document.querySelector('[data-marketing-tab].is-active')?.dataset.marketingTab;
          if (tab) this.showPrimaryTabContext(tab, views[target] || 'feed', navigate);
        }
      });
    });
    document.querySelectorAll('[data-benefits-feed-add]').forEach((button) => button.addEventListener('click', () => {
      if (!isEditing) return;
      const component = this.createBenefitsFeedComponent(button.dataset.benefitsFeedAdd);
      components.push(component);
      activeId = component.id;
      render();
    }));
    const previewContent = document.getElementById('benefits-feed-preview-content');
    const clearDragState = () => {
      draggedToolType = null;
      draggedComponentId = null;
      draggedSlot = null;
      document.querySelectorAll('.benefits-feed-builder .is-dragging, .benefits-feed-builder .is-dragover').forEach((item) => item.classList.remove('is-dragging', 'is-dragover'));
    };
    document.querySelectorAll('[data-benefits-feed-add]').forEach((button) => button.addEventListener('dragstart', (event) => {
      if (!isEditing) { event.preventDefault(); return; }
      clearDragState();
      draggedToolType = button.dataset.benefitsFeedAdd;
      button.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('text/plain', `benefits-feed-tool:${draggedToolType}`);
    }));
    previewContent.addEventListener('dragstart', (event) => {
      if (!isEditing) { event.preventDefault(); return; }
      const slot = event.target.closest('[data-benefits-feed-slot]');
      const component = event.target.closest('[data-benefits-feed-component]');
      if (!component) return;
      clearDragState();
      if (slot) {
        event.stopPropagation();
        draggedSlot = { componentId: component.dataset.benefitsFeedComponent, slotId: slot.dataset.benefitsFeedSlot };
        slot.classList.add('is-dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', `benefits-feed-slot:${draggedSlot.slotId}`);
        return;
      }
      draggedComponentId = component.dataset.benefitsFeedComponent;
      component.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', `benefits-feed-component:${draggedComponentId}`);
    });
    previewContent.addEventListener('dragover', (event) => {
      if (!isEditing || (!draggedToolType && !draggedComponentId && !draggedSlot)) return;
      event.preventDefault();
      const slot = event.target.closest('[data-benefits-feed-slot]');
      const component = event.target.closest('[data-benefits-feed-component]');
      if (draggedSlot) {
        if (slot && component?.dataset.benefitsFeedComponent === draggedSlot.componentId && slot.dataset.benefitsFeedSlot !== draggedSlot.slotId) slot.classList.add('is-dragover');
        return;
      }
      if (component && component.dataset.benefitsFeedComponent !== draggedComponentId) component.classList.add('is-dragover');
      else previewContent.classList.add('is-dragover');
    });
    previewContent.addEventListener('dragleave', (event) => {
      const item = event.target.closest('.benefits-feed-card, .benefits-feed-slot, #benefits-feed-preview-content');
      if (item && !item.contains(event.relatedTarget)) item.classList.remove('is-dragover');
    });
    previewContent.addEventListener('drop', (event) => {
      if (!isEditing || (!draggedToolType && !draggedComponentId && !draggedSlot)) return;
      event.preventDefault();
      const targetSlot = event.target.closest('[data-benefits-feed-slot]');
      const targetCard = event.target.closest('[data-benefits-feed-component]');
      if (draggedSlot) {
        const component = components.find((item) => item.id === draggedSlot.componentId);
        if (component && targetSlot && targetCard?.dataset.benefitsFeedComponent === component.id && targetSlot.dataset.benefitsFeedSlot !== draggedSlot.slotId) {
          const order = this.getBenefitsFeedSlots(component).map((slot) => slot.id);
          const from = order.indexOf(draggedSlot.slotId);
          const to = order.indexOf(targetSlot.dataset.benefitsFeedSlot);
          [order[from], order[to]] = [order[to], order[from]];
          component.slotOrder = order;
          activeId = component.id;
          render();
        }
        clearDragState();
        return;
      }
      const targetIndex = targetCard ? components.findIndex((item) => item.id === targetCard.dataset.benefitsFeedComponent) : components.length;
      if (draggedToolType) {
        const component = this.createBenefitsFeedComponent(draggedToolType);
        components.splice(Math.max(0, targetIndex), 0, component);
        activeId = component.id;
        render();
      } else if (draggedComponentId) {
        const from = components.findIndex((item) => item.id === draggedComponentId);
        let to = targetIndex;
        if (from >= 0 && from !== to) {
          const [component] = components.splice(from, 1);
          if (!targetCard) to = components.length;
          components.splice(Math.max(0, Math.min(to, components.length)), 0, component);
          activeId = component.id;
          render();
        }
      }
      clearDragState();
    });
    previewContent.addEventListener('dragend', clearDragState);
    document.querySelectorAll('[data-benefits-feed-add]').forEach((button) => button.addEventListener('dragend', clearDragState));
    previewContent.addEventListener('click', (event) => {
      const component = event.target.closest('[data-benefits-feed-component]');
      if (!component) return;
      activeId = component.dataset.benefitsFeedComponent;
      render();
    });
    document.getElementById('benefits-feed-config-content').addEventListener('input', (event) => {
      if (!isEditing) return;
      const component = activeComponent();
      if (!component) return;
      if (event.target.dataset.benefitsFeedField) component[event.target.dataset.benefitsFeedField] = event.target.value;
      if (event.target.dataset.benefitsFeedTargetingField) component.targeting[event.target.dataset.benefitsFeedTargetingField] = event.target.value;
      if (event.target.dataset.benefitsFeedTest) component.testPlan[event.target.dataset.benefitsFeedTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      this.renderBenefitsFeedPreview(components, activeId);
      updateEditState();
    });
    document.getElementById('benefits-feed-config-content').addEventListener('change', async (event) => {
      if (!isEditing) return;
      const component = activeComponent();
      if (!component) return;
      if (event.target.matches('[data-benefits-feed-image]')) {
        const file = event.target.files?.[0];
        if (!file) return;
        const field = event.target.dataset.benefitsFeedImage;
        this.clearObjectUrl(component[field]);
        component[field] = await this.readImageFile(file);
      }
      if (event.target.dataset.benefitsFeedField) component[event.target.dataset.benefitsFeedField] = event.target.value;
      if (event.target.matches('[data-benefits-feed-identity]')) component.targeting.identities = [...document.querySelectorAll('[data-benefits-feed-identity]:checked')].map((input) => input.value);
      if (event.target.matches('[data-benefits-feed-audience]')) component.targeting.audiences = [...document.querySelectorAll('[data-benefits-feed-audience]:checked')].map((input) => input.value);
      if (event.target.name === 'benefits-feed-audience-inversion') component.targeting.audienceInversion = event.target.value;
      if (event.target.name === 'benefits-feed-status') component.targeting.status = event.target.value;
      if (event.target.matches('[data-benefits-feed-platform]')) component.targeting.platformVersions[event.target.dataset.benefitsFeedPlatform].enabled = event.target.checked;
      if (event.target.matches('[data-benefits-feed-version]')) { const [platform, edge] = event.target.dataset.benefitsFeedVersion.split(':'); component.targeting.platformVersions[platform][edge] = event.target.value; }
      if (event.target.dataset.benefitsFeedTargetingField) component.targeting[event.target.dataset.benefitsFeedTargetingField] = event.target.value;
      if (event.target.dataset.benefitsFeedTest) component.testPlan[event.target.dataset.benefitsFeedTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      render();
    });
    document.getElementById('benefits-feed-config-content').addEventListener('click', (event) => {
      if (!isEditing) return;
      const component = activeComponent();
      const deletion = event.target.closest('[data-benefits-feed-delete]');
      if (deletion && component) { const field = deletion.dataset.benefitsFeedDelete; this.clearObjectUrl(component[field]); component[field] = ''; render(); return; }
      const removal = event.target.closest('[data-benefits-feed-remove]');
      if (!removal) return;
      const index = components.findIndex((item) => item.id === removal.dataset.benefitsFeedRemove);
      if (index < 0) return;
      components.splice(index, 1);
      activeId = components[index]?.id || components[index - 1]?.id || null;
      render();
    });
    document.getElementById('marketing-page-actions').addEventListener('click', (event) => {
      const action = event.target.closest('button');
      if (!action) return;
      if (action.id === 'save-benefits-feed') {
        if (!isEditing) { isEditing = true; updateEditState(); return; }
        const invalid = components.find((component) => !component.recordName.trim() || !component.sort.trim());
        if (invalid) { window.BackofficeLayout.showToast('请完善必填项', '请补充资源位记录名称和排序'); return; }
        try { this.saveBenefitsFeedState(this.cloneBenefitsFeedState(snapshot())); } catch (error) { window.BackofficeLayout.showToast('页面保存失败', '本地演示数据无法保存，请减少图片素材后重试'); return; }
        savedState = this.cloneBenefitsFeedState(snapshot());
        isEditing = false;
        render();
        window.BackofficeLayout.showToast('页面保存成功', '福利页信息流营销已更新');
      }
      if (action.id === 'cancel-benefits-feed' && isEditing && hasChanges()) {
        const saved = this.cloneBenefitsFeedState(savedState);
        components.splice(0, components.length, ...saved.components);
        activeId = components[0]?.id || null;
        isEditing = false;
        render();
        window.BackofficeLayout.showToast('已撤销修改', '已恢复到最近一次保存的页面配置');
      }
    });
    render();
  },
  showPrimaryTabContext(tab, homeView, navigate) {
    const subnav = document.querySelector('.marketing-home-subnav');
    const body = document.getElementById('marketing-config-body');
    const actions = document.getElementById('marketing-page-actions');
    if (tab === 'home') {
      navigate?.(homeView === 'feed' ? 'feed-management' : 'marketing-config');
      return;
    }
    const pageTitles = { benefits: '福利页', 'youzi-street': '柚子街', mine: '我' };
    const title = pageTitles[tab];
    const activeView = tab === 'youzi-street' && homeView === 'flash-sale'
      ? 'flash-sale'
      : tab === 'benefits' && ['check-in', 'check-in-success'].includes(homeView)
        ? homeView
        : 'feed';
    const isFlashSale = tab === 'youzi-street' && activeView === 'flash-sale';
    const isCheckIn = tab === 'benefits' && activeView === 'check-in';
    const isCheckInSuccess = tab === 'benefits' && activeView === 'check-in-success';
    subnav.innerHTML = this.renderPrimarySubnav(tab, activeView);
    if (tab === 'benefits' && activeView === 'feed') {
      document.querySelector('.marketing-config-page h1').textContent = '福利页-信息流营销';
      document.querySelector('.marketing-config-page .heading-note').textContent = '维护福利页信息流资源位展示配置';
      body.innerHTML = this.renderBenefitsFeedBuilder();
      actions.innerHTML = '';
      this.bindBenefitsFeedBuilder(navigate);
      return;
    }
    if (tab === 'benefits' && activeView === 'check-in') {
      document.querySelector('.marketing-config-page h1').textContent = '打卡功能营销配置';
      document.querySelector('.marketing-config-page .heading-note').textContent = '维护福利页打卡功能对应的营销展示配置';
      body.innerHTML = this.renderBenefitsCheckInList();
      actions.innerHTML = '';
      this.bindBenefitsCheckInList();
      return;
    }
    document.querySelector('.marketing-config-page h1').textContent = isFlashSale
      ? '柚子街-限时抢购'
      : isCheckIn
        ? '打卡功能营销配置'
        : isCheckInSuccess
          ? '打卡成功弹窗营销配置'
          : `${title}-信息流营销`;
    document.querySelector('.marketing-config-page .heading-note').textContent = isFlashSale
      ? '维护柚子街限时抢购展示配置'
      : isCheckIn
        ? '维护福利页打卡功能对应的营销展示配置'
        : isCheckInSuccess
          ? '维护福利页打卡成功弹窗对应的营销展示配置'
          : `维护${title}信息流对应的营销展示配置`;
    body.innerHTML = this.renderPrimaryTabPlaceholder(tab, activeView);
    actions.innerHTML = '';
  },
  createHomeComponent(type) {
    const definitions = {
      search: { type, label: '功能区-橱窗', placeholder: '搜优惠、搜商品', functionSlot: 'after-notification', sortable: true, showcase: { name: '', sort: '', windowType: 'mosaic', mosaic: { image: '', darkImage: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true }, newcomer: { image: '', darkImage: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true }, targeting: window.ConfigurationSections.createTargeting(), testPlan: window.ConfigurationSections.createTestPlan() } },
      shortcut: { type, label: '功能区-红包发放功能', subtitle: '领取返现红包', functionSlot: 'after-notification', sortable: true, redPacket: { name: '', sort: '', deliveryType: 'single', titleArea: false, title: '', subtitle: '', titleImage: '', titleDarkImage: '', unclaimedImage: '', unclaimedDarkImage: '', template: 'with-button', targeting: window.ConfigurationSections.createTargeting(), testPlan: window.ConfigurationSections.createTestPlan() } }
    };
    return { id: `home-component-${Date.now()}-${Math.random().toString(16).slice(2)}`, ...definitions[type] };
  },
  isFunctionZoneComponent(component) {
    return ['search', 'shortcut'].includes(component.type);
  },
  escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  },
  getFeedMarketingTabs() {
    const feedState = window.FeedManagementPage?.loadState?.();
    if (!feedState?.tabs) return [];
    return feedState.tabs.filter((tab) => tab.status === '上线中' && tab.resourceStatus === '上线中');
  },
  renderLinkedFeedPreview() {
    const tabs = this.getFeedMarketingTabs();
    const sourceMark = '<span class="home-linked-feed-source-mark">取自信息流配置</span>';
    if (!tabs.length) return `<section class="home-linked-feed" aria-label="首页信息流营销预览">${sourceMark}<div class="home-linked-feed-empty">暂无可展示的信息流资源位</div></section>`;
    const activeTab = tabs[0];
    const icon = activeTab.iconImage ? `<img src="${activeTab.iconImage}" alt="" />` : '<span>Tab</span>';
    const badge = activeTab.tailImage || activeTab.cornerImage;
    return `<section class="home-linked-feed" aria-label="首页信息流营销预览">${sourceMark}<div class="home-linked-feed-tabs">${tabs.map((tab, index) => `<span class="home-linked-feed-tab${index === 0 ? ' is-active' : ''}">${index === 0 ? `<i class="home-linked-feed-icon">${icon}</i>` : ''}${this.escapeHtml(tab.tabName || '未命名 Tab')}${index === 0 && badge ? `<img class="home-linked-feed-badge" src="${badge}" alt="" />` : ''}</span>`).join('')}</div><div class="home-linked-feed-card"><b>${this.escapeHtml(activeTab.tabName || '信息流 Tab')}</b><span>信息流资源位内容</span><div><i>精选返现</i><i>限时好价</i><i>热销推荐</i></div></div></section>`;
  },
  renderHomePreview(components, activeId) {
    const canvas = document.getElementById('home-phone-canvas');
    const notificationSlot = document.getElementById('home-function-slot-after-notification');
    const searchPasteSlot = document.getElementById('home-function-slot-after-search-paste');
    if (!canvas || !notificationSlot || !searchPasteSlot) return;
    components.forEach((component) => {
      if (this.isFunctionZoneComponent(component) && component.functionSlot === 'after-header') component.functionSlot = 'after-notification';
    });
    const renderComponent = (component) => {
      const active = component.id === activeId ? ' is-active' : '';
      let content = '';
      if (component.type === 'search') {
        const showcase = component.showcase || {};
        const windowConfig = showcase[showcase.windowType] || {};
        const placeholder = showcase.windowType === 'newcomer' ? '待上传新人滑块商品图片' : '待上传拼图图片';
        content = windowConfig.image
          ? `<img class="home-showcase-preview-image" src="${windowConfig.image}" alt="橱窗 Banner 预览" />`
          : `<span class="home-showcase-preview-placeholder"><b>橱窗 Banner</b><small>${placeholder}</small></span>`;
      }
      if (component.type === 'shortcut') {
        const deliveryType = component.redPacket?.deliveryType === 'package' ? 'package' : 'single';
        const preview = deliveryType === 'package'
          ? { src: 'assets/marketing-config/red-packet-package-delivery-preview.png', alt: '红包券包发放预览' }
          : { src: 'assets/marketing-config/red-packet-single-delivery-preview.png', alt: '新人专享红包单个发放预览' };
        content = `<img class="home-red-packet-delivery-preview" src="${preview.src}" alt="${preview.alt}" />`;
      }
      const sortable = ' home-preview-component-sortable';
      const draggable = ' draggable="true" data-tooltip="支持在功能区排序"';
      const previewType = component.type === 'search' ? 'showcase' : component.type;
      return `<button class="home-preview-component home-preview-${previewType}${active}${sortable}" type="button" data-home-component-id="${component.id}"${draggable}>${content}</button>`;
    };
    const renderFunctionZone = (slotId) => {
      const zoneComponents = components.filter((component) => this.isFunctionZoneComponent(component) && component.functionSlot === slotId);
      const content = zoneComponents.length ? zoneComponents.map(renderComponent).join('') : '<div class="home-canvas-empty"><b>+</b><span>拖入功能区组件</span></div>';
      return `<section class="home-preview-drop-zone home-function-drop-zone" data-home-drop-zone="function" data-home-function-slot="${slotId}" aria-label="功能区组件投放区">${content}</section>`;
    };
    notificationSlot.innerHTML = renderFunctionZone('after-notification');
    searchPasteSlot.innerHTML = renderFunctionZone('after-search-paste');
    canvas.innerHTML = this.renderLinkedFeedPreview();
  },
  renderComponentEditor(components, activeId, isFixedEntriesComponentActive) {
    const editor = document.getElementById('home-component-editor');
    if (!editor) return;
    editor.innerHTML = `<span>功能金刚区-可视状态管理</span><div><button class="home-component-editor-item${isFixedEntriesComponentActive ? ' is-active' : ''}" type="button" data-home-editor-fixed>功能金刚区</button></div>`;
  },
  renderFixedEntries(entries, activeIndex, componentEnabled = true, componentActive = false) {
    const container = document.getElementById('home-fixed-entries');
    if (!container) return;
    container.classList.toggle('is-active', componentActive || activeIndex !== null);
    container.classList.toggle('is-component-active', componentActive);
    container.classList.toggle('is-component-disabled', !componentEnabled);
    container.innerHTML = componentEnabled
      ? entries.filter((entry) => entry.enabled !== false).map((entry, index) => `<button class="home-fixed-entry${entries.indexOf(entry) === activeIndex ? ' is-active' : ''}" type="button" data-home-fixed-entry="${entries.indexOf(entry)}"><u>${this.renderFixedEntryImage(entry)}</u><span>${entry.title}</span></button>`).join('')
      : '<button class="home-fixed-entries-disabled" type="button">功能金刚区未开启</button>';
  },
  getFixedEntryImage(entry, mode = 'normal') {
    return mode === 'dark' && entry.darkImage ? entry.darkImage : entry.image;
  },
  renderFixedEntryImage(entry, mode = 'normal') {
    const image = this.getFixedEntryImage(entry, mode);
    return image && (image.startsWith('blob:') || image.startsWith('data:image/')) ? `<img src="${image}" alt="" />` : (image || '图');
  },
  renderFixedEntryConfig(entry, index) {
    const container = document.getElementById('home-config-content');
    const type = document.getElementById('home-config-type');
    if (!container || !type) return;
    type.textContent = `功能金刚区 · 入口 ${index + 1}`;
    const field = (label, control, className = '') => `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    const renderAsset = (label, inputId, image, required = false) => field(`${required ? '<b class="field-required" aria-label="必填">*</b>' : ''}${label}`, `<span class="home-entry-asset"><span class="home-entry-asset-preview">${image && (image.startsWith('blob:') || image.startsWith('data:image/')) ? `<img src="${image}" alt="已上传素材" />` : '<b>图片</b>'}</span><span class="home-entry-asset-actions"><label class="button secondary home-entry-upload">上传图片<input id="${inputId}" type="file" accept="image/*"${required ? ' required' : ''} /></label><button class="home-entry-delete" type="button" data-home-entry-delete="${inputId}"${image ? '' : ' disabled'}>删除图片</button></span></span>`);
    const jumpTarget = entry.jumpType === 'link' ? entry.linkTarget : entry.pageTarget;
    const jumpDescription = entry.jumpType === 'link' ? field('<b class="field-required" aria-label="必填">*</b>地址/协议说明', `<span class="home-jump-input-with-help"><input class="control" id="home-fixed-entry-jump-description" value="${entry.jumpDescription || ''}" required placeholder="请输入地址/协议说明" /><button class="help-tooltip" type="button" aria-label="地址或协议说明" data-tooltip="备注目标地址的相关信息，例如淘宝618会场活动">?</button></span>`) : '';
    const jumpInfo = `<section class="home-jump-info-section"><h3>跳转配置</h3>${field('<b class="field-required" aria-label="必填">*</b>跳转类型', `<select class="control" id="home-fixed-entry-jump-type" required><option value="page"${entry.jumpType === 'page' ? ' selected' : ''}>页面跳转</option><option value="link"${entry.jumpType === 'link' ? ' selected' : ''}>自定义地址/协议</option></select>`)}${field(`<b class="field-required" aria-label="必填">*</b>${entry.jumpType === 'link' ? '地址/协议' : '目标页面'}`, `<input class="control" id="home-fixed-entry-jump-target" value="${jumpTarget || ''}" required placeholder="${entry.jumpType === 'link' ? '请输入自定义地址或协议' : '请选择或输入目标页面'}" />`)}${jumpDescription}</section>`;
    const enableInfo = `<section class="home-entry-info-section home-entry-status-section"><h3>启用状态</h3><div class="home-entry-status-row"><span>是否启用</span><span class="home-entry-status-control"><label><input type="radio" name="home-fixed-entry-enabled" value="enabled"${entry.enabled !== false ? ' checked' : ''} />启用</label><label><input type="radio" name="home-fixed-entry-enabled" value="disabled"${entry.enabled === false ? ' checked' : ''} />停用</label></span><button class="help-tooltip" type="button" aria-label="启用状态说明" data-tooltip="启用则当前入口在客户端可见。停用则当前入口在客户端不可见。">?</button></div><p>仅控制当前入口的展示状态，不影响当前组件下的其他坑位。</p></section>`;
    const targeting = entry.targeting || { identities: [], targetGroup: '', excludeGroup: '' };
    const identityOptions = ['经期', '怀孕', '备孕', '辣妈', '亲友', '仅注册MS用户'];
    const targetingInfo = `<section class="home-entry-info-section home-targeting-section"><h3>定向信息</h3>${field('用户身份', `<span class="home-identity-options">${identityOptions.map((identity) => `<label><input type="checkbox" value="${identity}" data-home-fixed-entry-identity ${targeting.identities.includes(identity) ? 'checked' : ''} />${identity}</label>`).join('')}</span>`)}${field('指定人群包', `<input class="control" id="home-fixed-entry-target-group" value="${targeting.targetGroup || ''}" placeholder="不填默认全部用户" />`)}${field('排除人群包', `<input class="control" id="home-fixed-entry-exclude-group" value="${targeting.excludeGroup || ''}" placeholder="不填默认为空" />`)}</section>`;
    const testPlan = entry.testPlan || { uids: '', start: '', end: '', enabled: false };
    const testPlanInfo = `<section class="home-entry-info-section home-test-plan-section"><h3>测试计划</h3><p>测试 UID 内的用户将在测试有效时间内看到此入口配置，到期自动终止。</p>${field('测试 UID', `<input class="control" id="home-fixed-entry-test-uids" value="${testPlan.uids || ''}" placeholder="多个 UID 用英文逗号分隔" />`)}${field('测试时间', `<div class="config-date-range"><label><span>开始</span><input class="control" id="home-fixed-entry-test-start" type="datetime-local" value="${testPlan.start || ''}" /></label><label><span>结束</span><input class="control" id="home-fixed-entry-test-end" type="datetime-local" value="${testPlan.end || ''}" /></label></div>`)}${field('测试状态', `<label class="home-test-enabled"><input id="home-fixed-entry-test-enabled" type="checkbox"${testPlan.enabled ? ' checked' : ''} /><span class="switch-track"></span><b>${testPlan.enabled ? '生效' : '未生效'}</b></label>`)}</section>`;
    container.innerHTML = `<div class="style-config-form home-component-form home-fixed-entry-form"><div class="home-fixed-config-note">功能金刚区的入口支持维护启用状态、图片、标题与跳转配置。</div><section class="home-entry-info-section"><h3>基本展示信息</h3>${renderAsset('入口素材', 'home-fixed-entry-image', entry.image, true)}${renderAsset('入口素材（暗黑模式）', 'home-fixed-entry-dark-image', entry.darkImage)}${field('<b class="field-required" aria-label="必填">*</b>标题', '<input class="control" id="home-fixed-entry-title" value="' + entry.title + '" maxlength="5" required placeholder="请输入标题，最多5个字" />')}</section>${jumpInfo}${targetingInfo}${testPlanInfo}${enableInfo}<p>入口素材、标题、跳转类型和跳转目标为必填项，标题最多支持 5 个字。暗黑模式素材未配置时，默认使用入口素材；修改后会实时同步至中间预览区域。</p></div>`;
  },
  renderFixedEntriesComponentConfig(enabled) {
    const container = document.getElementById('home-config-content');
    const type = document.getElementById('home-config-type');
    if (!container || !type) return;
    type.textContent = '功能金刚区';
    container.innerHTML = `<div class="style-config-form home-component-form home-fixed-entry-form"><section class="home-entry-info-section home-entry-status-section"><h3>功能金刚区</h3><div class="home-entry-status-row"><span>是否开启组件</span><span class="home-entry-status-control"><label><input type="radio" name="home-fixed-entries-enabled" value="enabled"${enabled ? ' checked' : ''} />开启</label><label><input type="radio" name="home-fixed-entries-enabled" value="disabled"${enabled ? '' : ' checked'} />不开启</label></span><button class="help-tooltip" type="button" aria-label="功能金刚区开启说明" data-tooltip="开启后，功能金刚区将在客户端展示；不开启，则用户端不可见。">?</button></div></section><p>该开关仅控制功能金刚区整体展示，不影响各入口已维护的配置内容。</p></div>`;
  },
  renderHomeConfig(component) {
    const container = document.getElementById('home-config-content');
    const type = document.getElementById('home-config-type');
    if (!container || !type) return;
    if (!component) {
      type.textContent = '未选择组件';
      container.innerHTML = '<div class="style-config-empty">从左侧添加组件，或点击预览中的组件进行配置</div>';
      return;
    }
    type.textContent = component.type === 'product-flow' ? '信息流' : component.type === 'shortcut' ? '功能区-红包发放功能' : component.label;
    if (component.type === 'shortcut') {
      const redPacket = component.redPacket || { name: '', sort: '', deliveryType: 'single', titleArea: false, title: '', subtitle: '', titleImage: '', titleDarkImage: '', unclaimedImage: '', unclaimedDarkImage: '', template: 'with-button', targeting: window.ConfigurationSections.createTargeting(), testPlan: window.ConfigurationSections.createTestPlan() };
      component.redPacket = redPacket;
      Object.assign(redPacket, { title: '', subtitle: '', titleImage: '', titleDarkImage: '', unclaimedImage: '', unclaimedDarkImage: '', template: 'with-button', ...redPacket });
      const baseInfo = `<section class="home-entry-info-section shared-config-section"><h3>基础信息</h3><div class="config-field"><span class="config-field-label"><b class="field-required">*</b>记录名称</span><div class="config-field-control"><input class="control" data-home-red-packet-field="name" value="${redPacket.name}" placeholder="仅用于后台记录，前台不可见" /></div></div><div class="config-field"><span class="config-field-label"><b class="field-required">*</b>排序</span><div class="config-field-control"><input class="control" data-home-red-packet-field="sort" value="${redPacket.sort}" inputmode="numeric" placeholder="越大展示越靠前" /></div></div></section>`;
      const titleImageControl = (label, field, image) => `<div class="home-red-packet-title-asset"><span class="home-red-packet-title-asset-preview">${image ? `<img src="${image}" alt="已上传${label}" />` : '<b>图片</b>'}</span><span class="home-red-packet-title-asset-actions"><label class="button secondary home-entry-upload">${label}<input type="file" accept="image/*" data-home-red-packet-image="${field}" /></label><button class="home-entry-delete" type="button" data-home-red-packet-delete="${field}"${image ? '' : ' disabled'}>删除图片</button></span></div>`;
      const titleAreaInfo = redPacket.titleArea ? `<div class="home-red-packet-title-area-fields"><div class="config-field"><span class="config-field-label">标题</span><div class="config-field-control"><input class="control" data-home-red-packet-field="title" value="${redPacket.title}" placeholder="请输入标题" /></div></div><div class="config-field"><span class="config-field-label">副标题</span><div class="config-field-control"><input class="control" data-home-red-packet-field="subtitle" value="${redPacket.subtitle}" placeholder="请输入副标题" /></div></div><div class="config-field home-red-packet-title-image-field"><span class="config-field-label">标题图片</span><div class="config-field-control"><div class="home-red-packet-title-assets">${titleImageControl('上传图片', 'titleImage', redPacket.titleImage)}${titleImageControl('暗黑模式', 'titleDarkImage', redPacket.titleDarkImage)}</div><p>若同时填写文字标题，以图片优先展示。</p></div></div></div>` : '';
      const packageAssetControl = (label, field, image, required = false) => `<div class="home-red-packet-package-asset"><span class="home-red-packet-title-asset-preview">${image ? `<img src="${image}" alt="已上传${label}" />` : '<b>图片</b>'}</span><span class="home-red-packet-title-asset-actions"><label class="button secondary home-entry-upload">${label}<input type="file" accept="image/*" data-home-red-packet-image="${field}"${required ? ' required' : ''} /></label><button class="home-entry-delete" type="button" data-home-red-packet-delete="${field}"${image ? '' : ' disabled'}>删除图片</button></span></div>`;
      const packageInfo = redPacket.deliveryType === 'package' ? `<div class="home-red-packet-package-info"><p class="home-red-packet-package-notice">同一券包配置内，关联红包每人最多可领取一次，无法重复领取</p><div class="config-field home-red-packet-package-assets"><span class="config-field-label"><b class="field-required">*</b>未领取图片素材</span><div class="config-field-control"><div class="home-red-packet-package-asset-list">${packageAssetControl('上传图片', 'unclaimedImage', redPacket.unclaimedImage, true)}${packageAssetControl('暗黑模式', 'unclaimedDarkImage', redPacket.unclaimedDarkImage)}</div><p class="home-red-packet-package-help">用户未领取时展示整张素材图。未领取态不展示标题区，以图片素材为主视觉。</p></div></div></div>` : '';
      const packageTemplateInfo = redPacket.deliveryType === 'package' ? `<div class="config-field home-red-packet-template-field"><span class="config-field-label"><b class="field-required">*</b>红包模板</span><div class="config-field-control"><span class="home-red-packet-template-options"><label class="home-red-packet-template-card${redPacket.template === 'with-button' ? ' is-selected' : ''}"><input type="radio" name="home-red-packet-template" value="with-button"${redPacket.template === 'with-button' ? ' checked' : ''} /><span class="home-red-packet-template-copy"><b>模板一：有去使用按钮</b><small>已领取/待使用状态下展示“去使用”按钮，点击后按红包自身配置的跳转地址跳转。</small></span><img class="home-red-packet-template-preview" src="assets/marketing-config/red-packet-template-with-button.png" alt="模板一红包样式示意" /></label><label class="home-red-packet-template-card${redPacket.template === 'without-button' ? ' is-selected' : ''}"><input type="radio" name="home-red-packet-template" value="without-button"${redPacket.template === 'without-button' ? ' checked' : ''} /><span class="home-red-packet-template-copy"><b>模板二：无去使用按钮</b><small>已领取/待使用状态下不展示按钮。适用于红包跳转地址为返现首页，避免用户点击后仍停留首页。</small></span><img class="home-red-packet-template-preview" src="assets/marketing-config/red-packet-template-without-button.png" alt="模板二红包样式示意" /></label></span><p class="home-red-packet-template-help">若关联红包的跳转地址为返现首页，建议选择“无去使用按钮”，避免用户感知为按钮无效。</p></div></div>` : '';
      const featureInfo = `<section class="home-entry-info-section shared-config-section"><h3>功能信息</h3><div class="config-field"><span class="config-field-label"><b class="field-required">*</b>发放类型</span><div class="config-field-control"><span class="home-entry-status-control"><label><input type="radio" name="home-red-packet-delivery" value="single"${redPacket.deliveryType === 'single' ? ' checked' : ''} />单个发放</label><label><input type="radio" name="home-red-packet-delivery" value="package"${redPacket.deliveryType === 'package' ? ' checked' : ''} />券包发放</label></span></div></div>${packageInfo}<div class="config-field"><span class="config-field-label">是否配置标题区</span><div class="config-field-control"><span class="home-entry-status-control"><label><input type="checkbox" data-home-red-packet-title-area${redPacket.titleArea ? ' checked' : ''} />配置标题区</label></span></div></div>${titleAreaInfo}${packageTemplateInfo}<div class="home-red-packet-link"><span>关联返现红包</span><div class="home-red-packet-link-control"><button class="button secondary" type="button" disabled title="本原型不展开红包关联明细">+ 关联红包</button><div class="home-red-packet-link-placeholder">关联区</div></div></div></section>`;
      container.innerHTML = `<div class="style-config-form home-component-form home-red-packet-form">${baseInfo}${featureInfo}${window.ConfigurationSections.renderTargeting({ prefix: 'home-red-packet', value: redPacket.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'home-red-packet', value: redPacket.testPlan })}<p>带 * 的字段为必填项。关联红包仅保留入口，不在此处配置选择明细。</p><button class="text-button home-remove-component" type="button" data-home-remove="${component.id}">移除组件</button></div>`;
      return;
    }
    if (component.type === 'search') {
      const showcase = component.showcase || { name: '', sort: '', windowType: 'mosaic', mosaic: { image: '', darkImage: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true }, newcomer: { image: '', darkImage: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true }, targeting: window.ConfigurationSections.createTargeting(), testPlan: window.ConfigurationSections.createTestPlan() };
      component.showcase = showcase;
      showcase.mosaic = { image: '', darkImage: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true, ...showcase.mosaic };
      showcase.newcomer = { image: '', darkImage: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true, ...showcase.newcomer };
      showcase.targeting = window.ConfigurationSections.normalizeTargeting(showcase.targeting);
      showcase.testPlan = window.ConfigurationSections.normalizeTestPlan(showcase.testPlan);
      const windowConfig = showcase[showcase.windowType];
      const field = (label, control, className = '') => `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
      const assetControl = (label, fieldName, image) => `<span class="home-showcase-asset"><span class="home-showcase-asset-preview">${image ? `<img src="${image}" alt="已上传${label}" />` : '<b>图片</b>'}</span><span class="home-showcase-asset-actions"><label class="button secondary home-entry-upload">${label}<input type="file" accept="image/*" data-home-showcase-image="${fieldName}" /></label><button class="home-entry-delete" type="button" data-home-showcase-delete="${fieldName}"${image ? '' : ' disabled'}>删除图片</button></span></span>`;
      const help = (text) => `<button class="help-tooltip home-showcase-help" type="button" aria-label="字段说明" data-tooltip="${text}">?</button>`;
      const mosaicConfig = `<div class="home-showcase-workspace"><div class="home-showcase-canvas" aria-label="${showcase.windowType === 'mosaic' ? '拼图' : '新人滑块商品'}配置示意"><div class="home-showcase-piece${windowConfig.image ? ' has-image' : ''}">${windowConfig.image ? `<img src="${windowConfig.image}" alt="已上传橱窗素材" />` : '<span>上传橱窗图片</span>'}<b>★</b></div><button class="home-showcase-node" type="button" aria-label="添加拼图位">+</button><div class="home-showcase-canvas-add">+</div></div><span class="home-showcase-route-example">路由协议填写示例</span><div class="home-showcase-assets">${assetControl('上传图片', 'image', windowConfig.image)}${assetControl('暗黑模式', 'darkImage', windowConfig.darkImage)}</div><div class="home-showcase-route-row"><select class="control" data-home-showcase-field="routeType"><option value="">请选择跳转类型</option><option value="page"${windowConfig.routeType === 'page' ? ' selected' : ''}>页面跳转</option><option value="protocol"${windowConfig.routeType === 'protocol' ? ' selected' : ''}>自定义地址/协议</option></select><input class="control" data-home-showcase-field="routeProtocol" value="${windowConfig.routeProtocol}" placeholder="请输入路由协议" /></div><div class="home-showcase-input-help"><input class="control" data-home-showcase-field="pid" value="${windowConfig.pid}" placeholder="pid（除京东&拼多多&抖音&1688，其余商城用于埋点上报）" />${help('用于商城埋点上报的 PID 配置。')}</div><div class="home-showcase-input-help"><select class="control" data-home-showcase-field="selectedPid"><option value="">请选择 pid</option><option value="default"${windowConfig.selectedPid === 'default' ? ' selected' : ''}>默认 pid</option><option value="custom"${windowConfig.selectedPid === 'custom' ? ' selected' : ''}>自定义 pid</option></select>${help('选择当前橱窗展示使用的 PID。')}</div><div class="home-showcase-input-help"><input class="control" data-home-showcase-field="skipType" value="${windowConfig.skipType}" placeholder="skip_type（用于埋点上报）" />${help('用于记录跳转类型的埋点字段。')}</div><input class="control" data-home-showcase-field="mallId" value="${windowConfig.mallId}" placeholder="商城 id" /><div class="home-showcase-popup-row">${assetControl('出站弹窗 logo', 'popupLogo', windowConfig.popupLogo)}<input class="control" data-home-showcase-field="popupCopy" value="${windowConfig.popupCopy}" placeholder="出站弹窗文案" /></div><label class="home-showcase-login"><input type="checkbox" data-home-showcase-field="requiresLogin"${windowConfig.requiresLogin ? ' checked' : ''} />用户需登录</label></div>`;
      const baseInfo = `<section class="home-entry-info-section shared-config-section"><h3>基础信息</h3>${field('<b class="field-required">*</b>功能类型', '<select class="control home-showcase-function-type" disabled aria-label="功能类型：橱窗功能"><option value="showcase">橱窗功能</option></select>')}${field('<b class="field-required">*</b>名称', `<input class="control" data-home-showcase-base="name" value="${showcase.name}" placeholder="仅用于后台记录，前台不可见" />`)}${field('<b class="field-required">*</b>排序', `<input class="control" data-home-showcase-base="sort" value="${showcase.sort}" inputmode="numeric" placeholder="越大展示越靠前" />`)}</section>`;
      const featureInfo = `<section class="home-entry-info-section shared-config-section home-showcase-feature-section"><h3>功能信息</h3>${field('橱窗类型', `<select class="control" data-home-showcase-window-type><option value="mosaic"${showcase.windowType === 'mosaic' ? ' selected' : ''}>拼图</option><option value="newcomer"${showcase.windowType === 'newcomer' ? ' selected' : ''}>新人滑块商品</option></select>`)}${field(`${showcase.windowType === 'mosaic' ? '拼图' : '新人滑块商品'}配置`, mosaicConfig, 'home-showcase-config-field')}</section>`;
      container.innerHTML = `<div class="style-config-form home-component-form home-showcase-form">${baseInfo}${featureInfo}${window.ConfigurationSections.renderTargeting({ prefix: 'home-showcase', value: showcase.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'home-showcase', value: showcase.testPlan })}<p>带 * 的字段为必填项。橱窗类型切换后会保留各自已填写的配置内容。</p><button class="text-button home-remove-component" type="button" data-home-remove="${component.id}">移除组件</button></div>`;
      return;
    }
    const nameField = component.type === 'search' ? `<label>底纹词<input class="control" id="home-component-label" value="${component.placeholder}" placeholder="请输入搜索底纹词" /></label>` : `<label>组件标题<input class="control" id="home-component-label" value="${component.label}" placeholder="请输入组件标题" /></label>`;
    const subField = ['banner', 'product-flow', 'shortcut'].includes(component.type) ? `<label>辅助文案<input class="control" id="home-component-subtitle" value="${component.subtitle || ''}" placeholder="请输入辅助文案" /></label>` : '';
    container.innerHTML = `<div class="style-config-form home-component-form">${nameField}${subField}<p>修改后会实时同步至中间预览区域。</p><button class="text-button home-remove-component" type="button" data-home-remove="${component.id}">移除组件</button></div>`;
  },
  bindHomeBuilder(navigate) {
    const components = [];
    const fixedEntries = [
      { image: '●', darkImage: '', title: '我的红包', enabled: true, jumpType: 'page', pageTarget: '红包中心', linkTarget: '', jumpDescription: '', targeting: { identities: [], targetGroup: '', excludeGroup: '' }, testPlan: { uids: '', start: '', end: '', enabled: false } },
      { image: '▰', darkImage: '', title: '商品收藏', enabled: true, jumpType: 'page', pageTarget: '商品收藏', linkTarget: '', jumpDescription: '', targeting: { identities: [], targetGroup: '', excludeGroup: '' }, testPlan: { uids: '', start: '', end: '', enabled: false } },
      { image: '⌁', darkImage: '', title: '购物车返现', enabled: true, jumpType: 'page', pageTarget: '购物车返现', linkTarget: '', jumpDescription: '', targeting: { identities: [], targetGroup: '', excludeGroup: '' }, testPlan: { uids: '', start: '', end: '', enabled: false } },
      { image: '✓', darkImage: '', title: '领现金', enabled: true, jumpType: 'page', pageTarget: '领现金', linkTarget: '', jumpDescription: '', targeting: { identities: [], targetGroup: '', excludeGroup: '' }, testPlan: { uids: '', start: '', end: '', enabled: false } },
      { image: 'ϟ', darkImage: '', title: '省钱秘籍', enabled: true, jumpType: 'page', pageTarget: '省钱秘籍', linkTarget: '', jumpDescription: '', targeting: { identities: [], targetGroup: '', excludeGroup: '' }, testPlan: { uids: '', start: '', end: '', enabled: false } }
    ];
    const defaultState = this.cloneHomeState({ components, fixedEntries, fixedEntriesComponentEnabled: true });
    const storedState = this.loadHomeState(defaultState);
    components.push(...this.cloneHomeState(storedState.components).filter((component) => this.isFunctionZoneComponent(component)));
    fixedEntries.splice(0, fixedEntries.length, ...this.cloneHomeState(storedState.fixedEntries));
    let activeId = null;
    let activeFixedEntryIndex = null;
    let isFixedEntriesComponentActive = false;
    let fixedEntriesComponentEnabled = storedState.fixedEntriesComponentEnabled;
    let isEditing = false;
    let componentSavedState = this.cloneHomeState({ components, fixedEntries, fixedEntriesComponentEnabled });
    let pageSavedState = this.cloneHomeState({ components, fixedEntries, fixedEntriesComponentEnabled });
    const activeComponent = () => components.find((component) => component.id === activeId);
    const snapshot = () => ({ components, fixedEntries, fixedEntriesComponentEnabled });
    const cloneSnapshot = (state) => this.cloneHomeState(state);
    const hasComponentChanges = () => JSON.stringify(snapshot()) !== JSON.stringify(componentSavedState);
    const hasPageChanges = () => JSON.stringify(snapshot()) !== JSON.stringify(pageSavedState);
    const guardUnsavedNavigation = async (onProceed) => {
      if (!isEditing || !hasPageChanges()) {
        onProceed();
        return;
      }
      const confirmed = await window.BackofficeLayout.confirm({
        title: '确认关闭编辑？',
        message: '当前编辑的内容未保存，是否仍然要关闭',
        confirmText: '仍然关闭',
        cancelText: '继续编辑'
      });
      if (confirmed) onProceed();
    };
    const activatePrimaryTab = (tab) => {
      document.querySelectorAll('[data-marketing-tab]').forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
    };
    const updateEditState = () => {
      const builder = document.getElementById('home-marketing-builder');
      const pageActions = document.getElementById('marketing-page-actions');
      const componentSave = document.getElementById('save-home-component');
      builder.classList.toggle('is-editing', isEditing);
      pageActions.innerHTML = `<span class="home-undo-tooltip" data-tooltip="本次的修改可以一键撤销，恢复到最近一次保存的页面配置。"><button class="button secondary" id="cancel-home-marketing" type="button"${!isEditing || !hasPageChanges() ? ' disabled' : ''}>撤销本次修改</button></span><button class="button primary${isEditing ? '' : ' is-edit-action'}" id="save-home-marketing" type="button">${isEditing ? '保存页面' : '编辑'}</button>`;
      componentSave.disabled = !isEditing || !hasComponentChanges();
      document.querySelectorAll('[data-home-add]').forEach((button) => { button.disabled = !isEditing; });
      document.querySelectorAll('#home-config-content input, #home-config-content select, #home-config-content [data-home-remove], #home-config-content [data-home-entry-delete], #home-config-content [data-home-red-packet-delete]').forEach((control) => { control.disabled = !isEditing; });
    };
    const render = () => {
      this.renderFixedEntries(fixedEntries, activeFixedEntryIndex, fixedEntriesComponentEnabled, isFixedEntriesComponentActive);
      this.renderHomePreview(components, activeId);
      this.renderComponentEditor(components, activeId, isFixedEntriesComponentActive);
      if (activeFixedEntryIndex !== null) this.renderFixedEntryConfig(fixedEntries[activeFixedEntryIndex], activeFixedEntryIndex);
      else if (isFixedEntriesComponentActive) this.renderFixedEntriesComponentConfig(fixedEntriesComponentEnabled);
      else this.renderHomeConfig(activeComponent());
      updateEditState();
    };
    document.querySelectorAll('[data-marketing-tab]').forEach((tab) => tab.addEventListener('click', () => {
      if (tab.classList.contains('is-active')) return;
      guardUnsavedNavigation(() => {
        activatePrimaryTab(tab);
        this.showPrimaryTabContext(tab.dataset.marketingTab, 'function', navigate);
      });
    }));
    document.querySelector('.marketing-home-subnav')?.addEventListener('click', (event) => {
      const subtab = event.target.closest('[data-marketing-primary-view]');
      if (!subtab) return;
      if (subtab.dataset.marketingPrimaryView === 'home-function') return;
      if (subtab.dataset.marketingPrimaryView === 'home-feed') guardUnsavedNavigation(() => navigate?.('feed-management'));
      const activePrimaryTab = document.querySelector('[data-marketing-tab].is-active');
      if (!activePrimaryTab || activePrimaryTab.dataset.marketingTab === 'home') return;
      const views = {
        'youzi-street-flash-sale': 'flash-sale',
        'benefits-check-in': 'check-in',
        'benefits-check-in-success': 'check-in-success'
      };
      const view = views[subtab.dataset.marketingPrimaryView] || 'feed';
      if (subtab.classList.contains('is-active')) return;
      guardUnsavedNavigation(() => this.showPrimaryTabContext(activePrimaryTab.dataset.marketingTab, view, navigate));
    });
    document.querySelectorAll('[data-home-add]').forEach((button) => button.addEventListener('click', () => { if (!isEditing) return; const component = this.createHomeComponent(button.dataset.homeAdd); components.push(component); activeId = component.id; activeFixedEntryIndex = null; isFixedEntriesComponentActive = false; render(); }));
    document.getElementById('home-fixed-entries').addEventListener('click', (event) => {
      const entry = event.target.closest('[data-home-fixed-entry]');
      activeFixedEntryIndex = entry ? Number(entry.dataset.homeFixedEntry) : null;
      isFixedEntriesComponentActive = !entry;
      activeId = null;
      render();
    });
    document.getElementById('home-component-editor').addEventListener('click', (event) => {
      const fixedEntriesButton = event.target.closest('[data-home-editor-fixed]');
      const componentButton = event.target.closest('[data-home-editor-component]');
      if (!fixedEntriesButton && !componentButton) return;
      activeFixedEntryIndex = null;
      isFixedEntriesComponentActive = Boolean(fixedEntriesButton);
      activeId = componentButton?.dataset.homeEditorComponent || null;
      render();
    });
    document.querySelector('.home-phone-frame').addEventListener('click', (event) => { const component = event.target.closest('[data-home-component-id]'); if (!component) return; activeId = component.dataset.homeComponentId; activeFixedEntryIndex = null; isFixedEntriesComponentActive = false; render(); });
    let draggedComponentId = null;
    let draggedToolType = null;
    const phonePreview = document.querySelector('.home-phone-frame');
    const isSamePreviewZone = (firstId, secondId) => {
      const first = components.find((component) => component.id === firstId);
      const second = components.find((component) => component.id === secondId);
      return Boolean(first && second) && this.isFunctionZoneComponent(first) === this.isFunctionZoneComponent(second);
    };
    document.querySelectorAll('[data-home-add]').forEach((button) => button.addEventListener('dragstart', (event) => {
      if (!isEditing) { event.preventDefault(); return; }
      draggedToolType = button.dataset.homeAdd;
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('text/plain', draggedToolType);
      button.classList.add('is-dragging');
    }));
    document.querySelectorAll('[data-home-add]').forEach((button) => button.addEventListener('dragend', () => {
      draggedToolType = null;
      button.classList.remove('is-dragging');
      phonePreview.querySelectorAll('.is-dragover').forEach((element) => element.classList.remove('is-dragover'));
    }));
    phonePreview.addEventListener('dragstart', (event) => {
      if (!isEditing) return;
      const component = event.target.closest('.home-preview-component-sortable');
      if (!component) return;
      draggedComponentId = component.dataset.homeComponentId;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', draggedComponentId);
      component.classList.add('is-dragging');
    });
    phonePreview.addEventListener('dragover', (event) => {
      if (!isEditing) return;
      const zone = event.target.closest('[data-home-drop-zone]');
      if (draggedToolType && zone) {
        const isFunctionComponent = this.isFunctionZoneComponent({ type: draggedToolType });
        if ((zone.dataset.homeDropZone === 'function') !== isFunctionComponent) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        zone.classList.add('is-dragover');
        return;
      }
      if (!draggedComponentId) return;
      const target = event.target.closest('.home-preview-component-sortable');
      if (target && target.dataset.homeComponentId !== draggedComponentId && isSamePreviewZone(draggedComponentId, target.dataset.homeComponentId)) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        target.classList.add('is-dragover');
        return;
      }
      if (zone) {
        const source = components.find((component) => component.id === draggedComponentId);
        const isCompatibleZone = source && ((this.isFunctionZoneComponent(source) && zone.dataset.homeDropZone === 'function') || (!this.isFunctionZoneComponent(source) && zone.dataset.homeDropZone === 'feed'));
        if (!isCompatibleZone) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        zone.classList.add('is-dragover');
        return;
      }
    });
    phonePreview.addEventListener('dragleave', (event) => {
      const highlighted = event.target.closest('.home-preview-component-sortable, [data-home-drop-zone]');
      if (!highlighted || highlighted.contains(event.relatedTarget)) return;
      highlighted.classList.remove('is-dragover');
    });
    phonePreview.addEventListener('drop', (event) => {
      if (!isEditing) return;
      const zone = event.target.closest('[data-home-drop-zone]');
      if (draggedToolType && zone) {
        const isFunctionComponent = this.isFunctionZoneComponent({ type: draggedToolType });
        if ((zone.dataset.homeDropZone === 'function') !== isFunctionComponent) return;
        event.preventDefault();
        const component = this.createHomeComponent(draggedToolType);
        if (isFunctionComponent) component.functionSlot = zone.dataset.homeFunctionSlot || 'after-notification';
        components.push(component);
        activeId = component.id;
        activeFixedEntryIndex = null;
        isFixedEntriesComponentActive = false;
        draggedToolType = null;
        render();
        return;
      }
      if (!draggedComponentId) return;
      const target = event.target.closest('.home-preview-component-sortable');
      if (target && target.dataset.homeComponentId !== draggedComponentId && isSamePreviewZone(draggedComponentId, target.dataset.homeComponentId)) {
        event.preventDefault();
        const sourceIndex = components.findIndex((component) => component.id === draggedComponentId);
        const targetIndex = components.findIndex((component) => component.id === target.dataset.homeComponentId);
        if (sourceIndex < 0 || targetIndex < 0) return;
        const targetComponent = components[targetIndex];
        const [component] = components.splice(sourceIndex, 1);
        if (this.isFunctionZoneComponent(component)) component.functionSlot = targetComponent.functionSlot || component.functionSlot;
        components.splice(sourceIndex < targetIndex ? targetIndex - 1 : targetIndex, 0, component);
        activeId = component.id;
        activeFixedEntryIndex = null;
        isFixedEntriesComponentActive = false;
        draggedComponentId = null;
        render();
        return;
      }
      if (!target) {
        const source = components.find((component) => component.id === draggedComponentId);
        if (!zone || !source || ((this.isFunctionZoneComponent(source) && zone.dataset.homeDropZone !== 'function') || (!this.isFunctionZoneComponent(source) && zone.dataset.homeDropZone !== 'feed'))) return;
        event.preventDefault();
        if (this.isFunctionZoneComponent(source)) source.functionSlot = zone.dataset.homeFunctionSlot || source.functionSlot;
        activeId = source.id;
        activeFixedEntryIndex = null;
        isFixedEntriesComponentActive = false;
        draggedComponentId = null;
        render();
        return;
      }
    });
    phonePreview.addEventListener('dragend', () => {
      draggedComponentId = null;
      draggedToolType = null;
      phonePreview.querySelectorAll('.is-dragging, .is-dragover').forEach((element) => element.classList.remove('is-dragging', 'is-dragover'));
    });
    document.getElementById('home-config-content').addEventListener('input', (event) => {
      if (!isEditing) return;
      if (activeFixedEntryIndex !== null) {
        const entry = fixedEntries[activeFixedEntryIndex];
        if (event.target.id === 'home-fixed-entry-title') {
          entry.title = event.target.value.slice(0, 5);
          if (event.target.value !== entry.title) event.target.value = entry.title;
        }
        if (event.target.id === 'home-fixed-entry-jump-target') entry[entry.jumpType === 'link' ? 'linkTarget' : 'pageTarget'] = event.target.value;
        if (event.target.id === 'home-fixed-entry-jump-description') entry.jumpDescription = event.target.value;
        if (event.target.id === 'home-fixed-entry-target-group') entry.targeting.targetGroup = event.target.value;
        if (event.target.id === 'home-fixed-entry-exclude-group') entry.targeting.excludeGroup = event.target.value;
        if (event.target.id === 'home-fixed-entry-test-uids') entry.testPlan.uids = event.target.value;
        if (event.target.id === 'home-fixed-entry-test-start') entry.testPlan.start = event.target.value;
        if (event.target.id === 'home-fixed-entry-test-end') entry.testPlan.end = event.target.value;
        this.renderFixedEntries(fixedEntries, activeFixedEntryIndex);
        updateEditState();
        return;
      }
      const component = activeComponent();
      if (!component) return;
      if (component.type === 'search' && event.target.dataset.homeShowcaseBase) {
        component.showcase[event.target.dataset.homeShowcaseBase] = event.target.value;
        updateEditState();
        return;
      }
      if (component.type === 'search' && event.target.dataset.homeShowcaseField) {
        const config = component.showcase[component.showcase.windowType];
        config[event.target.dataset.homeShowcaseField] = event.target.value;
        updateEditState();
        return;
      }
      if (component.type === 'search' && event.target.dataset.homeShowcaseTest) {
        component.showcase.testPlan[event.target.dataset.homeShowcaseTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        updateEditState();
        return;
      }
      if (component.type === 'search' && event.target.dataset.homeShowcaseTargetingField) {
        component.showcase.targeting[event.target.dataset.homeShowcaseTargetingField] = event.target.value;
        updateEditState();
        return;
      }
      if (component.type === 'shortcut' && event.target.dataset.homeRedPacketField) {
        component.redPacket[event.target.dataset.homeRedPacketField] = event.target.value;
        updateEditState();
        return;
      }
      if (component.type === 'shortcut' && event.target.dataset.homeRedPacketTest) {
        component.redPacket.testPlan[event.target.dataset.homeRedPacketTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        updateEditState();
        return;
      }
      if (component.type === 'shortcut' && event.target.dataset.homeRedPacketTargetingField) {
        component.redPacket.targeting[event.target.dataset.homeRedPacketTargetingField] = event.target.value;
        updateEditState();
        return;
      }
      if (event.target.id === 'home-component-label') {
        if (component.type === 'search') component.placeholder = event.target.value;
        else component.label = event.target.value;
      }
      if (event.target.id === 'home-component-subtitle') component.subtitle = event.target.value;
      this.renderHomePreview(components, activeId);
      updateEditState();
    });
    document.getElementById('home-config-content').addEventListener('change', async (event) => {
      const component = activeComponent();
      if (!isEditing) return;
      if (component?.type === 'search') {
        const showcase = component.showcase;
        const config = showcase[showcase.windowType];
        if (event.target.matches('[data-home-showcase-image]')) {
          const file = event.target.files?.[0];
          if (!file) return;
          const field = event.target.dataset.homeShowcaseImage;
          this.clearObjectUrl(config[field]);
          config[field] = await this.readImageFile(file);
        }
        if (event.target.matches('[data-home-showcase-window-type]')) showcase.windowType = event.target.value;
        if (event.target.matches('[data-home-showcase-field]')) config[event.target.dataset.homeShowcaseField] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        if (event.target.matches('[data-home-showcase-identity]')) showcase.targeting.identities = [...document.querySelectorAll('[data-home-showcase-identity]:checked')].map((input) => input.value);
        if (event.target.matches('[data-home-showcase-audience]')) showcase.targeting.audiences = [...document.querySelectorAll('[data-home-showcase-audience]:checked')].map((input) => input.value);
        if (event.target.name === 'home-showcase-audience-inversion') showcase.targeting.audienceInversion = event.target.value;
        if (event.target.name === 'home-showcase-status') showcase.targeting.status = event.target.value;
        if (event.target.matches('[data-home-showcase-platform]')) showcase.targeting.platformVersions[event.target.dataset.homeShowcasePlatform].enabled = event.target.checked;
        if (event.target.matches('[data-home-showcase-version]')) { const [platform, edge] = event.target.dataset.homeShowcaseVersion.split(':'); showcase.targeting.platformVersions[platform][edge] = event.target.value; }
        if (event.target.matches('[data-home-showcase-test]')) showcase.testPlan[event.target.dataset.homeShowcaseTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        if (event.target.dataset.homeShowcaseTargetingField) showcase.targeting[event.target.dataset.homeShowcaseTargetingField] = event.target.value;
        render();
        return;
      }
      if (component?.type === 'shortcut') {
        const redPacket = component.redPacket;
        if (event.target.matches('[data-home-red-packet-image]')) {
          const file = event.target.files?.[0];
          if (!file) return;
          const field = event.target.dataset.homeRedPacketImage;
          this.clearObjectUrl(redPacket[field]);
          redPacket[field] = await this.readImageFile(file);
        }
        if (event.target.name === 'home-red-packet-delivery') redPacket.deliveryType = event.target.value;
        if (event.target.name === 'home-red-packet-template') redPacket.template = event.target.value;
        if (event.target.matches('[data-home-red-packet-title-area]')) redPacket.titleArea = event.target.checked;
        if (event.target.matches('[data-home-red-packet-identity]')) redPacket.targeting.identities = [...document.querySelectorAll('[data-home-red-packet-identity]:checked')].map((input) => input.value);
        if (event.target.matches('[data-home-red-packet-audience]')) redPacket.targeting.audiences = [...document.querySelectorAll('[data-home-red-packet-audience]:checked')].map((input) => input.value);
        if (event.target.name === 'home-red-packet-audience-inversion') redPacket.targeting.audienceInversion = event.target.value;
        if (event.target.name === 'home-red-packet-status') redPacket.targeting.status = event.target.value;
        if (event.target.matches('[data-home-red-packet-platform]')) redPacket.targeting.platformVersions[event.target.dataset.homeRedPacketPlatform].enabled = event.target.checked;
        if (event.target.matches('[data-home-red-packet-version]')) { const [platform, edge] = event.target.dataset.homeRedPacketVersion.split(':'); redPacket.targeting.platformVersions[platform][edge] = event.target.value; }
        if (event.target.matches('[data-home-red-packet-test]')) redPacket.testPlan[event.target.dataset.homeRedPacketTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        if (event.target.dataset.homeRedPacketTargetingField) redPacket.targeting[event.target.dataset.homeRedPacketTargetingField] = event.target.value;
        render();
        return;
      }
      if (event.target.id === 'home-fixed-entry-jump-type' && activeFixedEntryIndex !== null) {
        fixedEntries[activeFixedEntryIndex].jumpType = event.target.value;
        render();
        return;
      }
      if (event.target.name === 'home-fixed-entries-enabled' && isFixedEntriesComponentActive) {
        fixedEntriesComponentEnabled = event.target.value === 'enabled';
        render();
        return;
      }
      if (event.target.name === 'home-fixed-entry-enabled' && activeFixedEntryIndex !== null) {
        fixedEntries[activeFixedEntryIndex].enabled = event.target.value === 'enabled';
        render();
        return;
      }
      if (event.target.matches('[data-home-fixed-entry-identity]') && activeFixedEntryIndex !== null) {
        const entry = fixedEntries[activeFixedEntryIndex];
        entry.targeting.identities = [...document.querySelectorAll('[data-home-fixed-entry-identity]:checked')].map((input) => input.value);
        updateEditState();
        return;
      }
      if (event.target.id === 'home-fixed-entry-test-enabled' && activeFixedEntryIndex !== null) {
        fixedEntries[activeFixedEntryIndex].testPlan.enabled = event.target.checked;
        render();
        return;
      }
      if (activeFixedEntryIndex === null || !['home-fixed-entry-image', 'home-fixed-entry-dark-image'].includes(event.target.id)) return;
      const file = event.target.files?.[0];
      if (!file) return;
      const entry = fixedEntries[activeFixedEntryIndex];
      const field = event.target.id === 'home-fixed-entry-image' ? 'image' : 'darkImage';
      this.clearObjectUrl(entry[field]);
      entry[field] = await this.readImageFile(file);
      render();
    });
    document.getElementById('home-config-content').addEventListener('click', (event) => {
      if (!isEditing) return;
      const component = activeComponent();
      const deleteShowcaseImage = event.target.closest('[data-home-showcase-delete]');
      if (deleteShowcaseImage && component?.type === 'search') {
        const config = component.showcase[component.showcase.windowType];
        const field = deleteShowcaseImage.dataset.homeShowcaseDelete;
        this.clearObjectUrl(config[field]);
        config[field] = '';
        render();
        return;
      }
      const deleteRedPacketImage = event.target.closest('[data-home-red-packet-delete]');
      if (deleteRedPacketImage && component?.type === 'shortcut') {
        const field = deleteRedPacketImage.dataset.homeRedPacketDelete;
        this.clearObjectUrl(component.redPacket[field]);
        component.redPacket[field] = '';
        render();
        return;
      }
      const deleteAsset = event.target.closest('[data-home-entry-delete]');
      if (deleteAsset && activeFixedEntryIndex !== null) {
        const entry = fixedEntries[activeFixedEntryIndex];
        const field = deleteAsset.dataset.homeEntryDelete === 'home-fixed-entry-image' ? 'image' : 'darkImage';
        this.clearObjectUrl(entry[field]);
        entry[field] = '';
        render();
        return;
      }
      const remove = event.target.closest('[data-home-remove]'); if (!remove) return; const index = components.findIndex((component) => component.id === remove.dataset.homeRemove); if (index < 0) return; components.splice(index, 1); activeId = components[index]?.id || components[index - 1]?.id || null; render();
    });
    document.getElementById('save-home-component').addEventListener('click', () => {
      if (!isEditing || !hasComponentChanges()) return;
      if (fixedEntries.some((entry) => !entry.image || !entry.title.trim() || !entry.jumpType || !(entry.jumpType === 'link' ? entry.linkTarget : entry.pageTarget)?.trim() || (entry.jumpType === 'link' && !entry.jumpDescription?.trim()))) {
        window.BackofficeLayout.showToast('请完善必填项', '请为每个固定入口补充素材、标题和跳转信息');
        return;
      }
      const invalidRedPacket = components.find((component) => {
        if (component.type !== 'shortcut') return false;
        const redPacket = component.redPacket || {};
        const platforms = Object.values(redPacket.targeting?.platformVersions || {});
        const hasPlatformVersion = platforms.some((platform) => platform.enabled && platform.start?.trim());
        return !redPacket.name?.trim() || !redPacket.sort?.trim() || !redPacket.deliveryType || !hasPlatformVersion || !redPacket.targeting?.onlineStart || !redPacket.targeting?.onlineEnd || (redPacket.deliveryType === 'package' && (!redPacket.unclaimedImage || !redPacket.template));
      });
      if (invalidRedPacket) {
        window.BackofficeLayout.showToast('请完善必填项', '请补充红包发放功能的记录名称、排序、发放类型、平台版本与上线时间；券包发放还需上传未领取图片素材并选择红包模板');
        return;
      }
      const invalidShowcase = components.find((component) => {
        if (component.type !== 'search') return false;
        const showcase = component.showcase || {};
        const platforms = Object.values(showcase.targeting?.platformVersions || {});
        const hasPlatformVersion = platforms.some((platform) => platform.enabled && platform.start?.trim());
        return !showcase.name?.trim() || !showcase.sort?.trim() || !showcase.windowType || !hasPlatformVersion || !showcase.targeting?.onlineStart || !showcase.targeting?.onlineEnd;
      });
      if (invalidShowcase) {
        window.BackofficeLayout.showToast('请完善必填项', '请补充橱窗功能的名称、排序、橱窗类型、平台版本与上线时间');
        return;
      }
      componentSavedState = cloneSnapshot(snapshot());
      updateEditState();
      window.BackofficeLayout.showToast('组件已保存', '请点击页面保存，提交整页营销配置');
    });
    document.getElementById('marketing-page-actions').addEventListener('click', (event) => {
      const action = event.target.closest('button');
      if (!action) return;
      if (action.id === 'save-home-marketing') {
        if (!isEditing) { isEditing = true; updateEditState(); return; }
        if (hasComponentChanges()) {
          window.BackofficeLayout.showToast('请先保存组件', '右侧组件配置存在未保存的修改');
          return;
        }
        const nextPageSavedState = cloneSnapshot(snapshot());
        try {
          this.saveHomeState(nextPageSavedState);
        } catch (error) {
          window.BackofficeLayout.showToast('页面保存失败', '本地演示数据无法保存，请减少图片素材后重试');
          return;
        }
        pageSavedState = nextPageSavedState;
        isEditing = false;
        render();
        window.BackofficeLayout.showToast('页面保存成功', '首页功能区营销已更新');
        return;
      }
      if (action.id !== 'cancel-home-marketing' || !isEditing || !hasPageChanges()) return;
      const saved = cloneSnapshot(pageSavedState);
      components.splice(0, components.length, ...saved.components);
      fixedEntries.splice(0, fixedEntries.length, ...saved.fixedEntries);
      fixedEntriesComponentEnabled = saved.fixedEntriesComponentEnabled;
      componentSavedState = cloneSnapshot(pageSavedState);
      activeId = null;
      activeFixedEntryIndex = null;
      isFixedEntriesComponentActive = false;
      isEditing = false;
      render();
      window.BackofficeLayout.showToast('已撤销修改', '已恢复到最近一次保存的页面配置');
    });
    render();
  },
  bind({ navigate, homeView = 'function' } = {}) {
    if (homeView === 'feed') {
      document.querySelectorAll('[data-marketing-tab]').forEach((tab) => tab.addEventListener('click', () => {
        document.querySelectorAll('[data-marketing-tab]').forEach((item) => {
          const active = item === tab;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-selected', String(active));
        });
        this.showPrimaryTabContext(tab.dataset.marketingTab, 'feed', navigate);
      }));
      document.querySelector('.marketing-home-subnav')?.addEventListener('click', (event) => {
        const subtab = event.target.closest('[data-marketing-primary-view]');
        if (!subtab) return;
        if (subtab.dataset.marketingPrimaryView === 'home-function') navigate?.('marketing-config');
        if (subtab.dataset.marketingPrimaryView === 'home-feed') navigate?.('feed-management');
        const activePrimaryTab = document.querySelector('[data-marketing-tab].is-active');
        if (!activePrimaryTab || activePrimaryTab.dataset.marketingTab === 'home' || subtab.classList.contains('is-active')) return;
        const views = {
          'youzi-street-flash-sale': 'flash-sale',
          'benefits-check-in': 'check-in',
          'benefits-check-in-success': 'check-in-success'
        };
        const view = views[subtab.dataset.marketingPrimaryView] || 'feed';
        this.showPrimaryTabContext(activePrimaryTab.dataset.marketingTab, view, navigate);
      });
      window.FeedManagementPage.bindEmbedded();
      return;
    }
    this.bindHomeBuilder(navigate);
  }
};
