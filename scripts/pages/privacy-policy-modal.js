window.PrivacyPolicyModalPage = {
  storageKey: 'meiyou-cashback-privacy-policy-modal-records',
  records: [],
  escape(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  },
  readRecords() {
    try {
      const records = JSON.parse(window.localStorage.getItem(this.storageKey));
      return Array.isArray(records) ? records : [];
    } catch (error) {
      return [];
    }
  },
  saveRecords() {
    window.localStorage.setItem(this.storageKey, JSON.stringify(this.records));
  },
  getCurrentTime() {
    return new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
  },
  normalizeRecords() {
    let changed = false;
    this.records = this.records.map((record) => {
      const updatedAt = record.updatedAt || record.createdAt || '-';
      const normalized = {
        ...record,
        creator: record.creator || '管理员',
        createdAt: record.createdAt || updatedAt,
        updater: record.updater || '管理员',
        updatedAt
      };
      if (normalized.creator !== record.creator || normalized.createdAt !== record.createdAt || normalized.updater !== record.updater || normalized.updatedAt !== record.updatedAt) changed = true;
      return normalized;
    });
    if (changed) this.saveRecords();
  },
  ensureRecords() {
    if (this.records.length) return;
    this.records = [{
      id: 'demo-privacy-policy-modal', system: 'Android', enabled: '开启', minVersion: '3.5.0', maxVersion: '99.99.99', title: '隐私政策更新提醒',
      content: '<p>尊敬的用户，您好。</p><p>羊毛省钱隐私政策有更新，为了让您按需、放心的使用 App，建议您认真阅读并充分理解《隐私政策》相关条款。如您在本政策更新生效后继续使用我们提供的服务，即表示您已充分阅读、理解并接受更新后的政策条款。</p><p>请阅读完整版 <a href="#">《隐私政策》</a></p>',
      policyVersion: '1', testPlan: { uids: '100001,100086,100520', start: '2026-08-20T10:00', end: '2026-09-20T23:59', enabled: true }, creator: '管理员', createdAt: '2026-08-20 10:00:00', updater: '管理员', updatedAt: '2026-08-20 10:00:00'
    }];
    this.saveRecords();
  },
  render() {
    return `<section class="content privacy-policy-page"><div class="page-heading"><h1>隐私政策更新弹窗</h1><span class="heading-note">维护 App 隐私政策更新提醒配置</span></div><section class="panel">
      <div class="actions privacy-policy-actions"><button class="button primary" id="add-privacy-policy-modal" type="button">添加</button></div>
      <div class="table-wrap"><table class="privacy-policy-table"><thead><tr><th>系统类型</th><th>是否开启</th><th>客户端版本生效区间（含头尾）</th><th>弹窗标题</th><th>隐私政策版本</th><th>是否有测试计划</th><th>创建人</th><th>创建时间</th><th>最后更新人</th><th>更新时间</th><th>操作</th></tr></thead><tbody id="privacy-policy-table-body"></tbody></table></div>
      <div class="empty" id="privacy-policy-empty"><div class="empty-inner"><div class="empty-icon">▰</div><div>暂无隐私政策更新弹窗配置</div></div></div>
    </section></section>`;
  },
  renderForm({ recordId = null } = {}) {
    // Form markup is rendered before bind(), so hydrate persisted records here for edit routes.
    this.records = this.readRecords();
    this.ensureRecords();
    this.normalizeRecords();
    const record = this.records.find((item) => item.id === recordId);
    const isEdit = Boolean(record);
    const value = record || { system: 'Android', enabled: '开启', minVersion: '3.5.0', maxVersion: '99.99.99', title: '隐私政策更新提醒', content: '<p>尊敬的用户，您好。</p><p>羊毛省钱隐私政策有更新，为了让您按需、放心地使用 App，建议您认真阅读并充分理解《隐私政策》相关条款。</p><p>请阅读完整版 <a href="#">《隐私政策》</a></p>', policyVersion: '1', testPlan: { uids: '', start: '', end: '', enabled: false } };
    const testPlan = { uids: '', start: '', end: '', enabled: false, ...(value.testPlan || {}) };
    return `<section class="content privacy-policy-form-page"><div class="page-heading"><div class="page-title-row"><button class="back-button" id="back-to-privacy-policy-list" type="button" title="返回隐私政策更新弹窗列表">‹</button><h1>${isEdit ? '编辑隐私政策更新弹窗' : '添加隐私政策更新弹窗'}</h1></div></div>
      <form class="merchant-form privacy-policy-form" id="privacy-policy-form" novalidate>
        <section class="form-section"><h2 class="section-title">弹窗配置</h2><div class="section-body">
          <div class="form-row" id="privacy-system-row"><label class="required" for="privacy-system">系统类型：</label><div class="form-control-area"><select class="control" id="privacy-system"><option value="Android" ${value.system === 'Android' ? 'selected' : ''}>Android</option><option value="iOS" ${value.system === 'iOS' ? 'selected' : ''}>iOS</option><option value="Harmony" ${value.system === 'Harmony' ? 'selected' : ''}>Harmony</option></select></div></div>
          <div class="form-row" id="privacy-enabled-row"><label class="required">是否开启：</label><div class="form-control-area"><div class="radio-group"><label class="radio-option"><input type="radio" name="privacy-enabled" value="开启" ${value.enabled === '开启' ? 'checked' : ''} />开启</label><label class="radio-option"><input type="radio" name="privacy-enabled" value="关闭" ${value.enabled === '关闭' ? 'checked' : ''} />关闭</label></div><div class="error-message">请选择是否开启</div></div></div>
          <div class="form-row" id="privacy-version-row"><label class="required">客户端版本生效区间：</label><div class="form-control-area"><div class="version-range-fields"><input class="control" id="privacy-min-version" value="${this.escape(value.minVersion)}" placeholder="最低版本（含）" /><span>-</span><input class="control" id="privacy-max-version" value="${this.escape(value.maxVersion)}" placeholder="最高版本（含）" /></div><div class="form-help">包含最低版本与最高版本</div><div class="error-message">请填写完整客户端版本生效区间</div></div></div>
          <div class="form-row" id="privacy-title-row"><label class="required" for="privacy-title">弹窗标题：</label><div class="form-control-area"><input class="control privacy-title-input" id="privacy-title" value="${this.escape(value.title)}" placeholder="请输入弹窗标题" maxlength="40" /><div class="error-message">请输入弹窗标题</div></div></div>
          <div class="form-row privacy-content-row" id="privacy-content-row"><label class="required">弹窗内容：</label><div class="form-control-area"><div class="rich-text-editor privacy-rich-editor"><div class="rich-text-toolbar" role="toolbar" aria-label="弹窗内容编辑工具"><button type="button" data-privacy-command="bold" title="加粗"><b>B</b></button><button type="button" data-privacy-command="italic" title="斜体"><i>I</i></button><button type="button" data-privacy-command="underline" title="下划线"><u>U</u></button><button type="button" data-privacy-command="insertUnorderedList" title="无序列表">•</button><button type="button" data-privacy-command="createLink" title="添加链接">⌁</button></div><div class="rich-text-content privacy-rich-content" id="privacy-content" contenteditable="true" role="textbox" aria-multiline="true" data-placeholder="请输入弹窗内容">${value.content}</div></div><div class="error-message">请输入弹窗内容</div></div></div>
          <div class="form-row" id="privacy-policy-version-row"><label class="required" for="privacy-policy-version">隐私政策版本：</label><div class="form-control-area"><input class="control privacy-policy-version-input" id="privacy-policy-version" value="${this.escape(value.policyVersion)}" placeholder="请输入隐私政策版本" maxlength="20" /><div class="error-message">请输入隐私政策版本</div></div></div>
        </div></section>
        <section class="form-section privacy-test-plan-section"><h2 class="section-title">测试计划</h2><div class="section-body"><p class="test-plan-notice">测试 UID 内的用户将在测试有效时间内看到此隐私政策更新弹窗，到期自动终止。</p>
          <div class="form-row"><label for="privacy-test-uids">测试 UID：</label><div class="form-control-area"><input class="control privacy-test-uids-input" id="privacy-test-uids" value="${this.escape(testPlan.uids)}" placeholder="多个 UID 用英文逗号分隔" /></div></div>
          <div class="form-row date-range"><label for="privacy-test-start">测试时间：</label><div class="form-control-area"><input class="control" id="privacy-test-start" type="datetime-local" value="${this.escape(testPlan.start)}" /><span>至</span><input class="control" id="privacy-test-end" type="datetime-local" value="${this.escape(testPlan.end)}" /></div></div>
          <div class="form-row check-row"><label>测试状态：</label><div class="form-control-area"><label class="switch"><input id="privacy-test-enabled" type="checkbox" ${testPlan.enabled ? 'checked' : ''} /><span class="switch-track"></span></label><span class="status-badge" id="privacy-test-status">${testPlan.enabled ? '生效' : '未生效'}</span></div></div>
        </div></section>
        <div class="form-page-actions"><button class="button secondary" id="cancel-privacy-policy" type="button">取消</button><button class="button secondary" id="preview-privacy-policy" type="button">预览</button><button class="button primary" type="submit">保存</button></div>
      </form>
      <div class="modal privacy-preview-modal" id="privacy-preview-modal" hidden><section class="modal-card privacy-preview-card"><div class="modal-header"><h2>弹窗预览</h2><button class="icon-close" id="close-privacy-preview" type="button" title="关闭">×</button></div><div class="privacy-popup-preview"><h3 id="privacy-preview-title"></h3><div id="privacy-preview-content"></div><button type="button">我已阅读并同意</button></div></section></div>
    </section>`;
  },
  bind({ navigate, recordId, isAdd, isEdit } = {}) {
    this.records = this.readRecords();
    this.ensureRecords();
    this.normalizeRecords();
    if (isAdd || isEdit) {
      this.bindForm({ navigate, recordId });
      return;
    }
    const renderTable = () => {
      const tableBody = document.getElementById('privacy-policy-table-body');
      tableBody.innerHTML = this.records.map((record) => {
        const testPlan = record.testPlan || {};
        const hasTestPlan = Boolean(testPlan.uids || testPlan.start || testPlan.end || testPlan.enabled);
        return `<tr><td>${this.escape(record.system)}</td><td>${window.BackofficeLayout.statusTag(record.enabled)}</td><td>${this.escape(record.minVersion)} - ${this.escape(record.maxVersion)}</td><td>${this.escape(record.title)}</td><td>${this.escape(record.policyVersion)}</td><td>${hasTestPlan ? '有' : '-'}</td><td>${this.escape(record.creator || '-')}</td><td>${this.escape(record.createdAt || '-')}</td><td>${this.escape(record.updater || '-')}</td><td>${this.escape(record.updatedAt || '-')}</td><td><div class="table-actions"><button class="table-action" type="button" data-privacy-edit-id="${this.escape(record.id)}">编辑</button></div></td></tr>`;
      }).join('');
      document.getElementById('privacy-policy-empty').hidden = this.records.length > 0;
    };
    renderTable();
    document.getElementById('add-privacy-policy-modal').addEventListener('click', () => navigate?.('privacy-policy-modal-add'));
    document.getElementById('privacy-policy-table-body').addEventListener('click', (event) => {
      const editButton = event.target.closest('[data-privacy-edit-id]');
      if (editButton) navigate?.(`privacy-policy-modal-edit:${editButton.dataset.privacyEditId}`);
    });
  },
  bindForm({ navigate, recordId }) {
    const form = document.getElementById('privacy-policy-form');
    const editor = document.getElementById('privacy-content');
    const goBack = () => navigate?.('privacy-policy-modal');
    const commandButtons = document.querySelectorAll('[data-privacy-command]');
    commandButtons.forEach((button) => button.addEventListener('click', () => {
      editor.focus();
      const command = button.dataset.privacyCommand;
      if (command === 'createLink') {
        const url = window.prompt('请输入链接地址', 'https://');
        if (url) document.execCommand(command, false, url);
      } else {
        document.execCommand(command, false, null);
      }
    }));
    const previewModal = document.getElementById('privacy-preview-modal');
    const openPreview = () => {
      document.getElementById('privacy-preview-title').textContent = document.getElementById('privacy-title').value.trim() || '隐私政策更新提醒';
      document.getElementById('privacy-preview-content').innerHTML = editor.innerHTML || '请填写弹窗内容';
      previewModal.hidden = false;
    };
    document.getElementById('back-to-privacy-policy-list').addEventListener('click', goBack);
    document.getElementById('cancel-privacy-policy').addEventListener('click', goBack);
    document.getElementById('preview-privacy-policy').addEventListener('click', openPreview);
    document.getElementById('close-privacy-preview').addEventListener('click', () => { previewModal.hidden = true; });
    previewModal.addEventListener('click', (event) => { if (event.target === previewModal) previewModal.hidden = true; });
    document.getElementById('privacy-test-enabled').addEventListener('change', (event) => {
      document.getElementById('privacy-test-status').textContent = event.target.checked ? '生效' : '未生效';
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const enabled = form.querySelector('input[name="privacy-enabled"]:checked')?.value || '';
      const minVersion = document.getElementById('privacy-min-version').value.trim();
      const maxVersion = document.getElementById('privacy-max-version').value.trim();
      const title = document.getElementById('privacy-title').value.trim();
      const content = editor.innerHTML.trim();
      const policyVersion = document.getElementById('privacy-policy-version').value.trim();
      const validations = [[enabled, 'privacy-enabled-row', '是否开启'], [minVersion && maxVersion, 'privacy-version-row', '客户端版本生效区间'], [title, 'privacy-title-row', '弹窗标题'], [editor.textContent.trim(), 'privacy-content-row', '弹窗内容'], [policyVersion, 'privacy-policy-version-row', '隐私政策版本']];
      validations.forEach(([valid, rowId]) => document.getElementById(rowId).classList.toggle('is-invalid', !valid));
      const missing = validations.find(([valid]) => !valid);
      if (missing) { window.BackofficeLayout.showRequiredFieldToast(missing[2]); return; }
      const now = this.getCurrentTime();
      const testPlan = {
        uids: document.getElementById('privacy-test-uids').value.trim(),
        start: document.getElementById('privacy-test-start').value,
        end: document.getElementById('privacy-test-end').value,
        enabled: document.getElementById('privacy-test-enabled').checked
      };
      const testPlanError = window.ConfigurationSections.validateTestPlan(testPlan);
      if (testPlanError) {
        window.BackofficeLayout.showToast('测试计划校验失败', testPlanError);
        return;
      }
      const data = { system: document.getElementById('privacy-system').value, enabled, minVersion, maxVersion, title, content, policyVersion, testPlan, updater: '管理员', updatedAt: now };
      if (recordId) this.records = this.records.map((item) => item.id === recordId ? { ...item, ...data } : item);
      else this.records.unshift({ id: `privacy-policy-${Date.now()}`, ...data, creator: '管理员', createdAt: now });
      this.saveRecords();
      window.BackofficeLayout.showToast('保存成功');
      goBack();
    });
  }
};
