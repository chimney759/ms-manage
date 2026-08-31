window.OperationPopupManagementPage = {
  storageKey: 'meiyou-cashback-operation-popup-management',
  tabs: [
    { id: 'home', label: '首页', sublabel: 'Home' },
    { id: 'benefits', label: '福利页', sublabel: '第2Tab' },
    { id: 'youzi-street', label: '柚子街', sublabel: '第3Tab' },
    { id: 'mine', label: '我', sublabel: 'Mine' }
  ],
  listOptions: {
    showTabStatus: false,
    resourceStatusLabel: '弹窗状态',
    showPreviewTabNav: false,
    previewTitle: '弹窗预览',
    previewDescription: '',
    sortPopupPreviewByPriority: true,
    operationPopupListWorkspace: true
  },
  editorOptions: {
    showTabStatus: false,
    resourceStatusLabel: '弹窗状态',
    showPreviewTabNav: false,
    previewTitle: '弹窗预览',
    previewDescription: '',
    sortPopupPreviewByPriority: true,
    operationPopupStandaloneEditor: true
  },
  renderNavigation(activeTab) {
    return `<section class="marketing-navigation panel"><nav class="marketing-tabs" aria-label="底部Tab"><strong class="marketing-tabs-title">底部Tab</strong><div class="marketing-tabs-list" role="tablist">${this.tabs.map((tab) => `<button class="marketing-tab${tab.id === activeTab ? ' is-active' : ''}" type="button" role="tab" aria-selected="${tab.id === activeTab}" data-operation-popup-tab="${tab.id}"><span>${tab.label}</span><small>${tab.sublabel}</small></button>`).join('')}</div></nav></section>`;
  },
  render({ activeTab = 'home', mode = 'list', editorOperationPopupId = '', editorOperationPopupMode = 'add' } = {}) {
    const tab = this.tabs.find((item) => item.id === activeTab) || this.tabs[0];
    const isEditor = mode === 'editor';
    const editorActionLabel = editorOperationPopupMode === 'edit' ? '修改' : (editorOperationPopupMode === 'copy' ? '复制' : '添加');
    const editorHeading = isEditor ? `<header class="operation-popup-editor-page-heading"><button class="operation-popup-editor-back" type="button" data-operation-popup-return aria-label="返回配置列表" title="返回配置列表"><svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M9.75 3.5 5.25 8l4.5 4.5" /></svg></button><h1>${editorActionLabel}${tab.label}(${tab.sublabel})营销弹窗</h1></header>` : '';
    return `<section class="content marketing-config-page operation-popup-management-page${isEditor ? ' is-operation-popup-editor' : ''}">${this.renderNavigation(tab.id)}${editorHeading}<section class="marketing-editor-workspace panel"><div class="marketing-config-body" id="marketing-config-body">${window.FeedManagementPage.renderEmbedded(isEditor ? this.editorOptions : this.listOptions)}</div></section></section>`;
  },
  bind({ navigate, activeTab = 'home', mode = 'list', editorOperationPopupId = '', editorOperationPopupMode = 'add' } = {}) {
    const isEditor = mode === 'editor';
    const currentTab = this.tabs.find((item) => item.id === activeTab) || this.tabs[0];
    const openList = () => {
      const root = document.getElementById('page-root');
      root.innerHTML = this.render({ activeTab, mode: 'list' });
      this.bind({ navigate, activeTab, mode: 'list' });
    };
    const embeddedEditor = window.FeedManagementPage.bindEmbedded({
      navigate,
      storageKey: `${this.storageKey}:${activeTab}`,
      pageName: `${currentTab.label}-营销弹窗管理`,
      operationPopupPosition: currentTab.label,
      operationPopupPositionDisplay: `${currentTab.label}(${currentTab.sublabel})`,
      ...(activeTab === 'home' ? {
        tabReminderOptions: [{ value: 'none', label: '不展示红点' }],
        tabReminderNote: '首页不支持红点展示',
        tabReminderReadonly: true
      } : {}),
      ...(isEditor ? this.editorOptions : this.listOptions),
      ...(isEditor ? {
        createInitialOperationPopup: !editorOperationPopupId,
        editorOperationPopupId,
        editorOperationPopupMode,
        onReturnToConfigurationList: openList
      } : {
        onAddConfiguration: () => {
          const root = document.getElementById('page-root');
          root.innerHTML = this.render({ activeTab, mode: 'editor', editorOperationPopupMode: 'add' });
          this.bind({ navigate, activeTab, mode: 'editor', editorOperationPopupMode: 'add' });
        },
        onEditConfiguration: ({ componentId }) => {
          const root = document.getElementById('page-root');
          root.innerHTML = this.render({ activeTab, mode: 'editor', editorOperationPopupId: componentId, editorOperationPopupMode: 'edit' });
          this.bind({ navigate, activeTab, mode: 'editor', editorOperationPopupId: componentId, editorOperationPopupMode: 'edit' });
        },
        onCopyConfiguration: ({ componentId }) => {
          const root = document.getElementById('page-root');
          root.innerHTML = this.render({ activeTab, mode: 'editor', editorOperationPopupId: componentId, editorOperationPopupMode: 'copy' });
          this.bind({ navigate, activeTab, mode: 'editor', editorOperationPopupId: componentId, editorOperationPopupMode: 'copy' });
        }
      })
    });
    document.querySelector('[data-operation-popup-return]')?.addEventListener('click', () => {
      embeddedEditor?.guardNavigation?.(openList) || openList();
    });
    document.querySelectorAll('[data-operation-popup-tab]').forEach((button) => button.addEventListener('click', () => {
      const nextTab = button.dataset.operationPopupTab;
      if (nextTab === activeTab) return;
      const switchTab = () => {
        const root = document.getElementById('page-root');
        root.innerHTML = this.render({ activeTab: nextTab, mode });
        this.bind({ navigate, activeTab: nextTab, mode });
      };
      embeddedEditor?.guardNavigation?.(switchTab) || switchTab();
    }));
  }
};
