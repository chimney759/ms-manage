window.FeedManagementPage = {
  storageKey: 'meiyou-cashback-feed-management',
  clone(value) {
    return JSON.parse(JSON.stringify(value));
  },
  createMosaicConfig(data = {}) {
    const defaults = {
      image: '',
      darkImage: '',
      routeType: '',
      routeProtocol: '',
      pid: '',
      selectedPid: '',
      skipType: '',
      mallId: '',
      popupLogo: '',
      popupCopy: '',
      requiresLogin: true,
      ...data
    };
    const legacyPosition = {
      id: `feed-mosaic-position-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      image: defaults.image,
      darkImage: defaults.darkImage,
      routeType: defaults.routeType,
      routeProtocol: defaults.routeProtocol,
      pid: defaults.pid,
      selectedPid: defaults.selectedPid,
      skipType: defaults.skipType,
      mallId: defaults.mallId,
      popupLogo: defaults.popupLogo,
      popupCopy: defaults.popupCopy,
      requiresLogin: defaults.requiresLogin
    };
    const positions = Array.isArray(data.positions) && data.positions.length ? data.positions.map((position) => ({ ...legacyPosition, ...position, id: position.id || `feed-mosaic-position-${Date.now()}-${Math.random().toString(16).slice(2)}` })) : [legacyPosition];
    return { ...defaults, positions, selectedPositionId: positions.some((position) => position.id === data.selectedPositionId) ? data.selectedPositionId : positions[0].id };
  },
  createRedPacketConfig(data = {}) {
    return {
      name: '', deliveryType: 'single', titleArea: false, title: '', subtitle: '', titleImage: '', titleDarkImage: '', unclaimedImage: '', unclaimedDarkImage: '', template: 'with-button',
      targeting: window.ConfigurationSections.createTargeting(), testPlan: window.ConfigurationSections.createTestPlan(),
      ...data,
      targeting: window.ConfigurationSections.normalizeTargeting(data.targeting),
      testPlan: window.ConfigurationSections.normalizeTestPlan(data.testPlan)
    };
  },
  createProductFeedConfig(data = {}) {
    return {
      source: 'app-library',
      dataKey: '',
      pid: '',
      ...data
    };
  },
  createTab(data = {}) {
    return {
      id: data.id || `feed-tab-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      tabName: '',
      recordName: '',
      status: '待上线',
      resourceStatus: '待上线',
      iconImage: '',
      cornerImage: '',
      tailImage: '',
      components: [],
      isSaved: false,
      hasBeenSaved: false,
      productFeed: this.createProductFeedConfig(),
      targeting: window.ConfigurationSections.createTargeting(),
      testPlan: window.ConfigurationSections.createTestPlan(),
      ...data,
      components: Array.isArray(data.components) ? data.components.map((component) => ({ ...component, assets: Array.isArray(component.assets) ? component.assets : (component.slots || []).map(() => ''), mosaic: component.type === 'mosaic' ? this.createMosaicConfig(component.mosaic) : component.mosaic, redPacket: component.type === 'red-packet-delivery' ? this.createRedPacketConfig(component.redPacket) : component.redPacket, targeting: component.type === 'mosaic' ? window.ConfigurationSections.normalizeTargeting(component.targeting) : component.targeting, testPlan: component.type === 'mosaic' ? window.ConfigurationSections.normalizeTestPlan(component.testPlan) : component.testPlan, isSaved: component.isSaved ?? true, hasBeenSaved: component.hasBeenSaved ?? true })) : [],
      isSaved: Boolean(data.isSaved),
      hasBeenSaved: data.hasBeenSaved ?? Boolean(data.id || data.isSaved),
      productFeed: this.createProductFeedConfig(data.productFeed),
      targeting: window.ConfigurationSections.normalizeTargeting(data.targeting),
      testPlan: window.ConfigurationSections.normalizeTestPlan(data.testPlan)
    };
  },
  createFeedComponent(type) {
    const definitions = {
      mosaic: { label: '信息流-拼图', slots: ['福利活动主会场', '限时好礼'] },
      grid: { label: '信息流-宫格', slots: ['新人福利', '每日好券', '省钱任务', '精选权益'] },
      'red-packet': { label: '信息流-红包', slots: ['福利红包'] },
      'red-packet-delivery': { label: '信息流-红包发放功能', slots: ['福利红包'] },
      'native-slider': { label: '信息流-原生滑块', slots: ['精选返现', '限时好价', '热销推荐'] }
    };
    const definition = definitions[type] || definitions.mosaic;
    return { id: `feed-component-${Date.now()}-${Math.random().toString(16).slice(2)}`, type, recordName: definition.label, assets: definition.slots.map(() => ''), mosaic: type === 'mosaic' ? this.createMosaicConfig() : undefined, redPacket: type === 'red-packet-delivery' ? this.createRedPacketConfig({ name: definition.label }) : undefined, targeting: type === 'mosaic' ? window.ConfigurationSections.createTargeting() : undefined, testPlan: type === 'mosaic' ? window.ConfigurationSections.createTestPlan() : undefined, isSaved: false, hasBeenSaved: false, ...definition };
  },
  createDefaultState() {
    const tabs = [
      this.createTab({ id: 'feed-live', tabName: '直播间返现', recordName: '直播间返现', status: '上线中', resourceStatus: '上线中', isSaved: true }),
      this.createTab({ id: 'feed-jd', tabName: '京东购物车', recordName: '京东购物车（896）', status: '上线中', resourceStatus: '上线中', isSaved: true }),
      this.createTab({ id: 'feed-takeout', tabName: '外卖返现', recordName: '外卖返现', status: '待上线', resourceStatus: '待上线', isSaved: true }),
      this.createTab({ id: 'feed-redpacket', tabName: '红包', recordName: '红包', status: '已下线', resourceStatus: '已下线', isSaved: true })
    ];
    return { tabs, activeTabId: 'feed-jd' };
  },
  loadState(storageKey = this.storageKey) {
    const fallback = this.createDefaultState();
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey));
      if (!saved || !Array.isArray(saved.tabs)) return fallback;
      const tabs = saved.tabs.map((tab) => this.createTab({ ...tab, isSaved: tab.isSaved ?? true, hasBeenSaved: tab.hasBeenSaved ?? true }));
      return { tabs: tabs.length ? tabs : fallback.tabs, activeTabId: tabs.some((tab) => tab.id === saved.activeTabId) ? saved.activeTabId : tabs[0]?.id };
    } catch (error) {
      return fallback;
    }
  },
  saveState(state, storageKey = this.storageKey) {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  },
  render() {
    return `<section class="content feed-management-page"><div class="page-heading"><div><h1>首页-信息流营销</h1><span class="heading-note">维护首页信息流 Tab、资源位状态及展示配置</span></div><div class="feed-page-actions" id="feed-page-actions"></div></div><section class="panel feed-filter-panel"><div class="feed-status-filter"><strong>Tab状态：</strong><div class="feed-filter-options" data-feed-filter="status"><label><input type="checkbox" value="上线中" checked />上线中</label><label><input type="checkbox" value="待上线" checked />待上线</label><label><input type="checkbox" value="已下线" checked />已下线</label></div></div><div class="feed-status-filter"><strong>资源位状态：</strong><div class="feed-filter-options" data-feed-filter="resourceStatus"><label><input type="checkbox" value="上线中" checked />上线中</label><label><input type="checkbox" value="待上线" checked />待上线</label><label><input type="checkbox" value="已下线" checked />已下线</label></div></div></section><section class="panel feed-tab-management"><div class="feed-tab-nav" id="feed-tab-nav" role="tablist" aria-label="首页信息流 Tab"></div><div class="feed-tab-workspace" id="feed-tab-workspace"></div></section></section>`;
  },
  renderEmbedded() {
    return `<section class="home-marketing-builder feed-marketing-builder" id="feed-marketing-builder"><aside class="home-marketing-tools feed-marketing-tools"><h2>组件</h2><p id="feed-component-tools-note">保存当前 Tab 后可拖入信息流组件</p><div class="home-tool-list"><button class="home-tool" type="button" draggable="true" data-feed-component-add="mosaic"><b>◫</b><span>信息流-拼图</span><small>活动素材组合展示</small></button><button class="home-tool" type="button" draggable="true" data-feed-component-add="red-packet-delivery"><b>￥</b><span>信息流-红包发放功能</span><small>红包权益发放展示</small></button><button class="home-tool" type="button" draggable="true" data-feed-component-add="native-slider"><b>↔</b><span>信息流-原生滑块</span><small>横向内容滑动展示</small></button></div></aside><section class="home-marketing-preview feed-marketing-preview"><div class="style-panel-heading"><h2>页面预览</h2><span>当前 Tab 资源位</span></div><div class="feed-embedded-filter-bar" id="feed-embedded-filters"></div><div class="feed-embedded-preview" id="feed-embedded-preview"></div></section><aside class="home-marketing-settings feed-marketing-settings"><div class="style-panel-heading"><h2>配置</h2><span id="feed-embedded-config-type">未选择 Tab</span></div><div class="home-config-content" id="feed-embedded-config-content"></div><div class="home-config-actions"><button class="button secondary home-remove-component-action" id="remove-feed-component" type="button" hidden>移除组件</button><span class="home-component-save-tooltip" data-tooltip="点击编辑当前选中的 Tab 或组件。"><button class="button primary is-edit-action" id="save-feed-tab" type="button">编辑</button></span></div></aside></section>`;
  },
  renderEmbeddedComponent(component, selectedComponentId = '') {
    const slots = component.slots || [];
    const activeClass = component.id === selectedComponentId ? ' is-active' : '';
    const unsavedClass = component.isSaved ? '' : ' is-unsaved';
    if (component.type === 'mosaic') {
      const mosaic = this.createMosaicConfig(component.mosaic);
      const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0];
      const mosaicImage = position.image ? `<img class="feed-preview-mosaic-image" src="${position.image}" alt="拼图素材预览" />` : '';
      return `<button class="feed-preview-component feed-preview-mosaic${activeClass}${unsavedClass}${position.image ? ' has-image' : ''}" type="button" draggable="true" data-feed-preview-component="${this.escape(component.id)}">${mosaicImage}<span><small>限时福利</small><b>${this.escape(slots[0] || '福利活动主会场')}</b></span><i>${this.escape(slots[1] || '限时好礼')}</i></button>`;
    }
    if (component.type === 'grid') return `<button class="feed-preview-component feed-preview-grid${activeClass}${unsavedClass}" type="button" draggable="true" data-feed-preview-component="${this.escape(component.id)}"><b>精选权益</b><span>${slots.map((slot) => `<i>${this.escape(slot)}</i>`).join('')}</span></button>`;
    if (component.type === 'native-slider') return `<button class="feed-preview-component feed-preview-native-slider${activeClass}${unsavedClass}" type="button" draggable="true" data-feed-preview-component="${this.escape(component.id)}"><span>${slots.map((slot, index) => `<i class="${index === 0 ? 'is-active' : ''}">${this.escape(slot)}</i>`).join('')}</span><small><b></b><b></b><b></b></small></button>`;
    return `<button class="feed-preview-component feed-preview-red-packet${activeClass}${unsavedClass}" type="button" draggable="true" data-feed-preview-component="${this.escape(component.id)}"><span><small>福利红包</small><b>${this.escape(slots[0] || '福利红包')}</b></span><i>立即领取</i></button>`;
  },
  renderEmbeddedPreview(tab, tabs = [], selectedComponentId = '') {
    if (!tab) return '<div class="feed-tab-empty"><b>当前筛选条件下暂无 Tab</b><span>可调整上方状态筛选，或新增 Tab。</span></div>';
    const previewTabs = tabs.length ? tabs : [tab];
    const tabNav = previewTabs.map((item) => {
      const iconPreview = item.iconImage ? `<img src="${item.iconImage}" alt="" />` : '<span>Tab</span>';
      const active = item.id === tab.id;
      return `<button class="feed-app-tab${active ? ' is-active' : ''}" type="button" role="tab" aria-selected="${active}" data-feed-preview-tab="${this.escape(item.id)}"><i class="feed-app-icon">${iconPreview}</i>${this.escape(item.tabName || '未命名 Tab')}${this.renderBadge(item)}</button>`;
    }).join('');
    const components = tab.components || [];
    const content = components.length ? components.map((component) => this.renderEmbeddedComponent(component, selectedComponentId)).join('') : '<div class="feed-preview-empty"><b>+</b><span>从左侧拖入信息流组件</span></div>';
    return `<section class="feed-tab-preview feed-embedded-preview-card" aria-label="Tab 前台预览"><div class="feed-app-tabs" role="tablist" aria-label="信息流 Tab 预览导航"><div class="feed-app-tab-list">${tabNav}</div><button class="feed-app-tab-add" type="button" title="添加 Tab" aria-label="添加 Tab" data-feed-preview-add>+</button></div><div class="feed-preview-drop-zone" data-feed-preview-drop-zone>${content}</div></section>`;
  },
  renderEmbeddedConfig(tab) {
    if (!tab) return '<div class="style-config-empty">请选择预览中的 Tab，或点击加号新增 Tab 进行配置</div>';
    const field = (label, control) => `<div class="config-field"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    const productFeed = this.createProductFeedConfig(tab.productFeed);
    tab.productFeed = productFeed;
    const productSourceOptions = productFeed.source === 'third-party'
      ? [['api-feed-001', '商品流 API-001'], ['api-feed-002', '商品流 API-002']]
      : [['activity-library', '活动商品库'], ['featured-library', '精选商品库'], ['high-commission-library', '高佣商品库']];
    const productFeedFields = `${field('商品数据来源', `<select class="control" data-feed-product-flow-field="source"><option value="app-library"${productFeed.source === 'app-library' ? ' selected' : ''}>应用库</option><option value="third-party"${productFeed.source === 'third-party' ? ' selected' : ''}>三方API</option></select>`)}${field('商品数据来源', `<select class="control" data-feed-product-flow-field="dataKey"><option value="">请选择数据商品来源</option>${productSourceOptions.map(([value, label]) => `<option value="${value}"${productFeed.dataKey === value ? ' selected' : ''}>${label}</option>`).join('')}</select>`)}${productFeed.source === 'third-party' ? field('<b class="field-required">*</b>关联PID', `<select class="control" data-feed-product-flow-field="pid"><option value="">请选择关联PID</option><option value="default-pid"${productFeed.pid === 'default-pid' ? ' selected' : ''}>默认PID</option><option value="pid-jd-001"${productFeed.pid === 'pid-jd-001' ? ' selected' : ''}>PID-京东-001</option><option value="pid-taobao-002"${productFeed.pid === 'pid-taobao-002' ? ' selected' : ''}>PID-淘宝-002</option></select>`) : ''}`;
    return `<div class="style-config-form feed-tab-form"><section class="home-entry-info-section shared-config-section"><h3>基本信息</h3>${field('<b class="field-required">*</b>Tab名称 <button class="help-tooltip" type="button" aria-label="Tab名称说明" data-tooltip="用户端可见">?</button>', `<input class="control" data-feed-embedded-field="tabName" value="${this.escape(tab.tabName)}" maxlength="12" placeholder="请输入 Tab 名称" />`)}${field('<b class="field-required">*</b>记录名称', `<input class="control" data-feed-embedded-field="recordName" value="${this.escape(tab.recordName)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}${this.renderImageControl('icon图片', 'iconImage', tab.iconImage)}${this.renderImageControl('角标图片', 'cornerImage', tab.cornerImage, '尾标图片优先于角标图片展示；尾标和角标互斥，前台仅展示一个。')}${this.renderImageControl('尾标图片', 'tailImage', tab.tailImage, '仅限 v8.95.0 及以上版本可用。')}</section><section class="home-entry-info-section shared-config-section feed-product-flow-section"><h3>商品流配置</h3>${productFeedFields}</section>${window.ConfigurationSections.renderTargeting({ prefix: 'feed-tab', value: tab.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'feed-tab', value: tab.testPlan, description: '测试 UID 内的用户将在测试有效时间内看到此 Tab，到期自动终止，不影响正式配置。' })}</div>`;
  },
  renderEmbeddedComponentConfig(component) {
    const field = (label, control) => `<div class="config-field"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    if (component.type === 'mosaic') {
      const mosaic = this.createMosaicConfig(component.mosaic);
      component.mosaic = mosaic;
      const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0];
      const assetControl = (label, fieldName, image) => `<span class="home-showcase-asset"><span class="home-showcase-asset-preview">${image ? `<img src="${image}" alt="已上传${label}" />` : '<b>图片</b>'}</span><span class="home-showcase-asset-actions"><label class="button secondary home-entry-upload">${label}<input type="file" accept="image/*" data-feed-mosaic-image="${fieldName}" /></label><button class="home-entry-delete" type="button" data-feed-mosaic-delete="${fieldName}"${image ? '' : ' disabled'}>删除图片</button></span></span>`;
      const help = (text) => `<button class="help-tooltip home-showcase-help" type="button" aria-label="字段说明" data-tooltip="${text}">?</button>`;
      const pieces = mosaic.positions.map((item) => `<button class="feed-mosaic-piece${item.id === position.id ? ' is-selected' : ''}" type="button" data-feed-mosaic-position="${this.escape(item.id)}">${item.image ? `<img src="${item.image}" alt="拼图位置图片" />` : '<span>选择</span>'}${item.id === position.id ? '<b>★</b>' : ''}</button>`).join('');
      const workspace = `<div class="home-showcase-workspace"><div class="feed-mosaic-canvas" aria-label="拼图配置"><div class="feed-mosaic-piece-list">${pieces}</div><span class="feed-mosaic-position-actions"><button class="feed-mosaic-position-add" type="button" data-feed-mosaic-position-add aria-label="添加位置">+</button><button class="feed-mosaic-position-remove" type="button" data-feed-mosaic-position-remove aria-label="删除选中位置"${mosaic.positions.length === 1 ? ' disabled' : ''}>×</button></span></div><span class="home-showcase-route-example">路由协议填写示例</span><div class="home-showcase-assets">${assetControl('上传图片', 'image', position.image)}${assetControl('暗黑模式', 'darkImage', position.darkImage)}</div><div class="home-showcase-route-row"><select class="control" data-feed-mosaic-field="routeType"><option value="">请选择跳转类型</option><option value="page"${position.routeType === 'page' ? ' selected' : ''}>页面跳转</option><option value="protocol"${position.routeType === 'protocol' ? ' selected' : ''}>自定义地址/协议</option></select><input class="control" data-feed-mosaic-field="routeProtocol" value="${this.escape(position.routeProtocol)}" placeholder="请输入路由协议" /></div><div class="home-showcase-input-help"><input class="control" data-feed-mosaic-field="pid" value="${this.escape(position.pid)}" placeholder="pid（除京东&拼多多&抖音&1688，其余商城用于埋点上报）" />${help('用于商城埋点上报的 PID 配置。')}</div><div class="home-showcase-input-help"><select class="control" data-feed-mosaic-field="selectedPid"><option value="">请选择 pid</option><option value="default"${position.selectedPid === 'default' ? ' selected' : ''}>默认 pid</option><option value="custom"${position.selectedPid === 'custom' ? ' selected' : ''}>自定义 pid</option></select>${help('选择当前拼图展示使用的 PID。')}</div><div class="home-showcase-input-help"><input class="control" data-feed-mosaic-field="skipType" value="${this.escape(position.skipType)}" placeholder="skip_type（用于埋点上报）" />${help('用于记录跳转类型的埋点字段。')}</div><input class="control" data-feed-mosaic-field="mallId" value="${this.escape(position.mallId)}" placeholder="商城 id" /><div class="home-showcase-popup-row">${assetControl('出站弹窗 logo', 'popupLogo', position.popupLogo)}<input class="control" data-feed-mosaic-field="popupCopy" value="${this.escape(position.popupCopy)}" placeholder="出站弹窗文案" /></div><label class="home-showcase-login"><input type="checkbox" data-feed-mosaic-field="requiresLogin"${position.requiresLogin ? ' checked' : ''} />用户需登录</label></div>`;
      return `<div class="style-config-form feed-component-form feed-mosaic-form"><section class="home-entry-info-section shared-config-section"><h3>基本信息</h3>${field('<b class="field-required">*</b>组件类型', '<input class="control feed-component-type-control" value="信息流-拼图" data-feed-static disabled aria-label="组件类型：信息流-拼图" />')}${field('<b class="field-required">*</b>记录名称', `<input class="control" data-feed-component-field="recordName" value="${this.escape(component.recordName || component.label)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}</section><section class="home-entry-info-section shared-config-section home-showcase-feature-section"><h3>素材配置</h3>${field('拼图配置 <button class="help-tooltip" type="button" aria-label="拼图配置说明" data-tooltip="此部分内容复用「美柚返现」；如有修改，则以最新的逻辑为准。">?</button>', workspace, 'home-showcase-config-field')}</section>${window.ConfigurationSections.renderTargeting({ prefix: 'feed-mosaic', value: component.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'feed-mosaic', value: component.testPlan, description: '测试 UID 内的用户将在测试有效时间内看到此信息流-拼图组件，到期自动终止，不影响正式配置。' })}</div>`;
    }
    if (component.type === 'red-packet-delivery') {
      const redPacket = this.createRedPacketConfig(component.redPacket);
      component.redPacket = redPacket;
      const asset = (label, key, image) => `<span class="home-red-packet-title-asset"><span class="home-red-packet-title-asset-preview">${image ? `<img src="${image}" alt="已上传${label}" />` : '<b>图片</b>'}</span><span class="home-red-packet-title-asset-actions"><label class="button secondary home-entry-upload">${label}<input type="file" accept="image/*" data-feed-red-packet-image="${key}" /></label><button class="home-entry-delete" type="button" data-feed-red-packet-delete="${key}"${image ? '' : ' disabled'}>删除图片</button></span></span>`;
      const titleArea = redPacket.titleArea ? `<div class="home-red-packet-title-area-fields">${field('标题', `<input class="control" data-feed-red-packet-field="title" value="${this.escape(redPacket.title)}" placeholder="请输入标题" />`)}${field('副标题', `<input class="control" data-feed-red-packet-field="subtitle" value="${this.escape(redPacket.subtitle)}" placeholder="请输入副标题" />`)}${field('标题图片', `<div class="home-red-packet-title-assets">${asset('上传图片', 'titleImage', redPacket.titleImage)}${asset('暗黑模式', 'titleDarkImage', redPacket.titleDarkImage)}</div><p>若同时填写文字标题，以图片优先展示。</p>`, 'home-red-packet-title-image-field')}</div>` : '';
      const packageInfo = redPacket.deliveryType === 'package' ? `<div class="home-red-packet-package-info"><p class="home-red-packet-package-notice">同一券包配置内，关联红包每人最多可领取一次，无法重复领取</p>${field('<b class="field-required">*</b>未领取图片素材', `<div class="home-red-packet-package-asset-list">${asset('上传图片', 'unclaimedImage', redPacket.unclaimedImage)}${asset('暗黑模式', 'unclaimedDarkImage', redPacket.unclaimedDarkImage)}</div><p class="home-red-packet-package-help">用户未领取时展示整张素材图。未领取态不展示标题区，以图片素材为主视觉。</p>`, 'home-red-packet-package-assets')}</div>` : '';
      const packageTemplate = redPacket.deliveryType === 'package' ? field('<b class="field-required">*</b>红包模板', `<span class="home-red-packet-template-options"><label class="home-red-packet-template-card${redPacket.template === 'with-button' ? ' is-selected' : ''}"><input type="radio" name="feed-red-packet-template" value="with-button"${redPacket.template === 'with-button' ? ' checked' : ''} /><span class="home-red-packet-template-copy"><b>模板一：有去使用按钮</b><small>已领取/待使用状态下展示“去使用”按钮，点击后按红包自身配置的跳转地址跳转。</small></span><img class="home-red-packet-template-preview" src="assets/marketing-config/red-packet-template-with-button.png" alt="模板一红包样式示意" /></label><label class="home-red-packet-template-card${redPacket.template === 'without-button' ? ' is-selected' : ''}"><input type="radio" name="feed-red-packet-template" value="without-button"${redPacket.template === 'without-button' ? ' checked' : ''} /><span class="home-red-packet-template-copy"><b>模板二：无去使用按钮</b><small>已领取/待使用状态下不展示按钮。适用于红包跳转地址为返现首页，避免用户点击后仍停留首页。</small></span><img class="home-red-packet-template-preview" src="assets/marketing-config/red-packet-template-without-button.png" alt="模板二红包样式示意" /></label></span><p class="home-red-packet-template-help">若关联红包的跳转地址为返现首页，建议选择“无去使用按钮”，避免用户感知为按钮无效。</p>`, 'home-red-packet-template-field') : '';
      return `<div class="style-config-form feed-component-form home-red-packet-form"><section class="home-entry-info-section shared-config-section"><h3>基础信息</h3>${field('<b class="field-required">*</b>组件类型', '<input class="control feed-component-type-control" value="信息流-红包发放功能" data-feed-static disabled />')}${field('<b class="field-required">*</b>记录名称', `<input class="control" data-feed-red-packet-field="name" value="${this.escape(redPacket.name)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}</section><section class="home-entry-info-section shared-config-section"><h3>功能信息</h3>${field('<b class="field-required">*</b>发放类型', `<span class="home-entry-status-control"><label><input type="radio" name="feed-red-packet-delivery" value="single"${redPacket.deliveryType === 'single' ? ' checked' : ''} />单个发放</label><label><input type="radio" name="feed-red-packet-delivery" value="package"${redPacket.deliveryType === 'package' ? ' checked' : ''} />券包发放</label></span>`)}${packageInfo}${field('是否配置标题区', `<span class="home-entry-status-control"><label><input type="checkbox" data-feed-red-packet-title-area${redPacket.titleArea ? ' checked' : ''} />配置标题区</label></span>`)}${titleArea}${packageTemplate}<div class="home-red-packet-link"><span>关联返现红包</span><div class="home-red-packet-link-control"><button class="button secondary" type="button" disabled title="本原型不展开红包关联明细">+ 关联红包</button><div class="home-red-packet-link-placeholder">关联区</div></div></div></section>${window.ConfigurationSections.renderTargeting({ prefix: 'feed-red-packet', value: redPacket.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'feed-red-packet', value: redPacket.testPlan })}<p>带 * 的字段为必填项。关联红包仅保留入口，不在此处配置选择明细。</p></div>`;
    }
    const slots = component.slots || [];
    const assets = component.assets || [];
    const assetControl = (index) => {
      const image = assets[index] || '';
      return `<div class="feed-component-asset">${image ? `<span class="feed-component-asset-preview"><img src="${image}" alt="坑位${index + 1}图片" /></span>` : '<span class="feed-component-asset-preview">暂无图片</span>'}<span class="feed-component-asset-actions"><label class="button secondary feed-component-upload">上传图片<input type="file" accept="image/*" data-feed-component-image="${index}" /></label>${image ? `<button class="feed-component-image-delete" type="button" data-feed-component-image-delete="${index}">删除图片</button>` : ''}</span></div>`;
    };
    return `<div class="style-config-form feed-component-form"><section class="home-entry-info-section shared-config-section"><h3>基本信息</h3>${field('<b class="field-required">*</b>记录名称', `<input class="control" data-feed-component-field="recordName" value="${this.escape(component.recordName || component.label)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}${field('组件类型', `<input class="control feed-component-type-control" value="${this.escape(component.label)}" data-feed-static disabled />`)}</section><section class="home-entry-info-section shared-config-section"><h3>素材配置</h3>${slots.map((slot, index) => `${field(`<b class="field-required">*</b>坑位${index + 1}`, `<input class="control" data-feed-component-slot="${index}" value="${this.escape(slot)}" maxlength="20" placeholder="请输入坑位名称" />`)}${field('图片', assetControl(index))}`).join('')}</section></div>`;
  },
  bindEmbedded({ navigate, storageKey = this.storageKey, pageName = '首页信息流营销' } = {}) {
    const root = document.getElementById('feed-marketing-builder');
    if (!root) return;
    let draft = this.clone(this.loadState(storageKey));
    let filters = { status: new Set(['上线中', '待上线', '已下线']), resourceStatus: new Set(['上线中', '待上线', '已下线']) };
    let draggedToolType = '';
    let draggedComponentId = '';
    let selectedComponentId = '';
    const snapshot = () => ({ tabs: draft.tabs });
    const editSession = window.EditSession.create({
      snapshot,
      clone: (value) => this.clone(value),
      confirmClose: () => window.BackofficeLayout.confirm({
        title: '确认关闭编辑？',
        message: '当前编辑的内容未保存，是否仍然要关闭',
        confirmText: '仍然关闭',
        cancelText: '继续编辑'
      })
    });
    const activeTab = () => draft.tabs.find((tab) => tab.id === draft.activeTabId);
    const activeComponent = () => activeTab()?.components.find((component) => component.id === selectedComponentId) || null;
    const recentScope = `feed:${storageKey}`;
    const refreshRecentEdits = (recordCurrent = false) => {
      const component = activeComponent();
      const item = component ? { id: component.id, name: component.type === 'red-packet-delivery' ? component.redPacket?.name : component.recordName || component.label } : null;
      if (recordCurrent && item) window.RecentEdits?.record({ scope: recentScope, ...item });
      window.RecentEdits?.render(document.getElementById('marketing-recent-edits'), recentScope, {
        filter: (item) => draft.tabs.some((tab) => tab.components.some((component) => component.id === item.id)),
        onSelect: (item) => {
          const componentTab = draft.tabs.find((candidate) => candidate.components.some((component) => component.id === item.id));
          if (componentTab) {
            draft.activeTabId = componentTab.id;
            selectedComponentId = item.id;
          } else return;
          renderAll();
          requestAnimationFrame(() => {
            root.querySelector(`[data-feed-preview-component="${selectedComponentId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }
      });
    };
    const applyEditState = () => {
      const isEditing = editSession.isEditing();
      const tab = activeTab();
      const canConfigureComponents = isEditing && Boolean(tab?.hasBeenSaved);
      root.classList.toggle('is-editing', isEditing);
      root.querySelectorAll('.feed-marketing-settings input:not([data-feed-static]), .feed-marketing-settings select:not([data-feed-static]), .feed-marketing-settings textarea:not([data-feed-static])').forEach((control) => { control.disabled = !isEditing; });
      root.querySelectorAll('[data-feed-component-add]').forEach((control) => { control.disabled = !canConfigureComponents; });
      root.querySelectorAll('[data-feed-image-delete], [data-feed-component-image-delete], [data-feed-mosaic-delete], [data-feed-red-packet-delete], [data-feed-mosaic-position-add], [data-feed-mosaic-position-remove]').forEach((control) => { control.disabled = !isEditing || (control.matches('[data-feed-mosaic-position-remove]') && activeComponent()?.mosaic?.positions?.length <= 1); });
      root.querySelector('#feed-component-tools-note').textContent = tab?.hasBeenSaved ? '拖入当前 Tab 的信息流预览区域' : '请先保存当前 Tab，再拖入信息流组件';
      root.querySelector('.feed-marketing-tools').classList.toggle('is-locked', !canConfigureComponents);
      const component = activeComponent();
      const removeButton = root.querySelector('#remove-feed-component');
      const canRemoveNewComponent = isEditing && Boolean(component) && !component.hasBeenSaved;
      removeButton.hidden = !canRemoveNewComponent;
      removeButton.disabled = !canRemoveNewComponent;
      root.querySelectorAll('[data-feed-preview-component]').forEach((element) => {
        const previewComponent = tab?.components.find((item) => item.id === element.dataset.feedPreviewComponent);
        element.classList.toggle('is-unsaved', Boolean(previewComponent && !previewComponent.isSaved));
      });
      const saveButton = root.querySelector('#save-feed-tab');
      const needsInitialTabSave = Boolean(tab && !tab.hasBeenSaved);
      saveButton.textContent = isEditing ? (component ? '保存组件' : (needsInitialTabSave ? '保存Tab' : '保存配置')) : '编辑';
      saveButton.classList.toggle('is-edit-action', !isEditing);
      saveButton.closest('.home-component-save-tooltip').dataset.tooltip = isEditing
        ? (component ? '保存当前组件配置。' : (needsInitialTabSave ? '首次保存当前 Tab 后才可拖入信息流组件。' : '保存当前 Tab 配置。'))
        : '点击编辑当前选中的 Tab 或组件。';
      saveButton.disabled = isEditing && !editSession.hasComponentChanges();
      refreshRecentEdits();
    };
    const readTargeting = (tab) => {
      const targeting = window.ConfigurationSections.normalizeTargeting(tab.targeting);
      targeting.identities = [...root.querySelectorAll('[data-feed-tab-identity]:checked')].map((input) => input.value);
      targeting.targetGroup = root.querySelector('[data-feed-tab-targeting-field="targetGroup"]')?.value || '';
      targeting.excludeGroup = root.querySelector('[data-feed-tab-targeting-field="excludeGroup"]')?.value || '';
      targeting.audiences = [...root.querySelectorAll('[data-feed-tab-audience]:checked')].map((input) => input.value);
      targeting.audienceInversion = root.querySelector('input[name="feed-tab-audience-inversion"]:checked')?.value || '否';
      targeting.experimentId = root.querySelector('[data-feed-tab-targeting-field="experimentId"]')?.value || '';
      targeting.excludeExperiment = root.querySelector('[data-feed-tab-targeting-field="excludeExperiment"]')?.value || '';
      root.querySelectorAll('[data-feed-tab-platform]').forEach((input) => { targeting.platformVersions[input.dataset.feedTabPlatform].enabled = input.checked; });
      root.querySelectorAll('[data-feed-tab-version]').forEach((input) => { const [key, type] = input.dataset.feedTabVersion.split(':'); targeting.platformVersions[key][type] = input.value; });
      targeting.onlineStart = root.querySelector('[data-feed-tab-targeting-field="onlineStart"]')?.value || '';
      targeting.onlineEnd = root.querySelector('[data-feed-tab-targeting-field="onlineEnd"]')?.value || '';
      targeting.status = root.querySelector('input[name="feed-tab-status"]:checked')?.value || '上线';
      tab.targeting = targeting;
    };
    const readTestPlan = (tab) => {
      const testPlan = window.ConfigurationSections.normalizeTestPlan(tab.testPlan);
      root.querySelectorAll('[data-feed-tab-test]').forEach((input) => {
        testPlan[input.dataset.feedTabTest] = input.type === 'checkbox' ? input.checked : input.value;
      });
      tab.testPlan = testPlan;
    };
    const readMosaicTargeting = (component) => {
      const targeting = window.ConfigurationSections.normalizeTargeting(component.targeting);
      targeting.identities = [...root.querySelectorAll('[data-feed-mosaic-identity]:checked')].map((input) => input.value);
      targeting.targetGroup = root.querySelector('[data-feed-mosaic-targeting-field="targetGroup"]')?.value || '';
      targeting.excludeGroup = root.querySelector('[data-feed-mosaic-targeting-field="excludeGroup"]')?.value || '';
      targeting.audiences = [...root.querySelectorAll('[data-feed-mosaic-audience]:checked')].map((input) => input.value);
      targeting.audienceInversion = root.querySelector('input[name="feed-mosaic-audience-inversion"]:checked')?.value || '否';
      targeting.experimentId = root.querySelector('[data-feed-mosaic-targeting-field="experimentId"]')?.value || '';
      targeting.excludeExperiment = root.querySelector('[data-feed-mosaic-targeting-field="excludeExperiment"]')?.value || '';
      root.querySelectorAll('[data-feed-mosaic-platform]').forEach((input) => { targeting.platformVersions[input.dataset.feedMosaicPlatform].enabled = input.checked; });
      root.querySelectorAll('[data-feed-mosaic-version]').forEach((input) => { const [key, type] = input.dataset.feedMosaicVersion.split(':'); targeting.platformVersions[key][type] = input.value; });
      targeting.onlineStart = root.querySelector('[data-feed-mosaic-targeting-field="onlineStart"]')?.value || '';
      targeting.onlineEnd = root.querySelector('[data-feed-mosaic-targeting-field="onlineEnd"]')?.value || '';
      targeting.status = root.querySelector('input[name="feed-mosaic-status"]:checked')?.value || '上线';
      component.targeting = targeting;
    };
    const readMosaicTestPlan = (component) => {
      const testPlan = window.ConfigurationSections.normalizeTestPlan(component.testPlan);
      root.querySelectorAll('[data-feed-mosaic-test]').forEach((input) => {
        testPlan[input.dataset.feedMosaicTest] = input.type === 'checkbox' ? input.checked : input.value;
      });
      component.testPlan = testPlan;
    };
    const readRedPacketConfig = (component) => {
      const redPacket = this.createRedPacketConfig(component.redPacket);
      root.querySelectorAll('[data-feed-red-packet-field]').forEach((input) => { redPacket[input.dataset.feedRedPacketField] = input.value; });
      redPacket.deliveryType = root.querySelector('input[name="feed-red-packet-delivery"]:checked')?.value || 'single';
      redPacket.titleArea = Boolean(root.querySelector('[data-feed-red-packet-title-area]')?.checked);
      redPacket.template = root.querySelector('input[name="feed-red-packet-template"]:checked')?.value || 'with-button';
      redPacket.targeting.identities = [...root.querySelectorAll('[data-feed-red-packet-identity]:checked')].map((input) => input.value);
      root.querySelectorAll('[data-feed-red-packet-targeting-field]').forEach((input) => { redPacket.targeting[input.dataset.feedRedPacketTargetingField] = input.value; });
      redPacket.targeting.audiences = [...root.querySelectorAll('[data-feed-red-packet-audience]:checked')].map((input) => input.value);
      redPacket.targeting.audienceInversion = root.querySelector('input[name="feed-red-packet-audience-inversion"]:checked')?.value || '否';
      redPacket.targeting.status = root.querySelector('input[name="feed-red-packet-status"]:checked')?.value || '上线';
      root.querySelectorAll('[data-feed-red-packet-platform]').forEach((input) => { redPacket.targeting.platformVersions[input.dataset.feedRedPacketPlatform].enabled = input.checked; });
      root.querySelectorAll('[data-feed-red-packet-version]').forEach((input) => { const [key, type] = input.dataset.feedRedPacketVersion.split(':'); redPacket.targeting.platformVersions[key][type] = input.value; });
      root.querySelectorAll('[data-feed-red-packet-test]').forEach((input) => { redPacket.testPlan[input.dataset.feedRedPacketTest] = input.type === 'checkbox' ? input.checked : input.value; });
      component.redPacket = redPacket;
    };
    const renderAll = () => {
      const visibleTabs = draft.tabs.filter((tab) => filters.status.has(tab.status) && filters.resourceStatus.has(tab.resourceStatus));
      const active = visibleTabs.find((tab) => tab.id === draft.activeTabId) || visibleTabs[0] || null;
      if (active && active.id !== draft.activeTabId) draft.activeTabId = active.id;
      if (!active?.components.some((component) => component.id === selectedComponentId)) selectedComponentId = '';
      const component = activeComponent();
      root.querySelector('#feed-embedded-filters').innerHTML = `<div class="feed-embedded-filter"><strong>Tab状态</strong><div>${['上线中', '待上线', '已下线'].map((value) => `<label><input type="checkbox" data-feed-embedded-filter="status" value="${value}"${filters.status.has(value) ? ' checked' : ''} />${value}</label>`).join('')}</div></div><div class="feed-embedded-filter"><strong>资源位状态</strong><div>${['上线中', '待上线', '已下线'].map((value) => `<label><input type="checkbox" data-feed-embedded-filter="resourceStatus" value="${value}"${filters.resourceStatus.has(value) ? ' checked' : ''} />${value}</label>`).join('')}</div></div>`;
      root.querySelector('#feed-embedded-preview').innerHTML = this.renderEmbeddedPreview(active, draft.tabs, selectedComponentId);
      root.querySelector('#feed-embedded-config-type').textContent = component ? component.label : active ? `Tab · ${active.tabName || '未命名'}` : '未选择 Tab';
      root.querySelector('#feed-embedded-config-content').innerHTML = component ? this.renderEmbeddedComponentConfig(component) : this.renderEmbeddedConfig(active);
      applyEditState();
      window.BackofficeLayout.bindGlobalTooltips();
    };
    root.addEventListener('click', async (event) => {
      const previewTabButton = event.target.closest('[data-feed-preview-tab]');
      if (previewTabButton) { draft.activeTabId = previewTabButton.dataset.feedPreviewTab; selectedComponentId = ''; refreshRecentEdits(true); renderAll(); return; }
      if (event.target.closest('[data-feed-preview-add]')) { if (!editSession.isEditing()) editSession.startEditing(); const tab = this.createTab(); draft.tabs.push(tab); draft.activeTabId = tab.id; selectedComponentId = ''; refreshRecentEdits(true); renderAll(); return; }
      const previewComponent = event.target.closest('[data-feed-preview-component]');
      if (previewComponent) { selectedComponentId = previewComponent.dataset.feedPreviewComponent; refreshRecentEdits(true); renderAll(); return; }
      const componentTool = event.target.closest('[data-feed-component-add]');
      if (componentTool) { const tab = activeTab(); if (!editSession.isEditing() || !tab?.hasBeenSaved) { window.BackofficeLayout.showToast?.('请先保存Tab', '保存成功后才可拖入信息流组件'); return; } const component = this.createFeedComponent(componentTool.dataset.feedComponentAdd); tab.components.push(component); selectedComponentId = component.id; refreshRecentEdits(true); renderAll(); return; }
      if (event.target.closest('#remove-feed-component')) {
        if (!editSession.isEditing()) return;
        const tab = activeTab();
        if (tab) {
          const component = activeComponent();
          if (!component || component.hasBeenSaved) return;
          tab.components = tab.components.filter((item) => item.id !== component.id);
          selectedComponentId = '';
          renderAll();
          window.BackofficeLayout.showToast?.('组件已移除');
        }
        return;
      }
      const mosaicPosition = event.target.closest('[data-feed-mosaic-position]');
      if (mosaicPosition) {
        const component = activeComponent();
        if (component?.type === 'mosaic') {
          component.mosaic = this.createMosaicConfig(component.mosaic);
          component.mosaic.selectedPositionId = mosaicPosition.dataset.feedMosaicPosition;
          renderAll();
        }
        return;
      }
      const addMosaicPosition = event.target.closest('[data-feed-mosaic-position-add]');
      if (addMosaicPosition) {
        if (!editSession.isEditing()) return;
        const component = activeComponent();
        if (component?.type === 'mosaic') {
          const mosaic = this.createMosaicConfig(component.mosaic);
          const position = this.createMosaicConfig().positions[0];
          mosaic.positions.push(position);
          mosaic.selectedPositionId = position.id;
          component.mosaic = mosaic;
          component.isSaved = false;
          renderAll();
        }
        return;
      }
      const removeMosaicPosition = event.target.closest('[data-feed-mosaic-position-remove]');
      if (removeMosaicPosition) {
        if (!editSession.isEditing()) return;
        const component = activeComponent();
        if (component?.type === 'mosaic') {
          const mosaic = this.createMosaicConfig(component.mosaic);
          if (mosaic.positions.length > 1) {
            const removedIndex = mosaic.positions.findIndex((item) => item.id === mosaic.selectedPositionId);
            mosaic.positions.splice(removedIndex < 0 ? mosaic.positions.length - 1 : removedIndex, 1);
            mosaic.selectedPositionId = mosaic.positions[Math.max(0, Math.min(removedIndex, mosaic.positions.length - 1))].id;
            component.mosaic = mosaic;
            component.isSaved = false;
            renderAll();
          }
        }
        return;
      }
      const deleteButton = event.target.closest('[data-feed-image-delete]');
      if (deleteButton) { if (!editSession.isEditing()) return; const tab = activeTab(); if (tab) { tab[deleteButton.dataset.feedImageDelete] = ''; tab.isSaved = false; renderAll(); } }
      const componentImageDelete = event.target.closest('[data-feed-component-image-delete]');
      if (componentImageDelete) { if (!editSession.isEditing()) return; const component = activeComponent(); if (component) { component.assets[Number(componentImageDelete.dataset.feedComponentImageDelete)] = ''; component.isSaved = false; renderAll(); } }
      const mosaicImageDelete = event.target.closest('[data-feed-mosaic-delete]');
      if (mosaicImageDelete) { if (!editSession.isEditing()) return; const component = activeComponent(); if (component?.type === 'mosaic') { const mosaic = this.createMosaicConfig(component.mosaic); const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0]; position[mosaicImageDelete.dataset.feedMosaicDelete] = ''; component.mosaic = mosaic; component.isSaved = false; renderAll(); } }
      const redPacketImageDelete = event.target.closest('[data-feed-red-packet-delete]');
      if (redPacketImageDelete) { if (!editSession.isEditing()) return; const component = activeComponent(); if (component?.type === 'red-packet-delivery') { component.redPacket = this.createRedPacketConfig(component.redPacket); component.redPacket[redPacketImageDelete.dataset.feedRedPacketDelete] = ''; component.isSaved = false; renderAll(); } }
    });
    const clearDragState = () => {
      draggedToolType = '';
      draggedComponentId = '';
      root.querySelectorAll('.is-dragging, .is-dragover').forEach((item) => item.classList.remove('is-dragging', 'is-dragover'));
    };
    root.addEventListener('dragstart', (event) => {
      if (!editSession.isEditing()) return;
      const tool = event.target.closest('[data-feed-component-add]');
      if (tool) {
        if (!activeTab()?.hasBeenSaved) { event.preventDefault(); window.BackofficeLayout.showToast?.('请先保存Tab', '保存成功后才可拖入信息流组件'); return; }
        draggedToolType = tool.dataset.feedComponentAdd;
        tool.classList.add('is-dragging');
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', `feed-tool:${draggedToolType}`);
        return;
      }
      const component = event.target.closest('[data-feed-preview-component]');
      if (component) {
        draggedComponentId = component.dataset.feedPreviewComponent;
        component.classList.add('is-dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', `feed-component:${draggedComponentId}`);
      }
    });
    root.addEventListener('dragover', (event) => {
      const target = event.target.closest('[data-feed-preview-drop-zone], [data-feed-preview-component]');
      if (!target || (!draggedToolType && !draggedComponentId)) return;
      event.preventDefault();
      target.classList.add('is-dragover');
      event.dataTransfer.dropEffect = draggedToolType ? 'copy' : 'move';
    });
    root.addEventListener('dragleave', (event) => {
      const target = event.target.closest('[data-feed-preview-drop-zone], [data-feed-preview-component]');
      if (target && !target.contains(event.relatedTarget)) target.classList.remove('is-dragover');
    });
    root.addEventListener('drop', (event) => {
      if (!editSession.isEditing()) return;
      const target = event.target.closest('[data-feed-preview-drop-zone], [data-feed-preview-component]');
      const tab = activeTab();
      if (!target || !tab || (!draggedToolType && !draggedComponentId)) return;
      if (draggedToolType && !tab.hasBeenSaved) { clearDragState(); window.BackofficeLayout.showToast?.('请先保存Tab', '保存成功后才可拖入信息流组件'); return; }
      event.preventDefault();
      const targetId = target.dataset.feedPreviewComponent;
      if (draggedToolType) {
        const component = this.createFeedComponent(draggedToolType);
        const targetIndex = targetId ? tab.components.findIndex((item) => item.id === targetId) : -1;
        tab.components.splice(targetIndex < 0 ? tab.components.length : targetIndex, 0, component);
      } else if (draggedComponentId && draggedComponentId !== targetId) {
        const fromIndex = tab.components.findIndex((item) => item.id === draggedComponentId);
        const targetIndex = targetId ? tab.components.findIndex((item) => item.id === targetId) : tab.components.length - 1;
        if (fromIndex >= 0 && targetIndex >= 0) {
          const [component] = tab.components.splice(fromIndex, 1);
          tab.components.splice(fromIndex < targetIndex ? targetIndex - 1 : targetIndex, 0, component);
          component.isSaved = false;
          selectedComponentId = component.id;
        }
      }
      clearDragState();
      renderAll();
    });
    root.addEventListener('dragend', clearDragState);
    root.addEventListener('input', (event) => {
      if (!editSession.isEditing()) return;
      const tab = activeTab();
      if (!tab) return;
      if (event.target.matches('[data-feed-embedded-field]')) {
        tab[event.target.dataset.feedEmbeddedField] = event.target.value;
        tab.isSaved = false;
        root.querySelector('#feed-embedded-preview').innerHTML = this.renderEmbeddedPreview(tab, draft.tabs, selectedComponentId);
        root.querySelector('#feed-embedded-config-type').textContent = `Tab · ${tab.tabName || '未命名'}`;
        applyEditState();
        return;
      }
      if (event.target.matches('[data-feed-product-flow-field]')) {
        tab.productFeed = this.createProductFeedConfig(tab.productFeed);
        tab.productFeed[event.target.dataset.feedProductFlowField] = event.target.value;
        tab.isSaved = false;
        applyEditState();
        return;
      }
      const component = activeComponent();
      if (component && event.target.matches('[data-feed-component-field]')) {
        component[event.target.dataset.feedComponentField] = event.target.value;
        component.isSaved = false;
        applyEditState();
        return;
      }
      if (component && event.target.matches('[data-feed-component-slot]')) {
        component.slots[Number(event.target.dataset.feedComponentSlot)] = event.target.value;
        component.isSaved = false;
        root.querySelector('#feed-embedded-preview').innerHTML = this.renderEmbeddedPreview(tab, draft.tabs, selectedComponentId);
        applyEditState();
        return;
      }
      if (component?.type === 'red-packet-delivery' && event.target.closest('.home-red-packet-form')) {
        readRedPacketConfig(component);
        component.isSaved = false;
        applyEditState();
        return;
      }
      if (component?.type === 'mosaic' && event.target.matches('[data-feed-mosaic-field]')) {
        const mosaic = this.createMosaicConfig(component.mosaic);
        const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0];
        position[event.target.dataset.feedMosaicField] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        component.mosaic = mosaic;
        component.isSaved = false;
        if (event.target.dataset.feedMosaicField === 'routeProtocol') root.querySelector('#feed-embedded-preview').innerHTML = this.renderEmbeddedPreview(tab, draft.tabs, selectedComponentId);
        applyEditState();
        return;
      }
      if (component?.type === 'mosaic' && event.target.closest('.feed-mosaic-form')) {
        readMosaicTargeting(component);
        readMosaicTestPlan(component);
        component.isSaved = false;
        applyEditState();
        return;
      }
      if (event.target.closest('.feed-tab-form')) {
        readTargeting(tab);
        readTestPlan(tab);
        tab.isSaved = false;
        applyEditState();
      }
    });
    root.addEventListener('change', async (event) => {
      const filter = event.target.closest('[data-feed-embedded-filter]');
      if (filter) { const group = filter.dataset.feedEmbeddedFilter; filter.checked ? filters[group].add(filter.value) : filters[group].delete(filter.value); renderAll(); return; }
      const imageInput = event.target.closest('[data-feed-image]');
      if (!editSession.isEditing()) return;
      if (imageInput?.files?.[0]) { const tab = activeTab(); if (tab) { tab[imageInput.dataset.feedImage] = await this.readImage(imageInput.files[0]); tab.isSaved = false; renderAll(); } return; }
      const productFlowField = event.target.closest('[data-feed-product-flow-field]');
      if (productFlowField) {
        const tab = activeTab();
        if (!tab) return;
        tab.productFeed = this.createProductFeedConfig(tab.productFeed);
        tab.productFeed[productFlowField.dataset.feedProductFlowField] = productFlowField.value;
        tab.isSaved = false;
        if (productFlowField.dataset.feedProductFlowField === 'source') renderAll();
        else applyEditState();
        return;
      }
      const componentImageInput = event.target.closest('[data-feed-component-image]');
      if (componentImageInput?.files?.[0]) { const component = activeComponent(); if (component) { component.assets[Number(componentImageInput.dataset.feedComponentImage)] = await this.readImage(componentImageInput.files[0]); component.isSaved = false; renderAll(); } return; }
      const mosaicImageInput = event.target.closest('[data-feed-mosaic-image]');
      if (mosaicImageInput?.files?.[0]) { const component = activeComponent(); if (component?.type === 'mosaic') { const mosaic = this.createMosaicConfig(component.mosaic); const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0]; position[mosaicImageInput.dataset.feedMosaicImage] = await this.readImage(mosaicImageInput.files[0]); component.mosaic = mosaic; component.isSaved = false; renderAll(); } return; }
      const component = activeComponent();
      const redPacketImageInput = event.target.closest('[data-feed-red-packet-image]');
      if (redPacketImageInput?.files?.[0]) { if (component?.type === 'red-packet-delivery') { component.redPacket = this.createRedPacketConfig(component.redPacket); component.redPacket[redPacketImageInput.dataset.feedRedPacketImage] = await this.readImage(redPacketImageInput.files[0]); component.isSaved = false; renderAll(); } return; }
      if (component?.type === 'red-packet-delivery' && event.target.closest('.home-red-packet-form')) { readRedPacketConfig(component); component.isSaved = false; renderAll(); return; }
      if (component?.type === 'mosaic' && event.target.matches('[data-feed-mosaic-field]')) {
        const mosaic = this.createMosaicConfig(component.mosaic);
        const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0];
        position[event.target.dataset.feedMosaicField] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        component.mosaic = mosaic;
        component.isSaved = false;
        renderAll();
        return;
      }
      if (component?.type === 'mosaic' && event.target.closest('.feed-mosaic-form')) { readMosaicTargeting(component); readMosaicTestPlan(component); component.isSaved = false; applyEditState(); return; }
      const tab = activeTab(); if (tab && event.target.closest('.feed-tab-form')) { readTargeting(tab); readTestPlan(tab); tab.isSaved = false; applyEditState(); }
    });
    root.querySelector('#save-feed-tab').addEventListener('click', () => {
      if (!editSession.isEditing()) {
        editSession.startEditing();
        refreshRecentEdits(true);
        renderAll();
        return;
      }
      if (!editSession.hasComponentChanges()) return;
      const tab = activeTab();
      const component = activeComponent();
      if (tab && !component) { readTargeting(tab); readTestPlan(tab); tab.productFeed = this.createProductFeedConfig(tab.productFeed); }
      if (component?.type === 'mosaic') { readMosaicTargeting(component); readMosaicTestPlan(component); }
      if (component?.type === 'red-packet-delivery') { readRedPacketConfig(component); component.recordName = component.redPacket.name; }
      const invalid = component ? this.validateComponent(component) : this.validate(tab);
      if (invalid) { window.BackofficeLayout.showToast?.(invalid); return; }
      if (component) { component.isSaved = true; component.hasBeenSaved = true; }
      if (tab && !component) { tab.isSaved = true; tab.hasBeenSaved = true; }
      const state = { tabs: draft.tabs, activeTabId: draft.activeTabId };
      try { this.saveState(state, storageKey); } catch (error) { window.BackofficeLayout.showToast?.('保存失败', '本地演示数据无法保存，请减少图片素材后重试'); return; }
      editSession.finishComponentEditing(snapshot());
      refreshRecentEdits(true);
      applyEditState();
      window.BackofficeLayout.showToast?.(component ? '组件已保存' : 'Tab已保存', `${pageName}已更新`);
    });
    renderAll();
    return { guardNavigation: (destination) => editSession.guardNavigation(destination) };
  },
  renderWorkspace(draft, filters) {
    const nav = document.getElementById('feed-tab-nav');
    const workspace = document.getElementById('feed-tab-workspace');
    if (!nav || !workspace) return;
    const visibleTabs = draft.tabs.filter((tab) => filters.status.has(tab.status) && filters.resourceStatus.has(tab.resourceStatus));
    const active = visibleTabs.find((tab) => tab.id === draft.activeTabId) || visibleTabs[0] || null;
    if (active && active.id !== draft.activeTabId) draft.activeTabId = active.id;
    nav.innerHTML = `${visibleTabs.map((tab) => `<button class="feed-tab-item${tab.id === draft.activeTabId ? ' is-active' : ''}" type="button" role="tab" aria-selected="${tab.id === draft.activeTabId}" data-feed-tab="${tab.id}">${this.escape(tab.tabName || '未命名 Tab')}${this.renderBadge(tab)}</button>`).join('')}<button class="feed-tab-add" id="feed-tab-add" type="button" title="新增 Tab" aria-label="新增 Tab">+</button>`;
    const content = active ? this.renderTabDetail(active) : `<div class="feed-tab-empty"><b>当前筛选条件下暂无 Tab</b><span>可调整状态筛选，或点击右上角加号新增 Tab。</span></div>`;
    workspace.innerHTML = `${content}<div class="feed-tab-reference-overlay" role="note"><p>首页信息流营销整体配置如「返现」信息流营销配置。</p></div>`;
  },
  renderBadge(tab) {
    if (tab.tailImage) return `<img class="feed-tab-tail-badge" src="${tab.tailImage}" alt="" />`;
    if (tab.cornerImage) return `<img class="feed-tab-corner-badge" src="${tab.cornerImage}" alt="" />`;
    return '';
  },
  escape(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  },
  renderImageControl(label, field, image, note = '') {
    return `<div class="config-field feed-tab-image-field"><span class="config-field-label">${label}</span><div class="config-field-control"><div class="feed-tab-image-control">${image ? `<span class="feed-tab-image-preview"><img src="${image}" alt="已上传${label}" /></span>` : ''}<span class="feed-tab-image-actions"><label class="button secondary feed-tab-upload">上传图片<input type="file" accept="image/*" data-feed-image="${field}" /></label>${image ? `<button class="feed-tab-delete" type="button" data-feed-image-delete="${field}">删除图片</button>` : ''}</span></div>${note ? `<p class="feed-tab-image-note">${note}</p>` : ''}</div></div>`;
  },
  renderTabDetail(tab) {
    const field = (label, control) => `<div class="config-field"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    const iconPreview = tab.iconImage ? `<img src="${tab.iconImage}" alt="" />` : '<span>Tab</span>';
    return `<div class="feed-tab-layout"><section class="feed-tab-preview" aria-label="Tab 前台预览"><div class="feed-app-tabs"><span class="feed-app-tab is-active"><i class="feed-app-icon">${iconPreview}</i>${this.escape(tab.tabName || '未命名 Tab')}${this.renderBadge(tab)}</span><span class="feed-app-tab">推荐</span><span class="feed-app-tab">好价</span></div><div class="feed-preview-card"><b>${this.escape(tab.tabName || '信息流 Tab')}</b><span>这里展示当前 Tab 的信息流资源位内容</span><div><i>精选返现</i><i>限时好价</i><i>热销推荐</i></div></div></section><section class="feed-tab-detail"><h2>Tab详情</h2><div class="style-config-form feed-tab-form"><section class="home-entry-info-section shared-config-section"><h3>基本信息</h3>${field('<b class="field-required">*</b>Tab名称 <button class="help-tooltip" type="button" aria-label="Tab名称说明" data-tooltip="用户端可见">?</button>', `<input class="control" data-feed-field="tabName" value="${this.escape(tab.tabName)}" maxlength="12" placeholder="请输入 Tab 名称" />`)}${field('<b class="field-required">*</b>记录名称', `<input class="control" data-feed-field="recordName" value="${this.escape(tab.recordName)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}${this.renderImageControl('icon图片', 'iconImage', tab.iconImage)}${this.renderImageControl('角标图片', 'cornerImage', tab.cornerImage, '尾标图片优先于角标图片展示；尾标和角标互斥，前台仅展示一个。')}${this.renderImageControl('尾标图片', 'tailImage', tab.tailImage, '仅限 v8.95.0 及以上版本可用。')}</section>${window.ConfigurationSections.renderTargeting({ prefix: 'feed-tab', value: tab.targeting, required: true })}</div></section></div>`;
  },
  readImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result));
      reader.addEventListener('error', () => reject(reader.error));
      reader.readAsDataURL(file);
    });
  },
  validate(tab) {
    if (!tab.tabName.trim()) return '请填写 Tab名称';
    if (!tab.recordName.trim()) return '请填写 记录名称';
    if (this.createProductFeedConfig(tab.productFeed).source === 'third-party' && !this.createProductFeedConfig(tab.productFeed).pid.trim()) return '请选择关联PID';
    return '';
  },
  validateComponent(component) {
    if (component.type === 'red-packet-delivery') {
      const redPacket = this.createRedPacketConfig(component.redPacket);
      const hasPlatformVersion = Object.values(redPacket.targeting.platformVersions).some((platform) => platform.enabled && platform.start.trim());
      if (!redPacket.name.trim() || !redPacket.deliveryType || !hasPlatformVersion || !redPacket.targeting.onlineStart || !redPacket.targeting.onlineEnd || (redPacket.deliveryType === 'package' && (!redPacket.unclaimedImage || !redPacket.template))) return '请补充红包发放功能的记录名称、发放类型、平台版本与上线时间；券包发放还需上传未领取图片素材并选择红包模板';
      return '';
    }
    if (!(component.recordName || component.label || '').trim()) return '请填写 记录名称';
    if ((component.slots || []).some((slot) => !String(slot).trim())) return '请填写组件坑位名称';
    return '';
  },
  bind() {
    let saved = this.loadState();
    let draft = this.clone(saved);
    let filters = { status: new Set(['上线中', '待上线', '已下线']), resourceStatus: new Set(['上线中', '待上线', '已下线']) };
    const updateActions = () => {
      const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
      document.getElementById('feed-page-actions').innerHTML = `<button class="button secondary" id="feed-undo" type="button"${dirty ? '' : ' disabled'}>撤销本次修改</button><button class="button primary" id="feed-save" type="button"${dirty ? '' : ' disabled'}>保存</button>`;
    };
    const renderAll = () => { this.renderWorkspace(draft, filters); updateActions(); window.BackofficeLayout.bindGlobalTooltips(); };
    const activeTab = () => draft.tabs.find((tab) => tab.id === draft.activeTabId);
    const readTargeting = (tab) => {
      const targeting = window.ConfigurationSections.normalizeTargeting(tab.targeting);
      document.querySelectorAll('[data-feed-tab-identity]').forEach((input) => { if (input.checked) targeting.identities.push(input.value); });
      targeting.targetGroup = document.querySelector('[data-feed-tab-targeting-field="targetGroup"]')?.value || '';
      targeting.excludeGroup = document.querySelector('[data-feed-tab-targeting-field="excludeGroup"]')?.value || '';
      targeting.audiences = [...document.querySelectorAll('[data-feed-tab-audience]:checked')].map((input) => input.value);
      targeting.audienceInversion = document.querySelector('input[name="feed-tab-audience-inversion"]:checked')?.value || '否';
      targeting.experimentId = document.querySelector('[data-feed-tab-targeting-field="experimentId"]')?.value || '';
      targeting.excludeExperiment = document.querySelector('[data-feed-tab-targeting-field="excludeExperiment"]')?.value || '';
      document.querySelectorAll('[data-feed-tab-platform]').forEach((input) => { targeting.platformVersions[input.dataset.feedTabPlatform].enabled = input.checked; });
      document.querySelectorAll('[data-feed-tab-version]').forEach((input) => { const [key, type] = input.dataset.feedTabVersion.split(':'); targeting.platformVersions[key][type] = input.value; });
      targeting.onlineStart = document.querySelector('[data-feed-tab-targeting-field="onlineStart"]')?.value || '';
      targeting.onlineEnd = document.querySelector('[data-feed-tab-targeting-field="onlineEnd"]')?.value || '';
      targeting.status = document.querySelector('input[name="feed-tab-status"]:checked')?.value || '上线';
      tab.targeting = targeting;
    };
    document.getElementById('page-root').addEventListener('click', async (event) => {
      const tabButton = event.target.closest('[data-feed-tab]');
      if (tabButton) { draft.activeTabId = tabButton.dataset.feedTab; renderAll(); return; }
      if (event.target.closest('#feed-tab-add')) { const tab = this.createTab(); draft.tabs.push(tab); draft.activeTabId = tab.id; renderAll(); return; }
      const deleteButton = event.target.closest('[data-feed-image-delete]');
      if (deleteButton) { activeTab()[deleteButton.dataset.feedImageDelete] = ''; renderAll(); return; }
      if (event.target.closest('#feed-undo')) { draft = this.clone(saved); renderAll(); return; }
      if (event.target.closest('#feed-save')) {
        const tab = activeTab();
        if (tab) readTargeting(tab);
        const invalid = draft.tabs.map((item) => this.validate(item)).find(Boolean);
        if (invalid) { window.BackofficeLayout.showToast?.(invalid); return; }
        saved = this.clone(draft); this.saveState(saved); updateActions(); window.BackofficeLayout.showToast?.('信息流配置已保存');
      }
    });
    document.getElementById('page-root').addEventListener('input', (event) => {
      const tab = activeTab(); if (!tab) return;
      if (event.target.matches('[data-feed-field]')) { tab[event.target.dataset.feedField] = event.target.value; updateActions(); return; }
      if (event.target.closest('.feed-tab-form')) { readTargeting(tab); updateActions(); }
    });
    document.getElementById('page-root').addEventListener('change', async (event) => {
      const filter = event.target.closest('[data-feed-filter] input');
      if (filter) { const group = filter.closest('[data-feed-filter]').dataset.feedFilter; filter.checked ? filters[group].add(filter.value) : filters[group].delete(filter.value); renderAll(); return; }
      const imageInput = event.target.closest('[data-feed-image]');
      if (imageInput?.files?.[0]) { activeTab()[imageInput.dataset.feedImage] = await this.readImage(imageInput.files[0]); renderAll(); return; }
      const tab = activeTab(); if (tab && event.target.closest('.feed-tab-form')) { readTargeting(tab); updateActions(); }
    });
    renderAll();
  }
};
