(function registerTabRedDotManagementPage() {
  const escape = (value) => String(value ?? '').replace(/[&<>'"]/g, (item) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[item]);

  window.TabRedDotManagementPage = {
    storageKey: 'meiyou-cashback-tab-red-dot-management-v4',
    tabOptions: ['福利页', '柚子街', '我(MIne)'],
    visibilityOptions: ['可见', '不可见'],
    seedRows: [
      { id: 10, description: '2026.8.5预发验证\n测试计划', start: '2026-08-03 00:00:00', end: '2026-08-04 23:59:59', visibility: '不可见', tab: '返现tab', tabFilter: '福利页', versions: ['iOS：-', 'Android：-'], enabled: '禁用', editor: '刘燕燕' },
      { id: 9, description: '双11红点', start: '2025-10-15 00:00:00', end: '2025-11-14 23:59:59', visibility: '不可见', tab: '返现tab', tabFilter: '柚子街', versions: ['iOS：-', 'Android：-', 'Harmony：-'], enabled: '启用', editor: '罗至玲' },
      { id: 8, description: '兜底配置', start: '2025-09-15 00:00:00', end: '2125-10-31 23:59:59', visibility: '可见', tab: '返现tab', tabFilter: '我(MIne)', versions: ['iOS：-', 'Android：-'], enabled: '启用', editor: '黄晓峰' },
      { id: 7, description: '', start: '2025-09-15 00:00:00', end: '2025-09-15 23:59:59', visibility: '不可见', tab: '返现tab', tabFilter: '福利页', versions: ['iOS：-', 'Android：-', 'Harmony：-'], enabled: '禁用', editor: '罗至玲' },
      { id: 6, description: '', start: '2025-09-01 00:00:00', end: '2025-09-07 23:59:59', visibility: '不可见', tab: '返现tab', tabFilter: '柚子街', versions: ['iOS：-', 'Android：-'], enabled: '启用', editor: '罗至玲' },
      { id: 5, description: '', start: '2024-12-30 00:00:00', end: '2024-12-30 23:59:59', visibility: '不可见', tab: '返现tab', tabFilter: '我(MIne)', versions: ['iOS：-', 'Android：-'], enabled: '禁用', editor: '周春凡' },
      { id: 4, description: '', start: '2024-12-30 00:00:00', end: '2024-12-30 23:59:59', visibility: '不可见', tab: '返现tab', tabFilter: '福利页', versions: ['iOS：-', 'Android：-'], enabled: '禁用', editor: '周春凡' },
      { id: 3, description: '', start: '2024-12-30 00:00:00', end: '2024-12-30 23:59:59', visibility: '不可见', tab: '返现tab', tabFilter: '柚子街', versions: ['iOS：-', 'Android：-'], enabled: '禁用', editor: '周春凡' },
      { id: 2, description: '', start: '2024-12-27 00:00:00', end: '2024-12-27 23:59:59', visibility: '不可见', tab: '返现tab', tabFilter: '我(MIne)', versions: ['iOS：-', 'Android：-'], enabled: '启用', editor: '周春凡' }
    ],
    clone(value) { return JSON.parse(JSON.stringify(value)); },
    read() {
      try {
        const saved = JSON.parse(localStorage.getItem(this.storageKey));
        if (Array.isArray(saved)) return saved;
      } catch (error) { /* Demonstration data remains available. */ }
      return this.clone(this.seedRows);
    },
    write(rows) { localStorage.setItem(this.storageKey, JSON.stringify(rows)); },
    label(selected, options, placeholder) {
      const values = options.filter((option) => selected.has(option));
      if (!values.length) return placeholder;
      return values.length === 1 ? values[0] : `已选 ${values.length} 项`;
    },
    readTargeting(root) {
      const targeting = window.ConfigurationSections.createTargeting();
      targeting.identities = [...root.querySelectorAll('[data-tab-red-dot-identity]:checked')].map((item) => item.value);
      targeting.audiences = [...root.querySelectorAll('[data-tab-red-dot-audience]:checked')].map((item) => item.value);
      ['targetGroup', 'excludeGroup', 'experimentId', 'excludeExperiment', 'onlineStart', 'onlineEnd'].forEach((key) => {
        targeting[key] = String(root.querySelector(`[data-tab-red-dot-targeting-field="${key}"]`)?.value || '').trim();
      });
      targeting.audienceInversion = root.querySelector('input[name="tab-red-dot-audience-inversion"]:checked')?.value || '否';
      targeting.status = root.querySelector('input[name="tab-red-dot-status"]:checked')?.value || '上线';
      Object.keys(targeting.platformVersions).forEach((platform) => {
        targeting.platformVersions[platform] = {
          enabled: Boolean(root.querySelector(`[data-tab-red-dot-platform="${platform}"]`)?.checked),
          start: String(root.querySelector(`[data-tab-red-dot-version="${platform}:start"]`)?.value || '').trim(),
          end: String(root.querySelector(`[data-tab-red-dot-version="${platform}:end"]`)?.value || '').trim()
        };
      });
      return targeting;
    },
    readTestPlan(root) {
      return {
        uids: String(root.querySelector('[data-tab-red-dot-test="uids"]')?.value || '').trim(),
        start: root.querySelector('[data-tab-red-dot-test="start"]')?.value || '',
        end: root.querySelector('[data-tab-red-dot-test="end"]')?.value || '',
        enabled: Boolean(root.querySelector('[data-tab-red-dot-test="enabled"]')?.checked)
      };
    },
    render() {
      return '<section class="content tab-red-dot-management-page"><section class="tab-red-dot-navigation panel" id="tab-red-dot-navigation"></section><section class="tab-red-dot-workspace panel"><div id="tab-red-dot-management-body"></div></section></section>';
    },
    renderList(rows, filters) {
      const root = document.getElementById('tab-red-dot-management-body');
      const dropdown = (key, title, options, selected, placeholder) => `<label><span>${title}</span><span class="tab-red-dot-filter" data-tab-red-dot-filter="${key}"><button class="control tab-red-dot-toggle" type="button" data-tab-red-dot-toggle="${key}" aria-haspopup="true" aria-expanded="false">${this.label(selected, options, placeholder)}<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" /></svg></button><span class="tab-red-dot-menu" data-tab-red-dot-menu="${key}" hidden>${options.map((option) => `<label><input type="checkbox" value="${escape(option)}" data-tab-red-dot-option="${key}"${selected.has(option) ? ' checked' : ''} /><span>${escape(option)}</span></label>`).join('')}</span></span></label>`;
      const tabItems = [{ value: '福利页' }, { value: '柚子街' }, { value: '我(MIne)', label: '我' }];
      const visibleRows = rows.filter((row) => (row.tabFilter || row.tab) === filters.activeTab && (!filters.visibility.size || filters.visibility.has(row.visibility)));
      const multiline = (value) => escape(value || '-').replace(/\n/g, '<br />');
      document.getElementById('tab-red-dot-navigation').innerHTML = `<nav class="marketing-tabs" aria-label="底部Tab"><strong class="marketing-tabs-title">底部Tab</strong><div class="marketing-tabs-list" role="tablist">${tabItems.map((item) => `<button class="marketing-tab${filters.activeTab === item.value ? ' is-active' : ''}" type="button" role="tab" aria-selected="${filters.activeTab === item.value}" data-tab-red-dot-tab="${escape(item.value)}">${escape(item.label || item.value)}</button>`).join('')}</div></nav>`;
      root.innerHTML = `<header class="marketing-workspace-heading tab-red-dot-heading"><div><h1>底Tab-营销红点管理</h1><span class="heading-note">维护底部 Tab 的红点展示配置</span></div></header><div class="tab-red-dot-filters">${dropdown('visibility', '前台状态', this.visibilityOptions, filters.visibility, '请选择前台状态')}<div class="tab-red-dot-filter-actions"><button class="button secondary" type="button" data-tab-red-dot-reset>重置</button><button class="button primary" type="button" data-tab-red-dot-search>搜索</button></div><div class="tab-red-dot-create-action"><button class="button primary" type="button" data-tab-red-dot-create>添加营销红点</button></div></div><div class="tab-red-dot-table-wrap"><table class="tab-red-dot-table"><thead><tr><th>ID</th><th>说明</th><th>有效期</th><th>前台状态</th><th>所属Tab</th><th>平台和版本</th><th>是否启用</th><th>最新编辑人</th><th>操作</th></tr></thead><tbody>${visibleRows.length ? visibleRows.map((row) => `<tr><td>${row.id}</td><td>${multiline(row.description)}</td><td>${escape(row.start)}<br />${escape(row.end)}</td><td>${escape(row.visibility)}</td><td>${escape(row.tab)}</td><td>${row.versions.map((item) => escape(item)).join('<br />')}</td><td>${escape(row.enabled)}</td><td>${escape(row.editor)}</td><td><button class="button primary tab-red-dot-edit" type="button" data-tab-red-dot-edit="${row.id}">编辑</button></td></tr>`).join('') : '<tr><td class="tab-red-dot-empty" colspan="9">暂无符合条件的红点配置</td></tr>'}</tbody></table></div><footer class="tab-red-dot-footer"><span>共 ${visibleRows.length} 条</span></footer>`;
    },
    createEditorRecord(rows, id) {
      const record = id === null
        ? { id: Math.max(0, ...rows.map((row) => Number(row.id) || 0)) + 1, type: '单纯红点', description: '', start: '2026-09-22 00:00:00', end: '2125-12-31 23:59:59', visibility: '可见', tab: '返现tab', tabFilter: this.tabOptions[0], versions: ['iOS：-', 'Android：-'], enabled: '启用', editor: '管理员', targeting: window.ConfigurationSections.createTargeting(), testPlan: window.ConfigurationSections.createTestPlan() }
        : rows.find((row) => String(row.id) === String(id));
      return record ? this.clone(record) : null;
    },
    renderEditor({ recordId = null } = {}) {
      const rows = this.read();
      const isCreating = !recordId;
      const record = this.createEditorRecord(rows, isCreating ? null : recordId);
      if (!record) return '<section class="content tab-red-dot-detail-page"><section class="tab-red-dot-detail-workspace"><div class="style-config-empty">当前营销红点配置不存在或已被删除。</div></section></section>';
      const targeting = window.ConfigurationSections.normalizeTargeting(record.targeting);
      const testPlan = window.ConfigurationSections.normalizeTestPlan(record.testPlan);
      const field = (label, control, className = '') => `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
      const basicInfo = `<section class="shared-config-section tab-red-dot-basic-section"><h3>基础信息</h3>${field('<b class="field-required">*</b>类型', `<select class="control" name="type"><option value="单纯红点"${record.type === '单纯红点' || !record.type ? ' selected' : ''}>单纯红点</option><option value="new样式红点"${record.type === 'new样式红点' ? ' selected' : ''}>new样式红点</option></select>`)}${field('<b class="field-required">*</b>说明', `<div class="tab-red-dot-description-control"><textarea class="control" name="description" maxlength="80" placeholder="请输入红点说明">${escape(record.description)}</textarea><p>红点说明，用于说明红点的用途，例如：618大促兜底红点提示</p></div>`)}${field('所属Tab', `<select class="control" name="tab">${this.tabOptions.map((option) => `<option value="${escape(option)}"${(record.tabFilter || record.tab) === option ? ' selected' : ''}>${escape(option)}</option>`).join('')}</select>`)}${field('前台状态', `<select class="control" name="visibility">${this.visibilityOptions.map((option) => `<option value="${escape(option)}"${record.visibility === option ? ' selected' : ''}>${escape(option)}</option>`).join('')}</select>`)}${field('是否启用', `<select class="control" name="enabled"><option${record.enabled === '启用' ? ' selected' : ''}>启用</option><option${record.enabled === '禁用' ? ' selected' : ''}>禁用</option></select>`)}</section>`;
      return `<section class="content tab-red-dot-detail-page"><header class="tab-red-dot-detail-heading"><button class="tab-red-dot-detail-back" type="button" data-tab-red-dot-detail-cancel aria-label="返回营销红点列表" title="返回营销红点列表"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.75 3.5 5.25 8l4.5 4.5" /></svg></button><h1>${isCreating ? '添加底Tab营销提醒' : '编辑营销红点配置'}</h1></header><section class="tab-red-dot-detail-workspace"><form class="tab-red-dot-detail-form" data-tab-red-dot-detail-form novalidate>${basicInfo}${window.ConfigurationSections.renderTargeting({ prefix: 'tab-red-dot', value: targeting, title: '定向信息', required: false, statusOptions: ['上线', '下线'] })}${window.ConfigurationSections.renderTestPlan({ prefix: 'tab-red-dot', value: testPlan, description: '测试 UID 内的用户将在测试有效时间内看到此营销红点，到期自动终止，不影响正式配置。' })}<footer class="tab-red-dot-detail-actions"><button class="button primary" type="submit">保存</button><button class="button secondary" type="button" data-tab-red-dot-detail-cancel>取消</button></footer></form></section></section>`;
    },
    bind({ navigate = () => {}, recordId = null, isAdd = false, isEdit = false } = {}) {
      if (isAdd || isEdit) {
        const rows = this.read();
        const isCreating = isAdd || !recordId;
        const record = this.createEditorRecord(rows, isCreating ? null : recordId);
        if (!record) return;
        const root = document.getElementById('page-root');
        const returnToList = () => navigate('tab-red-dot-management');
        root.querySelectorAll('[data-tab-red-dot-detail-cancel]').forEach((button) => button.addEventListener('click', returnToList));
        root.querySelector('[data-tab-red-dot-detail-form]')?.addEventListener('submit', (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          record.description = form.elements.description.value.trim();
          record.type = form.elements.type.value;
          record.tabFilter = form.elements.tab.value;
          record.visibility = form.elements.visibility.value;
          record.enabled = form.elements.enabled.value;
          if (!record.description) return window.BackofficeLayout.showRequiredFieldToast('说明');
          record.targeting = this.readTargeting(form);
          record.testPlan = this.readTestPlan(form);
          const testPlanError = window.ConfigurationSections.validateTestPlan(record.testPlan);
          if (testPlanError) return window.BackofficeLayout.showToast('测试计划校验失败', testPlanError);
          record.editor = '管理员';
          const index = rows.findIndex((row) => String(row.id) === String(record.id));
          if (index >= 0) rows.splice(index, 1, record); else rows.unshift(record);
          this.write(rows);
          window.BackofficeLayout.showToast('保存成功', '营销红点配置已更新');
          returnToList();
        });
        root.querySelector('[name="description"]')?.focus();
        return;
      }
      const rows = this.read();
      const filters = { activeTab: this.tabOptions[0], visibility: new Set() };
      let outsideListener = null;
      const refresh = () => this.renderList(rows, filters);
      const closeMenus = () => {
        document.querySelectorAll('[data-tab-red-dot-menu]').forEach((menu) => { menu.hidden = true; });
        document.querySelectorAll('[data-tab-red-dot-toggle]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
        if (outsideListener) document.removeEventListener('pointerdown', outsideListener, true);
        outsideListener = null;
      };
      const openMenu = (key) => {
        closeMenus();
        const root = document.getElementById('tab-red-dot-management-body');
        root.querySelector(`[data-tab-red-dot-menu="${key}"]`).hidden = false;
        root.querySelector(`[data-tab-red-dot-toggle="${key}"]`).setAttribute('aria-expanded', 'true');
        outsideListener = (event) => { if (!event.target.closest('[data-tab-red-dot-filter]')) closeMenus(); };
        document.addEventListener('pointerdown', outsideListener, true);
      };
      refresh();
      document.getElementById('tab-red-dot-navigation').addEventListener('click', (event) => {
        const tab = event.target.closest('[data-tab-red-dot-tab]');
        if (!tab) return;
        filters.activeTab = tab.dataset.tabRedDotTab;
        closeMenus();
        refresh();
      });
      document.getElementById('tab-red-dot-management-body').addEventListener('click', (event) => {
        const toggle = event.target.closest('[data-tab-red-dot-toggle]');
        if (toggle) return toggle.getAttribute('aria-expanded') === 'true' ? closeMenus() : openMenu(toggle.dataset.tabRedDotToggle);
        if (event.target.closest('[data-tab-red-dot-reset]')) { filters.visibility.clear(); closeMenus(); return refresh(); }
        if (event.target.closest('[data-tab-red-dot-search]')) return refresh();
        if (event.target.closest('[data-tab-red-dot-create]')) return navigate('tab-red-dot-management-add');
        const edit = event.target.closest('[data-tab-red-dot-edit]');
        if (edit) navigate(`tab-red-dot-management-edit:${edit.dataset.tabRedDotEdit}`);
      });
      document.getElementById('tab-red-dot-management-body').addEventListener('change', (event) => {
        const option = event.target.closest('[data-tab-red-dot-option]');
        if (!option) return;
        const selected = filters.visibility;
        if (option.checked) selected.add(option.value); else selected.delete(option.value);
        refresh();
        openMenu(option.dataset.tabRedDotOption);
      });
    }
  };
}());
