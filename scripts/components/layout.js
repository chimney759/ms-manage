window.BackofficeLayout = {
  render() {
    return `
      <div class="app">
        <aside class="sidebar" id="sidebar">
          <div class="brand"><div class="brand-mark"><b>MY</b></div><span class="brand-name">美柚省钱管理后台</span></div>
          <nav class="nav">
            <div class="nav-group open">
              <button class="nav-title" type="button"><span class="nav-icon">&#9830;</span><span class="nav-text">合作商管理</span><span class="chevron">⌃</span></button>
              <div class="subnav"><a class="active" data-view="merchant">合作商列表</a><a data-view="category">合作商分类管理</a><a data-view="merchant-detail">合作商详情页管理</a></div>
            </div>
            <div class="nav-group"><button class="nav-title" type="button"><span class="nav-icon">&#9670;</span><span class="nav-text">商品管理</span><span class="chevron">⌄</span></button><div class="subnav"><a>商品列表</a><a>商品分类</a></div></div>
            <div class="nav-group"><button class="nav-title" type="button"><span class="nav-icon">&#9673;</span><span class="nav-text">订单管理</span><span class="chevron">⌄</span></button><div class="subnav"><a>订单列表</a><a>售后管理</a></div></div>
            <div class="nav-group"><button class="nav-title" type="button"><span class="nav-icon">&#9881;</span><span class="nav-text">运营配置</span><span class="chevron">⌄</span></button><div class="subnav"><a>活动管理</a><a>资源位管理</a></div></div>
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
