"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
// tslint:disable-next-line
let Page, ElementHandle;
function requireOrUndefined(path) {
    try {
        return require(path);
    }
    catch (err) { }
}
try {
    const libPrefix = requireOrUndefined(`puppeteer/lib/cjs/puppeteer/common/Page.js`)
        ? 'puppeteer/lib/cjs/puppeteer/common'
        : 'puppeteer/lib';
    Page = requireOrUndefined(`${libPrefix}/Page.js`); // tslint:disable-line
    if (Page.Page)
        Page = Page.Page;
    ElementHandle = requireOrUndefined(`${libPrefix}/ElementHandle.js`); // tslint:disable-line variable-name
    if (ElementHandle && ElementHandle.ElementHandle)
        ElementHandle = ElementHandle.ElementHandle;
    if (!ElementHandle) {
        const ExecutionContext = requireOrUndefined(`${libPrefix}/ExecutionContext.js`); // tslint:disable-line variable-name
        if (ExecutionContext && ExecutionContext.ElementHandle) {
            ElementHandle = ExecutionContext.ElementHandle;
        }
    }
    if (ElementHandle && ElementHandle.ElementHandle)
        ElementHandle = ElementHandle.ElementHandle;
    if (!ElementHandle) {
        const JSHandle = require(`${libPrefix}/JSHandle.js`); // tslint:disable-line
        if (JSHandle && JSHandle.ElementHandle) {
            ElementHandle = JSHandle.ElementHandle;
        }
    }
    if (ElementHandle && ElementHandle.ElementHandle)
        ElementHandle = ElementHandle.ElementHandle;
    Page.prototype.getDocument = _1.getDocument;
    _1.getQueriesForElement(ElementHandle.prototype, function () {
        return this;
    });
    ElementHandle.prototype.getQueriesForElement = function () {
        return _1.getQueriesForElement(this);
    };
}
catch (err) {
    // tslint:disable-next-line
    console.error('Could not augment puppeteer functions, do you have a conflicting version?');
    throw err;
}
//# sourceMappingURL=extend.js.map