(function bootstrap() {
  const app = document.getElementById('app');
  app.innerHTML = window.BackofficeLayout.render();

  const routes = [
    { match: (view) => view === 'marketing-config', page: 'MarketingConfigPage', breadcrumb: '首页-功能区营销', section: '营销管理 · 首页管理' },
    { match: (view) => view === 'feed-management', page: 'MarketingConfigPage', breadcrumb: '首页-功能区营销', section: '营销管理 · 首页管理', homeView: 'feed', render: (page) => page.render({ homeView: 'feed' }) },
    { match: (view) => view === 'privacy-policy-modal', page: 'PrivacyPolicyModalPage', breadcrumb: '隐私政策更新弹窗', section: '配置中心' },
    { match: (view) => view === 'privacy-policy-modal-add', page: 'PrivacyPolicyModalPage', breadcrumb: '添加隐私政策更新弹窗', section: '配置中心', isAdd: true },
    { match: (view) => view.startsWith('privacy-policy-modal-edit:'), page: 'PrivacyPolicyModalPage', breadcrumb: '编辑隐私政策更新弹窗', section: '配置中心', getRecordId: (view) => view.slice('privacy-policy-modal-edit:'.length), isEdit: true },
    { match: (view) => view === 'force-upgrade-modal', page: 'ForceUpgradeModalPage', breadcrumb: '强制升级弹窗', section: '配置中心' },
    { match: (view) => view === 'force-upgrade-modal-add', page: 'ForceUpgradeModalPage', breadcrumb: '添加强制升级弹窗', section: '配置中心', isAdd: true },
    { match: (view) => view.startsWith('force-upgrade-modal-edit:'), page: 'ForceUpgradeModalPage', breadcrumb: '编辑强制升级弹窗', section: '配置中心', getRecordId: (view) => view.slice('force-upgrade-modal-edit:'.length), isEdit: true },
    { match: (view) => view === 'guided-upgrade-modal', page: 'GuidedUpgradeModalPage', breadcrumb: '引导升级弹窗', section: '配置中心' },
    { match: (view) => view === 'guided-upgrade-modal-add', page: 'GuidedUpgradeModalPage', breadcrumb: '添加引导升级弹窗', section: '配置中心', isAdd: true },
    { match: (view) => view.startsWith('guided-upgrade-modal-edit:'), page: 'GuidedUpgradeModalPage', breadcrumb: '编辑引导升级弹窗', section: '配置中心', getRecordId: (view) => view.slice('guided-upgrade-modal-edit:'.length), isEdit: true },
    { match: (view) => view === 'category', page: 'CategoryManagementPage', breadcrumb: '合作商分类' },
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
    window.BackofficeLayout.setBreadcrumb(route.breadcrumb, route.section);
    document.getElementById('page-root').innerHTML = route.render ? route.render(page, recordId) : page.render();
    page.bind({ navigate: renderPage, recordId, isAdd: Boolean(route.isAdd), isEdit: Boolean(route.isEdit), homeView: route.homeView });
  };

  window.BackofficeLayout.bindGlobalTooltips();
  window.BackofficeLayout.bindNavigation(renderPage);
  renderPage('merchant');
}());
