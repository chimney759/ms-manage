(function bootstrap() {
  const app = document.getElementById('app');
  app.innerHTML = window.BackofficeLayout.render();

  const routes = [
    { match: (view) => view === 'marketing-config', page: 'MarketingConfigPage', breadcrumb: '底Tab-内容管理', section: '营销管理' },
    { match: (view) => view === 'feed-management', page: 'MarketingConfigPage', breadcrumb: '底Tab-内容管理', section: '营销管理', homeView: 'feed', render: (page) => page.render({ homeView: 'feed' }) },
    { match: (view) => view === 'privacy-policy-modal', page: 'PrivacyPolicyModalPage', breadcrumb: '隐私政策更新', section: '配置中心' },
    { match: (view) => view === 'privacy-policy-modal-add', page: 'PrivacyPolicyModalPage', breadcrumb: '添加隐私政策更新', section: '配置中心', isAdd: true, render: (page) => page.renderForm({ recordId: null }) },
    { match: (view) => view.startsWith('privacy-policy-modal-edit:'), page: 'PrivacyPolicyModalPage', breadcrumb: '编辑隐私政策更新', section: '配置中心', getRecordId: (view) => view.slice('privacy-policy-modal-edit:'.length), isEdit: true, render: (page, recordId) => page.renderForm({ recordId }) },
    { match: (view) => view === 'force-upgrade-modal', page: 'ForceUpgradeModalPage', breadcrumb: '强制更新管理', section: '配置中心' },
    { match: (view) => view === 'force-upgrade-modal-add', page: 'ForceUpgradeModalPage', breadcrumb: '添加强制更新管理', section: '配置中心', isAdd: true, render: (page) => page.renderForm({ recordId: null }) },
    { match: (view) => view.startsWith('force-upgrade-modal-edit:'), page: 'ForceUpgradeModalPage', breadcrumb: '编辑强制更新管理', section: '配置中心', getRecordId: (view) => view.slice('force-upgrade-modal-edit:'.length), isEdit: true, render: (page, recordId) => page.renderForm({ recordId }) },
    { match: (view) => view === 'guided-upgrade-modal', page: 'GuidedUpgradeModalPage', breadcrumb: '引导更新管理', section: '配置中心' },
    { match: (view) => view === 'guided-upgrade-modal-add', page: 'GuidedUpgradeModalPage', breadcrumb: '添加引导更新管理', section: '配置中心', isAdd: true, render: (page) => page.renderForm({ recordId: null }) },
    { match: (view) => view.startsWith('guided-upgrade-modal-edit:'), page: 'GuidedUpgradeModalPage', breadcrumb: '编辑引导更新管理', section: '配置中心', getRecordId: (view) => view.slice('guided-upgrade-modal-edit:'.length), isEdit: true, render: (page, recordId) => page.renderForm({ recordId }) },
    { match: (view) => view === 'category', page: 'CategoryManagementPage', breadcrumb: '合作商分类' },
    { match: (view) => view === 'hot-search-management', page: 'HotSearchManagementPage', breadcrumb: '热搜词管理', section: '营销管理 · 搜索中间页管理' },
    { match: (view) => view === 'search-feed-management', page: 'SearchFeedManagementPage', breadcrumb: '信息流管理', section: '营销管理 · 搜索中间页管理' },
    { match: (view) => view === 'operation-popup-management', page: 'OperationPopupManagementPage', breadcrumb: '营销弹窗管理', section: '推广管理', render: (page) => page.render({ activeTab: 'home' }) },
    { match: (view) => view === 'edge-management', page: 'EdgeManagementPage', breadcrumb: '贴边管理', section: '推广管理', render: (page) => page.render({ activeTab: 'home' }) },
    { match: (view) => view === 'banner-management', page: 'BannerManagementPage', breadcrumb: '横幅管理', section: '推广管理' },
    { match: (view) => view === 'settlement-strategy-add', page: 'SettlementStrategyManagementPage', breadcrumb: '新增到账策略', section: '策略管理', isAdd: true, render: (page) => page.renderEditor({ recordId: null }) },
    { match: (view) => view.startsWith('settlement-strategy-edit:'), page: 'SettlementStrategyManagementPage', breadcrumb: '编辑到账策略', section: '策略管理', getRecordId: (view) => view.slice('settlement-strategy-edit:'.length), isEdit: true, render: (page, recordId) => page.renderEditor({ recordId }) },
    { match: (view) => view === 'settlement-strategy-management', page: 'SettlementStrategyManagementPage', breadcrumb: '到账策略管理', section: '策略管理' },
    { match: (view) => view === 'cashback-red-packet-add', page: 'CashbackRedPacketManagementPage', breadcrumb: '新增返现红包', section: '营销管理 · 营销玩法管理', isAdd: true },
    { match: (view) => view.startsWith('cashback-red-packet-edit:'), page: 'CashbackRedPacketManagementPage', breadcrumb: '编辑返现红包', section: '营销管理 · 营销玩法管理', getRecordId: (view) => view.slice('cashback-red-packet-edit:'.length), isEdit: true },
    { match: (view) => view === 'cashback-red-packet-management', page: 'CashbackRedPacketManagementPage', breadcrumb: '返现红包管理', section: '营销管理 · 营销玩法管理' },
    { match: (view) => view === 'self-built-page-add', page: 'SelfBuiltPageManagementPage', breadcrumb: 'H5页面详情', section: '营销管理', isAdd: true, render: (page) => page.renderDetail({ recordId: null }) },
    { match: (view) => view.startsWith('self-built-page-edit:'), page: 'SelfBuiltPageManagementPage', breadcrumb: 'H5页面详情', section: '营销管理', getRecordId: (view) => view.slice('self-built-page-edit:'.length), isEdit: true, render: (page, recordId) => page.renderDetail({ recordId }) },
    { match: (view) => view.startsWith('self-built-page-content:'), page: 'SelfBuiltPageManagementPage', breadcrumb: '页面内容管理', section: '营销管理', getRecordId: (view) => view.slice('self-built-page-content:'.length), isContent: true, render: (page, recordId) => page.renderContent({ recordId }) },
    { match: (view) => view === 'self-built-page-management', page: 'SelfBuiltPageManagementPage', breadcrumb: '营销落地页管理', section: '营销管理' },
    { match: (view) => view === 'merchant-shelf', page: 'MerchantShelfPage', breadcrumb: '商家列表页管理' },
    { match: (view) => view === 'merchant-product', page: 'MerchantProductListPage', breadcrumb: '货品列表（合作商）' },
    { match: (view) => view === 'merchant-product-add', page: 'MerchantProductListPage', breadcrumb: '添加货品', isAdd: true, render: (page) => page.renderAdd({ recordId: null }) },
    { match: (view) => view.startsWith('merchant-product-edit:'), page: 'MerchantProductListPage', breadcrumb: '编辑货品', getRecordId: (view) => view.slice('merchant-product-edit:'.length), isEdit: true, render: (page, recordId) => page.renderAdd({ recordId }) },
    { match: (view) => view.startsWith('detail-template-style:'), page: 'DetailTemplateStyleFormPage', breadcrumb: '模板样式编辑', getRecordId: (view) => view.slice('detail-template-style:'.length), isEdit: true, render: (page, recordId) => page.render({ recordId }) },
    { match: (view) => view === 'merchant-detail', page: 'MerchantDetailManagementPage', breadcrumb: '详情页管理（合作商）' },
    { match: (view) => view === 'merchant-add', page: 'MerchantFormPage', breadcrumb: '添加合作商', isAdd: true, render: (page) => page.render({ recordId: null }) },
    { match: (view) => view.startsWith('merchant-edit:'), page: 'MerchantFormPage', breadcrumb: '编辑合作商', getRecordId: (view) => view.slice('merchant-edit:'.length), isEdit: true, render: (page, recordId) => page.render({ recordId }) },
    { match: () => true, page: 'MerchantListPage', breadcrumb: '合作商列表' }
  ];

  const renderPage = (view) => {
    const route = routes.find((item) => item.match(view));
    const page = window[route.page];
    const recordId = route.getRecordId?.(view) || null;
    const pageRoot = document.getElementById('page-root');

    try {
      if (!page || typeof page.render !== 'function') throw new Error(`页面模块 ${route.page} 未加载`);
      const markup = route.render ? route.render(page, recordId) : page.render();
      if (typeof markup !== 'string') throw new Error(`页面模块 ${route.page} 未返回有效内容`);
      pageRoot.innerHTML = markup;
      pageRoot.dataset.renderView = view;
      window.BackofficeLayout.setBreadcrumb(route.breadcrumb, route.section);
      if (typeof page.bind === 'function') {
        page.bind({ navigate: renderPage, recordId, isAdd: Boolean(route.isAdd), isEdit: Boolean(route.isEdit), isContent: Boolean(route.isContent), homeView: route.homeView });
      }
      return true;
    } catch (error) {
      console.error(`渲染页面 ${view} 失败：`, error);
      pageRoot.innerHTML = `<section class="content"><section class="panel"><div class="empty"><div class="empty-inner"><div>页面加载失败，请重新打开该导航。</div></div></div></section></section>`;
      pageRoot.dataset.renderView = '';
      window.BackofficeLayout.setBreadcrumb(route.breadcrumb, route.section);
      return false;
    }
  };

  window.BackofficeLayout.bindGlobalTooltips();
  window.BackofficeLayout.bindNavigation(renderPage);
  renderPage('merchant');
}());
