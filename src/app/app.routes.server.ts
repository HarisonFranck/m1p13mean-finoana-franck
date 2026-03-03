import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'client/product/:id', // Specific rule for the dynamic route
    renderMode: RenderMode.Server  // Render on-demand, not at build time
  },
  {
    path: 'client/shop/:id', // Specific rule for the dynamic route
    renderMode: RenderMode.Server  // Render on-demand, not at build time
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
