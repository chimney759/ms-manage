window.ConfigurationSections = {
  identities: ['经期', '怀孕', '备孕', '辣妈', '亲友', '仅注册MS用户'],
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
      identities: Array.isArray(value.identities) ? value.identities : [],
      audiences: Array.isArray(value.audiences) ? value.audiences : [],
      platformVersions: Object.fromEntries(Object.entries(defaults.platformVersions).map(([key, platform]) => [key, { ...platform, ...(value.platformVersions?.[key] || {}) }]))
    };
  },
  normalizeTestPlan(value = {}) {
    return { ...this.createTestPlan(), ...(value && typeof value === 'object' ? value : {}) };
  },
  renderAudienceGroups({ attribute, selected = [] } = {}) {
    return this.audienceGroups.map(({ title, items }) => `<div class="audience-group config-audience-group"><div class="audience-group-title">${title}</div><div class="audience-group-items">${items.map((item) => `<label><input type="checkbox" value="${item}" ${attribute}${selected.includes(item) ? ' checked' : ''} /><span>${item}</span></label>`).join('')}</div></div>`).join('');
  },
  renderIdentityOptions({ attribute, selected = [] } = {}) {
    return this.identities.map((item) => `<label><input type="checkbox" value="${item}" ${attribute}${selected.includes(item) ? ' checked' : ''} />${item}</label>`).join('');
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
  renderTargeting({ prefix, value = {}, includeSchedule = true, required = false } = {}) {
    const targeting = this.normalizeTargeting(value);
    const requiredMark = required ? '<b class="field-required">*</b>' : '';
    const field = (label, control, className = '') => `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`;
    const platformRow = (key, label) => `<div class="config-platform-row"><label><input type="checkbox" data-${prefix}-platform="${key}"${targeting.platformVersions[key].enabled ? ' checked' : ''} />${label}</label><input class="control" data-${prefix}-version="${key}:start" value="${targeting.platformVersions[key].start}" placeholder="最低版本" /><span>至</span><input class="control" data-${prefix}-version="${key}:end" value="${targeting.platformVersions[key].end}" placeholder="最高版本（选填）" /></div>`;
    return `<section class="home-entry-info-section shared-config-section"><h3>定向信息</h3>
      ${field('用户身份', `<span class="home-identity-options">${this.renderIdentityOptions({ attribute: `data-${prefix}-identity`, selected: targeting.identities })}</span>`)}
      ${field('指定人群包', `<input class="control" data-${prefix}-targeting-field="targetGroup" value="${targeting.targetGroup}" placeholder="填入表名，不填默认全部用户" />`)}
      ${field('排除人群包', `<input class="control" data-${prefix}-targeting-field="excludeGroup" value="${targeting.excludeGroup}" placeholder="填入表名，不填默认为空" />`)}
      ${field('定制人群', `<div class="audience-options config-audience-options">${this.renderAudienceGroups({ attribute: `data-${prefix}-audience`, selected: targeting.audiences })}</div>`, 'shared-audience-field')}
      ${field('是否定制人群取反', `<span class="home-entry-status-control"><label><input type="radio" name="${prefix}-audience-inversion" value="否"${targeting.audienceInversion === '否' ? ' checked' : ''} />否</label><label><input type="radio" name="${prefix}-audience-inversion" value="是"${targeting.audienceInversion === '是' ? ' checked' : ''} />是</label></span>`)}
      ${field('指定实验可见', `<input class="control" data-${prefix}-targeting-field="experimentId" value="${targeting.experimentId}" placeholder="如：1338-3550,1339-3510" />`)}
      ${field('排除实验', `<input class="control" data-${prefix}-targeting-field="excludeExperiment" value="${targeting.excludeExperiment}" placeholder="如：1338-3550,1339-3510" />`)}
      ${field(`${requiredMark}平台和版本`, `<div class="config-platform-list">${platformRow('ios', 'iOS')}${platformRow('android', 'Android')}${platformRow('harmony', 'Harmony')}<p>仅适用于 8.96.0.0 及以上版本</p></div>`, 'shared-platform-field')}
      ${includeSchedule ? `${field(`${requiredMark}上线时间`, `<div class="config-date-range"><label><span>开始</span><input class="control" data-${prefix}-targeting-field="onlineStart" type="datetime-local" value="${targeting.onlineStart}" /></label><label><span>结束</span><input class="control" data-${prefix}-targeting-field="onlineEnd" type="datetime-local" value="${targeting.onlineEnd}" /></label></div>`)}${field(`${requiredMark}状态`, `<span class="home-entry-status-control"><label><input type="radio" name="${prefix}-status" value="上线"${targeting.status === '上线' ? ' checked' : ''} />上线</label><label><input type="radio" name="${prefix}-status" value="下线"${targeting.status === '下线' ? ' checked' : ''} />下线</label></span>`)}` : ''}
    </section>`;
  },
  renderTestPlan({ prefix, value = {}, description = '测试 UID 内的用户将在测试有效时间内看到此配置，到期自动终止，不影响正式配置。' } = {}) {
    const testPlan = this.normalizeTestPlan(value);
    return `<section class="home-entry-info-section home-test-plan-section shared-config-section"><h3>测试计划</h3><p>${description}</p><div class="config-field"><span class="config-field-label">测试 UID</span><div class="config-field-control"><input class="control" data-${prefix}-test="uids" value="${testPlan.uids}" placeholder="多个 UID 用英文逗号分隔" /></div></div><div class="config-field"><span class="config-field-label">测试时间</span><div class="config-field-control"><div class="config-date-range"><label><span>开始</span><input class="control" data-${prefix}-test="start" type="datetime-local" value="${testPlan.start}" /></label><label><span>结束</span><input class="control" data-${prefix}-test="end" type="datetime-local" value="${testPlan.end}" /></label></div></div></div><div class="config-field"><span class="config-field-label">测试状态</span><label class="home-test-enabled"><input data-${prefix}-test="enabled" type="checkbox"${testPlan.enabled ? ' checked' : ''} /><span class="switch-track"></span><b>${testPlan.enabled ? '生效' : '未启用'}</b></label></div></section>`;
  }
};
