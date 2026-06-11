/* eslint-disable */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols

import { Route as rootRouteImport } from './routes/__root'
import { Route as SitemapDotxmlRouteImport } from './routes/sitemap[.]xml'
import { Route as ChiSiamoRouteImport } from './routes/chi-siamo'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as CategoriaSlugRouteImport } from './routes/categoria.$slug'
import { Route as PortfolioSlugRouteImport } from './routes/portfolio.$slug'
import { Route as PortfolioSlugEventRouteImport } from './routes/portfolio.$slug.$event'
import { Route as PortfolioSlugEventAlbumRouteImport } from './routes/portfolio.$slug.$event.$album'
import { Route as ApiAdminUploadUrlRouteImport } from './routes/api/admin/upload-url'
import { Route as ApiAdminSaveAlbumRouteImport } from './routes/api/admin/save-album'
import { Route as ApiAdminAlbumsRouteImport } from './routes/api/admin/albums'

const SitemapDotxmlRoute = SitemapDotxmlRouteImport.update({ id: '/sitemap.xml', path: '/sitemap.xml', getParentRoute: () => rootRouteImport } as any)
const ChiSiamoRoute = ChiSiamoRouteImport.update({ id: '/chi-siamo', path: '/chi-siamo', getParentRoute: () => rootRouteImport } as any)
const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)
const AdminRoute = AdminRouteImport.update({ id: '/admin', path: '/admin', getParentRoute: () => rootRouteImport } as any)
const CategoriaSlugRoute = CategoriaSlugRouteImport.update({ id: '/categoria/$slug', path: '/categoria/$slug', getParentRoute: () => rootRouteImport } as any)
const PortfolioSlugRoute = PortfolioSlugRouteImport.update({ id: '/portfolio/$slug', path: '/portfolio/$slug', getParentRoute: () => rootRouteImport } as any)
const PortfolioSlugEventRoute = PortfolioSlugEventRouteImport.update({ id: '/portfolio/$slug/$event', path: '/portfolio/$slug/$event', getParentRoute: () => rootRouteImport } as any)
const PortfolioSlugEventAlbumRoute = PortfolioSlugEventAlbumRouteImport.update({ id: '/portfolio/$slug/$event/$album', path: '/portfolio/$slug/$event/$album', getParentRoute: () => rootRouteImport } as any)
const ApiAdminUploadUrlRoute = ApiAdminUploadUrlRouteImport.update({ id: '/api/admin/upload-url', path: '/api/admin/upload-url', getParentRoute: () => rootRouteImport } as any)
const ApiAdminSaveAlbumRoute = ApiAdminSaveAlbumRouteImport.update({ id: '/api/admin/save-album', path: '/api/admin/save-album', getParentRoute: () => rootRouteImport } as any)
const ApiAdminAlbumsRoute = ApiAdminAlbumsRouteImport.update({ id: '/api/admin/albums', path: '/api/admin/albums', getParentRoute: () => rootRouteImport } as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/admin': typeof AdminRoute
  '/chi-siamo': typeof ChiSiamoRoute
  '/sitemap.xml': typeof SitemapDotxmlRoute
  '/categoria/$slug': typeof CategoriaSlugRoute
  '/portfolio/$slug': typeof PortfolioSlugRoute
  '/portfolio/$slug/$event': typeof PortfolioSlugEventRoute
  '/portfolio/$slug/$event/$album': typeof PortfolioSlugEventAlbumRoute
  '/api/admin/upload-url': typeof ApiAdminUploadUrlRoute
  '/api/admin/save-album': typeof ApiAdminSaveAlbumRoute
  '/api/admin/albums': typeof ApiAdminAlbumsRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/admin': typeof AdminRoute
  '/chi-siamo': typeof ChiSiamoRoute
  '/sitemap.xml': typeof SitemapDotxmlRoute
  '/categoria/$slug': typeof CategoriaSlugRoute
  '/portfolio/$slug': typeof PortfolioSlugRoute
  '/portfolio/$slug/$event': typeof PortfolioSlugEventRoute
  '/portfolio/$slug/$event/$album': typeof PortfolioSlugEventAlbumRoute
  '/api/admin/upload-url': typeof ApiAdminUploadUrlRoute
  '/api/admin/save-album': typeof ApiAdminSaveAlbumRoute
  '/api/admin/albums': typeof ApiAdminAlbumsRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/admin': typeof AdminRoute
  '/chi-siamo': typeof ChiSiamoRoute
  '/sitemap.xml': typeof SitemapDotxmlRoute
  '/categoria/$slug': typeof CategoriaSlugRoute
  '/portfolio/$slug': typeof PortfolioSlugRoute
  '/portfolio/$slug/$event': typeof PortfolioSlugEventRoute
  '/portfolio/$slug/$event/$album': typeof PortfolioSlugEventAlbumRoute
  '/api/admin/upload-url': typeof ApiAdminUploadUrlRoute
  '/api/admin/save-album': typeof ApiAdminSaveAlbumRoute
  '/api/admin/albums': typeof ApiAdminAlbumsRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/admin' | '/chi-siamo' | '/sitemap.xml' | '/categoria/$slug' | '/portfolio/$slug' | '/portfolio/$slug/$event' | '/portfolio/$slug/$event/$album' | '/api/admin/upload-url' | '/api/admin/save-album' | '/api/admin/albums'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/admin' | '/chi-siamo' | '/sitemap.xml' | '/categoria/$slug' | '/portfolio/$slug' | '/portfolio/$slug/$event' | '/portfolio/$slug/$event/$album' | '/api/admin/upload-url' | '/api/admin/save-album' | '/api/admin/albums'
  id: '__root__' | '/' | '/admin' | '/chi-siamo' | '/sitemap.xml' | '/categoria/$slug' | '/portfolio/$slug' | '/portfolio/$slug/$event' | '/portfolio/$slug/$event/$album' | '/api/admin/upload-url' | '/api/admin/save-album' | '/api/admin/albums'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AdminRoute: typeof AdminRoute
  ChiSiamoRoute: typeof ChiSiamoRoute
  SitemapDotxmlRoute: typeof SitemapDotxmlRoute
  CategoriaSlugRoute: typeof CategoriaSlugRoute
  PortfolioSlugRoute: typeof PortfolioSlugRoute
  PortfolioSlugEventRoute: typeof PortfolioSlugEventRoute
  PortfolioSlugEventAlbumRoute: typeof PortfolioSlugEventAlbumRoute
  ApiAdminUploadUrlRoute: typeof ApiAdminUploadUrlRoute
  ApiAdminSaveAlbumRoute: typeof ApiAdminSaveAlbumRoute
  ApiAdminAlbumsRoute: typeof ApiAdminAlbumsRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/admin': { id: '/admin'; path: '/admin'; fullPath: '/admin'; preLoaderRoute: typeof AdminRouteImport; parentRoute: typeof rootRouteImport }
    '/chi-siamo': { id: '/chi-siamo'; path: '/chi-siamo'; fullPath: '/chi-siamo'; preLoaderRoute: typeof ChiSiamoRouteImport; parentRoute: typeof rootRouteImport }
    '/sitemap.xml': { id: '/sitemap.xml'; path: '/sitemap.xml'; fullPath: '/sitemap.xml'; preLoaderRoute: typeof SitemapDotxmlRouteImport; parentRoute: typeof rootRouteImport }
    '/categoria/$slug': { id: '/categoria/$slug'; path: '/categoria/$slug'; fullPath: '/categoria/$slug'; preLoaderRoute: typeof CategoriaSlugRouteImport; parentRoute: typeof rootRouteImport }
    '/portfolio/$slug': { id: '/portfolio/$slug'; path: '/portfolio/$slug'; fullPath: '/portfolio/$slug'; preLoaderRoute: typeof PortfolioSlugRouteImport; parentRoute: typeof rootRouteImport }
    '/portfolio/$slug/$event': { id: '/portfolio/$slug/$event'; path: '/portfolio/$slug/$event'; fullPath: '/portfolio/$slug/$event'; preLoaderRoute: typeof PortfolioSlugEventRouteImport; parentRoute: typeof rootRouteImport }
    '/portfolio/$slug/$event/$album': { id: '/portfolio/$slug/$event/$album'; path: '/portfolio/$slug/$event/$album'; fullPath: '/portfolio/$slug/$event/$album'; preLoaderRoute: typeof PortfolioSlugEventAlbumRouteImport; parentRoute: typeof rootRouteImport }
    '/api/admin/upload-url': { id: '/api/admin/upload-url'; path: '/api/admin/upload-url'; fullPath: '/api/admin/upload-url'; preLoaderRoute: typeof ApiAdminUploadUrlRouteImport; parentRoute: typeof rootRouteImport }
    '/api/admin/save-album': { id: '/api/admin/save-album'; path: '/api/admin/save-album'; fullPath: '/api/admin/save-album'; preLoaderRoute: typeof ApiAdminSaveAlbumRouteImport; parentRoute: typeof rootRouteImport }
    '/api/admin/albums': { id: '/api/admin/albums'; path: '/api/admin/albums'; fullPath: '/api/admin/albums'; preLoaderRoute: typeof ApiAdminAlbumsRouteImport; parentRoute: typeof rootRouteImport }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute,
  AdminRoute,
  ChiSiamoRoute,
  SitemapDotxmlRoute,
  CategoriaSlugRoute,
  PortfolioSlugRoute,
  PortfolioSlugEventRoute,
  PortfolioSlugEventAlbumRoute,
  ApiAdminUploadUrlRoute,
  ApiAdminSaveAlbumRoute,
  ApiAdminAlbumsRoute,
}

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
