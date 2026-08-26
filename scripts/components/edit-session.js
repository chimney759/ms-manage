// 可视化编辑框架：统一管理可视化配置页面的编辑状态、保存层级与离开确认。
window.EditSession = {
  create({ snapshot, clone = (value) => JSON.parse(JSON.stringify(value)), confirmClose } = {}) {
    if (typeof snapshot !== 'function') throw new Error('EditSession requires a snapshot function.');

    let editing = false;
    let componentSavedState = clone(snapshot());
    let pageSavedState = clone(snapshot());
    const isEqual = (left, right) => JSON.stringify(left) === JSON.stringify(right);

    return {
      isEditing: () => editing,
      startEditing: () => { editing = true; },
      stopEditing: () => { editing = false; },
      hasComponentChanges: () => !isEqual(snapshot(), componentSavedState),
      hasPageChanges: () => !isEqual(snapshot(), pageSavedState),
      markComponentSaved: () => { componentSavedState = clone(snapshot()); },
      finishComponentEditing: (state = snapshot()) => {
        componentSavedState = clone(state);
        pageSavedState = clone(state);
        editing = false;
      },
      markPageSaved: (state = snapshot()) => {
        componentSavedState = clone(state);
        pageSavedState = clone(state);
        editing = false;
      },
      getPageSavedState: () => clone(pageSavedState),
      revertPageChanges: () => {
        const savedState = clone(pageSavedState);
        componentSavedState = clone(savedState);
        editing = false;
        return savedState;
      },
      async guardNavigation(onProceed) {
        if (!editing || isEqual(snapshot(), pageSavedState)) {
          onProceed();
          return true;
        }
        const confirmed = await confirmClose?.();
        if (confirmed) onProceed();
        return Boolean(confirmed);
      }
    };
  }
};
