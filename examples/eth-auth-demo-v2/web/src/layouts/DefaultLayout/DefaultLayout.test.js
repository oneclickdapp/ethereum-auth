import { render } from '@redwoodjs/testing/web'

import DefaultLayout from './DefaultLayout'

describe('DefaultLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DefaultLayout />)
    }).not.toThrow()
  })
})
