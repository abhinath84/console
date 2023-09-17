/* eslint-disable @typescript-eslint/no-explicit-any */

export type TObject<T = any> = Record<string, T>;
export type AnyFunction = (...args: any[]) => any;
export type Constructor = new(...args: any) => object;
export type AConstructor = abstract new(...args: any) => object;
