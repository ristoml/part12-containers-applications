import React from 'react'
import Todo from './Todo'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'

describe('<Todo />', () => {
  test('Correct todo gets rendered', () => {
    const testTodo = {
      text: 'test text',
      done: false
    }

    const component = render(
      <Todo
        todo={testTodo}
        onClickComplete={() => {}}
        onClickDelete={() => {}}
      />
    )
    expect(component.container).toHaveTextContent('test text')
    expect(component.container).toHaveTextContent('Set as done')
    expect(component.container).toHaveTextContent('Delete')
  })
})
