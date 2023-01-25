import { IScopedQueryUtils } from './typedefs';
declare module 'puppeteer' {
    interface Page {
        getDocument(): Promise<ElementHandle>;
    }
    interface ElementHandle extends IScopedQueryUtils {
    }
}
