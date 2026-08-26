// 可视化编辑框架：集中维护各编辑器的最近编辑记录。
window.RecentEdits = {
  storageKey: 'meiyou-cashback-visual-editor-recent-edits',
  limit: 200,
  summaryLimit: 3,
  detailLimit: 20,
  operator: '张三',
  selectedOperators: {},
  read() {
    try {
      const records = JSON.parse(window.localStorage.getItem(this.storageKey));
      return Array.isArray(records) ? records.map((item) => ({ ...item, operator: item.operator || this.operator })) : [];
    } catch (error) {
      return [];
    }
  },
  write(records) {
    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(records));
    } catch (error) {
      // Auxiliary UI metadata must never interrupt a business save.
    }
  },
  record({ scope, id, name, operator = this.operator } = {}) {
    const safeScope = String(scope || '').trim();
    const safeId = String(id || '').trim();
    const safeName = String(name || '').trim();
    if (!safeScope || !safeId || !safeName) return this.read();
    const records = this.read().filter((item) => !(item.scope === safeScope && item.id === safeId));
    records.unshift({ scope: safeScope, id: safeId, name: safeName, operator: String(operator || this.operator).trim(), updatedAt: Date.now() });
    const next = records.slice(0, this.limit);
    this.write(next);
    return next;
  },
  list(scope) {
    return this.read().filter((item) => item.scope === scope);
  },
  formatName(item) {
    return `${item.name}${item.operator ? ` @${item.operator}` : ''}`;
  },
  getRecords(scope, filter) {
    const records = this.list(scope);
    return typeof filter === 'function' ? records.filter(filter) : records;
  },
  render(container, scope, { onSelect, filter } = {}) {
    if (!container) return;
    const records = this.getRecords(scope, filter);
    const operators = [...new Set(records.map((item) => item.operator).filter(Boolean))];
    const selectedOperator = operators.includes(this.selectedOperators[scope]) ? this.selectedOperators[scope] : '';
    if (!selectedOperator) delete this.selectedOperators[scope];
    const filteredRecords = selectedOperator ? records.filter((item) => item.operator === selectedOperator) : records;
    const summary = filteredRecords.slice(0, this.summaryLimit);
    const accountFilter = operators.length ? `<select class="marketing-recent-edits-filter" aria-label="按编辑账号筛选" data-recent-edits-operator><option value="">全部账号</option>${operators.map((operator) => `<option value="${this.escape(operator)}"${operator === selectedOperator ? ' selected' : ''}>${this.escape(operator)}</option>`).join('')}</select>` : '';
    container.innerHTML = `<div class="marketing-recent-edits-head"><div><strong class="marketing-recent-edits-label">最近编辑</strong><span>当前页面的组件编辑记录</span></div>${accountFilter}</div><div class="marketing-recent-edits-list">${summary.length ? summary.map((item) => `<button class="marketing-recent-edits-item" type="button" data-recent-edit-id="${this.escape(item.id)}" title="定位到${this.escape(this.formatName(item))}"><span>${this.escape(item.name)}</span><small>@${this.escape(item.operator || this.operator)}</small></button>`).join('') : '<span class="marketing-recent-edits-empty">暂无记录</span>'}</div>${filteredRecords.length ? '<button class="text-button marketing-recent-edits-more" type="button" data-recent-edits-more>查看更多</button>' : ''}`;
    container.querySelector('[data-recent-edits-operator]')?.addEventListener('change', (event) => {
      this.selectedOperators[scope] = event.target.value;
      this.render(container, scope, { onSelect, filter });
    });
    container.querySelectorAll('[data-recent-edit-id]').forEach((button) => button.addEventListener('click', () => {
      const item = filteredRecords.find((record) => record.id === button.dataset.recentEditId);
      if (item) onSelect?.(item);
    }));
    container.querySelector('[data-recent-edits-more]')?.addEventListener('click', () => this.showAll(scope, { onSelect, filter }));
  },
  showAll(scope, { onSelect, filter } = {}) {
    document.getElementById('recent-edits-modal')?.remove();
    const selectedOperator = this.selectedOperators[scope] || '';
    const records = this.getRecords(scope, filter)
      .filter((item) => !selectedOperator || item.operator === selectedOperator)
      .slice(0, this.detailLimit);
    const modal = document.createElement('section');
    modal.className = 'modal recent-edits-modal';
    modal.id = 'recent-edits-modal';
    modal.innerHTML = `<div class="modal-card recent-edits-modal-card" role="dialog" aria-modal="true" aria-label="最近编辑"><div class="modal-header"><div class="recent-edits-modal-title"><h2>最近编辑</h2><span>最新 ${records.length} 条编辑记录</span></div><button class="icon-close" type="button" data-close-recent-edits aria-label="关闭">×</button></div><div class="recent-edits-modal-body">${records.map((item, index) => `<button class="recent-edits-modal-item" type="button" data-recent-edit-id="${this.escape(item.id)}" aria-label="定位到${this.escape(item.name)}"><span class="recent-edits-modal-index">${index + 1}</span><span class="recent-edits-modal-item-copy"><strong>${this.escape(item.name)}</strong><small>编辑人：${this.escape(item.operator || this.operator)}</small></span><span class="recent-edits-modal-item-action">定位</span></button>`).join('') || '<p>暂无记录</p>'}</div></div>`;
    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.closest('[data-close-recent-edits]')) { modal.remove(); return; }
      const button = event.target.closest('[data-recent-edit-id]');
      const item = records.find((record) => record.id === button?.dataset.recentEditId);
      if (item) { modal.remove(); onSelect?.(item); }
    });
    document.body.appendChild(modal);
  },
  escape(value) {
    return String(value || '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }
};
