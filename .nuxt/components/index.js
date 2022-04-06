export { default as Carousel } from '../../components/Carousel.vue'
export { default as Category } from '../../components/Category.vue'
export { default as Explore } from '../../components/Explore.vue'
export { default as Following } from '../../components/Following.vue'
export { default as Footer } from '../../components/Footer.vue'
export { default as LogIn } from '../../components/LogIn.vue'
export { default as MostLiked } from '../../components/MostLiked.vue'
export { default as Navbar } from '../../components/Navbar.vue'
export { default as ProfileTabs } from '../../components/ProfileTabs.vue'
export { default as Skeleton } from '../../components/Skeleton.vue'
export { default as Tabs } from '../../components/Tabs.vue'
export { default as TopUsers } from '../../components/TopUsers.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
