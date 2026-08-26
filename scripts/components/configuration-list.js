window.ConfigurationList = {
  escape(value) {
    return String(value || '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  },
  open({ title = '配置列表', records = [], onSelect } = {}) {
    document.getElementById('configuration-list-modal')?.remove();
    const modal = document.createElement('section');
    modal.className = 'modal is-editor-fullscreen configuration-list-modal';
    modal.id = 'configuration-list-modal';
    const cell = (value) => `<td title="${this.escape(value)}">${this.escape(value || '-')}</td>`;
    const rows = records.length
      ? `<div class="configuration-list-wrap"><table class="configuration-list"><thead><tr><th>配置类型</th><th>记录名称</th><th>配置信息</th><th>状态</th><th>操作</th></tr></thead><tbody>${records.map((record) => `<tr>${cell(record.type)}${cell(record.name)}${cell(record.summary)}${cell(record.status)}<td class="configuration-list-action"><button class="text-button" type="button" data-configuration-list-record="${this.escape(record.id)}">查看</button></td></tr>`).join('')}</tbody></table></div>`
      : '<div class="configuration-list-empty">暂未添加已保存配置</div>';
    modal.innerHTML = `<div class="modal-card configuration-list-card" role="dialog" aria-modal="true" aria-labelledby="configuration-list-title"><div class="modal-header"><h2 id="configuration-list-title">${this.escape(title)}</h2><button class="icon-close" type="button" data-close-configuration-list aria-label="关闭">×</button></div><div class="modal-body configuration-list-body"><p>仅展示当前导航下已保存的配置。</p>${rows}</div><div class="modal-footer"><button class="button primary" type="button" data-close-configuration-list>关闭</button></div></div>`;
    const close = () => modal.remove();
    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.closest('[data-close-configuration-list]')) {
        close();
        return;
      }
      const action = event.target.closest('[data-configuration-list-record]');
      if (!action) return;
      const record = records.find((item) => String(item.id) === action.dataset.configurationListRecord);
      if (!record) return;
      close();
      onSelect?.(record);
    });
    document.body.append(modal);
    modal.querySelector('[data-close-configuration-list]')?.focus();
  }
};
