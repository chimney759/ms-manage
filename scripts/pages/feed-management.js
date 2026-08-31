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
  createOperationPopupConfig(data = {}) {
    const defaults = {
      app: '美柚省钱App',
      activityName: '',
      position: '首页',
      routeType: '',
      targetPage: '',
      routeProtocol: '',
      routeDescription: '',
      pid: '',
      selectedPid: '',
      mallId: '',
      skipType: '',
      mainImage: '',
      popupLogo: '',
      popupCopy: '',
      fallbackImage: '',
      hotAreas: [],
      sortValue: '',
      tabReminder: 'none',
      repeatType: 'daily',
      showAllDay: true,
      showStart: '00:00',
      showEnd: '23:59',
      pushDailyLimit: 1,
      pushTotalLimit: 1,
      onlineStart: '',
      onlineEnd: '',
      status: '已下线',
      targeting: window.ConfigurationSections.createTargeting(),
      testPlan: window.ConfigurationSections.createTestPlan()
    };
    return {
      ...defaults,
      ...data,
      hotAreas: Array.isArray(data.hotAreas) ? data.hotAreas.map((area, index) => ({
        id: area.id || `operation-popup-hot-area-${Date.now()}-${index}`,
        name: '', x: '', y: '', width: '', height: '', routeProtocol: '', ...area
      })) : [],
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
      sortValue: '',
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
      components: Array.isArray(data.components) ? data.components.map((component) => ({ ...component, assets: Array.isArray(component.assets) ? component.assets : (component.slots || []).map(() => ''), mosaic: component.type === 'mosaic' ? this.createMosaicConfig(component.mosaic) : component.mosaic, redPacket: component.type === 'red-packet-delivery' ? this.createRedPacketConfig(component.redPacket) : component.redPacket, operationPopup: component.type === 'normal-popup' ? this.createOperationPopupConfig(component.operationPopup) : component.operationPopup, targeting: component.type === 'mosaic' ? window.ConfigurationSections.normalizeTargeting(component.targeting) : component.targeting, testPlan: component.type === 'mosaic' ? window.ConfigurationSections.normalizeTestPlan(component.testPlan) : component.testPlan, isSaved: component.isSaved ?? true, hasBeenSaved: component.hasBeenSaved ?? true })) : [],
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
      'native-slider': { label: '信息流-原生滑块', slots: ['精选返现', '限时好价', '热销推荐'] },
      'normal-popup': { label: '常规弹窗', slots: ['运营活动提醒'] }
    };
    const definition = definitions[type] || definitions.mosaic;
    return { id: `feed-component-${Date.now()}-${Math.random().toString(16).slice(2)}`, type, recordName: definition.label, assets: definition.slots.map(() => ''), mosaic: type === 'mosaic' ? this.createMosaicConfig() : undefined, redPacket: type === 'red-packet-delivery' ? this.createRedPacketConfig({ name: definition.label }) : undefined, operationPopup: type === 'normal-popup' ? this.createOperationPopupConfig() : undefined, targeting: type === 'mosaic' ? window.ConfigurationSections.createTargeting() : undefined, testPlan: type === 'mosaic' ? window.ConfigurationSections.createTestPlan() : undefined, isSaved: false, hasBeenSaved: false, ...definition };
  },
  createDefaultState() {
    const tabs = [
      this.createTab({ id: 'feed-live', tabName: '直播间返现', recordName: '直播间返现', sortValue: '99994', status: '上线中', resourceStatus: '上线中', isSaved: true }),
      this.createTab({ id: 'feed-jd', tabName: '京东购物车', recordName: '京东购物车（896）', sortValue: '99993', status: '上线中', resourceStatus: '上线中', isSaved: true }),
      this.createTab({ id: 'feed-takeout', tabName: '外卖返现', recordName: '外卖返现', sortValue: '99992', status: '待上线', resourceStatus: '待上线', isSaved: true }),
      this.createTab({ id: 'feed-redpacket', tabName: '红包', recordName: '红包', sortValue: '99991', status: '已下线', resourceStatus: '已下线', isSaved: true })
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
  renderEmbedded({ showTabStatus = true, resourceStatusLabel = '资源位状态', showPreviewTabNav = true, previewTitle = '页面预览', previewDescription = '当前 Tab 资源位', componentToolNote = '保存当前 Tab 后可拖入信息流组件', componentTools = null, sortPopupPreviewByPriority = false, focusedEditor = false, operationPopupListWorkspace = false, operationPopupStandaloneEditor = false } = {}) {
    const tools = componentTools || [
      { type: 'mosaic', icon: '◫', label: '信息流-拼图', description: '活动素材组合展示' },
      { type: 'red-packet-delivery', icon: '￥', label: '信息流-红包发放功能', description: '红包权益发放展示' },
      { type: 'native-slider', icon: '↔', label: '信息流-原生滑块', description: '横向内容滑动展示' }
    ];
    const toolMarkup = tools.map((tool) => `<button class="home-tool" type="button" draggable="true" data-feed-component-add="${this.escape(tool.type)}"><b>${this.escape(tool.icon)}</b><span>${this.escape(tool.label)}</span><small>${this.escape(tool.description)}</small></button>`).join('');
    const collapseIcon = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M9.75 3.5 5.25 8l4.5 4.5" /></svg>';
    const toolToggle = focusedEditor ? `<button class="feed-workspace-collapse" type="button" data-feed-workspace-toggle="tools" aria-expanded="true" aria-label="收起组件区" title="收起组件区">${collapseIcon}</button>` : '';
    const previewToggle = focusedEditor ? `<button class="feed-workspace-collapse" type="button" data-feed-workspace-toggle="preview" aria-expanded="true" aria-label="收起预览区" title="收起预览区">${collapseIcon}</button>` : '';
    const preview = `<section class="home-marketing-preview feed-marketing-preview"><div class="style-panel-heading"><div class="feed-workspace-panel-heading"><h2>${this.escape(previewTitle)}</h2>${previewDescription ? `<span>${this.escape(previewDescription)}</span>` : ''}</div>${previewToggle}</div><div class="feed-embedded-filter-bar" id="feed-embedded-filters" data-feed-resource-status-label="${this.escape(resourceStatusLabel)}"></div><div class="feed-embedded-preview" id="feed-embedded-preview"></div></section>`;
    if (operationPopupListWorkspace) {
      return `<section class="home-marketing-builder feed-marketing-builder is-popup-list-workspace" id="feed-marketing-builder" data-feed-show-tab-status="${showTabStatus}"><aside class="home-marketing-settings feed-marketing-settings feed-operation-popup-list-settings"><div class="style-panel-heading"><div><h2>弹窗列表</h2><span>当前导航下已保存的运营弹窗配置</span></div><div class="marketing-page-actions" id="operation-popup-list-actions"></div></div><div class="home-config-content" id="feed-embedded-config-content"></div></aside></section>`;
    }
    if (operationPopupStandaloneEditor) {
      return `<section class="operation-popup-standalone-editor" id="feed-marketing-builder"><div class="operation-popup-standalone-heading"><h2>弹窗配置</h2></div><div class="operation-popup-standalone-content" id="feed-embedded-config-content"></div><div class="operation-popup-standalone-actions"><button class="button primary" id="save-feed-tab" type="button">保存</button></div></section>`;
    }
    return `<section class="home-marketing-builder feed-marketing-builder${sortPopupPreviewByPriority ? ' is-popup-priority-preview' : ''}${focusedEditor ? ' is-focused-editor' : ''}" id="feed-marketing-builder" data-feed-show-tab-status="${showTabStatus}"><aside class="home-marketing-tools feed-marketing-tools"><div class="feed-workspace-panel-heading"><h2>组件</h2>${toolToggle}</div><p id="feed-component-tools-note">${this.escape(componentToolNote)}</p><div class="home-tool-list">${toolMarkup}</div></aside>${preview}<aside class="home-marketing-settings feed-marketing-settings"><div class="style-panel-heading"><h2>配置</h2><span id="feed-embedded-config-type">未选择 Tab</span></div><div class="home-config-content" id="feed-embedded-config-content"></div><div class="home-config-actions"><button class="button secondary home-remove-component-action" id="remove-feed-component" type="button" hidden>移除组件</button><span class="home-component-save-tooltip" data-tooltip="点击编辑当前选中的 Tab 或组件。"><button class="button primary is-edit-action" id="save-feed-tab" type="button">编辑</button></span></div></aside></section>`;
  },
  renderEmbeddedComponent(component, selectedComponentId = '', readonly = false) {
    const slots = component.slots || [];
    const activeClass = component.id === selectedComponentId ? ' is-active' : '';
    const unsavedClass = component.isSaved ? '' : ' is-unsaved';
    const interaction = readonly ? ' draggable="false" tabindex="-1" aria-disabled="true"' : ' draggable="true"';
    if (component.type === 'mosaic') {
      const mosaic = this.createMosaicConfig(component.mosaic);
      const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0];
      const mosaicImage = position.image ? `<img class="feed-preview-mosaic-image" src="${position.image}" alt="拼图素材预览" />` : '';
      return `<button class="feed-preview-component feed-preview-mosaic${activeClass}${unsavedClass}${position.image ? ' has-image' : ''}" type="button"${interaction} data-feed-preview-component="${this.escape(component.id)}">${mosaicImage}<span><small>限时福利</small><b>${this.escape(slots[0] || '福利活动主会场')}</b></span><i>${this.escape(slots[1] || '限时好礼')}</i></button>`;
    }
    if (component.type === 'normal-popup') {
      const popup = this.createOperationPopupConfig(component.operationPopup);
      const image = popup.mainImage ? `<img src="${popup.mainImage}" alt="弹窗主图" />` : '<span class="feed-preview-normal-popup-placeholder" aria-label="弹窗主图"></span>';
      return `<button class="feed-preview-component feed-preview-normal-popup${activeClass}${unsavedClass}" type="button"${interaction} data-feed-preview-component="${this.escape(component.id)}"><span class="feed-preview-normal-popup-media">${image}</span><span class="feed-preview-normal-popup-close" aria-label="关闭">&times;</span></button>`;
    }
    if (component.type === 'grid') return `<button class="feed-preview-component feed-preview-grid${activeClass}${unsavedClass}" type="button"${interaction} data-feed-preview-component="${this.escape(component.id)}"><b>精选权益</b><span>${slots.map((slot) => `<i>${this.escape(slot)}</i>`).join('')}</span></button>`;
    if (component.type === 'native-slider') return `<button class="feed-preview-component feed-preview-native-slider${activeClass}${unsavedClass}" type="button"${interaction} data-feed-preview-component="${this.escape(component.id)}"><span>${slots.map((slot, index) => `<i class="${index === 0 ? 'is-active' : ''}">${this.escape(slot)}</i>`).join('')}</span><small><b></b><b></b><b></b></small></button>`;
    return `<button class="feed-preview-component feed-preview-red-packet${activeClass}${unsavedClass}" type="button"${interaction} data-feed-preview-component="${this.escape(component.id)}"><span><small>福利红包</small><b>${this.escape(slots[0] || '福利红包')}</b></span><i>立即领取</i></button>`;
  },
  renderEmbeddedPreview(tab, tabs = [], selectedComponentId = '', readonlyTopPreview = '', showPreviewTabNav = true, sortPopupPreviewByPriority = false, preservePopupDraftOrder = false, readonly = false) {
    if (!tab) return '<div class="feed-tab-empty"><b>当前筛选条件下暂无 Tab</b><span>可调整上方状态筛选，或新增 Tab。</span></div>';
    const previewTabs = tabs.length ? tabs : [tab];
    const tabNav = previewTabs.map((item) => {
      const iconPreview = item.iconImage ? `<img src="${item.iconImage}" alt="" />` : '<span>Tab</span>';
      const active = item.id === tab.id;
      return `<button class="feed-app-tab${active ? ' is-active' : ''}" type="button" role="tab" aria-selected="${active}" data-feed-preview-tab="${this.escape(item.id)}"><i class="feed-app-icon">${iconPreview}</i>${this.escape(item.tabName || '未命名 Tab')}${this.renderBadge(item)}</button>`;
    }).join('');
    const components = (tab.components || []).map((component, index) => ({ component, index }));
    if (sortPopupPreviewByPriority && !preservePopupDraftOrder) {
      components.sort((left, right) => {
        const leftValue = Number(this.createOperationPopupConfig(left.component.operationPopup).sortValue);
        const rightValue = Number(this.createOperationPopupConfig(right.component.operationPopup).sortValue);
        const leftHasValue = Number.isFinite(leftValue) && String(this.createOperationPopupConfig(left.component.operationPopup).sortValue).trim() !== '';
        const rightHasValue = Number.isFinite(rightValue) && String(this.createOperationPopupConfig(right.component.operationPopup).sortValue).trim() !== '';
        if (leftHasValue && rightHasValue && leftValue !== rightValue) return rightValue - leftValue;
        if (leftHasValue !== rightHasValue) return leftHasValue ? -1 : 1;
        return left.index - right.index;
      });
    }
    const content = components.length
      ? components.map(({ component }) => this.renderEmbeddedComponent(component, selectedComponentId, readonly)).join('')
      : `<div class="feed-preview-empty"><b>${readonly ? '-' : '+'}</b><span>${readonly ? '暂无可预览的弹窗' : '从左侧拖入信息流组件'}</span></div>`;
    const navigation = showPreviewTabNav ? `<div class="feed-app-tabs" role="tablist" aria-label="信息流 Tab 预览导航"><div class="feed-app-tab-list">${tabNav}</div><button class="feed-app-tab-add" type="button" title="添加 Tab" aria-label="添加 Tab" data-feed-preview-add>+</button></div>` : '';
    return `<section class="feed-tab-preview feed-embedded-preview-card" aria-label="Tab 前台预览">${readonlyTopPreview}${navigation}<div class="feed-preview-drop-zone${sortPopupPreviewByPriority ? ' operation-popup-preview-stack' : ''}" data-feed-preview-drop-zone>${content}</div></section>`;
  },
  renderEmbeddedConfig(tab) {
    if (!tab) return '<div class="style-config-empty">请选择预览中的 Tab，或点击加号新增 Tab 进行配置</div>';
    let field = (label, control) => `<div class="config-field"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    const productFeed = this.createProductFeedConfig(tab.productFeed);
    tab.productFeed = productFeed;
    const productSourceOptions = productFeed.source === 'third-party'
      ? [['api-feed-001', '商品流 API-001'], ['api-feed-002', '商品流 API-002']]
      : [['activity-library', '活动商品库'], ['featured-library', '精选商品库'], ['high-commission-library', '高佣商品库']];
    const productFeedFields = `${field('商品数据来源', `<select class="control" data-feed-product-flow-field="source"><option value="app-library"${productFeed.source === 'app-library' ? ' selected' : ''}>应用库</option><option value="third-party"${productFeed.source === 'third-party' ? ' selected' : ''}>三方API</option></select>`)}${field('商品数据来源', `<select class="control" data-feed-product-flow-field="dataKey"><option value="">请选择数据商品来源</option>${productSourceOptions.map(([value, label]) => `<option value="${value}"${productFeed.dataKey === value ? ' selected' : ''}>${label}</option>`).join('')}</select>`)}${productFeed.source === 'third-party' ? field('<b class="field-required">*</b>关联PID', `<select class="control" data-feed-product-flow-field="pid"><option value="">请选择关联PID</option><option value="default-pid"${productFeed.pid === 'default-pid' ? ' selected' : ''}>默认PID</option><option value="pid-jd-001"${productFeed.pid === 'pid-jd-001' ? ' selected' : ''}>PID-京东-001</option><option value="pid-taobao-002"${productFeed.pid === 'pid-taobao-002' ? ' selected' : ''}>PID-淘宝-002</option></select>`) : ''}`;
    return `<div class="style-config-form feed-tab-form"><section class="home-entry-info-section shared-config-section"><h3>基本信息</h3>${field('<b class="field-required">*</b>Tab名称 <button class="help-tooltip" type="button" aria-label="Tab名称说明" data-tooltip="用户端可见">?</button>', `<input class="control" data-feed-embedded-field="tabName" value="${this.escape(tab.tabName)}" maxlength="12" placeholder="请输入 Tab 名称" />`)}${field('<b class="field-required">*</b>记录名称', `<input class="control" data-feed-embedded-field="recordName" value="${this.escape(tab.recordName)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}${this.renderImageControl('icon图片', 'iconImage', tab.iconImage)}${this.renderImageControl('角标图片', 'cornerImage', tab.cornerImage, '尾标图片优先于角标图片展示；尾标和角标互斥，前台仅展示一个。')}${this.renderImageControl('尾标图片', 'tailImage', tab.tailImage, '仅限 v8.95.0 及以上版本可用。')}</section><section class="home-entry-info-section shared-config-section feed-product-flow-section"><h3>商品流配置</h3>${productFeedFields}</section>${window.ConfigurationSections.renderTargeting({ prefix: 'feed-tab', value: tab.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'feed-tab', value: tab.testPlan, description: '测试 UID 内的用户将在测试有效时间内看到此 Tab，到期自动终止，不影响正式配置。' })}</div>`;
  },
  renderEmbeddedComponentConfig(component, { tabReminderOptions = null, tabReminderNote = '', tabReminderReadonly = false } = {}) {
    let field = (label, control) => `<div class="config-field"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    if (component.type === 'normal-popup') {
      const popup = this.createOperationPopupConfig(component.operationPopup);
      component.operationPopup = popup;
      const asset = (label, key, image) => `<div class="operation-popup-asset"><span class="operation-popup-asset-preview">${image ? `<img src="${image}" alt="已上传${label}" />` : '<b>图片</b>'}</span><span class="operation-popup-asset-actions"><label class="button secondary home-entry-upload">上传图片<input type="file" accept="image/*" data-operation-popup-image="${key}" /></label><button class="home-entry-delete" type="button" data-operation-popup-delete="${key}"${image ? '' : ' disabled'}>删除图片</button></span></div>`;
      const hotAreas = popup.hotAreas.map((area, index) => `<div class="operation-popup-hot-area" data-operation-popup-hot-area-row="${this.escape(area.id)}"><div class="operation-popup-hot-area-heading"><b>热区 ${index + 1}</b><button class="text-button" type="button" data-operation-popup-hot-area-remove="${this.escape(area.id)}">移除</button></div><div class="operation-popup-hot-area-grid"><label>名称<input class="control" data-operation-popup-hot-area="${this.escape(area.id)}:name" value="${this.escape(area.name)}" placeholder="如：主按钮" /></label><label>X<input class="control" type="number" min="0" data-operation-popup-hot-area="${this.escape(area.id)}:x" value="${this.escape(area.x)}" /></label><label>Y<input class="control" type="number" min="0" data-operation-popup-hot-area="${this.escape(area.id)}:y" value="${this.escape(area.y)}" /></label><label>宽<input class="control" type="number" min="0" data-operation-popup-hot-area="${this.escape(area.id)}:width" value="${this.escape(area.width)}" /></label><label>高<input class="control" type="number" min="0" data-operation-popup-hot-area="${this.escape(area.id)}:height" value="${this.escape(area.height)}" /></label><label class="operation-popup-hot-area-route">跳转协议<input class="control" data-operation-popup-hot-area="${this.escape(area.id)}:routeProtocol" value="${this.escape(area.routeProtocol)}" placeholder="请输入路由协议" /></label></div></div>`).join('');
      const routeTarget = popup.routeType === 'protocol'
        ? `<div class="operation-popup-route-config"><div class="operation-popup-route-heading"><span>跳转类型：</span><button class="operation-popup-route-example" type="button" data-tooltip="请按路由协议规范填写跳转地址。">路由协议填写示例</button></div><div class="operation-popup-route-row"><input class="control" data-operation-popup-field="routeProtocol" value="${this.escape(popup.routeProtocol)}" placeholder="请输入路由协议" /></div><div class="operation-popup-route-input"><input class="control" data-operation-popup-field="pid" value="${this.escape(popup.pid)}" placeholder="pid（除京东&拼多多&抖音&1688，其余商城用于埋点上报）" disabled /><button class="help-tooltip" type="button" aria-label="PID说明" data-tooltip="用于商城埋点上报的 PID 配置。">?</button></div><div class="operation-popup-route-input"><select class="control" data-operation-popup-field="selectedPid"><option value="">请选择pid</option><option value="default"${popup.selectedPid === 'default' ? ' selected' : ''}>默认pid</option><option value="custom"${popup.selectedPid === 'custom' ? ' selected' : ''}>自定义pid</option></select><button class="help-tooltip" type="button" aria-label="PID选择说明" data-tooltip="京东&拼多多&抖音&1688根据填入的pid进行转链跟单，其余商城根据联盟后台转链的pid进行跟单">?</button></div><div class="operation-popup-route-input"><input class="control" data-operation-popup-field="skipType" value="${this.escape(popup.skipType)}" placeholder="skip_type（用于埋点上报）" /><button class="help-tooltip" type="button" aria-label="skip_type说明" data-tooltip="跳转类型为【自定义协议】需填写用于埋点上报的skip_type，具体枚举值如下：101：淘宝商详；102：淘宝；104：京东；106：跳唯品会；108：跳拼多多；109：跳抖音；110：跳美团；111：跳饿了么；112：比价寄；113：考拉海购；114：亿起发；115：多麦；116：微信小程序；117：支付宝小程序；118：大后天；119：饿了么微信小程序；120：商城直充（话费、月卡等充值页）；121：有票票；122：聚推客；123：卡券类（如：keep、三只松鼠等）；127：滴滴；128：抖音_好单库_活动；131：抖音_好单库_团购活动；132：抖音_官方_电商活动；134：抖音_官方_团购活动；137：1688活动；139：抖音_sdk_活动。">?</button></div>${field('<b class="field-required">*</b>地址/协议说明 <button class="help-tooltip" type="button" aria-label="地址/协议说明" data-tooltip="用于说明该自定义地址或协议的跳转用途">?</button>', `<input class="control" data-operation-popup-field="routeDescription" value="${this.escape(popup.routeDescription)}" maxlength="100" placeholder="请输入地址/协议说明" />`)}</div>`
        : field('<b class="field-required">*</b>目标页面', `<select class="control" data-operation-popup-field="targetPage"><option value="">请选择目标页面</option>${['商品收藏', '购物车返现', '领现金', '省钱秘籍'].map((page) => `<option value="${page}"${popup.targetPage === page ? ' selected' : ''}>${page}</option>`).join('')}</select>`);
      const plainField = field;
      const reminderOptions = tabReminderOptions || [
        { value: 'none', label: '不展示红点' },
        { value: 'single-red-dot', label: '单纯红点' },
        { value: 'new-red-dot', label: 'new样式红点' },
        { value: 'number-red-dot', label: '数字红点' }
      ];
      if (!reminderOptions.some((option) => option.value === popup.tabReminder)) popup.tabReminder = reminderOptions[0].value;
      const tabReminderControl = `<select class="control operation-popup-tab-reminder" data-operation-popup-field="tabReminder"${tabReminderReadonly ? ' disabled' : ''}>${reminderOptions.map((option) => `<option value="${this.escape(option.value)}"${popup.tabReminder === option.value ? ' selected' : ''}>${this.escape(option.label)}</option>`).join('')}</select>${tabReminderNote ? `<p class="operation-popup-field-note">${this.escape(tabReminderNote)}</p>` : ''}`;
      const tabReminderSection = `<section class="home-entry-info-section shared-config-section operation-popup-tab-reminder-section"><h3>Tab提醒配置</h3>${plainField('<b class="field-required">*</b>Tab栏提醒方式 <button class="help-tooltip" type="button" aria-label="Tab栏提醒方式说明" data-tooltip="若重复展示设置特定时间段，则不展示红点；如果要展示红点，请设置重复展示为全天。">?</button>', tabReminderControl)}</section>`;
      const displayRulePrefix = plainField('<b class="field-required">*</b>重复展示', `<div class="operation-popup-repeat"><select class="control" data-operation-popup-field="repeatType"><option value="daily"${popup.repeatType === 'daily' ? ' selected' : ''}>每天</option></select><span>重复，</span><label class="operation-popup-all-day"><input type="checkbox" data-operation-popup-field="showAllDay"${popup.showAllDay ? ' checked' : ''} />全天</label>${popup.showAllDay ? '<span class="operation-popup-repeat-all-day">可展示</span>' : `<div class="operation-popup-time-range"><input class="control" type="time" data-operation-popup-field="showStart" value="${this.escape(popup.showStart)}" /><span>至</span><input class="control" type="time" data-operation-popup-field="showEnd" value="${this.escape(popup.showEnd)}" /><span>可展示</span></div>`}</div>`);
      field = (label, control) => label.includes('推送频次') ? `${displayRulePrefix}${plainField(label, control)}` : plainField(label, control);
      return `<div class="style-config-form feed-component-form operation-popup-form"><section class="home-entry-info-section shared-config-section"><h3>基础信息</h3>${field('App', '<input class="control operation-popup-app" value="美柚省钱App" disabled />')}${field('所属位置 <button class="help-tooltip" type="button" aria-label="所属位置说明" data-tooltip="指在「美柚省钱」App中的展示位置">?</button>', `<input class="control operation-popup-app" value="${this.escape(popup.position || '首页')}" disabled />`)}${field('<b class="field-required">*</b>活动名称 <button class="help-tooltip" type="button" aria-label="活动名称说明" data-tooltip="后台记录的名称，用户不可见">?</button>', `<input class="control" data-operation-popup-field="activityName" value="${this.escape(popup.activityName)}" maxlength="30" placeholder="请输入活动名称" />`)}</section><section class="home-entry-info-section shared-config-section"><h3>跳转配置</h3>${field('<b class="field-required">*</b>跳转类型', `<select class="control" data-operation-popup-field="routeType"><option value="">请选择跳转类型</option><option value="page"${popup.routeType === 'page' ? ' selected' : ''}>页面跳转</option><option value="protocol"${popup.routeType === 'protocol' ? ' selected' : ''}>自定义地址/协议</option></select>`)}${routeTarget}</section><section class="home-entry-info-section shared-config-section"><h3>素材信息</h3>${field('<b class="field-required">*</b>弹窗主图', asset('弹窗主图', 'mainImage', popup.mainImage), 'operation-popup-asset-field')}${field('兜底图片 <button class="help-tooltip" type="button" aria-label="兜底图片说明" data-tooltip="如该弹窗原本需要配置成pag类型，但鸿蒙等系统不支持pag，可多配置一张非pag类型的兜底图，兜底图会在pag不支持时展示。">?</button>', asset('兜底图片', 'fallbackImage', popup.fallbackImage), 'operation-popup-asset-field')}${field('点击热区 <button class="help-tooltip" type="button" aria-label="点击热区说明" data-tooltip="热区坐标以图片左上角为原点(0,0)，X轴向右递增，Y轴向下递增，可配置多个；不配置时默认全部区域都可点击。">?</button>', `<div class="operation-popup-hot-areas">${hotAreas || '<p>暂未添加点击热区</p>'}<button class="button secondary" type="button" data-operation-popup-hot-area-add>+ 添加热区</button></div>`, 'operation-popup-hot-area-field')}${field('排序级别 <button class="help-tooltip" type="button" aria-label="排序级别说明" data-tooltip="保存后数字越大，弹窗越靠前展示。">?</button>', `<input class="control operation-popup-sort-value" type="number" min="0" step="1" data-operation-popup-field="sortValue" value="${this.escape(popup.sortValue)}" placeholder="请输入排序级别" />`)}</section><section class="home-entry-info-section shared-config-section"><h3>出站过程配置</h3>${field('出站弹窗Logo', asset('Logo', 'popupLogo', popup.popupLogo), 'operation-popup-asset-field')}${field('出站弹窗文案', `<input class="control" data-operation-popup-field="popupCopy" value="${this.escape(popup.popupCopy)}" maxlength="50" placeholder="请输入出站弹窗文案" />`)}</section>${tabReminderSection}${window.ConfigurationSections.renderTargeting({ prefix: 'operation-popup', value: popup.targeting, includeSchedule: false, required: true })}<section class="home-entry-info-section shared-config-section"><h3>展示规则</h3>${field('<b class="field-required">*</b>推送频次', `<div class="operation-popup-frequency"><label>每人每日<input class="control" type="number" min="1" data-operation-popup-field="pushDailyLimit" value="${this.escape(popup.pushDailyLimit)}" />次</label><label>总共<input class="control" type="number" min="1" data-operation-popup-field="pushTotalLimit" value="${this.escape(popup.pushTotalLimit)}" />次</label></div>`)}${field('<b class="field-required">*</b>上下线时间', `<div class="config-date-range"><label><span>开始</span><input class="control" type="datetime-local" data-operation-popup-field="onlineStart" value="${this.escape(popup.onlineStart)}" /></label><label><span>结束</span><input class="control" type="datetime-local" data-operation-popup-field="onlineEnd" value="${this.escape(popup.onlineEnd)}" /></label></div>`)}${field('<b class="field-required">*</b>状态', `<span class="home-entry-status-control"><label><input type="radio" name="operation-popup-status" value="上线中"${popup.status === '上线中' ? ' checked' : ''} />上线中</label><label><input type="radio" name="operation-popup-status" value="已下线"${popup.status === '已下线' ? ' checked' : ''} />已下线</label></span>`)}</section>${window.ConfigurationSections.renderTestPlan({ prefix: 'operation-popup', value: popup.testPlan, description: '测试 UID 在有效期内可看到配置，到期自动终止，不影响正式配置。' })}</div>`;
    }
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
  bindEmbedded({ navigate, storageKey = this.storageKey, pageName = '首页信息流营销', renderReadonlyTopPreview = null, showTabStatus = true, resourceStatusLabel = '资源位状态', showPreviewTabNav = true, componentToolNote = '', defaultComponentType = 'mosaic', sortPopupPreviewByPriority = false, focusedEditor = false, configurationListMode = false, tabReminderOptions = null, tabReminderNote = '', tabReminderReadonly = false, operationPopupListWorkspace = false, operationPopupStandaloneEditor = false, onAddConfiguration = null, onEditConfiguration = null, onCopyConfiguration = null, createInitialOperationPopup = false, editorOperationPopupId = '', editorOperationPopupMode = 'add', onReturnToConfigurationList = null, operationPopupPosition = '首页', operationPopupPositionDisplay = operationPopupPosition } = {}) {
    const root = document.getElementById('feed-marketing-builder');
    if (!root) return;
    let saved = this.loadState(storageKey);
    if (operationPopupListWorkspace) {
      const actionContainer = document.getElementById('operation-popup-list-actions');
      const recentEdits = document.getElementById('marketing-recent-edits');
      document.getElementById('operation-popup-list-image-preview')?.remove();
      const imagePreview = document.createElement('div');
      imagePreview.id = 'operation-popup-list-image-preview';
      imagePreview.className = 'operation-popup-list-image-preview';
      imagePreview.hidden = true;
      document.body.append(imagePreview);
      const hideImagePreview = () => {
        imagePreview.hidden = true;
        imagePreview.replaceChildren();
      };
      const showImagePreview = (trigger, event) => {
        const image = trigger.dataset.operationPopupImagePreview;
        if (!image) return;
        imagePreview.innerHTML = `<img src="${this.escape(image)}" alt="弹窗主图放大预览" />`;
        imagePreview.hidden = false;
        const previewWidth = imagePreview.offsetWidth;
        const previewHeight = imagePreview.offsetHeight;
        imagePreview.style.left = `${Math.max(12, Math.min(event.clientX + 16, window.innerWidth - previewWidth - 12))}px`;
        imagePreview.style.top = `${Math.max(12, Math.min(event.clientY + 16, window.innerHeight - previewHeight - 12))}px`;
      };
      if (actionContainer) actionContainer.innerHTML = typeof onAddConfiguration === 'function' ? '<button class="button primary" id="add-operation-popup-configuration" type="button">添加弹窗</button>' : '';
      if (recentEdits) {
        recentEdits.innerHTML = '';
        recentEdits.hidden = true;
      }
      let listSort = { key: '', direction: 1 };
      let listFilters = { name: '', status: '' };
      const renderSortHeader = (key, label) => {
        const active = listSort.key === key;
        const direction = active ? (listSort.direction === 1 ? 'asc' : 'desc') : 'none';
        const icon = direction === 'asc'
          ? '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4.5 9.5 3.5-3.5 3.5 3.5" /></svg>'
          : direction === 'desc'
            ? '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" /></svg>'
            : '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4.75 6.25 3.25-3.25 3.25 3.25M4.75 9.75 8 13l3.25-3.25" /></svg>';
        return `<button class="feed-resource-list-sort" type="button" data-operation-popup-list-sort="${key}" aria-sort="${direction}"><span>${label}</span>${icon}</button>`;
      };
      const comparePopupRows = (left, right, key) => {
        if (key === 'sortValue') {
          const leftValue = Number(left.sortValue);
          const rightValue = Number(right.sortValue);
          const leftHasValue = Number.isFinite(leftValue) && left.sortValue !== '-';
          const rightHasValue = Number.isFinite(rightValue) && right.sortValue !== '-';
          if (leftHasValue !== rightHasValue) return leftHasValue ? -1 : 1;
          if (leftHasValue && leftValue !== rightValue) return leftValue - rightValue;
        }
        if (key === 'popupId') return Number(left.popupId) - Number(right.popupId);
        if (key === 'status') {
          const statusOrder = { '上线中': 1, '待上线': 2, '已下线': 3 };
          return (statusOrder[left.status] || 99) - (statusOrder[right.status] || 99);
        }
        return String(left[key] || '').localeCompare(String(right[key] || ''), 'zh-Hans-CN', { numeric: true });
      };
      const renderList = () => {
        hideImagePreview();
        const container = root.querySelector('#feed-embedded-config-content');
        const rows = this.getOperationPopupConfigurationRows(saved);
        const name = listFilters.name.trim().toLowerCase();
        const status = listFilters.status;
        const visibleRows = rows.filter((row) => (!name || row.name.toLowerCase().includes(name))
          && (!status || row.status === status));
        if (listSort.key) {
          visibleRows.sort((left, right) => comparePopupRows(left, right, listSort.key) * listSort.direction);
        }
        const tableBody = container.querySelector('[data-operation-popup-list-body]');
        if (!tableBody) return;
        tableBody.innerHTML = visibleRows.length
          ? visibleRows.map((row) => `<tr data-operation-popup-tab="${this.escape(row.tabId)}" data-operation-popup-component="${this.escape(row.id)}"><td>${this.escape(row.popupId)}</td><td>${this.escape(row.sortValue)}</td><td>${this.escape(row.name)}</td><td class="operation-popup-list-main-image">${row.mainImage ? `<span class="operation-popup-list-image-trigger" data-operation-popup-image-preview="${this.escape(row.mainImage)}"><img src="${this.escape(row.mainImage)}" alt="${this.escape(row.name)}弹窗主图" /></span>` : '<span class="operation-popup-list-image-empty">-</span>'}</td><td>${this.escape(row.position)}</td><td>${this.escape(row.targetAudience)}</td><td>${this.escape(row.pushFrequency)}</td><td>${this.escape(row.repeatDisplay)}</td><td>${this.escape(row.onlineTime)}</td><td>${this.escape(row.status)}</td><td>${this.escape(row.editor)}</td><td>${this.escape(row.updatedAt)}</td><td class="feed-resource-list-actions"><button class="text-button" type="button" data-operation-popup-list-edit>修改</button><button class="text-button" type="button" data-operation-popup-list-copy>复制</button></td></tr>`).join('')
          : '<tr><td class="feed-resource-list-empty" colspan="13">当前导航下暂无已保存的运营弹窗配置</td></tr>';
        container.querySelector('[data-operation-popup-list-count]').textContent = `共 ${visibleRows.length} 条`;
      };
      const renderWorkspace = () => {
        root.querySelector('#feed-embedded-config-content').innerHTML = `<div class="operation-popup-configuration-list"><div class="feed-resource-list-filters"><label>APP<input class="control" value="美柚省钱App" disabled /></label><label>所属位置<input class="control operation-popup-list-position-display" value="${this.escape(operationPopupPositionDisplay)}" disabled /></label><label>活动名称<input class="control" data-operation-popup-list-filter="name" value="${this.escape(listFilters.name)}" placeholder="请输入活动名称" /></label><label>状态<select class="control" data-operation-popup-list-filter="status"><option value="">全部</option><option value="上线中"${listFilters.status === '上线中' ? ' selected' : ''}>上线中</option><option value="待上线"${listFilters.status === '待上线' ? ' selected' : ''}>待上线</option><option value="已下线"${listFilters.status === '已下线' ? ' selected' : ''}>已下线</option></select></label><span class="feed-resource-list-filter-actions"><button class="button secondary" type="button" data-operation-popup-list-search>查询</button></span></div><div class="feed-resource-list-wrap"><table class="feed-resource-list-table"><thead><tr><th>${renderSortHeader('popupId', '弹窗ID')}</th><th>${renderSortHeader('sortValue', '排序级别')} <button class="help-tooltip feed-resource-list-sort-help" type="button" aria-label="排序级别说明" data-tooltip="保存后数字越大，弹窗越靠前展示">?</button></th><th>${renderSortHeader('name', '活动名称')}</th><th>弹窗主图</th><th>${renderSortHeader('position', '所属位置')}</th><th>${renderSortHeader('targetAudience', '指定人群')}</th><th>${renderSortHeader('pushFrequency', '推送频次')}</th><th>${renderSortHeader('repeatDisplay', '重复展示')}</th><th>${renderSortHeader('onlineTime', '上下线时间')}</th><th>${renderSortHeader('status', '状态')}</th><th>${renderSortHeader('editor', '最新编辑人')}</th><th>${renderSortHeader('updatedAt', '最后更新时间')}</th><th>操作</th></tr></thead><tbody data-operation-popup-list-body></tbody></table></div><div class="feed-resource-list-footer"><span data-operation-popup-list-count></span><span>仅展示当前导航下已保存的运营弹窗配置。</span></div></div>`;
        renderList();
      };
      renderWorkspace();
      actionContainer?.querySelector('#add-operation-popup-configuration')?.addEventListener('click', onAddConfiguration);
      root.addEventListener('change', (event) => {
        if (event.target.matches('[data-operation-popup-list-filter]')) {
          listFilters[event.target.dataset.operationPopupListFilter] = event.target.value;
          renderList();
        }
      });
      root.addEventListener('input', (event) => {
        if (event.target.matches('[data-operation-popup-list-filter]')) {
          listFilters[event.target.dataset.operationPopupListFilter] = event.target.value;
          renderList();
        }
      });
      root.addEventListener('pointerover', (event) => {
        const trigger = event.target.closest('[data-operation-popup-image-preview]');
        if (trigger && !trigger.contains(event.relatedTarget)) showImagePreview(trigger, event);
      });
      root.addEventListener('pointermove', (event) => {
        const trigger = event.target.closest('[data-operation-popup-image-preview]');
        if (trigger && !imagePreview.hidden) showImagePreview(trigger, event);
      });
      root.addEventListener('pointerout', (event) => {
        const trigger = event.target.closest('[data-operation-popup-image-preview]');
        if (trigger && !trigger.contains(event.relatedTarget)) hideImagePreview();
      });
      root.addEventListener('click', (event) => {
        hideImagePreview();
        if (event.target.closest('[data-operation-popup-list-search]')) renderList();
        const sortButton = event.target.closest('[data-operation-popup-list-sort]');
        if (sortButton) {
          const key = sortButton.dataset.operationPopupListSort;
          listSort = { key, direction: listSort.key === key ? -listSort.direction : 1 };
          renderWorkspace();
          return;
        }
        const row = event.target.closest('[data-operation-popup-component]');
        if (row && event.target.closest('[data-operation-popup-list-edit]')) {
          onEditConfiguration?.({ tabId: row.dataset.operationPopupTab, componentId: row.dataset.operationPopupComponent });
          return;
        }
        if (row && event.target.closest('[data-operation-popup-list-copy]')) {
          onCopyConfiguration?.({ tabId: row.dataset.operationPopupTab, componentId: row.dataset.operationPopupComponent });
        }
      });
      window.BackofficeLayout.bindGlobalTooltips();
      return { guardNavigation: () => false };
    }
    let draft = this.clone(saved);
    let filters = { status: new Set(['上线中', '待上线', '已下线']), resourceStatus: new Set(['上线中', '待上线', '已下线']) };
    let draggedToolType = '';
    let draggedComponentId = '';
    let selectedComponentId = '';
    let popupOrderPending = false;
    const collapsedWorkspacePanels = { tools: false, preview: false };
    const applyWorkspaceLayout = () => {
      if (!focusedEditor) return;
      root.classList.toggle('is-tools-collapsed', collapsedWorkspacePanels.tools);
      root.classList.toggle('is-preview-collapsed', collapsedWorkspacePanels.preview);
      root.querySelectorAll('[data-feed-workspace-toggle]').forEach((button) => {
        const panel = button.dataset.feedWorkspaceToggle;
        const isCollapsed = collapsedWorkspacePanels[panel];
        const name = panel === 'tools' ? '组件区' : '预览区';
        button.setAttribute('aria-expanded', String(!isCollapsed));
        button.setAttribute('aria-label', `${isCollapsed ? '展开' : '收起'}${name}`);
        button.setAttribute('title', `${isCollapsed ? '展开' : '收起'}${name}`);
        button.classList.toggle('is-collapsed', isCollapsed);
      });
    };
    const renderPreview = (tab) => this.renderEmbeddedPreview(
      tab,
      draft.tabs,
      selectedComponentId,
      typeof renderReadonlyTopPreview === 'function' ? renderReadonlyTopPreview() : '',
      showPreviewTabNav,
      sortPopupPreviewByPriority,
      popupOrderPending
    );
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
    if (editorOperationPopupId) {
      const tab = activeTab();
      const source = tab?.components.find((component) => component.id === editorOperationPopupId && component.type === 'normal-popup');
      if (source) {
        if (editorOperationPopupMode === 'copy') {
          const component = this.clone(source);
          component.id = this.createFeedComponent('normal-popup').id;
          component.operationPopup = this.createOperationPopupConfig(component.operationPopup);
          component.operationPopup.activityName = `copy${component.operationPopup.activityName || source.recordName || source.label}`;
          component.recordName = component.operationPopup.activityName;
          component.isSaved = false;
          component.hasBeenSaved = false;
          tab.components.push(component);
          selectedComponentId = component.id;
        } else {
          selectedComponentId = source.id;
        }
        editSession.startEditing();
      }
    } else if (createInitialOperationPopup) {
      const tab = activeTab();
      if (tab) {
        const component = this.createFeedComponent('normal-popup');
        component.operationPopup.position = operationPopupPosition;
        tab.components.push(component);
        selectedComponentId = component.id;
        editSession.startEditing();
      }
    }
    const commitPopupDragOrder = (tab) => {
      const popupComponents = (tab?.components || []).filter((component) => component.type === 'normal-popup');
      popupComponents.forEach((component, index) => {
        component.operationPopup = this.createOperationPopupConfig(component.operationPopup);
        component.operationPopup.sortValue = String(99999 - index);
      });
    };
    const actionContainer = document.getElementById('marketing-page-actions');
    if (actionContainer) {
      actionContainer.innerHTML = typeof onReturnToConfigurationList === 'function'
        ? '<button class="button secondary" id="return-operation-popup-configuration-list" type="button">返回配置列表</button>'
        : `<button class="button secondary" id="view-embedded-feed-configuration-list" type="button">${configurationListMode ? '查看配置列表' : '查看Tab列表'}</button>`;
      actionContainer.querySelector('#return-operation-popup-configuration-list')?.addEventListener('click', () => {
        editSession.guardNavigation(onReturnToConfigurationList) || onReturnToConfigurationList();
      });
      actionContainer.querySelector('#view-embedded-feed-configuration-list')?.addEventListener('click', () => {
        if (configurationListMode) {
          this.openOperationPopupConfigurationList({
            title: `${pageName}配置列表`,
            state: saved,
            onEdit: (tabId, componentId) => {
              draft.activeTabId = tabId;
              selectedComponentId = componentId;
              editSession.startEditing();
              renderAll();
              requestAnimationFrame(() => root.querySelector(`[data-feed-preview-component="${componentId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
            }
          });
          return;
        }
        this.openTabList({
          title: `${pageName}Tab列表`,
          state: saved,
          onEdit: (tabId) => {
            draft.activeTabId = tabId;
            selectedComponentId = '';
            editSession.startEditing();
            renderAll();
            requestAnimationFrame(() => root.querySelector('#feed-embedded-config-content')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
          },
          onManageResources: (tabId) => {
            const tab = draft.tabs.find((item) => item.id === tabId);
            if (!tab) return;
            this.openResourceList({
              tab,
              title: `${tab.tabName || '未命名 Tab'}展位管理`,
              onEdit: (componentId) => {
                draft.activeTabId = tabId;
                selectedComponentId = componentId;
                editSession.startEditing();
                renderAll();
                requestAnimationFrame(() => root.querySelector(`[data-feed-preview-component="${componentId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
              },
              onAdd: () => {
                draft.activeTabId = tabId;
                const component = this.createFeedComponent(defaultComponentType);
                tab.components.push(component);
                selectedComponentId = component.id;
                editSession.startEditing();
                renderAll();
                requestAnimationFrame(() => root.querySelector('#feed-embedded-config-content')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
              },
              onCopy: (componentId) => {
                const component = tab.components.find((item) => item.id === componentId);
                if (!component) return;
                const copy = this.clone(component);
                copy.id = `feed-component-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                copy.recordName = `${component.recordName || component.label} - 副本`;
                copy.isSaved = false;
                copy.hasBeenSaved = false;
                tab.components.push(copy);
                draft.activeTabId = tabId;
                selectedComponentId = copy.id;
                editSession.startEditing();
                renderAll();
                window.BackofficeLayout.showToast?.('已复制展位，请完成配置后保存');
              }
            });
          },
          onAdd: () => {
            const tab = this.createTab();
            draft.tabs.push(tab);
            draft.activeTabId = tab.id;
            selectedComponentId = '';
            renderAll();
            editSession.beginTabEditing(snapshot());
            applyEditState();
          }
        });
      });
    }
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
      root.querySelectorAll('.feed-marketing-settings input:not([data-feed-static]), .feed-marketing-settings select:not([data-feed-static]), .feed-marketing-settings textarea:not([data-feed-static]), .operation-popup-standalone-editor input:not([data-feed-static]), .operation-popup-standalone-editor select:not([data-feed-static]), .operation-popup-standalone-editor textarea:not([data-feed-static])').forEach((control) => {
        control.disabled = !isEditing || control.matches('.operation-popup-tab-reminder[disabled]');
      });
      root.querySelectorAll('[data-feed-component-add]').forEach((control) => { control.disabled = !canConfigureComponents; });
      root.querySelectorAll('[data-feed-image-delete], [data-feed-component-image-delete], [data-feed-mosaic-delete], [data-feed-red-packet-delete], [data-operation-popup-delete], [data-feed-mosaic-position-add], [data-feed-mosaic-position-remove], [data-operation-popup-hot-area-add], [data-operation-popup-hot-area-remove]').forEach((control) => { control.disabled = !isEditing || (control.matches('[data-feed-mosaic-position-remove]') && activeComponent()?.mosaic?.positions?.length <= 1); });
      const toolNote = root.querySelector('#feed-component-tools-note');
      const toolPanel = root.querySelector('.feed-marketing-tools');
      if (toolNote) toolNote.textContent = tab?.hasBeenSaved
        ? (componentToolNote || '拖入当前 Tab 的信息流预览区域')
        : '请先保存当前 Tab，再拖入信息流组件';
      if (toolPanel) toolPanel.classList.toggle('is-locked', !canConfigureComponents);
      const component = activeComponent();
      const removeButton = root.querySelector('#remove-feed-component');
      const canRemoveNewComponent = isEditing && Boolean(component) && !component.hasBeenSaved;
      if (removeButton) {
        removeButton.hidden = !canRemoveNewComponent;
        removeButton.disabled = !canRemoveNewComponent;
      }
      root.querySelectorAll('[data-feed-preview-component]').forEach((element) => {
        const previewComponent = tab?.components.find((item) => item.id === element.dataset.feedPreviewComponent);
        element.classList.toggle('is-unsaved', Boolean(previewComponent && !previewComponent.isSaved));
      });
      const saveButton = root.querySelector('#save-feed-tab');
      const needsInitialTabSave = Boolean(tab && !tab.hasBeenSaved);
      saveButton.textContent = operationPopupStandaloneEditor ? '保存' : (isEditing ? (component ? '保存组件' : (needsInitialTabSave ? '保存Tab' : '保存配置')) : '编辑');
      saveButton.classList.toggle('is-edit-action', !isEditing);
      const saveTooltip = saveButton.closest('.home-component-save-tooltip');
      if (saveTooltip) saveTooltip.dataset.tooltip = isEditing
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
    const readOperationPopupConfig = (component) => {
      const popup = this.createOperationPopupConfig(component.operationPopup);
      root.querySelectorAll('[data-operation-popup-field]').forEach((input) => {
        popup[input.dataset.operationPopupField] = input.type === 'checkbox' ? input.checked : input.value;
      });
      popup.position = operationPopupPosition;
      popup.status = root.querySelector('input[name="operation-popup-status"]:checked')?.value || '已下线';
      popup.targeting.identities = [...root.querySelectorAll('[data-operation-popup-identity]:checked')].map((input) => input.value);
      root.querySelectorAll('[data-operation-popup-targeting-field]').forEach((input) => { popup.targeting[input.dataset.operationPopupTargetingField] = input.value; });
      popup.targeting.audiences = [...root.querySelectorAll('[data-operation-popup-audience]:checked')].map((input) => input.value);
      popup.targeting.audienceInversion = root.querySelector('input[name="operation-popup-audience-inversion"]:checked')?.value || '否';
      root.querySelectorAll('[data-operation-popup-platform]').forEach((input) => { popup.targeting.platformVersions[input.dataset.operationPopupPlatform].enabled = input.checked; });
      root.querySelectorAll('[data-operation-popup-version]').forEach((input) => { const [key, type] = input.dataset.operationPopupVersion.split(':'); popup.targeting.platformVersions[key][type] = input.value; });
      root.querySelectorAll('[data-operation-popup-test]').forEach((input) => { popup.testPlan[input.dataset.operationPopupTest] = input.type === 'checkbox' ? input.checked : input.value; });
      popup.hotAreas = popup.hotAreas.map((area) => {
        const next = { ...area };
        root.querySelectorAll(`[data-operation-popup-hot-area^="${area.id}:"]`).forEach((input) => { next[input.dataset.operationPopupHotArea.slice(area.id.length + 1)] = input.value; });
        return next;
      });
      component.operationPopup = popup;
    };
    const renderAll = () => {
      const visibleTabs = draft.tabs.filter((tab) => filters.status.has(tab.status) && filters.resourceStatus.has(tab.resourceStatus));
      const active = visibleTabs.find((tab) => tab.id === draft.activeTabId) || visibleTabs[0] || null;
      if (active && active.id !== draft.activeTabId) draft.activeTabId = active.id;
      if (!active?.components.some((component) => component.id === selectedComponentId)) selectedComponentId = '';
      const component = activeComponent();
      if (!operationPopupStandaloneEditor) {
        root.querySelector('#feed-embedded-filters').innerHTML = `${showTabStatus ? `<div class="feed-embedded-filter"><strong>Tab状态</strong><div>${['上线中', '待上线', '已下线'].map((value) => `<label><input type="checkbox" data-feed-embedded-filter="status" value="${value}"${filters.status.has(value) ? ' checked' : ''} />${value}</label>`).join('')}</div></div>` : ''}<div class="feed-embedded-filter"><strong>${this.escape(resourceStatusLabel)}</strong><div>${['上线中', '待上线', '已下线'].map((value) => `<label><input type="checkbox" data-feed-embedded-filter="resourceStatus" value="${value}"${filters.resourceStatus.has(value) ? ' checked' : ''} />${value}</label>`).join('')}</div></div>`;
        root.querySelector('#feed-embedded-preview').innerHTML = renderPreview(active);
        root.querySelector('#feed-embedded-config-type').textContent = component ? component.label : '未选择组件';
      }
      root.querySelector('#feed-embedded-config-content').innerHTML = component ? this.renderEmbeddedComponentConfig(component, { tabReminderOptions, tabReminderNote, tabReminderReadonly }) : '';
      applyEditState();
      window.BackofficeLayout.bindGlobalTooltips();
    };
    root.addEventListener('click', async (event) => {
      const workspaceToggle = event.target.closest('[data-feed-workspace-toggle]');
      if (workspaceToggle) {
        const panel = workspaceToggle.dataset.feedWorkspaceToggle;
        collapsedWorkspacePanels[panel] = !collapsedWorkspacePanels[panel];
        applyWorkspaceLayout();
        return;
      }
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
      const operationPopupImageDelete = event.target.closest('[data-operation-popup-delete]');
      if (operationPopupImageDelete) { if (!editSession.isEditing()) return; const component = activeComponent(); if (component?.type === 'normal-popup') { component.operationPopup = this.createOperationPopupConfig(component.operationPopup); component.operationPopup[operationPopupImageDelete.dataset.operationPopupDelete] = ''; component.isSaved = false; renderAll(); } return; }
      if (event.target.closest('[data-operation-popup-hot-area-add]')) {
        if (!editSession.isEditing()) return;
        const component = activeComponent();
        if (component?.type === 'normal-popup') {
          component.operationPopup = this.createOperationPopupConfig(component.operationPopup);
          component.operationPopup.hotAreas.push({ id: `operation-popup-hot-area-${Date.now()}-${Math.random().toString(16).slice(2)}`, name: '', x: '', y: '', width: '', height: '', routeProtocol: '' });
          component.isSaved = false;
          renderAll();
        }
        return;
      }
      const removeHotArea = event.target.closest('[data-operation-popup-hot-area-remove]');
      if (removeHotArea) {
        if (!editSession.isEditing()) return;
        const component = activeComponent();
        if (component?.type === 'normal-popup') {
          component.operationPopup = this.createOperationPopupConfig(component.operationPopup);
          component.operationPopup.hotAreas = component.operationPopup.hotAreas.filter((area) => area.id !== removeHotArea.dataset.operationPopupHotAreaRemove);
          component.isSaved = false;
          renderAll();
        }
        return;
      }
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
        if (sortPopupPreviewByPriority) {
          const previewOrder = [...root.querySelectorAll('[data-feed-preview-component]')].map((item) => item.dataset.feedPreviewComponent);
          const fromIndex = previewOrder.indexOf(draggedComponentId);
          const targetIndex = targetId ? previewOrder.indexOf(targetId) : previewOrder.length - 1;
          if (fromIndex >= 0 && targetIndex >= 0) {
            previewOrder.splice(fromIndex, 1);
            previewOrder.splice(fromIndex < targetIndex ? targetIndex - 1 : targetIndex, 0, draggedComponentId);
            const componentsById = new Map(tab.components.map((component) => [component.id, component]));
            tab.components = previewOrder.map((id) => componentsById.get(id)).filter(Boolean);
            const component = componentsById.get(draggedComponentId);
            if (component) component.isSaved = false;
            selectedComponentId = draggedComponentId;
            popupOrderPending = true;
          }
        } else {
          const fromIndex = tab.components.findIndex((item) => item.id === draggedComponentId);
          const targetIndex = targetId ? tab.components.findIndex((item) => item.id === targetId) : tab.components.length - 1;
          if (fromIndex >= 0 && targetIndex >= 0) {
            const [component] = tab.components.splice(fromIndex, 1);
            tab.components.splice(fromIndex < targetIndex ? targetIndex - 1 : targetIndex, 0, component);
            component.isSaved = false;
            selectedComponentId = component.id;
          }
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
        root.querySelector('#feed-embedded-preview').innerHTML = renderPreview(tab);
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
        root.querySelector('#feed-embedded-preview').innerHTML = renderPreview(tab);
        applyEditState();
        return;
      }
      if (component?.type === 'red-packet-delivery' && event.target.closest('.home-red-packet-form')) {
        readRedPacketConfig(component);
        component.isSaved = false;
        applyEditState();
        return;
      }
      if (component?.type === 'normal-popup' && event.target.closest('.operation-popup-form')) {
        readOperationPopupConfig(component);
        component.recordName = component.operationPopup.activityName || component.label;
        component.isSaved = false;
        const preview = root.querySelector('#feed-embedded-preview');
        if (preview) preview.innerHTML = renderPreview(tab);
        applyEditState();
        return;
      }
      if (component?.type === 'mosaic' && event.target.matches('[data-feed-mosaic-field]')) {
        const mosaic = this.createMosaicConfig(component.mosaic);
        const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0];
        position[event.target.dataset.feedMosaicField] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        component.mosaic = mosaic;
        component.isSaved = false;
        if (event.target.dataset.feedMosaicField === 'routeProtocol') root.querySelector('#feed-embedded-preview').innerHTML = renderPreview(tab);
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
      const operationPopupImageInput = event.target.closest('[data-operation-popup-image]');
      if (operationPopupImageInput?.files?.[0]) { if (component?.type === 'normal-popup') { component.operationPopup = this.createOperationPopupConfig(component.operationPopup); component.operationPopup[operationPopupImageInput.dataset.operationPopupImage] = await this.readImage(operationPopupImageInput.files[0]); component.isSaved = false; renderAll(); } return; }
      const tab = activeTab();
      if (tab && event.target.matches('[data-feed-tab-test="enabled"]')) {
        readTestPlan(tab);
        tab.isSaved = false;
        root.querySelector('[data-feed-tab-test-status]').textContent = event.target.checked ? '生效' : '未启用';
        applyEditState();
        return;
      }
      if (component?.type === 'mosaic' && event.target.matches('[data-feed-mosaic-test="enabled"]')) {
        readMosaicTestPlan(component);
        component.isSaved = false;
        root.querySelector('[data-feed-mosaic-test-status]').textContent = event.target.checked ? '生效' : '未启用';
        applyEditState();
        return;
      }
      if (component?.type === 'red-packet-delivery' && event.target.matches('[data-feed-red-packet-test="enabled"]')) {
        readRedPacketConfig(component);
        component.isSaved = false;
        root.querySelector('[data-feed-red-packet-test-status]').textContent = event.target.checked ? '生效' : '未启用';
        applyEditState();
        return;
      }
      if (component?.type === 'red-packet-delivery' && event.target.closest('.home-red-packet-form')) { readRedPacketConfig(component); component.isSaved = false; renderAll(); return; }
      if (component?.type === 'normal-popup' && event.target.closest('.operation-popup-form')) { readOperationPopupConfig(component); component.recordName = component.operationPopup.activityName || component.label; component.isSaved = false; renderAll(); return; }
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
      if (tab && event.target.closest('.feed-tab-form')) { readTargeting(tab); readTestPlan(tab); tab.isSaved = false; applyEditState(); }
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
      if (component?.type === 'normal-popup') { readOperationPopupConfig(component); component.recordName = component.operationPopup.activityName || component.label; }
      const invalid = component ? this.validateComponent(component) : this.validate(tab);
      if (invalid) { window.BackofficeLayout.showToast?.(invalid); return; }
      const shouldCommitPopupDragOrder = sortPopupPreviewByPriority && popupOrderPending && Boolean(tab);
      if (shouldCommitPopupDragOrder) commitPopupDragOrder(tab);
      if (component) { component.isSaved = true; component.hasBeenSaved = true; component.editor = '当前账号'; component.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false }); }
      if (tab && !component) { tab.isSaved = true; tab.hasBeenSaved = true; }
      const state = { tabs: draft.tabs, activeTabId: draft.activeTabId };
      try { this.saveState(state, storageKey); } catch (error) { window.BackofficeLayout.showToast?.('保存失败', '本地演示数据无法保存，请减少图片素材后重试'); return; }
      saved = this.clone(state);
      if (shouldCommitPopupDragOrder) popupOrderPending = false;
      editSession.finishComponentEditing(snapshot());
      refreshRecentEdits(true);
      if (shouldCommitPopupDragOrder) renderAll();
      else applyEditState();
      window.BackofficeLayout.showToast?.(operationPopupStandaloneEditor ? '配置已保存' : (component ? '组件已保存' : 'Tab已保存'), `${pageName}已更新`);
      if (operationPopupStandaloneEditor && typeof onReturnToConfigurationList === 'function') onReturnToConfigurationList();
    });
    applyWorkspaceLayout();
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
    const testPlanError = window.ConfigurationSections.validateTestPlan(tab.testPlan);
    if (testPlanError) return testPlanError;
    return '';
  },
  validateComponent(component) {
    if (component.type === 'normal-popup') {
      const popup = this.createOperationPopupConfig(component.operationPopup);
      if (!popup.activityName.trim()) return '请填写活动名称';
      const hasPlatformVersion = Object.values(popup.targeting.platformVersions).some((platform) => platform.enabled && platform.start.trim());
      const hasFrequency = Number(popup.pushDailyLimit) > 0 && Number(popup.pushTotalLimit) > 0;
      const hasRouteTarget = popup.routeType === 'page'
        ? Boolean(popup.targetPage.trim())
        : popup.routeType === 'protocol' && Boolean(popup.routeProtocol.trim()) && Boolean(popup.routeDescription.trim());
      const hasDisplayWindow = popup.showAllDay || (popup.showStart && popup.showEnd && popup.showStart < popup.showEnd);
      if (!popup.routeType || !hasRouteTarget || !popup.mainImage || !hasPlatformVersion || !popup.onlineStart || !popup.onlineEnd || !hasFrequency || !hasDisplayWindow) {
        return '请补充跳转配置、弹窗主图、平台版本、展示规则和上下线时间';
      }
      const testPlanError = window.ConfigurationSections.validateTestPlan(popup.testPlan);
      if (testPlanError) return testPlanError;
      return '';
    }
    if (component.type === 'red-packet-delivery') {
      const redPacket = this.createRedPacketConfig(component.redPacket);
      const hasPlatformVersion = Object.values(redPacket.targeting.platformVersions).some((platform) => platform.enabled && platform.start.trim());
      if (!redPacket.name.trim() || !redPacket.deliveryType || !hasPlatformVersion || !redPacket.targeting.onlineStart || !redPacket.targeting.onlineEnd || (redPacket.deliveryType === 'package' && (!redPacket.unclaimedImage || !redPacket.template))) return '请补充红包发放功能的记录名称、发放类型、平台版本与上线时间；券包发放还需上传未领取图片素材并选择红包模板';
      const testPlanError = window.ConfigurationSections.validateTestPlan(redPacket.testPlan);
      if (testPlanError) return testPlanError;
      return '';
    }
    if (!(component.recordName || component.label || '').trim()) return '请填写 记录名称';
    if ((component.slots || []).some((slot) => !String(slot).trim())) return '请填写组件坑位名称';
    const testPlanError = window.ConfigurationSections.validateTestPlan(component.testPlan);
    if (testPlanError) return testPlanError;
    return '';
  },
  getConfigurationRecords(state = {}) {
    const tabs = Array.isArray(state.tabs) ? state.tabs : [];
    return tabs.flatMap((tab) => {
      if (!tab.hasBeenSaved && !tab.isSaved) return [];
      const tabName = tab.recordName || tab.tabName || '未命名 Tab';
      const records = [{
        id: `tab:${tab.id}`,
        type: 'Tab',
        name: tabName,
        summary: `Tab名称：${tab.tabName || '未填写'}；资源位：${(tab.components || []).filter((component) => component.hasBeenSaved || component.isSaved).length} 个`,
        status: tab.status || '-'
      }];
      (tab.components || []).filter((component) => component.hasBeenSaved || component.isSaved).forEach((component) => {
        const popup = component.type === 'normal-popup' ? this.createOperationPopupConfig(component.operationPopup) : null;
        const name = component.type === 'red-packet-delivery'
          ? component.redPacket?.name
          : popup?.activityName || component.recordName || component.label;
        records.push({
          id: `component:${tab.id}:${component.id}`,
          type: component.label || '信息流组件',
          name: name || '未填写记录名称',
          summary: component.type === 'normal-popup'
            ? `所属页面：${tab.tabName || '未命名'}；所属位置：${popup.position || '未配置'}`
            : `所属 Tab：${tab.tabName || '未命名'}；坑位：${(component.slots || []).filter(Boolean).join('、') || '未配置'}`,
          status: component.type === 'red-packet-delivery'
            ? component.redPacket?.targeting?.status || '-'
            : popup?.status || component.targeting?.status || '-'
        });
      });
      return records;
    });
  },
  getTabRecords(state = {}) {
    return this.getConfigurationRecords(state).filter((record) => record.type === 'Tab');
  },
  getTabListRows(state = {}) {
    return (Array.isArray(state.tabs) ? state.tabs : [])
      .filter((tab) => tab.hasBeenSaved || tab.isSaved)
      .map((tab, index) => {
        const targeting = window.ConfigurationSections.normalizeTargeting(tab.targeting);
        const audience = [
          targeting.identities?.length ? targeting.identities.join('、') : '',
          targeting.targetGroup ? `人群包：${targeting.targetGroup}` : ''
        ].filter(Boolean).join('；');
        return {
          id: tab.id,
          sequence: index + 1,
          tabName: tab.tabName || '未命名 Tab',
          recordName: tab.recordName || '未填写记录名称',
          sortValue: tab.sortValue || String(99999 - index),
          iconImage: tab.iconImage,
          cornerImage: tab.cornerImage,
          tailImage: tab.tailImage,
          audience: audience || '全部用户',
          onlineStart: targeting.onlineStart || '-',
          onlineEnd: targeting.onlineEnd || '-',
          status: tab.status || '待上线',
          editor: '当前账号'
        };
      });
  },
  getResourceListRows(tab = {}) {
    const components = Array.isArray(tab.components) ? tab.components : [];
    return components.filter((component) => component.hasBeenSaved || component.isSaved).map((component, index) => {
      const popup = component.type === 'normal-popup' ? this.createOperationPopupConfig(component.operationPopup) : null;
      const targeting = component.type === 'red-packet-delivery'
        ? this.createRedPacketConfig(component.redPacket).targeting
        : window.ConfigurationSections.normalizeTargeting(component.targeting || tab.targeting);
      const statusMap = { 上线: '上线中', 下线: '已下线' };
      return {
        id: component.id,
        sequence: index + 1,
        resourceId: `${tab.id.replace(/\D/g, '').slice(-4) || '30'}${String(index + 1).padStart(2, '0')}`,
        name: component.type === 'red-packet-delivery'
          ? component.redPacket?.name || component.recordName || component.label
          : popup?.activityName || component.recordName || component.label || '未填写名称',
        sortValue: popup?.sortValue || String(99999 - index),
        onlineStart: popup?.onlineStart || targeting.onlineStart || '-',
        onlineEnd: popup?.onlineEnd || targeting.onlineEnd || '-',
        status: popup?.status || statusMap[targeting.status] || tab.resourceStatus || tab.status || '待上线',
        editor: '当前账号'
      };
    });
  },
  getOperationPopupConfigurationRows(state = {}) {
    const tabs = Array.isArray(state.tabs) ? state.tabs : [];
    return tabs.flatMap((tab) => (tab.components || [])
      .filter((component) => component.type === 'normal-popup' && (component.hasBeenSaved || component.isSaved))
      .map((component, index) => {
        const popup = this.createOperationPopupConfig(component.operationPopup);
        const targeting = window.ConfigurationSections.normalizeTargeting(popup.targeting);
        const targetAudience = [
          targeting.identities?.length ? targeting.identities.join('、') : '',
          targeting.targetGroup ? `人群包：${targeting.targetGroup}` : ''
        ].filter(Boolean).join('；') || '-';
        const pushFrequency = `每人每日${popup.pushDailyLimit || 1}次；总共${popup.pushTotalLimit || 1}次`;
        const repeatDisplay = popup.showAllDay
          ? '每天重复，全天展示'
          : `每天重复，${popup.showStart || '--:--'} - ${popup.showEnd || '--:--'}展示`;
        const onlineTime = popup.onlineStart || popup.onlineEnd
          ? `${popup.onlineStart || '-'} 至 ${popup.onlineEnd || '-'}`
          : '-';
        const numericId = String(component.id || '').replace(/\D/g, '');
        return {
          id: component.id,
          tabId: tab.id,
          popupId: numericId ? numericId.slice(-8) : String(index + 1).padStart(6, '0'),
          name: popup.activityName || component.recordName || component.label || '未填写活动名称',
          mainImage: popup.mainImage || '',
          position: popup.position || '首页',
          sortValue: popup.sortValue || '-',
          targetAudience,
          pushFrequency,
          repeatDisplay,
          onlineTime,
          status: popup.status || '待上线',
          editor: component.editor || '当前账号',
          updatedAt: component.updatedAt || '-'
        };
      }));
  },
  openOperationPopupConfigurationList({ title = '运营弹窗配置列表', state, onEdit } = {}) {
    document.getElementById('operation-popup-configuration-list-modal')?.remove();
    const modal = document.createElement('section');
    modal.className = 'modal is-editor-fullscreen feed-resource-list-modal';
    modal.id = 'operation-popup-configuration-list-modal';
    const escape = (value) => this.escape(value);
    const rows = this.getOperationPopupConfigurationRows(state);
    const render = () => {
      const name = modal.querySelector('[data-operation-popup-list-filter="name"]')?.value.trim().toLowerCase() || '';
      const status = modal.querySelector('[data-operation-popup-list-filter="status"]')?.value || '';
      const onlineStart = modal.querySelector('[data-operation-popup-list-filter="onlineStart"]')?.value || '';
      const onlineEnd = modal.querySelector('[data-operation-popup-list-filter="onlineEnd"]')?.value || '';
      const visibleRows = rows.filter((row) => (!name || row.name.toLowerCase().includes(name))
        && (!status || row.status === status)
        && (!onlineStart || (row.onlineStart !== '-' && row.onlineStart >= onlineStart))
        && (!onlineEnd || (row.onlineEnd !== '-' && row.onlineEnd <= onlineEnd)));
      const tableBody = modal.querySelector('[data-operation-popup-list-body]');
      if (!tableBody) return;
      tableBody.innerHTML = visibleRows.length
        ? visibleRows.map((row) => `<tr><td>${row.sequence}</td><td>${escape(row.name)}</td><td>${escape(row.position)}</td><td>${escape(row.sortValue)}</td><td>${escape(row.onlineStart)}</td><td>${escape(row.onlineEnd)}</td><td>${escape(row.status)}</td><td>${escape(row.editor)}</td><td class="feed-resource-list-actions"><button class="text-button" type="button" data-operation-popup-list-edit="${escape(row.tabId)}:${escape(row.id)}">编辑</button></td></tr>`).join('')
        : '<tr><td class="feed-resource-list-empty" colspan="9">当前导航下暂无已保存的运营弹窗配置</td></tr>';
      modal.querySelector('[data-operation-popup-list-count]').textContent = `共 ${visibleRows.length} 条`;
    };
    modal.innerHTML = `<div class="modal-card feed-resource-list-card" role="dialog" aria-modal="true" aria-labelledby="operation-popup-configuration-list-title"><div class="modal-header"><h2 id="operation-popup-configuration-list-title">${escape(title)}</h2><button class="icon-close" type="button" data-close-operation-popup-list aria-label="关闭">×</button></div><div class="modal-body feed-resource-list-body"><div class="feed-resource-list-filters"><label>活动名称<input class="control" data-operation-popup-list-filter="name" placeholder="请输入活动名称" /></label><label>状态<select class="control" data-operation-popup-list-filter="status"><option value="">全部</option><option value="上线中">上线中</option><option value="待上线">待上线</option><option value="已下线">已下线</option></select></label><label class="feed-resource-list-date-range">上线时间<span><input class="control" type="date" data-operation-popup-list-filter="onlineStart" aria-label="上线开始时间" /><i>-</i><input class="control" type="date" data-operation-popup-list-filter="onlineEnd" aria-label="上线结束时间" /></span></label><span class="feed-resource-list-filter-actions"><button class="button secondary" type="button" data-operation-popup-list-search>查询</button></span></div><div class="feed-resource-list-wrap"><table class="feed-resource-list-table"><thead><tr><th>序号</th><th>活动名称</th><th>所属位置</th><th>排序值 <button class="help-tooltip feed-resource-list-sort-help" type="button" aria-label="排序值说明" data-tooltip="仅由预览区拖动排序产生，保存后数字越大越靠前展示">?</button></th><th>上线时间</th><th>下线时间</th><th>状态</th><th>最新编辑人</th><th>操作</th></tr></thead><tbody data-operation-popup-list-body></tbody></table></div><div class="feed-resource-list-footer"><span data-operation-popup-list-count></span><span>仅展示当前导航下已保存的运营弹窗配置。</span></div></div><div class="modal-footer"><button class="button secondary" type="button" data-close-operation-popup-list>关闭</button></div></div>`;
    const close = () => modal.remove();
    modal.addEventListener('input', (event) => { if (event.target.matches('[data-operation-popup-list-filter]')) render(); });
    modal.addEventListener('change', (event) => { if (event.target.matches('[data-operation-popup-list-filter]')) render(); });
    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.closest('[data-close-operation-popup-list]')) { close(); return; }
      if (event.target.closest('[data-operation-popup-list-search]')) { render(); return; }
      const edit = event.target.closest('[data-operation-popup-list-edit]');
      if (edit) {
        const [tabId, componentId] = edit.dataset.operationPopupListEdit.split(':');
        close();
        onEdit?.(tabId, componentId);
      }
    });
    document.body.append(modal);
    render();
    window.BackofficeLayout.bindGlobalTooltips();
    modal.querySelector('[data-operation-popup-list-filter="name"]')?.focus();
  },
  openResourceList({ title = '展位管理', tab, onEdit, onAdd, onCopy } = {}) {
    if (!tab) return;
    document.getElementById('feed-resource-list-modal')?.remove();
    const modal = document.createElement('section');
    modal.className = 'modal is-editor-fullscreen feed-resource-list-modal';
    modal.id = 'feed-resource-list-modal';
    const escape = (value) => this.escape(value);
    const rows = this.getResourceListRows(tab);
    const render = () => {
      const name = modal.querySelector('[data-resource-list-filter="name"]')?.value.trim().toLowerCase() || '';
      const status = modal.querySelector('[data-resource-list-filter="status"]')?.value || '';
      const onlineStart = modal.querySelector('[data-resource-list-filter="onlineStart"]')?.value || '';
      const onlineEnd = modal.querySelector('[data-resource-list-filter="onlineEnd"]')?.value || '';
      const visibleRows = rows.filter((row) => (!name || row.name.toLowerCase().includes(name))
        && (!status || row.status === status)
        && (!onlineStart || (row.onlineStart !== '-' && row.onlineStart >= onlineStart))
        && (!onlineEnd || (row.onlineEnd !== '-' && row.onlineEnd <= onlineEnd)));
      const tableBody = modal.querySelector('[data-resource-list-body]');
      if (!tableBody) return;
      tableBody.innerHTML = visibleRows.length ? visibleRows.map((row) => `<tr><td><input type="checkbox" aria-label="选择${escape(row.name)}" /></td><td>${escape(row.resourceId)}</td><td>${escape(row.name)}</td><td>${escape(row.sortValue)}</td><td>${escape(row.onlineStart)}</td><td>${escape(row.onlineEnd)}</td><td>${escape(row.status)}</td><td>${escape(row.editor)}</td><td class="feed-resource-list-actions"><button class="text-button" type="button" data-resource-list-edit="${escape(row.id)}">编辑</button><button class="text-button" type="button" data-resource-list-copy="${escape(row.id)}">复制</button></td></tr>`).join('') : '<tr><td class="feed-resource-list-empty" colspan="9">暂无符合条件的展位</td></tr>';
      modal.querySelector('[data-resource-list-count]').textContent = `共 ${visibleRows.length} 条`;
    };
    modal.innerHTML = `<div class="modal-card feed-resource-list-card" role="dialog" aria-modal="true" aria-labelledby="feed-resource-list-title"><div class="modal-header"><h2 id="feed-resource-list-title">${escape(title)}</h2><button class="icon-close" type="button" data-close-resource-list aria-label="关闭">×</button></div><div class="modal-body feed-resource-list-body"><div class="feed-resource-list-filters"><label>所属Tab名称<input class="control" value="${escape(tab.recordName || '未填写记录名称')}" disabled /></label><label>Tab名称（前台）<input class="control" value="${escape(tab.tabName || '未命名 Tab')}" disabled /></label><label>名称<input class="control" data-resource-list-filter="name" placeholder="请输入名称" /></label><label>状态<select class="control" data-resource-list-filter="status"><option value="">全部</option><option value="上线中">上线中</option><option value="待上线">待上线</option><option value="已下线">已下线</option></select></label><label class="feed-resource-list-date-range">上线时间<span><input class="control" type="date" data-resource-list-filter="onlineStart" aria-label="上线开始时间" /><i>-</i><input class="control" type="date" data-resource-list-filter="onlineEnd" aria-label="上线结束时间" /></span></label><span class="feed-resource-list-filter-actions"><button class="button secondary" type="button" data-resource-list-search>查询</button><button class="button primary" type="button" data-resource-list-add>+ 添加展位</button></span></div><div class="feed-resource-list-wrap"><table class="feed-resource-list-table"><thead><tr><th><input type="checkbox" aria-label="全选" /></th><th>ID</th><th>名称</th><th>排序值 <button class="help-tooltip feed-resource-list-sort-help" type="button" aria-label="排序值说明" data-tooltip="越大越靠前">?</button></th><th>上线时间</th><th>下线时间</th><th>状态</th><th>最新编辑人</th><th>操作</th></tr></thead><tbody data-resource-list-body></tbody></table></div><div class="feed-resource-list-footer"><span data-resource-list-count></span><span>仅展示当前 Tab 下已保存的展位。</span></div></div><div class="modal-footer"><button class="button secondary" type="button" data-close-resource-list>关闭</button></div></div>`;
    const close = () => modal.remove();
    modal.addEventListener('input', (event) => { if (event.target.matches('[data-resource-list-filter]')) render(); });
    modal.addEventListener('change', (event) => { if (event.target.matches('[data-resource-list-filter]')) render(); });
    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.closest('[data-close-resource-list]')) { close(); return; }
      if (event.target.closest('[data-resource-list-search]')) { render(); return; }
      if (event.target.closest('[data-resource-list-add]')) { close(); onAdd?.(); return; }
      const edit = event.target.closest('[data-resource-list-edit]');
      if (edit) { close(); onEdit?.(edit.dataset.resourceListEdit); return; }
      const copy = event.target.closest('[data-resource-list-copy]');
      if (copy) { close(); onCopy?.(copy.dataset.resourceListCopy); }
    });
    document.body.append(modal);
    render();
    window.BackofficeLayout.bindGlobalTooltips();
    modal.querySelector('[data-resource-list-filter="name"]')?.focus();
  },
  openTabList({ title = 'Tab列表', state, onEdit, onManageResources, onAdd } = {}) {
    document.getElementById('feed-tab-list-modal')?.remove();
    const modal = document.createElement('section');
    modal.className = 'modal is-editor-fullscreen feed-tab-list-modal';
    modal.id = 'feed-tab-list-modal';
    const escape = (value) => this.escape(value);
    const rows = this.getTabListRows(state);
    const renderImage = (value, label) => value
      ? `<img src="${escape(value)}" alt="${label}" />`
      : '<span>-</span>';
    const render = () => {
      const recordName = modal.querySelector('[data-tab-list-filter="recordName"]')?.value.trim().toLowerCase() || '';
      const tabName = modal.querySelector('[data-tab-list-filter="tabName"]')?.value.trim().toLowerCase() || '';
      const status = modal.querySelector('[data-tab-list-filter="status"]')?.value || '';
      const onlineStart = modal.querySelector('[data-tab-list-filter="onlineStart"]')?.value || '';
      const onlineEnd = modal.querySelector('[data-tab-list-filter="onlineEnd"]')?.value || '';
      const visibleRows = rows.filter((row) => (!recordName || row.recordName.toLowerCase().includes(recordName))
        && (!tabName || row.tabName.toLowerCase().includes(tabName))
        && (!status || row.status === status)
        && (!onlineStart || (row.onlineStart !== '-' && row.onlineStart >= onlineStart))
        && (!onlineEnd || (row.onlineEnd !== '-' && row.onlineEnd <= onlineEnd)));
      const tableBody = modal.querySelector('[data-tab-list-body]');
      if (!tableBody) return;
      tableBody.innerHTML = visibleRows.length ? visibleRows.map((row) => `<tr><td>${row.sequence}</td><td>${escape(row.tabName)}</td><td>${escape(row.recordName)}</td><td>${escape(row.sortValue)}</td><td class="feed-tab-list-image">${renderImage(row.iconImage, 'icon图片')}</td><td class="feed-tab-list-image">${renderImage(row.cornerImage, '角标图片')}</td><td class="feed-tab-list-image">${renderImage(row.tailImage, '尾标图片')}</td><td title="${escape(row.audience)}">${escape(row.audience)}</td><td>${escape(row.onlineStart)}</td><td>${escape(row.onlineEnd)}</td><td>${escape(row.status)}</td><td>${escape(row.editor)}</td><td class="feed-tab-list-actions"><button class="text-button" type="button" data-tab-list-edit="${escape(row.id)}">编辑</button><button class="text-button" type="button" data-tab-list-resource="${escape(row.id)}">展位管理</button></td></tr>`).join('') : '<tr><td class="feed-tab-list-empty" colspan="13">暂无符合条件的 Tab</td></tr>';
      modal.querySelector('[data-tab-list-count]').textContent = `共 ${visibleRows.length} 条`;
    };
    modal.innerHTML = `<div class="modal-card feed-tab-list-card" role="dialog" aria-modal="true" aria-labelledby="feed-tab-list-title"><div class="modal-header"><h2 id="feed-tab-list-title">${escape(title)}</h2><button class="icon-close" type="button" data-close-tab-list aria-label="关闭">×</button></div><div class="modal-body feed-tab-list-body"><div class="feed-tab-list-filters"><label>记录名称<input class="control" data-tab-list-filter="recordName" placeholder="请输入记录名称" /></label><label>Tab名称（前台）<input class="control" data-tab-list-filter="tabName" placeholder="请输入Tab名称（前台）" /></label><label>状态<select class="control" data-tab-list-filter="status"><option value="">请选择状态</option><option value="上线中">上线中</option><option value="待上线">待上线</option><option value="已下线">已下线</option></select></label><label class="feed-tab-list-date-range">上线时间<span><input class="control" type="date" data-tab-list-filter="onlineStart" aria-label="上线开始时间" /><i>-</i><input class="control" type="date" data-tab-list-filter="onlineEnd" aria-label="上线结束时间" /></span></label><span class="feed-tab-list-filter-actions"><button class="button secondary" type="button" data-tab-list-search>查询</button><button class="button primary" type="button" data-tab-list-add>+ 添加Tab</button></span></div><div class="feed-tab-list-wrap"><table class="feed-tab-list-table"><thead><tr><th>ID</th><th>Tab名称（前台）</th><th>记录名称</th><th>排序值 <button class="help-tooltip feed-tab-list-sort-help" type="button" aria-label="排序值说明" data-tooltip="越大越靠前">?</button></th><th>icon图片</th><th>角标图片</th><th>尾标图片</th><th>人群信息</th><th>上线时间</th><th>下线时间</th><th>状态</th><th>最新编辑人</th><th>操作</th></tr></thead><tbody data-tab-list-body></tbody></table></div><div class="feed-tab-list-footer"><span data-tab-list-count></span><span>仅展示当前导航下已保存的 Tab。</span></div></div><div class="modal-footer"><button class="button secondary" type="button" data-close-tab-list>关闭</button></div></div>`;
    const close = () => modal.remove();
    modal.addEventListener('input', (event) => { if (event.target.matches('[data-tab-list-filter]')) render(); });
    modal.addEventListener('change', (event) => { if (event.target.matches('[data-tab-list-filter]')) render(); });
    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.closest('[data-close-tab-list]')) { close(); return; }
      if (event.target.closest('[data-tab-list-search]')) { render(); return; }
      if (event.target.closest('[data-tab-list-add]')) { close(); onAdd?.(); return; }
      const action = event.target.closest('[data-tab-list-edit], [data-tab-list-resource]');
      if (!action) return;
      close();
      if (action.dataset.tabListEdit) onEdit?.(action.dataset.tabListEdit);
      else onManageResources?.(action.dataset.tabListResource);
    });
    document.body.append(modal);
    render();
    window.BackofficeLayout.bindGlobalTooltips();
    modal.querySelector('[data-tab-list-filter="recordName"]')?.focus();
  },
  bind() {
    let saved = this.loadState();
    let draft = this.clone(saved);
    let filters = { status: new Set(['上线中', '待上线', '已下线']), resourceStatus: new Set(['上线中', '待上线', '已下线']) };
    const updateActions = () => {
      const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
      document.getElementById('feed-page-actions').innerHTML = `<button class="button secondary" id="view-feed-configuration-list" type="button">查看Tab列表</button><button class="button secondary" id="feed-undo" type="button"${dirty ? '' : ' disabled'}>撤销本次修改</button><button class="button primary" id="feed-save" type="button"${dirty ? '' : ' disabled'}>保存</button>`;
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
      if (event.target.closest('#view-feed-configuration-list')) {
        this.openTabList({
          title: '首页-信息流营销Tab列表',
          state: saved,
          onEdit: (tabId) => {
            draft.activeTabId = tabId;
            renderAll();
            document.querySelector(`[data-feed-tab="${tabId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          },
          onManageResources: (tabId) => {
            const tab = draft.tabs.find((item) => item.id === tabId);
            if (!tab) return;
            this.openResourceList({
              tab,
              title: `${tab.tabName || '未命名 Tab'}展位管理`,
              onEdit: () => {
                draft.activeTabId = tabId;
                renderAll();
                document.getElementById('feed-tab-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              },
              onAdd: () => {
                draft.activeTabId = tabId;
                tab.components.push(this.createFeedComponent('mosaic'));
                renderAll();
                document.getElementById('feed-tab-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              },
              onCopy: (componentId) => {
                const component = tab.components.find((item) => item.id === componentId);
                if (!component) return;
                const copy = this.clone(component);
                copy.id = `feed-component-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                copy.recordName = `${component.recordName || component.label} - 副本`;
                copy.isSaved = false;
                copy.hasBeenSaved = false;
                tab.components.push(copy);
                draft.activeTabId = tabId;
                renderAll();
                window.BackofficeLayout.showToast?.('已复制展位，请完成配置后保存');
              }
            });
          },
          onAdd: () => {
            const tab = this.createTab();
            draft.tabs.push(tab);
            draft.activeTabId = tab.id;
            renderAll();
          }
        });
        return;
      }
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
