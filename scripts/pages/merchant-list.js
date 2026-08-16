window.MerchantListPage = {
  storageKey: 'meiyou-cashback-merchant-records',
  categoryStorageKey: 'meiyou-cashback-category-records',
  records: [],
  loadRecords() {
    window.BackofficeDemoData?.ensure();
    try {
      const storedRecords = JSON.parse(window.localStorage.getItem(this.storageKey));
      this.records = Array.isArray(storedRecords) ? storedRecords : [];
    } catch (error) {
      this.records = [];
    }
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
  ruleSummary(value = '') {
    const container = document.createElement('div');
    container.innerHTML = String(value);
    return (container.textContent || '').replace(/\s+/g, ' ').trim();
  },
  render() {
    return `<section class="content"><div class="page-heading"><h1>合作商列表</h1><span class="heading-note">查看已配置的合作商信息</span></div><section class="panel">
      <div class="filters">
        <div class="field"><label for="merchant-category-filter">合作商分类：</label><select class="control" id="merchant-category-filter"><option value="">全部</option></select></div>
        <div class="field"><label for="merchant-name-filter">合作商名称：</label><input class="control" id="merchant-name-filter" placeholder="请输入合作商名称" /></div>
        <div class="field"><label for="merchant-status-filter">状态：</label><select class="control" id="merchant-status-filter"><option value="">全部</option><option value="上线">上线</option><option value="下线">下线</option></select></div>
      </div>
      <div class="actions"><button class="button primary" id="search" type="button">搜索</button><button class="button secondary" id="reset" type="button">重置</button><button class="button primary" id="add" type="button">添加合作商</button><button class="text-button" id="refresh" type="button">刷新</button></div>
      <div class="table-wrap"><table class="merchant-table"><thead><tr><th>合作商头像</th><th>合作商名称</th><th>合作商分类</th><th>合作商视频</th><th>视频封面</th><th>合作商规则</th><th>状态</th><th>是否有实验</th><th>操作</th></tr></thead><tbody id="merchant-table-body"></tbody></table></div>
      <div class="empty" id="merchant-empty"><div class="empty-inner"><div class="empty-icon">▰</div><div>暂无数据</div></div></div>
    </section></section>`;
  },
  bind({ navigate } = {}) {
    this.loadRecords();
    const categoryFilter = document.getElementById('merchant-category-filter');
    let categoryRecords = [];
    try { categoryRecords = JSON.parse(window.localStorage.getItem(this.categoryStorageKey)) || []; } catch (error) { categoryRecords = []; }
    const categories = categoryRecords.filter((record) => record.status === '启用').map((record) => record.categoryName);
    [...new Set(categories)].forEach((category) => categoryFilter.add(new Option(category, category)));
    const renderTable = () => this.renderTable({
      category: categoryFilter.value,
      name: document.getElementById('merchant-name-filter').value,
      status: document.getElementById('merchant-status-filter').value
    });
    document.getElementById('reset').addEventListener('click', () => {
      categoryFilter.value = '';
      document.getElementById('merchant-name-filter').value = '';
      document.getElementById('merchant-status-filter').value = '';
      renderTable();
    });
    document.getElementById('search').addEventListener('click', renderTable);
    document.getElementById('merchant-name-filter').addEventListener('keydown', (event) => { if (event.key === 'Enter') renderTable(); });
    document.getElementById('refresh').addEventListener('click', () => { this.loadRecords(); renderTable(); });
    document.getElementById('add').addEventListener('click', () => navigate?.('merchant-add'));
    document.getElementById('merchant-table-body').addEventListener('click', (event) => {
      const editButton = event.target.closest('[data-edit-id]');
      if (editButton) navigate?.(`merchant-edit:${editButton.dataset.editId}`);
    });
    const tableBody = document.getElementById('merchant-table-body');
    const showRulePreview = (preview) => {
      const popover = preview.querySelector('.merchant-rule-popover');
      if (!popover) return;
      const bounds = preview.getBoundingClientRect();
      const popoverWidth = 360;
      const left = Math.max(12, Math.min(bounds.left, window.innerWidth - popoverWidth - 12));
      popover.style.left = `${left}px`;
      popover.style.top = `${Math.min(bounds.bottom + 10, window.innerHeight - 96)}px`;
      popover.style.maxHeight = `${Math.max(130, window.innerHeight - Math.min(bounds.bottom + 10, window.innerHeight - 96) - 16)}px`;
      preview.classList.add('is-preview-open');
    };
    const hideRulePreview = (preview, relatedTarget) => {
      if (!preview.contains(relatedTarget)) preview.classList.remove('is-preview-open');
    };
    tableBody.addEventListener('pointerover', (event) => {
      const preview = event.target.closest('.merchant-rule-preview');
      if (preview) showRulePreview(preview);
    });
    tableBody.addEventListener('pointerout', (event) => {
      const preview = event.target.closest('.merchant-rule-preview');
      if (preview) hideRulePreview(preview, event.relatedTarget);
    });
    tableBody.addEventListener('focusin', (event) => {
      const preview = event.target.closest('.merchant-rule-preview');
      if (preview) showRulePreview(preview);
    });
    tableBody.addEventListener('focusout', (event) => {
      const preview = event.target.closest('.merchant-rule-preview');
      if (preview) hideRulePreview(preview, event.relatedTarget);
    });
    renderTable();
  },
  renderTable(filters = {}) {
    const category = filters.category || '';
    const name = (filters.name || '').trim().toLowerCase();
    const status = filters.status || '';
    const visibleRecords = this.records.filter((record) => (!category || record.category === category) && (!name || record.name.toLowerCase().includes(name)) && (!status || record.status === status));
    const value = (content) => this.escape(content || '-');
    document.getElementById('merchant-table-body').innerHTML = visibleRecords.map((record) => `<tr>
      <td>${record.avatarPreview ? `<span class="avatar-preview" tabindex="0"><img src="${this.escape(record.avatarPreview)}" alt="${this.escape(record.name)}头像" /><span class="avatar-preview-popover"><img src="${this.escape(record.avatarPreview)}" alt="${this.escape(record.name)}头像预览" /></span></span>` : (record.avatarName ? `<span class="file-value">${this.escape(record.avatarName)}</span>` : '-')}</td><td>${value(record.name)}</td><td>${value(record.category)}</td><td>${value(record.videoName)}</td><td>${value(record.coverName)}</td><td class="merchant-rule-summary">${record.ruleContent ? `<span class="merchant-rule-preview" tabindex="0" aria-label="预览合作商规则"><span class="merchant-rule-preview-text">${value(this.ruleSummary(record.ruleContent))}</span><span class="merchant-rule-popover">${this.sanitizeRuleHtml(record.ruleContent)}</span></span>` : '-'}</td><td class="${record.status === '上线' ? 'status-online' : ''}">${value(record.status)}</td><td>${record.experimentId || record.excludeExperiment ? '有' : '无'}</td><td><div class="table-actions"><button class="table-action" type="button" data-edit-id="${this.escape(record.id)}">编辑</button></div></td>
    </tr>`).join('');
    document.getElementById('merchant-empty').hidden = visibleRecords.length > 0;
  }
};
