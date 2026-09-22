window.ConfigurationSections = {
  identities: ['经期', '怀孕', '备孕', '辣妈', '亲友'],
  targetPages: [
    '首页',
    '福利页Tab',
    '柚子街Tab',
    '我Tab',
    '搜索中间页',
    '站内信列表',
    '钱包页',
    '累计已省页',
    '订单列表页',
    '全部商城页',
    '收藏页',
    '足迹页',
    '金豆页',
    '专享礼金页',
    '红包列表页'
  ],
  audienceGroups: [
    { title: '常用人群', items: ['高活跃用户', '新注册用户', '近30日下单用户', '价格敏感用户'] },
    { title: '活动人群', items: ['大促活动用户', '会员活动用户', '内容活动用户', '召回活动用户'] },
    { title: '临时人群', items: ['运营临时圈选人群', '合作商专属用户', '白名单用户', '灰度验证用户'] }
  ],
  createTargeting() {
    return {
      identities: [], targetGroup: '', excludeGroup: '', audiences: [], audienceInversion: '否', experimentId: '', excludeExperiment: '',
      platformVersions: {
        ios: { enabled: true, start: '8.96.0.0', end: '' },
        android: { enabled: true, start: '8.96.0.0', end: '' },
        harmony: { enabled: true, start: '8.99.0.0', end: '' }
      },
      onlineStart: '', onlineEnd: '', status: '上线'
    };
  },
  createTestPlan() {
    return { uids: '', start: '', end: '', enabled: false };
  },
  normalizeTargeting(value = {}) {
    const defaults = this.createTargeting();
    return {
      ...defaults,
      ...value,
      identities: (Array.isArray(value.identities) ? value.identities : []).filter((identity) => this.identities.includes(identity)),
      audiences: Array.isArray(value.audiences) ? value.audiences : [],
      platformVersions: Object.fromEntries(Object.entries(defaults.platformVersions).map(([key, platform]) => [key, { ...platform, ...(value.platformVersions?.[key] || {}) }]))
    };
  },
  normalizeTestPlan(value = {}) {
    return { ...this.createTestPlan(), ...(value && typeof value === 'object' ? value : {}) };
  },
  validateTestPlan(value = {}) {
    const testPlan = this.normalizeTestPlan(value);
    if (!testPlan.enabled) return '';

    if (!String(testPlan.uids || '').trim()) return '启用测试状态后请填写测试 UID';
    if (!testPlan.start || !testPlan.end) return '启用测试状态后请填写测试时间';
    if (new Date(testPlan.start).getTime() >= new Date(testPlan.end).getTime()) return '测试结束时间需晚于开始时间';

    return '';
  },
  createRoute(value = {}) {
    return { type: 'protocol', targetPage: '', protocol: '', pid: '', selectedPid: '', skipType: '', description: '', ...(value && typeof value === 'object' ? value : {}) };
  },
  renderRouteConfig({ prefix, route = {}, targetPages = this.targetPages, field = null, extraProtocol = '', bindingAttribute = '', fieldMap = {} } = {}) {
    const value = this.createRoute(route);
    const escape = (input) => String(input ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
    const renderField = field || ((label, control, className = '') => `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`);
    const required = '<b class="field-required">*</b>';
    const bind = (key, fallbackName) => {
      const name = fieldMap[key] || fallbackName;
      return `${bindingAttribute ? `${bindingAttribute}="${name}" ` : ''}name="${name}"`;
    };
    return `${renderField(`${required}跳转类型`, `<select class="control" ${bind('type', 'routeType')} data-${prefix}-route-type><option value="page"${value.type === 'page' ? ' selected' : ''}>页面跳转</option><option value="protocol"${value.type === 'protocol' ? ' selected' : ''}>自定义地址/协议</option></select>`)}<div class="shared-route-config" data-${prefix}-route-page${value.type === 'page' ? '' : ' hidden'}>${renderField(`${required}目标页面`, `<select class="control" ${bind('targetPage', 'routeTargetPage')}><option value="">请选择目标页面</option>${targetPages.map((item) => `<option value="${escape(item)}"${value.targetPage === item ? ' selected' : ''}>${escape(item)}</option>`).join('')}</select>`)}</div><div class="shared-route-config" data-${prefix}-route-protocol${value.type === 'protocol' ? '' : ' hidden'}><div class="shared-route-heading"><span>跳转类型：</span><button class="shared-route-example" type="button" data-tooltip="请按路由协议规范填写跳转地址。">路由协议填写示例</button></div>${renderField('路由协议', `<input class="control" ${bind('protocol', 'routeProtocol')} value="${escape(value.protocol)}" placeholder="请输入路由协议" />`)}${renderField('PID <button class="help-tooltip" type="button" aria-label="PID说明" data-tooltip="用于商城埋点上报的 PID 配置。">?</button>', `<input class="control" ${bind('pid', 'routePid')} value="${escape(value.pid)}" placeholder="pid（除京东&拼多多&抖音&1688，其余商城用于埋点上报）" />`)}${renderField('PID选择 <button class="help-tooltip" type="button" aria-label="PID选择说明" data-tooltip="京东、拼多多、抖音和1688根据填写的 pid 进行转链跟单。">?</button>', `<select class="control" ${bind('selectedPid', 'routeSelectedPid')}><option value="">请选择pid</option><option value="default"${value.selectedPid === 'default' ? ' selected' : ''}>默认pid</option><option value="custom"${value.selectedPid === 'custom' ? ' selected' : ''}>自定义pid</option></select>`)}${renderField('skip_type <button class="help-tooltip" type="button" aria-label="skip_type说明" data-tooltip="自定义地址或协议跳转时用于埋点上报。">?</button>', `<input class="control" ${bind('skipType', 'routeSkipType')} value="${escape(value.skipType)}" placeholder="skip_type（用于埋点上报）" />`)}${renderField(`${required}地址/协议说明`, `<input class="control" ${bind('description', 'routeDescription')} value="${escape(value.description)}" maxlength="100" placeholder="请输入地址/协议说明" />`)}${extraProtocol}</div>`;
  },
  bindRouteConfig(root, prefix) {
    if (!root) return;
    const routeType = root.querySelector(`[data-${prefix}-route-type]`);
    if (!routeType || routeType.dataset.routeConfigBound) return;
    routeType.dataset.routeConfigBound = 'true';
    routeType.addEventListener('change', (event) => {
      const isProtocol = event.target.value === 'protocol';
      root.querySelector(`[data-${prefix}-route-page]`)?.toggleAttribute('hidden', isProtocol);
      root.querySelector(`[data-${prefix}-route-protocol]`)?.toggleAttribute('hidden', !isProtocol);
    });
  },
  readRoute(form) {
    const data = new FormData(form);
    return { type: String(data.get('routeType') || ''), targetPage: String(data.get('routeTargetPage') || '').trim(), protocol: String(data.get('routeProtocol') || '').trim(), pid: String(data.get('routePid') || '').trim(), selectedPid: String(data.get('routeSelectedPid') || ''), skipType: String(data.get('routeSkipType') || '').trim(), description: String(data.get('routeDescription') || '').trim() };
  },
  validateRoute(route = {}) {
    return (route.type === 'page' && !route.targetPage) || (route.type === 'protocol' && (!route.protocol || !route.description));
  },
  renderAudienceGroups({ attribute, selected = [], groups = this.audienceGroups } = {}) {
    return groups.map(({ title, items }) => `<div class="audience-group config-audience-group"><div class="audience-group-title">${title}</div><div class="audience-group-items">${items.map((item) => `<label><input type="checkbox" value="${item}" ${attribute}${selected.includes(item) ? ' checked' : ''} /><span>${item}</span></label>`).join('')}</div></div>`).join('');
  },
  renderIdentityOptions({ attribute, selected = [], items = this.identities } = {}) {
    return items.map((item) => `<label><input type="checkbox" value="${item}" ${attribute}${selected.includes(item) ? ' checked' : ''} />${item}</label>`).join('');
  },
  renderMerchantTargeting() {
    const platformRow = (key, label) => `<div><label><input type="checkbox" data-platform-enabled="${key}" />${label}</label><input class="control version-control" data-platform-start="${key}" placeholder="最低版本" /><span>至</span><input class="control version-control" data-platform-end="${key}" placeholder="最高版本（选填）" /></div>`;
    return `<section class="form-section"><h2 class="section-title">定向信息</h2><div class="section-body targeting-body">
      <div class="form-row check-row"><label>用户身份：</label><div class="form-control-area">${this.renderIdentityOptions({ attribute: 'data-target-identity' })}</div></div>
      <div class="form-row"><label for="merchant-target-group">指定人群包：</label><div class="form-control-area"><input class="control compact-control" id="merchant-target-group" placeholder="请输入指定人群包ID或名称" /></div></div>
      <div class="form-row"><label for="merchant-exclude-group">排除人群包：</label><div class="form-control-area"><input class="control compact-control" id="merchant-exclude-group" placeholder="请输入排除人群包ID或名称" /></div></div>
      <div class="form-row audience-row"><label>定制人群：</label><div class="form-control-area audience-options-wrap"><div class="audience-options config-audience-options">${this.renderAudienceGroups({ attribute: 'data-target-audience' })}</div></div></div>
      <div class="form-row audience-inversion-row"><label>是否定制人群取反：</label><div class="form-control-area inline-radios"><label><input type="radio" name="merchant-audience-inversion" value="否" checked />否</label><label><input type="radio" name="merchant-audience-inversion" value="是" />是</label><p class="form-warning">选择定制人群后，取反表示圈定人群以外的用户。</p></div></div>
      <div class="form-row version-grid"><label>平台和版本：</label><div class="form-control-area">${platformRow('ios', 'iOS')}${platformRow('android', 'Android')}${platformRow('harmony', 'Harmony')}</div></div>
      <div class="form-row date-range"><label for="merchant-online-start">启用时间：</label><div class="form-control-area"><input class="control" id="merchant-online-start" type="datetime-local" /><span>至</span><input class="control" id="merchant-online-end" type="datetime-local" /></div></div>
    </div></section>`;
  },
  renderMerchantTestPlan() {
    return `<section class="form-section"><h2 class="section-title">测试计划</h2><div class="section-body test-plan-body"><p class="test-plan-notice">测试 UID 内的用户将在测试有效时间内看到此合作商配置，到期自动终止。</p><div class="form-row"><label for="merchant-test-uids">测试 UID：</label><div class="form-control-area"><input class="control compact-control" id="merchant-test-uids" placeholder="多个 UID 用英文逗号分隔" /></div></div><div class="form-row date-range"><label for="merchant-test-start">测试时间：</label><div class="form-control-area"><input class="control" id="merchant-test-start" type="datetime-local" /><span>至</span><input class="control" id="merchant-test-end" type="datetime-local" /></div></div><div class="form-row check-row"><label>测试状态：</label><div class="form-control-area"><label class="switch"><input id="merchant-test-enabled" type="checkbox" checked /><span class="switch-track"></span></label><span class="status-badge" id="merchant-test-status">生效</span></div></div></div></section>`;
  },
  renderTargeting({ prefix, value = {}, includePlatform = true, includeSchedule = true, required = false, title = '定向信息（投放设置）', identityLabel = '用户身份', identityOptions = this.identities, audienceGroups = this.audienceGroups, audienceInversionHint = '', statusOptions = ['上线', '下线'] } = {}) {
    const targeting = this.normalizeTargeting(value);
    const requiredMark = required ? '<b class="field-required">*</b>' : '';
    const field = (label, control, className = '') => `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    const platformRow = (key, label) => `<div class="config-platform-row"><label><input type="checkbox" data-${prefix}-platform="${key}"${targeting.platformVersions[key].enabled ? ' checked' : ''} />${label}</label><input class="control" data-${prefix}-version="${key}:start" value="${targeting.platformVersions[key].start}" placeholder="最低版本" /><span>至</span><input class="control" data-${prefix}-version="${key}:end" value="${targeting.platformVersions[key].end}" placeholder="最高版本（选填）" /></div>`;
    return `<section class="home-entry-info-section shared-config-section"><h3>${title}</h3>
      <div class="shared-targeting-subsection"><h4>人群信息</h4>
        ${field(identityLabel, `<span class="home-identity-options">${this.renderIdentityOptions({ attribute: `data-${prefix}-identity`, selected: targeting.identities, items: identityOptions })}</span>`)}
        ${field('指定人群包', `<input class="control" data-${prefix}-targeting-field="targetGroup" value="${targeting.targetGroup}" placeholder="填入表名，不填默认全部用户" />`)}
        ${field('排除人群包', `<input class="control" data-${prefix}-targeting-field="excludeGroup" value="${targeting.excludeGroup}" placeholder="填入表名，不填默认为空" />`)}
        ${field('定制人群', `<div class="audience-options config-audience-options">${this.renderAudienceGroups({ attribute: `data-${prefix}-audience`, selected: targeting.audiences, groups: audienceGroups })}</div>`, 'shared-audience-field')}
        ${field('是否定制人群取反', `<span class="home-entry-status-control"><label><input type="radio" name="${prefix}-audience-inversion" value="否"${targeting.audienceInversion === '否' ? ' checked' : ''} />否</label><label><input type="radio" name="${prefix}-audience-inversion" value="是"${targeting.audienceInversion === '是' ? ' checked' : ''} />是</label>${audienceInversionHint ? `<small class="shared-audience-inversion-note">${audienceInversionHint}</small>` : ''}</span>`)}</div>
      <div class="shared-targeting-subsection"><h4>实验信息</h4>
        ${field('指定实验可见', `<input class="control" data-${prefix}-targeting-field="experimentId" value="${targeting.experimentId}" placeholder="如：1338-3550,1339-3510" />`)}
        ${field('排除实验', `<input class="control" data-${prefix}-targeting-field="excludeExperiment" value="${targeting.excludeExperiment}" placeholder="如：1338-3550,1339-3510" />`)}</div>
      ${includePlatform ? `<div class="shared-targeting-subsection"><h4>版本条件</h4>${field(`${requiredMark}平台和版本`, `<div class="config-platform-list">${platformRow('ios', 'iOS')}${platformRow('android', 'Android')}${platformRow('harmony', 'Harmony')}<p>仅适用于 8.96.0.0 及以上版本</p></div>`, 'shared-platform-field')}</div>` : ''}
      ${includeSchedule ? `<div class="shared-targeting-subsection"><h4>投放时间&状态</h4>${field(`${requiredMark}上下线时间`, `<div class="config-date-range"><label><span>开始</span><input class="control" data-${prefix}-targeting-field="onlineStart" type="datetime-local" value="${targeting.onlineStart}" /></label><label><span>结束</span><input class="control" data-${prefix}-targeting-field="onlineEnd" type="datetime-local" value="${targeting.onlineEnd}" /></label></div>`)}${field(`${requiredMark}状态`, `<span class="home-entry-status-control">${statusOptions.map((status) => `<label><input type="radio" name="${prefix}-status" value="${status}"${targeting.status === status ? ' checked' : ''} />${status}</label>`).join('')}</span>`)}</div>` : ''}
    </section>`;
  },
  renderTestPlan({ prefix, value = {}, description = '测试 UID 内的用户将在测试有效时间内看到此配置，到期自动终止，不影响正式配置。' } = {}) {
    const testPlan = this.normalizeTestPlan(value);
    const status = testPlan.enabled ? '生效' : '未启用';
    const statusControl = `<label class="home-test-enabled"><input data-${prefix}-test="enabled" type="checkbox"${testPlan.enabled ? ' checked' : ''} /><span class="switch-track"></span><b data-${prefix}-test-status>${status}</b></label>`;
    return `<section class="home-entry-info-section home-test-plan-section shared-config-section"><h3>测试计划</h3><p>${description}</p><div class="config-field"><span class="config-field-label">测试 UID</span><div class="config-field-control"><input class="control" data-${prefix}-test="uids" value="${testPlan.uids}" placeholder="多个 UID 用英文逗号分隔" /></div></div><div class="config-field"><span class="config-field-label">测试时间</span><div class="config-field-control"><div class="config-date-range"><label><span>开始</span><input class="control" data-${prefix}-test="start" type="datetime-local" value="${testPlan.start}" /></label><label><span>结束</span><input class="control" data-${prefix}-test="end" type="datetime-local" value="${testPlan.end}" /></label></div></div></div><div class="config-field"><span class="config-field-label">测试状态</span><div class="config-field-control">${statusControl}</div></div></section>`;
  }
};
