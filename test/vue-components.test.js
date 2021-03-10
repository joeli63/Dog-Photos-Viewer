// import { shallowMount } from '@vue/test-utils'
import ImageContainer from '~/components/ImageContainer'
import helpers from '~/utils/index'

export const addVuex = (context) => {
  context.vuex = require('vuex')
  context.vue.use(context.vuex)
}

export const addHelpers = () => {
  return (context) => {
    context.vue.prototype.$helpers = helpers
  }
}

export const addI18n = (options) => {
  return (context) => {
    context.i18n = require('vue-i18n')
    context.vue.use(context.i18n)
    // eslint-disable-next-line new-cap
    context.i18nInstance = new context.i18n(options)
  }
}

export const addFilter = (name, lambda) => {
  return context => context.vue.filter(name, lambda)
}

export const compositeConfiguration = (...configs) => {
  return context => configs.forEach(config => config(context))
}

export const bootstrapVueContext = (configureContext) => {
  const context = {}
  const teardownVueContext = () => {
    jest.unmock('vue')
    Object.keys(context).forEach(key => delete context[key])
    jest.resetModules()
  }

  jest.isolateModules(() => {
    context.vueTestUtils = require('@vue/test-utils')
    context.vue = context.vueTestUtils.createLocalVue()

    jest.doMock('vue', () => context.vue)

    configureContext && configureContext(context)
  })

  return {
    teardownVueContext,
    ...context
  }
}

describe('ImageContainer', () => {
  let vueContext = null

  beforeEach(() => {
    vueContext = bootstrapVueContext(
      compositeConfiguration(addVuex, addHelpers())
    )
  })

  afterEach(() => {
    vueContext.teardownVueContext()
  })

  test('Test ImageContainer Component', () => {
    const wrapper = vueContext.vueTestUtils.shallowMount(ImageContainer, {
      localVue: vueContext.vue,
    })

    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    wrapper.destroy()
  })
})