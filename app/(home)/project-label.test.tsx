import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ProjectLabel } from './project-label'

function setup() {
  const user = userEvent.setup()
  const { container } = render(
    <ProjectLabel title="Wonderbot-1000" dateLabel="May 27, 2026">
      <p>Wonderbot is an automation workflow.</p>
    </ProjectLabel>
  )
  return { user, container }
}

describe('ProjectLabel', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('renders only the title as a button, with no modal open yet', () => {
    setup()
    expect(screen.getByRole('button', { name: 'Wonderbot-1000' })).toBeInTheDocument()
    expect(screen.queryByText('Wonderbot is an automation workflow.')).not.toBeInTheDocument()
  })

  it('renders the overview inside the trigger button when given', () => {
    render(
      <ProjectLabel
        title="Wonderbot-1000"
        overview="An automated social media scraper"
        dateLabel="May 27, 2026"
      >
        <p>content</p>
      </ProjectLabel>
    )
    const overview = screen.getByText('An automated social media scraper')
    expect(overview.closest('button')).toHaveAccessibleName(/Wonderbot-1000/)
  })

  it('renders no overview text at all when none is given', () => {
    setup()
    // Nothing else to assert against by content, so just confirm the trigger
    // button holds only the title's own text node.
    expect(screen.getByRole('button', { name: 'Wonderbot-1000' }).textContent).toBe(
      'Wonderbot-1000'
    )
  })

  it('opens the modal on click, showing the title, date, and content', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Wonderbot-1000' }))

    expect(screen.getByText('May 27, 2026')).toBeInTheDocument()
    expect(screen.getByText('Wonderbot is an automation workflow.')).toBeInTheDocument()
    // The title now appears twice — the trigger button and the modal's own
    // heading — so this checks specifically for the modal's h3, not just
    // "the text exists somewhere".
    const modalHeading = screen.getAllByText('Wonderbot-1000').find((el) => el.tagName === 'H3')
    expect(modalHeading).toBeInTheDocument()
  })

  it('renders the modal via a portal onto document.body, outside the component\'s own render tree', async () => {
    const { user, container } = setup()
    await user.click(screen.getByRole('button', { name: 'Wonderbot-1000' }))

    const dateNode = screen.getByText('May 27, 2026')
    // Portaled content is a child of document.body, not nested under the
    // component's own render container (which only holds the trigger
    // button) — this is what makes the modal escape any ancestor stacking
    // context in the real page (see the comment on the portal call site).
    expect(document.body.contains(dateNode)).toBe(true)
    expect(container.contains(dateNode)).toBe(false)
  })

  it('closes when Escape is pressed', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Wonderbot-1000' }))
    expect(screen.getByText('May 27, 2026')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByText('May 27, 2026')).not.toBeInTheDocument()
  })

  it('closes when the backdrop is clicked', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Wonderbot-1000' }))

    const dateNode = screen.getByText('May 27, 2026')
    // The backdrop is the fixed inset-0 element two levels up from the date
    // (date -> panel -> backdrop).
    const backdrop = dateNode.closest('.fixed.inset-0')!
    await user.click(backdrop)

    expect(screen.queryByText('May 27, 2026')).not.toBeInTheDocument()
  })

  it('does not close when clicking inside the panel itself', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Wonderbot-1000' }))

    await user.click(screen.getByText('Wonderbot is an automation workflow.'))

    expect(screen.getByText('May 27, 2026')).toBeInTheDocument()
  })

  it('closes via the close (×) button', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Wonderbot-1000' }))

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByText('May 27, 2026')).not.toBeInTheDocument()
  })

  it('locks body scroll while open and restores it on close', async () => {
    const { user } = setup()
    expect(document.body.style.overflow).toBe('')

    await user.click(screen.getByRole('button', { name: 'Wonderbot-1000' }))
    expect(document.body.style.overflow).toBe('hidden')

    await user.keyboard('{Escape}')
    expect(document.body.style.overflow).toBe('')
  })
})
