window.SearchFeedManagementPage = {
  storageKey: 'meiyou-cashback-search-feed-management',
  render() {
    return `<section class="content marketing-config-page search-feed-management-page"><section class="marketing-editor-workspace panel"><div class="marketing-workspace-heading"><div><h1>信息流管理</h1><span class="heading-note">维护搜索中间页信息流 Tab、展位及展示配置</span></div><div class="marketing-workspace-tools"><div class="marketing-page-actions" id="marketing-page-actions"></div><section class="marketing-recent-edits" id="marketing-recent-edits" aria-label="最近编辑"></section></div></div><div class="marketing-config-body" id="marketing-config-body">${window.FeedManagementPage.renderEmbedded()}</div></section></section>`;
  },
  bind({ navigate } = {}) {
    window.FeedManagementPage.bindEmbedded({
      navigate,
      storageKey: this.storageKey,
      pageName: '搜索中间页-信息流营销'
    });
  }
};
