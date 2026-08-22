window.ForceUpgradeModalPage = {
  storageKey: 'meiyou-cashback-force-upgrade-modal-records',
  records: [],
  escape(value) { return window.PrivacyPolicyModalPage.escape.call(this, value); },
  readRecords() { return window.PrivacyPolicyModalPage.readRecords.call(this); },
  saveRecords() { return window.PrivacyPolicyModalPage.saveRecords.call(this); },
  getCurrentTime() { return window.PrivacyPolicyModalPage.getCurrentTime.call(this); },
  normalizeRecords() { return window.PrivacyPolicyModalPage.normalizeRecords.call(this); },
  ensureRecords() {
    if (this.records.length) return;
    this.records = [{
      id: 'demo-force-upgrade-modal', system: 'Android', enabled: '开启', minVersion: '3.5.0', maxVersion: '99.99.99', title: '发现新版本',
      content: '<p>当前版本存在重要更新，请升级到最新版本后继续使用。</p><p>本次升级包含性能优化与体验改进。</p>',
      policyVersion: '9.21.0', testPlan: { uids: '100001,100086,100520', start: '2026-08-20T10:00', end: '2026-09-20T23:59', enabled: true }, creator: '管理员', createdAt: '2026-08-20 10:00:00', updater: '管理员', updatedAt: '2026-08-20 10:00:00'
    }];
    this.saveRecords();
  },
  adaptCopy(markup) {
    return markup.replaceAll('隐私政策更新弹窗', '强制升级弹窗').replaceAll('隐私政策版本', '升级版本').replaceAll('隐私政策有更新', 'App 有新版本可升级').replaceAll('此隐私政策更新弹窗', '此强制升级弹窗').replaceAll('《隐私政策》', '《升级说明》').replaceAll('我已阅读并同意</button>', '去更新</button><button class="privacy-popup-exit" type="button">放弃更新</button>');
  },
  render() { return this.adaptCopy(window.PrivacyPolicyModalPage.render.call(this)); },
  renderForm({ recordId = null } = {}) { return this.adaptCopy(window.PrivacyPolicyModalPage.renderForm.call(this, { recordId })); },
  bindForm({ navigate, recordId }) { return window.PrivacyPolicyModalPage.bindForm.call(this, { navigate, recordId }); },
  bind({ navigate, recordId, isAdd, isEdit } = {}) {
    window.PrivacyPolicyModalPage.bind.call(this, { recordId, isAdd, isEdit, navigate: (view) => {
      if (view === 'privacy-policy-modal') navigate?.('force-upgrade-modal');
      else if (view === 'privacy-policy-modal-add') navigate?.('force-upgrade-modal-add');
      else if (view.startsWith('privacy-policy-modal-edit:')) navigate?.(`force-upgrade-modal-edit:${view.slice('privacy-policy-modal-edit:'.length)}`);
      else navigate?.(view);
    } });
  }
};
