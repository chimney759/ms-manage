window.EdgeManagementPage = {
  storageKey: 'meiyou-cashback-edge-management',
  tabs: [
    { id: 'home', label: '首页', sublabel: 'Home' },
    { id: 'benefits', label: '福利页', sublabel: '第2Tab' },
    { id: 'youzi-street', label: '柚子街', sublabel: '第3Tab' },
    { id: 'mine', label: '我', sublabel: 'Mine' }
  ],
  seedRowsByTab: {
    home: [
      { id: '39', name: '618抽奖集柚活动_第三轮', sortValue: 100, image: 'https://image.fanhuan.com/cp/img/e526df1cf0ea07b2e0a9c9f2cf4bd04b_270_270.gif', onlineAt: '2026-06-12T00:00', offlineAt: '2026-06-21T23:59', status: '已下线', creator: '张文贞', editor: '郑敏妃' },
      { id: '38', name: '618超级红包', sortValue: 100, image: 'https://image.fanhuan.com/cp/img/dd840f593f62c5c811684cde7dce20f6_270_270.gif', onlineAt: '2026-05-15T21:03', offlineAt: '2026-06-21T23:59', status: '已下线', creator: '张文贞', editor: '罗至玲' },
      { id: '40', name: '618抽奖集柚活动_第二轮', sortValue: 100, image: 'https://image.fanhuan.com/cp/img/2a109c6824a9995f623cf398963b5c71_270_270.gif', onlineAt: '2026-05-29T00:00', offlineAt: '2026-06-11T23:59', status: '已下线', creator: '罗至玲', editor: '罗至玲' },
      { id: '37', name: '广告618抽奖【线上测试】', sortValue: 1, image: 'https://image.fanhuan.com/cp/img/9d52c06d1d9c843ea21bb55575a0f5e3_270_270.gif', onlineAt: '2026-05-14T00:00', offlineAt: '2026-05-16T19:44', status: '已下线', creator: '郑敏妃', editor: '郑敏妃' }
    ],
    benefits: [
      { id: '51', name: '福利页新人专享贴边', sortValue: 90, image: 'https://image.fanhuan.com/cp/img/e526df1cf0ea07b2e0a9c9f2cf4bd04b_270_270.gif', onlineAt: '2026-08-01T00:00', offlineAt: '2026-08-31T23:59', status: '上线中', creator: '陈媛', editor: '陈媛' },
      { id: '50', name: '福利页周末领券贴边', sortValue: 60, image: 'https://image.fanhuan.com/cp/img/dd840f593f62c5c811684cde7dce20f6_270_270.gif', onlineAt: '2026-08-08T00:00', offlineAt: '2026-08-10T23:59', status: '已下线', creator: '林静', editor: '林静' }
    ],
    'youzi-street': [
      { id: '61', name: '柚子街限时福利贴边', sortValue: 80, image: 'https://image.fanhuan.com/cp/img/2a109c6824a9995f623cf398963b5c71_270_270.gif', onlineAt: '2026-09-01T00:00', offlineAt: '2026-09-15T23:59', status: '待上线', creator: '王敏', editor: '王敏' }
    ],
    mine: [
      { id: '71', name: '我的页面会员权益贴边', sortValue: 70, image: 'https://image.fanhuan.com/cp/img/9d52c06d1d9c843ea21bb55575a0f5e3_270_270.gif', onlineAt: '2026-08-15T00:00', offlineAt: '2026-09-15T23:59', status: '上线中', creator: '刘颖', editor: '刘颖' }
    ]
  },
  clone(value) { return JSON.parse(JSON.stringify(value)); },
  escape(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  },
  read(tabId) {
    try {
      const saved = JSON.parse(window.localStorage.getItem(`${this.storageKey}:${tabId}`));
      if (Array.isArray(saved)) return saved;
    } catch (error) { /* Fall back to the demonstrative data below. */ }
    return this.clone(this.seedRowsByTab[tabId] || []);
  },
  write(tabId, rows) { window.localStorage.setItem(`${this.storageKey}:${tabId}`, JSON.stringify(rows)); },
  formatDate(value) { return value ? value.replace('T', ' ') + (value.length === 16 ? ':00' : '') : '-'; },
  renderTabs(activeTab) {
    return `<section class="marketing-navigation panel"><nav class="marketing-tabs" aria-label="底部Tab"><strong class="marketing-tabs-title">底部Tab</strong><div class="marketing-tabs-list" role="tablist">${this.tabs.map((tab) => `<button class="marketing-tab${tab.id === activeTab ? ' is-active' : ''}" type="button" role="tab" aria-selected="${tab.id === activeTab}" data-edge-tab="${tab.id}"><span>${tab.label}</span><small>${tab.sublabel}</small></button>`).join('')}</div></nav></section>`;
  },
  render({ activeTab = 'home', mode = 'list', recordId = '', copy = false } = {}) {
    const tab = this.tabs.find((item) => item.id === activeTab) || this.tabs[0];
    const isEditor = mode === 'editor';
    const action = recordId ? (copy ? '复制' : '编辑') : '添加';
    const heading = isEditor ? `<header class="edge-editor-heading"><button class="edge-back" type="button" data-edge-back aria-label="返回贴边列表" title="返回贴边列表"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.75 3.5 5.25 8l4.5 4.5" /></svg></button><h1>${action}${tab.label}(${tab.sublabel})贴边</h1></header>` : '';
    return `<section class="content marketing-config-page edge-management-page${isEditor ? ' is-edge-editor' : ''}">${this.renderTabs(tab.id)}${heading}<section class="marketing-editor-workspace panel"><div class="edge-management-body" id="edge-management-body"></div></section></section>`;
  },
  sortIcon(direction) {
    const path = direction === 'asc' ? 'm4.5 9.5 3.5-3.5 3.5 3.5' : direction === 'desc' ? 'm4.5 6.5 3.5 3.5 3.5-3.5' : 'm4.75 6.25 3.25-3.25 3.25 3.25M4.75 9.75 8 13l3.25-3.25';
    return `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="${path}" /></svg>`;
  },
  renderList(rows, filters, sort, position) {
    const root = document.getElementById('edge-management-body');
    const active = sort.key === 'sortValue';
    const direction = active ? (sort.direction === 1 ? 'asc' : 'desc') : 'none';
    root.innerHTML = `<header class="marketing-workspace-heading edge-list-heading"><div><h1>贴边列表</h1><span class="heading-note">当前导航下已保存的贴边配置</span></div><button class="button primary" type="button" data-edge-add>添加贴边</button></header><div class="edge-list-filters"><label><span>业务</span><input class="control" value="美柚-返现" disabled /></label><label><span>位置</span><input class="control" value="${this.escape(position)}" disabled aria-label="位置：${this.escape(position)}" /></label><label><span>名称</span><input class="control" data-edge-filter="name" value="${this.escape(filters.name)}" placeholder="请输入名称进行搜索" /></label><label><span>ID</span><input class="control" data-edge-filter="id" value="${this.escape(filters.id)}" placeholder="请输入ID进行搜索" /></label><label><span>状态</span><select class="control" data-edge-filter="status"><option value="">请筛选状态</option><option value="上线中"${filters.status === '上线中' ? ' selected' : ''}>上线中</option><option value="待上线"${filters.status === '待上线' ? ' selected' : ''}>待上线</option><option value="已下线"${filters.status === '已下线' ? ' selected' : ''}>已下线</option></select></label><label><span>排序值</span><input class="control" data-edge-filter="sortValue" value="${this.escape(filters.sortValue)}" placeholder="请输入排序值" /></label><div class="edge-filter-actions"><button class="button secondary" type="button" data-edge-search>搜索</button></div></div><div class="edge-table-wrap"><table class="edge-table"><thead><tr><th>ID</th><th>名称</th><th><button class="edge-sort" type="button" data-edge-sort="sortValue" aria-sort="${direction}"><span>排序值</span>${this.sortIcon(direction)}</button></th><th>图片预览</th><th>上线时间</th><th>下线时间</th><th>状态</th><th>创建人</th><th>最后编辑</th><th>操作</th></tr></thead><tbody data-edge-table-body></tbody></table></div><footer class="edge-list-footer"><span data-edge-count></span><span>数据保存后将保留在当前浏览器中。</span></footer>`;
    const visibleRows = rows.filter((row) => (!filters.name || row.name.toLowerCase().includes(filters.name.trim().toLowerCase()))
      && (!filters.id || row.id.includes(filters.id.trim()))
      && (!filters.status || row.status === filters.status)
      && (!filters.sortValue || String(row.sortValue).includes(filters.sortValue.trim())));
    if (active) visibleRows.sort((a, b) => (Number(a.sortValue) - Number(b.sortValue)) * sort.direction);
    root.querySelector('[data-edge-table-body]').innerHTML = visibleRows.length ? visibleRows.map((row) => `<tr data-edge-id="${this.escape(row.id)}"><td>${this.escape(row.id)}</td><td class="edge-name-cell">${this.escape(row.name)}</td><td>${this.escape(row.sortValue)}</td><td>${row.image ? `<span class="edge-image-trigger" data-edge-image="${this.escape(row.image)}"><img src="${this.escape(row.image)}" alt="${this.escape(row.name)}图片预览" /></span>` : '<span class="edge-image-empty">暂无图片</span>'}</td><td>${this.formatDate(row.onlineAt)}</td><td>${this.formatDate(row.offlineAt)}</td><td><span class="edge-status edge-status-${row.status === '上线中' ? 'online' : row.status === '待上线' ? 'pending' : 'offline'}">${this.escape(row.status)}</span></td><td>${this.escape(row.creator)}</td><td>${this.escape(row.editor)}</td><td><span class="edge-actions"><button class="text-button" type="button" data-edge-edit>编辑</button><button class="text-button" type="button" data-edge-copy>复制</button></span></td></tr>`).join('') : '<tr><td class="edge-empty" colspan="10">暂无符合条件的贴边配置</td></tr>';
    root.querySelector('[data-edge-count]').textContent = `共 ${visibleRows.length} 条`;
  },
  renderEditor(record, { copy = false } = {}) {
    const root = document.getElementById('edge-management-body');
    const field = (label, control, className = '') => `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    const route = { type: 'protocol', targetPage: '', protocol: '', pid: '', selectedPid: '', skipType: '', description: '', ...(record.route || {}) };
    const routing = `<section class="shared-config-section"><h3>跳转配置</h3>${field('<b class="field-required">*</b>跳转类型', `<select class="control" name="routeType" data-edge-route-type><option value="page"${route.type === 'page' ? ' selected' : ''}>页面跳转</option><option value="protocol"${route.type === 'protocol' ? ' selected' : ''}>自定义地址/协议</option></select>`)}<div class="edge-route-config" data-edge-route-page${route.type === 'page' ? '' : ' hidden'}>${field('<b class="field-required">*</b>目标页面', `<select class="control" name="routeTargetPage"><option value="">请选择目标页面</option>${['商品收藏', '购物车返现', '领现金', '省钱秘籍'].map((item) => `<option value="${item}"${route.targetPage === item ? ' selected' : ''}>${item}</option>`).join('')}</select>`)}</div><div class="edge-route-config" data-edge-route-protocol${route.type === 'protocol' ? '' : ' hidden'}><div class="edge-route-heading"><span>跳转类型：</span><button class="edge-route-example" type="button" data-tooltip="请按路由协议规范填写跳转地址。">路由协议填写示例</button></div><input class="control" name="routeProtocol" value="${this.escape(route.protocol)}" placeholder="请输入路由协议" /><div class="edge-route-input"><input class="control" name="routePid" value="${this.escape(route.pid)}" placeholder="pid（除京东&拼多多&抖音&1688，其余商城用于埋点上报）" /><button class="help-tooltip" type="button" aria-label="PID说明" data-tooltip="用于商城埋点上报的 PID 配置。">?</button></div><div class="edge-route-input"><select class="control" name="routeSelectedPid"><option value="">请选择pid</option><option value="default"${route.selectedPid === 'default' ? ' selected' : ''}>默认pid</option><option value="custom"${route.selectedPid === 'custom' ? ' selected' : ''}>自定义pid</option></select><button class="help-tooltip" type="button" aria-label="PID选择说明" data-tooltip="京东、拼多多、抖音和1688根据填写的 pid 进行转链跟单。">?</button></div><div class="edge-route-input"><input class="control" name="routeSkipType" value="${this.escape(route.skipType)}" placeholder="skip_type（用于埋点上报）" /><button class="help-tooltip" type="button" aria-label="skip_type说明" data-tooltip="自定义地址或协议跳转时用于埋点上报。">?</button></div>${field('<b class="field-required">*</b>地址/协议说明', `<input class="control" name="routeDescription" value="${this.escape(route.description)}" maxlength="100" placeholder="请输入地址/协议说明" />`)}</div></section>`;
    const frequency = { dailyCloseLimit: '', totalCloseLimit: '', ...(record.frequency || {}) };
    const frequencySection = `<section class="shared-config-section edge-frequency-section"><h3>频次管理 <span>（说明：不填写默认为不限制推送次数/人数）</span></h3>${field('推送频次', `<div class="edge-frequency-control"><span>每人每日关闭</span><input class="control" name="dailyCloseLimit" type="number" min="1" step="1" value="${this.escape(frequency.dailyCloseLimit)}" placeholder="请输入大于0的整数" /><span>次后不展示；</span><button class="help-tooltip" type="button" aria-label="推送频次说明" data-tooltip="单次访问生命周期内，用户关闭后不再展示。">?</button></div>`)}${field('展示次数', `<div class="edge-frequency-control"><span>用户最多关闭</span><input class="control" name="totalCloseLimit" type="number" min="1" step="1" value="${this.escape(frequency.totalCloseLimit)}" placeholder="请输入大于0的整数" /><span>次后不再展示给该用户；</span><button class="help-tooltip" type="button" aria-label="展示次数说明" data-tooltip="示例：当用户 A 关闭了 X 次后，不再展示给用户 A。">?</button></div>`)}</section>`;
    const targeting = window.ConfigurationSections.normalizeTargeting(record.targeting);
    const testPlan = window.ConfigurationSections.normalizeTestPlan(record.testPlan);
    root.innerHTML = `<header class="edge-form-title"><div><h2>${copy ? '复制贴边' : record.id ? '编辑贴边' : '添加贴边'}</h2><span>完善贴边展示的基础信息、素材与投放规则</span></div></header><form class="edge-form" data-edge-form novalidate><section class="shared-config-section"><h3>基础信息</h3>${field('业务', '<input class="control" value="美柚-返现" disabled />')}${field('<b class="field-required">*</b>名称', `<input class="control" name="name" value="${this.escape(record.name)}" maxlength="40" placeholder="请输入贴边名称" required />`)}${field('<b class="field-required">*</b>排序值 <button class="help-tooltip" type="button" aria-label="排序值说明" data-tooltip="排序值越大，贴边展示越靠前。">?</button>', `<input class="control" name="sortValue" type="number" min="0" step="1" value="${this.escape(record.sortValue)}" placeholder="请输入排序值" required />`)}</section><section class="shared-config-section"><h3>素材信息</h3>${field('<b class="field-required">*</b>贴边图片', `<div class="edge-asset"><span class="edge-asset-preview">${record.image ? `<img src="${this.escape(record.image)}" alt="贴边图片" />` : '<b>图片</b>'}</span><span class="edge-asset-actions"><label class="button secondary edge-upload">上传图片<input type="file" accept="image/*" data-edge-image-input /></label><button class="edge-delete-image" type="button" data-edge-delete-image${record.image ? '' : ' disabled'}>删除图片</button></span><input type="hidden" name="image" value="${this.escape(record.image)}" /></div>`, 'edge-image-field')}</section>${routing}${frequencySection}${window.ConfigurationSections.renderTargeting({ prefix: 'edge', value: targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'edge', value: testPlan, description: '测试 UID 在有效期内可看到该贴边配置，到期自动终止，不影响正式配置。' })}<section class="shared-config-section"><h3>投放设置</h3>${field('<b class="field-required">*</b>上下线时间', `<div class="config-date-range"><label><span>开始</span><input class="control" name="onlineAt" type="datetime-local" value="${this.escape(record.onlineAt)}" required /></label><label><span>结束</span><input class="control" name="offlineAt" type="datetime-local" value="${this.escape(record.offlineAt)}" required /></label></div>`)}${field('<b class="field-required">*</b>状态', `<span class="home-entry-status-control"><label><input type="radio" name="status" value="上线中"${record.status === '上线中' ? ' checked' : ''} />上线中</label><label><input type="radio" name="status" value="待上线"${record.status === '待上线' ? ' checked' : ''} />待上线</label><label><input type="radio" name="status" value="已下线"${record.status === '已下线' ? ' checked' : ''} />已下线</label></span>`)}</section><footer class="edge-form-actions"><button class="button secondary" type="button" data-edge-cancel>取消</button><button class="button primary" type="submit">保存</button></footer></form>`;
  },
  bind({ activeTab = 'home', mode = 'list', recordId = '', copy = false } = {}) {
    const tab = this.tabs.find((item) => item.id === activeTab) || this.tabs[0];
    const rows = this.read(activeTab);
    const open = (nextMode, nextRecordId = '', nextCopy = false) => {
      document.getElementById('page-root').innerHTML = this.render({ activeTab, mode: nextMode, recordId: nextRecordId, copy: nextCopy });
      this.bind({ activeTab, mode: nextMode, recordId: nextRecordId, copy: nextCopy });
    };
    const switchTab = (tabId) => {
      document.getElementById('page-root').innerHTML = this.render({ activeTab: tabId });
      this.bind({ activeTab: tabId });
    };
    document.querySelectorAll('[data-edge-tab]').forEach((button) => button.addEventListener('click', () => {
      if (button.dataset.edgeTab !== activeTab) switchTab(button.dataset.edgeTab);
    }));
    if (mode === 'list') {
      const filters = { name: '', id: '', status: '', sortValue: '' };
      const sort = { key: '', direction: 1 };
      let imagePreview;
      const hidePreview = () => imagePreview?.remove();
      const showPreview = (trigger, event) => {
        hidePreview();
        const src = trigger.dataset.edgeImage;
        if (!src) return;
        imagePreview = document.createElement('div');
        imagePreview.className = 'edge-image-popover';
        imagePreview.innerHTML = `<img src="${this.escape(src)}" alt="贴边图片放大预览" />`;
        document.body.append(imagePreview);
        const rect = imagePreview.getBoundingClientRect();
        imagePreview.style.left = `${Math.max(12, Math.min(event.clientX + 16, window.innerWidth - rect.width - 12))}px`;
        imagePreview.style.top = `${Math.max(12, Math.min(event.clientY + 16, window.innerHeight - rect.height - 12))}px`;
      };
      const refresh = () => this.renderList(rows, filters, sort, tab.label);
      refresh();
      const root = document.getElementById('edge-management-body');
      root.addEventListener('input', (event) => { if (event.target.matches('[data-edge-filter]')) filters[event.target.dataset.edgeFilter] = event.target.value; });
      root.addEventListener('change', (event) => { if (event.target.matches('[data-edge-filter]')) filters[event.target.dataset.edgeFilter] = event.target.value; });
      root.addEventListener('pointerover', (event) => { const trigger = event.target.closest('[data-edge-image]'); if (trigger && !trigger.contains(event.relatedTarget)) showPreview(trigger, event); });
      root.addEventListener('pointermove', (event) => { const trigger = event.target.closest('[data-edge-image]'); if (trigger) showPreview(trigger, event); });
      root.addEventListener('pointerout', (event) => { const trigger = event.target.closest('[data-edge-image]'); if (trigger && !trigger.contains(event.relatedTarget)) hidePreview(); });
      root.addEventListener('click', (event) => {
        if (event.target.closest('[data-edge-add]')) return open('editor');
        if (event.target.closest('[data-edge-search]')) return refresh();
        if (event.target.closest('[data-edge-sort]')) {
          const isCurrentSort = sort.key === 'sortValue';
          sort.key = 'sortValue';
          sort.direction = isCurrentSort ? -sort.direction : 1;
          return refresh();
        }
        const row = event.target.closest('[data-edge-id]');
        if (row && event.target.closest('[data-edge-edit]')) open('editor', row.dataset.edgeId);
        if (row && event.target.closest('[data-edge-copy]')) open('editor', row.dataset.edgeId, true);
      });
    } else {
      const source = rows.find((row) => row.id === recordId);
      const record = source ? this.clone(source) : { id: '', name: '', sortValue: '', image: '', onlineAt: '', offlineAt: '', status: '待上线', creator: '管理员', editor: '管理员' };
      if (copy && source) { record.id = ''; record.name = `copy${source.name}`; record.creator = '管理员'; record.editor = '管理员'; }
      record.position = record.position || tab.label;
      this.renderEditor(record, { copy });
      const root = document.getElementById('edge-management-body');
      const returnToList = () => open('list');
      root.querySelector('[data-edge-cancel]')?.addEventListener('click', returnToList);
      document.querySelector('[data-edge-back]')?.addEventListener('click', returnToList);
      root.querySelector('[data-edge-route-type]')?.addEventListener('change', (event) => {
        const isProtocol = event.target.value === 'protocol';
        root.querySelector('[data-edge-route-page]')?.toggleAttribute('hidden', isProtocol);
        root.querySelector('[data-edge-route-protocol]')?.toggleAttribute('hidden', !isProtocol);
      });
      root.querySelector('[data-edge-test="enabled"]')?.addEventListener('change', (event) => {
        const status = root.querySelector('[data-edge-test-status]');
        if (status) status.textContent = event.target.checked ? '生效' : '未启用';
      });
      root.querySelector('[data-edge-delete-image]')?.addEventListener('click', () => { record.image = ''; root.querySelector('[name="image"]').value = ''; this.renderEditor(record, { copy }); this.bind({ activeTab, mode, recordId, copy }); });
      root.querySelector('[data-edge-image-input]')?.addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.addEventListener('load', () => { record.image = reader.result; this.renderEditor(record, { copy }); this.bind({ activeTab, mode, recordId, copy }); });
        reader.readAsDataURL(file);
      });
      root.querySelector('[data-edge-form]')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const required = ['name', 'sortValue', 'onlineAt', 'offlineAt'];
        const missing = required.find((key) => !String(data.get(key) || '').trim()) || (!data.get('image') ? 'image' : '');
        if (missing) { window.BackofficeLayout.showRequiredFieldToast({ name: '名称', sortValue: '排序值', onlineAt: '上线时间', offlineAt: '下线时间', image: '贴边图片' }[missing]); return; }
        const routeType = data.get('routeType');
        const route = { type: routeType, targetPage: String(data.get('routeTargetPage') || ''), protocol: String(data.get('routeProtocol') || '').trim(), pid: String(data.get('routePid') || '').trim(), selectedPid: String(data.get('routeSelectedPid') || ''), skipType: String(data.get('routeSkipType') || '').trim(), description: String(data.get('routeDescription') || '').trim() };
        if ((routeType === 'page' && !route.targetPage) || (routeType === 'protocol' && (!route.protocol || !route.description))) { window.BackofficeLayout.showRequiredFieldToast('跳转配置'); return; }
        const frequency = { dailyCloseLimit: String(data.get('dailyCloseLimit') || '').trim(), totalCloseLimit: String(data.get('totalCloseLimit') || '').trim() };
        const invalidFrequency = Object.values(frequency).find((value) => value && (!/^\d+$/.test(value) || Number(value) <= 0));
        if (invalidFrequency) { window.BackofficeLayout.showToast('频次管理校验失败', '推送频次和展示次数填写时必须为大于 0 的整数'); return; }
        const targeting = window.ConfigurationSections.normalizeTargeting(record.targeting);
        root.querySelectorAll('[data-edge-targeting-field]').forEach((input) => { targeting[input.dataset.edgeTargetingField] = input.value; });
        targeting.identities = [...root.querySelectorAll('[data-edge-identity]:checked')].map((input) => input.value);
        targeting.audiences = [...root.querySelectorAll('[data-edge-audience]:checked')].map((input) => input.value);
        targeting.audienceInversion = root.querySelector('[name="edge-audience-inversion"]:checked')?.value || '否';
        root.querySelectorAll('[data-edge-platform]').forEach((input) => { targeting.platformVersions[input.dataset.edgePlatform].enabled = input.checked; });
        root.querySelectorAll('[data-edge-version]').forEach((input) => { const [platform, boundary] = input.dataset.edgeVersion.split(':'); targeting.platformVersions[platform][boundary] = input.value.trim(); });
        const testValue = (key) => String(root.querySelector(`[data-edge-test="${key}"]`)?.value || '').trim();
        const testPlan = { uids: testValue('uids'), start: testValue('start'), end: testValue('end'), enabled: Boolean(root.querySelector('[data-edge-test="enabled"]')?.checked) };
        const testPlanError = window.ConfigurationSections.validateTestPlan(testPlan);
        if (testPlanError) { window.BackofficeLayout.showToast('测试计划校验失败', testPlanError); return; }
        const next = { ...record, id: record.id || String(Math.max(0, ...rows.map((item) => Number(item.id) || 0)) + 1), name: data.get('name').trim(), sortValue: Number(data.get('sortValue')), image: data.get('image'), route, frequency, targeting, testPlan, onlineAt: data.get('onlineAt'), offlineAt: data.get('offlineAt'), status: data.get('status'), editor: '管理员' };
        const index = rows.findIndex((item) => item.id === next.id);
        if (index >= 0) rows.splice(index, 1, next); else rows.unshift(next);
        this.write(activeTab, rows);
        window.BackofficeLayout.showToast('保存成功', '贴边配置已更新');
        returnToList();
      });
      window.BackofficeLayout.bindGlobalTooltips();
    }
  }
};
