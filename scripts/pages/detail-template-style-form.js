window.DetailTemplateStyleFormPage = {
  storageKey: 'meiyou-cashback-merchant-detail-templates',
  merchantStorageKey: 'meiyou-cashback-merchant-records',
  activeComponentId: null,
  loadRecords() {
    try {
      const records = JSON.parse(window.localStorage.getItem(this.storageKey));
      return Array.isArray(records) ? records : [];
    } catch (error) {
      return [];
    }
  },
  escape(value = '') {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  },
  defaultComponents() {
    return [];
  },
  createRechargeDetailConfig() {
    return { actionText: '优惠充值', categories: ['黄金会员', '白金会员', '星钻VIP'] };
  },
  normalizeRechargeDetailConfig(config = {}) {
    const defaults = this.createRechargeDetailConfig();
    const source = config && typeof config === 'object' ? config : {};
    return {
      ...defaults,
      ...source,
      categories: Array.isArray(source.categories) && source.categories.length ? source.categories : defaults.categories
    };
  },
  componentLabel(type) {
    return { search: '搜索功能', resource: '资源位', productFlow: '商品信息流', merchantProductFlow: '合作商货品流' }[type] || '未命名组件';
  },
  audienceGroups: [
    { title: '常用人群', items: ['返现新用户（实时）', '首次访问用户（实时）', '0 单用户群（实时）', '少于等于 1 单的用户群（实时）', '淘宝 0 单用户群（实时）', '抖音 0 单用户群（实时）', '返现 uid 尾号为双号人群（实时）', '返现 uid 尾号为单号人群（实时）'] },
    { title: '活动人群', help: '具备一定通用特征的、可重复使用的人群。', items: ['可领取现金红包的用户群', '可使用现金红包的用户群', '现金红包待到账的用户群', '现金红包已到账的用户群'] },
    { title: '临时人群', help: '即定制开发的、不可重复使用的人群，如需使用，请提前和研发确认。', items: ['少于等于 1 单且有待使用返现红包的用户群（实时）', '当日已访问过大促活动页面用户群'] }
  ],
  createResourceTargeting() {
    return { identities: [], targetGroup: '', excludeGroup: '', audiences: [], audienceInversion: '否', experimentId: '', excludeExperiment: '', platformVersions: { ios: { enabled: true, start: '8.96.0.0', end: '' }, android: { enabled: true, start: '8.96.0.0', end: '' }, harmony: { enabled: true, start: '8.99.0.0', end: '' } }, onlineStart: '', onlineEnd: '', testPlan: { uids: '', start: '', end: '', enabled: true } };
  },
  normalizeResourceTargeting(targeting = {}) {
    const defaults = this.createResourceTargeting();
    const source = targeting && typeof targeting === 'object' ? targeting : {};
    return {
      ...defaults,
      ...source,
      identities: Array.isArray(source.identities) ? source.identities : defaults.identities,
      audiences: Array.isArray(source.audiences) ? source.audiences : defaults.audiences,
      platformVersions: {
        ios: { ...defaults.platformVersions.ios, ...(source.platformVersions?.ios || {}) },
        android: { ...defaults.platformVersions.android, ...(source.platformVersions?.android || {}) },
        harmony: { ...defaults.platformVersions.harmony, ...(source.platformVersions?.harmony || {}) }
      },
      testPlan: { ...defaults.testPlan, ...(source.testPlan || {}) }
    };
  },
  renderAudienceOptions(selected = []) {
    return this.audienceGroups.map((group) => {
      const help = group.help ? ` <button class="help-tooltip" type="button" data-tooltip="${group.help}" aria-label="${group.title}说明">?</button>` : '';
      const labels = group.items.map((item) => `<label><input type="checkbox" data-resource-audience="${this.escape(item)}" value="${this.escape(item)}" ${selected.includes(item) ? 'checked' : ''} />${this.escape(item)}</label>`).join('');
      return `<div class="audience-group"><div class="audience-group-title">${group.title}${help}</div><div class="audience-group-items">${labels}</div></div>`;
    }).join('');
  },
  merchantsForTemplate(record) {
    let merchants = [];
    try { merchants = JSON.parse(window.localStorage.getItem(this.merchantStorageKey)) || []; } catch (error) { merchants = []; }
    const merchantIds = new Set(record.merchantIds || []);
    return merchants.filter((merchant) => merchant.name && merchantIds.has(merchant.id));
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
  renderMerchantRules(record) {
    const merchantsWithRules = this.merchantsForTemplate(record).filter((merchant) => merchant.ruleContent?.trim());
    if (!merchantsWithRules.length) return '';
    const showMerchantName = merchantsWithRules.length > 1;
    return `<section class="preview-merchant-rules" aria-label="合作商规则"><h3>合作商规则</h3>${merchantsWithRules.map((merchant) => `<article class="preview-merchant-rule">${showMerchantName ? `<b>${this.escape(merchant.name)}</b>` : ''}<div>${this.sanitizeRuleHtml(merchant.ruleContent)}</div></article>`).join('')}</section>`;
  },
  allowedProductType(record) {
    return { '充值详情页': '直充', '卡券详情页': '卡券' }[record.type] || '';
  },
  productCatalog(record) {
    const productSeeds = [
      ['303', '超级影视VIP月卡', '腾讯视频', '直充', '27.04', '50', 'https://placehold.co/160x160/ff8aae/ffffff?text=VIP'],
      ['127', 'VIP会员季卡', '喜马拉雅', '直充', '37.87', '73', 'https://placehold.co/160x160/ffb047/ffffff?text=VIP'],
      ['85', '普通会员月卡', '优酷视频', '直充', '14.62', '30', 'https://placehold.co/160x160/6f9cff/ffffff?text=VIP'],
      ['1635', '会员年卡', '腾讯动漫', '直充', '101.52', '300', 'https://placehold.co/160x160/a683e8/ffffff?text=VIP'],
      ['1314', '年费会员年卡', '酷我音乐', '直充', '179.27', '300', 'https://placehold.co/160x160/f37284/ffffff?text=VIP'],
      ['133', '会员年卡', 'KEEP', '直充', '124.31', '248', 'https://placehold.co/160x160/35b99a/ffffff?text=KEEP'],
      ['908', '会员月卡', '书旗小说', '直充', '14.9', '15', 'https://placehold.co/160x160/ed8d45/ffffff?text=BOOK'],
      ['1312', '年费会员季卡', '酷我音乐', '直充', '34.11', '75', 'https://placehold.co/160x160/63b5dd/ffffff?text=MUSIC'],
      ['159', '红包5元【1天5次】', '美团外卖', '直充', '3.5', '5', 'https://placehold.co/160x160/ff6558/ffffff?text=MEITUAN'],
      ['1380', 'NBA球队通季卡', '咪咕视频', '直充', '45.87', '68', 'https://placehold.co/160x160/4e85d6/ffffff?text=NBA'],
      ['2101', '京东购物满200减20券', '京东', '卡券', '18', '20', 'https://placehold.co/160x160/e85a5a/ffffff?text=JD'],
      ['2102', '星巴克咖啡代金券', '星巴克', '卡券', '28', '35', 'https://placehold.co/160x160/3b9b70/ffffff?text=CAFE'],
      ['2103', '电影通兑优惠券', '猫眼电影', '卡券', '36', '45', 'https://placehold.co/160x160/f5a447/ffffff?text=TICKET']
    ];
    const allowedType = this.allowedProductType(record);
    const availableSeeds = allowedType ? productSeeds.filter((seed) => seed[3] === allowedType) : productSeeds;
    const merchants = this.merchantsForTemplate(record);
    return merchants.flatMap((merchant, merchantIndex) => {
      const merchantSeeds = availableSeeds.filter((_, itemIndex) => itemIndex % Math.min(merchants.length, 3) === merchantIndex % Math.min(merchants.length, 3));
      return merchantSeeds.map(([id, title, brand, type, salesPrice, officialPrice, image]) => ({ id: `${merchant.id}-${id}`, productNo: id, title, supplierId: merchant.id, supplier: merchant.name, brand, type, image, salesPrice, officialPrice, cost: salesPrice, price: officialPrice, status: merchant.status === '下线' ? '已下线' : '上线中' }));
    });
  },
  createResourceMaterial() {
    return {
      id: `material-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      imageText: '资源位素材',
      linkType: '淘宝活动',
      link: '',
      pid: '',
      skipType: '',
      mallId: '',
      name: '',
      popupLogo: '',
      popupCopy: ''
    };
  },
  createComponent(type) {
    const id = `style-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    if (type === 'search') return { id, type, placeholder: '搜索商品、品牌或优惠' };
    if (type === 'resource') return { id, type, name: '未命名资源位', layout: '拼图', materials: [this.createResourceMaterial()], targeting: this.createResourceTargeting() };
    if (type === 'merchantProductFlow') return { id, type, title: '合作商货品', selectedProductIds: [], productCategories: {} };
    return { id, type, title: '商品信息流', library: '', libraryId: '', libraryName: '' };
  },
  render({ recordId = null } = {}) {
    const record = this.loadRecords().find((item) => item.id === recordId);
    if (!record) {
      return `<section class="content"><div class="page-heading"><div class="page-title-row"><button class="back-button" id="back-to-detail-templates" type="button" title="返回合作商详情页管理">‹</button><h1>模板样式编辑</h1></div></div><section class="panel style-page-empty"><div class="empty"><div class="empty-inner"><div class="empty-icon">▰</div><div>未找到对应的详情页模板</div></div></div></section></section>`;
    }
    const scope = record.merchantNames?.join('、') || '-';
    const supportsSearch = record.type === '电商详情页';
    const supportsMerchantProductFlow = record.type !== '电商详情页';
    const searchTool = supportsSearch
      ? '<button class="style-tool" type="button" draggable="true" data-component-type="search"><b>⌕</b><span>搜索功能</span><small>仅支持一个</small></button>'
      : '';
    const merchantProductFlowTool = supportsMerchantProductFlow
      ? '<button class="style-tool" type="button" draggable="true" data-component-type="merchantProductFlow"><b>▤</b><span>合作商货品流</span><small>拖入后确认货品</small></button>'
      : '';
    return `<section class="content detail-template-style-page"><div class="page-heading"><div class="page-title-row"><button class="back-button" id="back-to-detail-templates" type="button" title="返回合作商详情页管理">‹</button><h1>模板样式编辑</h1></div><span class="heading-note">${this.escape(record.name)} · ${this.escape(scope)}</span></div>
      <section class="style-builder" id="style-builder" data-record-id="${this.escape(record.id)}">
        <aside class="style-toolbox"><h2>功能组件</h2><p>拖入右侧页面预览区域完成搭建</p><div class="style-tool-list">
          ${searchTool}
          <button class="style-tool" type="button" draggable="true" data-component-type="resource"><b>▣</b><span>资源位</span><small>拖入后配置素材</small></button>
          <button class="style-tool" type="button" draggable="true" data-component-type="productFlow"><b>≡</b><span>商品信息流</span><small>拖入后配置应用库</small></button>
          ${merchantProductFlowTool}
        </div></aside>
        <section class="style-preview-panel"><div class="style-panel-heading"><h2>页面预览</h2><span>所见即所得</span></div><div class="phone-stage" id="phone-stage"><div class="phone-frame"><div class="phone-status"><span>9:41</span><span>● ● ●</span></div><div class="page-canvas" id="style-page-canvas" aria-label="页面预览区域"></div></div><div class="component-annotations" id="style-component-annotations" aria-label="页面结构标注"></div></div><div class="canvas-drop-tip" id="canvas-drop-tip">将功能组件拖入此处</div></section>
        <aside class="style-config-panel"><div class="style-panel-heading"><h2>组件配置</h2><span id="style-config-type">未选择组件</span></div>${record.type === '充值详情页' ? '<button class="text-button recharge-fixed-config-trigger" id="edit-recharge-fixed-style" type="button">固定样式配置</button>' : ''}<div id="style-config-content" class="style-config-content"><div class="style-config-empty">从左侧拖入组件，或点击预览中的组件进行配置</div></div></aside>
      </section>
      <div class="form-page-actions style-page-actions"><button class="button secondary" id="cancel-detail-template-style-page" type="button">取消</button><button class="button primary" id="save-detail-template-style-page" type="button">保存</button></div>
    </section>`;
  },
  bind({ navigate, recordId = null } = {}) {
    const records = this.loadRecords();
    const record = records.find((item) => item.id === recordId);
    const back = () => navigate?.('merchant-detail');
    document.getElementById('back-to-detail-templates').addEventListener('click', back);
    if (!record) return;
    const builder = document.getElementById('style-builder');
    const canvas = document.getElementById('style-page-canvas');
    const phoneStage = document.getElementById('phone-stage');
    const annotations = document.getElementById('style-component-annotations');
    const dropTip = document.getElementById('canvas-drop-tip');
    const config = document.getElementById('style-config-content');
    const configType = document.getElementById('style-config-type');
    const supportsSearch = record.type === '电商详情页';
    const supportsMerchantProductFlow = record.type !== '电商详情页';
    let components = (Array.isArray(record.styleComponents) ? record.styleComponents : this.defaultComponents()).filter((component) => (supportsSearch || component.type !== 'search') && (supportsMerchantProductFlow || component.type !== 'merchantProductFlow')).map((component) => {
      if (component.type === 'merchantProductFlow') return { ...component, selectedProductIds: Array.isArray(component.selectedProductIds) ? component.selectedProductIds : [], productCategories: component.productCategories && typeof component.productCategories === 'object' ? component.productCategories : {} };
      if (component.type !== 'resource') return component;
      return { ...component, materials: Array.isArray(component.materials) && component.materials.length ? component.materials : [this.createResourceMaterial()], targeting: this.normalizeResourceTargeting(component.targeting) };
    });
    let draggedType = '';
    let draggedComponentId = '';
    let draggedProductId = '';
    let draggedProductComponentId = '';
    let draggedListProductId = '';
    let activeMaterialIndex = 0;
    let productFilters = { supplier: '', title: '', id: '', status: '', type: '', category: '' };
    let rechargeDetailConfig = record.type === '充值详情页' ? this.normalizeRechargeDetailConfig(record.rechargeDetailConfig) : null;
    const rechargeCategories = rechargeDetailConfig?.categories || [];
    const activeRechargeCategoryByComponent = {};
    const productCategory = (component, productId, fallbackIndex = 0) => {
      const normalizedIndex = fallbackIndex >= 0 ? fallbackIndex : 0;
      return component.productCategories?.[productId] || rechargeCategories[normalizedIndex % rechargeCategories.length] || '未分类';
    };
    const selectComponent = (id) => { this.activeComponentId = id; renderAll(); };
    const addComponent = (type) => {
      if (type === 'search' && !supportsSearch) {
        window.BackofficeLayout.showToast('当前样式类型不支持搜索功能', '仅电商详情页支持添加搜索组件');
        return;
      }
      if (type === 'merchantProductFlow' && !supportsMerchantProductFlow) {
        window.BackofficeLayout.showToast('当前样式类型不支持合作商货品流', '电商详情页不支持添加合作商货品流组件');
        return;
      }
      if (type === 'search' && components.some((component) => component.type === 'search')) {
        window.BackofficeLayout.showToast('搜索功能已添加', '每个详情页模板仅支持一个搜索功能');
        return;
      }
      const component = this.createComponent(type);
      if (type === 'merchantProductFlow') component.selectedProductIds = this.productCatalog(record).filter((item) => item.status === '上线中').map((item) => item.id);
      components.push(component);
      this.activeComponentId = component.id;
      renderAll();
    };
    const removeComponent = (id) => {
      components = components.filter((component) => component.id !== id);
      if (this.activeComponentId === id) this.activeComponentId = components[0]?.id || null;
      renderAll();
    };
    const updateComponent = (id, updates, { refreshConfig = false } = {}) => {
      components = components.map((component) => component.id === id ? { ...component, ...updates } : component);
      renderPreview();
      if (refreshConfig) renderConfig();
    };
    const removeDraggedProduct = () => {
      const productComponent = components.find((item) => item.id === draggedProductComponentId && item.type === 'merchantProductFlow');
      if (productComponent && draggedProductId) {
        updateComponent(productComponent.id, { selectedProductIds: (productComponent.selectedProductIds || []).filter((id) => id !== draggedProductId) }, { refreshConfig: true });
        window.BackofficeLayout.showToast('已移除货品', '已取消该货品的勾选');
      }
      draggedProductId = '';
      draggedProductComponentId = '';
    };
    const removeDraggedComponent = () => {
      const component = components.find((item) => item.id === draggedComponentId);
      if (component) {
        const label = this.componentLabel(component.type);
        removeComponent(component.id);
        window.BackofficeLayout.showToast('已移除组件', `${label}已从页面预览中移除`);
      }
      draggedComponentId = '';
    };
    const reorderSelectedProducts = (componentId, sourceId, targetId) => {
      if (!sourceId || !targetId || sourceId === targetId) return;
      const productComponent = components.find((item) => item.id === componentId && item.type === 'merchantProductFlow');
      if (!productComponent) return;
      const ordered = [...(productComponent.selectedProductIds || [])];
      const from = ordered.indexOf(sourceId);
      const to = ordered.indexOf(targetId);
      if (from === -1 || to === -1) return;
      const [moved] = ordered.splice(from, 1);
      ordered.splice(to, 0, moved);
      updateComponent(productComponent.id, { selectedProductIds: ordered }, { refreshConfig: true });
    };
    const resourceMaterials = (component) => Array.isArray(component.materials) && component.materials.length ? component.materials : [this.createResourceMaterial()];
    const renderAnnotations = () => {
      const phoneFrame = phoneStage.querySelector('.phone-frame');
      if (!phoneFrame) { annotations.innerHTML = ''; return; }
      const stageBox = phoneStage.getBoundingClientRect();
      const frameBox = phoneFrame.getBoundingClientRect();
      const left = Math.min(phoneStage.clientWidth - 92, frameBox.right - stageBox.left + 12);
      annotations.innerHTML = [...canvas.querySelectorAll('[data-style-component-id]')].map((element) => {
        const component = components.find((item) => item.id === element.dataset.styleComponentId);
        if (!component) return '';
        const box = element.getBoundingClientRect();
        const top = Math.max(0, box.top - stageBox.top);
        const height = Math.max(36, box.height);
        const detail = component.type === 'merchantProductFlow' ? `${(component.selectedProductIds || []).length} 件` : '';
        return `<button class="component-annotation" type="button" data-style-component-id="${this.escape(component.id)}" style="top:${top}px;left:${left}px;height:${height}px"><span>${this.escape(this.componentLabel(component.type))}${detail ? `<small>${detail}</small>` : ''}</span></button>`;
      }).join('');
      annotations.querySelectorAll('.component-annotation').forEach((annotation) => annotation.addEventListener('click', () => selectComponent(annotation.dataset.styleComponentId)));
    };
    const renderPreview = () => {
      const activeId = this.activeComponentId;
      const merchantRules = this.renderMerchantRules(record);
      const rechargeFixedPreview = rechargeDetailConfig ? `<section class="preview-recharge-fixed" aria-label="充值详情固定样式"><div class="recharge-phone-entry"><p>请确保账号无误，支付成功后不支持退换</p><label><span>手机号</span><input id="recharge-preview-phone" type="tel" inputmode="numeric" placeholder="请输入手机号" /></label></div></section>` : '';
      const componentPreview = components.map((component, index) => {
        const active = component.id === activeId ? ' is-active' : '';
        const selectedAttr = `data-style-component-id="${this.escape(component.id)}" draggable="true"`;
        if (component.type === 'search') return `<button class="preview-component preview-search${active}" type="button" ${selectedAttr}><span>⌕</span><em>${this.escape(component.placeholder || '搜索商品、品牌或优惠')}</em></button>`;
        if (component.type === 'resource') {
          const materials = resourceMaterials(component);
          const previewMaterials = materials.slice(0, component.layout === '宫格' ? 4 : component.layout === '横幅' ? 1 : 2);
          return `<button class="preview-component preview-resource preview-resource-${component.layout || '拼图'}${active}" type="button" ${selectedAttr}><div class="preview-resource-materials">${previewMaterials.map((material) => `<i>${this.escape(material.imageText || '资源位素材')}</i>`).join('')}</div></button>`;
        }
        if (component.type === 'merchantProductFlow') {
          const productsById = new Map(this.productCatalog(record).map((item) => [item.id, item]));
          const selectedProducts = (component.selectedProductIds || []).map((id) => productsById.get(id)).filter(Boolean);
          if (record.type === '充值详情页') {
            const groups = rechargeCategories.map((label) => ({ label, products: selectedProducts.filter((product, productIndex) => productCategory(component, product.id, (component.selectedProductIds || []).indexOf(product.id)) === label) })).filter((group) => group.products.length);
            const activeCategory = activeRechargeCategoryByComponent[component.id];
            const currentCategory = groups.some((group) => group.label === activeCategory) ? activeCategory : groups[0]?.label || '';
            activeRechargeCategoryByComponent[component.id] = currentCategory;
            const currentGroup = groups.find((group) => group.label === currentCategory);
            return `<section class="preview-component preview-merchant-product-flow is-recharge-flow${active}" ${selectedAttr}><div class="recharge-category-nav" role="tablist">${groups.map((group) => `<button class="recharge-category-tab${group.label === currentCategory ? ' is-active' : ''}" type="button" data-merchant-flow-category="${this.escape(component.id)}::${this.escape(group.label)}" role="tab" aria-selected="${group.label === currentCategory}">${this.escape(group.label)}</button>`).join('')}</div><div class="recharge-horizontal-products">${currentGroup?.products.map((product) => `<article class="recharge-horizontal-card" draggable="true" data-product-order-id="${this.escape(product.id)}"><img src="${this.escape(product.image)}" alt="${this.escape(product.title)}商品图" /><b>${this.escape(product.title)}</b><span>${this.escape(product.brand)}</span><div><em>¥${this.escape(product.salesPrice)}</em><del>¥${this.escape(product.officialPrice)}</del></div></article>`).join('') || '<span class="recharge-products-empty">请在右侧勾选并设置商品分类</span>'}</div></section>`;
          }
          return `<button class="preview-component preview-merchant-product-flow${active}" type="button" ${selectedAttr}><div class="merchant-product-preview-row">${selectedProducts.length ? selectedProducts.map((product) => `<i draggable="true" data-product-order-id="${this.escape(product.id)}"><img src="${this.escape(product.image)}" alt="${this.escape(product.title)}商品图" /><span class="merchant-product-info"><b>${this.escape(product.title)}</b><small><em>¥${this.escape(product.salesPrice)}</em><del>¥${this.escape(product.officialPrice)}</del></small></span><span class="merchant-order-button">去下单</span><u aria-hidden="true">⠿</u></i>`).join('') : '<em class="merchant-product-empty">请在右侧勾选货品</em>'}</div></button>`;
        }
        return `<button class="preview-component preview-product-flow${active}" type="button" ${selectedAttr}><div class="preview-product-row"><i>商品</i><i>商品</i><i>商品</i></div></button>`;
      }).join('');
      const rechargeAction = rechargeDetailConfig ? `<div class="recharge-fixed-action"><button type="button">${this.escape(rechargeDetailConfig.actionText || '优惠充值')}</button></div>` : '';
      canvas.innerHTML = componentPreview || rechargeFixedPreview || merchantRules ? `${rechargeFixedPreview}${componentPreview}${rechargeAction}${merchantRules}` : '<div class="canvas-empty"><b>+</b><span>拖入功能组件开始搭建</span></div>';
      dropTip.hidden = components.length > 0 || Boolean(rechargeFixedPreview);
      canvas.querySelectorAll('[data-merchant-flow-category]').forEach((tab) => tab.addEventListener('click', (event) => {
        event.stopPropagation();
        const [componentId, category] = tab.dataset.merchantFlowCategory.split('::');
        activeRechargeCategoryByComponent[componentId] = category;
        renderPreview();
      }));
      canvas.querySelectorAll('[data-style-component-id]').forEach((element) => {
        element.addEventListener('click', () => selectComponent(element.dataset.styleComponentId));
        element.addEventListener('dragstart', (event) => { draggedComponentId = element.dataset.styleComponentId; event.dataTransfer.effectAllowed = 'move'; });
        element.addEventListener('dragend', () => {
          const componentId = element.dataset.styleComponentId;
          window.setTimeout(() => { if (draggedComponentId === componentId) draggedComponentId = ''; }, 0);
        });
      });
      canvas.querySelectorAll('[data-product-order-id]').forEach((product) => {
        product.addEventListener('dragstart', (event) => { event.stopPropagation(); draggedProductId = product.dataset.productOrderId; draggedProductComponentId = product.closest('[data-style-component-id]')?.dataset.styleComponentId || ''; event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', draggedProductId); });
        product.addEventListener('dragend', (event) => {
          event.stopPropagation();
          const productId = product.dataset.productOrderId;
          window.setTimeout(() => {
            if (draggedProductId === productId) {
              draggedProductId = '';
              draggedProductComponentId = '';
            }
          }, 0);
        });
      });
      window.requestAnimationFrame(renderAnnotations);
    };
    const renderConfig = () => {
      const component = components.find((item) => item.id === this.activeComponentId);
      configType.textContent = component ? this.componentLabel(component.type) : (rechargeDetailConfig ? '固定样式' : '未选择组件');
      if (!component) {
        if (!rechargeDetailConfig) { config.innerHTML = '<div class="style-config-empty">从左侧拖入组件，或点击预览中的组件进行配置</div>'; return; }
        config.innerHTML = `<div class="style-config-form recharge-fixed-config"><div class="fixed-config-note"><b>充值详情固定样式</b><span>手机号与固定按钮在预览中固定展示；合作商货品流可在页面预览区域调整。</span></div><label>固定按钮文案<input class="control" id="recharge-fixed-action-text" value="${this.escape(rechargeDetailConfig.actionText || '')}" placeholder="优惠充值" /></label><p>选填，未填写时默认展示“优惠充值”。</p></div>`;
        document.getElementById('recharge-fixed-action-text').addEventListener('input', (event) => {
          rechargeDetailConfig = { ...rechargeDetailConfig, actionText: event.target.value };
          renderPreview();
        });
        return;
      }
      const remove = `<button class="text-button style-remove" id="remove-style-component" type="button">移除组件</button>`;
      if (component.type === 'search') {
        config.innerHTML = `<div class="style-config-form"><label>搜索-模板底纹词<input class="control" id="style-search-placeholder" value="${this.escape(component.placeholder || '')}" placeholder="请输入搜索-模板底纹词" /></label>${remove}</div>`;
        document.getElementById('style-search-placeholder').addEventListener('input', (event) => updateComponent(component.id, { placeholder: event.target.value }));
      } else if (component.type === 'resource') {
        const materials = resourceMaterials(component);
        const targeting = this.normalizeResourceTargeting(component.targeting);
        if (activeMaterialIndex >= materials.length) activeMaterialIndex = 0;
        const material = materials[activeMaterialIndex];
        const identityOptions = ['经期', '怀孕', '备孕', '辣妈', '亲友', '仅注册MS用户'];
        const platformRow = (key, label) => `<div class="resource-version-row"><label><input type="checkbox" data-resource-platform="${key}" ${targeting.platformVersions[key].enabled ? 'checked' : ''} />${label}</label><input class="control" data-resource-version="${key}:start" value="${this.escape(targeting.platformVersions[key].start)}" placeholder="起始版本" /><input class="control" data-resource-version="${key}:end" value="${this.escape(targeting.platformVersions[key].end)}" placeholder="结束版本" /></div>`;
        config.innerHTML = `<div class="style-config-form resource-config-form"><label class="required">资源位名称<input class="control" id="style-resource-name" value="${this.escape(component.name || '')}" placeholder="请输入资源位名称" /></label><label>资源位类型<select class="control" id="style-resource-layout"><option value="拼图" ${component.layout === '拼图' ? 'selected' : ''}>拼图</option><option value="横幅" ${component.layout === '横幅' ? 'selected' : ''}>横幅</option><option value="宫格" ${component.layout === '宫格' ? 'selected' : ''}>宫格</option></select></label><div class="resource-config-heading"><span>素材配置</span><button class="icon-add-material" id="add-resource-material" type="button" title="添加素材">+</button></div><div class="resource-material-tabs">${materials.map((item, index) => `<button class="resource-material-tab${index === activeMaterialIndex ? ' is-active' : ''}" type="button" data-resource-material-index="${index}">素材 ${index + 1}${index === activeMaterialIndex ? '<b>已选</b>' : ''}</button>`).join('')}</div><div class="resource-material-editor"><div class="resource-material-preview"><div><span>${this.escape(material.imageText || '资源位素材')}</span><small>预览素材 ${activeMaterialIndex + 1}</small></div><button id="change-resource-material" type="button">${material.imageText === '资源位素材' ? '上传图片' : '更换图片'}</button></div><p class="resource-route-note">路由协议填写示例</p><label>跳转类型<select class="control" id="style-resource-link-type"><option value="淘宝活动" ${material.linkType === '淘宝活动' ? 'selected' : ''}>淘宝活动</option><option value="站内页面" ${material.linkType === '站内页面' ? 'selected' : ''}>站内页面</option><option value="外部链接" ${material.linkType === '外部链接' ? 'selected' : ''}>外部链接</option></select></label><label>跳转链接<input class="control" id="style-resource-link" value="${this.escape(material.link || '')}" placeholder="请输入跳转链接" /></label><label>PID<input class="control" id="style-resource-pid" value="${this.escape(material.pid || '')}" placeholder="请输入 pid" /></label><label>skip_type<input class="control" id="style-resource-skip-type" value="${this.escape(material.skipType || '')}" placeholder="用于埋点上报" /></label><label>商城 ID<input class="control" id="style-resource-mall-id" value="${this.escape(material.mallId || '')}" placeholder="请输入商城 id" /></label><label>素材名称<input class="control" id="style-resource-material-name" value="${this.escape(material.name || '')}" placeholder="请输入素材名称" /></label><div class="resource-inline-fields"><label>弹窗 logo<input class="control" id="style-resource-popup-logo" value="${this.escape(material.popupLogo || '')}" placeholder="选填" /></label><label>弹窗文案<input class="control" id="style-resource-popup-copy" value="${this.escape(material.popupCopy || '')}" placeholder="选填" /></label></div></div><details class="resource-advanced-section" open><summary>定向信息</summary><div class="resource-advanced-body"><div class="resource-identity-options">${identityOptions.map((item) => `<label><input type="checkbox" value="${item}" data-resource-identity="${item}" ${targeting.identities.includes(item) ? 'checked' : ''} />${item}</label>`).join('')}</div><label>指定人群包<input class="control" id="resource-target-group" value="${this.escape(targeting.targetGroup)}" placeholder="填入表名，不填默认全部用户" /></label><label>排除人群包<input class="control" id="resource-exclude-group" value="${this.escape(targeting.excludeGroup)}" placeholder="填入表名，不填默认为空" /></label><div class="resource-audience-field"><span>定制人群</span><div class="audience-options">${this.renderAudienceOptions(targeting.audiences)}</div></div><div class="resource-radio-field"><span>是否定制人群取反</span><label><input type="radio" name="resource-audience-inversion" value="否" ${targeting.audienceInversion === '否' ? 'checked' : ''} />否</label><label><input type="radio" name="resource-audience-inversion" value="是" ${targeting.audienceInversion === '是' ? 'checked' : ''} />是</label><p>选择定制人群后，取反表示圈定人群以外的用户。</p></div><label>指定实验可见<input class="control" id="resource-experiment-id" value="${this.escape(targeting.experimentId)}" placeholder="如：1338-3550,1339-3510" /></label><label>排除实验<input class="control" id="resource-exclude-experiment" value="${this.escape(targeting.excludeExperiment)}" placeholder="如：1338-3550,1339-3510" /></label><div class="resource-platform-field"><span>平台和版本</span>${platformRow('ios', 'iOS')}${platformRow('android', 'Android')}${platformRow('harmony', 'Harmony')}</div><div class="resource-datetime-row"><label>上线开始<input class="control" id="resource-online-start" type="datetime-local" value="${this.escape(targeting.onlineStart)}" /></label><label>上线结束<input class="control" id="resource-online-end" type="datetime-local" value="${this.escape(targeting.onlineEnd)}" /></label></div></div></details><details class="resource-advanced-section"><summary>测试计划</summary><div class="resource-advanced-body"><p class="resource-test-note">测试 UID 内的用户将在测试有效时间内看到此资源位配置，到期自动终止。</p><label>测试 UID<input class="control" id="resource-test-uids" value="${this.escape(targeting.testPlan.uids)}" placeholder="多个 UID 用英文逗号分隔" /></label><div class="resource-datetime-row"><label>测试开始<input class="control" id="resource-test-start" type="datetime-local" value="${this.escape(targeting.testPlan.start)}" /></label><label>测试结束<input class="control" id="resource-test-end" type="datetime-local" value="${this.escape(targeting.testPlan.end)}" /></label></div><label class="resource-test-switch"><input type="checkbox" id="resource-test-enabled" ${targeting.testPlan.enabled ? 'checked' : ''} /><span class="switch-track"></span><b>${targeting.testPlan.enabled ? '生效' : '未生效'}</b></label></div></details>${remove}</div>`;
        document.getElementById('style-resource-name').addEventListener('input', (event) => updateComponent(component.id, { name: event.target.value }));
        document.getElementById('style-resource-layout').addEventListener('input', (event) => updateComponent(component.id, { layout: event.target.value }));
        const updateMaterial = (key, value, refreshConfig = false) => {
          const nextMaterials = resourceMaterials(component).map((item, index) => index === activeMaterialIndex ? { ...item, [key]: value } : item);
          updateComponent(component.id, { materials: nextMaterials }, { refreshConfig });
        };
        [['style-resource-link-type', 'linkType'], ['style-resource-link', 'link'], ['style-resource-pid', 'pid'], ['style-resource-skip-type', 'skipType'], ['style-resource-mall-id', 'mallId'], ['style-resource-material-name', 'name'], ['style-resource-popup-logo', 'popupLogo'], ['style-resource-popup-copy', 'popupCopy']].forEach(([id, key]) => document.getElementById(id).addEventListener('input', (event) => updateMaterial(key, event.target.value)));
        document.querySelectorAll('[data-resource-material-index]').forEach((tab) => tab.addEventListener('click', () => { activeMaterialIndex = Number(tab.dataset.resourceMaterialIndex); renderConfig(); }));
        document.getElementById('add-resource-material').addEventListener('click', () => { activeMaterialIndex = materials.length; updateComponent(component.id, { materials: [...materials, this.createResourceMaterial()] }, { refreshConfig: true }); });
        document.getElementById('change-resource-material').addEventListener('click', () => updateMaterial('imageText', material.imageText === '资源位素材' ? '已配置素材' : '资源位素材', true));
        const updateTargeting = (updates, refreshConfig = false) => updateComponent(component.id, { targeting: { ...targeting, ...updates } }, { refreshConfig });
        const checked = (selector) => [...config.querySelectorAll(selector)].filter((input) => input.checked).map((input) => input.value);
        config.querySelectorAll('[data-resource-identity]').forEach((input) => input.addEventListener('change', () => updateTargeting({ identities: checked('[data-resource-identity]') })));
        [['resource-target-group', 'targetGroup'], ['resource-exclude-group', 'excludeGroup'], ['resource-experiment-id', 'experimentId'], ['resource-exclude-experiment', 'excludeExperiment'], ['resource-online-start', 'onlineStart'], ['resource-online-end', 'onlineEnd']].forEach(([id, key]) => document.getElementById(id).addEventListener('input', (event) => updateTargeting({ [key]: event.target.value })));
        config.querySelectorAll('[data-resource-audience]').forEach((input) => input.addEventListener('change', () => updateTargeting({ audiences: checked('[data-resource-audience]') })));
        config.querySelectorAll('input[name="resource-audience-inversion"]').forEach((input) => input.addEventListener('change', () => updateTargeting({ audienceInversion: input.value })));
        config.querySelectorAll('[data-resource-platform]').forEach((input) => input.addEventListener('change', () => updateTargeting({ platformVersions: { ...targeting.platformVersions, [input.dataset.resourcePlatform]: { ...targeting.platformVersions[input.dataset.resourcePlatform], enabled: input.checked } } })));
        config.querySelectorAll('[data-resource-version]').forEach((input) => input.addEventListener('input', () => { const [platform, edge] = input.dataset.resourceVersion.split(':'); updateTargeting({ platformVersions: { ...targeting.platformVersions, [platform]: { ...targeting.platformVersions[platform], [edge]: input.value } } }); }));
        [['resource-test-uids', 'uids'], ['resource-test-start', 'start'], ['resource-test-end', 'end']].forEach(([id, key]) => document.getElementById(id).addEventListener('input', (event) => updateTargeting({ testPlan: { ...targeting.testPlan, [key]: event.target.value } })));
        document.getElementById('resource-test-enabled').addEventListener('change', (event) => updateTargeting({ testPlan: { ...targeting.testPlan, enabled: event.target.checked } }, true));
      } else if (component.type === 'merchantProductFlow') {
        const allProducts = this.productCatalog(record);
        const allowedProductType = this.allowedProductType(record);
        const supplierOptions = this.merchantsForTemplate(record);
        const categoryOptions = rechargeCategories;
        const categoryFor = (item) => productCategory(component, item.id, (component.selectedProductIds || []).indexOf(item.id));
        const filteredProducts = allProducts.filter((item) => (!productFilters.supplier || item.supplierId === productFilters.supplier) && (!productFilters.title || item.title.includes(productFilters.title.trim())) && (!productFilters.id || item.productNo.includes(productFilters.id.trim())) && (!productFilters.status || item.status === productFilters.status) && (!productFilters.type || item.type === productFilters.type) && (!productFilters.category || categoryFor(item) === productFilters.category));
        const selectedIds = new Set(component.selectedProductIds || []);
        const filteredProductIds = new Set(filteredProducts.map((item) => item.id));
        const orderedProducts = [
          ...(component.selectedProductIds || []).map((id) => allProducts.find((item) => item.id === id)).filter((item) => item && filteredProductIds.has(item.id)),
          ...filteredProducts.filter((item) => !selectedIds.has(item.id))
        ];
        const everyVisibleSelected = filteredProducts.length > 0 && filteredProducts.every((item) => selectedIds.has(item.id));
        const productCell = (value, className = '') => `<span class="product-cell-value ${className}" title="${this.escape(String(value || ''))}">${this.escape(String(value || ''))}</span>`;
        const productTypeFilter = allowedProductType
          ? `<label>商品类型<select class="control" id="product-filter-type" disabled><option value="${this.escape(allowedProductType)}">${this.escape(allowedProductType)}</option></select></label>`
          : `<label>商品类型<select class="control" id="product-filter-type"><option value="">全部</option><option value="直充" ${productFilters.type === '直充' ? 'selected' : ''}>直充</option><option value="卡券" ${productFilters.type === '卡券' ? 'selected' : ''}>卡券</option></select></label>`;
        const categoryFilter = record.type === '充值详情页' ? `<label>商品分类<select class="control" id="product-filter-category"><option value="">全部</option>${categoryOptions.map((category) => `<option value="${this.escape(category)}" ${productFilters.category === category ? 'selected' : ''}>${this.escape(category)}</option>`).join('')}</select></label>` : '';
        const categoryHeader = record.type === '充值详情页' ? '<th>商品分类</th>' : '';
        const categoryCell = (item, selected) => record.type === '充值详情页' ? `<td>${selected ? `<select class="product-category-select" data-product-category-id="${this.escape(item.id)}">${categoryOptions.map((category) => `<option value="${this.escape(category)}" ${categoryFor(item) === category ? 'selected' : ''}>${this.escape(category)}</option>`).join('')}</select>` : productCell(categoryFor(item))}</td>` : '';
        const columnCount = record.type === '充值详情页' ? 11 : 10;
        config.innerHTML = `<div class="style-config-form merchant-product-config"><label>货品流名称<input class="control" id="style-merchant-flow-title" value="${this.escape(component.title || '')}" placeholder="请输入货品流名称" /></label><div class="product-filter-grid"><label>合作商<select class="control" id="product-filter-supplier"><option value="">全部</option>${supplierOptions.map((merchant) => `<option value="${this.escape(merchant.id)}" ${productFilters.supplier === merchant.id ? 'selected' : ''}>${this.escape(merchant.name)}</option>`).join('')}</select></label><label>商品标题<input class="control" id="product-filter-title" value="${this.escape(productFilters.title)}" placeholder="请输入商品标题" /></label><label>商品编号<input class="control" id="product-filter-id" value="${this.escape(productFilters.id)}" placeholder="请输入商品编号" /></label><label>状态<select class="control" id="product-filter-status"><option value="">全部</option><option value="上线中" ${productFilters.status === '上线中' ? 'selected' : ''}>上线中</option><option value="已下线" ${productFilters.status === '已下线' ? 'selected' : ''}>已下线</option></select></label>${productTypeFilter}${categoryFilter}</div><div class="product-config-summary"><span>展示当前合作商列表对应的货品，已选行可拖动排序</span><b>已选 ${selectedIds.size} 件</b></div><div class="product-picker-table-wrap"><table class="product-picker-table"><thead><tr><th><input id="select-all-products" type="checkbox" ${everyVisibleSelected ? 'checked' : ''} aria-label="全选当前货品" /></th><th aria-label="排序"></th><th>货品编号</th><th>货品标题</th><th>合作商</th><th>品牌名称</th><th>类型</th>${categoryHeader}<th>成本价</th><th>官方价</th><th>状态</th></tr></thead><tbody>${orderedProducts.length ? orderedProducts.map((item) => { const selected = selectedIds.has(item.id); return `<tr class="${selected ? 'is-selected-product' : ''}" ${selected ? `draggable="true" data-list-product-id="${this.escape(item.id)}"` : ''}><td><input type="checkbox" data-product-id="${item.id}" ${selected ? 'checked' : ''} aria-label="选择${this.escape(item.title)}" /></td><td><span class="product-row-drag" aria-hidden="true">⠿</span></td><td>${productCell(item.productNo)}</td><td>${productCell(item.title)}</td><td>${productCell(item.supplier)}</td><td>${productCell(item.brand)}</td><td>${productCell(item.type)}</td>${categoryCell(item, selected)}<td>${productCell(item.cost)}</td><td>${productCell(item.price)}</td><td>${productCell(item.status, item.status === '上线中' ? 'product-online' : '')}</td></tr>`; }).join('') : `<tr><td colspan="${columnCount}" class="product-picker-empty">当前合作商暂无可选货品</td></tr>`}</tbody></table></div>${remove}</div>`;
        document.getElementById('style-merchant-flow-title').addEventListener('input', (event) => updateComponent(component.id, { title: event.target.value }));
        [['product-filter-supplier', 'supplier'], ['product-filter-title', 'title'], ['product-filter-id', 'id'], ['product-filter-status', 'status'], ['product-filter-type', 'type'], ['product-filter-category', 'category']].forEach(([id, key]) => {
          const filter = document.getElementById(id);
          if (!filter) return;
          let isComposing = false;
          const refreshFilter = (event) => {
            if (isComposing || event.isComposing) return;
            const cursor = typeof event.target.selectionStart === 'number' ? event.target.selectionStart : null;
            productFilters[key] = event.target.value;
            renderConfig();
            if (cursor !== null) {
              const nextFilter = document.getElementById(id);
              nextFilter.focus();
              nextFilter.setSelectionRange(cursor, cursor);
            }
          };
          if (filter.tagName === 'SELECT') {
            filter.addEventListener('change', refreshFilter);
          } else {
            filter.addEventListener('compositionstart', () => { isComposing = true; });
            filter.addEventListener('compositionend', (event) => { isComposing = false; refreshFilter(event); });
            filter.addEventListener('input', refreshFilter);
          }
        });
        const updateSelectedProducts = (id, checked) => { const next = new Set(component.selectedProductIds || []); checked ? next.add(id) : next.delete(id); updateComponent(component.id, { selectedProductIds: [...next] }, { refreshConfig: true }); };
        document.querySelectorAll('[data-product-id]').forEach((input) => input.addEventListener('change', () => updateSelectedProducts(input.dataset.productId, input.checked)));
        config.querySelectorAll('[data-product-category-id]').forEach((select) => select.addEventListener('change', () => updateComponent(component.id, { productCategories: { ...component.productCategories, [select.dataset.productCategoryId]: select.value } }, { refreshConfig: true })));
        document.getElementById('select-all-products').addEventListener('change', (event) => { const next = new Set(component.selectedProductIds || []); filteredProducts.forEach((item) => event.target.checked ? next.add(item.id) : next.delete(item.id)); updateComponent(component.id, { selectedProductIds: [...next] }, { refreshConfig: true }); });
        config.querySelectorAll('[data-list-product-id]').forEach((row) => {
          row.addEventListener('dragstart', (event) => { draggedListProductId = row.dataset.listProductId; event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', draggedListProductId); });
          row.addEventListener('dragend', () => { draggedListProductId = ''; config.querySelectorAll('.is-product-dragover').forEach((item) => item.classList.remove('is-product-dragover')); });
          row.addEventListener('dragover', (event) => { if (!draggedListProductId || row.dataset.listProductId === draggedListProductId) return; event.preventDefault(); row.classList.add('is-product-dragover'); });
          row.addEventListener('dragleave', () => row.classList.remove('is-product-dragover'));
          row.addEventListener('drop', (event) => { if (!draggedListProductId || row.dataset.listProductId === draggedListProductId) return; event.preventDefault(); event.stopPropagation(); reorderSelectedProducts(component.id, draggedListProductId, row.dataset.listProductId); draggedListProductId = ''; });
        });
      } else {
        config.innerHTML = `<div class="style-config-form"><label>信息流-记录名称<div class="control-with-tooltip"><input class="control" id="style-flow-title" value="${this.escape(component.title || '')}" placeholder="请输入信息流-记录名称" /><button class="help-tooltip" type="button" data-tooltip="仅后台可见" aria-label="信息流-记录名称说明">?</button></div></label><label>选择应用库<select class="control" id="style-flow-library"><option value="">请选择应用库</option><option value="活动商品库" ${component.library === '活动商品库' ? 'selected' : ''}>活动商品库（占位）</option><option value="精选商品库" ${component.library === '精选商品库' ? 'selected' : ''}>精选商品库（占位）</option><option value="高佣商品库" ${component.library === '高佣商品库' ? 'selected' : ''}>高佣商品库（占位）</option></select></label><div class="style-divider"><span>或直接填写</span></div><label>应用库 ID<input class="control" id="style-flow-library-id" value="${this.escape(component.libraryId || '')}" placeholder="请输入应用库 ID" /></label><label>应用库名称<input class="control" id="style-flow-library-name" value="${this.escape(component.libraryName || '')}" placeholder="请输入应用库名称" /></label>${remove}</div>`;
        [['style-flow-title', 'title'], ['style-flow-library', 'library'], ['style-flow-library-id', 'libraryId'], ['style-flow-library-name', 'libraryName']].forEach(([id, key]) => document.getElementById(id).addEventListener('input', (event) => updateComponent(component.id, { [key]: event.target.value })));
      }
      document.getElementById('remove-style-component').addEventListener('click', () => removeComponent(component.id));
    };
    const renderAll = () => { renderPreview(); renderConfig(); };
    document.getElementById('edit-recharge-fixed-style')?.addEventListener('click', () => { this.activeComponentId = null; renderConfig(); });
    builder.querySelectorAll('[data-component-type]').forEach((tool) => {
      tool.addEventListener('dragstart', (event) => { draggedType = tool.dataset.componentType; event.dataTransfer.effectAllowed = 'copy'; });
      tool.addEventListener('dragend', () => { draggedType = ''; });
      tool.addEventListener('click', () => addComponent(tool.dataset.componentType));
    });
    canvas.addEventListener('dragover', (event) => { event.preventDefault(); canvas.classList.add('is-dragover'); });
    canvas.addEventListener('dragleave', () => canvas.classList.remove('is-dragover'));
    canvas.addEventListener('drop', (event) => {
      event.preventDefault(); event.stopPropagation(); canvas.classList.remove('is-dragover');
      if (draggedProductId) {
        const target = event.target.closest('[data-product-order-id]');
        const productComponent = components.find((item) => item.id === draggedProductComponentId && item.type === 'merchantProductFlow');
        if (productComponent && target && target.dataset.productOrderId !== draggedProductId) {
          const ordered = [...(productComponent.selectedProductIds || [])];
          const from = ordered.indexOf(draggedProductId); const to = ordered.indexOf(target.dataset.productOrderId);
          if (from !== -1 && to !== -1) { const [moved] = ordered.splice(from, 1); ordered.splice(to, 0, moved); updateComponent(productComponent.id, { selectedProductIds: ordered }, { refreshConfig: true }); }
        } else if (!target) {
          removeDraggedProduct();
          return;
        }
        draggedProductId = '';
        draggedProductComponentId = '';
        return;
      }
      if (draggedType) addComponent(draggedType);
      if (draggedComponentId) {
        const target = event.target.closest('[data-style-component-id]');
        if (target && target.dataset.styleComponentId !== draggedComponentId) {
          const from = components.findIndex((item) => item.id === draggedComponentId); const to = components.findIndex((item) => item.id === target.dataset.styleComponentId);
          const [moved] = components.splice(from, 1); components.splice(to, 0, moved); renderAll();
        }
        draggedComponentId = '';
      }
    });
    phoneStage.addEventListener('dragover', (event) => { if (draggedProductId || draggedComponentId) event.preventDefault(); });
    phoneStage.addEventListener('drop', (event) => {
      if (canvas.contains(event.target)) return;
      event.preventDefault();
      if (draggedProductId) removeDraggedProduct();
      else if (draggedComponentId) removeDraggedComponent();
    });
    document.addEventListener('dragover', (event) => {
      if ((draggedProductId || draggedComponentId) && !phoneStage.contains(event.target)) event.preventDefault();
    });
    document.addEventListener('drop', (event) => {
      if ((!draggedProductId && !draggedComponentId) || phoneStage.contains(event.target)) return;
      event.preventDefault();
      if (draggedProductId) removeDraggedProduct();
      else removeDraggedComponent();
    });
    document.getElementById('cancel-detail-template-style-page').addEventListener('click', back);
    document.getElementById('save-detail-template-style-page').addEventListener('click', () => {
      const updatedAt = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
      window.localStorage.setItem(this.storageKey, JSON.stringify(records.map((item) => item.id === recordId ? { ...item, styleComponents: components, ...(rechargeDetailConfig ? { rechargeDetailConfig } : {}), updatedAt } : item)));
      window.BackofficeLayout.showToast('保存成功', '模板样式配置已更新');
      window.setTimeout(back, 350);
    });
    window.addEventListener('resize', renderAnnotations);
    renderAll();
  }
};
