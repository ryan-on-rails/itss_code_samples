import React              from 'react';

export default class LanguagePrefixHelper {
  constructor(prefix, element) {
    this.element = element
    this._prefix = prefix;
  }

  assemble(selector) {
    var content = "";
    if (this.checkPropertyIsNull(selector)) {
      content = this.element["en_" + selector];
    } else {
      content = this.element[this._prefix + "_" + selector];
    }
    if(typeof content == "undefined" || content == null){ content = "";}
    return content;
  }

  assembleFigure(selector) {
    var content = "";
    if(this._prefix === "en") {
      content =  this.element[selector];
    } else {
      if (this.checkPropertyIsNull(selector)) {
        content = this.element[selector];
      } else {
        content = this.element[this._prefix + "_" + selector]
      }
    }

    if(typeof content == "undefined" || content == null){ content = "";}
    return content;
  }

  checkPropertyIsNull(selector) {
    if (this.element[this._prefix + "_" + selector] == null || this.element[this._prefix + "_" + selector] === "") {
      return true;
    } else {
      return false;
    }
  }

  getDisplayPrefix() {
    return this._prefix;
  }

  noLanguage() {
    return this.languages.length === 0;
  }

  singleLanguage() {
    return this.languages.length <= 1;
  }
}
