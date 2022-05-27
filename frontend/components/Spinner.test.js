// Import the Spinner component into this file and test
import React from 'react'
import Spinner from './Spinner'
import {render} from '@testing-library/react'
// that it renders what it should for the different props it can take.
test('sanity', () => {
  expect(true).not.toBe(false)
})
test("spinner renders when on", () => {
  render(<Spinner on={true}/>)
})