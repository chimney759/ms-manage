(function bootstrap() {
  const app = document.getElementById('app');
  app.innerHTML = window.BackofficeLayout.render();
  const renderPage = (view) => {
    const pageRoot = document.getElementById('page-root');
    const isCategory = view === 'category';
    const isMerchantDetail = view === 'merchant-detail';
    const isDetailTemplateStyle = view.startsWith('detail-template-style:');
    const isMerchantAdd = view === 'merchant-add';
    const isMerchantEdit = view.startsWith('merchant-edit:');
    const recordId = isMerchantEdit ? view.slice('merchant-edit:'.length) : null;
    const styleRecordId = isDetailTemplateStyle ? view.slice('detail-template-style:'.length) : null;
    window.BackofficeLayout.setBreadcrumb(isCategory ? '合作商分类管理' : (isDetailTemplateStyle ? '模板样式编辑' : (isMerchantDetail ? '合作商详情页管理' : ((isMerchantAdd || isMerchantEdit) ? (isMerchantEdit ? '编辑合作商' : '添加合作商') : '合作商列表'))));
    pageRoot.innerHTML = isCategory ? window.CategoryManagementPage.render() : (isDetailTemplateStyle ? window.DetailTemplateStyleFormPage.render({ recordId: styleRecordId }) : (isMerchantDetail ? window.MerchantDetailManagementPage.render() : ((isMerchantAdd || isMerchantEdit) ? window.MerchantFormPage.render({ recordId }) : window.MerchantListPage.render())));
    const page = isCategory ? window.CategoryManagementPage : (isDetailTemplateStyle ? window.DetailTemplateStyleFormPage : (isMerchantDetail ? window.MerchantDetailManagementPage : ((isMerchantAdd || isMerchantEdit) ? window.MerchantFormPage : window.MerchantListPage)));
    page.bind({ navigate: renderPage, recordId: isDetailTemplateStyle ? styleRecordId : recordId });
  };
  window.BackofficeLayout.bindNavigation(renderPage);
  renderPage('merchant');
}());
