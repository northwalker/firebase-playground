import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App.vue', () => {
  it('renders correct', () => {
    const wrapper = shallowMount(App, {
      propsData: { }
    })
    expect(wrapper.text()).toMatch('')
  })
})
