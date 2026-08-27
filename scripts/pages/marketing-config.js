window.MarketingConfigPage = {
  storageKey: 'meiyou-cashback-home-marketing-config',
  benefitsFeedStorageKey: 'meiyou-cashback-benefits-feed-management',
  benefitsCheckInStorageKey: 'meiyou-cashback-benefits-check-in-management',
  benefitsCheckInSuccessStorageKey: 'meiyou-cashback-benefits-check-in-success-management',
  primaryComponentStorageKeys: {
    'youzi-street:feed': 'meiyou-cashback-youzi-street-feed-management',
    'youzi-street:flash-sale': 'meiyou-cashback-youzi-street-flash-sale-management',
    'mine:feed': 'meiyou-cashback-mine-feed-management'
  },
  cloneHomeState(state) {
    return JSON.parse(JSON.stringify(state));
  },
  loadHomeState(defaultState) {
    try {
      const saved = JSON.parse(window.localStorage.getItem(this.storageKey));
      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return this.cloneHomeState(defaultState);
      const legacyGoldComponent = {
        id: `gold-zone-legacy`,
        entries: Array.isArray(saved.fixedEntries) ? saved.fixedEntries : defaultState.fixedEntries,
        targeting: window.ConfigurationSections.normalizeTargeting(saved.fixedEntriesTargeting || defaultState.fixedEntriesTargeting),
        testPlan: window.ConfigurationSections.normalizeTestPlan(saved.fixedEntriesTestPlan || defaultState.fixedEntriesTestPlan)
      };
      const goldComponents = Array.isArray(saved.fixedEntriesComponents)
        ? saved.fixedEntriesComponents.map((component, index) => ({
          ...legacyGoldComponent,
          ...component,
          id: component.id || `gold-zone-${index}-${Date.now()}`,
          entries: Array.isArray(component.entries) ? component.entries : legacyGoldComponent.entries,
          targeting: window.ConfigurationSections.normalizeTargeting(component.targeting || legacyGoldComponent.targeting),
          testPlan: window.ConfigurationSections.normalizeTestPlan(component.testPlan || legacyGoldComponent.testPlan),
          isSaved: component.isSaved ?? true
        }))
        : (saved.fixedEntriesComponentAdded === false ? [] : [legacyGoldComponent]);
      return {
        components: Array.isArray(saved.components) ? saved.components : defaultState.components,
        fixedEntriesComponents: goldComponents
      };
    } catch (error) {
      return this.cloneHomeState(defaultState);
    }
  },
  saveHomeState(state) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(state));
  },
  createGoldComponent(entries) {
    return {
      id: `gold-zone-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      entries: this.cloneHomeState(entries),
      targeting: window.ConfigurationSections.createTargeting(),
      testPlan: window.ConfigurationSections.createTestPlan(),
      isSaved: false,
      hasBeenSaved: false
    };
  },
  cloneBenefitsFeedState(state) {
    return JSON.parse(JSON.stringify(state));
  },
  createBenefitsFeedMosaicConfig(data = {}) {
    const defaults = {
      image: '', darkImage: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true,
      ...data
    };
    const legacyPosition = {
      id: `benefits-feed-mosaic-position-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      image: defaults.image,
      darkImage: defaults.darkImage,
      routeType: defaults.routeType || (data.routeValue ? 'page' : ''),
      routeProtocol: defaults.routeProtocol || data.routeValue || '',
      pid: defaults.pid,
      selectedPid: defaults.selectedPid,
      skipType: defaults.skipType,
      mallId: defaults.mallId,
      popupLogo: defaults.popupLogo,
      popupCopy: defaults.popupCopy,
      requiresLogin: defaults.requiresLogin
    };
    const positions = Array.isArray(data.positions) && data.positions.length
      ? data.positions.map((position) => ({ ...legacyPosition, ...position, id: position.id || `benefits-feed-mosaic-position-${Date.now()}-${Math.random().toString(16).slice(2)}` }))
      : [legacyPosition];
    return { ...defaults, positions, selectedPositionId: positions.some((position) => position.id === data.selectedPositionId) ? data.selectedPositionId : positions[0].id };
  },
  createBenefitsFeedGridConfig(data = {}) {
    const defaults = {
      title: '', cornerCopy: '', image: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true,
      ...data
    };
    const legacyPosition = {
      id: `benefits-feed-grid-position-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: defaults.title,
      cornerCopy: defaults.cornerCopy,
      image: defaults.image,
      routeType: defaults.routeType || (data.routeValue ? 'page' : ''),
      routeProtocol: defaults.routeProtocol || data.routeValue || '',
      pid: defaults.pid,
      selectedPid: defaults.selectedPid,
      skipType: defaults.skipType,
      mallId: defaults.mallId,
      popupLogo: defaults.popupLogo,
      popupCopy: defaults.popupCopy,
      requiresLogin: defaults.requiresLogin
    };
    const positions = Array.isArray(data.positions) && data.positions.length
      ? data.positions.map((position) => ({ ...legacyPosition, ...position, id: position.id || `benefits-feed-grid-position-${Date.now()}-${Math.random().toString(16).slice(2)}` }))
      : [legacyPosition];
    return { ...defaults, positions, selectedPositionId: positions.some((position) => position.id === data.selectedPositionId) ? data.selectedPositionId : positions[0].id };
  },
  createBenefitsFeedRedPacketConfig(data = {}) {
    return {
      name: '', deliveryType: 'single', titleArea: false, title: '', subtitle: '', titleImage: '', titleDarkImage: '', unclaimedImage: '', unclaimedDarkImage: '', template: 'with-button',
      targeting: window.ConfigurationSections.createTargeting(), testPlan: window.ConfigurationSections.createTestPlan(),
      ...data,
      targeting: window.ConfigurationSections.normalizeTargeting(data.targeting),
      testPlan: window.ConfigurationSections.normalizeTestPlan(data.testPlan)
    };
  },
  createBenefitsFeedComponent(type) {
    const definitions = {
      mosaic: { label: '信息流-拼图', hint: '多素材拼接展示，适用于活动主会场' },
      grid: { label: '信息流-宫格', hint: '多入口宫格展示，适用于分类运营' },
      'red-packet': { label: '信息流-红包发放功能', hint: '红包权益发放展示' }
    };
    const definition = definitions[type];
    return {
      id: `benefits-feed-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      label: definition.label,
      hint: definition.hint,
      recordName: '',
      image: '',
      darkImage: '',
      routeType: 'page',
      routeValue: '',
      mosaic: type === 'mosaic' ? this.createBenefitsFeedMosaicConfig() : undefined,
      grid: type === 'grid' ? this.createBenefitsFeedGridConfig() : undefined,
      redPacket: type === 'red-packet' ? this.createBenefitsFeedRedPacketConfig({ name: definition.label }) : undefined,
      slotOrder: this.getBenefitsFeedSlotDefinitions(type).map((slot) => slot.id),
      targeting: window.ConfigurationSections.createTargeting(),
      testPlan: window.ConfigurationSections.createTestPlan(),
      isSaved: false,
      hasBeenSaved: false
    };
  },
  getBenefitsFeedSlotDefinitions(type) {
    const definitions = {
      mosaic: [
        { id: 'main', label: '主会场', detail: '福利活动主会场' },
        { id: 'limit', label: '限时' },
        { id: 'gift', label: '好礼' }
      ],
      grid: [
        { id: 'newcomer', label: '新人福利' },
        { id: 'coupon', label: '每日好券' },
        { id: 'task', label: '省钱任务' },
        { id: 'benefit', label: '精选权益' }
      ],
      'red-packet': [
        { id: 'content', label: '福利红包' },
        { id: 'action', label: '立即领取' }
      ]
    };
    return definitions[type] || [];
  },
  getBenefitsFeedSlots(component) {
    const definitions = this.getBenefitsFeedSlotDefinitions(component.type);
    const ids = new Set(definitions.map((slot) => slot.id));
    const savedOrder = Array.isArray(component.slotOrder) ? component.slotOrder.filter((id) => ids.has(id)) : [];
    const order = [...savedOrder, ...definitions.map((slot) => slot.id).filter((id) => !savedOrder.includes(id))];
    return order.map((id) => definitions.find((slot) => slot.id === id));
  },
  createDefaultBenefitsFeedState() {
    return { components: [] };
  },
  loadBenefitsFeedState() {
    const defaults = this.createDefaultBenefitsFeedState();
    try {
      const saved = JSON.parse(window.localStorage.getItem(this.benefitsFeedStorageKey));
      if (!saved || !Array.isArray(saved.components)) return defaults;
      return {
        components: saved.components.filter((item) => ['mosaic', 'grid', 'red-packet'].includes(item?.type)).map((item) => ({
          ...this.createBenefitsFeedComponent(item.type),
          ...item,
          mosaic: item.type === 'mosaic' ? this.createBenefitsFeedMosaicConfig({ ...item, ...item.mosaic }) : item.mosaic,
          grid: item.type === 'grid' ? this.createBenefitsFeedGridConfig({ ...item, ...item.grid }) : item.grid,
          redPacket: item.type === 'red-packet' ? this.createBenefitsFeedRedPacketConfig({ name: item.recordName || item.label || '信息流-红包发放功能', ...item.redPacket }) : item.redPacket,
          slotOrder: this.getBenefitsFeedSlots({ type: item.type, slotOrder: item.slotOrder }).map((slot) => slot.id),
          targeting: window.ConfigurationSections.normalizeTargeting(item.targeting),
          testPlan: window.ConfigurationSections.normalizeTestPlan(item.testPlan),
          isSaved: item.isSaved ?? true,
          hasBeenSaved: item.hasBeenSaved ?? true
        }))
      };
    } catch (error) {
      return defaults;
    }
  },
  saveBenefitsFeedState(state) {
    window.localStorage.setItem(this.benefitsFeedStorageKey, JSON.stringify(state));
  },
  getPrimaryComponentConfig(tab, view = 'feed') {
    const key = `${tab}:${view}`;
    const definitions = {
      'youzi-street:flash-sale': {
        storageKey: this.primaryComponentStorageKeys[key],
        title: '柚子街-限时抢购',
        note: '维护柚子街限时抢购展示配置',
        previewTitle: '柚子街',
        previewTag: '限时抢购',
        palette: ['mosaic', 'grid', 'red-packet']
      },
      'mine:feed': {
        storageKey: this.primaryComponentStorageKeys[key],
        title: '我-信息流营销',
        note: '维护我页面信息流资源位展示配置',
        previewTitle: '我的',
        previewTag: '精选服务',
        palette: ['mosaic', 'grid', 'red-packet']
      }
    };
    return definitions[key] || null;
  },
  loadPrimaryComponentState(config) {
    try {
      const saved = JSON.parse(window.localStorage.getItem(config.storageKey));
      if (!saved || !Array.isArray(saved.components)) return { components: [] };
      return {
        components: saved.components.filter((item) => config.palette.includes(item?.type)).map((item) => ({
          ...this.createBenefitsFeedComponent(item.type),
          ...item,
          mosaic: item.type === 'mosaic' ? this.createBenefitsFeedMosaicConfig({ ...item, ...item.mosaic }) : item.mosaic,
          grid: item.type === 'grid' ? this.createBenefitsFeedGridConfig({ ...item, ...item.grid }) : item.grid,
          redPacket: item.type === 'red-packet' ? this.createBenefitsFeedRedPacketConfig({ name: item.recordName || item.label || '信息流-红包发放功能', ...item.redPacket }) : item.redPacket,
          slotOrder: this.getBenefitsFeedSlots({ type: item.type, slotOrder: item.slotOrder }).map((slot) => slot.id),
          targeting: window.ConfigurationSections.normalizeTargeting(item.targeting),
          testPlan: window.ConfigurationSections.normalizeTestPlan(item.testPlan),
          isSaved: item.isSaved ?? true,
          hasBeenSaved: item.hasBeenSaved ?? true
        }))
      };
    } catch (error) {
      return { components: [] };
    }
  },
  savePrimaryComponentState(config, state) {
    window.localStorage.setItem(config.storageKey, JSON.stringify(state));
  },
  getComponentConfigurationRecords(state = {}) {
    return (Array.isArray(state.components) ? state.components : [])
      .filter((component) => component.hasBeenSaved || component.isSaved)
      .map((component) => {
        const redPacket = component.type === 'red-packet' ? this.createBenefitsFeedRedPacketConfig(component.redPacket) : null;
        const name = redPacket ? redPacket.name : component.recordName || component.label;
        const slotCount = component.type === 'mosaic'
          ? this.createBenefitsFeedMosaicConfig(component.mosaic).positions.length
          : component.type === 'grid'
            ? this.createBenefitsFeedGridConfig(component.grid).positions.length
            : this.getBenefitsFeedSlots(component).length;
        return {
          id: component.id,
          type: component.label || '信息流组件',
          name: name || '未填写记录名称',
          summary: `${component.type === 'red-packet' ? `发放类型：${redPacket.deliveryType === 'package' ? '券包发放' : '单个发放'}；` : ''}配置展位：${slotCount} 个`,
          status: redPacket ? redPacket.targeting.status : window.ConfigurationSections.normalizeTargeting(component.targeting).status
        };
      });
  },
  setConfigurationListAction({ title, records, onSelect } = {}) {
    const actions = document.getElementById('marketing-page-actions');
    if (!actions) return;
    actions.innerHTML = '<button class="button secondary" id="view-current-configuration-list" type="button">查看配置列表</button>';
    actions.querySelector('#view-current-configuration-list')?.addEventListener('click', () => {
      window.ConfigurationList.open({ title, records: typeof records === 'function' ? records() : records, onSelect });
    });
  },
  createDefaultBenefitsCheckInState() {
    const record = (id, recordName, conflictPriority, createdAt, updatedAt) => ({
      id,
      recordName,
      targeting: {
        ...window.ConfigurationSections.createTargeting(),
        identities: ['辣妈'],
        audiences: ['大促活动用户'],
        onlineStart: '2026-01-07T00:00',
        onlineEnd: '2026-01-08T23:59'
      },
      status: '已下线',
      conflictPriority,
      functionConfig: this.createBenefitsCheckInFunctionConfig(),
      creator: '罗至玲',
      createdAt,
      editor: '罗至玲',
      updatedAt
    });
    return { records: [
      record('1', '260107预发测试', true, '2026-01-07 13:41:31', '2026-08-05 16:26:01'),
      record('4', 'copy260107预发测试', false, '2026-01-07 14:53:20', '2026-01-07 20:29:44')
    ] };
  },
  createBenefitsCheckInFunctionConfig(data = {}) {
    const mainCopy = data.mainCopy || '去下单';
    return {
      mainCopy,
      subCopy: '拿返现叠加补贴',
      routeType: data.routeType || '',
      routeProtocol: data.routeProtocol || '',
      pid: data.pid || '',
      selectedPid: data.selectedPid || '',
      skipType: data.skipType || '',
      mallId: data.mallId || '',
      materialName: data.materialName || '',
      popupLogo: data.popupLogo || '',
      popupCopy: data.popupCopy || '',
      requiresLogin: data.requiresLogin ?? true
    };
  },
  normalizeBenefitsCheckInRecord(record = {}) {
    return {
      id: String(record.id || Date.now()),
      recordName: record.recordName || '',
      targeting: window.ConfigurationSections.normalizeTargeting(record.targeting),
      status: ['上线中', '待上线', '已下线'].includes(record.status) ? record.status : '待上线',
      conflictPriority: Boolean(record.conflictPriority),
      functionConfig: this.createBenefitsCheckInFunctionConfig(record.functionConfig),
      creator: record.creator || '当前运营',
      createdAt: record.createdAt || '',
      editor: record.editor || '当前运营',
      updatedAt: record.updatedAt || ''
    };
  },
  loadBenefitsCheckInState() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(this.benefitsCheckInStorageKey));
      if (!saved || !Array.isArray(saved.records)) return this.createDefaultBenefitsCheckInState();
      return { records: saved.records.map((record) => this.normalizeBenefitsCheckInRecord(record)) };
    } catch (error) {
      return this.createDefaultBenefitsCheckInState();
    }
  },
  saveBenefitsCheckInState(state) {
    window.localStorage.setItem(this.benefitsCheckInStorageKey, JSON.stringify(state));
  },
  formatCheckInDate(value) {
    return value ? String(value).replace('T', ' ') : '-';
  },
  formatCheckInTargeting(value) {
    const targeting = window.ConfigurationSections.normalizeTargeting(value);
    const summary = [];
    if (targeting.identities.length) summary.push(`指定人群身份:${targeting.identities.join('、')}`);
    if (targeting.audiences.length) summary.push(`定制人群:${targeting.audiences.join('、')}`);
    if (targeting.targetGroup) summary.push(`指定人群包:${targeting.targetGroup}`);
    return summary.join(' 与 ') || '全部用户';
  },
  currentCheckInTime() {
    const date = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  },
  renderBenefitsCheckInList() {
    return `<section class="benefits-check-in-management" aria-label="打卡功能营销配置列表">
      <div class="filters benefits-check-in-filters">
        <div class="field"><label for="check-in-name-filter">记录名称：</label><input class="control" id="check-in-name-filter" placeholder="请输入名称进行搜索" /></div>
        <div class="field"><label for="check-in-status-filter">状态：</label><select class="control" id="check-in-status-filter"><option value="">请选择状态</option><option value="上线中">上线中</option><option value="待上线">待上线</option><option value="已下线">已下线</option></select></div>
        <div class="field check-in-date-filter"><label>上线时间：</label><span class="check-in-date-controls"><input class="control" id="check-in-start-filter" type="datetime-local" aria-label="上线开始时间" /><i>-</i><input class="control" id="check-in-end-filter" type="datetime-local" aria-label="上线结束时间" /></span></div>
        <div class="filter-checkboxes"><label><input id="check-in-priority-filter" type="checkbox" />仅看冲突时优先展示</label></div>
      </div>
      <div class="actions benefits-check-in-actions"><button class="button primary" id="search-check-in" type="button">查询</button><button class="button secondary" id="add-check-in" type="button">新增配置</button></div>
      <div class="table-wrap"><table class="benefits-check-in-table"><thead><tr><th>ID</th><th>记录名称</th><th>定向信息</th><th>上线时间</th><th>下线时间</th><th>状态</th><th>冲突时优先展示 <button class="help-tooltip" type="button" data-tooltip="同一时间命中多条配置时，优先展示已勾选的配置。">?</button></th><th>创建人</th><th>创建时间</th><th>最后编辑</th><th>最后更新时间</th><th>操作</th></tr></thead><tbody id="check-in-table-body"></tbody></table></div>
      <div class="empty" id="check-in-empty" hidden><div class="empty-inner"><div class="empty-icon">▰</div><div>暂无配置数据</div></div></div>
      <div class="modal is-editor-fullscreen" id="check-in-modal" hidden></div>
    </section>`;
  },
  renderBenefitsCheckInModal(record, isNew) {
    const value = this.normalizeBenefitsCheckInRecord(record);
    const field = (label, control) => `<div class="config-field"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    const config = value.functionConfig;
    const asset = `<span class="home-showcase-asset"><span class="home-showcase-asset-preview">${config.popupLogo ? `<img src="${config.popupLogo}" alt="已上传出站弹窗 logo" />` : '<b>图片</b>'}</span><span class="home-showcase-asset-actions"><label class="button secondary home-entry-upload">出站弹窗 logo<input id="check-in-popup-logo" type="file" accept="image/*" /></label><button class="home-entry-delete" id="delete-check-in-popup-logo" type="button"${config.popupLogo ? '' : ' disabled'}>删除图片</button></span></span>`;
    const preview = `<aside class="check-in-preview-panel" aria-label="手机预览"><span class="check-in-preview-label">手机预览</span><div class="check-in-phone-frame"><div class="check-in-phone-status"><span>9:41</span><span>▮▮▮ ◔ ▭</span></div><div class="check-in-preview-hero"><span>‹</span><b>累计获得补贴</b><strong>20.39<small>元</small></strong><em>获得后 7 天内有效</em><i>可用现金补贴：0.68 元 ›</i><div class="check-in-preview-calendar">✓</div></div><section class="check-in-preview-card"><div class="check-in-preview-title"><b>签到打卡，领下单现金补贴</b><span>规则 ?</span></div><p>获得打卡现金补贴，下单和订单返现叠加到账</p><div class="check-in-preview-days"><span>¥ 0.07<br /><i>✓</i><small>06.27</small></span><span>??<br /><i>错过</i><small>06.28</small></span><span>??<br /><i>错过</i><small>06.29</small></span><span>¥ 0.41<br /><i>✓</i><small>今天</small></span><span>??<br /><i>◉</i><small>07.01</small></span></div><button class="check-in-preview-action" type="button"><b data-check-in-preview-main>${this.escapeHtml(config.mainCopy)}</b><small data-check-in-preview-sub>${this.escapeHtml(config.subCopy)}</small></button><div class="check-in-preview-benefits"><b>从商城下单，返现可叠加打卡补贴到账</b><span>多多　唯品会　美团　饿了么　滴滴出行</span><i>2.5%　约返5%　再返2%　再返3.5%　再返3%</i></div><div class="check-in-preview-tips"><b>现金补贴提现技巧</b><span>来签到领取　　下单拿返现　　补贴到账后</span><small>现金补贴　　　叠加现金补贴　　可提现</small></div></section></div></aside>`;
    return `<div class="modal-card check-in-modal-card" role="dialog" aria-modal="true" aria-labelledby="check-in-modal-title"><div class="modal-header"><h2 id="check-in-modal-title">${isNew ? '新增打卡功能营销配置' : '编辑打卡功能营销配置'}</h2><button class="icon-close" id="close-check-in-modal" type="button" aria-label="关闭">×</button></div><div class="modal-body check-in-modal-body check-in-modal-layout">${preview}<div class="style-config-form home-component-form check-in-form"><section class="home-entry-info-section shared-config-section"><h3>基本信息</h3>${field('<b class="field-required">*</b>记录名称', `<input class="control" id="check-in-record-name" value="${this.escapeHtml(value.recordName)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}${field('<b class="field-required">*</b>上线时间', `<div class="config-date-range"><label><span>开始</span><input class="control" id="check-in-online-start" type="datetime-local" value="${this.escapeHtml(value.targeting.onlineStart)}" /></label><label><span>结束</span><input class="control" id="check-in-online-end" type="datetime-local" value="${this.escapeHtml(value.targeting.onlineEnd)}" /></label></div>`)}${field('<b class="field-required">*</b>状态', `<span class="home-entry-status-control"><label><input name="check-in-status" type="radio" value="上线中"${value.status === '上线中' ? ' checked' : ''} />上线中</label><label><input name="check-in-status" type="radio" value="待上线"${value.status === '待上线' ? ' checked' : ''} />待上线</label><label><input name="check-in-status" type="radio" value="已下线"${value.status === '已下线' ? ' checked' : ''} />已下线</label></span>`)}${field('冲突时优先展示', `<label class="check-in-priority-control"><input id="check-in-conflict-priority" type="checkbox"${value.conflictPriority ? ' checked' : ''} />优先展示</label>`)}</section><section class="home-entry-info-section shared-config-section check-in-function-section"><h3>功能配置</h3><p class="check-in-function-notice">仅支持打卡状态为已打卡的功能营销配置。按钮副文案为系统固定文案“拿返现叠加补贴”。</p>${field('<b class="field-required">*</b>按钮主文案', `<input class="control" id="check-in-main-copy" value="${this.escapeHtml(config.mainCopy)}" maxlength="12" placeholder="请输入按钮主文案" />`)}${field('按钮副文案', `<input class="control" id="check-in-sub-copy" value="${this.escapeHtml(config.subCopy)}" disabled />`)}${field('按钮跳转', `<div class="check-in-function-workspace"><span class="home-showcase-route-example">路由协议填写示例</span><div class="home-showcase-route-row"><select class="control" id="check-in-route-type"><option value="">请选择跳转类型</option><option value="page"${config.routeType === 'page' ? ' selected' : ''}>页面跳转</option><option value="protocol"${config.routeType === 'protocol' ? ' selected' : ''}>自定义地址/协议</option></select><input class="control" id="check-in-route-protocol" value="${this.escapeHtml(config.routeProtocol)}" placeholder="请输入路由协议" /></div><input class="control" id="check-in-pid" value="${this.escapeHtml(config.pid)}" placeholder="pid（除京东&拼多多&抖音&1688，其余商城用于埋点上报）" /><select class="control" id="check-in-selected-pid"><option value="">请选择 pid</option><option value="default"${config.selectedPid === 'default' ? ' selected' : ''}>默认 pid</option><option value="custom"${config.selectedPid === 'custom' ? ' selected' : ''}>自定义 pid</option></select><input class="control" id="check-in-skip-type" value="${this.escapeHtml(config.skipType)}" placeholder="skip_type（用于埋点上报）" /><input class="control" id="check-in-mall-id" value="${this.escapeHtml(config.mallId)}" placeholder="商城 id" /><input class="control" id="check-in-material-name" value="${this.escapeHtml(config.materialName)}" placeholder="素材名称" /><div class="home-showcase-popup-row">${asset}<input class="control" id="check-in-popup-copy" value="${this.escapeHtml(config.popupCopy)}" placeholder="出站弹窗文案" /></div><label class="home-showcase-login"><input id="check-in-requires-login" type="checkbox"${config.requiresLogin ? ' checked' : ''} />用户需登录</label></div>`)}</section>${window.ConfigurationSections.renderTargeting({ prefix: 'check-in', value: value.targeting, includeSchedule: false, required: true })}</div></div><div class="modal-footer"><button class="button secondary" id="cancel-check-in-modal" type="button">取消</button><button class="button primary" id="save-check-in-modal" type="button">保存</button></div></div>`;
  },
  bindBenefitsCheckInList() {
    const state = this.loadBenefitsCheckInState();
    const records = state.records;
    const tableBody = document.getElementById('check-in-table-body');
    const empty = document.getElementById('check-in-empty');
    const modal = document.getElementById('check-in-modal');
    const getFilters = () => ({
      name: document.getElementById('check-in-name-filter').value.trim().toLowerCase(),
      status: document.getElementById('check-in-status-filter').value,
      start: document.getElementById('check-in-start-filter').value,
      end: document.getElementById('check-in-end-filter').value,
      priority: document.getElementById('check-in-priority-filter').checked
    });
    const renderTable = () => {
      const filters = getFilters();
      const visible = records.filter((record) => {
        const start = record.targeting.onlineStart || '';
        return (!filters.name || record.recordName.toLowerCase().includes(filters.name))
          && (!filters.status || record.status === filters.status)
          && (!filters.start || start >= filters.start)
          && (!filters.end || start <= filters.end)
          && (!filters.priority || record.conflictPriority);
      });
      tableBody.innerHTML = visible.map((record) => `<tr><td>${this.escapeHtml(record.id)}</td><td>${this.escapeHtml(record.recordName)}</td><td><span class="check-in-targeting" title="${this.escapeHtml(this.formatCheckInTargeting(record.targeting))}">${this.escapeHtml(this.formatCheckInTargeting(record.targeting))}</span></td><td>${this.escapeHtml(this.formatCheckInDate(record.targeting.onlineStart))}</td><td>${this.escapeHtml(this.formatCheckInDate(record.targeting.onlineEnd))}</td><td><span class="status-badge${record.status === '已下线' ? ' is-inactive' : ''}">${this.escapeHtml(record.status)}</span></td><td>${record.conflictPriority ? '是' : '否'}</td><td>${this.escapeHtml(record.creator)}</td><td>${this.escapeHtml(record.createdAt)}</td><td>${this.escapeHtml(record.editor)}</td><td>${this.escapeHtml(record.updatedAt)}</td><td><div class="check-in-table-actions"><button class="check-in-table-action" type="button" data-check-in-edit="${this.escapeHtml(record.id)}">编辑</button><button class="check-in-table-action" type="button" data-check-in-copy="${this.escapeHtml(record.id)}">复制</button></div></td></tr>`).join('');
      empty.hidden = visible.length > 0;
    };
    const closeModal = () => { modal.hidden = true; modal.innerHTML = ''; };
    const readModalRecord = (base) => {
      const targeting = window.ConfigurationSections.normalizeTargeting(base.targeting);
      targeting.identities = [...modal.querySelectorAll('[data-check-in-identity]:checked')].map((input) => input.value);
      targeting.audiences = [...modal.querySelectorAll('[data-check-in-audience]:checked')].map((input) => input.value);
      targeting.targetGroup = modal.querySelector('[data-check-in-targeting-field="targetGroup"]')?.value.trim() || '';
      targeting.excludeGroup = modal.querySelector('[data-check-in-targeting-field="excludeGroup"]')?.value.trim() || '';
      targeting.audienceInversion = modal.querySelector('[name="check-in-audience-inversion"]:checked')?.value || '否';
      targeting.experimentId = modal.querySelector('[data-check-in-targeting-field="experimentId"]')?.value.trim() || '';
      targeting.excludeExperiment = modal.querySelector('[data-check-in-targeting-field="excludeExperiment"]')?.value.trim() || '';
      ['ios', 'android', 'harmony'].forEach((platform) => {
        targeting.platformVersions[platform].enabled = modal.querySelector(`[data-check-in-platform="${platform}"]`)?.checked ?? false;
        targeting.platformVersions[platform].start = modal.querySelector(`[data-check-in-version="${platform}:start"]`)?.value.trim() || '';
        targeting.platformVersions[platform].end = modal.querySelector(`[data-check-in-version="${platform}:end"]`)?.value.trim() || '';
      });
      targeting.onlineStart = modal.querySelector('#check-in-online-start').value;
      targeting.onlineEnd = modal.querySelector('#check-in-online-end').value;
      const mainCopy = modal.querySelector('#check-in-main-copy').value.trim();
      return {
        ...base,
        recordName: modal.querySelector('#check-in-record-name').value.trim(),
        targeting,
        status: modal.querySelector('[name="check-in-status"]:checked')?.value || '待上线',
        conflictPriority: modal.querySelector('#check-in-conflict-priority').checked,
        functionConfig: this.createBenefitsCheckInFunctionConfig({
          mainCopy,
          subCopy: '拿返现叠加补贴',
          routeType: modal.querySelector('#check-in-route-type').value,
          routeProtocol: modal.querySelector('#check-in-route-protocol').value.trim(),
          pid: modal.querySelector('#check-in-pid').value.trim(),
          selectedPid: modal.querySelector('#check-in-selected-pid').value,
          skipType: modal.querySelector('#check-in-skip-type').value.trim(),
          mallId: modal.querySelector('#check-in-mall-id').value.trim(),
          materialName: modal.querySelector('#check-in-material-name').value.trim(),
          popupLogo: modal.dataset.checkInPopupLogo || '',
          popupCopy: modal.querySelector('#check-in-popup-copy').value.trim(),
          requiresLogin: modal.querySelector('#check-in-requires-login').checked
        })
      };
    };
    const openModal = (record = null) => {
      const isNew = !record;
      const now = this.currentCheckInTime();
      const draft = this.normalizeBenefitsCheckInRecord(record || { id: String(Date.now()), creator: '当前运营', editor: '当前运营', createdAt: now, updatedAt: now });
      modal.innerHTML = this.renderBenefitsCheckInModal(draft, isNew);
      modal.dataset.checkInPopupLogo = draft.functionConfig.popupLogo;
      modal.hidden = false;
      modal.querySelector('#check-in-main-copy').addEventListener('input', (event) => {
        modal.querySelector('[data-check-in-preview-main]').textContent = event.target.value.trim() || '去下单';
      });
      modal.querySelector('#check-in-popup-logo').addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
          modal.dataset.checkInPopupLogo = await this.readImageFile(file);
          const preview = modal.querySelector('.home-showcase-asset-preview');
          preview.innerHTML = `<img src="${modal.dataset.checkInPopupLogo}" alt="已上传出站弹窗 logo" />`;
          modal.querySelector('#delete-check-in-popup-logo').disabled = false;
        } catch (error) {
          window.BackofficeLayout.showToast('图片读取失败', '请重新选择图片');
        }
      });
      const handleModalClick = (event) => {
        if (event.target === modal || event.target.closest('#close-check-in-modal, #cancel-check-in-modal')) { closeModal(); return; }
        if (event.target.closest('#delete-check-in-popup-logo')) {
          modal.dataset.checkInPopupLogo = '';
          const preview = modal.querySelector('.home-showcase-asset-preview');
          preview.innerHTML = '<b>图片</b>';
          modal.querySelector('#delete-check-in-popup-logo').disabled = true;
          return;
        }
        if (!event.target.closest('#save-check-in-modal')) return;
        const next = readModalRecord(draft);
        if (!next.recordName || !next.targeting.onlineStart || !next.targeting.onlineEnd) {
          window.BackofficeLayout.showToast('请完善必填项', '请填写记录名称和上线时间');
          return;
        }
        if (next.targeting.onlineStart > next.targeting.onlineEnd) {
          window.BackofficeLayout.showToast('上线时间有误', '上线结束时间不能早于开始时间');
          return;
        }
        next.updatedAt = this.currentCheckInTime();
        if (isNew) records.unshift(next);
        else Object.assign(records.find((item) => item.id === next.id), next);
        try { this.saveBenefitsCheckInState({ records }); } catch (error) { window.BackofficeLayout.showToast('保存失败', '本地演示数据无法保存，请稍后重试'); return; }
        closeModal();
        renderTable();
        window.BackofficeLayout.showToast(isNew ? '新增成功' : '保存成功', '打卡功能营销配置已更新');
      };
      modal.onclick = handleModalClick;
    };
    document.getElementById('search-check-in').addEventListener('click', renderTable);
    document.getElementById('check-in-name-filter').addEventListener('keydown', (event) => { if (event.key === 'Enter') renderTable(); });
    document.getElementById('add-check-in').addEventListener('click', () => openModal());
    tableBody.addEventListener('click', (event) => {
      const edit = event.target.closest('[data-check-in-edit]');
      if (edit) { openModal(records.find((record) => record.id === edit.dataset.checkInEdit)); return; }
      const copy = event.target.closest('[data-check-in-copy]');
      if (!copy) return;
      const source = records.find((record) => record.id === copy.dataset.checkInCopy);
      if (!source) return;
      const now = this.currentCheckInTime();
      const cloned = JSON.parse(JSON.stringify(source));
      cloned.id = String(Math.max(0, ...records.map((record) => Number(record.id) || 0)) + 1);
      cloned.recordName = `copy${source.recordName}`;
      cloned.conflictPriority = false;
      cloned.creator = '当前运营';
      cloned.editor = '当前运营';
      cloned.createdAt = now;
      cloned.updatedAt = now;
      records.unshift(cloned);
      try { this.saveBenefitsCheckInState({ records }); } catch (error) { window.BackofficeLayout.showToast('复制失败', '本地演示数据无法保存，请稍后重试'); return; }
      renderTable();
      window.BackofficeLayout.showToast('已复制配置', '已创建一条新的打卡功能营销配置');
    });
    renderTable();
  },
  createDefaultBenefitsCheckInSuccessState() {
    const record = (id, recordName, createdAt, updatedAt) => ({
      id,
      recordName,
      targeting: { identities: ['经期'], versions: { ios: '9.02.0.0', android: '9.02.0.0' } },
      onlineStart: '2026-01-07T00:00',
      onlineEnd: '2026-01-08T23:59',
      status: '已下线',
      conflictPriority: true,
      creator: '罗至玲',
      createdAt,
      editor: '罗至玲',
      updatedAt
    });
    return { records: [
      record('2', '260107预发测试', '2026-01-07 13:43:46', '2026-08-05 16:30:24'),
      record('3', 'copy260107预发测试01', '2026-01-07 14:18:44', '2026-01-07 20:29:24')
    ] };
  },
  createBenefitsCheckInSuccessRoute(data = {}) {
    return {
      routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', materialName: '', popupLogo: '', popupCopy: '', requiresLogin: true,
      ...data
    };
  },
  createBenefitsCheckInSuccessFunctionConfig(data = {}) {
    return {
      mainCopy: '去下单',
      subCopy: '拿返现叠加补贴',
      buttonRoute: this.createBenefitsCheckInSuccessRoute(data.buttonRoute || data),
      resourceImage: data.resourceImage || '',
      resourceRoute: this.createBenefitsCheckInSuccessRoute(data.resourceRoute),
      ...data,
      buttonRoute: this.createBenefitsCheckInSuccessRoute(data.buttonRoute || data),
      resourceRoute: this.createBenefitsCheckInSuccessRoute(data.resourceRoute)
    };
  },
  normalizeBenefitsCheckInSuccessRecord(record = {}) {
    const targeting = window.ConfigurationSections.normalizeTargeting({
      ...(record.targeting || {}),
      onlineStart: record.targeting?.onlineStart || record.onlineStart || '',
      onlineEnd: record.targeting?.onlineEnd || record.onlineEnd || '',
      status: record.targeting?.status || (record.status === '已下线' ? '下线' : '上线')
    });
    return {
      id: String(record.id || Date.now()),
      recordName: record.recordName || '',
      targeting,
      onlineStart: targeting.onlineStart,
      onlineEnd: targeting.onlineEnd,
      status: ['上线中', '待上线', '已下线'].includes(record.status) ? record.status : '待上线',
      conflictPriority: Boolean(record.conflictPriority),
      functionConfig: this.createBenefitsCheckInSuccessFunctionConfig(record.functionConfig),
      testPlan: window.ConfigurationSections.normalizeTestPlan(record.testPlan),
      creator: record.creator || '当前运营',
      createdAt: record.createdAt || '',
      editor: record.editor || '当前运营',
      updatedAt: record.updatedAt || ''
    };
  },
  loadBenefitsCheckInSuccessState() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(this.benefitsCheckInSuccessStorageKey));
      // This module has no deletion flow, so an empty persisted list indicates stale demo data.
      if (!saved || !Array.isArray(saved.records) || saved.records.length === 0) return this.createDefaultBenefitsCheckInSuccessState();
      return { records: saved.records.map((record) => this.normalizeBenefitsCheckInSuccessRecord(record)) };
    } catch (error) {
      return this.createDefaultBenefitsCheckInSuccessState();
    }
  },
  saveBenefitsCheckInSuccessState(state) {
    window.localStorage.setItem(this.benefitsCheckInSuccessStorageKey, JSON.stringify(state));
  },
  formatCheckInSuccessTargeting(value) {
    const identities = value?.identities?.length ? `指定人群身份:${value.identities.join('、')}` : '全部用户';
    const versions = Object.entries(value?.versions || {}).filter(([, version]) => version).map(([platform, version]) => `${platform}：${version}`);
    return versions.length ? `${identities} 与 平台和版本：${versions.join('；')}` : identities;
  },
  renderBenefitsCheckInSuccessList() {
    const priorityTip = '当发生人群冲突时：若仅有一条配置勾选此项，则展示有勾选此项的配置；若多条同时勾选或均未勾选，则展示功能基线样式';
    return `<section class="benefits-check-in-management benefits-check-in-success-management" aria-label="打卡成功弹窗管理">
      <div class="filters benefits-check-in-filters">
        <div class="field"><label for="check-in-success-name-filter">记录名称：</label><input class="control" id="check-in-success-name-filter" placeholder="请输入名称进行搜索" /></div>
        <div class="field"><label for="check-in-success-status-filter">状态：</label><select class="control" id="check-in-success-status-filter"><option value="">请选择状态</option><option value="上线中">上线中</option><option value="待上线">待上线</option><option value="已下线">已下线</option></select></div>
        <div class="field check-in-date-filter"><label>上线时间：</label><span class="check-in-date-controls"><input class="control" id="check-in-success-start-filter" type="datetime-local" aria-label="上线开始时间" /><i>-</i><input class="control" id="check-in-success-end-filter" type="datetime-local" aria-label="上线结束时间" /></span></div>
        <div class="filter-checkboxes"><label><input id="check-in-success-priority-filter" type="checkbox" />仅看冲突时优先展示</label></div>
      </div>
      <div class="actions benefits-check-in-actions"><button class="button primary" id="search-check-in-success" type="button">查询</button><button class="button check-in-success-add" id="add-check-in-success" type="button">新增弹窗</button></div>
      <div class="table-wrap"><table class="benefits-check-in-table"><thead><tr><th>ID</th><th>记录名称</th><th>定向信息</th><th><button class="check-in-success-sort" data-check-in-success-sort="onlineStart" type="button">上线时间 <span>↕</span></button></th><th><button class="check-in-success-sort" data-check-in-success-sort="onlineEnd" type="button">下线时间 <span>↕</span></button></th><th>状态</th><th>冲突时优先展示 <button class="help-tooltip" type="button" data-tooltip="${priorityTip}" aria-label="冲突时优先展示说明">?</button></th><th>创建人</th><th>创建时间</th><th>最后编辑</th><th>最后更新时间</th><th>操作</th></tr></thead><tbody id="check-in-success-table-body"></tbody></table></div>
      <div class="empty" id="check-in-success-empty" hidden><div class="empty-inner"><div class="empty-icon">▰</div><div>暂无配置数据</div></div></div>
      <div class="check-in-success-pagination" id="check-in-success-pagination"></div>
      <div class="modal is-editor-fullscreen" id="check-in-success-modal" hidden></div>
    </section>`;
  },
  renderBenefitsCheckInSuccessModal(record, isNew) {
    const value = this.normalizeBenefitsCheckInSuccessRecord(record);
    const config = value.functionConfig;
    const field = (label, control, className = '') => `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    const asset = (id, image, label) => `<span class="home-showcase-asset"><span class="home-showcase-asset-preview" data-check-in-success-image-preview="${id}">${image ? `<img src="${this.escapeHtml(image)}" alt="${label}" />` : '<b>图片</b>'}</span><span class="home-showcase-asset-actions"><label class="button secondary home-entry-upload">${label}<input type="file" accept="image/*" data-check-in-success-image="${id}" /></label><button class="home-entry-delete" type="button" data-check-in-success-image-delete="${id}"${image ? '' : ' disabled'}>删除图片</button></span></span>`;
    const route = (key, label, data) => `<div class="check-in-success-route" data-check-in-success-route="${key}"><span class="home-showcase-route-example">路由协议填写示例</span><div class="home-showcase-route-row"><select class="control" data-check-in-success-route-field="${key}:routeType"><option value="">请选择跳转类型</option><option value="page"${data.routeType === 'page' ? ' selected' : ''}>页面跳转</option><option value="protocol"${data.routeType === 'protocol' ? ' selected' : ''}>自定义地址/协议</option></select><input class="control" data-check-in-success-route-field="${key}:routeProtocol" value="${this.escapeHtml(data.routeProtocol)}" placeholder="请输入路由协议" /></div><div class="home-showcase-input-help"><input class="control" data-check-in-success-route-field="${key}:pid" value="${this.escapeHtml(data.pid)}" placeholder="pid（除京东&拼多多&抖音&1688，其余商城用于埋点上报）" /><button class="help-tooltip" type="button" data-tooltip="填写商城关联 PID，用于跳转与埋点上报。" aria-label="PID说明">?</button></div><div class="home-showcase-input-help"><select class="control" data-check-in-success-route-field="${key}:selectedPid"><option value="">请选择 pid</option><option value="default"${data.selectedPid === 'default' ? ' selected' : ''}>默认 pid</option><option value="custom"${data.selectedPid === 'custom' ? ' selected' : ''}>自定义 pid</option></select><button class="help-tooltip" type="button" data-tooltip="选择当前资源位使用的 PID。" aria-label="选择PID说明">?</button></div><div class="home-showcase-input-help"><input class="control" data-check-in-success-route-field="${key}:skipType" value="${this.escapeHtml(data.skipType)}" placeholder="skip_type（用于埋点上报）" /><button class="help-tooltip" type="button" data-tooltip="用于分析跳转来源的埋点字段。" aria-label="skip type说明">?</button></div><input class="control" data-check-in-success-route-field="${key}:mallId" value="${this.escapeHtml(data.mallId)}" placeholder="商城 id" /><input class="control" data-check-in-success-route-field="${key}:materialName" value="${this.escapeHtml(data.materialName)}" placeholder="素材名称" /><div class="home-showcase-popup-row">${asset(`${key}-popup-logo`, data.popupLogo, '出站弹窗 logo')}<input class="control" data-check-in-success-route-field="${key}:popupCopy" value="${this.escapeHtml(data.popupCopy)}" placeholder="出站弹窗文案" /></div><label class="home-showcase-login"><input type="checkbox" data-check-in-success-route-field="${key}:requiresLogin"${data.requiresLogin ? ' checked' : ''} />用户需登录</label></div>`;
    const preview = `<aside class="check-in-success-preview-panel" aria-label="预览"><span class="check-in-preview-label">预览</span><div class="check-in-success-phone"><div class="check-in-success-phone-status"><span>9:41</span><span>▮▮▮ ◔ ▭</span></div><div class="check-in-success-page"><span>‹</span><b>累计获得补贴</b><strong>20.39<small>元</small></strong><em>获得后 7 天内有效</em><i>可用现金补贴：0.68 元 ›</i></div><div class="check-in-success-mask"></div><section class="check-in-success-popup"><b>打卡成功</b><strong>最近7天已累计获得 <span>12.83<small>元</small></span></strong><p>今日打卡奖金补贴：+0.41元</p><button type="button"><span data-check-in-success-preview-main>${this.escapeHtml(config.mainCopy)}</span><small data-check-in-success-preview-sub>${this.escapeHtml(config.subCopy)}</small></button><i>去以下商城下单拿返现，可叠加现金补贴</i><div class="check-in-success-store-icons">淘 京 抖 唯 美 饿</div></section></div></aside>`;
    return `<div class="modal-card check-in-success-modal-card" role="dialog" aria-modal="true" aria-labelledby="check-in-success-modal-title"><div class="modal-header"><h2 id="check-in-success-modal-title">${isNew ? '新增打卡成功弹窗营销配置' : '编辑打卡成功弹窗营销配置'}</h2><button class="icon-close" id="close-check-in-success-modal" type="button" aria-label="关闭">×</button></div><div class="modal-body check-in-success-modal-layout">${preview}<div class="style-config-form home-component-form check-in-success-form"><section class="home-entry-info-section shared-config-section"><h3>基本信息</h3>${field('<b class="field-required">*</b>记录名称', `<input class="control" id="check-in-success-record-name" value="${this.escapeHtml(value.recordName)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}</section><section class="home-entry-info-section shared-config-section check-in-success-function-section"><h3>功能信息</h3><p class="check-in-success-notice">提示：仅支持打卡状态=已打卡的功能营销配置<br />若 按钮主文案="去下单"，则按钮副文案默认必填为“拿返现叠加补贴”</p>${field('<b class="field-required">*</b>按钮主文案', `<input class="control" id="check-in-success-main-copy" value="${this.escapeHtml(config.mainCopy)}" maxlength="12" placeholder="请输入按钮主文案" />`)}${field('按钮副文案', `<input class="control" id="check-in-success-sub-copy" value="${this.escapeHtml(config.subCopy)}" disabled />`)}${field('按钮跳转', route('button', '按钮跳转', config.buttonRoute), 'check-in-success-route-field')}${field('<b class="field-required">*</b>资源位素材', `<div class="check-in-success-material">${asset('resource-image', config.resourceImage, '上传图片')}<p>图片限制：宽度222，高度不超过136</p></div>`, 'check-in-success-route-field')}${field('资源位跳转', route('resource', '资源位跳转', config.resourceRoute), 'check-in-success-route-field')}</section>${window.ConfigurationSections.renderTargeting({ prefix: 'check-in-success', value: value.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'check-in-success', value: value.testPlan })}</div></div><div class="modal-footer"><button class="button secondary" id="cancel-check-in-success-modal" type="button">取消</button><button class="button primary" id="save-check-in-success-modal" type="button">保存</button></div></div>`;
  },
  bindBenefitsCheckInSuccessList() {
    const state = this.loadBenefitsCheckInSuccessState();
    const records = state.records;
    const tableBody = document.getElementById('check-in-success-table-body');
    const empty = document.getElementById('check-in-success-empty');
    const pagination = document.getElementById('check-in-success-pagination');
    const modal = document.getElementById('check-in-success-modal');
    let visible = records;
    let page = 1;
    let pageSize = 20;
    let sort = { key: '', direction: 1 };
    const filters = () => ({
      name: document.getElementById('check-in-success-name-filter').value.trim().toLowerCase(),
      status: document.getElementById('check-in-success-status-filter').value,
      start: document.getElementById('check-in-success-start-filter').value,
      end: document.getElementById('check-in-success-end-filter').value,
      priority: document.getElementById('check-in-success-priority-filter').checked
    });
    const renderPagination = () => {
      const count = visible.length;
      const pageCount = Math.max(1, Math.ceil(count / pageSize));
      page = Math.min(page, pageCount);
      pagination.innerHTML = `<span>共 ${count} 条</span><select class="control" id="check-in-success-page-size" aria-label="每页条数"><option value="20"${pageSize === 20 ? ' selected' : ''}>20条/页</option><option value="50"${pageSize === 50 ? ' selected' : ''}>50条/页</option></select><button type="button" data-check-in-success-page="prev"${page === 1 ? ' disabled' : ''} aria-label="上一页">‹</button><button class="is-active" type="button" data-check-in-success-page="1">${page}</button><button type="button" data-check-in-success-page="next"${page === pageCount ? ' disabled' : ''} aria-label="下一页">›</button><label>前往 <input class="control" id="check-in-success-page-input" value="${page}" inputmode="numeric" /> 页</label>`;
    };
    const renderTable = () => {
      const filter = filters();
      visible = records.filter((record) => (!filter.name || record.recordName.toLowerCase().includes(filter.name))
        && (!filter.status || record.status === filter.status)
        && (!filter.start || record.onlineStart >= filter.start)
        && (!filter.end || record.onlineStart <= filter.end)
        && (!filter.priority || record.conflictPriority));
      if (sort.key) visible.sort((left, right) => String(left[sort.key]).localeCompare(String(right[sort.key])) * sort.direction);
      page = Math.min(page, Math.max(1, Math.ceil(visible.length / pageSize)));
      const rows = visible.slice((page - 1) * pageSize, page * pageSize);
      tableBody.innerHTML = rows.map((record) => `<tr><td>${this.escapeHtml(record.id)}</td><td>${this.escapeHtml(record.recordName)}</td><td><span class="check-in-targeting" title="${this.escapeHtml(this.formatCheckInSuccessTargeting(record.targeting))}">${this.escapeHtml(this.formatCheckInSuccessTargeting(record.targeting))}</span></td><td>${this.escapeHtml(this.formatCheckInDate(record.onlineStart))}</td><td>${this.escapeHtml(this.formatCheckInDate(record.onlineEnd))}</td><td><span class="status-badge${record.status === '已下线' ? ' is-inactive' : ''}">${this.escapeHtml(record.status)}</span></td><td>${record.conflictPriority ? '是' : '否'}</td><td>${this.escapeHtml(record.creator)}</td><td>${this.escapeHtml(record.createdAt)}</td><td>${this.escapeHtml(record.editor)}</td><td>${this.escapeHtml(record.updatedAt)}</td><td><div class="check-in-table-actions"><button class="text-button" type="button" data-check-in-success-edit="${this.escapeHtml(record.id)}">编辑</button><button class="text-button" type="button" data-check-in-success-copy="${this.escapeHtml(record.id)}">复制</button></div></td></tr>`).join('');
      empty.hidden = visible.length > 0;
      renderPagination();
    };
    const closeModal = () => { modal.hidden = true; modal.innerHTML = ''; };
    const readModalRecord = (base) => {
      const targeting = window.ConfigurationSections.normalizeTargeting(base.targeting);
      targeting.identities = [...modal.querySelectorAll('[data-check-in-success-identity]:checked')].map((input) => input.value);
      targeting.audiences = [...modal.querySelectorAll('[data-check-in-success-audience]:checked')].map((input) => input.value);
      ['targetGroup', 'excludeGroup', 'experimentId', 'excludeExperiment', 'onlineStart', 'onlineEnd'].forEach((field) => {
        targeting[field] = modal.querySelector(`[data-check-in-success-targeting-field="${field}"]`)?.value.trim() || '';
      });
      targeting.audienceInversion = modal.querySelector('[name="check-in-success-audience-inversion"]:checked')?.value || '否';
      targeting.status = modal.querySelector('[name="check-in-success-status"]:checked')?.value || '上线';
      ['ios', 'android', 'harmony'].forEach((platform) => {
        targeting.platformVersions[platform].enabled = modal.querySelector(`[data-check-in-success-platform="${platform}"]`)?.checked ?? false;
        targeting.platformVersions[platform].start = modal.querySelector(`[data-check-in-success-version="${platform}:start"]`)?.value.trim() || '';
        targeting.platformVersions[platform].end = modal.querySelector(`[data-check-in-success-version="${platform}:end"]`)?.value.trim() || '';
      });
      const readRoute = (key) => this.createBenefitsCheckInSuccessRoute({
        routeType: modal.querySelector(`[data-check-in-success-route-field="${key}:routeType"]`)?.value || '',
        routeProtocol: modal.querySelector(`[data-check-in-success-route-field="${key}:routeProtocol"]`)?.value.trim() || '',
        pid: modal.querySelector(`[data-check-in-success-route-field="${key}:pid"]`)?.value.trim() || '',
        selectedPid: modal.querySelector(`[data-check-in-success-route-field="${key}:selectedPid"]`)?.value || '',
        skipType: modal.querySelector(`[data-check-in-success-route-field="${key}:skipType"]`)?.value.trim() || '',
        mallId: modal.querySelector(`[data-check-in-success-route-field="${key}:mallId"]`)?.value.trim() || '',
        materialName: modal.querySelector(`[data-check-in-success-route-field="${key}:materialName"]`)?.value.trim() || '',
        popupLogo: modal.dataset[`checkInSuccess${key[0].toUpperCase()}${key.slice(1)}PopupLogo`] || '',
        popupCopy: modal.querySelector(`[data-check-in-success-route-field="${key}:popupCopy"]`)?.value.trim() || '',
        requiresLogin: modal.querySelector(`[data-check-in-success-route-field="${key}:requiresLogin"]`)?.checked ?? false
      });
      const testPlan = window.ConfigurationSections.normalizeTestPlan(base.testPlan);
      ['uids', 'start', 'end'].forEach((field) => { testPlan[field] = modal.querySelector(`[data-check-in-success-test="${field}"]`)?.value.trim() || ''; });
      testPlan.enabled = modal.querySelector('[data-check-in-success-test="enabled"]')?.checked ?? false;
      const config = this.createBenefitsCheckInSuccessFunctionConfig({
        mainCopy: modal.querySelector('#check-in-success-main-copy').value.trim(),
        subCopy: modal.querySelector('#check-in-success-sub-copy').value.trim(),
        buttonRoute: readRoute('button'),
        resourceImage: modal.dataset.checkInSuccessResourceImage || '',
        resourceRoute: readRoute('resource')
      });
      return this.normalizeBenefitsCheckInSuccessRecord({
        ...base,
        recordName: modal.querySelector('#check-in-success-record-name').value.trim(),
        targeting,
        testPlan,
        onlineStart: targeting.onlineStart,
        onlineEnd: targeting.onlineEnd,
        status: targeting.status === '下线' ? '已下线' : '上线中',
        functionConfig: config
      });
    };
    const openModal = (record = null) => {
      const isNew = !record;
      const now = this.currentCheckInTime();
      const draft = this.normalizeBenefitsCheckInSuccessRecord(record || { id: String(Math.max(0, ...records.map((item) => Number(item.id) || 0)) + 1), creator: '当前运营', editor: '当前运营', createdAt: now, updatedAt: now });
      modal.innerHTML = this.renderBenefitsCheckInSuccessModal(draft, isNew);
      modal.dataset.checkInSuccessResourceImage = draft.functionConfig.resourceImage;
      modal.dataset.checkInSuccessButtonPopupLogo = draft.functionConfig.buttonRoute.popupLogo;
      modal.dataset.checkInSuccessResourcePopupLogo = draft.functionConfig.resourceRoute.popupLogo;
      modal.hidden = false;
      modal.querySelector('#check-in-success-main-copy').addEventListener('input', (event) => {
        modal.querySelector('[data-check-in-success-preview-main]').textContent = event.target.value.trim() || '去下单';
      });
      modal.querySelectorAll('[data-check-in-success-image]').forEach((input) => input.addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
          const image = await this.readImageFile(file);
          const key = event.target.dataset.checkInSuccessImage;
          const datasetKey = key === 'resource-image' ? 'checkInSuccessResourceImage' : `checkInSuccess${key.replace(/-([a-z])/g, (_, char) => char.toUpperCase()).replace(/^./, (char) => char.toUpperCase())}`;
          modal.dataset[datasetKey] = image;
          modal.querySelector(`[data-check-in-success-image-preview="${key}"]`).innerHTML = `<img src="${image}" alt="已上传图片" />`;
          modal.querySelector(`[data-check-in-success-image-delete="${key}"]`).disabled = false;
        } catch (error) { window.BackofficeLayout.showToast('图片读取失败', '请重新选择图片'); }
      }));
      modal.onclick = (event) => {
        if (event.target === modal || event.target.closest('#close-check-in-success-modal, #cancel-check-in-success-modal')) { closeModal(); return; }
        const deleteImage = event.target.closest('[data-check-in-success-image-delete]');
        if (deleteImage) {
          const key = deleteImage.dataset.checkInSuccessImageDelete;
          const datasetKey = key === 'resource-image' ? 'checkInSuccessResourceImage' : `checkInSuccess${key.replace(/-([a-z])/g, (_, char) => char.toUpperCase()).replace(/^./, (char) => char.toUpperCase())}`;
          modal.dataset[datasetKey] = '';
          modal.querySelector(`[data-check-in-success-image-preview="${key}"]`).innerHTML = '<b>图片</b>';
          deleteImage.disabled = true;
          return;
        }
        if (!event.target.closest('#save-check-in-success-modal')) return;
        const next = readModalRecord(draft);
        if (!next.recordName || !next.onlineStart || !next.onlineEnd || !next.functionConfig.mainCopy || !next.functionConfig.resourceImage) {
          window.BackofficeLayout.showToast('请完善必填项', '请填写记录名称、上线时间、按钮主文案并上传资源位图片');
          return;
        }
        if (next.onlineStart > next.onlineEnd) { window.BackofficeLayout.showToast('上线时间有误', '上线结束时间不能早于开始时间'); return; }
        next.updatedAt = this.currentCheckInTime();
        if (isNew) records.unshift(next);
        else Object.assign(records.find((item) => item.id === next.id), next);
        try { this.saveBenefitsCheckInSuccessState({ records }); } catch (error) { window.BackofficeLayout.showToast('保存失败', '本地演示数据无法保存，请稍后重试'); return; }
        closeModal(); page = 1; renderTable();
        window.BackofficeLayout.showToast(isNew ? '新增成功' : '保存成功', '打卡成功弹窗配置已更新');
      };
    };
    document.getElementById('search-check-in-success').addEventListener('click', () => { page = 1; renderTable(); });
    document.getElementById('check-in-success-name-filter').addEventListener('keydown', (event) => { if (event.key === 'Enter') { page = 1; renderTable(); } });
    document.getElementById('add-check-in-success').addEventListener('click', () => openModal());
    document.querySelectorAll('[data-check-in-success-sort]').forEach((button) => button.addEventListener('click', () => { const key = button.dataset.checkInSuccessSort; sort = { key, direction: sort.key === key ? -sort.direction : 1 }; renderTable(); }));
    tableBody.addEventListener('click', (event) => {
      const edit = event.target.closest('[data-check-in-success-edit]');
      if (edit) { openModal(records.find((record) => record.id === edit.dataset.checkInSuccessEdit)); return; }
      const copy = event.target.closest('[data-check-in-success-copy]');
      if (!copy) return;
      const source = records.find((record) => record.id === copy.dataset.checkInSuccessCopy);
      if (!source) return;
      const now = this.currentCheckInTime();
      const cloned = JSON.parse(JSON.stringify(source));
      cloned.id = String(Math.max(0, ...records.map((record) => Number(record.id) || 0)) + 1);
      cloned.recordName = `copy${source.recordName}`;
      cloned.creator = '当前运营'; cloned.editor = '当前运营'; cloned.createdAt = now; cloned.updatedAt = now;
      records.unshift(cloned);
      try { this.saveBenefitsCheckInSuccessState({ records }); } catch (error) { window.BackofficeLayout.showToast('复制失败', '本地演示数据无法保存，请稍后重试'); return; }
      page = 1; renderTable(); window.BackofficeLayout.showToast('已复制配置', '已创建一条新的打卡成功弹窗配置');
    });
    pagination.addEventListener('change', (event) => { if (event.target.id === 'check-in-success-page-size') { pageSize = Number(event.target.value); page = 1; renderTable(); } });
    pagination.addEventListener('click', (event) => { const action = event.target.closest('[data-check-in-success-page]')?.dataset.checkInSuccessPage; if (action === 'prev') page -= 1; if (action === 'next') page += 1; if (action === '1') page = 1; if (action) renderTable(); });
    pagination.addEventListener('keydown', (event) => { if (event.target.id === 'check-in-success-page-input' && event.key === 'Enter') { page = Math.max(1, Number(event.target.value) || 1); renderTable(); } });
    renderTable();
  },
  readImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result));
      reader.addEventListener('error', () => reject(reader.error));
      reader.readAsDataURL(file);
    });
  },
  clearObjectUrl(value) {
    if (typeof value === 'string' && value.startsWith('blob:')) URL.revokeObjectURL(value);
  },
  render({ homeView = 'function' } = {}) {
    const isFeedView = homeView === 'feed';
    const heading = isFeedView
      ? { title: '首页-信息流营销', note: '维护首页信息流 Tab、资源位状态及展示配置' }
      : { title: '首页-功能区营销', note: '维护首页功能区对应的营销展示配置' };
    const feedBuilder = window.FeedManagementPage?.renderEmbedded?.();
    const body = isFeedView && feedBuilder
      ? feedBuilder
      : isFeedView
        ? '<div class="style-config-empty">信息流编辑框架加载失败，请刷新页面后重试。</div>'
        : this.renderHomeBuilder();
    const initialActions = '';
    return `<section class="content marketing-config-page"><section class="marketing-navigation panel"><nav class="marketing-tabs" aria-label="底部Tab"><strong class="marketing-tabs-title">底部Tab</strong><div class="marketing-tabs-list" role="tablist"><button class="marketing-tab is-active" type="button" role="tab" aria-selected="true" data-marketing-tab="home">首页 <small>Home</small></button><button class="marketing-tab" type="button" role="tab" aria-selected="false" data-marketing-tab="benefits">福利页 <small>第2Tab</small></button><button class="marketing-tab" type="button" role="tab" aria-selected="false" data-marketing-tab="youzi-street">柚子街 <small>第3Tab</small></button><button class="marketing-tab" type="button" role="tab" aria-selected="false" data-marketing-tab="mine">我 <small>Mine</small></button></div></nav><nav class="marketing-home-subnav" aria-label="页面子导航">${this.renderPrimarySubnav('home', homeView)}</nav><aside class="benefits-feed-reference-note" id="benefits-feed-reference-note" role="note" hidden><ol><li>配置与逛逛首页一致。</li><li>暂不支持 Tab 配置。</li><li>资源位类型调整为“组件”定义。</li></ol></aside></section><section class="marketing-editor-workspace panel"><div class="marketing-workspace-heading"><div><h1>${heading.title}</h1><span class="heading-note">${heading.note}</span></div><div class="marketing-workspace-tools"><div class="marketing-page-actions" id="marketing-page-actions">${initialActions}</div><section class="marketing-recent-edits" id="marketing-recent-edits" aria-label="最近编辑"></section></div></div><div class="marketing-config-body" id="marketing-config-body">${body}</div></section></section>`;
  },
  renderPrimarySubnav(tab, homeView = 'function') {
    const items = {
      home: [
        { id: 'function', label: '功能区营销', target: 'home-function' },
        { id: 'feed', label: '信息流营销', target: 'home-feed' }
      ],
      benefits: [
        { id: 'feed', label: '福利页-信息流', target: 'benefits-feed' },
        { id: 'check-in-success', label: '打卡成功弹窗营销配置', target: 'benefits-check-in-success' }
      ],
      'youzi-street': [
        { id: 'feed', label: '柚子街-信息流', target: 'youzi-street-feed' },
        { id: 'flash-sale', label: '柚子街-限时抢购 （待补充）', target: 'youzi-street-flash-sale' }
      ],
      mine: [{ id: 'feed', label: '我-信息流', target: 'mine-feed' }]
    };
    const activeView = items[tab].some((item) => item.id === homeView) ? homeView : items[tab][0].id;
    return `<div role="tablist">${items[tab].map((item) => `<button class="marketing-home-subtab${item.id === activeView ? ' is-active' : ''}" type="button" role="tab" aria-selected="${item.id === activeView}" data-marketing-primary-view="${item.target}">${item.label}</button>`).join('')}</div>`;
  },
  renderHomeBuilder() {
    return `<section class="home-marketing-builder" id="home-marketing-builder">
      <aside class="home-marketing-tools"><h2>组件</h2><p>点击组件进行配置或添加至首页预览区域</p><div class="home-tool-list">
        <button class="home-tool" type="button" draggable="true" data-home-add="fixed-entries" data-tooltip="拖入或配置首页功能金刚区"><b>▦</b><span>功能金刚区</span></button>
        <button class="home-tool" type="button" draggable="true" data-home-add="search" data-tooltip="支持在功能区排序"><b>⌕</b><span>功能区-橱窗</span></button>
        <button class="home-tool" type="button" draggable="true" data-home-add="shortcut" data-tooltip="支持在功能区排序"><b>▦</b><span>功能区-红包发放功能</span></button>
      </div></aside>
      <section class="home-marketing-preview"><div class="style-panel-heading"><h2>页面预览</h2><span>所见即所得</span></div><div class="home-phone-stage"><div class="home-component-editor" id="home-component-editor" aria-label="组件编辑入口"></div><p class="home-preview-source-note" role="note">信息流内容来自首页-信息流营销配置，仅供预览</p><div class="home-phone-frame"><section class="home-fixed-header" aria-label="功能金刚组件区"><img class="home-preview-fixed-header-image" src="assets/marketing-config/home-preview-fixed-header.png" alt="美柚省钱首页固定头部" /><div class="home-fixed-entries" id="home-fixed-entries" aria-label="功能金刚组件区"></div></section><section class="home-static-preview-module home-notification-module" aria-label="通知功能预览"><img class="home-preview-notification-image" src="assets/marketing-config/home-preview-notification.png" alt="红包到期通知" /></section><div class="home-function-slot" id="home-function-slot-after-notification"></div><section class="home-static-preview-module home-search-paste-module" aria-label="搜索粘贴功能预览"><img class="home-preview-search-paste-image" src="assets/marketing-config/home-preview-search-paste.png" alt="复制商品链接快速查返现" /></section><div class="home-function-slot" id="home-function-slot-after-search-paste"></div><div class="home-phone-canvas" id="home-phone-canvas"></div></div></div></section>
      <aside class="home-marketing-settings"><div class="style-panel-heading"><h2>配置</h2><span id="home-config-type">未选择组件</span></div><div class="home-config-content" id="home-config-content"><div class="style-config-empty">从左侧添加组件，或点击预览中的组件进行配置</div></div><div class="home-config-actions"><div class="home-config-action-copy" id="home-config-action-copy" hidden>保存展位配置后，点击组件进行组件的整体保存。</div><button class="button secondary home-remove-component-action" id="remove-home-component-action" type="button" hidden>移除组件</button><button class="button primary is-edit-action" id="save-home-component" type="button">编辑</button></div></aside>
    </section>`;
  },
  renderHomeConfigurationList({ components, fixedEntriesComponents }) {
    const joinConditions = (items, fallback = '-') => items.filter(Boolean).join(' 且 ') || fallback;
    const formatDateTime = (value) => value ? value.replace('T', ' ') : '';
    const formatTargeting = (value = {}) => {
      const targeting = window.ConfigurationSections.normalizeTargeting(value);
      const platformLabels = { ios: 'iOS', android: 'Android', harmony: 'Harmony' };
      const platforms = Object.entries(targeting.platformVersions)
        .filter(([, version]) => version.enabled)
        .map(([key, version]) => {
          const range = [version.start, version.end].filter(Boolean).join(' 至 ');
          return `${platformLabels[key]}${range ? ` ${range}` : ''}`;
        });
      return joinConditions([
        targeting.identities.length ? `用户身份：${targeting.identities.join('、')}` : '',
        targeting.targetGroup ? `指定人群包：${targeting.targetGroup}` : '',
        targeting.excludeGroup ? `排除人群包：${targeting.excludeGroup}` : '',
        targeting.audiences.length ? `${targeting.audienceInversion === '是' ? '定制人群取反：' : '定制人群：'}${targeting.audiences.join('、')}` : '',
        targeting.experimentId ? `指定实验：${targeting.experimentId}` : '',
        targeting.excludeExperiment ? `排除实验：${targeting.excludeExperiment}` : '',
        platforms.length ? `平台版本：${platforms.join('、')}` : '',
        targeting.onlineStart ? `上线开始：${formatDateTime(targeting.onlineStart)}` : '',
        targeting.onlineEnd ? `上线结束：${formatDateTime(targeting.onlineEnd)}` : '',
        targeting.status ? `状态：${targeting.status}` : ''
      ], '全部用户');
    };
    const formatTestPlan = (value = {}) => {
      const testPlan = window.ConfigurationSections.normalizeTestPlan(value);
      if (!testPlan.enabled) return '未启用';
      return joinConditions([
        '测试状态：生效',
        testPlan.uids ? `测试 UID：${testPlan.uids}` : '',
        testPlan.start ? `开始：${formatDateTime(testPlan.start)}` : '',
        testPlan.end ? `结束：${formatDateTime(testPlan.end)}` : ''
      ], '测试状态：生效');
    };
    const formatGoldComponent = (component) => {
      const entries = Array.isArray(component.entries) ? component.entries : [];
      const materialConfig = entries.map((entry) => `${entry.title || '未命名入口'}：${entry.image ? '已上传入口素材' : '未上传入口素材'}${entry.darkImage ? '、已上传暗黑素材' : ''}`).join('、');
      const jumpConfig = entries.map((entry) => {
        const type = entry.jumpType === 'link' ? '自定义地址/协议' : '页面跳转';
        const target = entry.jumpType === 'link' ? entry.linkTarget : entry.pageTarget;
        return `${entry.title || '未命名入口'}：${type}${target ? ` / ${target}` : ''}${entry.jumpDescription ? ` / ${entry.jumpDescription}` : ''}`;
      }).join('、');
      return {
        componentConfig: `入口数量：${entries.length}`,
        materialConfig: materialConfig || '-',
        jumpConfig: jumpConfig || '-',
        enabled: window.ConfigurationSections.normalizeTargeting(component.targeting).status
      };
    };
    const formatShowcase = (showcase = {}) => {
      const windowType = showcase.windowType === 'newcomer' ? '新人滑块商品' : '拼图';
      const config = showcase[showcase.windowType] || {};
      const routeType = config.routeType === 'protocol' ? '自定义地址/协议' : config.routeType === 'page' ? '页面跳转' : '未配置';
      return {
        componentConfig: `功能类型：橱窗功能；橱窗类型：${windowType}`,
        materialConfig: joinConditions([
          `橱窗图片：${config.image ? '已上传' : '未上传'}`,
          `暗黑素材：${config.darkImage ? '已上传' : '未上传'}`,
          `出站弹窗 Logo：${config.popupLogo ? '已上传' : '未上传'}`,
          config.popupCopy ? `出站弹窗文案：${config.popupCopy}` : ''
        ]),
        jumpConfig: joinConditions([
          `跳转类型：${routeType}`,
          config.routeProtocol ? `路由协议：${config.routeProtocol}` : '',
          config.pid ? `PID：${config.pid}` : '',
          config.selectedPid ? `选中 PID：${config.selectedPid}` : '',
          config.skipType ? `skip_type：${config.skipType}` : '',
          config.mallId ? `商城 ID：${config.mallId}` : '',
          typeof config.requiresLogin === 'boolean' ? `用户需登录：${config.requiresLogin ? '是' : '否'}` : ''
        ]),
        enabled: window.ConfigurationSections.normalizeTargeting(showcase.targeting).status
      };
    };
    const formatRedPacket = (redPacket = {}) => ({
      componentConfig: joinConditions([
        `发放类型：${redPacket.deliveryType === 'package' ? '券包发放' : '单个发放'}`,
        `标题区：${redPacket.titleArea ? '已配置' : '未配置'}`,
        redPacket.title ? `标题：${redPacket.title}` : '',
        redPacket.subtitle ? `副标题：${redPacket.subtitle}` : '',
        redPacket.template ? `红包模板：${redPacket.template === 'without-button' ? '无去使用按钮' : '有去使用按钮'}` : ''
      ]),
      materialConfig: joinConditions([
        `标题素材：${redPacket.titleImage ? '已上传' : '未上传'}`,
        `标题暗黑素材：${redPacket.titleDarkImage ? '已上传' : '未上传'}`,
        `未领取素材：${redPacket.unclaimedImage ? '已上传' : '未上传'}`,
        `未领取暗黑素材：${redPacket.unclaimedDarkImage ? '已上传' : '未上传'}`
      ]),
      jumpConfig: '关联返现红包：关联区',
      enabled: window.ConfigurationSections.normalizeTargeting(redPacket.targeting).status
    });
    const records = [
      ...fixedEntriesComponents.map((component, index) => {
        const detail = formatGoldComponent(component);
        return {
        id: component.id,
        kind: 'gold',
        type: '功能金刚区',
        name: `功能金刚区 ${index + 1}`,
        ...detail,
        targeting: formatTargeting(component.targeting),
        testPlan: formatTestPlan(component.testPlan)
        };
      }),
      ...components.filter((component) => component.type === 'search').map((component) => {
        const detail = formatShowcase(component.showcase);
        return {
        id: component.id,
        kind: 'component',
        type: '功能区-橱窗',
        name: component.showcase?.name || '未填写记录名称',
        ...detail,
        targeting: formatTargeting(component.showcase?.targeting),
        testPlan: formatTestPlan(component.showcase?.testPlan)
        };
      }),
      ...components.filter((component) => component.type === 'shortcut').map((component) => {
        const detail = formatRedPacket(component.redPacket);
        return {
        id: component.id,
        kind: 'component',
        type: '功能区-红包发放功能',
        name: component.redPacket?.name || '未填写记录名称',
        ...detail,
        targeting: formatTargeting(component.redPacket?.targeting),
        testPlan: formatTestPlan(component.redPacket?.testPlan)
        };
      })
    ];
    const cell = (value) => `<td title="${this.escapeHtml(value)}">${this.escapeHtml(value)}</td>`;
    const editCell = (record) => `<td class="home-configuration-list-action"><button class="text-button" type="button" data-edit-home-configuration="${this.escapeHtml(record.id)}" data-edit-home-configuration-kind="${record.kind}">编辑</button></td>`;
    const body = records.length
      ? `<div class="home-configuration-list-wrap"><table class="home-configuration-list"><thead><tr><th>组件类型</th><th>记录名称</th><th>组件配置</th><th>素材配置</th><th>跳转配置</th><th>启用状态</th><th>定向信息</th><th>测试计划</th><th>操作</th></tr></thead><tbody>${records.map((record) => `<tr>${cell(record.type)}${cell(record.name)}${cell(record.componentConfig)}${cell(record.materialConfig)}${cell(record.jumpConfig)}${cell(record.enabled)}${cell(record.targeting)}${cell(record.testPlan)}${editCell(record)}</tr>`).join('')}</tbody></table></div>`
      : '<div class="home-configuration-list-empty">暂未添加组件配置</div>';
    return `<div class="modal-card home-configuration-list-card" role="dialog" aria-modal="true" aria-labelledby="home-configuration-list-title"><div class="modal-header"><h2 id="home-configuration-list-title">配置列表</h2><button class="icon-close" type="button" data-close-home-configuration-list aria-label="关闭">×</button></div><div class="modal-body home-configuration-list-body"><p>仅可查看到已保存的信息。</p>${body}</div><div class="modal-footer"><button class="button primary" type="button" data-close-home-configuration-list>关闭</button></div></div>`;
  },
  renderPrimaryTabPlaceholder(tab, view = 'feed') {
    const pages = {
      benefits: view === 'check-in-success'
          ? { title: '打卡成功弹窗营销配置', note: '福利页打卡成功弹窗的营销配置将在此处维护' }
          : { title: '福利页', note: '第 2 Tab 的营销配置将在此处维护' },
      'youzi-street': view === 'flash-sale'
        ? { title: '柚子街-限时抢购', note: '【平移柚子街限时抢购功能】柚子街限时抢购配置将在此处维护。' }
        : { title: '柚子街（第3Tab）', note: '配置与「返现」的逛逛保持一致' },
      mine: { title: '我', note: 'Mine 页的营销配置将在此处维护，仅支持拼图配置' }
    };
    const page = pages[tab];
    return `<div class="marketing-primary-tab-placeholder${tab === 'youzi-street' ? ' marketing-primary-tab-placeholder--youzi-street' : ''}${tab === 'mine' ? ' marketing-primary-tab-placeholder--mine' : ''}"><b>${page.title}</b><span>${page.note}</span></div>`;
  },
  renderBenefitsFeedBuilder() {
    return `<section class="home-marketing-builder benefits-feed-builder" id="benefits-feed-builder">
      <aside class="home-marketing-tools benefits-feed-tools"><h2>组件</h2><p>选择组件添加至福利页信息流预览区域</p><div class="home-tool-list">
        <button class="home-tool" type="button" draggable="true" data-benefits-feed-add="mosaic"><b>◫</b><span>信息流-拼图</span><small>活动素材组合展示</small></button>
        <button class="home-tool" type="button" draggable="true" data-benefits-feed-add="grid"><b>▦</b><span>信息流-宫格</span><small>分类入口组合展示</small></button>
        <button class="home-tool" type="button" draggable="true" data-benefits-feed-add="red-packet"><b>￥</b><span>信息流-红包发放功能</span><small>红包权益发放展示</small></button>
      </div></aside>
      <section class="home-marketing-preview benefits-feed-preview"><div class="style-panel-heading"><h2>页面预览</h2><span>福利页信息流</span></div><div class="home-phone-stage"><div class="home-phone-frame benefits-feed-phone-frame"><div class="benefits-feed-phone-header"><b>福利中心</b><span>精选好礼</span></div><div class="benefits-feed-phone-content" id="benefits-feed-preview-content"></div></div></div></section>
      <aside class="home-marketing-settings benefits-feed-settings"><div class="style-panel-heading"><h2>配置</h2><span id="benefits-feed-config-type">未选择组件</span></div><div class="home-config-content" id="benefits-feed-config-content"></div><div class="home-config-actions"><button class="button secondary home-remove-component-action" id="remove-benefits-feed-component" type="button" hidden>移除组件</button><button class="button primary is-edit-action" id="save-benefits-feed-component" type="button">编辑</button></div></aside>
    </section>`;
  },
  renderPrimaryComponentBuilder(config) {
    const palette = {
      mosaic: '<button class="home-tool" type="button" draggable="true" data-benefits-feed-add="mosaic"><b>◫</b><span>信息流-拼图</span><small>活动素材组合展示</small></button>',
      grid: '<button class="home-tool" type="button" draggable="true" data-benefits-feed-add="grid"><b>▦</b><span>信息流-宫格</span><small>分类入口组合展示</small></button>',
      'red-packet': '<button class="home-tool" type="button" draggable="true" data-benefits-feed-add="red-packet"><b>￥</b><span>信息流-红包发放功能</span><small>红包权益发放展示</small></button>'
    };
    return this.renderBenefitsFeedBuilder()
      .replace('选择组件添加至福利页信息流预览区域', `选择组件添加至${config.previewTitle}${config.previewTag}预览区域`)
      .replace(/<div class="home-tool-list">[\s\S]*?<\/div><\/aside>/, `<div class="home-tool-list">${config.palette.map((type) => palette[type]).join('')}</div></aside>`)
      .replace('福利页信息流', `${config.previewTitle}${config.previewTag}`)
      .replace('福利中心', config.previewTitle)
      .replace('精选好礼', config.previewTag);
  },
  renderBenefitsFeedPreview(components, activeId) {
    const container = document.getElementById('benefits-feed-preview-content');
    if (!container) return;
    if (!components.length) {
      container.innerHTML = '<div class="benefits-feed-empty"><b>+</b><span>从左侧添加信息流组件</span></div>';
      return;
    }
    const preview = (component) => {
      const active = component.id === activeId ? ' is-active' : '';
      const unsaved = component.isSaved ? '' : ' is-unsaved';
      const image = component.image ? `<img src="${component.image}" alt="${component.label}素材" />` : '';
      const name = this.escapeHtml(component.recordName || component.label);
      const slot = (item, content, className = '') => `<span class="benefits-feed-slot ${className}" draggable="true" data-benefits-feed-slot="${item.id}">${content}</span>`;
      const slots = this.getBenefitsFeedSlots(component);
      if (component.type === 'mosaic') {
        const mosaic = this.createBenefitsFeedMosaicConfig({ ...component, ...component.mosaic });
        component.mosaic = mosaic;
        const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0];
        const positionImage = position.image ? `<img src="${position.image}" alt="${component.label}素材" />` : '';
        const pieces = mosaic.positions.map((item, index) => `<span class="benefits-feed-slot${item.id === position.id ? ' is-selected' : ''}" data-benefits-feed-mosaic-preview-position="${this.escapeHtml(item.id)}">${item.image ? `<img src="${item.image}" alt="拼图位置${index + 1}" />` : `<b>${index + 1}</b>`}</span>`).join('');
        return `<button class="benefits-feed-card benefits-feed-mosaic${active}${unsaved}" type="button" draggable="true" data-benefits-feed-component="${component.id}">${positionImage || `<span class="benefits-feed-mosaic-main"><b>${name}</b><small>活动素材坑位</small></span>`}<span class="benefits-feed-mosaic-side benefits-feed-mosaic-position-preview">${pieces}</span></button>`;
      }
      if (component.type === 'grid') {
        const grid = this.createBenefitsFeedGridConfig({ ...component, ...component.grid });
        component.grid = grid;
        const positions = grid.positions.map((item, index) => `<span class="benefits-feed-slot${item.id === grid.selectedPositionId ? ' is-selected' : ''}" data-benefits-feed-grid-preview-position="${this.escapeHtml(item.id)}">${item.image ? `<img src="${item.image}" alt="宫格展位${index + 1}" />` : `<b>${this.escapeHtml(item.title || `展位 ${index + 1}`)}</b>`}${item.cornerCopy ? `<i>${this.escapeHtml(item.cornerCopy)}</i>` : ''}</span>`).join('');
        return `<button class="benefits-feed-card benefits-feed-grid${active}${unsaved}" type="button" draggable="true" data-benefits-feed-component="${component.id}">${image || `<b>${name}</b><span>${positions}</span>`}</button>`;
      }
      const redPacket = this.createBenefitsFeedRedPacketConfig(component.redPacket);
      component.redPacket = redPacket;
      const redPacketName = this.escapeHtml(redPacket.name || component.label);
      const previewImage = redPacket.deliveryType === 'package' && redPacket.unclaimedImage ? `<img src="${redPacket.unclaimedImage}" alt="${component.label}素材" />` : image;
      return `<button class="benefits-feed-card benefits-feed-red-packet${active}${unsaved}" type="button" draggable="true" data-benefits-feed-component="${component.id}">${previewImage || `<span>${slots.map((item) => item.id === 'content' ? slot(item, `<small>福利红包</small><b>${redPacketName}</b>`, 'benefits-feed-red-packet-content') : slot(item, item.label, 'benefits-feed-red-packet-action')).join('')}</span>`}</button>`;
    };
    container.innerHTML = components.map(preview).join('');
  },
  renderBenefitsFeedConfig(component) {
    const container = document.getElementById('benefits-feed-config-content');
    const type = document.getElementById('benefits-feed-config-type');
    if (!container || !type) return;
    if (!component) {
      type.textContent = '未选择组件';
      container.innerHTML = '<div class="style-config-empty">从左侧添加组件，或点击预览中的组件进行配置</div>';
      return;
    }
    type.textContent = component.label;
    const field = (label, control, className = '') => `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    if (component.type === 'mosaic') {
      const mosaic = this.createBenefitsFeedMosaicConfig({ ...component, ...component.mosaic });
      component.mosaic = mosaic;
      const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0];
      const asset = (label, name, value) => `<span class="home-showcase-asset"><span class="home-showcase-asset-preview">${value ? `<img src="${value}" alt="已上传${label}" />` : '<b>图片</b>'}</span><span class="home-showcase-asset-actions"><label class="button secondary home-entry-upload">${label}<input type="file" accept="image/*" data-benefits-feed-mosaic-image="${name}" /></label><button class="home-entry-delete" type="button" data-benefits-feed-mosaic-delete="${name}"${value ? '' : ' disabled'}>删除图片</button></span></span>`;
      const help = (text) => `<button class="help-tooltip home-showcase-help" type="button" aria-label="字段说明" data-tooltip="${text}">?</button>`;
      const pieces = mosaic.positions.map((item) => `<button class="feed-mosaic-piece${item.id === position.id ? ' is-selected' : ''}" type="button" data-benefits-feed-mosaic-position="${this.escapeHtml(item.id)}">${item.image ? `<img src="${item.image}" alt="拼图位置图片" />` : '<span>选择</span>'}${item.id === position.id ? '<b>★</b>' : ''}</button>`).join('');
      const workspace = `<div class="home-showcase-workspace"><div class="feed-mosaic-canvas" aria-label="拼图配置"><div class="feed-mosaic-piece-list">${pieces}</div><span class="feed-mosaic-position-actions"><button class="feed-mosaic-position-add" type="button" data-benefits-feed-mosaic-position-add aria-label="添加位置">+</button><button class="feed-mosaic-position-remove" type="button" data-benefits-feed-mosaic-position-remove aria-label="删除选中位置"${mosaic.positions.length === 1 ? ' disabled' : ''}>×</button></span></div><span class="home-showcase-route-example">路由协议填写示例</span><div class="home-showcase-assets">${asset('上传图片', 'image', position.image)}${asset('暗黑模式', 'darkImage', position.darkImage)}</div><div class="home-showcase-route-row"><select class="control" data-benefits-feed-mosaic-field="routeType"><option value="">请选择跳转类型</option><option value="page"${position.routeType === 'page' ? ' selected' : ''}>页面跳转</option><option value="protocol"${position.routeType === 'protocol' ? ' selected' : ''}>自定义地址/协议</option></select><input class="control" data-benefits-feed-mosaic-field="routeProtocol" value="${this.escapeHtml(position.routeProtocol)}" placeholder="请输入路由协议" /></div><div class="home-showcase-input-help"><input class="control" data-benefits-feed-mosaic-field="pid" value="${this.escapeHtml(position.pid)}" placeholder="pid（除京东&拼多多&抖音&1688，其余商城用于埋点上报）" />${help('用于商城埋点上报的 PID 配置。')}</div><div class="home-showcase-input-help"><select class="control" data-benefits-feed-mosaic-field="selectedPid"><option value="">请选择 pid</option><option value="default"${position.selectedPid === 'default' ? ' selected' : ''}>默认 pid</option><option value="custom"${position.selectedPid === 'custom' ? ' selected' : ''}>自定义 pid</option></select>${help('选择当前拼图展示使用的 PID。')}</div><div class="home-showcase-input-help"><input class="control" data-benefits-feed-mosaic-field="skipType" value="${this.escapeHtml(position.skipType)}" placeholder="skip_type（用于埋点上报）" />${help('用于记录跳转类型的埋点字段。')}</div><input class="control" data-benefits-feed-mosaic-field="mallId" value="${this.escapeHtml(position.mallId)}" placeholder="商城 id" /><div class="home-showcase-popup-row">${asset('出站弹窗 logo', 'popupLogo', position.popupLogo)}<input class="control" data-benefits-feed-mosaic-field="popupCopy" value="${this.escapeHtml(position.popupCopy)}" placeholder="出站弹窗文案" /></div><label class="home-showcase-login"><input type="checkbox" data-benefits-feed-mosaic-field="requiresLogin"${position.requiresLogin ? ' checked' : ''} />用户需登录</label></div>`;
      container.innerHTML = `<div class="style-config-form home-component-form benefits-feed-form feed-mosaic-form"><section class="home-entry-info-section shared-config-section"><h3>基本信息</h3>${field('<b class="field-required">*</b>组件类型', '<input class="control benefits-feed-type-control" value="信息流-拼图" disabled />')}${field('<b class="field-required">*</b>记录名称', `<input class="control" data-benefits-feed-field="recordName" value="${this.escapeHtml(component.recordName)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}</section><section class="home-entry-info-section shared-config-section home-showcase-feature-section feed-mosaic-material-section"><h3>素材配置</h3>${field('拼图配置', workspace, 'home-showcase-config-field')}<div class="editor-requirement-overlay" role="note"><div><strong>需求补充说明</strong><p>此部分内容复用「美柚返现」；如有修改，则以最新的逻辑为准。</p></div><button class="button secondary" type="button" data-dismiss-requirement-overlay>我知道了</button></div></section>${window.ConfigurationSections.renderTargeting({ prefix: 'benefits-feed', value: component.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'benefits-feed', value: component.testPlan })}</div>`;
      window.BackofficeLayout.bindGlobalTooltips?.();
      return;
    }
    if (component.type === 'grid') {
      const grid = this.createBenefitsFeedGridConfig({ ...component, ...component.grid });
      component.grid = grid;
      const position = grid.positions.find((item) => item.id === grid.selectedPositionId) || grid.positions[0];
      const asset = (label, name, value) => `<span class="home-showcase-asset"><span class="home-showcase-asset-preview">${value ? `<img src="${value}" alt="已上传${label}" />` : '<b>图片</b>'}</span><span class="home-showcase-asset-actions"><label class="button secondary home-entry-upload">${label}<input type="file" accept="image/*" data-benefits-feed-grid-image="${name}" /></label><button class="home-entry-delete" type="button" data-benefits-feed-grid-delete="${name}"${value ? '' : ' disabled'}>删除图片</button></span></span>`;
      const pieces = grid.positions.map((item, index) => `<button class="feed-grid-piece${item.id === position.id ? ' is-selected' : ''}" type="button" data-benefits-feed-grid-position="${this.escapeHtml(item.id)}">${item.image ? `<img src="${item.image}" alt="宫格展位图片" />` : `<span>${index + 1}</span>`}${item.id === position.id ? '<b>★</b>' : ''}</button>`).join('');
      const workspace = `<div class="home-showcase-workspace"><div class="feed-grid-canvas" aria-label="宫格素材配置"><div class="feed-grid-piece-list">${pieces}</div><span class="feed-mosaic-position-actions"><button class="feed-mosaic-position-add" type="button" data-benefits-feed-grid-position-add aria-label="添加展位">+</button><button class="feed-mosaic-position-remove" type="button" data-benefits-feed-grid-position-remove aria-label="删除选中展位"${grid.positions.length === 1 ? ' disabled' : ''}>×</button></span></div><div class="feed-grid-position-fields"><div class="home-showcase-route-row"><input class="control" data-benefits-feed-grid-field="title" value="${this.escapeHtml(position.title)}" maxlength="4" placeholder="标题（最多 4 字）" /><input class="control" data-benefits-feed-grid-field="cornerCopy" value="${this.escapeHtml(position.cornerCopy)}" maxlength="3" placeholder="角标文案（最多 3 字）" /></div><div class="home-showcase-assets">${asset('上传图片', 'image', position.image)}</div><div class="home-showcase-route-row"><select class="control" data-benefits-feed-grid-field="routeType"><option value="">请选择跳转类型</option><option value="page"${position.routeType === 'page' ? ' selected' : ''}>页面跳转</option><option value="protocol"${position.routeType === 'protocol' ? ' selected' : ''}>自定义地址/协议</option></select><input class="control" data-benefits-feed-grid-field="routeProtocol" value="${this.escapeHtml(position.routeProtocol)}" placeholder="请输入路由协议" /></div><input class="control" data-benefits-feed-grid-field="pid" value="${this.escapeHtml(position.pid)}" placeholder="PID" /><select class="control" data-benefits-feed-grid-field="selectedPid"><option value="">请选择 PID</option><option value="default"${position.selectedPid === 'default' ? ' selected' : ''}>默认 PID</option><option value="custom"${position.selectedPid === 'custom' ? ' selected' : ''}>自定义 PID</option></select><input class="control" data-benefits-feed-grid-field="skipType" value="${this.escapeHtml(position.skipType)}" placeholder="skip_type" /><input class="control" data-benefits-feed-grid-field="mallId" value="${this.escapeHtml(position.mallId)}" placeholder="商城 ID" /><div class="home-showcase-popup-row">${asset('出站弹窗 logo', 'popupLogo', position.popupLogo)}<input class="control" data-benefits-feed-grid-field="popupCopy" value="${this.escapeHtml(position.popupCopy)}" placeholder="出站弹窗文案" /></div><label class="home-showcase-login"><input type="checkbox" data-benefits-feed-grid-field="requiresLogin"${position.requiresLogin ? ' checked' : ''} />用户需登录</label></div></div>`;
      container.innerHTML = `<div class="style-config-form home-component-form benefits-feed-form feed-grid-form"><section class="home-entry-info-section shared-config-section"><h3>基本信息</h3>${field('<b class="field-required">*</b>组件类型', '<input class="control benefits-feed-type-control" value="信息流-宫格" disabled />')}${field('<b class="field-required">*</b>记录名称', `<input class="control" data-benefits-feed-field="recordName" value="${this.escapeHtml(component.recordName)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}</section><section class="home-entry-info-section shared-config-section home-showcase-feature-section"><h3>素材配置</h3>${field('宫格展位', workspace, 'home-showcase-config-field')}</section>${window.ConfigurationSections.renderTargeting({ prefix: 'benefits-feed', value: component.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'benefits-feed', value: component.testPlan })}</div>`;
      return;
    }
    const redPacket = this.createBenefitsFeedRedPacketConfig(component.redPacket);
    component.redPacket = redPacket;
    const asset = (label, key, image) => `<span class="home-red-packet-title-asset"><span class="home-red-packet-title-asset-preview">${image ? `<img src="${image}" alt="已上传${label}" />` : '<b>图片</b>'}</span><span class="home-red-packet-title-asset-actions"><label class="button secondary home-entry-upload">${label}<input type="file" accept="image/*" data-benefits-feed-red-packet-image="${key}" /></label><button class="home-entry-delete" type="button" data-benefits-feed-red-packet-delete="${key}"${image ? '' : ' disabled'}>删除图片</button></span></span>`;
    const titleArea = redPacket.titleArea ? `<div class="home-red-packet-title-area-fields">${field('标题', `<input class="control" data-benefits-feed-red-packet-field="title" value="${this.escapeHtml(redPacket.title)}" placeholder="请输入标题" />`)}${field('副标题', `<input class="control" data-benefits-feed-red-packet-field="subtitle" value="${this.escapeHtml(redPacket.subtitle)}" placeholder="请输入副标题" />`)}${field('标题图片', `<div class="home-red-packet-title-assets">${asset('上传图片', 'titleImage', redPacket.titleImage)}${asset('暗黑模式', 'titleDarkImage', redPacket.titleDarkImage)}</div><p>若同时填写文字标题，以图片优先展示。</p>`, 'home-red-packet-title-image-field')}</div>` : '';
    const packageInfo = redPacket.deliveryType === 'package' ? `<div class="home-red-packet-package-info"><p class="home-red-packet-package-notice">同一券包配置内，关联红包每人最多可领取一次，无法重复领取</p>${field('<b class="field-required">*</b>未领取图片素材', `<div class="home-red-packet-package-asset-list">${asset('上传图片', 'unclaimedImage', redPacket.unclaimedImage)}${asset('暗黑模式', 'unclaimedDarkImage', redPacket.unclaimedDarkImage)}</div><p class="home-red-packet-package-help">用户未领取时展示整张素材图。未领取态不展示标题区，以图片素材为主视觉。</p>`, 'home-red-packet-package-assets')}</div>` : '';
    const packageTemplate = redPacket.deliveryType === 'package' ? field('<b class="field-required">*</b>红包模板', `<span class="home-red-packet-template-options"><label class="home-red-packet-template-card${redPacket.template === 'with-button' ? ' is-selected' : ''}"><input type="radio" name="benefits-feed-red-packet-template" value="with-button"${redPacket.template === 'with-button' ? ' checked' : ''} /><span class="home-red-packet-template-copy"><b>模板一：有去使用按钮</b><small>已领取/待使用状态下展示“去使用”按钮，点击后按红包自身配置的跳转地址跳转。</small></span><img class="home-red-packet-template-preview" src="assets/marketing-config/red-packet-template-with-button.png" alt="模板一红包样式示意" /></label><label class="home-red-packet-template-card${redPacket.template === 'without-button' ? ' is-selected' : ''}"><input type="radio" name="benefits-feed-red-packet-template" value="without-button"${redPacket.template === 'without-button' ? ' checked' : ''} /><span class="home-red-packet-template-copy"><b>模板二：无去使用按钮</b><small>已领取/待使用状态下不展示按钮。适用于红包跳转地址为返现首页，避免用户点击后仍停留首页。</small></span><img class="home-red-packet-template-preview" src="assets/marketing-config/red-packet-template-without-button.png" alt="模板二红包样式示意" /></label></span><p class="home-red-packet-template-help">若关联红包的跳转地址为返现首页，建议选择“无去使用按钮”，避免用户感知为按钮无效。</p>`, 'home-red-packet-template-field') : '';
    container.innerHTML = `<div class="style-config-form home-component-form benefits-feed-form home-red-packet-form"><section class="home-entry-info-section shared-config-section"><h3>基础信息</h3>${field('<b class="field-required">*</b>组件类型', '<input class="control benefits-feed-type-control" value="信息流-红包发放功能" disabled />')}${field('<b class="field-required">*</b>记录名称', `<input class="control" data-benefits-feed-red-packet-field="name" value="${this.escapeHtml(redPacket.name)}" maxlength="30" placeholder="仅用于后台记录，前台不可见" />`)}</section><section class="home-entry-info-section shared-config-section"><h3>功能信息</h3>${field('<b class="field-required">*</b>发放类型', `<span class="home-entry-status-control"><label><input type="radio" name="benefits-feed-red-packet-delivery" value="single"${redPacket.deliveryType === 'single' ? ' checked' : ''} />单个发放</label><label><input type="radio" name="benefits-feed-red-packet-delivery" value="package"${redPacket.deliveryType === 'package' ? ' checked' : ''} />券包发放</label></span>`)}${packageInfo}${field('是否配置标题区', `<span class="home-entry-status-control"><label><input type="checkbox" data-benefits-feed-red-packet-title-area${redPacket.titleArea ? ' checked' : ''} />配置标题区</label></span>`)}${titleArea}${packageTemplate}<div class="home-red-packet-link"><span>关联返现红包</span><div class="home-red-packet-link-control"><button class="button secondary" type="button" disabled title="本原型不展开红包关联明细">+ 关联红包</button><div class="home-red-packet-link-placeholder">关联区</div></div></div></section>${window.ConfigurationSections.renderTargeting({ prefix: 'benefits-feed-red-packet', value: redPacket.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'benefits-feed-red-packet', value: redPacket.testPlan })}<p>带 * 的字段为必填项。关联红包仅保留入口，不在此处配置选择明细。</p></div>`;
  },
  bindBenefitsFeedBuilder(navigate, options = {}) {
    const primaryConfig = options.primaryConfig || null;
    const state = primaryConfig ? this.loadPrimaryComponentState(primaryConfig) : this.loadBenefitsFeedState();
    let savedState = this.cloneBenefitsFeedState(state);
    const components = state.components;
    let activeId = components[0]?.id || null;
    const editSession = window.EditSession.create({
      snapshot: () => ({ components }),
      clone: (value) => this.cloneBenefitsFeedState(value),
      confirmClose: () => window.BackofficeLayout.confirm({ title: '确认关闭编辑？', message: '当前编辑的内容未保存，是否仍然要关闭', confirmText: '仍然关闭', cancelText: '继续编辑' })
    });
    let draggedToolType = null;
    let draggedComponentId = null;
    let draggedSlot = null;
    const activeComponent = () => components.find((item) => item.id === activeId);
    this.setConfigurationListAction({
      title: `${primaryConfig?.title || '福利页-信息流营销'}配置列表`,
      records: () => this.getComponentConfigurationRecords(savedState),
      onSelect: (record) => {
        activeId = record.id;
        render();
        requestAnimationFrame(() => document.querySelector(`[data-benefits-feed-component="${record.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      }
    });
    const recentScope = primaryConfig ? `primary:${primaryConfig.storageKey || primaryConfig.title}` : 'benefits-feed';
    const refreshRecentEdits = (recordCurrent = false) => {
      const component = activeComponent();
      const name = component?.type === 'red-packet' ? component.redPacket?.name : component?.recordName || component?.label;
      if (recordCurrent && component && name) window.RecentEdits?.record({ scope: recentScope, id: component.id, name });
      window.RecentEdits?.render(document.getElementById('marketing-recent-edits'), recentScope, {
        filter: (item) => components.some((component) => component.id === item.id),
        onSelect: (item) => {
          if (!components.some((component) => component.id === item.id)) return;
          activeId = item.id;
          render();
          requestAnimationFrame(() => document.querySelector(`[data-benefits-feed-component="${item.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        }
      });
    };
    const validateComponent = (component) => {
      if (!component) return '';
      if (component.type !== 'red-packet') return component.recordName.trim() ? '' : '请补充资源位记录名称';
      const redPacket = this.createBenefitsFeedRedPacketConfig(component.redPacket);
      const hasPlatformVersion = Object.values(redPacket.targeting.platformVersions).some((platform) => platform.enabled && platform.start.trim());
      if (!redPacket.name.trim() || !redPacket.deliveryType || !hasPlatformVersion || !redPacket.targeting.onlineStart || !redPacket.targeting.onlineEnd || (redPacket.deliveryType === 'package' && (!redPacket.unclaimedImage || !redPacket.template))) return '请补充红包发放功能的记录名称、发放类型、平台版本与上线时间；券包发放还需上传未领取图片素材并选择红包模板';
      return '';
    };
    const activatePrimaryTab = (tab) => document.querySelectorAll('[data-marketing-tab]').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    const guardUnsavedNavigation = async (onProceed) => {
      editSession.guardNavigation(onProceed);
    };
    const updateEditState = () => {
      const builder = document.getElementById('benefits-feed-builder');
      const isEditing = editSession.isEditing();
      builder.classList.toggle('is-editing', isEditing);
      const componentSave = document.getElementById('save-benefits-feed-component');
      const componentRemove = document.getElementById('remove-benefits-feed-component');
      const component = activeComponent();
      const canRemoveNewComponent = isEditing && Boolean(component) && !component.hasBeenSaved;
      componentSave.textContent = isEditing ? '保存组件' : '编辑';
      componentSave.classList.toggle('is-edit-action', !isEditing);
      componentSave.disabled = isEditing && !editSession.hasComponentChanges();
      componentRemove.hidden = !canRemoveNewComponent;
      componentRemove.disabled = !canRemoveNewComponent;
      document.querySelectorAll('[data-benefits-feed-component]').forEach((element) => {
        const component = components.find((item) => item.id === element.dataset.benefitsFeedComponent);
        element.classList.toggle('is-unsaved', Boolean(component && !component.isSaved));
      });
      document.querySelectorAll('[data-benefits-feed-add], #benefits-feed-config-content input, #benefits-feed-config-content select, #benefits-feed-config-content button').forEach((control) => {
        const isStatic = control.classList.contains('benefits-feed-type-control') || control.hasAttribute('data-tooltip');
        const isLastMosaicPosition = control.matches('[data-benefits-feed-mosaic-position-remove]') && activeComponent()?.mosaic?.positions?.length <= 1;
        const isLastGridPosition = control.matches('[data-benefits-feed-grid-position-remove]') && activeComponent()?.grid?.positions?.length <= 1;
        control.disabled = !isEditing || isStatic || isLastMosaicPosition || isLastGridPosition;
      });
      document.querySelectorAll('[data-benefits-feed-add], [data-benefits-feed-component], [data-benefits-feed-slot]').forEach((item) => { item.draggable = isEditing; });
    };
    const render = () => { this.renderBenefitsFeedPreview(components, activeId); this.renderBenefitsFeedConfig(activeComponent()); updateEditState(); refreshRecentEdits(); };
    document.querySelectorAll('[data-marketing-tab]').forEach((tab) => tab.addEventListener('click', () => {
      if (tab.classList.contains('is-active')) return;
      guardUnsavedNavigation(() => { activatePrimaryTab(tab); this.showPrimaryTabContext(tab.dataset.marketingTab, 'feed', navigate); });
    }));
    document.querySelector('.marketing-home-subnav')?.addEventListener('click', (event) => {
      const subtab = event.target.closest('[data-marketing-primary-view]');
      if (!subtab || subtab.classList.contains('is-active')) return;
      const target = subtab.dataset.marketingPrimaryView;
      guardUnsavedNavigation(() => {
        if (target === 'home-function') navigate?.('marketing-config');
        else if (target === 'home-feed') navigate?.('feed-management');
        else {
          const views = { 'youzi-street-flash-sale': 'flash-sale', 'benefits-check-in-success': 'check-in-success' };
          const tab = document.querySelector('[data-marketing-tab].is-active')?.dataset.marketingTab;
          if (tab) this.showPrimaryTabContext(tab, views[target] || 'feed', navigate);
        }
      });
    });
    document.querySelectorAll('[data-benefits-feed-add]').forEach((button) => button.addEventListener('click', () => {
      if (!editSession.isEditing()) return;
      const component = this.createBenefitsFeedComponent(button.dataset.benefitsFeedAdd);
      components.push(component);
      activeId = component.id;
      refreshRecentEdits(true);
      render();
    }));
    const previewContent = document.getElementById('benefits-feed-preview-content');
    const clearDragState = () => {
      draggedToolType = null;
      draggedComponentId = null;
      draggedSlot = null;
      document.querySelectorAll('.benefits-feed-builder .is-dragging, .benefits-feed-builder .is-dragover').forEach((item) => item.classList.remove('is-dragging', 'is-dragover'));
    };
    document.querySelectorAll('[data-benefits-feed-add]').forEach((button) => button.addEventListener('dragstart', (event) => {
      if (!editSession.isEditing()) { event.preventDefault(); return; }
      clearDragState();
      draggedToolType = button.dataset.benefitsFeedAdd;
      button.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('text/plain', `benefits-feed-tool:${draggedToolType}`);
    }));
    previewContent.addEventListener('dragstart', (event) => {
      if (!editSession.isEditing()) { event.preventDefault(); return; }
      const slot = event.target.closest('[data-benefits-feed-slot]');
      const component = event.target.closest('[data-benefits-feed-component]');
      if (!component) return;
      clearDragState();
      if (slot) {
        event.stopPropagation();
        draggedSlot = { componentId: component.dataset.benefitsFeedComponent, slotId: slot.dataset.benefitsFeedSlot };
        slot.classList.add('is-dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', `benefits-feed-slot:${draggedSlot.slotId}`);
        return;
      }
      draggedComponentId = component.dataset.benefitsFeedComponent;
      component.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', `benefits-feed-component:${draggedComponentId}`);
    });
    previewContent.addEventListener('dragover', (event) => {
      if (!editSession.isEditing() || (!draggedToolType && !draggedComponentId && !draggedSlot)) return;
      event.preventDefault();
      const slot = event.target.closest('[data-benefits-feed-slot]');
      const component = event.target.closest('[data-benefits-feed-component]');
      if (draggedSlot) {
        if (slot && component?.dataset.benefitsFeedComponent === draggedSlot.componentId && slot.dataset.benefitsFeedSlot !== draggedSlot.slotId) slot.classList.add('is-dragover');
        return;
      }
      if (component && component.dataset.benefitsFeedComponent !== draggedComponentId) component.classList.add('is-dragover');
      else previewContent.classList.add('is-dragover');
    });
    previewContent.addEventListener('dragleave', (event) => {
      const item = event.target.closest('.benefits-feed-card, .benefits-feed-slot, #benefits-feed-preview-content');
      if (item && !item.contains(event.relatedTarget)) item.classList.remove('is-dragover');
    });
    previewContent.addEventListener('drop', (event) => {
      if (!editSession.isEditing() || (!draggedToolType && !draggedComponentId && !draggedSlot)) return;
      event.preventDefault();
      const targetSlot = event.target.closest('[data-benefits-feed-slot]');
      const targetCard = event.target.closest('[data-benefits-feed-component]');
      if (draggedSlot) {
        const component = components.find((item) => item.id === draggedSlot.componentId);
        if (component && targetSlot && targetCard?.dataset.benefitsFeedComponent === component.id && targetSlot.dataset.benefitsFeedSlot !== draggedSlot.slotId) {
          const order = this.getBenefitsFeedSlots(component).map((slot) => slot.id);
          const from = order.indexOf(draggedSlot.slotId);
          const to = order.indexOf(targetSlot.dataset.benefitsFeedSlot);
          [order[from], order[to]] = [order[to], order[from]];
          component.slotOrder = order;
          component.isSaved = false;
          activeId = component.id;
          render();
        }
        clearDragState();
        return;
      }
      const targetIndex = targetCard ? components.findIndex((item) => item.id === targetCard.dataset.benefitsFeedComponent) : components.length;
      if (draggedToolType) {
        const component = this.createBenefitsFeedComponent(draggedToolType);
        components.splice(Math.max(0, targetIndex), 0, component);
        activeId = component.id;
        render();
      } else if (draggedComponentId) {
        const from = components.findIndex((item) => item.id === draggedComponentId);
        let to = targetIndex;
        if (from >= 0 && from !== to) {
          const [component] = components.splice(from, 1);
          if (!targetCard) to = components.length;
          components.splice(Math.max(0, Math.min(to, components.length)), 0, component);
          component.isSaved = false;
          activeId = component.id;
          render();
        }
      }
      clearDragState();
    });
    previewContent.addEventListener('dragend', clearDragState);
    document.querySelectorAll('[data-benefits-feed-add]').forEach((button) => button.addEventListener('dragend', clearDragState));
    previewContent.addEventListener('click', (event) => {
      const component = event.target.closest('[data-benefits-feed-component]');
      if (!component) return;
      component.isSaved = false;
      activeId = component.dataset.benefitsFeedComponent;
      refreshRecentEdits(true);
      render();
    });
    document.getElementById('benefits-feed-config-content').addEventListener('input', (event) => {
      if (!editSession.isEditing()) return;
      const component = activeComponent();
      if (!component) return;
      component.isSaved = false;
      if (event.target.dataset.benefitsFeedField) component[event.target.dataset.benefitsFeedField] = event.target.value;
      if (component.type === 'mosaic' && event.target.matches('[data-benefits-feed-mosaic-field]')) {
        const mosaic = this.createBenefitsFeedMosaicConfig({ ...component, ...component.mosaic });
        const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0];
        position[event.target.dataset.benefitsFeedMosaicField] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        component.mosaic = mosaic;
      }
      if (component.type === 'grid' && event.target.matches('[data-benefits-feed-grid-field]')) {
        const grid = this.createBenefitsFeedGridConfig({ ...component, ...component.grid });
        const position = grid.positions.find((item) => item.id === grid.selectedPositionId) || grid.positions[0];
        position[event.target.dataset.benefitsFeedGridField] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        component.grid = grid;
      }
      if (component.type === 'red-packet' && event.target.matches('[data-benefits-feed-red-packet-field]')) {
        component.redPacket = this.createBenefitsFeedRedPacketConfig(component.redPacket);
        component.redPacket[event.target.dataset.benefitsFeedRedPacketField] = event.target.value;
        component.recordName = component.redPacket.name;
      }
      if (event.target.dataset.benefitsFeedTargetingField) component.targeting[event.target.dataset.benefitsFeedTargetingField] = event.target.value;
      if (event.target.dataset.benefitsFeedTest) component.testPlan[event.target.dataset.benefitsFeedTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      this.renderBenefitsFeedPreview(components, activeId);
      updateEditState();
    });
    document.getElementById('benefits-feed-config-content').addEventListener('change', async (event) => {
      if (!editSession.isEditing()) return;
      const component = activeComponent();
      if (!component) return;
      component.isSaved = false;
      if (event.target.matches('[data-benefits-feed-image]')) {
        const file = event.target.files?.[0];
        if (!file) return;
        const field = event.target.dataset.benefitsFeedImage;
        this.clearObjectUrl(component[field]);
        component[field] = await this.readImageFile(file);
      }
      if (event.target.matches('[data-benefits-feed-mosaic-image]')) {
        const file = event.target.files?.[0];
        if (!file) return;
        const mosaic = this.createBenefitsFeedMosaicConfig({ ...component, ...component.mosaic });
        const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0];
        const field = event.target.dataset.benefitsFeedMosaicImage;
        this.clearObjectUrl(position[field]);
        position[field] = await this.readImageFile(file);
        component.mosaic = mosaic;
      }
      if (event.target.matches('[data-benefits-feed-grid-image]')) {
        const file = event.target.files?.[0];
        if (!file) return;
        const grid = this.createBenefitsFeedGridConfig({ ...component, ...component.grid });
        const position = grid.positions.find((item) => item.id === grid.selectedPositionId) || grid.positions[0];
        const field = event.target.dataset.benefitsFeedGridImage;
        this.clearObjectUrl(position[field]);
        position[field] = await this.readImageFile(file);
        component.grid = grid;
      }
      if (event.target.dataset.benefitsFeedField) component[event.target.dataset.benefitsFeedField] = event.target.value;
      if (component.type === 'mosaic' && event.target.matches('[data-benefits-feed-mosaic-field]')) {
        const mosaic = this.createBenefitsFeedMosaicConfig({ ...component, ...component.mosaic });
        const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0];
        position[event.target.dataset.benefitsFeedMosaicField] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        component.mosaic = mosaic;
      }
      if (component.type === 'grid' && event.target.matches('[data-benefits-feed-grid-field]')) {
        const grid = this.createBenefitsFeedGridConfig({ ...component, ...component.grid });
        const position = grid.positions.find((item) => item.id === grid.selectedPositionId) || grid.positions[0];
        position[event.target.dataset.benefitsFeedGridField] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        component.grid = grid;
      }
      if (component.type === 'red-packet') {
        const redPacket = this.createBenefitsFeedRedPacketConfig(component.redPacket);
        component.redPacket = redPacket;
        if (event.target.matches('[data-benefits-feed-red-packet-image]')) {
          const file = event.target.files?.[0];
          if (!file) return;
          const field = event.target.dataset.benefitsFeedRedPacketImage;
          this.clearObjectUrl(redPacket[field]);
          redPacket[field] = await this.readImageFile(file);
        }
        if (event.target.matches('[data-benefits-feed-red-packet-field]')) redPacket[event.target.dataset.benefitsFeedRedPacketField] = event.target.value;
        if (event.target.name === 'benefits-feed-red-packet-delivery') redPacket.deliveryType = event.target.value;
        if (event.target.name === 'benefits-feed-red-packet-template') redPacket.template = event.target.value;
        if (event.target.matches('[data-benefits-feed-red-packet-title-area]')) redPacket.titleArea = event.target.checked;
        if (event.target.matches('[data-benefits-feed-red-packet-identity]')) redPacket.targeting.identities = [...document.querySelectorAll('[data-benefits-feed-red-packet-identity]:checked')].map((input) => input.value);
        if (event.target.matches('[data-benefits-feed-red-packet-audience]')) redPacket.targeting.audiences = [...document.querySelectorAll('[data-benefits-feed-red-packet-audience]:checked')].map((input) => input.value);
        if (event.target.name === 'benefits-feed-red-packet-audience-inversion') redPacket.targeting.audienceInversion = event.target.value;
        if (event.target.name === 'benefits-feed-red-packet-status') redPacket.targeting.status = event.target.value;
        if (event.target.matches('[data-benefits-feed-red-packet-platform]')) redPacket.targeting.platformVersions[event.target.dataset.benefitsFeedRedPacketPlatform].enabled = event.target.checked;
        if (event.target.matches('[data-benefits-feed-red-packet-version]')) { const [platform, edge] = event.target.dataset.benefitsFeedRedPacketVersion.split(':'); redPacket.targeting.platformVersions[platform][edge] = event.target.value; }
        if (event.target.dataset.benefitsFeedRedPacketTargetingField) redPacket.targeting[event.target.dataset.benefitsFeedRedPacketTargetingField] = event.target.value;
        if (event.target.dataset.benefitsFeedRedPacketTest) redPacket.testPlan[event.target.dataset.benefitsFeedRedPacketTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        component.recordName = redPacket.name;
      }
      if (event.target.matches('[data-benefits-feed-identity]')) component.targeting.identities = [...document.querySelectorAll('[data-benefits-feed-identity]:checked')].map((input) => input.value);
      if (event.target.matches('[data-benefits-feed-audience]')) component.targeting.audiences = [...document.querySelectorAll('[data-benefits-feed-audience]:checked')].map((input) => input.value);
      if (event.target.name === 'benefits-feed-audience-inversion') component.targeting.audienceInversion = event.target.value;
      if (event.target.name === 'benefits-feed-status') component.targeting.status = event.target.value;
      if (event.target.matches('[data-benefits-feed-platform]')) component.targeting.platformVersions[event.target.dataset.benefitsFeedPlatform].enabled = event.target.checked;
      if (event.target.matches('[data-benefits-feed-version]')) { const [platform, edge] = event.target.dataset.benefitsFeedVersion.split(':'); component.targeting.platformVersions[platform][edge] = event.target.value; }
      if (event.target.dataset.benefitsFeedTargetingField) component.targeting[event.target.dataset.benefitsFeedTargetingField] = event.target.value;
      if (event.target.dataset.benefitsFeedTest) component.testPlan[event.target.dataset.benefitsFeedTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      render();
    });
    document.getElementById('benefits-feed-config-content').addEventListener('click', async (event) => {
      const dismissRequirementOverlay = event.target.closest('[data-dismiss-requirement-overlay]');
      if (dismissRequirementOverlay) { dismissRequirementOverlay.closest('.editor-requirement-overlay')?.remove(); return; }
      if (!editSession.isEditing()) return;
      const component = activeComponent();
      const mosaicPosition = event.target.closest('[data-benefits-feed-mosaic-position]');
      if (mosaicPosition && component?.type === 'mosaic') {
        component.mosaic = this.createBenefitsFeedMosaicConfig({ ...component, ...component.mosaic });
        component.mosaic.selectedPositionId = mosaicPosition.dataset.benefitsFeedMosaicPosition;
        render();
        return;
      }
      const addMosaicPosition = event.target.closest('[data-benefits-feed-mosaic-position-add]');
      if (addMosaicPosition && component?.type === 'mosaic') {
        const mosaic = this.createBenefitsFeedMosaicConfig({ ...component, ...component.mosaic });
        const position = this.createBenefitsFeedMosaicConfig().positions[0];
        mosaic.positions.push(position);
        mosaic.selectedPositionId = position.id;
        component.mosaic = mosaic;
        component.isSaved = false;
        render();
        return;
      }
      const removeMosaicPosition = event.target.closest('[data-benefits-feed-mosaic-position-remove]');
      if (removeMosaicPosition && component?.type === 'mosaic') {
        const mosaic = this.createBenefitsFeedMosaicConfig({ ...component, ...component.mosaic });
        if (mosaic.positions.length > 1) {
          const removedIndex = mosaic.positions.findIndex((item) => item.id === mosaic.selectedPositionId);
          mosaic.positions.splice(removedIndex < 0 ? mosaic.positions.length - 1 : removedIndex, 1);
          mosaic.selectedPositionId = mosaic.positions[Math.max(0, Math.min(removedIndex, mosaic.positions.length - 1))].id;
          component.mosaic = mosaic;
          component.isSaved = false;
          render();
        }
        return;
      }
      const mosaicDeletion = event.target.closest('[data-benefits-feed-mosaic-delete]');
      if (mosaicDeletion && component?.type === 'mosaic') {
        const mosaic = this.createBenefitsFeedMosaicConfig({ ...component, ...component.mosaic });
        const position = mosaic.positions.find((item) => item.id === mosaic.selectedPositionId) || mosaic.positions[0];
        const field = mosaicDeletion.dataset.benefitsFeedMosaicDelete;
        this.clearObjectUrl(position[field]);
        position[field] = '';
        component.mosaic = mosaic;
        component.isSaved = false;
        render();
        return;
      }
      const gridPosition = event.target.closest('[data-benefits-feed-grid-position]');
      if (gridPosition && component?.type === 'grid') {
        component.grid = this.createBenefitsFeedGridConfig({ ...component, ...component.grid });
        component.grid.selectedPositionId = gridPosition.dataset.benefitsFeedGridPosition;
        render();
        return;
      }
      const addGridPosition = event.target.closest('[data-benefits-feed-grid-position-add]');
      if (addGridPosition && component?.type === 'grid') {
        const grid = this.createBenefitsFeedGridConfig({ ...component, ...component.grid });
        const position = this.createBenefitsFeedGridConfig().positions[0];
        grid.positions.push(position);
        grid.selectedPositionId = position.id;
        component.grid = grid;
        component.isSaved = false;
        render();
        return;
      }
      const removeGridPosition = event.target.closest('[data-benefits-feed-grid-position-remove]');
      if (removeGridPosition && component?.type === 'grid') {
        const grid = this.createBenefitsFeedGridConfig({ ...component, ...component.grid });
        if (grid.positions.length > 1) {
          const removedIndex = grid.positions.findIndex((item) => item.id === grid.selectedPositionId);
          grid.positions.splice(removedIndex < 0 ? grid.positions.length - 1 : removedIndex, 1);
          grid.selectedPositionId = grid.positions[Math.max(0, Math.min(removedIndex, grid.positions.length - 1))].id;
          component.grid = grid;
          component.isSaved = false;
          render();
        }
        return;
      }
      const gridDeletion = event.target.closest('[data-benefits-feed-grid-delete]');
      if (gridDeletion && component?.type === 'grid') {
        const grid = this.createBenefitsFeedGridConfig({ ...component, ...component.grid });
        const position = grid.positions.find((item) => item.id === grid.selectedPositionId) || grid.positions[0];
        const field = gridDeletion.dataset.benefitsFeedGridDelete;
        this.clearObjectUrl(position[field]);
        position[field] = '';
        component.grid = grid;
        component.isSaved = false;
        render();
        return;
      }
      const deletion = event.target.closest('[data-benefits-feed-delete]');
      if (deletion && component) { const field = deletion.dataset.benefitsFeedDelete; this.clearObjectUrl(component[field]); component[field] = ''; component.isSaved = false; render(); return; }
      const redPacketDeletion = event.target.closest('[data-benefits-feed-red-packet-delete]');
      if (redPacketDeletion && component?.type === 'red-packet') {
        component.redPacket = this.createBenefitsFeedRedPacketConfig(component.redPacket);
        const field = redPacketDeletion.dataset.benefitsFeedRedPacketDelete;
        this.clearObjectUrl(component.redPacket[field]);
        component.redPacket[field] = '';
        component.isSaved = false;
        render();
        return;
      }
    });
    document.getElementById('remove-benefits-feed-component').addEventListener('click', () => {
      const component = activeComponent();
      if (!editSession.isEditing() || !component || component.hasBeenSaved) return;
      const index = components.findIndex((item) => item.id === component.id);
      if (index < 0) return;
      components.splice(index, 1);
      activeId = components[index]?.id || components[index - 1]?.id || null;
      render();
      window.BackofficeLayout.showToast('组件已移除');
    });
    document.getElementById('save-benefits-feed-component').addEventListener('click', () => {
      if (!editSession.isEditing()) {
        editSession.startEditing();
        refreshRecentEdits(true);
        updateEditState();
        return;
      }
      if (!editSession.hasComponentChanges()) return;
      const message = validateComponent(activeComponent());
      if (message) { window.BackofficeLayout.showToast('请完善必填项', message); return; }
      if (activeComponent()?.type === 'red-packet') activeComponent().recordName = activeComponent().redPacket.name;
      components.forEach((component) => { component.isSaved = true; component.hasBeenSaved = true; });
      const nextState = { components };
      try {
        if (primaryConfig) this.savePrimaryComponentState(primaryConfig, this.cloneBenefitsFeedState(nextState));
        else this.saveBenefitsFeedState(this.cloneBenefitsFeedState(nextState));
      } catch (error) { window.BackofficeLayout.showToast('组件保存失败', '本地演示数据无法保存，请减少图片素材后重试'); return; }
      savedState = this.cloneBenefitsFeedState(nextState);
      editSession.finishComponentEditing(nextState);
      refreshRecentEdits(true);
      updateEditState();
      window.BackofficeLayout.showToast('组件已保存', `${primaryConfig?.title || '福利页信息流营销'}已更新`);
    });
    render();
  },
  showPrimaryTabContext(tab, homeView, navigate) {
    const subnav = document.querySelector('.marketing-home-subnav');
    const body = document.getElementById('marketing-config-body');
    const actions = document.getElementById('marketing-page-actions');
    const referenceNote = document.getElementById('benefits-feed-reference-note');
    if (referenceNote) referenceNote.hidden = !(tab === 'benefits' && homeView === 'feed');
    if (tab === 'home') {
      navigate?.(homeView === 'feed' ? 'feed-management' : 'marketing-config');
      return;
    }
    const pageTitles = { benefits: '福利页', 'youzi-street': '柚子街', mine: '我' };
    const title = pageTitles[tab];
    const activeView = tab === 'youzi-street' && homeView === 'flash-sale'
      ? 'flash-sale'
      : tab === 'benefits' && homeView === 'check-in-success'
        ? homeView
        : 'feed';
    const isFlashSale = tab === 'youzi-street' && activeView === 'flash-sale';
    const isCheckInSuccess = tab === 'benefits' && activeView === 'check-in-success';
    subnav.innerHTML = this.renderPrimarySubnav(tab, activeView);
    if (tab === 'benefits' && activeView === 'feed') {
      document.querySelector('.marketing-config-page h1').textContent = '福利页-信息流营销';
      document.querySelector('.marketing-config-page .heading-note').textContent = '维护福利页信息流资源位展示配置';
      body.innerHTML = this.renderBenefitsFeedBuilder();
      actions.innerHTML = '';
      this.bindBenefitsFeedBuilder(navigate);
      return;
    }
    if (tab === 'youzi-street' && activeView === 'feed') {
      document.querySelector('.marketing-config-page h1').textContent = '柚子街-信息流营销';
      document.querySelector('.marketing-config-page .heading-note').textContent = '维护柚子街信息流 Tab、资源位状态及展示配置';
      body.innerHTML = window.FeedManagementPage?.renderEmbedded?.()
        || '<div class="style-config-empty">信息流编辑框架加载失败，请刷新页面后重试。</div>';
      actions.innerHTML = '';
      window.FeedManagementPage?.bindEmbedded?.({
        navigate,
        storageKey: 'meiyou-cashback-youzi-street-feed-management',
        pageName: '柚子街-信息流营销'
      });
      return;
    }
    if (isCheckInSuccess) {
      document.querySelector('.marketing-config-page h1').textContent = '打卡成功弹窗管理';
      document.querySelector('.marketing-config-page .heading-note').textContent = '维护打卡成功后展示的营销弹窗配置';
      body.innerHTML = this.renderBenefitsCheckInSuccessList();
      this.setConfigurationListAction({
        title: '打卡成功弹窗营销配置列表',
        records: () => this.loadBenefitsCheckInSuccessState().records.map((record) => ({
          id: record.id,
          type: '打卡成功弹窗',
          name: record.recordName,
          summary: `上线时间：${record.onlineStart || '-'} 至 ${record.onlineEnd || '-'}`,
          status: record.status || '-'
        }))
      });
      this.bindBenefitsCheckInSuccessList();
      return;
    }
    const primaryConfig = this.getPrimaryComponentConfig(tab, activeView);
    if (primaryConfig) {
      document.querySelector('.marketing-config-page h1').textContent = primaryConfig.title;
      document.querySelector('.marketing-config-page .heading-note').textContent = primaryConfig.note;
      body.innerHTML = this.renderPrimaryComponentBuilder(primaryConfig);
      actions.innerHTML = '';
      this.bindBenefitsFeedBuilder(navigate, { primaryConfig });
      return;
    }
    document.querySelector('.marketing-config-page h1').textContent = isFlashSale
      ? '柚子街-限时抢购'
      : isCheckInSuccess
          ? '打卡成功弹窗营销配置'
          : `${title}-信息流营销`;
    document.querySelector('.marketing-config-page .heading-note').textContent = isFlashSale
      ? '维护柚子街限时抢购展示配置'
      : isCheckInSuccess
          ? '维护福利页打卡成功弹窗对应的营销展示配置'
          : `维护${title}信息流对应的营销展示配置`;
    body.innerHTML = this.renderPrimaryTabPlaceholder(tab, activeView);
    this.setConfigurationListAction({ title: isFlashSale ? '柚子街-限时抢购配置列表' : `${title}-信息流营销配置列表`, records: [] });
  },
  createHomeComponent(type) {
    const definitions = {
      search: { type, label: '功能区-橱窗', placeholder: '搜优惠、搜商品', functionSlot: 'after-notification', sortable: true, showcase: { name: '', sort: '', windowType: 'mosaic', mosaic: { image: '', darkImage: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true }, newcomer: { image: '', darkImage: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true }, targeting: window.ConfigurationSections.createTargeting(), testPlan: window.ConfigurationSections.createTestPlan() } },
      shortcut: { type, label: '功能区-红包发放功能', subtitle: '领取返现红包', functionSlot: 'after-notification', sortable: true, redPacket: { name: '', sort: '', deliveryType: 'single', titleArea: false, title: '', subtitle: '', titleImage: '', titleDarkImage: '', unclaimedImage: '', unclaimedDarkImage: '', template: 'with-button', targeting: window.ConfigurationSections.createTargeting(), testPlan: window.ConfigurationSections.createTestPlan() } }
    };
    return { id: `home-component-${Date.now()}-${Math.random().toString(16).slice(2)}`, isSaved: false, hasBeenSaved: false, ...definitions[type] };
  },
  isFunctionZoneComponent(component) {
    return ['search', 'shortcut'].includes(component.type);
  },
  escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  },
  getFeedMarketingTabs() {
    const feedState = window.FeedManagementPage?.loadState?.();
    if (!feedState?.tabs) return [];
    return feedState.tabs.filter((tab) => tab.status === '上线中' && tab.resourceStatus === '上线中');
  },
  renderLinkedFeedPreview() {
    const tabs = this.getFeedMarketingTabs();
    const sourceMark = '<span class="home-linked-feed-source-mark">取自信息流配置</span>';
    if (!tabs.length) return `<section class="home-linked-feed" aria-label="首页信息流营销预览">${sourceMark}<div class="home-linked-feed-empty">暂无可展示的信息流资源位</div></section>`;
    const activeTab = tabs[0];
    const icon = activeTab.iconImage ? `<img src="${activeTab.iconImage}" alt="" />` : '<span>Tab</span>';
    const badge = activeTab.tailImage || activeTab.cornerImage;
    return `<section class="home-linked-feed" aria-label="首页信息流营销预览">${sourceMark}<div class="home-linked-feed-tabs">${tabs.map((tab, index) => `<span class="home-linked-feed-tab${index === 0 ? ' is-active' : ''}">${index === 0 ? `<i class="home-linked-feed-icon">${icon}</i>` : ''}${this.escapeHtml(tab.tabName || '未命名 Tab')}${index === 0 && badge ? `<img class="home-linked-feed-badge" src="${badge}" alt="" />` : ''}</span>`).join('')}</div><div class="home-linked-feed-card"><b>${this.escapeHtml(activeTab.tabName || '信息流 Tab')}</b><span>信息流资源位内容</span><div><i>精选返现</i><i>限时好价</i><i>热销推荐</i></div></div></section>`;
  },
  renderHomePreview(components, activeId) {
    const canvas = document.getElementById('home-phone-canvas');
    const notificationSlot = document.getElementById('home-function-slot-after-notification');
    const searchPasteSlot = document.getElementById('home-function-slot-after-search-paste');
    if (!canvas || !notificationSlot || !searchPasteSlot) return;
    components.forEach((component) => {
      if (this.isFunctionZoneComponent(component) && component.functionSlot === 'after-header') component.functionSlot = 'after-notification';
    });
    const renderComponent = (component) => {
      const active = component.id === activeId ? ' is-active' : '';
      let content = '';
      if (component.type === 'search') {
        const showcase = component.showcase || {};
        const windowConfig = showcase[showcase.windowType] || {};
        const placeholder = showcase.windowType === 'newcomer' ? '待上传新人滑块商品图片' : '待上传拼图图片';
        content = windowConfig.image
          ? `<img class="home-showcase-preview-image" src="${windowConfig.image}" alt="橱窗 Banner 预览" />`
          : `<span class="home-showcase-preview-placeholder"><b>橱窗 Banner</b><small>${placeholder}</small></span>`;
      }
      if (component.type === 'shortcut') {
        const deliveryType = component.redPacket?.deliveryType === 'package' ? 'package' : 'single';
        const preview = deliveryType === 'package'
          ? { src: 'assets/marketing-config/red-packet-package-delivery-preview.png', alt: '红包券包发放预览' }
          : { src: 'assets/marketing-config/red-packet-single-delivery-preview.png', alt: '新人专享红包单个发放预览' };
        content = `<img class="home-red-packet-delivery-preview" src="${preview.src}" alt="${preview.alt}" />`;
      }
      const sortable = ' home-preview-component-sortable';
      const draggable = ' draggable="true" data-tooltip="支持在功能区排序"';
      const previewType = component.type === 'search' ? 'showcase' : component.type;
      const unsaved = component.isSaved ? '' : ' is-unsaved';
      return `<button class="home-preview-component home-preview-${previewType}${active}${unsaved}${sortable}" type="button" data-home-component-id="${component.id}"${draggable}>${content}</button>`;
    };
    const renderFunctionZone = (slotId) => {
      const zoneComponents = components.filter((component) => this.isFunctionZoneComponent(component) && component.functionSlot === slotId);
      const content = zoneComponents.length ? zoneComponents.map(renderComponent).join('') : '<div class="home-canvas-empty"><b>+</b><span>拖入功能区组件</span></div>';
      return `<section class="home-preview-drop-zone home-function-drop-zone" data-home-drop-zone="function" data-home-function-slot="${slotId}" aria-label="功能区组件投放区">${content}</section>`;
    };
    notificationSlot.innerHTML = renderFunctionZone('after-notification');
    searchPasteSlot.innerHTML = renderFunctionZone('after-search-paste');
    canvas.innerHTML = this.renderLinkedFeedPreview();
  },
  renderComponentEditor(components, activeId, activeGoldComponentId, goldComponents) {
    const editor = document.getElementById('home-component-editor');
    if (!editor) return;
    editor.innerHTML = goldComponents.length ? `<span>功能金刚区 · ${goldComponents.length} 个组件</span><div>${goldComponents.map((component, index) => `<button class="home-component-editor-item${component.id === activeGoldComponentId ? ' is-active' : ''}" type="button" data-home-editor-gold="${component.id}">功能金刚区 ${index + 1}</button>`).join('')}</div>` : '';
  },
  renderFixedEntries(goldComponents, activeGoldComponentId, activeEntryIndex) {
    const container = document.getElementById('home-fixed-entries');
    if (!container) return;
    container.classList.toggle('is-empty', !goldComponents.length);
    container.classList.toggle('is-active', Boolean(activeGoldComponentId));
    container.innerHTML = `${goldComponents.map((component, componentIndex) => `<section class="home-gold-component${component.id === activeGoldComponentId ? ' is-active' : ''}${component.isSaved ? '' : ' is-unsaved'}" draggable="true" data-home-gold-component="${component.id}" data-tooltip="支持在功能金刚组件区排序"><div class="home-gold-component-label">功能金刚区 ${componentIndex + 1}</div><div class="home-gold-component-entries">${component.entries.map((entry, index) => `<button class="home-fixed-entry${component.id === activeGoldComponentId && index === activeEntryIndex ? ' is-active' : ''}" type="button" data-home-fixed-entry="${index}"><u>${this.renderFixedEntryImage(entry)}</u><span>${entry.title}</span></button>`).join('')}</div></section>`).join('')}<div class="home-fixed-entries-drop" data-home-drop-zone="fixed-entries"><b>+</b><span>拖入功能金刚区</span></div>`;
  },
  getFixedEntryImage(entry, mode = 'normal') {
    return mode === 'dark' && entry.darkImage ? entry.darkImage : entry.image;
  },
  renderFixedEntryImage(entry, mode = 'normal') {
    const image = this.getFixedEntryImage(entry, mode);
    return image && (image.startsWith('blob:') || image.startsWith('data:image/')) ? `<img src="${image}" alt="" />` : (image || '图');
  },
  renderFixedEntryConfig(entry, index) {
    const container = document.getElementById('home-config-content');
    const type = document.getElementById('home-config-type');
    if (!container || !type) return;
    type.textContent = `功能金刚区 · 入口 ${index + 1}`;
    const field = (label, control, className = '') => `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    const renderAsset = (label, inputId, image, required = false) => field(`${required ? '<b class="field-required" aria-label="必填">*</b>' : ''}${label}`, `<span class="home-entry-asset"><span class="home-entry-asset-preview">${image && (image.startsWith('blob:') || image.startsWith('data:image/')) ? `<img src="${image}" alt="已上传素材" />` : '<b>图片</b>'}</span><span class="home-entry-asset-actions"><label class="button secondary home-entry-upload">上传图片<input id="${inputId}" type="file" accept="image/*"${required ? ' required' : ''} /></label><button class="home-entry-delete" type="button" data-home-entry-delete="${inputId}"${image ? '' : ' disabled'}>删除图片</button></span></span>`);
    const jumpTarget = entry.jumpType === 'link' ? entry.linkTarget : entry.pageTarget;
    const pageTargets = ['福利新开页', '收藏页', '足迹页', '我的订单页', '专属礼金页'];
    const pageTargetControl = (() => {
      const currentTarget = jumpTarget || '';
      const legacyOption = currentTarget && !pageTargets.includes(currentTarget)
        ? `<option value="${this.escapeHtml(currentTarget)}" selected>${this.escapeHtml(currentTarget)}</option>`
        : '';
      return `<select class="control" id="home-fixed-entry-jump-target" required><option value="">请选择目标页面</option>${legacyOption}${pageTargets.map((target) => `<option value="${target}"${target === currentTarget ? ' selected' : ''}>${target}</option>`).join('')}</select>`;
    })();
    const jumpDescription = entry.jumpType === 'link' ? field('<b class="field-required" aria-label="必填">*</b>地址/协议说明', `<span class="home-jump-input-with-help"><input class="control" id="home-fixed-entry-jump-description" value="${entry.jumpDescription || ''}" required placeholder="请输入地址/协议说明" /><button class="help-tooltip" type="button" aria-label="地址或协议说明" data-tooltip="备注目标地址的相关信息，例如淘宝618会场活动">?</button></span>`) : '';
    const jumpTargetControl = entry.jumpType === 'link'
      ? `<input class="control" id="home-fixed-entry-jump-target" value="${this.escapeHtml(jumpTarget || '')}" required placeholder="请输入自定义地址或协议" />`
      : pageTargetControl;
    const jumpInfo = `<section class="home-jump-info-section"><h3>跳转配置</h3>${field('<b class="field-required" aria-label="必填">*</b>跳转类型', `<select class="control" id="home-fixed-entry-jump-type" required><option value="page"${entry.jumpType === 'page' ? ' selected' : ''}>页面跳转</option><option value="link"${entry.jumpType === 'link' ? ' selected' : ''}>自定义地址/协议</option></select>`)}${field(`<b class="field-required" aria-label="必填">*</b>${entry.jumpType === 'link' ? '地址/协议' : '目标页面'}`, jumpTargetControl)}${jumpDescription}</section>`;
    container.innerHTML = `<div class="style-config-form home-component-form home-fixed-entry-form"><div class="home-fixed-config-note">当前坑位支持维护图片、标题与跳转配置；定向信息和测试计划由功能金刚区整体统一配置。</div><section class="home-entry-info-section"><h3>基本展示信息</h3>${renderAsset('入口素材', 'home-fixed-entry-image', entry.image, true)}${renderAsset('入口素材（暗黑模式）', 'home-fixed-entry-dark-image', entry.darkImage)}${field('<b class="field-required" aria-label="必填">*</b>标题', '<input class="control" id="home-fixed-entry-title" value="' + entry.title + '" maxlength="5" required placeholder="请输入标题，最多5个字" />')}</section>${jumpInfo}<p>入口素材、标题、跳转类型和跳转目标为必填项，标题最多支持 5 个字。暗黑模式素材未配置时，默认使用入口素材；修改后会实时同步至中间预览区域。</p></div>`;
  },
  renderFixedEntriesComponentConfig(component) {
    const container = document.getElementById('home-config-content');
    const type = document.getElementById('home-config-type');
    if (!container || !type) return;
    type.textContent = '功能金刚区';
    container.innerHTML = `<div class="style-config-form home-component-form home-fixed-entry-form">${window.ConfigurationSections.renderTargeting({ prefix: 'home-fixed-entries', value: component.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'home-fixed-entries', value: component.testPlan, description: '测试 UID 内的用户将在测试有效时间内看到功能金刚区，到期自动终止，不影响正式配置。' })}<p>定向信息和测试计划仅控制当前功能金刚区，不影响其他功能金刚区。</p></div>`;
  },
  renderHomeConfig(component) {
    const container = document.getElementById('home-config-content');
    const type = document.getElementById('home-config-type');
    if (!container || !type) return;
    if (!component) {
      type.textContent = '未选择组件';
      container.innerHTML = '<div class="style-config-empty">从左侧添加组件，或点击预览中的组件进行配置</div>';
      return;
    }
    type.textContent = component.type === 'product-flow' ? '信息流' : component.type === 'shortcut' ? '功能区-红包发放功能' : component.label;
    if (component.type === 'shortcut') {
      const redPacket = component.redPacket || { name: '', sort: '', deliveryType: 'single', titleArea: false, title: '', subtitle: '', titleImage: '', titleDarkImage: '', unclaimedImage: '', unclaimedDarkImage: '', template: 'with-button', targeting: window.ConfigurationSections.createTargeting(), testPlan: window.ConfigurationSections.createTestPlan() };
      component.redPacket = redPacket;
      Object.assign(redPacket, { title: '', subtitle: '', titleImage: '', titleDarkImage: '', unclaimedImage: '', unclaimedDarkImage: '', template: 'with-button', ...redPacket });
      const baseInfo = `<section class="home-entry-info-section shared-config-section"><h3>基础信息</h3><div class="config-field"><span class="config-field-label"><b class="field-required">*</b>记录名称</span><div class="config-field-control"><input class="control" data-home-red-packet-field="name" value="${redPacket.name}" placeholder="仅用于后台记录，前台不可见" /></div></div></section>`;
      const titleImageControl = (label, field, image) => `<div class="home-red-packet-title-asset"><span class="home-red-packet-title-asset-preview">${image ? `<img src="${image}" alt="已上传${label}" />` : '<b>图片</b>'}</span><span class="home-red-packet-title-asset-actions"><label class="button secondary home-entry-upload">${label}<input type="file" accept="image/*" data-home-red-packet-image="${field}" /></label><button class="home-entry-delete" type="button" data-home-red-packet-delete="${field}"${image ? '' : ' disabled'}>删除图片</button></span></div>`;
      const titleAreaInfo = redPacket.titleArea ? `<div class="home-red-packet-title-area-fields"><div class="config-field"><span class="config-field-label">标题</span><div class="config-field-control"><input class="control" data-home-red-packet-field="title" value="${redPacket.title}" placeholder="请输入标题" /></div></div><div class="config-field"><span class="config-field-label">副标题</span><div class="config-field-control"><input class="control" data-home-red-packet-field="subtitle" value="${redPacket.subtitle}" placeholder="请输入副标题" /></div></div><div class="config-field home-red-packet-title-image-field"><span class="config-field-label">标题图片</span><div class="config-field-control"><div class="home-red-packet-title-assets">${titleImageControl('上传图片', 'titleImage', redPacket.titleImage)}${titleImageControl('暗黑模式', 'titleDarkImage', redPacket.titleDarkImage)}</div><p>若同时填写文字标题，以图片优先展示。</p></div></div></div>` : '';
      const packageAssetControl = (label, field, image, required = false) => `<div class="home-red-packet-package-asset"><span class="home-red-packet-title-asset-preview">${image ? `<img src="${image}" alt="已上传${label}" />` : '<b>图片</b>'}</span><span class="home-red-packet-title-asset-actions"><label class="button secondary home-entry-upload">${label}<input type="file" accept="image/*" data-home-red-packet-image="${field}"${required ? ' required' : ''} /></label><button class="home-entry-delete" type="button" data-home-red-packet-delete="${field}"${image ? '' : ' disabled'}>删除图片</button></span></div>`;
      const packageInfo = redPacket.deliveryType === 'package' ? `<div class="home-red-packet-package-info"><p class="home-red-packet-package-notice">同一券包配置内，关联红包每人最多可领取一次，无法重复领取</p><div class="config-field home-red-packet-package-assets"><span class="config-field-label"><b class="field-required">*</b>未领取图片素材</span><div class="config-field-control"><div class="home-red-packet-package-asset-list">${packageAssetControl('上传图片', 'unclaimedImage', redPacket.unclaimedImage, true)}${packageAssetControl('暗黑模式', 'unclaimedDarkImage', redPacket.unclaimedDarkImage)}</div><p class="home-red-packet-package-help">用户未领取时展示整张素材图。未领取态不展示标题区，以图片素材为主视觉。</p></div></div></div>` : '';
      const packageTemplateInfo = redPacket.deliveryType === 'package' ? `<div class="config-field home-red-packet-template-field"><span class="config-field-label"><b class="field-required">*</b>红包模板</span><div class="config-field-control"><span class="home-red-packet-template-options"><label class="home-red-packet-template-card${redPacket.template === 'with-button' ? ' is-selected' : ''}"><input type="radio" name="home-red-packet-template" value="with-button"${redPacket.template === 'with-button' ? ' checked' : ''} /><span class="home-red-packet-template-copy"><b>模板一：有去使用按钮</b><small>已领取/待使用状态下展示“去使用”按钮，点击后按红包自身配置的跳转地址跳转。</small></span><img class="home-red-packet-template-preview" src="assets/marketing-config/red-packet-template-with-button.png" alt="模板一红包样式示意" /></label><label class="home-red-packet-template-card${redPacket.template === 'without-button' ? ' is-selected' : ''}"><input type="radio" name="home-red-packet-template" value="without-button"${redPacket.template === 'without-button' ? ' checked' : ''} /><span class="home-red-packet-template-copy"><b>模板二：无去使用按钮</b><small>已领取/待使用状态下不展示按钮。适用于红包跳转地址为返现首页，避免用户点击后仍停留首页。</small></span><img class="home-red-packet-template-preview" src="assets/marketing-config/red-packet-template-without-button.png" alt="模板二红包样式示意" /></label></span><p class="home-red-packet-template-help">若关联红包的跳转地址为返现首页，建议选择“无去使用按钮”，避免用户感知为按钮无效。</p></div></div>` : '';
      const featureInfo = `<section class="home-entry-info-section shared-config-section"><h3>功能信息</h3><div class="config-field"><span class="config-field-label"><b class="field-required">*</b>发放类型</span><div class="config-field-control"><span class="home-entry-status-control"><label><input type="radio" name="home-red-packet-delivery" value="single"${redPacket.deliveryType === 'single' ? ' checked' : ''} />单个发放</label><label><input type="radio" name="home-red-packet-delivery" value="package"${redPacket.deliveryType === 'package' ? ' checked' : ''} />券包发放</label></span></div></div>${packageInfo}<div class="config-field"><span class="config-field-label">是否配置标题区</span><div class="config-field-control"><span class="home-entry-status-control"><label><input type="checkbox" data-home-red-packet-title-area${redPacket.titleArea ? ' checked' : ''} />配置标题区</label></span></div></div>${titleAreaInfo}${packageTemplateInfo}<div class="home-red-packet-link"><span>关联返现红包</span><div class="home-red-packet-link-control"><button class="button secondary" type="button" disabled title="本原型不展开红包关联明细">+ 关联红包</button><div class="home-red-packet-link-placeholder">关联区</div></div></div></section>`;
      container.innerHTML = `<div class="style-config-form home-component-form home-red-packet-form">${baseInfo}${featureInfo}${window.ConfigurationSections.renderTargeting({ prefix: 'home-red-packet', value: redPacket.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'home-red-packet', value: redPacket.testPlan })}<p>带 * 的字段为必填项。关联红包仅保留入口，不在此处配置选择明细。</p></div>`;
      return;
    }
    if (component.type === 'search') {
      const showcase = component.showcase || { name: '', sort: '', windowType: 'mosaic', mosaic: { image: '', darkImage: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true }, newcomer: { image: '', darkImage: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true }, targeting: window.ConfigurationSections.createTargeting(), testPlan: window.ConfigurationSections.createTestPlan() };
      component.showcase = showcase;
      showcase.mosaic = { image: '', darkImage: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true, ...showcase.mosaic };
      showcase.newcomer = { image: '', darkImage: '', routeType: '', routeProtocol: '', pid: '', selectedPid: '', skipType: '', mallId: '', popupLogo: '', popupCopy: '', requiresLogin: true, ...showcase.newcomer };
      showcase.targeting = window.ConfigurationSections.normalizeTargeting(showcase.targeting);
      showcase.testPlan = window.ConfigurationSections.normalizeTestPlan(showcase.testPlan);
      const windowConfig = showcase[showcase.windowType];
      const field = (label, control, className = '') => `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
      const assetControl = (label, fieldName, image) => `<span class="home-showcase-asset"><span class="home-showcase-asset-preview">${image ? `<img src="${image}" alt="已上传${label}" />` : '<b>图片</b>'}</span><span class="home-showcase-asset-actions"><label class="button secondary home-entry-upload">${label}<input type="file" accept="image/*" data-home-showcase-image="${fieldName}" /></label><button class="home-entry-delete" type="button" data-home-showcase-delete="${fieldName}"${image ? '' : ' disabled'}>删除图片</button></span></span>`;
      const help = (text) => `<button class="help-tooltip home-showcase-help" type="button" aria-label="字段说明" data-tooltip="${text}">?</button>`;
      const mosaicConfig = `<div class="home-showcase-workspace"><div class="home-showcase-canvas" aria-label="${showcase.windowType === 'mosaic' ? '拼图' : '新人滑块商品'}配置示意"><div class="home-showcase-piece${windowConfig.image ? ' has-image' : ''}">${windowConfig.image ? `<img src="${windowConfig.image}" alt="已上传橱窗素材" />` : '<span>上传橱窗图片</span>'}<b>★</b></div><button class="home-showcase-node" type="button" aria-label="添加拼图位">+</button><div class="home-showcase-canvas-add">+</div></div><span class="home-showcase-route-example">路由协议填写示例</span><div class="home-showcase-assets">${assetControl('上传图片', 'image', windowConfig.image)}${assetControl('暗黑模式', 'darkImage', windowConfig.darkImage)}</div><div class="home-showcase-route-row"><select class="control" data-home-showcase-field="routeType"><option value="">请选择跳转类型</option><option value="page"${windowConfig.routeType === 'page' ? ' selected' : ''}>页面跳转</option><option value="protocol"${windowConfig.routeType === 'protocol' ? ' selected' : ''}>自定义地址/协议</option></select><input class="control" data-home-showcase-field="routeProtocol" value="${windowConfig.routeProtocol}" placeholder="请输入路由协议" /></div><div class="home-showcase-input-help"><input class="control" data-home-showcase-field="pid" value="${windowConfig.pid}" placeholder="pid（除京东&拼多多&抖音&1688，其余商城用于埋点上报）" />${help('用于商城埋点上报的 PID 配置。')}</div><div class="home-showcase-input-help"><select class="control" data-home-showcase-field="selectedPid"><option value="">请选择 pid</option><option value="default"${windowConfig.selectedPid === 'default' ? ' selected' : ''}>默认 pid</option><option value="custom"${windowConfig.selectedPid === 'custom' ? ' selected' : ''}>自定义 pid</option></select>${help('选择当前橱窗展示使用的 PID。')}</div><div class="home-showcase-input-help"><input class="control" data-home-showcase-field="skipType" value="${windowConfig.skipType}" placeholder="skip_type（用于埋点上报）" />${help('用于记录跳转类型的埋点字段。')}</div><input class="control" data-home-showcase-field="mallId" value="${windowConfig.mallId}" placeholder="商城 id" /><div class="home-showcase-popup-row">${assetControl('出站弹窗 logo', 'popupLogo', windowConfig.popupLogo)}<input class="control" data-home-showcase-field="popupCopy" value="${windowConfig.popupCopy}" placeholder="出站弹窗文案" /></div><label class="home-showcase-login"><input type="checkbox" data-home-showcase-field="requiresLogin"${windowConfig.requiresLogin ? ' checked' : ''} />用户需登录</label></div>`;
      const baseInfo = `<section class="home-entry-info-section shared-config-section"><h3>基础信息</h3>${field('<b class="field-required">*</b>功能类型', '<input class="control home-showcase-function-type" value="橱窗功能" disabled aria-label="功能类型：橱窗功能" />')}${field('<b class="field-required">*</b>记录名称', `<input class="control" data-home-showcase-base="name" value="${showcase.name}" placeholder="仅用于后台记录，前台不可见" />`)}</section>`;
      const featureInfo = `<section class="home-entry-info-section shared-config-section home-showcase-feature-section"><h3>功能信息</h3>${field('橱窗类型', `<select class="control" data-home-showcase-window-type><option value="mosaic"${showcase.windowType === 'mosaic' ? ' selected' : ''}>拼图</option><option value="newcomer"${showcase.windowType === 'newcomer' ? ' selected' : ''}>新人滑块商品</option></select>`)}${field(`${showcase.windowType === 'mosaic' ? '拼图' : '新人滑块商品'}配置`, mosaicConfig, 'home-showcase-config-field')}</section>`;
      container.innerHTML = `<div class="style-config-form home-component-form home-showcase-form">${baseInfo}${featureInfo}${window.ConfigurationSections.renderTargeting({ prefix: 'home-showcase', value: showcase.targeting, required: true })}${window.ConfigurationSections.renderTestPlan({ prefix: 'home-showcase', value: showcase.testPlan })}<p>带 * 的字段为必填项。橱窗类型切换后会保留各自已填写的配置内容。</p></div>`;
      return;
    }
    const nameField = component.type === 'search' ? `<label>底纹词<input class="control" id="home-component-label" value="${component.placeholder}" placeholder="请输入搜索底纹词" /></label>` : `<label>组件标题<input class="control" id="home-component-label" value="${component.label}" placeholder="请输入组件标题" /></label>`;
    const subField = ['banner', 'product-flow', 'shortcut'].includes(component.type) ? `<label>辅助文案<input class="control" id="home-component-subtitle" value="${component.subtitle || ''}" placeholder="请输入辅助文案" /></label>` : '';
    container.innerHTML = `<div class="style-config-form home-component-form">${nameField}${subField}<p>修改后会实时同步至中间预览区域。</p></div>`;
  },
  bindHomeBuilder(navigate) {
    const components = [];
    const fixedEntries = [
      { image: '●', darkImage: '', title: '我的红包', enabled: true, jumpType: 'page', pageTarget: '红包中心', linkTarget: '', jumpDescription: '', targeting: { identities: [], targetGroup: '', excludeGroup: '' }, testPlan: { uids: '', start: '', end: '', enabled: false } },
      { image: '▰', darkImage: '', title: '商品收藏', enabled: true, jumpType: 'page', pageTarget: '商品收藏', linkTarget: '', jumpDescription: '', targeting: { identities: [], targetGroup: '', excludeGroup: '' }, testPlan: { uids: '', start: '', end: '', enabled: false } },
      { image: '⌁', darkImage: '', title: '购物车返现', enabled: true, jumpType: 'page', pageTarget: '购物车返现', linkTarget: '', jumpDescription: '', targeting: { identities: [], targetGroup: '', excludeGroup: '' }, testPlan: { uids: '', start: '', end: '', enabled: false } },
      { image: '✓', darkImage: '', title: '领现金', enabled: true, jumpType: 'page', pageTarget: '领现金', linkTarget: '', jumpDescription: '', targeting: { identities: [], targetGroup: '', excludeGroup: '' }, testPlan: { uids: '', start: '', end: '', enabled: false } },
      { image: 'ϟ', darkImage: '', title: '省钱秘籍', enabled: true, jumpType: 'page', pageTarget: '省钱秘籍', linkTarget: '', jumpDescription: '', targeting: { identities: [], targetGroup: '', excludeGroup: '' }, testPlan: { uids: '', start: '', end: '', enabled: false } }
    ];
    const defaultState = this.cloneHomeState({
      components,
      fixedEntries,
      fixedEntriesComponentAdded: true,
      fixedEntriesTargeting: window.ConfigurationSections.createTargeting(),
      fixedEntriesTestPlan: window.ConfigurationSections.createTestPlan(),
      fixedEntriesComponents: [{
        id: 'gold-zone-default',
        entries: fixedEntries,
        targeting: window.ConfigurationSections.createTargeting(),
        testPlan: window.ConfigurationSections.createTestPlan(),
        isSaved: true
      }]
    });
    const storedState = this.loadHomeState(defaultState);
    components.push(...this.cloneHomeState(storedState.components).filter((component) => this.isFunctionZoneComponent(component)).map((component) => ({ ...component, isSaved: component.isSaved ?? true, hasBeenSaved: component.hasBeenSaved ?? true })));
    let activeId = null;
    let activeFixedEntryIndex = null;
    let activeGoldComponentId = null;
    let goldComponents = this.cloneHomeState(storedState.fixedEntriesComponents).map((component) => ({ ...component, isSaved: component.isSaved ?? true, hasBeenSaved: component.hasBeenSaved ?? true }));
    const activeComponent = () => components.find((component) => component.id === activeId);
    const activeGoldComponent = () => goldComponents.find((component) => component.id === activeGoldComponentId);
    const recentScope = 'home-function';
    const currentRecentEdit = () => {
      const goldComponent = activeGoldComponent();
      if (goldComponent) return { id: goldComponent.id, name: `功能金刚区${goldComponents.findIndex((component) => component.id === goldComponent.id) + 1}` };
      const component = activeComponent();
      if (component) return { id: component.id, name: component.type === 'shortcut' ? component.redPacket?.name : component.type === 'search' ? component.showcase?.name : component.recordName || component.label };
      return null;
    };
    const refreshRecentEdits = (recordCurrent = false) => {
      const item = recordCurrent && currentRecentEdit();
      if (item) window.RecentEdits?.record({ scope: recentScope, ...item });
      window.RecentEdits?.render(document.getElementById('marketing-recent-edits'), recentScope, {
        filter: (item) => goldComponents.some((component) => component.id === item.id) || components.some((component) => component.id === item.id),
        onSelect: (item) => {
          if (goldComponents.some((component) => component.id === item.id)) {
            activeGoldComponentId = item.id;
            activeFixedEntryIndex = null;
            activeId = null;
          } else if (components.some((component) => component.id === item.id)) {
            activeId = item.id;
            activeGoldComponentId = null;
            activeFixedEntryIndex = null;
          } else return;
          render();
          requestAnimationFrame(() => {
            const selector = activeGoldComponentId ? `[data-home-gold-component="${activeGoldComponentId}"]` : `[data-home-component-id="${activeId}"]`;
            document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }
      });
    };
    const snapshot = () => ({ components, fixedEntriesComponents: goldComponents });
    const cloneSnapshot = (state) => this.cloneHomeState(state);
    const editSession = window.EditSession.create({
      snapshot,
      clone: cloneSnapshot,
      confirmClose: () => window.BackofficeLayout.confirm({
        title: '确认关闭编辑？',
        message: '当前编辑的内容未保存，是否仍然要关闭',
        confirmText: '仍然关闭',
        cancelText: '继续编辑'
      })
    });
    const guardUnsavedNavigation = (onProceed) => editSession.guardNavigation(onProceed);
    const activatePrimaryTab = (tab) => {
      document.querySelectorAll('[data-marketing-tab]').forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
    };
    const removeActiveComponent = () => {
      if (!editSession.isEditing() || activeFixedEntryIndex !== null) return;
      const goldComponent = activeGoldComponent();
      if (goldComponent) {
        if (goldComponent.hasBeenSaved) return;
        const index = goldComponents.findIndex((item) => item.id === goldComponent.id);
        if (index < 0) return;
        goldComponents.splice(index, 1);
        activeId = null;
        activeFixedEntryIndex = null;
        activeGoldComponentId = null;
        render();
        window.BackofficeLayout.showToast('组件已移除');
        return;
      }
      const component = activeComponent();
      if (!component || component.hasBeenSaved) return;
      const index = components.findIndex((item) => item.id === component.id);
      if (index < 0) return;
      components.splice(index, 1);
      activeId = components[index]?.id || components[index - 1]?.id || null;
      render();
      window.BackofficeLayout.showToast('组件已移除');
    };
    const updateEditState = () => {
      const builder = document.getElementById('home-marketing-builder');
      const pageActions = document.getElementById('marketing-page-actions');
      const componentSave = document.getElementById('save-home-component');
      const componentRemove = document.getElementById('remove-home-component-action');
      const isEditing = editSession.isEditing();
      builder.classList.toggle('is-editing', isEditing);
      pageActions.innerHTML = '<button class="button secondary" id="view-home-configuration-list" type="button">查看配置列表</button>';
      const isFixedEntryEditing = activeFixedEntryIndex !== null && Boolean(activeGoldComponent());
      const activeConfigComponent = activeGoldComponent() || activeComponent();
      const canRemoveNewComponent = isEditing && !isFixedEntryEditing && Boolean(activeConfigComponent) && !activeConfigComponent.hasBeenSaved;
      componentSave.textContent = isEditing ? (isFixedEntryEditing ? '保存展位配置' : '保存组件') : '编辑';
      componentSave.classList.toggle('is-edit-action', !isEditing);
      componentSave.disabled = isEditing && !editSession.hasComponentChanges() && !(activeGoldComponent() && !isFixedEntryEditing && !activeGoldComponent().isSaved);
      const actionCopy = document.getElementById('home-config-action-copy');
      if (actionCopy) actionCopy.hidden = !isFixedEntryEditing;
      if (componentRemove) {
        componentRemove.hidden = !canRemoveNewComponent;
        componentRemove.disabled = !canRemoveNewComponent;
      }
      document.querySelectorAll('[data-home-component-id]').forEach((element) => {
        const component = components.find((item) => item.id === element.dataset.homeComponentId);
        element.classList.toggle('is-unsaved', Boolean(component && !component.isSaved));
      });
      document.querySelectorAll('[data-home-gold-component]').forEach((element) => {
        const component = goldComponents.find((item) => item.id === element.dataset.homeGoldComponent);
        element.classList.toggle('is-unsaved', Boolean(component && !component.isSaved));
      });
      document.querySelectorAll('[data-home-add]').forEach((button) => { button.disabled = !isEditing; });
      document.querySelectorAll('#home-config-content input, #home-config-content select, #home-config-content [data-home-entry-delete], #home-config-content [data-home-red-packet-delete]').forEach((control) => { control.disabled = !isEditing; });
    };
    const render = () => {
      const goldComponent = activeGoldComponent();
      this.renderFixedEntries(goldComponents, activeGoldComponentId, activeFixedEntryIndex);
      this.renderHomePreview(components, activeId);
      this.renderComponentEditor(components, activeId, activeGoldComponentId, goldComponents);
      if (activeFixedEntryIndex !== null && goldComponent) this.renderFixedEntryConfig(goldComponent.entries[activeFixedEntryIndex], activeFixedEntryIndex);
      else if (goldComponent) this.renderFixedEntriesComponentConfig(goldComponent);
      else this.renderHomeConfig(activeComponent());
      updateEditState();
      refreshRecentEdits();
    };
    document.querySelectorAll('[data-marketing-tab]').forEach((tab) => tab.addEventListener('click', () => {
      if (tab.classList.contains('is-active')) return;
      guardUnsavedNavigation(() => {
        activatePrimaryTab(tab);
        this.showPrimaryTabContext(tab.dataset.marketingTab, 'function', navigate);
      });
    }));
    document.querySelector('.marketing-home-subnav')?.addEventListener('click', (event) => {
      const subtab = event.target.closest('[data-marketing-primary-view]');
      if (!subtab) return;
      if (subtab.dataset.marketingPrimaryView === 'home-function') return;
      if (subtab.dataset.marketingPrimaryView === 'home-feed') guardUnsavedNavigation(() => navigate?.('feed-management'));
      const activePrimaryTab = document.querySelector('[data-marketing-tab].is-active');
      if (!activePrimaryTab || activePrimaryTab.dataset.marketingTab === 'home') return;
      const views = {
        'youzi-street-flash-sale': 'flash-sale',
        'benefits-check-in-success': 'check-in-success'
      };
      const view = views[subtab.dataset.marketingPrimaryView] || 'feed';
      if (subtab.classList.contains('is-active')) return;
      guardUnsavedNavigation(() => this.showPrimaryTabContext(activePrimaryTab.dataset.marketingTab, view, navigate));
    });
    document.querySelectorAll('[data-home-add]').forEach((button) => button.addEventListener('click', () => {
      if (!editSession.isEditing()) return;
      if (button.dataset.homeAdd === 'fixed-entries') {
        const component = this.createGoldComponent(fixedEntries);
        goldComponents.push(component);
        activeId = null;
        activeFixedEntryIndex = null;
        activeGoldComponentId = component.id;
        refreshRecentEdits(true);
        render();
        return;
      }
      const component = this.createHomeComponent(button.dataset.homeAdd);
      components.push(component);
      activeId = component.id;
      activeFixedEntryIndex = null;
      activeGoldComponentId = null;
      refreshRecentEdits(true);
      render();
    }));
    document.getElementById('home-fixed-entries').addEventListener('click', (event) => {
      const goldComponent = event.target.closest('[data-home-gold-component]');
      if (!goldComponent) return;
      const entry = event.target.closest('[data-home-fixed-entry]');
      activeFixedEntryIndex = entry ? Number(entry.dataset.homeFixedEntry) : null;
      activeGoldComponentId = goldComponent.dataset.homeGoldComponent;
      activeId = null;
      refreshRecentEdits(true);
      render();
    });
    document.getElementById('home-component-editor').addEventListener('click', (event) => {
      const fixedEntriesButton = event.target.closest('[data-home-editor-gold]');
      const componentButton = event.target.closest('[data-home-editor-component]');
      if (!fixedEntriesButton && !componentButton) return;
      activeFixedEntryIndex = null;
      activeGoldComponentId = fixedEntriesButton?.dataset.homeEditorGold || null;
      activeId = componentButton?.dataset.homeEditorComponent || null;
      refreshRecentEdits(true);
      render();
    });
    document.querySelector('.home-phone-frame').addEventListener('click', (event) => { const component = event.target.closest('[data-home-component-id]'); if (!component) return; activeId = component.dataset.homeComponentId; activeFixedEntryIndex = null; activeGoldComponentId = null; refreshRecentEdits(true); render(); });
    let draggedComponentId = null;
    let draggedToolType = null;
    let draggedGoldComponentId = null;
    const phonePreview = document.querySelector('.home-phone-frame');
    const isSamePreviewZone = (firstId, secondId) => {
      const first = components.find((component) => component.id === firstId);
      const second = components.find((component) => component.id === secondId);
      return Boolean(first && second) && this.isFunctionZoneComponent(first) === this.isFunctionZoneComponent(second);
    };
    const isFixedEntriesArea = (target) => Boolean(target.closest('#home-fixed-entries'));
    const isUnsupportedFixedEntriesDrop = (target) => isFixedEntriesArea(target)
      && ((draggedToolType && draggedToolType !== 'fixed-entries') || Boolean(draggedComponentId));
    document.querySelectorAll('[data-home-add]').forEach((button) => button.addEventListener('dragstart', (event) => {
      if (!editSession.isEditing()) { event.preventDefault(); return; }
      draggedToolType = button.dataset.homeAdd;
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('text/plain', draggedToolType);
      button.classList.add('is-dragging');
    }));
    document.querySelectorAll('[data-home-add]').forEach((button) => button.addEventListener('dragend', () => {
      draggedToolType = null;
      button.classList.remove('is-dragging');
      phonePreview.querySelectorAll('.is-dragover').forEach((element) => element.classList.remove('is-dragover'));
    }));
    phonePreview.addEventListener('dragstart', (event) => {
      if (!editSession.isEditing()) return;
      const goldComponent = event.target.closest('[data-home-gold-component]');
      if (goldComponent) {
        draggedGoldComponentId = goldComponent.dataset.homeGoldComponent;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', `gold-component:${draggedGoldComponentId}`);
        goldComponent.classList.add('is-dragging');
        return;
      }
      const component = event.target.closest('.home-preview-component-sortable');
      if (!component) return;
      draggedComponentId = component.dataset.homeComponentId;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', draggedComponentId);
      component.classList.add('is-dragging');
    });
    phonePreview.addEventListener('dragover', (event) => {
      if (!editSession.isEditing()) return;
      const zone = event.target.closest('[data-home-drop-zone]');
      if (draggedGoldComponentId) {
        const targetGoldComponent = event.target.closest('[data-home-gold-component]');
        if (!targetGoldComponent || targetGoldComponent.dataset.homeGoldComponent === draggedGoldComponentId) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        targetGoldComponent.classList.add('is-dragover');
        return;
      }
      if (isUnsupportedFixedEntriesDrop(event.target)) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'none';
        return;
      }
      if (draggedToolType === 'fixed-entries') {
        if (!zone || zone.dataset.homeDropZone !== 'fixed-entries') return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        zone.classList.add('is-dragover');
        return;
      }
      if (draggedToolType && zone) {
        const isFunctionComponent = this.isFunctionZoneComponent({ type: draggedToolType });
        if ((zone.dataset.homeDropZone === 'function') !== isFunctionComponent) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        zone.classList.add('is-dragover');
        return;
      }
      if (!draggedComponentId) return;
      const target = event.target.closest('.home-preview-component-sortable');
      if (target && target.dataset.homeComponentId !== draggedComponentId && isSamePreviewZone(draggedComponentId, target.dataset.homeComponentId)) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        target.classList.add('is-dragover');
        return;
      }
      if (zone) {
        const source = components.find((component) => component.id === draggedComponentId);
        const isCompatibleZone = source && ((this.isFunctionZoneComponent(source) && zone.dataset.homeDropZone === 'function') || (!this.isFunctionZoneComponent(source) && zone.dataset.homeDropZone === 'feed'));
        if (!isCompatibleZone) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        zone.classList.add('is-dragover');
        return;
      }
    });
    phonePreview.addEventListener('dragleave', (event) => {
      const highlighted = event.target.closest('.home-preview-component-sortable, [data-home-gold-component], [data-home-drop-zone]');
      if (!highlighted || highlighted.contains(event.relatedTarget)) return;
      highlighted.classList.remove('is-dragover');
    });
    phonePreview.addEventListener('drop', (event) => {
      if (!editSession.isEditing()) return;
      const zone = event.target.closest('[data-home-drop-zone]');
      if (draggedGoldComponentId) {
        const targetGoldComponent = event.target.closest('[data-home-gold-component]');
        if (!targetGoldComponent) return;
        const sourceIndex = goldComponents.findIndex((component) => component.id === draggedGoldComponentId);
        const targetIndex = goldComponents.findIndex((component) => component.id === targetGoldComponent.dataset.homeGoldComponent);
        if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;
        event.preventDefault();
        const [component] = goldComponents.splice(sourceIndex, 1);
        const insertIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
        goldComponents.splice(insertIndex, 0, component);
        component.isSaved = false;
        activeId = null;
        activeFixedEntryIndex = null;
        activeGoldComponentId = component.id;
        draggedGoldComponentId = null;
        render();
        return;
      }
      if (isUnsupportedFixedEntriesDrop(event.target)) {
        event.preventDefault();
        window.BackofficeLayout.showToast('当前位置仅支持功能金刚区组件');
        draggedComponentId = null;
        draggedToolType = null;
        phonePreview.querySelectorAll('.is-dragover').forEach((element) => element.classList.remove('is-dragover'));
        return;
      }
      if (draggedToolType === 'fixed-entries') {
        if (!zone || zone.dataset.homeDropZone !== 'fixed-entries') return;
        event.preventDefault();
        const component = this.createGoldComponent(fixedEntries);
        goldComponents.push(component);
        activeId = null;
        activeFixedEntryIndex = null;
        activeGoldComponentId = component.id;
        draggedToolType = null;
        refreshRecentEdits(true);
        render();
        return;
      }
      if (draggedToolType && zone) {
        const isFunctionComponent = this.isFunctionZoneComponent({ type: draggedToolType });
        if ((zone.dataset.homeDropZone === 'function') !== isFunctionComponent) return;
        event.preventDefault();
        const component = this.createHomeComponent(draggedToolType);
        if (isFunctionComponent) component.functionSlot = zone.dataset.homeFunctionSlot || 'after-notification';
        components.push(component);
        activeId = component.id;
        activeFixedEntryIndex = null;
        activeGoldComponentId = null;
        draggedToolType = null;
        refreshRecentEdits(true);
        render();
        return;
      }
      if (!draggedComponentId) return;
      const target = event.target.closest('.home-preview-component-sortable');
      if (target && target.dataset.homeComponentId !== draggedComponentId && isSamePreviewZone(draggedComponentId, target.dataset.homeComponentId)) {
        event.preventDefault();
        const sourceIndex = components.findIndex((component) => component.id === draggedComponentId);
        const targetIndex = components.findIndex((component) => component.id === target.dataset.homeComponentId);
        if (sourceIndex < 0 || targetIndex < 0) return;
        const targetComponent = components[targetIndex];
        const [component] = components.splice(sourceIndex, 1);
        if (this.isFunctionZoneComponent(component)) component.functionSlot = targetComponent.functionSlot || component.functionSlot;
        components.splice(sourceIndex < targetIndex ? targetIndex - 1 : targetIndex, 0, component);
        component.isSaved = false;
        activeId = component.id;
        activeFixedEntryIndex = null;
        activeGoldComponentId = null;
        draggedComponentId = null;
        render();
        return;
      }
      if (!target) {
        const source = components.find((component) => component.id === draggedComponentId);
        if (!zone || !source || ((this.isFunctionZoneComponent(source) && zone.dataset.homeDropZone !== 'function') || (!this.isFunctionZoneComponent(source) && zone.dataset.homeDropZone !== 'feed'))) return;
        event.preventDefault();
        if (this.isFunctionZoneComponent(source)) source.functionSlot = zone.dataset.homeFunctionSlot || source.functionSlot;
        source.isSaved = false;
        activeId = source.id;
        activeFixedEntryIndex = null;
        activeGoldComponentId = null;
        draggedComponentId = null;
        render();
        return;
      }
    });
    phonePreview.addEventListener('dragend', () => {
      draggedComponentId = null;
      draggedToolType = null;
      draggedGoldComponentId = null;
      phonePreview.querySelectorAll('.is-dragging, .is-dragover').forEach((element) => element.classList.remove('is-dragging', 'is-dragover'));
    });
    document.getElementById('home-config-content').addEventListener('input', (event) => {
      if (!editSession.isEditing()) return;
      const goldComponent = activeGoldComponent();
      if (activeFixedEntryIndex !== null) {
        if (!goldComponent) return;
        goldComponent.isSaved = false;
        const entry = goldComponent.entries[activeFixedEntryIndex];
        if (event.target.id === 'home-fixed-entry-title') {
          entry.title = event.target.value.slice(0, 5);
          if (event.target.value !== entry.title) event.target.value = entry.title;
        }
        if (event.target.id === 'home-fixed-entry-jump-target') entry[entry.jumpType === 'link' ? 'linkTarget' : 'pageTarget'] = event.target.value;
        if (event.target.id === 'home-fixed-entry-jump-description') entry.jumpDescription = event.target.value;
        this.renderFixedEntries(goldComponents, activeGoldComponentId, activeFixedEntryIndex);
        updateEditState();
        return;
      }
      if (goldComponent && event.target.dataset.homeFixedEntriesTargetingField) {
        goldComponent.targeting[event.target.dataset.homeFixedEntriesTargetingField] = event.target.value;
        goldComponent.isSaved = false;
        updateEditState();
        return;
      }
      if (goldComponent && event.target.dataset.homeFixedEntriesTest) {
        goldComponent.testPlan[event.target.dataset.homeFixedEntriesTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        goldComponent.isSaved = false;
        updateEditState();
        return;
      }
      const component = activeComponent();
      if (!component) return;
      component.isSaved = false;
      if (component.type === 'search' && event.target.dataset.homeShowcaseBase) {
        component.showcase[event.target.dataset.homeShowcaseBase] = event.target.value;
        updateEditState();
        return;
      }
      if (component.type === 'search' && event.target.dataset.homeShowcaseField) {
        const config = component.showcase[component.showcase.windowType];
        config[event.target.dataset.homeShowcaseField] = event.target.value;
        updateEditState();
        return;
      }
      if (component.type === 'search' && event.target.dataset.homeShowcaseTest) {
        component.showcase.testPlan[event.target.dataset.homeShowcaseTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        updateEditState();
        return;
      }
      if (component.type === 'search' && event.target.dataset.homeShowcaseTargetingField) {
        component.showcase.targeting[event.target.dataset.homeShowcaseTargetingField] = event.target.value;
        updateEditState();
        return;
      }
      if (component.type === 'shortcut' && event.target.dataset.homeRedPacketField) {
        component.redPacket[event.target.dataset.homeRedPacketField] = event.target.value;
        updateEditState();
        return;
      }
      if (component.type === 'shortcut' && event.target.dataset.homeRedPacketTest) {
        component.redPacket.testPlan[event.target.dataset.homeRedPacketTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        updateEditState();
        return;
      }
      if (component.type === 'shortcut' && event.target.dataset.homeRedPacketTargetingField) {
        component.redPacket.targeting[event.target.dataset.homeRedPacketTargetingField] = event.target.value;
        updateEditState();
        return;
      }
      if (event.target.id === 'home-component-label') {
        if (component.type === 'search') component.placeholder = event.target.value;
        else component.label = event.target.value;
      }
      if (event.target.id === 'home-component-subtitle') component.subtitle = event.target.value;
      this.renderHomePreview(components, activeId);
      updateEditState();
    });
    document.getElementById('home-config-content').addEventListener('change', async (event) => {
      const component = activeComponent();
      const goldComponent = activeGoldComponent();
      if (!editSession.isEditing()) return;
      if (component?.type === 'search') {
        component.isSaved = false;
        const showcase = component.showcase;
        const config = showcase[showcase.windowType];
        if (event.target.matches('[data-home-showcase-image]')) {
          const file = event.target.files?.[0];
          if (!file) return;
          const field = event.target.dataset.homeShowcaseImage;
          this.clearObjectUrl(config[field]);
          config[field] = await this.readImageFile(file);
        }
        if (event.target.matches('[data-home-showcase-window-type]')) showcase.windowType = event.target.value;
        if (event.target.matches('[data-home-showcase-field]')) config[event.target.dataset.homeShowcaseField] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        if (event.target.matches('[data-home-showcase-identity]')) showcase.targeting.identities = [...document.querySelectorAll('[data-home-showcase-identity]:checked')].map((input) => input.value);
        if (event.target.matches('[data-home-showcase-audience]')) showcase.targeting.audiences = [...document.querySelectorAll('[data-home-showcase-audience]:checked')].map((input) => input.value);
        if (event.target.name === 'home-showcase-audience-inversion') showcase.targeting.audienceInversion = event.target.value;
        if (event.target.name === 'home-showcase-status') showcase.targeting.status = event.target.value;
        if (event.target.matches('[data-home-showcase-platform]')) showcase.targeting.platformVersions[event.target.dataset.homeShowcasePlatform].enabled = event.target.checked;
        if (event.target.matches('[data-home-showcase-version]')) { const [platform, edge] = event.target.dataset.homeShowcaseVersion.split(':'); showcase.targeting.platformVersions[platform][edge] = event.target.value; }
        if (event.target.matches('[data-home-showcase-test]')) showcase.testPlan[event.target.dataset.homeShowcaseTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        if (event.target.dataset.homeShowcaseTargetingField) showcase.targeting[event.target.dataset.homeShowcaseTargetingField] = event.target.value;
        render();
        return;
      }
      if (component?.type === 'shortcut') {
        component.isSaved = false;
        const redPacket = component.redPacket;
        if (event.target.matches('[data-home-red-packet-image]')) {
          const file = event.target.files?.[0];
          if (!file) return;
          const field = event.target.dataset.homeRedPacketImage;
          this.clearObjectUrl(redPacket[field]);
          redPacket[field] = await this.readImageFile(file);
        }
        if (event.target.name === 'home-red-packet-delivery') redPacket.deliveryType = event.target.value;
        if (event.target.name === 'home-red-packet-template') redPacket.template = event.target.value;
        if (event.target.matches('[data-home-red-packet-title-area]')) redPacket.titleArea = event.target.checked;
        if (event.target.matches('[data-home-red-packet-identity]')) redPacket.targeting.identities = [...document.querySelectorAll('[data-home-red-packet-identity]:checked')].map((input) => input.value);
        if (event.target.matches('[data-home-red-packet-audience]')) redPacket.targeting.audiences = [...document.querySelectorAll('[data-home-red-packet-audience]:checked')].map((input) => input.value);
        if (event.target.name === 'home-red-packet-audience-inversion') redPacket.targeting.audienceInversion = event.target.value;
        if (event.target.name === 'home-red-packet-status') redPacket.targeting.status = event.target.value;
        if (event.target.matches('[data-home-red-packet-platform]')) redPacket.targeting.platformVersions[event.target.dataset.homeRedPacketPlatform].enabled = event.target.checked;
        if (event.target.matches('[data-home-red-packet-version]')) { const [platform, edge] = event.target.dataset.homeRedPacketVersion.split(':'); redPacket.targeting.platformVersions[platform][edge] = event.target.value; }
        if (event.target.matches('[data-home-red-packet-test]')) redPacket.testPlan[event.target.dataset.homeRedPacketTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        if (event.target.dataset.homeRedPacketTargetingField) redPacket.targeting[event.target.dataset.homeRedPacketTargetingField] = event.target.value;
        render();
        return;
      }
      if (event.target.id === 'home-fixed-entry-jump-type' && activeFixedEntryIndex !== null) {
        goldComponent.entries[activeFixedEntryIndex].jumpType = event.target.value;
        goldComponent.isSaved = false;
        render();
        return;
      }
      if (event.target.id === 'home-fixed-entry-jump-target' && activeFixedEntryIndex !== null) {
        const entry = goldComponent.entries[activeFixedEntryIndex];
        entry[entry.jumpType === 'link' ? 'linkTarget' : 'pageTarget'] = event.target.value;
        goldComponent.isSaved = false;
        render();
        return;
      }
      if (goldComponent && event.target.matches('[data-home-fixed-entries-identity]')) {
        goldComponent.targeting.identities = [...document.querySelectorAll('[data-home-fixed-entries-identity]:checked')].map((input) => input.value);
        goldComponent.isSaved = false;
        updateEditState();
        return;
      }
      if (goldComponent && event.target.matches('[data-home-fixed-entries-audience]')) {
        goldComponent.targeting.audiences = [...document.querySelectorAll('[data-home-fixed-entries-audience]:checked')].map((input) => input.value);
        goldComponent.isSaved = false;
        updateEditState();
        return;
      }
      if (goldComponent && event.target.name === 'home-fixed-entries-audience-inversion') {
        goldComponent.targeting.audienceInversion = event.target.value;
        goldComponent.isSaved = false;
        render();
        return;
      }
      if (goldComponent && event.target.name === 'home-fixed-entries-status') {
        goldComponent.targeting.status = event.target.value;
        goldComponent.isSaved = false;
        render();
        return;
      }
      if (goldComponent && event.target.matches('[data-home-fixed-entries-platform]')) {
        goldComponent.targeting.platformVersions[event.target.dataset.homeFixedEntriesPlatform].enabled = event.target.checked;
        goldComponent.isSaved = false;
        render();
        return;
      }
      if (goldComponent && event.target.matches('[data-home-fixed-entries-version]')) {
        const [platform, edge] = event.target.dataset.homeFixedEntriesVersion.split(':');
        goldComponent.targeting.platformVersions[platform][edge] = event.target.value;
        goldComponent.isSaved = false;
        render();
        return;
      }
      if (goldComponent && event.target.matches('[data-home-fixed-entries-test]')) {
        goldComponent.testPlan[event.target.dataset.homeFixedEntriesTest] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        goldComponent.isSaved = false;
        render();
        return;
      }
      if (activeFixedEntryIndex === null || !['home-fixed-entry-image', 'home-fixed-entry-dark-image'].includes(event.target.id)) return;
      const file = event.target.files?.[0];
      if (!file) return;
      const entry = goldComponent.entries[activeFixedEntryIndex];
      const field = event.target.id === 'home-fixed-entry-image' ? 'image' : 'darkImage';
      this.clearObjectUrl(entry[field]);
      entry[field] = await this.readImageFile(file);
      goldComponent.isSaved = false;
      render();
    });
    document.getElementById('home-config-content').addEventListener('click', async (event) => {
      if (!editSession.isEditing()) return;
      const component = activeComponent();
      const deleteShowcaseImage = event.target.closest('[data-home-showcase-delete]');
      if (deleteShowcaseImage && component?.type === 'search') {
        const config = component.showcase[component.showcase.windowType];
        const field = deleteShowcaseImage.dataset.homeShowcaseDelete;
        this.clearObjectUrl(config[field]);
        config[field] = '';
        component.isSaved = false;
        render();
        return;
      }
      const deleteRedPacketImage = event.target.closest('[data-home-red-packet-delete]');
      if (deleteRedPacketImage && component?.type === 'shortcut') {
        const field = deleteRedPacketImage.dataset.homeRedPacketDelete;
        this.clearObjectUrl(component.redPacket[field]);
        component.redPacket[field] = '';
        component.isSaved = false;
        render();
        return;
      }
      const deleteAsset = event.target.closest('[data-home-entry-delete]');
      if (deleteAsset && activeFixedEntryIndex !== null) {
        const entry = activeGoldComponent()?.entries[activeFixedEntryIndex];
        if (!entry) return;
        const field = deleteAsset.dataset.homeEntryDelete === 'home-fixed-entry-image' ? 'image' : 'darkImage';
        this.clearObjectUrl(entry[field]);
        entry[field] = '';
        const goldComponent = activeGoldComponent();
        if (goldComponent) goldComponent.isSaved = false;
        render();
        return;
      }
    });
    document.getElementById('remove-home-component-action').addEventListener('click', removeActiveComponent);
    document.getElementById('save-home-component').addEventListener('click', () => {
      if (!editSession.isEditing()) {
        editSession.startEditing();
        refreshRecentEdits(true);
        updateEditState();
        return;
      }
      const goldComponent = activeGoldComponent();
      const isFixedEntryEditing = activeFixedEntryIndex !== null && Boolean(goldComponent);
      if (isFixedEntryEditing) {
        const entry = goldComponent.entries[activeFixedEntryIndex];
        const target = entry?.jumpType === 'link' ? entry.linkTarget : entry?.pageTarget;
        if (!entry?.image || !entry.title.trim() || !entry.jumpType || !target?.trim() || (entry.jumpType === 'link' && !entry.jumpDescription?.trim())) {
          window.BackofficeLayout.showToast('请完善必填项', '请补充当前展位的素材、标题和跳转信息');
          return;
        }
        goldComponent.isSaved = false;
        editSession.markComponentSaved();
        refreshRecentEdits(true);
        updateEditState();
        window.BackofficeLayout.showToast('展位配置已保存', '请点击功能金刚区组件，完成组件整体保存');
        return;
      }
      if (!editSession.hasComponentChanges() && !(goldComponent && !goldComponent.isSaved)) return;
      const invalidGoldComponent = goldComponents.find((goldComponent) => goldComponent.entries.some((entry) => !entry.image || !entry.title.trim() || !entry.jumpType || !(entry.jumpType === 'link' ? entry.linkTarget : entry.pageTarget)?.trim() || (entry.jumpType === 'link' && !entry.jumpDescription?.trim())));
      if (invalidGoldComponent) {
        window.BackofficeLayout.showToast('请完善必填项', '请为每个固定入口补充素材、标题和跳转信息');
        return;
      }
      const invalidRedPacket = components.find((component) => {
        if (component.type !== 'shortcut') return false;
        const redPacket = component.redPacket || {};
        const platforms = Object.values(redPacket.targeting?.platformVersions || {});
        const hasPlatformVersion = platforms.some((platform) => platform.enabled && platform.start?.trim());
        return !redPacket.name?.trim() || !redPacket.deliveryType || !hasPlatformVersion || !redPacket.targeting?.onlineStart || !redPacket.targeting?.onlineEnd || (redPacket.deliveryType === 'package' && (!redPacket.unclaimedImage || !redPacket.template));
      });
      if (invalidRedPacket) {
        window.BackofficeLayout.showToast('请完善必填项', '请补充红包发放功能的记录名称、发放类型、平台版本与上线时间；券包发放还需上传未领取图片素材并选择红包模板');
        return;
      }
      const invalidShowcase = components.find((component) => {
        if (component.type !== 'search') return false;
        const showcase = component.showcase || {};
        const platforms = Object.values(showcase.targeting?.platformVersions || {});
        const hasPlatformVersion = platforms.some((platform) => platform.enabled && platform.start?.trim());
        return !showcase.name?.trim() || !showcase.windowType || !hasPlatformVersion || !showcase.targeting?.onlineStart || !showcase.targeting?.onlineEnd;
      });
      if (invalidShowcase) {
        window.BackofficeLayout.showToast('请完善必填项', '请补充橱窗功能的记录名称、橱窗类型、平台版本与上线时间');
        return;
      }
      components.forEach((component) => { component.isSaved = true; component.hasBeenSaved = true; });
      goldComponents.forEach((component) => { component.isSaved = true; component.hasBeenSaved = true; });
      const nextState = cloneSnapshot(snapshot());
      try {
        this.saveHomeState(nextState);
      } catch (error) {
        window.BackofficeLayout.showToast('组件保存失败', '本地演示数据无法保存，请减少图片素材后重试');
        return;
      }
      editSession.finishComponentEditing(nextState);
      refreshRecentEdits(true);
      updateEditState();
      window.BackofficeLayout.showToast('组件已保存', '首页功能区营销已更新');
    });
    document.getElementById('marketing-page-actions').addEventListener('click', (event) => {
      const action = event.target.closest('button');
      if (!action) return;
      if (action.id === 'view-home-configuration-list') {
        const existing = document.getElementById('home-configuration-list-modal');
        existing?.remove();
        const modal = document.createElement('div');
        modal.className = 'modal is-editor-fullscreen home-configuration-list-modal';
        modal.id = 'home-configuration-list-modal';
        modal.innerHTML = this.renderHomeConfigurationList(editSession.getPageSavedState());
        const close = () => modal.remove();
        modal.addEventListener('click', (modalEvent) => {
          if (modalEvent.target === modal || modalEvent.target.closest('[data-close-home-configuration-list]')) close();
          const edit = modalEvent.target.closest('[data-edit-home-configuration]');
          if (!edit) return;
          const targetId = edit.dataset.editHomeConfiguration;
          if (edit.dataset.editHomeConfigurationKind === 'gold') {
            activeGoldComponentId = targetId;
            activeId = null;
          } else {
            activeId = targetId;
            activeGoldComponentId = null;
          }
          activeFixedEntryIndex = null;
          editSession.startEditing();
          close();
          render();
          const previewTarget = edit.dataset.editHomeConfigurationKind === 'gold'
            ? document.querySelector(`[data-home-gold-component="${targetId}"]`)
            : document.querySelector(`[data-home-component-id="${targetId}"]`);
          previewTarget?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          document.querySelector('.home-marketing-settings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        document.body.append(modal);
        modal.querySelector('[data-close-home-configuration-list]')?.focus();
        return;
      }
    });
    render();
  },
  bind({ navigate, homeView = 'function' } = {}) {
    if (homeView === 'feed') {
      const feedSession = window.FeedManagementPage?.bindEmbedded?.();
      if (!feedSession) {
        window.BackofficeLayout.showToast?.('信息流编辑框架未加载', '请刷新页面后重试');
      }
      const guardNavigation = (destination) => feedSession?.guardNavigation?.(destination) || destination();
      document.querySelectorAll('[data-marketing-tab]').forEach((tab) => tab.addEventListener('click', () => {
        guardNavigation(() => {
        document.querySelectorAll('[data-marketing-tab]').forEach((item) => {
          const active = item === tab;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-selected', String(active));
        });
        this.showPrimaryTabContext(tab.dataset.marketingTab, 'feed', navigate);
        });
      }));
      document.querySelector('.marketing-home-subnav')?.addEventListener('click', (event) => {
        const subtab = event.target.closest('[data-marketing-primary-view]');
        if (!subtab) return;
        guardNavigation(() => {
          if (subtab.dataset.marketingPrimaryView === 'home-function') { navigate?.('marketing-config'); return; }
          if (subtab.dataset.marketingPrimaryView === 'home-feed') { navigate?.('feed-management'); return; }
          const activePrimaryTab = document.querySelector('[data-marketing-tab].is-active');
          if (!activePrimaryTab || activePrimaryTab.dataset.marketingTab === 'home' || subtab.classList.contains('is-active')) return;
          const views = {
            'youzi-street-flash-sale': 'flash-sale',
            'benefits-check-in-success': 'check-in-success'
          };
          const view = views[subtab.dataset.marketingPrimaryView] || 'feed';
          this.showPrimaryTabContext(activePrimaryTab.dataset.marketingTab, view, navigate);
        });
      });
      return;
    }
    this.bindHomeBuilder(navigate);
  }
};
