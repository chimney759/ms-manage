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
    const recordId = isMerchantEdit ? view.slice('merchant-edit:'.length) : null;
    const merchantProductRecordId = isMerchantProductEdit ? view.slice('merchant-product-edit:'.length) : null;
    const styleRecordId = isDetailTemplateStyle ? view.slice('detail-template-style:'.length) : null;
    let breadcrumb = '合作商列表';
    let page = window.MerchantListPage;
    let pageMarkup = page.render();

    if (isCategory) {
      breadcrumb = '合作商分类';
      page = window.CategoryManagementPage;
      pageMarkup = page.render();
    } else if (isMerchantShelf) {
      breadcrumb = '商家页列表页管理';
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

    window.BackofficeLayout.setBreadcrumb(breadcrumb);
    pageRoot.innerHTML = pageMarkup;
    page.bind({ navigate: renderPage, recordId: isMerchantProductEdit ? merchantProductRecordId : (isDetailTemplateStyle ? styleRecordId : recordId), isAdd: isMerchantProductAdd, isEdit: isMerchantProductEdit });
  };
  window.BackofficeLayout.bindGlobalTooltips();
  window.BackofficeLayout.bindNavigation(renderPage);
  renderPage('merchant');
}());
