window.BackofficeDemoData = {
  categoryStorageKey: 'meiyou-cashback-category-records',
  merchantStorageKey: 'meiyou-cashback-merchant-records',
  templateStorageKey: 'meiyou-cashback-merchant-detail-templates',
  versionStorageKey: 'meiyou-cashback-demo-data-version',
  read(storageKey) {
    try {
      const records = JSON.parse(window.localStorage.getItem(storageKey));
      return Array.isArray(records) ? records : [];
    } catch (error) {
      return [];
    }
  },
  write(storageKey, records) {
    window.localStorage.setItem(storageKey, JSON.stringify(records));
  },
  ensure() {
    if (window.localStorage.getItem(this.versionStorageKey) === 'scenario-v6') return;
    const timestamp = '2026-08-16 10:00:00';
    const replaceDemoRecords = (records, seeds) => [...seeds, ...records.filter((record) => !String(record.id || '').startsWith('demo-'))];
    const categories = replaceDemoRecords(this.read(this.categoryStorageKey), [
      { id: 'demo-category-recharge', recordName: '充值服务合作商分类', categoryName: '生活充值', status: '启用', creator: '管理员', createdAt: timestamp, updater: '管理员', updatedAt: timestamp },
      { id: 'demo-category-commerce', recordName: '电商服务合作商分类', categoryName: '电商购物', status: '启用', creator: '管理员', createdAt: timestamp, updater: '管理员', updatedAt: timestamp },
      { id: 'demo-category-coupon', recordName: '卡券服务合作商分类', categoryName: '优惠卡券', status: '启用', creator: '管理员', createdAt: timestamp, updater: '管理员', updatedAt: timestamp }
    ]);
    this.write(this.categoryStorageKey, categories);

    const avatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"%3E%3Crect width="160" height="160" rx="28" fill="%23ff7aa7"/%3E%3Cpath d="M43 72c0-16 13-29 29-29h16c16 0 29 13 29 29v45H43V72Z" fill="%23fff" opacity=".94"/%3E%3Cpath d="M60 83h40M60 100h28" stroke="%23ff7aa7" stroke-width="8" stroke-linecap="round"/%3E%3C/svg%3E';
    const merchants = replaceDemoRecords(this.read(this.merchantStorageKey), [
      { id: 'demo-merchant-recharge', avatarName: '乐充服务头像.svg', avatarPreview: avatar, name: '乐充生活服务', category: '生活充值', videoName: '', coverName: '', ruleContent: '<p><b>服务规则</b></p><p>充值到账后不可退款，请在支付前确认充值账号及面额。</p><ul><li>优惠以支付页面展示为准</li><li>到账时间以运营商实际处理结果为准</li></ul>', status: '上线' },
      { id: 'demo-merchant-commerce', avatarName: '优选商城头像.svg', avatarPreview: avatar, name: '优选商城', category: '电商购物', videoName: '', coverName: '', ruleContent: '', status: '上线' },
      { id: 'demo-merchant-coupon', avatarName: '优享卡券头像.svg', avatarPreview: avatar, name: '优享卡券中心', category: '优惠卡券', videoName: '', coverName: '', ruleContent: '<p><b>卡券使用说明</b></p><p>请在有效期内使用卡券，具体使用范围以卡券详情页说明为准。</p>', status: '上线' }
    ]);
    this.write(this.merchantStorageKey, merchants);

    const templates = replaceDemoRecords(this.read(this.templateStorageKey), [
      { id: 'demo-template-recharge-category', name: '充值详情页-分类兜底模板', type: '充值详情页', level: '分类兜底模板', category: '生活充值', merchantIds: [], merchantNames: [], status: '启用', updatedAt: timestamp, styleComponents: [{ id: 'demo-recharge-category-flow', type: 'merchantProductFlow', title: '热门充值', selectedProductIds: ['demo-merchant-recharge-303', 'demo-merchant-recharge-127', 'demo-merchant-recharge-85', 'demo-merchant-recharge-1635', 'demo-merchant-recharge-1314', 'demo-merchant-recharge-133'], productCategories: { 'demo-merchant-recharge-303': '黄金会员', 'demo-merchant-recharge-127': '黄金会员', 'demo-merchant-recharge-85': '白金会员', 'demo-merchant-recharge-1635': '白金会员', 'demo-merchant-recharge-1314': '星钻VIP', 'demo-merchant-recharge-133': '星钻VIP' } }], rechargeDetailConfig: { actionText: '优惠充值', categories: ['黄金会员', '白金会员', '星钻VIP'] } },
      { id: 'demo-template-recharge-custom', name: '充值详情页-定制模板', type: '充值详情页', level: '定制模板', category: '', merchantIds: ['demo-merchant-recharge'], merchantNames: ['乐充生活服务'], status: '启用', updatedAt: timestamp, styleComponents: [{ id: 'demo-recharge-custom-flow', type: 'merchantProductFlow', title: '乐充推荐', selectedProductIds: ['demo-merchant-recharge-303', 'demo-merchant-recharge-127', 'demo-merchant-recharge-85', 'demo-merchant-recharge-1635', 'demo-merchant-recharge-1314', 'demo-merchant-recharge-133'], productCategories: { 'demo-merchant-recharge-303': '黄金会员', 'demo-merchant-recharge-127': '黄金会员', 'demo-merchant-recharge-85': '白金会员', 'demo-merchant-recharge-1635': '白金会员', 'demo-merchant-recharge-1314': '星钻VIP', 'demo-merchant-recharge-133': '星钻VIP' } }], rechargeDetailConfig: { actionText: '优惠充值', categories: ['黄金会员', '白金会员', '星钻VIP'] } },
      { id: 'demo-template-commerce-category', name: '电商详情页-分类兜底模板', type: '电商详情页', level: '分类兜底模板', category: '电商购物', merchantIds: [], merchantNames: [], status: '启用', updatedAt: timestamp, styleComponents: [{ id: 'demo-commerce-category-search', type: 'search', placeholder: '搜索商品、品牌或优惠' }, { id: 'demo-commerce-category-feed', type: 'productFlow', title: '精选商品', library: '', libraryId: '10001', libraryName: '电商精选应用库' }] },
      { id: 'demo-template-commerce-custom', name: '电商详情页-定制模板', type: '电商详情页', level: '定制模板', category: '', merchantIds: ['demo-merchant-commerce'], merchantNames: ['优选商城'], status: '启用', updatedAt: timestamp, styleComponents: [{ id: 'demo-commerce-custom-search', type: 'search', placeholder: '搜优选好物' }, { id: 'demo-commerce-custom-feed', type: 'productFlow', title: '优选推荐', library: '', libraryId: '10002', libraryName: '优选商城应用库' }] },
      { id: 'demo-template-coupon-category', name: '卡券详情页-分类兜底模板', type: '卡券详情页', level: '分类兜底模板', category: '优惠卡券', merchantIds: [], merchantNames: [], status: '启用', updatedAt: timestamp, styleComponents: [{ id: 'demo-coupon-category-flow', type: 'merchantProductFlow', title: '热门优惠卡券', selectedProductIds: ['demo-merchant-coupon-2101', 'demo-merchant-coupon-2102', 'demo-merchant-coupon-2103'] }] },
      { id: 'demo-template-coupon-custom', name: '卡券详情页-定制模板', type: '卡券详情页', level: '定制模板', category: '', merchantIds: ['demo-merchant-coupon'], merchantNames: ['优享卡券中心'], status: '启用', updatedAt: timestamp, styleComponents: [{ id: 'demo-coupon-custom-flow', type: 'merchantProductFlow', title: '优享卡券推荐', selectedProductIds: ['demo-merchant-coupon-2101', 'demo-merchant-coupon-2102', 'demo-merchant-coupon-2103'] }] }
    ]);
    this.write(this.templateStorageKey, templates);
    window.localStorage.setItem(this.versionStorageKey, 'scenario-v6');
  }
};

