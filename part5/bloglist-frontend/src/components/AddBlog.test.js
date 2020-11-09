import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import AddBlog from './AddBlog'

describe('<AddBlog />', () => {
  test('calls event handler with the right details when a blog is created', () => {
    const newBlog = {
      title: 'A mysterious Note',
      author: 'Auth Tokenson',
      url: 'noneofyabusiness',
    }
    const createBlog = jest.fn()

    const component = render(<AddBlog createBlog={createBlog} />)

    const titleInput = component.container.querySelector('input[name=Title]')
    const authorInput = component.container.querySelector('input[name=Author]')
    const urlInput = component.container.querySelector('input[name=Url]')
    const form = component.container.querySelector('form')

    fireEvent.change(titleInput, {
      target: { value: newBlog.title }
    })
    fireEvent.change(authorInput, {
      target: { value: newBlog.author }
    })
    fireEvent.change(urlInput, {
      target: { value: newBlog.url }
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual(newBlog)
  })
})