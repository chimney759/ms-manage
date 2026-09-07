window.SelfBuiltPageManagementPage = {
  storageKey: 'meiyou-cashback-self-built-pages',
  pageSize: 20,
  contentComponentTools: [
    { type: 'mosaic', icon: '◫', label: '信息流-拼图', description: '活动素材组合展示' },
    { type: 'red-packet-delivery', icon: '￥', label: '信息流-红包发放功能', description: '红包权益发放展示' }
  ],
  seedRows: [
    { id: '21', title: '抽签活动规则', marker: '规则页', url: 'https://h5.fanhuan.com/home/activity_template?position=fx_marketing_h5_page&page_id=21&relevance_type=29', description: '2026年母节抽签活动', onlineAt: '2026-02-02T00:00', offlineAt: '2027-02-25T23:59', status: '已下线', creator: '郑敏妃', editor: '刘燕燕', updatedAt: '2026-08-05 15:46:32', resources: [{ id: 'hero', name: '活动主资源位', type: '图片', description: '规则页顶部主视觉' }] },
    { id: '38', title: '红包秘籍', marker: '活动页', url: 'https://h5.fanhuan.com/home/activity_template?position=fx_marketing_h5_page&page_id=38&relevance_type=29', description: '不含返现红包版本', onlineAt: '2026-06-22T00:00', offlineAt: '2027-06-30T23:59', status: '已下线', creator: '耿微佳', editor: '刘燕燕', updatedAt: '2026-08-05 15:33:36', resources: [{ id: 'banner', name: '红包主图', type: '图片', description: '活动页横幅' }] },
    { id: '44', title: '外卖福利中心', marker: '活动页', url: 'https://h5.fanhuan.com/home/activity_template?position=fx_marketing_h5_page&page_id=44&relevance_type=29', description: '外卖福利中心（广告导流承接页）', onlineAt: '2026-08-04T00:00', offlineAt: '2027-08-31T23:59', status: '上线中', creator: '罗至玲', editor: '罗至玲', updatedAt: '2026-08-04 14:42:03', resources: [{ id: 'main', name: '外卖活动主图', type: '图片', description: '首屏展示素材' }, { id: 'coupon', name: '领券入口', type: '跳转', description: '跳转至券包' }] },
    { id: '45', title: '外卖福利中心', marker: '活动页', url: 'https://h5.fanhuan.com/home/activity_template?position=fx_marketing_h5_page&page_id=45&relevance_type=29', description: '外卖福利中心中新版本', onlineAt: '2026-07-10T00:00', offlineAt: '2027-08-31T23:59', status: '上线中', creator: '郑敏妃', editor: '郑敏妃', updatedAt: '2026-07-10 17:20:13', resources: [] },
    { id: '43', title: '外卖福利中心', marker: '活动页', url: 'https://h5.fanhuan.com/home/activity_template?position=fx_marketing_h5_page&page_id=43&relevance_type=29', description: '外卖福利中心旧版本', onlineAt: '2026-06-01T00:00', offlineAt: '2027-12-31T23:59', status: '上线中', creator: '耿微佳', editor: '郑敏妃', updatedAt: '2026-07-10 17:18:22', resources: [] }
  ],
  clone(value) { return JSON.parse(JSON.stringify(value)); },
  escape(value) { return String(value ?? '').replace(/[&<>'"]/g, (item) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[item]); },
  normalizeRecord(record = {}) { return { ...this.emptyRecord(), ...record, creator: record.creator || '管理员', createdAt: record.createdAt || record.updatedAt || '', editor: record.editor || record.creator || '管理员', updatedAt: record.updatedAt || record.createdAt || '' }; },
  read() { try { const rows = JSON.parse(localStorage.getItem(this.storageKey)); if (Array.isArray(rows)) return rows.map((record) => this.normalizeRecord(record)); } catch (error) { /* Restore the seed data when storage is invalid. */ } return this.clone(this.seedRows).map((record) => this.normalizeRecord(record)); },
  write(rows) { localStorage.setItem(this.storageKey, JSON.stringify(rows)); },
  formatDate(value) { return value ? `${value.replace('T', ' ')}${value.length === 16 ? ':00' : ''}` : '-'; },
  sortIcon(direction) { const path = direction === 'asc' ? 'm4.5 9.5 3.5-3.5 3.5 3.5' : direction === 'desc' ? 'm4.5 6.5 3.5 3.5 3.5-3.5' : 'm4.75 6.25 3.25-3.25 3.25 3.25M4.75 9.75 8 13l3.25-3.25'; return `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="${path}" /></svg>`; },
  emptyRecord() { return { id: '', title: '', marker: '规则页', url: '', description: '', onlineAt: '', offlineAt: '', status: '待上线', creator: '管理员', createdAt: '', editor: '管理员', updatedAt: '', resources: [] }; },
  render() { return `<section class="content self-built-page-management-page"><section class="self-built-page-workspace panel"><div id="self-built-page-body"></div></section></section>`; },
  contentStorageKey(recordId) { return `meiyou-cashback-self-built-page-content-${recordId}`; },
  ensureContentState(record) {
    const storageKey = this.contentStorageKey(record.id);
    if (window.localStorage.getItem(storageKey)) return storageKey;
    const tab = window.FeedManagementPage.createTab({
      id: `self-built-page-${record.id}`,
      tabName: '页面内容',
      recordName: record.title,
      status: '上线中',
      resourceStatus: '上线中',
      isSaved: true,
      hasBeenSaved: true
    });
    window.FeedManagementPage.saveState({ tabs: [tab], activeTabId: tab.id }, storageKey);
    return storageKey;
  },
  renderContent({ recordId }) {
    const record = this.read().find((item) => item.id === recordId);
    if (!record) return `<section class="content self-built-page-content-page"><section class="marketing-editor-workspace panel"><div class="style-config-empty">当前页面不存在或已被删除。</div></section></section>`;
    this.ensureContentState(record);
    return `<section class="content marketing-config-page self-built-page-content-page"><section class="marketing-editor-workspace panel"><div class="marketing-workspace-heading"><div><h1>页面内容管理</h1><span class="heading-note">${this.escape(record.title)}的内容编排与展示配置</span></div><div class="marketing-workspace-tools"><div class="marketing-page-actions" id="marketing-page-actions"></div><section class="marketing-recent-edits" id="marketing-recent-edits" aria-label="最近编辑"></section></div></div><div class="marketing-config-body" id="marketing-config-body">${window.FeedManagementPage.renderEmbedded({ componentToolNote: '保存页面内容后可继续添加信息流组件', componentTools: this.contentComponentTools })}</div></section></section>`;
  },
  renderDetail({ recordId = null } = {}) {
    const rows = this.read();
    const source = recordId ? rows.find((row) => row.id === recordId) : null;
    const record = source ? { ...this.emptyRecord(), ...this.clone(source) } : this.emptyRecord();
    const field = (label, control, className = '') => `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    const required = '<b class="field-required">*</b>';
    const status = record.status === '上线中' ? '上线中' : '已下线';
    return `<section class="content self-built-page-detail-page"><header class="self-built-page-detail-heading"><button class="self-built-page-back" type="button" data-self-built-detail-cancel aria-label="返回自建页列表" title="返回自建页列表"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.75 3.5 5.25 8l4.5 4.5" /></svg></button><h1>${recordId ? '编辑 H5 页面' : '新增 H5 页面'}</h1></header><section class="self-built-page-detail-workspace"><form class="self-built-page-detail-form" data-self-built-detail-form novalidate><section class="shared-config-section"><h2>基础信息</h2>${field(`${required}页面标题`, `<input class="control" name="title" value="${this.escape(record.title)}" maxlength="60" placeholder="请输入页面标题，用户端可见" />`)}${field('页面标记', `<span class="self-built-page-radio-group"><label><input type="radio" name="marker" value="活动页"${record.marker === '活动页' ? ' checked' : ''} />活动页</label><label><input type="radio" name="marker" value="规则页"${record.marker === '规则页' ? ' checked' : ''} />规则页</label><button class="help-tooltip" type="button" aria-label="页面标记说明" data-tooltip="仅用于区分是否页面为规则说明，便于管理">?</button></span>`)}${field(`${required}页面说明`, `<textarea class="control self-built-page-detail-description" name="description" maxlength="160" placeholder="请输入页面的后台说明，便于溯源查询">${this.escape(record.description)}</textarea>`)}${field(`${required}上线时间`, `<div class="self-built-page-detail-date-range"><label><span>开始</span><input class="control" type="datetime-local" name="onlineAt" value="${this.escape(record.onlineAt)}" /></label><i>-</i><label><span>结束</span><input class="control" type="datetime-local" name="offlineAt" value="${this.escape(record.offlineAt)}" /></label></div>`)}${field('状态', `<span class="self-built-page-radio-group"><label><input type="radio" name="status" value="上线中"${status === '上线中' ? ' checked' : ''} />上线</label><label><input type="radio" name="status" value="已下线"${status === '已下线' ? ' checked' : ''} />下线</label></span>`)}</section><footer class="self-built-page-detail-actions"><button class="button primary" type="submit">保存</button><button class="button secondary" type="button" data-self-built-detail-cancel>取消</button></footer></form></section></section>`;
  },
  renderList(rows, state) {
    const root = document.getElementById('self-built-page-body');
    const filtered = rows.filter((row) => (!state.title || row.title.toLowerCase().includes(state.title.trim().toLowerCase())) && (!state.marker || row.marker === state.marker) && (!state.status || row.status === state.status) && (!state.start || row.offlineAt >= state.start) && (!state.end || row.onlineAt <= state.end));
    const visible = [...filtered].sort((left, right) => state.sort.key ? String(left[state.sort.key] || '').localeCompare(String(right[state.sort.key] || '')) * state.sort.direction : 0);
    const pages = Math.max(1, Math.ceil(visible.length / this.pageSize));
    state.page = Math.min(state.page, pages);
    const pageRows = visible.slice((state.page - 1) * this.pageSize, state.page * this.pageSize);
    const sortHeader = (key, label) => `<button type="button" class="self-built-page-sort backoffice-sort" data-self-built-sort="${key}" aria-sort="${state.sort.key === key ? (state.sort.direction === 1 ? 'asc' : 'desc') : 'none'}"><span>${label}</span>${this.sortIcon(state.sort.key === key ? (state.sort.direction === 1 ? 'asc' : 'desc') : 'none')}</button>`;
    root.innerHTML = `<header class="marketing-workspace-heading self-built-page-heading"><div><h1>自建页管理</h1><span class="heading-note">自建 H5 页面的投放配置与资源位维护</span></div><button class="button primary" type="button" data-self-built-add>新增页面</button></header><div class="self-built-page-filters"><label><span>页面标题</span><input class="control" data-self-built-filter="title" value="${this.escape(state.title)}" placeholder="请输入页面标题" /></label><label><span>页面标记</span><select class="control" data-self-built-filter="marker"><option value="">请选择页面标记</option>${['活动页', '规则页'].map((item) => `<option value="${item}"${state.marker === item ? ' selected' : ''}>${item}</option>`).join('')}</select></label><label><span>状态</span><select class="control" data-self-built-filter="status"><option value="">请选择状态</option>${['待上线', '上线中', '已下线'].map((item) => `<option value="${item}"${state.status === item ? ' selected' : ''}>${item}</option>`).join('')}</select></label><label class="self-built-page-date-filter"><span>上线时间</span><div><input class="control" type="datetime-local" data-self-built-filter="start" value="${this.escape(state.start)}" /><i>-</i><input class="control" type="datetime-local" data-self-built-filter="end" value="${this.escape(state.end)}" /></div></label><div class="self-built-page-filter-actions"><button class="button secondary" type="button" data-self-built-search>搜索</button></div></div><div class="self-built-page-table-wrap"><table class="self-built-page-table"><thead><tr><th>${sortHeader('id', 'ID')}</th><th>页面标题</th><th>页面标记</th><th>页面链接</th><th>页面说明</th><th>${sortHeader('onlineAt', '上线时间')}</th><th>${sortHeader('offlineAt', '下线时间')}</th><th>状态</th><th>创建人</th><th>创建时间</th><th>最后编辑</th><th>${sortHeader('updatedAt', '更新时间')}</th><th>操作</th></tr></thead><tbody>${pageRows.length ? pageRows.map((row) => `<tr data-self-built-id="${this.escape(row.id)}"><td>${this.escape(row.id)}</td><td class="self-built-page-title">${this.escape(row.title)}</td><td>${this.escape(row.marker)}</td><td class="self-built-page-link"><a href="${this.escape(row.url)}" target="_blank" rel="noreferrer">${this.escape(row.url)}</a></td><td>${this.escape(row.description || '-')}</td><td>${this.formatDate(row.onlineAt)}</td><td>${this.formatDate(row.offlineAt)}</td><td>${window.BackofficeLayout.statusTag(row.status)}</td><td>${this.escape(row.creator)}</td><td>${this.escape(row.createdAt || '-')}</td><td>${this.escape(row.editor)}</td><td>${this.escape(row.updatedAt)}</td><td><span class="self-built-page-actions"><button class="text-button" type="button" data-self-built-edit>编辑</button><button class="text-button" type="button" data-self-built-resources>页面内容管理</button></span></td></tr>`).join('') : '<tr><td class="self-built-page-empty" colspan="13">暂无符合条件的页面</td></tr>'}</tbody></table></div><footer class="self-built-page-footer"><span>共 ${visible.length} 条</span><div class="self-built-page-pagination"><span>20条/页</span><button type="button" data-self-built-page="previous"${state.page === 1 ? ' disabled' : ''} aria-label="上一页">‹</button>${Array.from({ length: pages }, (_, index) => index + 1).slice(0, 3).map((item) => `<button type="button" data-self-built-page="${item}" class="${item === state.page ? 'is-active' : ''}">${item}</button>`).join('')}<button type="button" data-self-built-page="next"${state.page === pages ? ' disabled' : ''} aria-label="下一页">›</button><label>前往 <input class="control" type="number" min="1" max="${pages}" data-self-built-jump value="${state.page}" /> 页</label></div></footer>`;
  },
  renderResources(record) {
    const resourceRows = (record.resources || []).map((item, index) => `<tr><td><input class="control" data-resource-field="name" data-resource-index="${index}" value="${this.escape(item.name)}" placeholder="资源位名称" /></td><td><select class="control" data-resource-field="type" data-resource-index="${index}">${['图片', '跳转', '商品', '组件'].map((type) => `<option value="${type}"${item.type === type ? ' selected' : ''}>${type}</option>`).join('')}</select></td><td><input class="control" data-resource-field="description" data-resource-index="${index}" value="${this.escape(item.description)}" placeholder="资源位说明" /></td><td><button class="text-button" type="button" data-resource-remove="${index}">删除</button></td></tr>`).join('');
    return `<div class="modal self-built-page-resources" role="dialog" aria-modal="true"><section class="modal-card self-built-page-resources-card"><header class="modal-header"><div><h2>页面内容管理</h2><span>${this.escape(record.title)}</span></div><button class="icon-close" type="button" data-resource-close aria-label="关闭">×</button></header><div class="modal-body"><div class="self-built-page-resource-table-wrap"><table class="self-built-page-resource-table"><thead><tr><th>资源位名称</th><th>资源类型</th><th>说明</th><th>操作</th></tr></thead><tbody>${resourceRows || '<tr><td colspan="4" class="self-built-page-resource-empty">暂未配置资源位</td></tr>'}</tbody></table></div><button class="button secondary self-built-page-resource-add" type="button" data-resource-add>添加资源位</button></div><footer class="modal-footer"><button class="button secondary" type="button" data-resource-close>取消</button><button class="button primary" type="button" data-resource-save>保存</button></footer></section></div>`;
  },
  bind({ navigate = () => {}, recordId = null, isAdd = false, isEdit = false, isContent = false } = {}) {
    if (isContent) {
      const record = this.read().find((item) => item.id === recordId);
      if (!record) return;
      window.FeedManagementPage.bindEmbedded({
        navigate,
        storageKey: this.ensureContentState(record),
        pageName: `${record.title}页面内容`,
        componentToolNote: '保存页面内容后可继续添加信息流组件',
        onReturnToConfigurationList: () => navigate('self-built-page-management')
      });
      return;
    }
    if (isAdd || isEdit) {
      const rows = this.read();
      const source = recordId ? rows.find((row) => row.id === recordId) : null;
      const record = source ? { ...this.emptyRecord(), ...this.clone(source) } : this.emptyRecord();
      const root = document.getElementById('page-root');
      const returnToList = () => navigate('self-built-page-management');
      root.querySelectorAll('[data-self-built-detail-cancel]').forEach((button) => button.addEventListener('click', returnToList));
      root.querySelector('[data-self-built-detail-form]')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const required = ['title', 'marker', 'description', 'onlineAt', 'offlineAt'];
        const missing = required.find((key) => !String(data.get(key) || '').trim());
        if (missing) return window.BackofficeLayout.showRequiredFieldToast({ title: '页面标题', marker: '页面标记', description: '页面说明', onlineAt: '上线时间', offlineAt: '上线时间' }[missing]);
        if (new Date(data.get('onlineAt')).getTime() > new Date(data.get('offlineAt')).getTime()) return window.BackofficeLayout.showToast('上线时间有误', '结束时间不能早于开始时间');
        const id = record.id || String(Math.max(0, ...rows.map((item) => Number(item.id) || 0)) + 1);
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const next = { ...record, id, title: String(data.get('title')).trim(), marker: String(data.get('marker')), description: String(data.get('description')).trim(), onlineAt: String(data.get('onlineAt')), offlineAt: String(data.get('offlineAt')), status: String(data.get('status') || '已下线'), url: record.url || `https://h5.fanhuan.com/home/activity_template?position=fx_marketing_h5_page&page_id=${id}&relevance_type=29`, creator: record.id ? record.creator : '管理员', createdAt: record.id ? record.createdAt : now, editor: '管理员', updatedAt: now, resources: record.resources || [] };
        const index = rows.findIndex((item) => item.id === id);
        if (index >= 0) rows.splice(index, 1, next); else rows.unshift(next);
        this.write(rows);
        window.BackofficeLayout.showToast('保存成功', '页面配置已更新');
        returnToList();
      });
      root.querySelector('[name="title"]')?.focus();
      window.BackofficeLayout.bindGlobalTooltips();
      return;
    }
    const rows = this.read();
    const state = { title: '', marker: '', status: '', start: '', end: '', sort: { key: 'updatedAt', direction: -1 }, page: 1 };
    const root = document.getElementById('self-built-page-body');
    const refresh = () => {
      this.renderList(rows, state);
    };
    const closeModal = () => document.querySelector('.self-built-page-resources')?.remove();
    const openResources = (id) => {
      const record = rows.find((row) => row.id === id); if (!record) return;
      closeModal(); document.body.insertAdjacentHTML('beforeend', this.renderResources(record));
      const modal = document.querySelector('.self-built-page-resources');
      modal.querySelector('.modal-header h2').textContent = '页面内容管理';
      const rerender = () => { modal.remove(); document.body.insertAdjacentHTML('beforeend', this.renderResources(record)); bindModal(); };
      const bindModal = () => {
        const active = document.querySelector('.self-built-page-resources');
        active.addEventListener('click', (event) => { if (event.target === active || event.target.closest('[data-resource-close]')) closeModal(); if (event.target.closest('[data-resource-add]')) { record.resources.push({ id: `resource-${Date.now()}`, name: '', type: '图片', description: '' }); rerender(); } const remove = event.target.closest('[data-resource-remove]'); if (remove) { record.resources.splice(Number(remove.dataset.resourceRemove), 1); rerender(); } if (event.target.closest('[data-resource-save]')) { active.querySelectorAll('[data-resource-field]').forEach((input) => { record.resources[Number(input.dataset.resourceIndex)][input.dataset.resourceField] = input.value.trim(); }); record.editor = '管理员'; record.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' '); this.write(rows); closeModal(); refresh(); window.BackofficeLayout.showToast('保存成功', '资源位已更新'); } });
      };
      bindModal();
    };
    refresh();
    root.addEventListener('click', (event) => {
      const contentButton = event.target.closest('[data-self-built-resources]');
      const row = contentButton?.closest('[data-self-built-id]');
      if (!row) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      navigate(`self-built-page-content:${row.dataset.selfBuiltId}`);
    }, true);
    root.addEventListener('input', (event) => { if (event.target.matches('[data-self-built-filter]')) state[event.target.dataset.selfBuiltFilter] = event.target.value; });
    root.addEventListener('change', (event) => { if (event.target.matches('[data-self-built-filter]')) state[event.target.dataset.selfBuiltFilter] = event.target.value; });
    root.addEventListener('click', (event) => { if (event.target.closest('[data-self-built-add]')) return navigate('self-built-page-add'); if (event.target.closest('[data-self-built-search]')) { state.page = 1; return refresh(); } const sort = event.target.closest('[data-self-built-sort]'); if (sort) { const key = sort.dataset.selfBuiltSort; state.sort.direction = state.sort.key === key ? -state.sort.direction : 1; state.sort.key = key; return refresh(); } const page = event.target.closest('[data-self-built-page]'); if (page) { const requested = page.dataset.selfBuiltPage; state.page = requested === 'next' ? state.page + 1 : requested === 'previous' ? state.page - 1 : Number(requested); return refresh(); } const row = event.target.closest('[data-self-built-id]'); if (row && event.target.closest('[data-self-built-edit]')) return navigate(`self-built-page-edit:${row.dataset.selfBuiltId}`); if (row && event.target.closest('[data-self-built-resources]')) return openResources(row.dataset.selfBuiltId); });
    root.addEventListener('change', (event) => { if (event.target.matches('[data-self-built-jump]')) { state.page = Math.max(1, Number(event.target.value) || 1); refresh(); } });
  }
};
