import Koa, { ParameterizedContext, Request, Next } from 'koa';
import Router from '@koa/router';

import type { Admin } from 'resources/admin';
import type { Application } from 'resources/application';
import type { Feature, Changes } from 'resources/feature';

export type AppKoaContextState = {
  admin: Admin;
  application: Application;
  accessToken: string;
  feature?: Feature;
  featureChanges?: Omit<Changes, 'admin' | 'changedOn'>;
};

export type CustomErrors = {
  [name: string]: string;
};

export interface AppKoaContext<T = unknown, R = unknown> extends ParameterizedContext<AppKoaContextState> {
  request: Request & R;
  validatedData: T;
  throwError: (message: string) => never;
  assertError: (condition: unknown, message: string) => asserts condition;
  throwClientError: (errors: CustomErrors, status?: number) => never;
  assertClientError: (condition: unknown, errors: CustomErrors, status?: number) => asserts condition;
}

export class AppRouter extends Router<AppKoaContextState, AppKoaContext> {}

export class AppKoa extends Koa<AppKoaContextState, AppKoaContext<unknown>> {}

export type AppRouterMiddleware = Router.Middleware<AppKoaContextState, AppKoaContext>;

export type ValidationErrors = {
  [name: string]: string[] | string;
};

export {
  Next,
};
