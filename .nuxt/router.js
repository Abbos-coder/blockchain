import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _648863f4 = () => interopDefault(import('../pages/create.vue' /* webpackChunkName: "pages/create" */))
const _7f6dbb70 = () => interopDefault(import('../pages/edit-profile.vue' /* webpackChunkName: "pages/edit-profile" */))
const _99183d0e = () => interopDefault(import('../pages/explore.vue' /* webpackChunkName: "pages/explore" */))
const _42f46ef7 = () => interopDefault(import('../pages/following.vue' /* webpackChunkName: "pages/following" */))
const _1460f58f = () => interopDefault(import('../pages/profile.vue' /* webpackChunkName: "pages/profile" */))
const _02ec7499 = () => interopDefault(import('../pages/users/_id.vue' /* webpackChunkName: "pages/users/_id" */))
const _02817c4e = () => interopDefault(import('../pages/items/_address/_id.vue' /* webpackChunkName: "pages/items/_address/_id" */))
const _16521890 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/create",
    component: _648863f4,
    name: "create"
  }, {
    path: "/edit-profile",
    component: _7f6dbb70,
    name: "edit-profile"
  }, {
    path: "/explore",
    component: _99183d0e,
    name: "explore"
  }, {
    path: "/following",
    component: _42f46ef7,
    name: "following"
  }, {
    path: "/profile",
    component: _1460f58f,
    name: "profile"
  }, {
    path: "/users/:id?",
    component: _02ec7499,
    name: "users-id"
  }, {
    path: "/items/:address?/:id?",
    component: _02817c4e,
    name: "items-address-id"
  }, {
    path: "/",
    component: _16521890,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
