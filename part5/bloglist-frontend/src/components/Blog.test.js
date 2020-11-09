import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Testy Testerson',
    url: 'localhost',
    likes: 42,
    user: { name: 'Cody Blockerson', username: 'aaa' },
  }

  test('renders the appropriate content', () => {
    const component = render(
      <Blog blog={blog} />
    )

    expect(component.container).toHaveTextContent(
      blog.title
    )
    expect(component.container).toHaveTextContent(
      blog.author
    )

    const urlElement = component.getByText(blog.url)
    expect(urlElement).not.toBeVisible()

    const likesElement = component.getByText(`likes: ${blog.likes}`)
    expect(likesElement).not.toBeVisible()
  })

  test('renders url and likes when view button is clicked', () => {
    const component = render(
      <Blog blog={blog} />
    )
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const urlElement = component.getByText(blog.url)
    expect(urlElement).toBeVisible()

    const likesElement = component.getByText(`likes: ${blog.likes}`)
    expect(likesElement).toBeVisible()
  })

  test('clicking the add like button twice calls the event handler twice', () => {
    const mockHandler = jest.fn()

    const component = render(
      <Blog blog={blog} addLike={mockHandler} />
    )

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})