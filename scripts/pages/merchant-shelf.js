window.MerchantShelfPage = {
  storageKey: 'meiyou-cashback-merchant-shelf-config',
  categoryStorageKey: 'meiyou-cashback-category-records',
  merchantStorageKey: 'meiyou-cashback-merchant-records',
  escape(value = '') {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  },
  read(key) {
    try { const value = JSON.parse(window.localStorage.getItem(key)); return Array.isArray(value) ? value : []; } catch (error) { return []; }
  },
  loadCategories() {
    window.BackofficeDemoData?.ensure();
    return this.read(this.categoryStorageKey).filter((item) => item.status === '启用' && item.categoryName);
  },
  loadMerchants() { return this.read(this.merchantStorageKey).filter((item) => item.name && item.enabledStatus !== '停用'); },
  loadConfig(categories, merchants) {
    try {
      const stored = JSON.parse(window.localStorage.getItem(this.storageKey));
      if (stored && Array.isArray(stored.categoryOrder) && stored.selectedByCategory && typeof stored.selectedByCategory === 'object') {
        stored.merchantMarketing = stored.merchantMarketing && typeof stored.merchantMarketing === 'object' ? stored.merchantMarketing : {};
        return stored;
      }
    } catch (error) { /* Use the demo defaults below. */ }
    return {
      categoryOrder: categories.map((item) => item.categoryName),
      selectedByCategory: Object.fromEntries(categories.map((item) => [
        item.categoryName,
        merchants.filter((merchant) => merchant.category === item.categoryName).map((merchant) => merchant.id)
      ])),
      merchantMarketing: {}
    };
  },
  render() {
    return `<section class="content merchant-shelf-page"><div class="page-heading"><h1>商家页列表页管理</h1><span class="heading-note">固定样式配置，所见即所得</span></div><section class="merchant-shelf-editor">
      <section class="shelf-preview-panel"><div class="style-panel-heading"><h2>页面预览</h2><span>所见即所得</span></div><div class="shelf-phone-stage"><div class="shelf-phone-frame"><div class="shelf-phone-header"><span>‹</span><b>全部商家</b><i>•••</i></div><div class="shelf-search">⌕ <span>搜索商家名称，下单享返还</span></div><div class="shelf-phone-content"><nav class="shelf-category-nav" id="shelf-category-nav" aria-label="商家分类导航"></nav><div class="shelf-merchant-content" id="shelf-preview-content"></div></div></div></div></section>
      <aside class="shelf-config-panel"><div class="style-panel-heading"><h2>商家配置</h2><span id="shelf-config-category"></span></div><div class="shelf-config-body"><p class="shelf-fixed-note">固定样式：左侧分类导航与右侧每行 3 个商家卡位。</p><section class="shelf-merchant-selector"><div class="shelf-selector-heading"><strong>选择合作商</strong><span id="shelf-selected-count"></span></div><div class="shelf-merchant-list" id="shelf-merchant-list"></div></section><div class="shelf-config-actions"><button class="button primary" id="save-merchant-shelf" type="button">保存</button></div></div></aside>
    </section></section>`;
  },
  bind() {
    const categories = this.loadCategories();
    const merchants = this.loadMerchants();
    let config = this.loadConfig(categories, merchants);
    const categoryNames = new Set(categories.map((item) => item.categoryName));
    config.categoryOrder = config.categoryOrder.filter((name) => categoryNames.has(name));
    categories.forEach((item) => { if (!config.categoryOrder.includes(item.categoryName)) config.categoryOrder.push(item.categoryName); });
    config.categoryOrder.forEach((name) => { if (!Array.isArray(config.selectedByCategory[name])) config.selectedByCategory[name] = []; });
    config.merchantMarketing = config.merchantMarketing && typeof config.merchantMarketing === 'object' ? config.merchantMarketing : {};
    let activeCategory = config.categoryOrder[0] || '';
    let draggedCategory = '';
    let draggedMerchant = '';
    const getCategoryMerchants = (category) => merchants.filter((merchant) => merchant.category === category);
    const selectedMerchants = (category) => {
      const visible = getCategoryMerchants(category);
      const selectedIds = config.selectedByCategory[category] || [];
      const byId = new Map(visible.map((item) => [item.id, item]));
      return selectedIds.map((id) => byId.get(id)).filter(Boolean);
    };
    const reorder = (list, source, target) => {
      const from = list.indexOf(source); const to = list.indexOf(target);
      if (from < 0 || to < 0 || from === to) return list;
      const next = [...list]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next;
    };
    const renderCategories = () => {
      const nav = document.getElementById('shelf-category-nav');
      nav.innerHTML = config.categoryOrder.length ? config.categoryOrder.map((name) => `<button type="button" class="shelf-category-item ${name === activeCategory ? 'active' : ''}" draggable="true" data-shelf-category="${this.escape(name)}"><span class="shelf-drag">⠿</span>${this.escape(name)}</button>`).join('') : '<span class="shelf-empty-note">暂无启用分类</span>';
      nav.querySelectorAll('[data-shelf-category]').forEach((item) => {
        item.addEventListener('click', () => { activeCategory = item.dataset.shelfCategory; renderAll(); });
        item.addEventListener('dragstart', () => { draggedCategory = item.dataset.shelfCategory; item.classList.add('is-dragging'); });
        item.addEventListener('dragend', () => { draggedCategory = ''; item.classList.remove('is-dragging'); });
        item.addEventListener('dragover', (event) => { event.preventDefault(); item.classList.add('is-dragover'); });
        item.addEventListener('dragleave', () => item.classList.remove('is-dragover'));
        item.addEventListener('drop', (event) => { event.preventDefault(); item.classList.remove('is-dragover'); config.categoryOrder = reorder(config.categoryOrder, draggedCategory, item.dataset.shelfCategory); renderAll(); });
      });
    };
    const merchantAvatar = (merchant) => merchant.avatarPreview ? `<img src="${this.escape(merchant.avatarPreview)}" alt="" />` : `<span>${this.escape(merchant.name.slice(0, 1))}</span>`;
    const marketingFor = (merchantId) => config.merchantMarketing[merchantId] || {};
    const renderPreview = () => {
      const content = document.getElementById('shelf-preview-content');
      const merchantsForCategory = selectedMerchants(activeCategory);
      content.innerHTML = `<section class="shelf-preview-section"><h3>${this.escape(activeCategory || '商家分类')}</h3>${merchantsForCategory.length ? `<div class="shelf-preview-grid">${merchantsForCategory.map((merchant) => {
        const marketing = marketingFor(merchant.id);
        return `<button class="shelf-preview-card" type="button" draggable="true" data-preview-merchant="${this.escape(merchant.id)}"><span class="shelf-card-avatar-wrap">${merchantAvatar(merchant)}${marketing.cornerBadge ? `<i class="shelf-corner-badge">${this.escape(marketing.cornerBadge)}</i>` : ''}</span><b>${this.escape(merchant.name)}</b>${marketing.bottomTag ? `<span class="shelf-bottom-tag">${this.escape(marketing.bottomTag)}</span>` : ''}</button>`;
      }).join('')}</div>` : '<div class="shelf-preview-empty">从右侧勾选商家填入固定卡位</div>'}</section>`;
      content.querySelectorAll('[data-preview-merchant]').forEach((item) => {
        item.addEventListener('dragstart', () => { draggedMerchant = item.dataset.previewMerchant; item.classList.add('is-dragging'); });
        item.addEventListener('dragend', () => { draggedMerchant = ''; item.classList.remove('is-dragging'); });
        item.addEventListener('dragover', (event) => { event.preventDefault(); item.classList.add('is-dragover'); });
        item.addEventListener('dragleave', () => item.classList.remove('is-dragover'));
        item.addEventListener('drop', (event) => { event.preventDefault(); item.classList.remove('is-dragover'); config.selectedByCategory[activeCategory] = reorder(config.selectedByCategory[activeCategory], draggedMerchant, item.dataset.previewMerchant); renderAll(); });
      });
    };
    const renderSelector = () => {
      const list = document.getElementById('shelf-merchant-list');
      const candidates = getCategoryMerchants(activeCategory);
      const selected = config.selectedByCategory[activeCategory] || [];
      document.getElementById('shelf-config-category').textContent = activeCategory || '未选择分类';
      document.getElementById('shelf-selected-count').textContent = `已选 ${selected.length} 个`;
      list.innerHTML = candidates.length ? candidates.map((merchant) => {
        const isSelected = selected.includes(merchant.id);
        const marketing = marketingFor(merchant.id);
        return `<label class="shelf-merchant-option ${isSelected ? 'selected' : ''}" draggable="${isSelected}" data-selector-merchant="${this.escape(merchant.id)}"><input type="checkbox" value="${this.escape(merchant.id)}" ${isSelected ? 'checked' : ''} /><span class="shelf-option-avatar">${merchantAvatar(merchant)}</span><span class="shelf-option-name">${this.escape(merchant.name)}</span><small>${this.escape(merchant.category)}</small><i class="shelf-row-drag">⠿</i>${isSelected ? `<div class="shelf-marketing-fields" data-marketing-fields="${this.escape(merchant.id)}"><div class="shelf-marketing-field"><span>底部营销标签</span><input type="text" value="${this.escape(marketing.bottomTag || '')}" placeholder="如：新人专享" data-marketing-key="bottomTag" /></div><div class="shelf-marketing-field"><span>角标</span><input type="text" value="${this.escape(marketing.cornerBadge || '')}" placeholder="如：限时优惠" data-marketing-key="cornerBadge" /></div></div>` : ''}</label>`;
      }).join('') : '<div class="shelf-selector-empty">该分类下暂无可选择的合作商</div>';
      list.querySelectorAll('input[type="checkbox"]').forEach((input) => input.addEventListener('change', () => { const id = input.value; const current = config.selectedByCategory[activeCategory] || []; config.selectedByCategory[activeCategory] = input.checked ? [...current, id] : current.filter((item) => item !== id); renderAll(); }));
      list.querySelectorAll('[data-marketing-fields]').forEach((fieldGroup) => {
        fieldGroup.addEventListener('click', (event) => event.stopPropagation());
        fieldGroup.addEventListener('mousedown', (event) => event.stopPropagation());
        fieldGroup.querySelectorAll('[data-marketing-key]').forEach((input) => input.addEventListener('input', () => {
          const merchantId = fieldGroup.dataset.marketingFields;
          config.merchantMarketing[merchantId] = { ...marketingFor(merchantId), [input.dataset.marketingKey]: input.value };
          renderPreview();
        }));
      });
      list.querySelectorAll('[data-selector-merchant]').forEach((item) => {
        item.addEventListener('dragstart', (event) => { if (!item.classList.contains('selected')) { event.preventDefault(); return; } draggedMerchant = item.dataset.selectorMerchant; item.classList.add('is-dragging'); });
        item.addEventListener('dragend', () => { draggedMerchant = ''; item.classList.remove('is-dragging'); });
        item.addEventListener('dragover', (event) => { if (!item.classList.contains('selected')) return; event.preventDefault(); item.classList.add('is-dragover'); });
        item.addEventListener('dragleave', () => item.classList.remove('is-dragover'));
        item.addEventListener('drop', (event) => { if (!item.classList.contains('selected')) return; event.preventDefault(); item.classList.remove('is-dragover'); config.selectedByCategory[activeCategory] = reorder(config.selectedByCategory[activeCategory], draggedMerchant, item.dataset.selectorMerchant); renderAll(); });
      });
    };
    const renderAll = () => { renderCategories(); renderPreview(); renderSelector(); };
    document.getElementById('save-merchant-shelf').addEventListener('click', () => { window.localStorage.setItem(this.storageKey, JSON.stringify(config)); window.BackofficeLayout.showToast('保存成功', '商家页列表配置已更新'); });
    renderAll();
  }
};
