window.HotSearchManagementPage = {
  storageKey: 'meiyou-cashback-hot-search-activities',
  records: [],
  editingId: null,
  draft: null,
  apps: ['美柚省钱App'],
  escape(value = '') { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character])); },
  clone(value) { return JSON.parse(JSON.stringify(value)); },
  createWord(value = {}) { return { name: '', sort: '', jumpType: 'search', route: '', featured: false, showFeatured: false, ...value }; },
  createDraft(value = {}) {
    const defaults = {
      app: '美柚省钱App', name: '', sort: '', startAt: '', endAt: '', enabled: true,
      words: [this.createWord()],
      targeting: { identities: [], targetGroup: '', excludeGroup: '', audiences: [], audienceInversion: '否', experimentId: '', excludeExperiment: '' },
      platforms: { IOS: { enabled: false, min: '', max: '' }, Android: { enabled: false, min: '', max: '' }, Harmony: { enabled: false, min: '', max: '' } },
      testPlan: { uids: '', start: '', end: '', enabled: false }, operator: '管理员',
    };
    const draft = { ...defaults, ...this.clone(value) };
    draft.app = '美柚省钱App';
    draft.words = (draft.words?.length ? draft.words : defaults.words).map((word) => this.createWord(word));
    draft.targeting = { ...defaults.targeting, ...(draft.targeting || {}) };
    const oldIOS = draft.platforms?.iOS || {};
    draft.platforms = {
      IOS: { ...defaults.platforms.IOS, ...oldIOS, ...(draft.platforms?.IOS || {}) },
      Android: { ...defaults.platforms.Android, ...(draft.platforms?.Android || {}) },
      Harmony: { ...defaults.platforms.Harmony, ...(draft.platforms?.Harmony || {}) }
    };
    draft.testPlan = { ...defaults.testPlan, ...(draft.testPlan || {}) };
    return draft;
  },
  createDemoRecords() {
    return [
      this.createDraft({ id: '4', name: '鸿蒙预发测试', startAt: '2025-09-04 00:00:00', endAt: '2025-09-05 23:59:59', enabled: false, sort: '101', operator: '刘燕燕', words: [this.createWord({ name: '返现好价', sort: '101' })], platforms: { IOS: { enabled: false, min: '', max: '' }, Android: { enabled: false, min: '', max: '' }, Harmony: { enabled: true, min: '8.89.3.0', max: '' } } }),
      this.createDraft({ id: '3', name: '热搜词', startAt: '2025-08-04 00:00:00', endAt: '2028-09-28 23:59:59', enabled: true, sort: '100', operator: '郑敏妃', words: [this.createWord({ name: '返现', sort: '100', featured: true })], platforms: { IOS: { enabled: true, min: '', max: '' }, Android: { enabled: true, min: '', max: '' }, Harmony: { enabled: true, min: '', max: '' } } }),
      this.createDraft({ id: '2', name: '功能_产品测试', startAt: '2025-05-28 00:00:00', endAt: '2025-06-04 23:59:59', enabled: true, sort: '1000', operator: '黄晓峰', words: [this.createWord({ name: '优惠商品', sort: '1000' })], platforms: { IOS: { enabled: true, min: '-', max: '' }, Android: { enabled: true, min: '-', max: '' }, Harmony: { enabled: false, min: '', max: '' } } }),
      this.createDraft({ id: '1', name: '活动1', startAt: '2024-09-26 00:00:00', endAt: '2024-10-01 23:59:59', enabled: true, sort: '1', operator: '周若凡', words: [this.createWord({ name: '活动福利', sort: '1' })], platforms: { IOS: { enabled: true, min: '-', max: '' }, Android: { enabled: true, min: '-', max: '' }, Harmony: { enabled: false, min: '', max: '' } } })
    ];
  },
  normalize(record) { return this.createDraft(record); },
  loadRecords() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(this.storageKey));
      this.records = Array.isArray(stored) && stored.length ? stored.map((record) => this.normalize(record)) : this.createDemoRecords();
    } catch (error) { this.records = this.createDemoRecords(); }
    this.saveRecords();
  },
  saveRecords() { window.localStorage.setItem(this.storageKey, JSON.stringify(this.records)); },
  status(record) {
    const now = Date.now();
    const start = new Date(record.startAt.replace(/-/g, '/')).getTime();
    const end = new Date(record.endAt.replace(/-/g, '/')).getTime();
    if (Number.isFinite(start) && start > now) return '待上线';
    return !Number.isFinite(end) || end >= now ? '上线中' : '已下线';
  },
  formatDateForInput(value = '') { return value ? value.replace(' ', 'T').slice(0, 16) : ''; },
  formatDateForDisplay(value = '') { return value ? `${value.replace('T', ' ')}${value.length === 16 ? ':00' : ''}` : ''; },
  platformText(platforms = {}) {
    return Object.entries(platforms).filter(([, value]) => value.enabled).map(([platform, value]) => `${platform}：${value.min || '-'}-${value.max || '-'}`).join('<br />') || '-';
  },
  render() {
    return `<section class="content hot-search-page"><div class="page-heading"><div><h1>热搜词管理</h1><span class="heading-note">配置搜索中间页的热搜词活动</span></div></div><section class="panel hot-search-panel">
      <div class="hot-search-filters"><div class="field"><label for="hot-search-app">APP：</label><input class="control hot-search-app-display" id="hot-search-app" value="美柚省钱App" readonly aria-readonly="true" /></div><div class="field"><label for="hot-search-name">活动名称：</label><input class="control" id="hot-search-name" placeholder="请输入活动名称" /></div><div class="field"><label for="hot-search-status">状态：</label><select class="control" id="hot-search-status"><option value="">全部</option><option>待上线</option><option>上线中</option><option>已下线</option></select></div><div class="field hot-search-date-field"><label for="hot-search-start">上线时间：</label><div class="hot-search-date-range"><input class="control" id="hot-search-start" type="date" aria-label="开始时间" /><span>-</span><input class="control" id="hot-search-end" type="date" aria-label="结束时间" /></div></div></div>
      <div class="actions hot-search-actions"><button class="button primary" id="hot-search-query" type="button">查询</button><button class="button primary" id="hot-search-add" type="button">添加热搜词活动</button></div>
      <div class="table-wrap"><table class="hot-search-table"><thead><tr><th>活动ID</th><th>热搜词活动名称</th><th>上线时间</th><th>状态</th><th>是否启用</th><th>平台和版本</th><th>排序</th><th>最后操作人</th><th>操作</th></tr></thead><tbody id="hot-search-table-body"></tbody></table></div><div class="empty" id="hot-search-empty" hidden><div class="empty-inner"><div class="empty-icon">▰</div><div>暂无数据</div></div></div><div class="hot-search-pagination"><span id="hot-search-count"></span><select class="control"><option>20条/页</option></select><button type="button" disabled aria-label="上一页">‹</button><button class="is-active" type="button">1</button><button type="button" disabled aria-label="下一页">›</button><label>前往 <input class="control" value="1" inputmode="numeric" aria-label="页码" /> 页</label></div>
    </section>${this.renderModal()}</section>`;
  },
  renderModal() { return `<div class="modal is-editor-fullscreen" id="hot-search-modal" hidden><form class="modal-card hot-search-modal-card" id="hot-search-form" novalidate><div class="modal-header"><h2 id="hot-search-modal-title">添加热搜词活动</h2><button class="icon-close" id="hot-search-close" type="button" aria-label="关闭">×</button></div><div class="modal-body hot-search-modal-body" id="hot-search-modal-body"></div><div class="modal-footer"><button class="button secondary" id="hot-search-cancel" type="button">取消</button><button class="button primary" type="submit">保存</button></div></form></div>`; },
  renderForm() {
    const data = this.draft;
    const appOptions = this.apps.map((app) => `<option value="${this.escape(app)}"${data.app === app ? ' selected' : ''}>${this.escape(app)}</option>`).join('');
    const wordRows = data.words.map((word, index) => `<tr data-hot-search-word="${index}"><td><input class="control" data-word-field="name" maxlength="7" value="${this.escape(word.name)}" placeholder="请输入名称" /></td><td><input class="control" data-word-field="sort" type="number" min="1" max="9999" value="${this.escape(word.sort)}" placeholder="排序" /></td><td><select class="control" data-word-field="jumpType"><option value="search"${word.jumpType === 'search' ? ' selected' : ''}>搜索结果</option><option value="protocol"${word.jumpType === 'protocol' ? ' selected' : ''}>自定义协议</option></select></td><td><input class="control" data-word-field="route" value="${this.escape(word.route)}" placeholder="${word.jumpType === 'protocol' ? '请输入路由' : '搜索结果无需填写'}"${word.jumpType === 'search' ? ' disabled' : ''} /></td><td><label class="hot-search-check"><input data-word-field="featured" type="checkbox"${word.featured ? ' checked' : ''} />是</label></td><td><label class="hot-search-check"><input data-word-field="showFeatured" type="checkbox"${word.showFeatured ? ' checked' : ''} />是</label></td><td><button class="table-action hot-search-delete-word" type="button" data-delete-word="${index}"${data.words.length === 1 ? ' disabled' : ''}>删除</button></td></tr>`).join('');
    const platformRows = Object.entries(data.platforms).map(([platform, value]) => `<div class="hot-search-version-row"><label><input type="checkbox" data-platform="${platform}"${value.enabled ? ' checked' : ''} />${platform}</label><input class="control" data-platform-version="${platform}:min" value="${this.escape(value.min)}" placeholder="请输入版本"${value.enabled ? '' : ' disabled'} /><input class="control" data-platform-version="${platform}:max" value="${this.escape(value.max)}" placeholder="请输入版本"${value.enabled ? '' : ' disabled'} /></div>`).join('');
    const targetingSection = window.ConfigurationSections.renderTargeting({ prefix: 'hot-search', value: data.targeting, includePlatform: false, includeSchedule: false });
    return `<section class="hot-search-form-section"><h3>基本信息</h3><div class="form-row" id="hot-search-form-app-row"><label class="required" for="hot-search-form-app">APP：</label><div class="form-control-area"><select class="control" id="hot-search-form-app" disabled aria-label="APP">${appOptions}</select><div class="error-message">请选择APP</div></div></div><div class="form-row" id="hot-search-form-name-row"><label class="required" for="hot-search-form-name">活动名称：</label><div class="form-control-area"><input class="control" id="hot-search-form-name" maxlength="30" value="${this.escape(data.name)}" placeholder="请输入活动名称" /><div class="error-message">请输入活动名称</div></div></div><div class="form-row" id="hot-search-form-sort-row"><label class="required" for="hot-search-form-sort">排序：</label><div class="form-control-area"><input class="control" id="hot-search-form-sort" type="number" min="1" max="9999" value="${this.escape(data.sort)}" placeholder="请输入排序" /><div class="error-message">请输入排序</div></div></div></section>
      <section class="hot-search-form-section" id="hot-search-words-section"><div class="hot-search-section-title"><h3>热搜词</h3><button class="button secondary" id="hot-search-add-word" type="button">添加热搜词</button></div><div class="hot-search-word-table-wrap"><table class="hot-search-word-table"><thead><tr><th>热搜词名称</th><th>排序</th><th>跳转类型</th><th>路由</th><th>主推</th><th>展示主推图标</th><th>操作</th></tr></thead><tbody>${wordRows}</tbody></table></div><div class="error-message" id="hot-search-words-error">请完善热搜词名称、排序及自定义协议路由</div></section>
      ${targetingSection}
      <section class="hot-search-form-section" id="hot-search-form-platform-row"><h3 class="required">平台和版本</h3><div class="hot-search-platform-list"><div class="hot-search-version-head"><span>平台</span><span>起始版本</span><span>结束版本</span></div>${platformRows}</div><p class="field-hint">美柚 App 上的业务，IOS 版本号需填写四段，例如：8.88.1.0</p><div class="error-message">请选择平台和版本</div></section>
      <section class="hot-search-form-section"><h3>上下线状态</h3><div class="form-row" id="hot-search-form-date-row"><label class="required">上下线时间：</label><div class="form-control-area"><div class="hot-search-form-date-range"><input class="control" id="hot-search-form-start" type="datetime-local" value="${this.formatDateForInput(data.startAt)}" aria-label="开始时间" /><span>-</span><input class="control" id="hot-search-form-end" type="datetime-local" value="${this.formatDateForInput(data.endAt)}" aria-label="结束时间" /></div><div class="error-message">请选择上下线时间</div></div></div><div class="form-row" id="hot-search-form-enable-row"><label class="required">是否启用：</label><div class="form-control-area"><div class="radio-group"><label class="radio-option"><input type="radio" name="hot-search-enable" value="true"${data.enabled ? ' checked' : ''} />启用</label><label class="radio-option"><input type="radio" name="hot-search-enable" value="false"${data.enabled ? '' : ' checked'} />禁用</label></div></div></div></section>
      <section class="hot-search-form-section"><h3>测试计划</h3><p class="hot-search-test-description">测试 UID 内的用户将在测试有效时间内看到此配置，到期自动终止，不影响正式配置</p><div class="form-row"><label for="hot-search-test-uids">测试UID：</label><div class="form-control-area"><input class="control" id="hot-search-test-uids" value="${this.escape(data.testPlan.uids)}" placeholder="请输入测试uid" /><p class="field-hint">支持填写多个 UID，用英文逗号隔开，只展示给对应 UID 的账号</p></div></div><div class="form-row" id="hot-search-test-date-row"><label>测试有效时间：</label><div class="form-control-area"><div class="hot-search-form-date-range"><input class="control" id="hot-search-test-start" type="datetime-local" value="${this.formatDateForInput(data.testPlan.start)}" aria-label="测试开始时间" /><span>-</span><input class="control" id="hot-search-test-end" type="datetime-local" value="${this.formatDateForInput(data.testPlan.end)}" aria-label="测试结束时间" /></div><div class="error-message">测试 UID 和测试有效时间必须同时填写</div></div></div><div class="form-row"><label>是否启用：</label><div class="form-control-area"><label class="hot-search-switch"><input id="hot-search-test-enabled" type="checkbox"${data.testPlan.enabled ? ' checked' : ''} /><span></span><b id="hot-search-test-status">${data.testPlan.enabled ? '启用' : '未启用'}</b></label></div></div></section>`;
  },
  syncDraftFromForm(form) {
    const get = (id) => form.querySelector(id)?.value.trim() || '';
    this.draft.app = get('#hot-search-form-app'); this.draft.name = get('#hot-search-form-name'); this.draft.sort = get('#hot-search-form-sort');
    this.draft.startAt = this.formatDateForDisplay(form.querySelector('#hot-search-form-start').value); this.draft.endAt = this.formatDateForDisplay(form.querySelector('#hot-search-form-end').value);
    this.draft.enabled = form.querySelector('[name="hot-search-enable"]:checked')?.value === 'true';
    this.draft.words = [...form.querySelectorAll('[data-hot-search-word]')].map((row) => this.createWord({ name: row.querySelector('[data-word-field="name"]').value.trim(), sort: row.querySelector('[data-word-field="sort"]').value.trim(), jumpType: row.querySelector('[data-word-field="jumpType"]').value, route: row.querySelector('[data-word-field="route"]').value.trim(), featured: row.querySelector('[data-word-field="featured"]').checked, showFeatured: row.querySelector('[data-word-field="showFeatured"]').checked }));
    Object.keys(this.draft.platforms).forEach((platform) => { this.draft.platforms[platform] = { enabled: Boolean(form.querySelector(`[data-platform="${platform}"]`)?.checked), min: get(`[data-platform-version="${platform}:min"]`), max: get(`[data-platform-version="${platform}:max"]`) }; });
    this.draft.targeting = {
      identities: [...form.querySelectorAll('[data-hot-search-identity]:checked')].map((item) => item.value),
      targetGroup: get('[data-hot-search-targeting-field="targetGroup"]'),
      excludeGroup: get('[data-hot-search-targeting-field="excludeGroup"]'),
      audiences: [...form.querySelectorAll('[data-hot-search-audience]:checked')].map((item) => item.value),
      audienceInversion: form.querySelector('[name="hot-search-audience-inversion"]:checked')?.value || '否',
      experimentId: get('[data-hot-search-targeting-field="experimentId"]'),
      excludeExperiment: get('[data-hot-search-targeting-field="excludeExperiment"]')
    };
    this.draft.testPlan = { uids: get('#hot-search-test-uids'), start: this.formatDateForDisplay(form.querySelector('#hot-search-test-start').value), end: this.formatDateForDisplay(form.querySelector('#hot-search-test-end').value), enabled: form.querySelector('#hot-search-test-enabled').checked };
  },
  bind() {
    this.loadRecords();
    const page = this; const modal = document.getElementById('hot-search-modal'); const form = document.getElementById('hot-search-form'); const body = document.getElementById('hot-search-modal-body');
    const getFilters = () => ({ app: page.apps[0], name: document.getElementById('hot-search-name').value, status: document.getElementById('hot-search-status').value, start: document.getElementById('hot-search-start').value, end: document.getElementById('hot-search-end').value });
    const renderTable = () => page.renderTable(getFilters());
    const redraw = () => { body.innerHTML = page.renderForm(); };
    const close = () => { modal.hidden = true; page.editingId = null; page.draft = null; };
    const askClose = async () => { if (modal.hidden) return; const confirmed = await window.BackofficeLayout.confirm({ title: '取消编辑', message: '当前页面信息未保存，是否取消', confirmText: '确定', cancelText: '取消' }); if (confirmed) close(); };
    const open = (record = null) => { page.editingId = record?.id || null; page.draft = page.createDraft(record || {}); document.getElementById('hot-search-modal-title').textContent = record ? '编辑热搜词活动' : '添加热搜词活动'; redraw(); modal.hidden = false; body.querySelector('#hot-search-form-app').focus(); };
    document.getElementById('hot-search-query').addEventListener('click', renderTable);
    document.getElementById('hot-search-name').addEventListener('keydown', (event) => { if (event.key === 'Enter') renderTable(); }); document.getElementById('hot-search-add').addEventListener('click', () => open());
    document.getElementById('hot-search-close').addEventListener('click', askClose); document.getElementById('hot-search-cancel').addEventListener('click', askClose); modal.addEventListener('click', (event) => { if (event.target === modal) askClose(); });
    document.getElementById('hot-search-table-body').addEventListener('click', (event) => { const edit = event.target.closest('[data-hot-search-edit]'); if (edit) open(page.records.find((record) => record.id === edit.dataset.hotSearchEdit)); });
    body.addEventListener('change', (event) => {
      if (event.target.matches('#hot-search-test-enabled')) {
        page.syncDraftFromForm(form);
        body.querySelector('#hot-search-test-status').textContent = event.target.checked ? '启用' : '未启用';
        return;
      }
      if (event.target.matches('[data-word-field="jumpType"], [data-platform]')) { page.syncDraftFromForm(form); redraw(); }
    });
    body.addEventListener('click', (event) => { const add = event.target.closest('#hot-search-add-word'); const remove = event.target.closest('[data-delete-word]'); if (add || remove) { page.syncDraftFromForm(form); if (add) page.draft.words.push(page.createWord()); else page.draft.words.splice(Number(remove.dataset.deleteWord), 1); redraw(); } });
    form.addEventListener('submit', (event) => {
      event.preventDefault(); page.syncDraftFromForm(form);
      const hasPlatforms = Object.values(page.draft.platforms).some((item) => item.enabled);
      const validWords = page.draft.words.length && page.draft.words.every((word) => word.name && /^\d+$/.test(word.sort) && Number(word.sort) >= 1 && Number(word.sort) <= 9999 && (word.jumpType !== 'protocol' || word.route));
      const testPlanError = window.ConfigurationSections.validateTestPlan(page.draft.testPlan);
      const validations = [[page.draft.app, 'hot-search-form-app-row', 'APP'], [page.draft.name, 'hot-search-form-name-row', '活动名称'], [/^\d+$/.test(page.draft.sort) && Number(page.draft.sort) >= 1 && Number(page.draft.sort) <= 9999, 'hot-search-form-sort-row', '排序'], [validWords, 'hot-search-words-section', '热搜词'], [hasPlatforms, 'hot-search-form-platform-row', '平台和版本'], [page.draft.startAt && page.draft.endAt, 'hot-search-form-date-row', '上下线时间'], [!testPlanError, 'hot-search-test-date-row', testPlanError || '测试计划']];
      validations.forEach(([valid, id]) => document.getElementById(id)?.classList.toggle('is-invalid', !valid)); const invalid = validations.find(([valid]) => !valid); if (invalid) { window.BackofficeLayout.showRequiredFieldToast(invalid[2]); return; }
      if (new Date(page.draft.startAt.replace(/-/g, '/')) > new Date(page.draft.endAt.replace(/-/g, '/'))) { window.BackofficeLayout.showToast('上下线时间有误', '结束时间不能早于开始时间'); return; }
      const existing = page.records.find((record) => record.id === page.editingId); const record = { ...page.draft, id: page.editingId || String(Math.max(0, ...page.records.map((item) => Number(item.id) || 0)) + 1), operator: existing?.operator || '管理员' };
      if (existing) Object.assign(existing, record); else page.records.unshift(record); page.saveRecords(); close(); renderTable(); window.BackofficeLayout.showToast(existing ? '热搜词活动修改成功' : '热搜词活动添加成功');
    });
    renderTable();
  },
  renderTable(filters = {}) {
    const name = (filters.name || '').trim().toLowerCase(); const visible = this.records.filter((record) => { const status = this.status(record); const dateStart = record.startAt.slice(0, 10); const dateEnd = record.endAt.slice(0, 10); return (!filters.app || record.app === filters.app) && (!name || record.name.toLowerCase().includes(name)) && (!filters.status || status === filters.status) && (!filters.start || dateEnd >= filters.start) && (!filters.end || dateStart <= filters.end); }).sort((left, right) => Number(right.sort) - Number(left.sort));
    document.getElementById('hot-search-table-body').innerHTML = visible.map((record) => `<tr><td>${this.escape(record.id)}</td><td>${this.escape(record.name)}</td><td>${this.escape(record.startAt)}<br />- ${this.escape(record.endAt)}</td><td>${window.BackofficeLayout.statusTag(this.status(record))}</td><td>${window.BackofficeLayout.statusTag(record.enabled ? '启用' : '禁用')}</td><td class="hot-search-platform-cell">${this.platformText(record.platforms)}</td><td>${this.escape(record.sort)}</td><td>${this.escape(record.operator)}</td><td><button class="table-action" type="button" data-hot-search-edit="${this.escape(record.id)}">编辑</button></td></tr>`).join('');
    document.getElementById('hot-search-empty').hidden = visible.length > 0; document.getElementById('hot-search-count').textContent = `共 ${visible.length} 条`;
  }
};
