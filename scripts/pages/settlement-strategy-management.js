window.SettlementStrategyManagementPage = {
  storageKey: 'meiyou-cashback-settlement-strategy-records',
  platforms: ['淘宝', '京东', '拼多多', '唯品会', '穿山甲-抖音', '好单库-抖音', '1688', '好单库-拼多多', '亿起发联盟', '饿了么', '海威', '有票票', '聚推客', '滴滴官方CPS', '美团官方CPS'],
  transactionSuccessPlatforms: ['淘宝', '京东', '拼多多', '唯品会', '穿山甲-抖音', '好单库-抖音', '1688', '好单库-拼多多'],
  seedRecords: [
    { id: '3', business: '美柚-返现', name: '首单闪电返1_京东_1029', type: '首单类型', platforms: ['京东'], trigger: '支付成功', settlementType: 'after-days', settlementDays: '2', cashbackAmountEnabled: false, cashbackAmount: '', targeting: { excludeExperiment: '1940-12228', status: '下线' }, testPlan: {} },
    { id: '2', business: '美柚-返现', name: '首单闪电返1_淘宝_1029', type: '首单类型', platforms: ['淘宝'], trigger: '交易成功', settlementType: 'immediate', settlementDays: '', cashbackAmountEnabled: false, cashbackAmount: '', targeting: { excludeExperiment: '1940-12228', status: '下线' }, testPlan: {} },
    { id: '1', business: '美柚-返现', name: '订单首单到账策略', type: '首单类型', platforms: ['淘宝', '京东', '拼多多', '唯品会'], trigger: '支付成功', settlementType: 'immediate', settlementDays: '', cashbackAmountEnabled: false, cashbackAmount: '', targeting: { status: '下线' }, testPlan: {} }
  ],
  clone(value) { return JSON.parse(JSON.stringify(value)); },
  escape(value = '') { return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character])); },
  emptyRecord() {
    return { id: '', business: '美柚-返现', name: '', type: '首单类型', platforms: [], trigger: '支付成功', settlementType: 'immediate', settlementDays: '', cashbackAmountEnabled: false, cashbackAmount: '', targeting: window.ConfigurationSections.createTargeting(), testPlan: window.ConfigurationSections.createTestPlan() };
  },
  normalizeRecord(record = {}) {
    const defaults = this.emptyRecord();
    return { ...defaults, ...record, platforms: Array.isArray(record.platforms) ? record.platforms : [], targeting: window.ConfigurationSections.normalizeTargeting({ ...defaults.targeting, ...(record.targeting || {}) }), testPlan: window.ConfigurationSections.normalizeTestPlan(record.testPlan) };
  },
  read() {
    try { const saved = JSON.parse(window.localStorage.getItem(this.storageKey)); if (Array.isArray(saved)) return saved.map((record) => this.normalizeRecord(record)); } catch (error) { /* Fall back to demonstrative data. */ }
    return this.clone(this.seedRecords).map((record) => this.normalizeRecord(record));
  },
  write(records) { window.localStorage.setItem(this.storageKey, JSON.stringify(records)); },
  targetingSummary(targeting = {}) {
    if (targeting.excludeExperiment) return `排除实验：${targeting.excludeExperiment}`;
    if (targeting.experimentId) return `指定实验：${targeting.experimentId}`;
    if (targeting.targetGroup) return `指定人群包：${targeting.targetGroup}`;
    if (targeting.excludeGroup) return `排除人群包：${targeting.excludeGroup}`;
    if (targeting.audiences?.length) return `定制人群：${targeting.audiences.join('、')}`;
    return '全部用户';
  },
  listStatus(targeting = {}) { return targeting.status === '上线' ? '上线' : '已下线'; },
  settlementLabel(record = {}) { return record.settlementType === 'after-days' ? `${record.settlementDays || '-'}天后到账` : '立即到账'; },
  field(label, control, className = '') { return `<div class="config-field ${className}"><span class="config-field-label">${label}</span><div class="config-field-control">${control}</div></div>`; },
  isTransactionSuccess(form) { return form.querySelector('[name="trigger"]:checked')?.value === '交易成功'; },
  syncTransactionSuccessRestrictions(form) {
    const isTransactionSuccess = this.isTransactionSuccess(form);
    form.querySelectorAll('[data-settlement-business-platform]').forEach((input) => {
      const isAllowed = this.transactionSuccessPlatforms.includes(input.value);
      input.disabled = isTransactionSuccess && !isAllowed;
      if (input.disabled) input.checked = false;
      input.closest('label')?.classList.toggle('is-disabled', input.disabled);
    });

    const immediate = form.querySelector('[name="settlementType"][value="immediate"]');
    const afterDays = form.querySelector('[name="settlementType"][value="after-days"]');
    if (isTransactionSuccess) immediate.checked = true;
    afterDays.disabled = isTransactionSuccess;
    afterDays.closest('label')?.classList.toggle('is-disabled', isTransactionSuccess);
    form.elements.settlementDays.disabled = isTransactionSuccess || form.querySelector('[name="settlementType"]:checked')?.value !== 'after-days';

    const cashbackEnabled = form.elements.cashbackAmountEnabled;
    if (isTransactionSuccess) cashbackEnabled.checked = false;
    cashbackEnabled.disabled = isTransactionSuccess;
    form.elements.cashbackAmount.disabled = isTransactionSuccess || !cashbackEnabled.checked;
    form.querySelector('.settlement-strategy-amount-rule')?.classList.toggle('is-disabled', isTransactionSuccess);
  },
  render() {
    const records = this.read();
    return `<section class="content settlement-strategy-management-page"><section class="settlement-strategy-workspace panel"><div class="settlement-strategy-actions"><button class="button primary" type="button" data-add-strategy>新增策略</button></div><div class="table-wrap settlement-strategy-table-wrap"><table class="settlement-strategy-table"><thead><tr><th>策略ID</th><th>策略名称</th><th>面向平台</th><th>策略类型</th><th>触发时机</th><th>定向信息</th><th>到账策略</th><th>状态</th><th>操作</th></tr></thead><tbody>${records.map((record) => `<tr><td>${this.escape(record.id)}</td><td>${this.escape(record.name)}</td><td title="${this.escape(record.platforms.join('、'))}">${this.escape(record.platforms.join('、'))}</td><td>${this.escape(record.type)}</td><td>${this.escape(record.trigger === '交易成功' ? '订单交易成功' : '订单支付成功')}</td><td title="${this.escape(this.targetingSummary(record.targeting))}">${this.escape(this.targetingSummary(record.targeting))}</td><td>${this.escape(this.settlementLabel(record))}</td><td>${this.escape(this.listStatus(record.targeting))}</td><td><button class="text-button" type="button" data-edit-strategy="${this.escape(record.id)}">编辑</button></td></tr>`).join('')}</tbody></table></div></section></section>`;
  },
  renderEditor({ recordId = null } = {}) {
    const record = this.normalizeRecord(this.read().find((item) => item.id === recordId) || this.emptyRecord());
    const required = '<b class="field-required">*</b>';
    const platformOptions = this.platforms.map((platform) => `<label><input type="checkbox" data-settlement-business-platform value="${this.escape(platform)}"${record.platforms.includes(platform) ? ' checked' : ''} /><span>${this.escape(platform)}</span></label>`).join('');
    const basic = `<section class="shared-config-section settlement-strategy-basic-section"><h3>基础信息</h3>${this.field(`${required}业务`, '<select class="control" name="business"><option value="美柚-返现" selected>美柚-返现</option></select>')}${this.field(`${required}策略名称`, `<input class="control" name="name" value="${this.escape(record.name)}" maxlength="60" placeholder="请输入策略名称，形如：电商首单到账策略" />`)}${this.field(`${required}策略类型`, `<select class="control" name="type"><option value="首单类型"${record.type === '首单类型' ? ' selected' : ''}>首单类型</option></select>`)}${this.field(`${required}支持平台`, `<div class="settlement-strategy-platform-options">${platformOptions}</div>`, 'settlement-strategy-platform-field')}${this.field(`${required}触发时机`, `<div class="settlement-strategy-radio-stack"><label><input type="radio" name="trigger" value="支付成功"${record.trigger === '支付成功' ? ' checked' : ''} /><span>订单支付成功（业务订单状态 = 支付成功）</span></label><label><input type="radio" name="trigger" value="交易成功"${record.trigger === '交易成功' ? ' checked' : ''} /><span>订单交易成功（业务订单状态 = 交易成功）</span><button class="help-tooltip" type="button" aria-label="订单交易成功说明" data-tooltip="只对电商平台生效，包括淘宝、京东、拼多多、唯品会、穿山甲-抖音、好单库-抖音、1688">?</button></label></div>`, 'settlement-strategy-trigger-field')}${this.field(`${required}到账策略`, `<div class="settlement-strategy-radio-stack settlement-strategy-settlement-options"><label><input type="radio" name="settlementType" value="immediate"${record.settlementType === 'immediate' ? ' checked' : ''} /><span>触发后立即到账</span></label><label><input type="radio" name="settlementType" value="after-days"${record.settlementType === 'after-days' ? ' checked' : ''} /><span>触发后</span><input class="control" name="settlementDays" type="number" min="1" step="1" value="${this.escape(record.settlementDays)}" placeholder="请输入>0的整数（含）"${record.settlementType === 'after-days' ? '' : ' disabled'} /><span>内天到账</span></label></div>`, 'settlement-strategy-settlement-field')}${this.field('返现金额策略 <small>（选中且输入值合法则策略生效）</small>', `<label class="settlement-strategy-amount-rule"><input type="checkbox" name="cashbackAmountEnabled"${record.cashbackAmountEnabled ? ' checked' : ''} /><span>低于</span><input class="control" name="cashbackAmount" type="number" min="0.01" step="0.01" value="${this.escape(record.cashbackAmount)}" placeholder="请输入>0的数值"${record.cashbackAmountEnabled ? '' : ' disabled'} /><span>的返现金额有效</span></label>`, 'settlement-strategy-amount-field')}</section>`;
    return `<section class="content settlement-strategy-management-page is-settlement-strategy-editor"><header class="settlement-strategy-editor-heading"><button type="button" class="settlement-strategy-back" data-settlement-back aria-label="返回到账策略列表" title="返回到账策略列表"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.75 3.5 5.25 8l4.5 4.5" /></svg></button><h1>${recordId ? '编辑到账策略' : '新增到账策略'}</h1></header><section class="settlement-strategy-editor-workspace panel"><form class="settlement-strategy-form" data-settlement-form novalidate>${basic}${window.ConfigurationSections.renderTargeting({ prefix: 'settlement', value: record.targeting, required: true, statusOptions: ['上线', '下线'] })}${window.ConfigurationSections.renderTestPlan({ prefix: 'settlement', value: record.testPlan, description: '测试 UID 内的用户可无视定向规则直接看到该到账策略，到期自动终止，不影响正式策略。' })}<footer class="settlement-strategy-form-actions"><button class="button secondary" type="button" data-settlement-cancel>取消</button><button class="button primary" type="submit">保存</button></footer></form></section></section>`;
  },
  readTargeting(root) {
    const targeting = window.ConfigurationSections.createTargeting();
    targeting.identities = [...root.querySelectorAll('[data-settlement-identity]:checked')].map((item) => item.value);
    targeting.audiences = [...root.querySelectorAll('[data-settlement-audience]:checked')].map((item) => item.value);
    targeting.audienceInversion = root.querySelector('[name="settlement-audience-inversion"]:checked')?.value || '否';
    root.querySelectorAll('[data-settlement-targeting-field]').forEach((input) => { targeting[input.dataset.settlementTargetingField] = input.value.trim(); });
    root.querySelectorAll('[data-settlement-platform]').forEach((input) => { targeting.platformVersions[input.dataset.settlementPlatform].enabled = input.checked; });
    root.querySelectorAll('[data-settlement-version]').forEach((input) => { const [platform, boundary] = input.dataset.settlementVersion.split(':'); targeting.platformVersions[platform][boundary] = input.value.trim(); });
    targeting.status = root.querySelector('[name="settlement-status"]:checked')?.value || '下线';
    return targeting;
  },
  readTestPlan(root) { return { uids: String(root.querySelector('[data-settlement-test="uids"]')?.value || '').trim(), start: root.querySelector('[data-settlement-test="start"]')?.value || '', end: root.querySelector('[data-settlement-test="end"]')?.value || '', enabled: Boolean(root.querySelector('[data-settlement-test="enabled"]')?.checked) }; },
  bind({ navigate, recordId, isAdd, isEdit } = {}) {
    if (!isAdd && !isEdit) {
      document.querySelector('[data-add-strategy]')?.addEventListener('click', () => navigate('settlement-strategy-add'));
      document.querySelector('.settlement-strategy-table')?.addEventListener('click', (event) => { const button = event.target.closest('[data-edit-strategy]'); if (button) navigate(`settlement-strategy-edit:${button.dataset.editStrategy}`); });
      return;
    }
    const root = document.querySelector('.settlement-strategy-management-page');
    const form = root.querySelector('[data-settlement-form]');
    const returnToList = () => navigate('settlement-strategy-management');
    root.querySelector('[data-settlement-back]')?.addEventListener('click', returnToList);
    root.querySelector('[data-settlement-cancel]')?.addEventListener('click', returnToList);
    this.syncTransactionSuccessRestrictions(form);
    form.addEventListener('change', (event) => {
      if (event.target.name === 'trigger') this.syncTransactionSuccessRestrictions(form);
      if (event.target.name === 'settlementType' && !this.isTransactionSuccess(form)) form.elements.settlementDays.disabled = event.target.value !== 'after-days';
      if (event.target.name === 'cashbackAmountEnabled' && !this.isTransactionSuccess(form)) form.elements.cashbackAmount.disabled = !event.target.checked;
      if (event.target.matches('[data-settlement-test="enabled"]')) root.querySelector('[data-settlement-test-status]').textContent = event.target.checked ? '生效' : '未启用';
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form); const name = String(data.get('name') || '').trim(); const isTransactionSuccess = this.isTransactionSuccess(form); const platforms = [...root.querySelectorAll('[data-settlement-business-platform]:checked')].map((item) => item.value).filter((platform) => !isTransactionSuccess || this.transactionSuccessPlatforms.includes(platform)); const settlementType = isTransactionSuccess ? 'immediate' : (data.get('settlementType') || 'immediate'); const settlementDays = isTransactionSuccess ? '' : String(data.get('settlementDays') || '').trim(); const cashbackAmountEnabled = isTransactionSuccess ? false : Boolean(form.elements.cashbackAmountEnabled.checked); const cashbackAmount = isTransactionSuccess ? '' : String(data.get('cashbackAmount') || '').trim();
      if (!name) return window.BackofficeLayout.showRequiredFieldToast('策略名称');
      if (!platforms.length) return window.BackofficeLayout.showRequiredFieldToast('支持平台');
      if (settlementType === 'after-days' && (!/^\d+$/.test(settlementDays) || Number(settlementDays) < 1)) return window.BackofficeLayout.showToast('到账策略校验失败', '请输入大于 0 的整数到账天数');
      if (cashbackAmountEnabled && (!/^\d+(\.\d+)?$/.test(cashbackAmount) || Number(cashbackAmount) <= 0)) return window.BackofficeLayout.showToast('返现金额策略校验失败', '请输入大于 0 的返现金额');
      const targeting = this.readTargeting(root);
      if (!targeting.onlineStart || !targeting.onlineEnd) return window.BackofficeLayout.showRequiredFieldToast('上下线时间');
      if (new Date(targeting.onlineStart).getTime() > new Date(targeting.onlineEnd).getTime()) return window.BackofficeLayout.showToast('上下线时间有误', '结束时间不能早于开始时间');
      const testPlan = this.readTestPlan(root); const testError = window.ConfigurationSections.validateTestPlan(testPlan); if (testError) return window.BackofficeLayout.showToast('测试计划校验失败', testError);
      const records = this.read(); const next = this.normalizeRecord({ id: recordId || String(Math.max(0, ...records.map((item) => Number(item.id) || 0)) + 1), business: data.get('business'), name, type: data.get('type'), platforms, trigger: data.get('trigger'), settlementType, settlementDays, cashbackAmountEnabled, cashbackAmount, targeting, testPlan }); const index = records.findIndex((item) => item.id === next.id); if (index >= 0) records.splice(index, 1, next); else records.unshift(next); this.write(records);
      window.BackofficeLayout.showToast('保存成功', '到账策略已更新'); returnToList();
    });
    window.BackofficeLayout.bindGlobalTooltips();
  }
};
