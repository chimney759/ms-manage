(function bootstrap() {
  const app = document.getElementById('app');
  app.innerHTML = window.BackofficeLayout.render();
  const renderPage = (view) => {
    const pageRoot = document.getElementById('page-root');
    const isCategory = view === 'category';
    const isMerchantDetail = view === 'merchant-detail';
    const isMerchantShelf = view === 'merchant-shelf';
    const isMerchantProduct = view === 'merchant-product';
    const isMerchantProductAdd = view === 'merchant-product-add';
    const isMerchantProductEdit = view.startsWith('merchant-product-edit:');
    const isDetailTemplateStyle = view.startsWith('detail-template-style:');
    const isMerchantAdd = view === 'merchant-add';
    const isMerchantEdit = view.startsWith('merchant-edit:');
    const isForceUpgradeModal = view === 'force-upgrade-modal';
    const isForceUpgradeModalAdd = view === 'force-upgrade-modal-add';
    const isForceUpgradeModalEdit = view.startsWith('force-upgrade-modal-edit:');
    const isGuidedUpgradeModal = view === 'guided-upgrade-modal';
    const isGuidedUpgradeModalAdd = view === 'guided-upgrade-modal-add';
    const isGuidedUpgradeModalEdit = view.startsWith('guided-upgrade-modal-edit:');
    const isPrivacyPolicyModal = view === 'privacy-policy-modal';
    const isPrivacyPolicyModalAdd = view === 'privacy-policy-modal-add';
    const isPrivacyPolicyModalEdit = view.startsWith('privacy-policy-modal-edit:');
    const recordId = isMerchantEdit ? view.slice('merchant-edit:'.length) : null;
    const merchantProductRecordId = isMerchantProductEdit ? view.slice('merchant-product-edit:'.length) : null;
    const styleRecordId = isDetailTemplateStyle ? view.slice('detail-template-style:'.length) : null;
    const privacyPolicyRecordId = isPrivacyPolicyModalEdit ? view.slice('privacy-policy-modal-edit:'.length) : null;
    const forceUpgradeRecordId = isForceUpgradeModalEdit ? view.slice('force-upgrade-modal-edit:'.length) : null;
    const guidedUpgradeRecordId = isGuidedUpgradeModalEdit ? view.slice('guided-upgrade-modal-edit:'.length) : null;
    let breadcrumb = '合作商列表';
    let breadcrumbSection = '合作商管理';
    let page = window.MerchantListPage;
    let pageMarkup = page.render();

    if (isPrivacyPolicyModal || isPrivacyPolicyModalAdd || isPrivacyPolicyModalEdit) {
      breadcrumb = isPrivacyPolicyModalEdit ? '编辑隐私政策更新弹窗' : (isPrivacyPolicyModalAdd ? '添加隐私政策更新弹窗' : '隐私政策更新弹窗');
      breadcrumbSection = '配置中心';
      page = window.PrivacyPolicyModalPage;
      pageMarkup = isPrivacyPolicyModalAdd || isPrivacyPolicyModalEdit ? page.renderForm({ recordId: privacyPolicyRecordId }) : page.render();
    } else if (isForceUpgradeModal || isForceUpgradeModalAdd || isForceUpgradeModalEdit) {
      breadcrumb = isForceUpgradeModalEdit ? '编辑强制升级弹窗' : (isForceUpgradeModalAdd ? '添加强制升级弹窗' : '强制升级弹窗');
      breadcrumbSection = '配置中心';
      page = window.ForceUpgradeModalPage;
      pageMarkup = isForceUpgradeModalAdd || isForceUpgradeModalEdit ? page.renderForm({ recordId: forceUpgradeRecordId }) : page.render();
    } else if (isGuidedUpgradeModal || isGuidedUpgradeModalAdd || isGuidedUpgradeModalEdit) {
      breadcrumb = isGuidedUpgradeModalEdit ? '编辑引导升级弹窗' : (isGuidedUpgradeModalAdd ? '添加引导升级弹窗' : '引导升级弹窗');
      breadcrumbSection = '配置中心';
      page = window.GuidedUpgradeModalPage;
      pageMarkup = isGuidedUpgradeModalAdd || isGuidedUpgradeModalEdit ? page.renderForm({ recordId: guidedUpgradeRecordId }) : page.render();
    } else if (isCategory) {
      breadcrumb = '合作商分类';
      page = window.CategoryManagementPage;
      pageMarkup = page.render();
    } else if (isMerchantShelf) {
      breadcrumb = '商家列表页管理';
      page = window.MerchantShelfPage;
      pageMarkup = page.render();
    } else if (isMerchantProductAdd || isMerchantProductEdit) {
      breadcrumb = isMerchantProductEdit ? '编辑货品' : '添加货品';
      page = window.MerchantProductListPage;
      pageMarkup = page.renderAdd({ recordId: merchantProductRecordId });
    } else if (isMerchantProduct) {
      breadcrumb = '货品列表（合作商）';
      page = window.MerchantProductListPage;
      pageMarkup = page.render();
    } else if (isDetailTemplateStyle) {
      breadcrumb = '模板样式编辑';
      page = window.DetailTemplateStyleFormPage;
      pageMarkup = page.render({ recordId: styleRecordId });
    } else if (isMerchantDetail) {
      breadcrumb = '详情页管理（合作商）';
      page = window.MerchantDetailManagementPage;
      pageMarkup = page.render();
    } else if (isMerchantAdd || isMerchantEdit) {
      breadcrumb = isMerchantEdit ? '编辑合作商' : '添加合作商';
      page = window.MerchantFormPage;
      pageMarkup = page.render({ recordId });
    }

    window.BackofficeLayout.setBreadcrumb(breadcrumb, breadcrumbSection);
    pageRoot.innerHTML = pageMarkup;
    page.bind({ navigate: renderPage, recordId: isMerchantProductEdit ? merchantProductRecordId : (isDetailTemplateStyle ? styleRecordId : (isPrivacyPolicyModalEdit ? privacyPolicyRecordId : (isForceUpgradeModalEdit ? forceUpgradeRecordId : (isGuidedUpgradeModalEdit ? guidedUpgradeRecordId : recordId)))), isAdd: isMerchantProductAdd || isPrivacyPolicyModalAdd || isForceUpgradeModalAdd || isGuidedUpgradeModalAdd, isEdit: isMerchantProductEdit || isPrivacyPolicyModalEdit || isForceUpgradeModalEdit || isGuidedUpgradeModalEdit });
  };
  window.BackofficeLayout.bindGlobalTooltips();
  window.BackofficeLayout.bindNavigation(renderPage);
  renderPage('merchant');
}());
