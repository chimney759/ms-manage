window.MerchantFormPage = {
  categoryStorageKey: 'meiyou-cashback-category-records',
  merchantStorageKey: 'meiyou-cashback-merchant-records',
  readFileAsDataUrl(file) {
    if (!file) return Promise.resolve('');
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(String(reader.result || '')));
      reader.addEventListener('error', () => resolve(''));
      reader.readAsDataURL(file);
    });
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
  targetingIdentities: ['经期', '怀孕', '备孕', '辣妈', '亲友', '仅注册MS用户'],
  audienceGroups: [
    { title: '常用人群', items: ['高活跃用户', '新注册用户', '近30日下单用户', '价格敏感用户'] },
    { title: '活动人群', items: ['大促活动用户', '会员活动用户', '内容活动用户', '召回活动用户'] },
    { title: '临时人群', items: ['运营临时圈选人群', '合作商专属用户', '白名单用户', '灰度验证用户'] }
  ],
  createTargeting() {
    return {
      identities: [], targetGroup: '', excludeGroup: '', audiences: [], audienceInversion: '否',
      platformVersions: {
        ios: { enabled: true, start: '8.96.0.0', end: '' },
        android: { enabled: true, start: '8.96.0.0', end: '' },
        harmony: { enabled: true, start: '8.99.0.0', end: '' }
      },
      onlineStart: '', onlineEnd: ''
    };
  },
  createTestPlan() {
    return { uids: '', start: '', end: '', enabled: true };
  },
  normalizeTestPlan(testPlan = {}) {
    return { ...this.createTestPlan(), ...(testPlan && typeof testPlan === 'object' ? testPlan : {}) };
  },
  normalizeTargeting(targeting = {}) {
    const defaults = this.createTargeting();
    const platformVersions = Object.fromEntries(Object.entries(defaults.platformVersions).map(([platform, value]) => [platform, {
      ...value,
      ...(targeting.platformVersions?.[platform] || {})
    }]));
    return {
      ...defaults,
      ...targeting,
      identities: Array.isArray(targeting.identities) ? targeting.identities : [],
      audiences: Array.isArray(targeting.audiences) ? targeting.audiences : [],
      platformVersions
    };
  },
  renderAudienceGroups() {
    return this.audienceGroups.map(({ title, items }) => `<div class="audience-group"><div class="audience-group-title">${title}</div><div class="audience-group-items">${items.map((item) => `<label><input type="checkbox" value="${item}" data-target-audience /><span>${item}</span></label>`).join('')}</div></div>`).join('');
  },
  render({ recordId = null } = {}) {
    return `<section class="content merchant-form-page">
      <div class="page-heading"><div class="page-title-row"><button class="back-button" id="back-to-merchant-list" type="button" title="返回合作商列表">‹</button><h1>${recordId ? '编辑合作商' : '添加合作商'}</h1></div></div>
      <form class="merchant-form" id="merchant-form" novalidate>
        <section class="form-section"><h2 class="section-title">商家基础信息</h2><div class="section-body">
          <div class="form-row"><label class="required">合作商头像：</label><div class="form-control-area"><label class="upload-field" for="merchant-avatar"><input id="merchant-avatar" type="file" accept="image/*" /><span class="upload-icon">+</span><span class="upload-label">上传头像</span></label><button class="help-tooltip" type="button" data-tooltip="用于用户端的合作商展示" aria-label="合作商头像说明">?</button><div class="form-help">建议上传 1:1 比例图片，支持 JPG、PNG 格式</div></div></div>
          <div class="form-row"><label class="required" for="merchant-name">合作商名称：</label><div class="form-control-area"><div class="control-with-tooltip"><input class="control" id="merchant-name" placeholder="请输入商家名称" maxlength="30" /><button class="help-tooltip" type="button" data-tooltip="透传到用户端的商家名称，用户可见" aria-label="合作商名称说明">?</button></div><div class="error-message">请输入合作商名称</div></div></div>
          <div class="form-row"><label class="required" for="merchant-category">合作商分类：</label><div class="form-control-area"><div class="control-with-tooltip"><select class="control" id="merchant-category"><option value="">请选择合作商分类</option></select><button class="help-tooltip" type="button" data-tooltip="取自合作商分类管理的启用配置，用户端将根据分类进行合作商聚合展示" aria-label="合作商分类说明">?</button></div><div class="error-message">请选择合作商分类</div></div></div>
        </div></section>
        <section class="form-section"><h2 class="section-title">商家营销信息</h2><div class="section-body">
          <div class="form-row"><label>合作商视频：</label><div class="form-control-area"><label class="upload-file" for="merchant-video"><input id="merchant-video" type="file" accept="video/*" /><span>上传视频</span></label><span class="upload-file-name" id="video-file-name">未选择文件</span></div></div>
          <div class="form-row" id="video-cover-row" hidden><label for="video-cover">视频封面：</label><div class="form-control-area"><label class="upload-file" for="video-cover"><input id="video-cover" type="file" accept="image/*" /><span>上传封面</span></label><span class="upload-file-name" id="cover-file-name">未选择文件</span></div></div>
        </div></section>
        <section class="form-section merchant-rule-section"><h2 class="section-title">合作商规则</h2><div class="section-body"><div class="form-row"><label for="merchant-rule-editor">规则内容：</label><div class="form-control-area"><div class="control-with-tooltip merchant-rule-editor-wrap"><div class="rich-text-editor"><div class="rich-text-toolbar" role="toolbar" aria-label="规则内容编辑工具"><button type="button" data-rule-command="bold" title="加粗"><b>B</b></button><button type="button" data-rule-command="italic" title="斜体"><i>I</i></button><button type="button" data-rule-command="insertUnorderedList" title="无序列表">•</button><button type="button" data-rule-command="insertOrderedList" title="有序列表">1.</button></div><div class="rich-text-content" id="merchant-rule-editor" contenteditable="true" role="textbox" aria-multiline="true" data-placeholder="请输入合作商规则（选填）"></div></div><button class="help-tooltip" type="button" data-tooltip="展示在对应的合作商模板的底部。在合作商详情页管理中展示在对应的商家下。" aria-label="合作商规则说明">?</button></div></div></div></div></section>
        <section class="form-section"><h2 class="section-title">定向信息</h2><div class="section-body targeting-body">
          <div class="form-row check-row"><label>用户身份：</label><div class="form-control-area">${this.targetingIdentities.map((item) => `<label><input type="checkbox" value="${item}" data-target-identity />${item}</label>`).join('')}</div></div>
          <div class="form-row"><label for="merchant-target-group">指定人群包：</label><div class="form-control-area"><input class="control compact-control" id="merchant-target-group" placeholder="请输入指定人群包ID或名称" /></div></div>
          <div class="form-row"><label for="merchant-exclude-group">排除人群包：</label><div class="form-control-area"><input class="control compact-control" id="merchant-exclude-group" placeholder="请输入排除人群包ID或名称" /></div></div>
          <div class="form-row audience-row"><label>定制人群：</label><div class="form-control-area audience-options-wrap"><div class="audience-options">${this.renderAudienceGroups()}</div></div></div>
          <div class="form-row audience-inversion-row"><label>是否定制人群取反：</label><div class="form-control-area inline-radios"><label><input type="radio" name="merchant-audience-inversion" value="否" checked />否</label><label><input type="radio" name="merchant-audience-inversion" value="是" />是</label><p class="form-warning">选择定制人群后，取反表示圈定人群以外的用户。</p></div></div>
          <div class="form-row version-grid"><label>平台和版本：</label><div class="form-control-area"><div><label><input type="checkbox" data-platform-enabled="ios" />iOS</label><input class="control version-control" data-platform-start="ios" placeholder="最低版本" /><span>至</span><input class="control version-control" data-platform-end="ios" placeholder="最高版本（选填）" /></div><div><label><input type="checkbox" data-platform-enabled="android" />Android</label><input class="control version-control" data-platform-start="android" placeholder="最低版本" /><span>至</span><input class="control version-control" data-platform-end="android" placeholder="最高版本（选填）" /></div><div><label><input type="checkbox" data-platform-enabled="harmony" />Harmony</label><input class="control version-control" data-platform-start="harmony" placeholder="最低版本" /><span>至</span><input class="control version-control" data-platform-end="harmony" placeholder="最高版本（选填）" /></div></div></div>
          <div class="form-row date-range"><label for="merchant-online-start">启用时间：</label><div class="form-control-area"><input class="control" id="merchant-online-start" type="datetime-local" /><span>至</span><input class="control" id="merchant-online-end" type="datetime-local" /></div></div>
        </div></section>
        <section class="form-section"><h2 class="section-title">测试计划</h2><div class="section-body test-plan-body"><p class="test-plan-notice">测试 UID 内的用户将在测试有效时间内看到此合作商配置，到期自动终止。</p><div class="form-row"><label for="merchant-test-uids">测试 UID：</label><div class="form-control-area"><input class="control compact-control" id="merchant-test-uids" placeholder="多个 UID 用英文逗号分隔" /></div></div><div class="form-row date-range"><label for="merchant-test-start">测试时间：</label><div class="form-control-area"><input class="control" id="merchant-test-start" type="datetime-local" /><span>至</span><input class="control" id="merchant-test-end" type="datetime-local" /></div></div><div class="form-row check-row"><label>测试状态：</label><div class="form-control-area"><label class="switch"><input id="merchant-test-enabled" type="checkbox" checked /><span class="switch-track"></span></label><span class="status-badge" id="merchant-test-status">生效</span></div></div></div></section>
        <section class="form-section"><h2 class="section-title">上线时间</h2><div class="section-body"><div class="form-row date-range"><label for="merchant-schedule-start">上线时间：</label><div class="form-control-area"><input class="control" id="merchant-schedule-start" type="datetime-local" /><span>至</span><input class="control" id="merchant-schedule-end" type="datetime-local" /></div></div><div class="form-row"><label>是否启用：</label><div class="form-control-area radio-group"><label class="radio-option"><input type="radio" name="merchant-enabled-status" value="启用" checked />启用</label><label class="radio-option"><input type="radio" name="merchant-enabled-status" value="停用" />停用</label></div></div></div></section>
        <div class="form-page-actions"><button class="button secondary" id="cancel-merchant-form" type="button">取消</button><button class="button primary" type="submit">${recordId ? '保存修改' : '保存'}</button></div>
      </form>
    </section>
    <div class="modal" id="merchant-tracking-scenario-modal" hidden><div class="modal-card confirm-card" role="dialog" aria-modal="true" aria-labelledby="merchant-tracking-scenario-title"><div class="modal-header"><h2 id="merchant-tracking-scenario-title">跟单标识配置</h2></div><div class="confirm-body"><p>请选择当前商城跟单标识的研发配置情况，用于模拟保存校验。</p><div class="radio-group scenario-radio-group"><label class="radio-option"><input type="radio" name="tracking-config-status" value="configured" checked />研发已配置标识</label><label class="radio-option"><input type="radio" name="tracking-config-status" value="unconfigured" />研发未配置标识</label></div></div><div class="modal-footer"><button class="button secondary" type="button" data-close-tracking-scenario>取消</button><button class="button primary" type="button" id="confirm-tracking-scenario">确认</button></div></div></div>
    <div class="modal" id="merchant-tracking-warning-modal" hidden><div class="modal-card confirm-card" role="dialog" aria-modal="true" aria-labelledby="merchant-tracking-warning-title"><div class="modal-header"><h2 id="merchant-tracking-warning-title">未配置跟单标识</h2></div><div class="confirm-body"><p>请联系研发侧配置商城的标识，否则将导致用户端订单归属商城显示异常。</p><p class="confirm-impact">先切换“是否启用”为停用，进行保存。</p></div><div class="modal-footer"><button class="button secondary" type="button" data-close-tracking-warning>取消</button><button class="button primary" type="button" id="disable-and-save-merchant">切换为“停用”并保存</button></div></div></div>`;
  },
  bind({ navigate, recordId = null } = {}) {
    const categorySelect = document.getElementById('merchant-category');
    let categoryRecords = [];
    try { categoryRecords = JSON.parse(window.localStorage.getItem(this.categoryStorageKey)) || []; } catch (error) { categoryRecords = []; }
    categoryRecords.filter((record) => record.status === '启用').forEach((record) => categorySelect.add(new Option(record.categoryName, record.id)));
    let merchantRecords = [];
    try { merchantRecords = JSON.parse(window.localStorage.getItem(this.merchantStorageKey)) || []; } catch (error) { merchantRecords = []; }
    const editingRecord = merchantRecords.find((record) => record.id === recordId);
    const targeting = this.normalizeTargeting(editingRecord?.targeting);
    const testPlan = this.normalizeTestPlan(editingRecord?.testPlan);
    const onlineSchedule = { start: editingRecord?.onlineSchedule?.start || '', end: editingRecord?.onlineSchedule?.end || '' };
    const enabledStatus = editingRecord?.enabledStatus || (editingRecord?.status === '下线' ? '停用' : '启用');
    if (editingRecord) {
      if (![...categorySelect.options].some((option) => option.text === editingRecord.category)) categorySelect.add(new Option(editingRecord.category, editingRecord.category));
      document.getElementById('merchant-name').value = editingRecord.name || '';
      categorySelect.value = [...categorySelect.options].find((option) => option.text === editingRecord.category)?.value || '';
      document.getElementById('video-file-name').textContent = editingRecord.videoName || '未选择文件';
      document.getElementById('cover-file-name').textContent = editingRecord.coverName || '未选择文件';
      document.getElementById('video-cover-row').hidden = !editingRecord.videoName;
      const ruleEditor = document.getElementById('merchant-rule-editor');
      if (ruleEditor) ruleEditor.innerHTML = this.sanitizeRuleHtml(editingRecord.ruleContent);
    }
    document.querySelectorAll('[data-target-identity]').forEach((input) => { input.checked = targeting.identities.includes(input.value); });
    document.querySelectorAll('[data-target-audience]').forEach((input) => { input.checked = targeting.audiences.includes(input.value); });
    document.getElementById('merchant-target-group').value = targeting.targetGroup;
    document.getElementById('merchant-exclude-group').value = targeting.excludeGroup;
    const audienceInversionInput = document.querySelector(`input[name="merchant-audience-inversion"][value="${targeting.audienceInversion}"]`);
    if (audienceInversionInput) audienceInversionInput.checked = true;
    Object.entries(targeting.platformVersions).forEach(([platform, value]) => {
      document.querySelector(`[data-platform-enabled="${platform}"]`).checked = value.enabled;
      document.querySelector(`[data-platform-start="${platform}"]`).value = value.start;
      document.querySelector(`[data-platform-end="${platform}"]`).value = value.end;
    });
    document.getElementById('merchant-online-start').value = targeting.onlineStart;
    document.getElementById('merchant-online-end').value = targeting.onlineEnd;
    document.getElementById('merchant-schedule-start').value = onlineSchedule.start;
    document.getElementById('merchant-schedule-end').value = onlineSchedule.end;
    const enabledStatusInput = document.querySelector(`input[name="merchant-enabled-status"][value="${enabledStatus}"]`);
    if (enabledStatusInput) enabledStatusInput.checked = true;
    document.getElementById('merchant-test-uids').value = testPlan.uids;
    document.getElementById('merchant-test-start').value = testPlan.start;
    document.getElementById('merchant-test-end').value = testPlan.end;
    const testEnabled = document.getElementById('merchant-test-enabled');
    const testStatus = document.getElementById('merchant-test-status');
    const updateTestStatus = () => {
      testStatus.textContent = testEnabled.checked ? '生效' : '未生效';
      testStatus.classList.toggle('is-inactive', !testEnabled.checked);
    };
    testEnabled.checked = testPlan.enabled;
    updateTestStatus();
    testEnabled.addEventListener('change', updateTestStatus);
    document.getElementById('back-to-merchant-list').addEventListener('click', () => navigate?.('merchant'));
    document.getElementById('cancel-merchant-form').addEventListener('click', () => navigate?.('merchant'));
    document.getElementById('merchant-video').addEventListener('change', (event) => { const file = event.target.files[0]; document.getElementById('video-cover-row').hidden = !file; document.getElementById('video-file-name').textContent = file ? file.name : '未选择文件'; });
    document.getElementById('video-cover').addEventListener('change', (event) => { const file = event.target.files[0]; document.getElementById('cover-file-name').textContent = file ? file.name : '未选择文件'; });
    const ruleEditor = document.getElementById('merchant-rule-editor');
    if (ruleEditor) {
      document.querySelectorAll('[data-rule-command]').forEach((button) => button.addEventListener('mousedown', (event) => {
        event.preventDefault();
        ruleEditor.focus();
        document.execCommand(button.dataset.ruleCommand, false);
      }));
    }
    const trackingScenarioModal = document.getElementById('merchant-tracking-scenario-modal');
    const trackingWarningModal = document.getElementById('merchant-tracking-warning-modal');
    let pendingMerchantRecord = null;
    const persistMerchant = (merchantRecord) => {
      const updatedRecords = editingRecord ? merchantRecords.map((record) => record.id === editingRecord.id ? merchantRecord : record) : [merchantRecord, ...merchantRecords].slice(0, 10);
      window.localStorage.setItem(this.merchantStorageKey, JSON.stringify(updatedRecords));
      navigate?.('merchant');
    };
    const closeTrackingModals = () => {
      trackingScenarioModal.hidden = true;
      trackingWarningModal.hidden = true;
    };
    document.querySelector('[data-close-tracking-scenario]').addEventListener('click', closeTrackingModals);
    document.querySelector('[data-close-tracking-warning]').addEventListener('click', closeTrackingModals);
    document.getElementById('confirm-tracking-scenario').addEventListener('click', () => {
      if (!pendingMerchantRecord) return;
      const configured = document.querySelector('input[name="tracking-config-status"]:checked').value === 'configured';
      trackingScenarioModal.hidden = true;
      if (configured) persistMerchant(pendingMerchantRecord);
      else trackingWarningModal.hidden = false;
    });
    document.getElementById('disable-and-save-merchant').addEventListener('click', () => {
      if (!pendingMerchantRecord) return;
      const stoppedInput = document.querySelector('input[name="merchant-enabled-status"][value="停用"]');
      stoppedInput.checked = true;
      pendingMerchantRecord.enabledStatus = '停用';
      pendingMerchantRecord.status = '下线';
      trackingWarningModal.hidden = true;
      persistMerchant(pendingMerchantRecord);
    });
    document.getElementById('merchant-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('merchant-name');
      const category = document.getElementById('merchant-category');
      const avatar = document.getElementById('merchant-avatar');
      const requiredFields = [
        { field: avatar, label: '合作商头像' },
        { field: name, label: '合作商名称' },
        { field: category, label: '合作商分类' }
      ];
      const missingFields = requiredFields.filter(({ field }) => !(field.value || field.files?.length || (field === avatar && editingRecord?.avatarName)));
      requiredFields.forEach(({ field }) => field.closest('.form-row').classList.toggle('is-invalid', missingFields.some(({ field: missingField }) => missingField === field)));
      if (missingFields.length) {
        window.BackofficeLayout.showRequiredFieldToast(missingFields[0].label);
        return;
      }
      const avatarPreview = avatar.files[0] ? await this.readFileAsDataUrl(avatar.files[0]) : (editingRecord?.avatarPreview || '');
      const updatedTargeting = {
        identities: [...document.querySelectorAll('[data-target-identity]:checked')].map((input) => input.value),
        targetGroup: document.getElementById('merchant-target-group').value.trim(),
        excludeGroup: document.getElementById('merchant-exclude-group').value.trim(),
        audiences: [...document.querySelectorAll('[data-target-audience]:checked')].map((input) => input.value),
        audienceInversion: document.querySelector('input[name="merchant-audience-inversion"]:checked').value,
        platformVersions: Object.fromEntries(['ios', 'android', 'harmony'].map((platform) => [platform, {
          enabled: document.querySelector(`[data-platform-enabled="${platform}"]`).checked,
          start: document.querySelector(`[data-platform-start="${platform}"]`).value.trim(),
          end: document.querySelector(`[data-platform-end="${platform}"]`).value.trim()
        }])),
        onlineStart: document.getElementById('merchant-online-start').value,
        onlineEnd: document.getElementById('merchant-online-end').value
      };
      const updatedTestPlan = {
        uids: document.getElementById('merchant-test-uids').value.trim(),
        start: document.getElementById('merchant-test-start').value,
        end: document.getElementById('merchant-test-end').value,
        enabled: testEnabled.checked
      };
      const currentEnabledStatus = document.querySelector('input[name="merchant-enabled-status"]:checked').value;
      const merchantRecord = {
        id: editingRecord?.id || String(Date.now()),
        avatarName: avatar.files[0]?.name || editingRecord?.avatarName || '',
        avatarPreview,
        name: name.value.trim(),
        category: category.options[category.selectedIndex].text,
        videoName: document.getElementById('merchant-video').files[0]?.name || editingRecord?.videoName || '',
        coverName: document.getElementById('video-cover').files[0]?.name || editingRecord?.coverName || '',
        ruleContent: ruleEditor ? this.sanitizeRuleHtml(ruleEditor.innerHTML) : (editingRecord?.ruleContent || ''),
        targeting: updatedTargeting,
        testPlan: updatedTestPlan,
        onlineSchedule: {
          start: document.getElementById('merchant-schedule-start').value,
          end: document.getElementById('merchant-schedule-end').value
        },
        enabledStatus: currentEnabledStatus,
        status: currentEnabledStatus === '启用' ? '上线' : '下线'
      };
      const needsTrackingCheck = currentEnabledStatus === '启用' && (!editingRecord || enabledStatus === '停用');
      if (needsTrackingCheck) {
        pendingMerchantRecord = merchantRecord;
        trackingScenarioModal.hidden = false;
        return;
      }
      persistMerchant(merchantRecord);
    });
  }
};
