import { ElementHandle, Page } from 'puppeteer';
import { IConfigureOptions, IQueryUtils, IScopedQueryUtils } from './typedefs';
declare type ContextFn = (...args: any[]) => ElementHandle;
export declare function getDocument(_page?: Page): Promise<ElementHandle>;
export declare function wait(callback: () => void, { timeout, interval }?: {
    timeout?: number;
    interval?: number;
}): Promise<{}>;
export declare const waitFor: typeof wait;
export declare function configure(options: Partial<IConfigureOptions>): void;
export declare function getQueriesForElement<T>(object: T, contextFn?: ContextFn): T & IQueryUtils & IScopedQueryUtils;
export declare const within: typeof getQueriesForElement;
export declare const queries: IQueryUtils;
export {};
