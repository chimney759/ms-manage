window.MerchantProductListPage = {
  storageKey: 'meiyou-cashback-merchant-products',
  merchantStorageKey: 'meiyou-cashback-merchant-records',
  successMessageKey: 'meiyou-cashback-merchant-products-success-message',
  records: [],
  escape(value = '') {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  },
  merchants() {
    try {
      const records = JSON.parse(window.localStorage.getItem(this.merchantStorageKey));
      return Array.isArray(records) ? records.filter((record) => record.name) : [];
    } catch (error) { return []; }
  },
  createDemoRecords() {
    const seeds = [
      ['303', '超级影视VIP月卡', '腾讯视频', '直充', '27.04', '50'],
      ['127', 'VIP会员季卡', '喜马拉雅', '直充', '37.87', '73'],
      ['85', '普通会员月卡', '优酷视频', '直充', '14.62', '30'],
      ['2101', '京东购物满200减20券', '京东', '卡券', '18.00', '20'],
      ['2102', '星巴克咖啡代金券', '星巴克', '卡券', '28.00', '35'],
      ['2103', '电影通兑优惠券', '猫眼电影', '卡券', '36.00', '45']
    ];
    const merchants = this.merchants();
    return seeds.map((seed, index) => {
      const merchant = merchants[index % Math.max(merchants.length, 1)] || { id: `demo-supplier-${index}`, name: '待配置合作商' };
      const [supplierProductNo, title, brand, type, cost, officialPrice] = seed;
      return { id: `demo-merchant-product-${supplierProductNo}`, supplierId: merchant.id, supplier: merchant.name, supplierProductNo, title, brand, type, cost, officialPrice, status: index === 5 ? '已下线' : '上线中', updatedAt: '2026-08-16 10:00:00' };
    });
  },
  loadRecords() {
    window.BackofficeDemoData?.ensure();
    try {
      const stored = JSON.parse(window.localStorage.getItem(this.storageKey));
      this.records = Array.isArray(stored) && stored.length ? stored : this.createDemoRecords();
    } catch (error) { this.records = this.createDemoRecords(); }
    this.saveRecords();
  },
  saveRecords() { window.localStorage.setItem(this.storageKey, JSON.stringify(this.records)); },
  render() {
    return `<section class="content"><div class="page-heading"><div class="page-title-row"><h1>合作商-货品列表</h1><button class="help-tooltip merchant-product-definition-tooltip" type="button" aria-label="合作商货品定义" data-tooltip="定义：合作商货品是供应链及仓储模块的基础数据实体，代表仓库中实际存在的最小不可拆分库存单元。它独立于前台销售逻辑，不包含任何营销属性（如折扣、活动价），仅记录物理状态，例如采购成本、官方价、货品标题、商品类型等。">?</button></div><span class="heading-note">维护合作商提供的货品信息</span></div><section class="panel">
      <div class="filters merchant-product-filters">
        <div class="field"><label for="merchant-product-supplier">合作商：</label><select class="control" id="merchant-product-supplier"><option value="">全部</option></select></div>
        <div class="field"><label for="merchant-product-title">货品标题：</label><input class="control" id="merchant-product-title" placeholder="请输入货品标题" /></div>
        <div class="field"><label for="merchant-product-no">合作商货品编号：</label><input class="control" id="merchant-product-no" placeholder="请输入合作商货品编号" /></div>
        <div class="field"><label>状态：</label><div class="filter-checkboxes"><label><input type="checkbox" name="merchant-product-status" value="上线中" checked />上线中</label><label><input type="checkbox" name="merchant-product-status" value="已下线" checked />已下线</label></div></div>
        <div class="field"><label for="merchant-product-type">商品类型：</label><select class="control" id="merchant-product-type"><option value="">全部</option><option value="卡券">卡券</option><option value="直充">直充</option></select></div>
      </div>
      <div class="actions"><button class="button primary" id="merchant-product-search" type="button">搜索</button><button class="button secondary" id="merchant-product-reset" type="button">重置</button><button class="button primary" id="open-merchant-product-modal" type="button">添加货品</button></div>
      <div class="table-wrap"><table class="merchant-product-table"><thead><tr><th>合作商</th><th>合作商货品编号</th><th>货品标题</th><th>品牌名称</th><th>商品类型</th><th>成本价</th><th>官方价</th><th>状态</th><th>更新时间</th><th>操作</th></tr></thead><tbody id="merchant-product-table-body"></tbody></table></div>
      <div class="empty" id="merchant-product-empty"><div class="empty-inner"><div class="empty-icon">▰</div><div>暂无数据</div></div></div>
    </section></section>`;
  },
  renderAdd({ recordId = null } = {}) {
    const isEdit = Boolean(recordId);
    return `<section class="content"><div class="page-heading"><div class="page-title-row"><button class="back-button" id="back-to-merchant-products" type="button" title="返回合作商货品列表">‹</button><h1>${isEdit ? '编辑货品' : '添加货品'}</h1></div></div><form class="merchant-product-form merchant-form" id="merchant-product-form" novalidate><section class="form-section"><h2 class="section-title">基本信息</h2><div class="section-body">
      <div class="form-row" id="merchant-product-supplier-row"><label class="required" for="merchant-product-form-supplier">合作商：</label><div class="form-control-area"><select class="control" id="merchant-product-form-supplier"><option value="">请选择合作商</option></select><div class="error-message">请选择合作商</div></div></div>
      <div class="form-row" id="merchant-product-form-type-row"><label class="required">货品类型：</label><div class="form-control-area"><div class="radio-group" role="radiogroup" aria-label="货品类型"><label class="radio-option"><input type="radio" name="merchant-product-form-type" value="直充" />直充</label><label class="radio-option"><input type="radio" name="merchant-product-form-type" value="卡券" />卡券</label></div><div class="error-message">请选择货品类型</div></div></div>
      <div class="form-row" id="merchant-product-form-title-row"><label class="required" for="merchant-product-form-title">货品名称：</label><div class="form-control-area"><div class="control-with-tooltip"><input class="control" id="merchant-product-form-title" placeholder="请输入货品名称，仅在后台展示" maxlength="60" /><button class="help-tooltip" type="button" aria-label="货品名称说明" data-tooltip="用于识别合作货品，仅作为后台记录使用">?</button></div><div class="error-message">请输入货品名称</div></div></div>
      <div class="form-row" id="merchant-product-cost-row"><label class="required" for="merchant-product-form-cost">成本价：</label><div class="form-control-area"><input class="control" id="merchant-product-form-cost" placeholder="请输入成本价" inputmode="decimal" /><div class="error-message">请输入成本价</div></div></div>
      <div class="form-row"><label for="merchant-product-form-brand">品牌名称：</label><div class="form-control-area"><input class="control" id="merchant-product-form-brand" placeholder="请输入正确品牌名称" maxlength="40" /></div></div>
      <div class="form-row" id="merchant-product-official-price-row"><label class="required" for="merchant-product-form-official-price">官方价：</label><div class="form-control-area"><input class="control" id="merchant-product-form-official-price" placeholder="请输入成本价" inputmode="decimal" /><div class="error-message">请输入官方价</div></div></div>
      <div class="form-row"><label for="merchant-product-form-description">描述：</label><div class="form-control-area"><textarea class="control merchant-product-description" id="merchant-product-form-description" placeholder="请输入描述" maxlength="300"></textarea></div></div>
      <div class="form-row" id="merchant-product-form-status-row"><label class="required">状态：</label><div class="form-control-area"><div class="radio-group" role="radiogroup" aria-label="状态"><label class="radio-option"><input type="radio" name="merchant-product-form-status" value="上线" />上线</label><label class="radio-option"><input type="radio" name="merchant-product-form-status" value="下线" />下线</label></div><div class="error-message">请选择状态</div></div></div>
    </div></section><div class="form-page-actions"><button class="button secondary" id="cancel-merchant-product" type="button">取消</button><button class="button primary" type="submit">${isEdit ? '保存修改' : '保存'}</button></div></form></section>`;
  },
  bind({ navigate, isAdd, isEdit, recordId } = {}) {
    if (isAdd || isEdit) { this.bindAdd({ navigate, recordId }); return; }
    this.loadRecords();
    const supplierFilter = document.getElementById('merchant-product-supplier');
    const suppliers = this.merchants();
    suppliers.forEach((merchant) => {
      supplierFilter.add(new Option(merchant.name, merchant.id));
    });
    const filters = () => ({ supplier: supplierFilter.value, title: document.getElementById('merchant-product-title').value, productNo: document.getElementById('merchant-product-no').value, statuses: [...document.querySelectorAll('input[name="merchant-product-status"]:checked')].map((input) => input.value), type: document.getElementById('merchant-product-type').value });
    const renderTable = () => this.renderTable(filters());
    document.getElementById('merchant-product-search').addEventListener('click', renderTable);
    document.getElementById('merchant-product-reset').addEventListener('click', () => { supplierFilter.value = ''; document.getElementById('merchant-product-title').value = ''; document.getElementById('merchant-product-no').value = ''; document.querySelectorAll('input[name="merchant-product-status"]').forEach((input) => { input.checked = true; }); document.getElementById('merchant-product-type').value = ''; renderTable(); });
    ['merchant-product-title', 'merchant-product-no'].forEach((id) => document.getElementById(id).addEventListener('keydown', (event) => { if (event.key === 'Enter') renderTable(); }));
    document.getElementById('open-merchant-product-modal').addEventListener('click', () => navigate?.('merchant-product-add'));
    document.getElementById('merchant-product-table-body').addEventListener('click', (event) => {
      const editButton = event.target.closest('[data-edit-product-id]');
      if (editButton) navigate?.(`merchant-product-edit:${editButton.dataset.editProductId}`);
    });
    renderTable();
    const successMessage = window.sessionStorage.getItem(this.successMessageKey);
    if (successMessage) {
      window.sessionStorage.removeItem(this.successMessageKey);
      window.BackofficeLayout.showToast(successMessage);
    }
  },
  bindAdd({ navigate, recordId = null } = {}) {
    this.loadRecords();
    const editingRecord = recordId ? this.records.find((record) => record.id === recordId) : null;
    if (recordId && !editingRecord) {
      window.sessionStorage.setItem(this.successMessageKey, '未找到该货品记录');
      navigate?.('merchant-product');
      return;
    }
    const form = document.getElementById('merchant-product-form');
    const suppliers = this.merchants();
    const supplierSelect = document.getElementById('merchant-product-form-supplier');
    suppliers.forEach((merchant) => supplierSelect.add(new Option(merchant.name, merchant.id)));
    if (editingRecord && ![...supplierSelect.options].some((option) => option.value === editingRecord.supplierId)) {
      supplierSelect.add(new Option(editingRecord.supplier || '待配置合作商', editingRecord.supplierId));
    }
    if (editingRecord) {
      supplierSelect.value = editingRecord.supplierId;
      document.querySelector(`input[name="merchant-product-form-type"][value="${editingRecord.type}"]`).checked = true;
      document.getElementById('merchant-product-form-title').value = editingRecord.title || '';
      document.getElementById('merchant-product-form-cost').value = editingRecord.cost || '';
      document.getElementById('merchant-product-form-brand').value = editingRecord.brand || '';
      document.getElementById('merchant-product-form-official-price').value = editingRecord.officialPrice || '';
      document.getElementById('merchant-product-form-description').value = editingRecord.description || '';
      const formStatus = editingRecord.status === '上线中' ? '上线' : '下线';
      document.querySelector(`input[name="merchant-product-form-status"][value="${formStatus}"]`).checked = true;
    }
    const goBack = () => navigate?.('merchant-product');
    document.getElementById('back-to-merchant-products').addEventListener('click', goBack);
    document.getElementById('cancel-merchant-product').addEventListener('click', goBack);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const supplierId = supplierSelect.value;
      const title = document.getElementById('merchant-product-form-title').value.trim();
      const type = document.querySelector('input[name="merchant-product-form-type"]:checked')?.value || '';
      const cost = document.getElementById('merchant-product-form-cost').value.trim();
      const officialPrice = document.getElementById('merchant-product-form-official-price').value.trim();
      const status = document.querySelector('input[name="merchant-product-form-status"]:checked')?.value || '';
      const validations = [[supplierId, 'merchant-product-supplier-row', '合作商'], [type, 'merchant-product-form-type-row', '货品类型'], [title, 'merchant-product-form-title-row', '货品名称'], [cost, 'merchant-product-cost-row', '成本价'], [officialPrice, 'merchant-product-official-price-row', '官方价'], [status, 'merchant-product-form-status-row', '状态']];
      validations.forEach(([valid, row]) => document.getElementById(row).classList.toggle('is-invalid', !valid));
      const missing = validations.find(([valid]) => !valid);
      if (missing) { window.BackofficeLayout.showRequiredFieldToast(missing[2]); return; }
      const supplier = suppliers.find((merchant) => merchant.id === supplierId);
      const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
      const recordData = { supplierId, supplier: supplier?.name || '-', title, brand: document.getElementById('merchant-product-form-brand').value.trim(), type, cost, officialPrice, description: document.getElementById('merchant-product-form-description').value.trim(), status: status === '上线' ? '上线中' : '已下线', updatedAt: now };
      if (editingRecord) {
        Object.assign(editingRecord, recordData);
      } else {
        this.records.unshift({ id: `merchant-product-${Date.now()}`, supplierProductNo: `DEMO-${String(Date.now()).slice(-8)}`, ...recordData });
      }
      this.saveRecords();
      window.sessionStorage.setItem(this.successMessageKey, editingRecord ? '货品修改成功' : '货品添加成功');
      goBack();
    });
  },
  renderTable(filters = {}) {
    const title = (filters.title || '').trim().toLocaleLowerCase();
    const productNo = (filters.productNo || '').trim().toLocaleLowerCase();
    const statuses = filters.statuses || [];
    const records = this.records.filter((record) => (!filters.supplier || record.supplierId === filters.supplier) && (!title || String(record.title).toLocaleLowerCase().includes(title)) && (!productNo || String(record.supplierProductNo).toLocaleLowerCase().includes(productNo)) && (!statuses.length || statuses.includes(record.status)) && (!filters.type || record.type === filters.type));
    document.getElementById('merchant-product-table-body').innerHTML = records.map((record) => `<tr><td>${this.escape(record.supplier)}</td><td>${this.escape(record.supplierProductNo)}</td><td>${this.escape(record.title)}</td><td>${this.escape(record.brand || '-')}</td><td>${this.escape(record.type)}</td><td>${this.escape(record.cost || '-')}</td><td>${this.escape(record.officialPrice || '-')}</td><td class="${record.status === '上线中' ? 'status-online' : ''}">${this.escape(record.status)}</td><td>${this.escape(record.updatedAt || '-')}</td><td><div class="table-actions"><button class="table-action" type="button" data-edit-product-id="${this.escape(record.id)}">编辑</button></div></td></tr>`).join('');
    document.getElementById('merchant-product-empty').hidden = records.length > 0;
  }
};
