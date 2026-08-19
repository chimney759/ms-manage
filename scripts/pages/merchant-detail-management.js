window.MerchantDetailManagementPage = {
  storageKey: 'meiyou-cashback-merchant-detail-templates',
  merchantStorageKey: 'meiyou-cashback-merchant-records',
  records: [],
  editingId: null,
  stylingId: null,
  loadRecords() {
    window.BackofficeDemoData?.ensure();
    try { this.records = JSON.parse(window.localStorage.getItem(this.storageKey)) || []; } catch (error) { this.records = []; }
  },
  saveRecords() { window.localStorage.setItem(this.storageKey, JSON.stringify(this.records)); },
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
    return `<section class="content"><div class="page-heading"><h1>详情页管理（合作商）</h1><span class="heading-note">维护合作商详情页配置</span></div><section class="panel">
      <div class="filters"><div class="field"><label for="detail-template-name">记录名称：</label><input class="control" id="detail-template-name" placeholder="请输入记录名称" /></div><div class="field"><label for="detail-template-merchant-name">合作商名称：</label><input class="control" id="detail-template-merchant-name" placeholder="请输入合作商名称" /></div><div class="field"><label for="detail-template-status">状态：</label><select class="control" id="detail-template-status"><option value="">全部</option><option value="启用">启用</option><option value="停用">停用</option></select></div></div>
      <div class="actions"><button class="button primary" id="detail-template-search" type="button">搜索</button><button class="button secondary" id="detail-template-reset" type="button">重置</button><button class="button primary" id="open-detail-template-modal" type="button">添加详情页</button></div>
      <div class="table-wrap"><table class="detail-template-table"><thead><tr><th>记录名称</th><th>样式类型</th><th>合作商名称</th><th>状态</th><th>创建时间</th><th>更新时间</th><th>操作</th></tr></thead><tbody id="detail-template-table-body"></tbody></table></div><div class="empty" id="detail-template-empty"><div class="empty-inner"><div class="empty-icon">▰</div><div>暂无详情页模板</div></div></div>
    </section>${this.renderModal()}</section>`;
  },
  renderModal() {
    return `<div class="modal" id="detail-template-modal" hidden><form class="modal-card" id="detail-template-form" novalidate><div class="modal-header"><h2 id="detail-template-modal-title">添加详情页模板</h2><button class="icon-close" id="close-detail-template-modal" type="button" title="关闭">×</button></div><div class="modal-body">
      <div class="form-row" id="detail-template-name-row"><label class="required" for="detail-template-form-name">记录名称：</label><div class="form-control-area"><div class="control-with-tooltip"><input class="control" id="detail-template-form-name" placeholder="请输入记录名称，建议格式形如“腾讯视频-直充”" /><button class="help-tooltip" type="button" data-tooltip="仅用于后台展示" aria-label="记录名称说明">?</button></div><div class="error-message">请输入记录名称</div></div></div>
      <div class="form-row" id="detail-template-type-row"><label class="required">样式类型：</label><div class="form-control-area"><div class="control-with-tooltip"><div class="radio-group"><label class="radio-option"><input type="radio" name="detail-template-type" value="电商详情页" />电商详情页</label><label class="radio-option"><input type="radio" name="detail-template-type" value="充值详情页" />充值详情页</label><label class="radio-option"><input type="radio" name="detail-template-type" value="卡券详情页" />卡券详情页</label></div><button class="help-tooltip" type="button" data-tooltip="不同样式支持的前端能力不同，请按照对应的类型进行选择。" aria-label="样式类型说明">?</button></div><div class="error-message">请选择样式类型</div></div></div>
      <div class="form-row template-target-row" id="detail-template-merchants-row"><label class="required">合作商列表：</label><div class="form-control-area"><section class="merchant-picker-shell" aria-label="合作商候选列表"><div class="merchant-picker-toolbar"><strong>选择合作商</strong><div class="merchant-picker-controls"><div class="merchant-picker-search"><label class="sr-only" for="detail-template-merchant-keyword">合作商名称</label><input class="control" id="detail-template-merchant-keyword" placeholder="搜索合作商名称" /></div><div class="merchant-picker-filter"><label for="detail-template-merchant-category">按合作商分类筛选</label><select class="control" id="detail-template-merchant-category"><option value="">全部分类</option></select></div></div></div><div class="merchant-picker-list" id="detail-template-merchant-list"></div></section><div class="form-help">选择合作商后，将作为指定合作商的详情页模板。</div><div class="error-message">请选择至少一个合作商</div></div></div>
      <div class="form-row" id="detail-template-status-row"><label class="required">状态：</label><div class="form-control-area"><div class="radio-group"><label class="radio-option"><input type="radio" name="detail-template-status-form" value="启用" />启用</label><label class="radio-option"><input type="radio" name="detail-template-status-form" value="停用" />停用</label></div><div class="error-message">请选择状态</div></div></div>
    </div><div class="modal-footer"><button class="button secondary" id="cancel-detail-template" type="button">取消</button><button class="button primary" type="submit">保存</button></div></form></div>`;
  },
  bind({ navigate } = {}) {
    this.loadRecords();
    const merchants = this.merchants();
    const categoryOptions = [...new Set(merchants.map((merchant) => merchant.category).filter(Boolean))];
    categoryOptions.forEach((category) => document.getElementById('detail-template-merchant-category').add(new Option(category, category)));
    const modal = document.getElementById('detail-template-modal');
    const form = document.getElementById('detail-template-form');
    const keyword = document.getElementById('detail-template-name');
    let customSelectedMerchantIds = [];
    const selectedMerchantIds = () => customSelectedMerchantIds;
    const renderMerchantOptions = (selectedIds = customSelectedMerchantIds) => { const picker = document.getElementById('detail-template-merchant-list'); const selected = new Set(selectedIds); const category = document.getElementById('detail-template-merchant-category').value; const merchantKeyword = document.getElementById('detail-template-merchant-keyword').value.trim().toLocaleLowerCase(); const visibleMerchants = merchants.filter((merchant) => (!category || merchant.category === category) && (!merchantKeyword || (merchant.name || '').toLocaleLowerCase().includes(merchantKeyword))); picker.innerHTML = visibleMerchants.length ? visibleMerchants.map((merchant) => { const rule = merchant.ruleContent ? `<div class="merchant-picker-rule">${this.sanitizeRuleHtml(merchant.ruleContent)}</div>` : ''; const merchantStatus = merchant.status || '上线'; return `<label class="merchant-picker-option"><input type="checkbox" name="detail-template-merchants" value="${this.escape(merchant.id)}" ${selected.has(merchant.id) ? 'checked' : ''} /><span>${this.escape(merchant.name)}</span><small>${this.escape(merchant.category || '未分类')}<em class="merchant-picker-status ${merchantStatus === '上线' ? 'is-online' : 'is-offline'}">${this.escape(merchantStatus)}</em></small>${rule}</label>`; }).join('') : '<div class="merchant-picker-empty">未找到匹配的合作商</div>'; picker.querySelectorAll('input[name="detail-template-merchants"]').forEach((input) => input.addEventListener('change', () => { customSelectedMerchantIds = input.checked ? [...new Set([...customSelectedMerchantIds, input.value])] : customSelectedMerchantIds.filter((id) => id !== input.value); })); };
    const open = (record) => { this.editingId = record?.id || null; window.BackofficeLayout.setAddModalMode(modal, !record); customSelectedMerchantIds = record?.merchantIds || []; form.reset(); document.querySelectorAll('#detail-template-form .form-row').forEach((row) => row.classList.remove('is-invalid')); document.getElementById('detail-template-modal-title').textContent = record ? '编辑详情页模板' : '添加详情页模板'; if (record) { document.getElementById('detail-template-form-name').value = record.name; const typeInput = document.querySelector(`input[name="detail-template-type"][value="${record.type}"]`); const statusInput = document.querySelector(`input[name="detail-template-status-form"][value="${record.status}"]`); if (typeInput) typeInput.checked = true; if (statusInput) statusInput.checked = true; } renderMerchantOptions(); modal.hidden = false; };
    const close = () => { modal.hidden = true; window.BackofficeLayout.setAddModalMode(modal, false); this.editingId = null; };
    const merchantKeyword = document.getElementById('detail-template-merchant-name');
    const renderTable = () => this.renderTable(keyword.value, merchantKeyword.value, document.getElementById('detail-template-status').value);
    document.getElementById('open-detail-template-modal').addEventListener('click', () => open()); document.getElementById('close-detail-template-modal').addEventListener('click', close); document.getElementById('cancel-detail-template').addEventListener('click', close); modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
    document.getElementById('detail-template-merchant-category').addEventListener('change', () => renderMerchantOptions(selectedMerchantIds())); document.getElementById('detail-template-merchant-keyword').addEventListener('input', () => renderMerchantOptions(selectedMerchantIds()));
    document.getElementById('detail-template-search').addEventListener('click', renderTable); document.getElementById('detail-template-reset').addEventListener('click', () => { keyword.value = ''; merchantKeyword.value = ''; document.getElementById('detail-template-status').value = ''; renderTable(); });
    document.getElementById('detail-template-table-body').addEventListener('click', (event) => { const editButton = event.target.closest('[data-detail-edit-id]'); const styleButton = event.target.closest('[data-detail-style-id]'); if (editButton) open(this.records.find((record) => record.id === editButton.dataset.detailEditId)); if (styleButton) navigate?.(`detail-template-style:${styleButton.dataset.detailStyleId}`); });
    form.addEventListener('submit', (event) => { event.preventDefault(); const name = document.getElementById('detail-template-form-name').value.trim(); const type = form.querySelector('input[name="detail-template-type"]:checked'); const status = form.querySelector('input[name="detail-template-status-form"]:checked'); const merchantIds = selectedMerchantIds(); const validations = [[name, 'detail-template-name-row', '记录名称'], [type, 'detail-template-type-row', '样式类型'], [merchantIds.length, 'detail-template-merchants-row', '合作商列表'], [status, 'detail-template-status-row', '状态']]; validations.forEach(([valid, row]) => document.getElementById(row).classList.toggle('is-invalid', !valid)); const missing = validations.find(([valid]) => !valid); if (missing) { window.BackofficeLayout.showRequiredFieldToast(missing[2]); return; } const selectedMerchants = merchants.filter((merchant) => merchantIds.includes(merchant.id)); const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'); const existingRecord = this.records.find((item) => item.id === this.editingId); const record = { id: this.editingId || String(Date.now()), name, merchantIds, merchantNames: selectedMerchants.map((merchant) => merchant.name), type: type.value, status: status.value, createdAt: existingRecord?.createdAt || existingRecord?.updatedAt || now, updatedAt: now }; if (this.editingId) this.records = this.records.map((item) => item.id === this.editingId ? { ...item, ...record } : item); else this.records.unshift(record); this.saveRecords(); close(); renderTable(); });
    renderTable();
  },
  renderTable(keyword = '', merchantKeyword = '', status = '') {
    const normalizedMerchantKeyword = merchantKeyword.trim().toLowerCase();
    const records = this.records.filter((record) => (
      record.name.toLowerCase().includes(keyword.trim().toLowerCase())
      && (!normalizedMerchantKeyword || (record.merchantNames || []).some((merchantName) => String(merchantName).toLowerCase().includes(normalizedMerchantKeyword)))
      && (!status || record.status === status)
    ));
    const tableBody = document.getElementById('detail-template-table-body');

    tableBody.innerHTML = records.map((record) => {
      const merchantNames = Array.isArray(record.merchantNames) ? record.merchantNames : [];
      return `<tr>
        <td>${this.escape(record.name)}</td>
        <td>${this.escape(record.type || '-')}</td>
        <td class="detail-template-merchants-cell">${this.escape(merchantNames.join('、') || '-')}</td>
        <td class="${record.status === '启用' ? 'status-online' : ''}">${this.escape(record.status || '-')}</td>
        <td>${this.escape(record.createdAt || record.updatedAt || '-')}</td>
        <td>${this.escape(record.updatedAt || '-')}</td>
        <td><div class="table-actions"><button class="table-action" type="button" data-detail-edit-id="${this.escape(record.id)}">编辑</button><button class="table-action" type="button" data-detail-style-id="${this.escape(record.id)}">模板样式管理</button></div></td>
      </tr>`;
    }).join('');
    document.getElementById('detail-template-empty').hidden = records.length > 0;
  }
};
