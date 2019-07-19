exports.install = function (Vue, options) {
  Vue.prototype.generateTitle = function (title) {
    return this.$t('common.route.' + title);
  };
  Vue.prototype.getI18nLocale = function () {
    return this.$i18n.locale;
  };
  Vue.prototype.getProductCode = function () {
    let operator = JSON.parse(window.sessionStorage.getItem("operator"));
    return operator.productCode;
  };
}