window.BackofficeLayout = {
  render() {
    return `
      <div class="app">
        <aside class="sidebar" id="sidebar">
          <div class="brand"><div class="brand-mark"><b>MY</b></div><span class="brand-name">美柚省钱管理后台</span></div>
          <nav class="nav">
            <div class="nav-group open">
              <button class="nav-title" type="button"><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><span class="nav-text">合作商管理</span><span class="chevron">⌃</span></button>
              <div class="subnav"><a class="active" data-view="merchant">合作商列表</a><a data-view="category">合作商分类管理</a><a data-view="merchant-detail">合作商详情页管理</a></div>
            </div>
            <div class="nav-group"><button class="nav-title" type="button"><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 2h12l2 5-2 3H6L4 7z"/><path d="M4 7v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M9 13h6"/></svg></span><span class="nav-text">商品管理</span><span class="chevron">⌄</span></button><div class="subnav"><a>商品列表</a><a>商品分类</a></div></div>
            <div class="nav-group"><button class="nav-title" type="button"><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 5h18v14H3z"/><path d="M3 10h18M7 15h4"/></svg></span><span class="nav-text">订单管理</span><span class="chevron">⌄</span></button><div class="subnav"><a>订单列表</a><a>售后管理</a></div></div>
            <div class="nav-group"><button class="nav-title" type="button"><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M18.36 5.64l-2.12 2.12M7.76 16.24l-2.12 2.12"/><circle cx="12" cy="12" r="4"/></svg></span><span class="nav-text">运营配置</span><span class="chevron">⌄</span></button><div class="subnav"><a>活动管理</a><a>资源位管理</a></div></div>
          </nav>
        </aside>
        <main class="main">
          <header class="topbar"><button class="collapse" id="collapse" type="button" title="收起导航">☰</button><div class="breadcrumb" id="breadcrumb"></div><div class="account"><div class="avatar">柚</div><span>管理员</span><span>⌄</span></div></header>
          <div id="page-root"></div>
          <div class="form-toast" id="global-form-toast" role="status" aria-live="polite" hidden><strong>有必填项未填写</strong><span id="global-form-toast-field"></span></div>
        </main>
      </div>`;
  },
  setBreadcrumb(pageName) {
    document.getElementById('breadcrumb').innerHTML = `<strong>首页</strong><span>/</span><span>合作商管理</span><span>/</span><span>${pageName}</span>`;
  },
  showRequiredFieldToast(fieldName) {
    const toast = document.getElementById('global-form-toast');
    document.getElementById('global-form-toast-field').textContent = `如：${fieldName}`;
    toast.hidden = false;
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3000);
  },
  showToast(title, detail = '') {
    const toast = document.getElementById('global-form-toast');
    toast.querySelector('strong').textContent = title;
    toast.querySelector('span').textContent = detail;
    toast.hidden = false;
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2400);
  },
  setAddModalMode(modal, isAdd) {
    modal.classList.toggle('is-add-fullscreen', isAdd);
    const closeButton = modal.querySelector('.icon-close');
    if (!closeButton) return;
    closeButton.textContent = isAdd ? '‹' : '×';
    closeButton.title = isAdd ? '返回' : '关闭';
    closeButton.setAttribute('aria-label', isAdd ? '返回' : '关闭');
  },
  bindNavigation(onChange) {
    const sidebar = document.getElementById('sidebar');
    document.getElementById('collapse').addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    document.querySelectorAll('.nav-title').forEach((button) => button.addEventListener('click', () => button.parentElement.classList.toggle('open')));
    document.querySelectorAll('[data-view]').forEach((item) => item.addEventListener('click', () => {
      document.querySelectorAll('[data-view]').forEach((link) => link.classList.remove('active'));
      item.classList.add('active');
      onChange(item.dataset.view);
    }));
  }
};
