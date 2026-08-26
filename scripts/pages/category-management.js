window.CategoryManagementPage = {
  storageKey: 'meiyou-cashback-category-records',
  maxRecords: 10,
  records: [],
  editingId: null,
  pendingToggleId: null,
  loadRecords() {
    window.BackofficeDemoData?.ensure();
    try {
      const storedRecords = JSON.parse(window.localStorage.getItem(this.storageKey));
      this.records = Array.isArray(storedRecords) ? storedRecords.slice(0, this.maxRecords) : [];
    } catch (error) {
      this.records = [];
    }
  },
  saveRecords() {
    window.localStorage.setItem(this.storageKey, JSON.stringify(this.records));
  },
  render() {
    return `<section class="content"><div class="page-heading"><h1>合作商分类管理</h1><span class="heading-note">维护前台可用的合作商分类</span></div><section class="panel">
      <div class="category-filters"><label for="category-keyword">分类名称：</label><input class="control" id="category-keyword" placeholder="请输入分类名称" /><button class="button primary" id="category-search" type="button">搜索</button><button class="button secondary" id="category-reset" type="button">重置</button></div>
      <div class="actions"><button class="button primary" id="open-category-modal" type="button">添加分类</button></div>
      <div class="table-wrap"><table class="category-table"><thead><tr><th>分类 ID</th><th>记录名称</th><th>分类名称</th><th>状态</th><th>创建人</th><th>创建时间</th><th>最后更新人</th><th>更新时间</th><th>操作</th></tr></thead><tbody id="category-table-body"></tbody></table></div>
      <div class="empty" id="category-empty"><div class="empty-inner"><div class="empty-icon">▰</div><div>暂无数据</div></div></div>
    </section>${this.renderModal()}${this.renderStatusConfirmModal()}</section>`;
  },
  renderModal() {
    return `<div class="modal" id="category-modal" hidden><form class="modal-card" id="category-form" novalidate><div class="modal-header"><h2 id="category-modal-title">添加分类</h2><button class="icon-close" id="close-category-modal" type="button" title="关闭">×</button></div><div class="modal-body">
      <div class="form-row" id="record-name-row"><label class="required" for="record-name">记录名称：</label><div class="form-control-area"><div class="control-with-tooltip"><input class="control" id="record-name" placeholder="请输入记录名称" maxlength="30" /><button class="help-tooltip" type="button" aria-label="记录名称说明" data-tooltip="仅用于后台识别，不向用户端透传">?</button></div><div class="error-message">请输入记录名称</div></div></div>
      <div class="form-row" id="category-name-row"><label class="required" for="category-name">分类名称：</label><div class="form-control-area"><div class="control-with-tooltip"><input class="control" id="category-name" placeholder="请输入分类名称" maxlength="30" /><button class="help-tooltip" type="button" aria-label="分类名称说明" data-tooltip="透传到前台的分类名称，用户端可能会看到">?</button></div><div class="error-message">请输入分类名称</div></div></div>
      <div class="form-row" id="category-status-row"><label class="required">状态：</label><div class="form-control-area"><div class="radio-group"><label class="radio-option"><input type="radio" name="category-status" value="启用" />启用</label><label class="radio-option"><input type="radio" name="category-status" value="停用" />停用</label></div><div class="error-message">请选择状态</div></div></div>
    </div><div class="modal-footer"><button class="button secondary" id="cancel-category" type="button">取消</button><button class="button primary" type="submit">保存</button></div></form></div>`;
  },
  renderStatusConfirmModal() {
    return `<div class="modal" id="status-confirm-modal" hidden><section class="modal-card confirm-card" role="dialog" aria-modal="true" aria-labelledby="status-confirm-title"><div class="modal-header"><h2 id="status-confirm-title"></h2><button class="icon-close" id="close-status-confirm" type="button" title="关闭">×</button></div><div class="confirm-body" id="status-confirm-content"></div><div class="modal-footer"><button class="button secondary" id="cancel-status-confirm" type="button">取消</button><button class="button primary" id="confirm-status-change" type="button">确认</button></div></section></div>`;
  },
  bind() {
    const page = this;
    page.loadRecords();
    const modal = document.getElementById('category-modal');
    const statusConfirmModal = document.getElementById('status-confirm-modal');
    const form = document.getElementById('category-form');
    const keyword = document.getElementById('category-keyword');
    const open = (record) => {
      page.editingId = record ? record.id : null;
      window.BackofficeLayout.setEditorModalMode(modal, { isNew: !record });
      form.reset();
      document.querySelectorAll('.form-row').forEach((row) => row.classList.remove('is-invalid'));
      document.getElementById('category-modal-title').textContent = record ? '编辑分类' : '添加分类';
      if (record) {
        document.getElementById('record-name').value = record.recordName;
        document.getElementById('category-name').value = record.categoryName;
        form.querySelector(`input[name="category-status"][value="${record.status}"]`).checked = true;
      }
      modal.hidden = false;
      document.getElementById('record-name').focus();
    };
    const close = () => { modal.hidden = true; modal.classList.remove('is-editor-fullscreen', 'is-add-fullscreen'); form.reset(); page.editingId = null; document.querySelectorAll('.form-row').forEach((row) => row.classList.remove('is-invalid')); };
    document.getElementById('open-category-modal').addEventListener('click', () => open());
    document.getElementById('close-category-modal').addEventListener('click', close);
    document.getElementById('cancel-category').addEventListener('click', close);
    modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
    const closeStatusConfirm = () => { statusConfirmModal.hidden = true; page.pendingToggleId = null; };
    const openStatusConfirm = (record) => {
      const isEnable = record.status !== '启用';
      page.pendingToggleId = record.id;
      document.getElementById('status-confirm-title').textContent = isEnable ? '启用提醒' : '停用提醒';
      document.getElementById('status-confirm-content').innerHTML = isEnable
        ? '<p>确定要启用吗？</p><p class="confirm-impact">影响面：</p><ol><li>启用后可以在合作商列表中看到此分类，</li><li>已配置好当前分类的合作商，启用后在用户端会展示。</li></ol>'
        : '<p>确定要停用吗？</p><p class="confirm-impact">影响面：</p><ol><li>停用后在合作列表中无法看到此分类，</li><li>已配置好当前分类的合作商，停用后在用户端不会展示。</li></ol>';
      statusConfirmModal.hidden = false;
    };
    document.getElementById('close-status-confirm').addEventListener('click', closeStatusConfirm);
    document.getElementById('cancel-status-confirm').addEventListener('click', closeStatusConfirm);
    statusConfirmModal.addEventListener('click', (event) => { if (event.target === statusConfirmModal) closeStatusConfirm(); });
    document.getElementById('confirm-status-change').addEventListener('click', () => {
      const record = page.records.find((item) => item.id === page.pendingToggleId);
      if (record) {
        record.status = record.status === '启用' ? '停用' : '启用';
        record.updater = '管理员';
        record.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
        page.saveRecords();
        page.renderTable(keyword.value);
      }
      closeStatusConfirm();
    });
    document.getElementById('category-search').addEventListener('click', () => page.renderTable(keyword.value));
    document.getElementById('category-reset').addEventListener('click', () => { keyword.value = ''; page.renderTable(''); });
    keyword.addEventListener('keydown', (event) => { if (event.key === 'Enter') page.renderTable(keyword.value); });
    document.getElementById('category-table-body').addEventListener('click', (event) => {
      const editButton = event.target.closest('[data-edit-id]');
      if (editButton) {
        open(page.records.find((record) => record.id === editButton.dataset.editId));
        return;
      }
      const toggleButton = event.target.closest('[data-toggle-id]');
      if (!toggleButton) return;
      const record = page.records.find((item) => item.id === toggleButton.dataset.toggleId);
      openStatusConfirm(record);
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const recordName = document.getElementById('record-name').value.trim();
      const categoryName = document.getElementById('category-name').value.trim();
      const status = form.querySelector('input[name="category-status"]:checked');
      document.getElementById('record-name-row').classList.toggle('is-invalid', !recordName);
      document.getElementById('category-name-row').classList.toggle('is-invalid', !categoryName);
      document.getElementById('category-status-row').classList.toggle('is-invalid', !status);
      if (!recordName || !categoryName || !status) {
        window.BackofficeLayout.showRequiredFieldToast(!recordName ? '记录名称' : (!categoryName ? '分类名称' : '状态'));
        return;
      }
      const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
      const editedRecord = page.records.find((record) => record.id === page.editingId);
      if (editedRecord) {
        Object.assign(editedRecord, { recordName, categoryName, status: status.value, updater: '管理员', updatedAt: now });
      } else {
        page.records.unshift({ id: String(Date.now()), recordName, categoryName, status: status.value, creator: '管理员', createdAt: now, updater: '管理员', updatedAt: now });
        page.records.splice(page.maxRecords);
      }
      page.saveRecords();
      close(); keyword.value = ''; page.renderTable('');
    });
    page.renderTable('');
  },
  renderTable(searchTerm) {
    const keyword = searchTerm.trim().toLowerCase();
    const visibleRecords = this.records.filter((record) => record.categoryName.toLowerCase().includes(keyword));
    document.getElementById('category-table-body').innerHTML = visibleRecords.map((record) => `<tr><td>${record.id}</td><td>${record.recordName}</td><td>${record.categoryName}</td><td class="${record.status === '启用' ? 'status-online' : ''}">${record.status}</td><td>${record.creator}</td><td>${record.createdAt}</td><td>${record.updater}</td><td>${record.updatedAt}</td><td><div class="table-actions"><button class="table-action" type="button" data-edit-id="${record.id}">编辑</button><button class="table-action ${record.status === '启用' ? 'status-disable' : 'status-enable'}" type="button" data-toggle-id="${record.id}">${record.status === '启用' ? '停用' : '启用'}</button></div></td></tr>`).join('');
    document.getElementById('category-empty').hidden = visibleRecords.length > 0;
  }
};
