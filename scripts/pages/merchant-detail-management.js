window.MerchantDetailManagementPage = {
  storageKey: 'meiyou-cashback-merchant-detail-templates',
  categoryStorageKey: 'meiyou-cashback-category-records',
  merchantStorageKey: 'meiyou-cashback-merchant-records',
  records: [],
  editingId: null,
  stylingId: null,
  loadRecords() {
    try { this.records = JSON.parse(window.localStorage.getItem(this.storageKey)) || []; } catch (error) { this.records = []; }
  },
  saveRecords() { window.localStorage.setItem(this.storageKey, JSON.stringify(this.records)); },
  categories() {
    try { return (JSON.parse(window.localStorage.getItem(this.categoryStorageKey)) || []).filter((record) => record.status === '启用').map((record) => record.categoryName); } catch (error) { return []; }
  },
  merchants() {
    try { return JSON.parse(window.localStorage.getItem(this.merchantStorageKey)) || []; } catch (error) { return []; }
  },
  escape(value = '') {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  },
  sanitizeRuleHtml(value = '') {
    const template = document.createElement('template');
    template.innerHTML = String(value);
    const allowedTags = new Set(['P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI']);
    template.content.querySelectorAll('*').forEach((element) => {
      if (!allowedTags.has(element.tagName)) element.replaceWith(...element.childNodes);
      else [...element.attributes].forEach((attribute) => element.removeAttribute(attribute.name));
    });
    return template.innerHTML;
  },
  render() {
    return `<section class="content"><div class="page-heading"><h1>合作商详情页管理</h1><span class="heading-note">维护不同合作商类型的详情页模板</span></div><section class="panel">
      <div class="filters"><div class="field"><label for="detail-template-name">记录名称：</label><input class="control" id="detail-template-name" placeholder="请输入记录名称" /></div><div class="field"><label for="detail-template-category">合作商分类：</label><select class="control" id="detail-template-category"><option value="">全部</option></select></div><div class="field"><label for="detail-template-status">状态：</label><select class="control" id="detail-template-status"><option value="">全部</option><option value="启用">启用</option><option value="停用">停用</option></select></div></div>
      <div class="actions"><button class="button primary" id="detail-template-search" type="button">搜索</button><button class="button secondary" id="detail-template-reset" type="button">重置</button><button class="button primary" id="open-detail-template-modal" type="button">添加详情页模板</button></div>
      <div class="table-wrap"><table class="detail-template-table"><thead><tr><th>记录名称</th><th>样式类型</th><th>模板类型</th><th>合作商分类兜底模板</th><th>合作商列表</th><th>状态</th><th>更新时间</th><th>操作</th></tr></thead><tbody id="detail-template-table-body"></tbody></table></div><div class="empty" id="detail-template-empty"><div class="empty-inner"><div class="empty-icon">▰</div><div>暂无详情页模板</div></div></div>
    </section>${this.renderModal()}</section>`;
  },
  renderModal() {
    return `<div class="modal" id="detail-template-modal" hidden><form class="modal-card" id="detail-template-form" novalidate><div class="modal-header"><h2 id="detail-template-modal-title">添加详情页模板</h2><button class="icon-close" id="close-detail-template-modal" type="button" title="关闭">×</button></div><div class="modal-body">
      <div class="form-row" id="detail-template-name-row"><label class="required" for="detail-template-form-name">记录名称：</label><div class="form-control-area"><div class="control-with-tooltip"><input class="control" id="detail-template-form-name" placeholder="请输入记录名称" /><button class="help-tooltip" type="button" data-tooltip="仅用于后台展示" aria-label="记录名称说明">?</button></div><div class="error-message">请输入记录名称</div></div></div>
      <div class="form-row" id="detail-template-type-row"><label class="required">样式类型：</label><div class="form-control-area"><div class="radio-group"><label class="radio-option"><input type="radio" name="detail-template-type" value="电商详情页" />电商详情页</label><label class="radio-option"><input type="radio" name="detail-template-type" value="充值详情页" />充值详情页</label><label class="radio-option"><input type="radio" name="detail-template-type" value="其他" />其他</label></div><div class="error-message">请选择样式类型</div></div></div>
      <div class="form-row" id="detail-template-level-row"><label class="required">模板类型：</label><div class="form-control-area"><div class="control-with-tooltip"><div class="radio-group template-level-options"><label class="radio-option"><input type="radio" name="detail-template-level" value="分类兜底模板" />分类兜底模板</label><label class="radio-option"><input type="radio" name="detail-template-level" value="定制模板" />定制模板</label></div><button class="help-tooltip" type="button" data-tooltip="分类兜底模板：无特殊要求下的分类兜底样式，在用户端展示。&#10;定制模板：针对合作商家的定制化样式，用于前端展示，优先级高于分类兜底模板。" aria-label="模板类型说明">?</button></div><div class="error-message">请选择模板类型</div></div></div>
      <div class="form-row template-target-row" id="detail-template-form-category-row" hidden><label class="required" for="detail-template-form-category">合作商分类兜底模板：</label><div class="form-control-area"><select class="control" id="detail-template-form-category"><option value="">请选择合作商分类</option></select><div class="error-message">请选择合作商分类</div></div></div>
      <div class="form-row template-target-row" id="detail-template-merchants-row" hidden><label class="required">合作商列表：</label><div class="form-control-area"><div class="merchant-picker-filter"><label for="detail-template-merchant-category">合作商分类：</label><select class="control" id="detail-template-merchant-category"><option value="">全部</option></select></div><div class="merchant-picker-list" id="detail-template-merchant-list"></div><div class="error-message">请选择至少一个合作商</div></div></div>
      <div class="form-row" id="detail-template-status-row"><label class="required">状态：</label><div class="form-control-area"><div class="radio-group"><label class="radio-option"><input type="radio" name="detail-template-status-form" value="启用" />启用</label><label class="radio-option"><input type="radio" name="detail-template-status-form" value="停用" />停用</label></div><div class="error-message">请选择状态</div></div></div>
    </div><div class="modal-footer"><button class="button secondary" id="cancel-detail-template" type="button">取消</button><button class="button primary" type="submit">保存</button></div></form></div>`;
  },
  bind({ navigate } = {}) {
    this.loadRecords();
    const categoryOptions = this.categories();
    const merchants = this.merchants();
    ['detail-template-category', 'detail-template-form-category', 'detail-template-merchant-category'].forEach((id) => categoryOptions.forEach((category) => document.getElementById(id).add(new Option(category, category))));
    const modal = document.getElementById('detail-template-modal');
    const form = document.getElementById('detail-template-form');
    const keyword = document.getElementById('detail-template-name');
    let customSelectedMerchantIds = [];
    const selectedMerchantIds = () => customSelectedMerchantIds;
    const renderMerchantOptions = (selectedIds = customSelectedMerchantIds) => { const picker = document.getElementById('detail-template-merchant-list'); const selected = new Set(selectedIds); const category = document.getElementById('detail-template-merchant-category').value; const visibleMerchants = merchants.filter((merchant) => !category || merchant.category === category); picker.innerHTML = visibleMerchants.length ? visibleMerchants.map((merchant) => { const rule = merchant.ruleContent ? `<div class="merchant-picker-rule">${this.sanitizeRuleHtml(merchant.ruleContent)}</div>` : ''; const merchantStatus = merchant.status || '上线'; return `<label class="merchant-picker-option"><input type="checkbox" name="detail-template-merchants" value="${this.escape(merchant.id)}" ${selected.has(merchant.id) ? 'checked' : ''} /><span>${this.escape(merchant.name)}</span><small>${this.escape(merchant.category || '未分类')}<em class="merchant-picker-status ${merchantStatus === '上线' ? 'is-online' : 'is-offline'}">${this.escape(merchantStatus)}</em></small>${rule}</label>`; }).join('') : '<div class="merchant-picker-empty">暂无可选合作商</div>'; picker.querySelectorAll('input[name="detail-template-merchants"]').forEach((input) => input.addEventListener('change', () => { customSelectedMerchantIds = input.checked ? [...new Set([...customSelectedMerchantIds, input.value])] : customSelectedMerchantIds.filter((id) => id !== input.value); })); };
    const toggleTemplateTarget = (level) => { const isCategoryTemplate = level === '分类兜底模板'; const isCustomTemplate = level === '定制模板'; document.getElementById('detail-template-form-category-row').hidden = !isCategoryTemplate; document.getElementById('detail-template-merchants-row').hidden = !isCustomTemplate; if (isCustomTemplate) renderMerchantOptions(); };
    const open = (record) => { this.editingId = record?.id || null; window.BackofficeLayout.setAddModalMode(modal, !record); customSelectedMerchantIds = record?.merchantIds || []; form.reset(); document.querySelectorAll('#detail-template-form .form-row').forEach((row) => row.classList.remove('is-invalid')); document.getElementById('detail-template-modal-title').textContent = record ? '编辑详情页模板' : '添加详情页模板'; if (record) { document.getElementById('detail-template-form-name').value = record.name; document.getElementById('detail-template-form-category').value = record.category || ''; const typeInput = document.querySelector(`input[name="detail-template-type"][value="${record.type}"]`); const levelInput = document.querySelector(`input[name="detail-template-level"][value="${record.level}"]`); const statusInput = document.querySelector(`input[name="detail-template-status-form"][value="${record.status}"]`); if (typeInput) typeInput.checked = true; if (levelInput) levelInput.checked = true; if (statusInput) statusInput.checked = true; toggleTemplateTarget(record.level); } else { toggleTemplateTarget(''); } modal.hidden = false; };
    const close = () => { modal.hidden = true; window.BackofficeLayout.setAddModalMode(modal, false); this.editingId = null; };
    const renderTable = () => this.renderTable(keyword.value, document.getElementById('detail-template-category').value, document.getElementById('detail-template-status').value);
    document.getElementById('open-detail-template-modal').addEventListener('click', () => open()); document.getElementById('close-detail-template-modal').addEventListener('click', close); document.getElementById('cancel-detail-template').addEventListener('click', close); modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
    form.querySelectorAll('input[name="detail-template-level"]').forEach((input) => input.addEventListener('change', () => { document.getElementById('detail-template-form-category').value = ''; document.getElementById('detail-template-merchant-category').value = ''; customSelectedMerchantIds = []; toggleTemplateTarget(input.value); }));
    document.getElementById('detail-template-merchant-category').addEventListener('change', () => renderMerchantOptions(selectedMerchantIds()));
    document.getElementById('detail-template-search').addEventListener('click', renderTable); document.getElementById('detail-template-reset').addEventListener('click', () => { keyword.value = ''; document.getElementById('detail-template-category').value = ''; document.getElementById('detail-template-status').value = ''; renderTable(); });
    document.getElementById('detail-template-table-body').addEventListener('click', (event) => { const editButton = event.target.closest('[data-detail-edit-id]'); const styleButton = event.target.closest('[data-detail-style-id]'); if (editButton) open(this.records.find((record) => record.id === editButton.dataset.detailEditId)); if (styleButton) navigate?.(`detail-template-style:${styleButton.dataset.detailStyleId}`); });
    form.addEventListener('submit', (event) => { event.preventDefault(); const name = document.getElementById('detail-template-form-name').value.trim(); const category = document.getElementById('detail-template-form-category').value; const type = form.querySelector('input[name="detail-template-type"]:checked'); const level = form.querySelector('input[name="detail-template-level"]:checked'); const status = form.querySelector('input[name="detail-template-status-form"]:checked'); const merchantIds = selectedMerchantIds(); const isCategoryTemplate = level?.value === '分类兜底模板'; const validations = [[name, 'detail-template-name-row', '记录名称'], [type, 'detail-template-type-row', '样式类型'], [level, 'detail-template-level-row', '模板类型'], [isCategoryTemplate ? category : merchantIds.length, isCategoryTemplate ? 'detail-template-form-category-row' : 'detail-template-merchants-row', isCategoryTemplate ? '合作商分类兜底模板' : '合作商列表'], [status, 'detail-template-status-row', '状态']]; validations.forEach(([valid, row]) => document.getElementById(row).classList.toggle('is-invalid', !valid)); const missing = validations.find(([valid]) => !valid); if (missing) { window.BackofficeLayout.showRequiredFieldToast(missing[2]); return; } const selectedMerchants = merchants.filter((merchant) => merchantIds.includes(merchant.id)); const record = { id: this.editingId || String(Date.now()), name, category: isCategoryTemplate ? category : '', merchantIds: isCategoryTemplate ? [] : merchantIds, merchantNames: isCategoryTemplate ? [] : selectedMerchants.map((merchant) => merchant.name), type: type.value, level: level.value, status: status.value, updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-') }; if (this.editingId) this.records = this.records.map((item) => item.id === this.editingId ? { ...item, ...record } : item); else this.records.unshift(record); this.saveRecords(); close(); renderTable(); });
    renderTable();
  },
  renderTable(keyword = '', category = '', status = '') {
    const records = this.records.filter((record) => (
      record.name.toLowerCase().includes(keyword.trim().toLowerCase())
      && (!category || record.category === category)
      && (!status || record.status === status)
    ));
    const tableBody = document.getElementById('detail-template-table-body');

    tableBody.innerHTML = records.map((record) => {
      const merchantNames = Array.isArray(record.merchantNames) ? record.merchantNames : [];
      return `<tr>
        <td>${this.escape(record.name)}</td>
        <td>${this.escape(record.type || '-')}</td>
        <td>${this.escape(record.level || '-')}</td>
        <td>${this.escape(record.category || '-')}</td>
        <td class="detail-template-merchants-cell">${this.escape(merchantNames.join('、') || '-')}</td>
        <td class="${record.status === '启用' ? 'status-online' : ''}">${this.escape(record.status || '-')}</td>
        <td>${this.escape(record.updatedAt || '-')}</td>
        <td><div class="table-actions"><button class="table-action" type="button" data-detail-edit-id="${this.escape(record.id)}">编辑</button><button class="table-action" type="button" data-detail-style-id="${this.escape(record.id)}">模板样式管理</button></div></td>
      </tr>`;
    }).join('');
    document.getElementById('detail-template-empty').hidden = records.length > 0;
  }
};
