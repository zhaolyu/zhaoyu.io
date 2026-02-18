/**
 * Route path constants
 */

export const ROUTES = {
  HOME: '/',
  AI_MANIFESTO: '/ai-manifesto',
  INFRA: '/infra',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
