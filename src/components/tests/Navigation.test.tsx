import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navigation from '../Navigation'

// --- Mock motion/react -----------------------------------------------
// AnimatePresence's exit animations don't resolve synchronously in jsdom,
// which makes assertions about "element removed" flaky. This mock keeps
// the conditional-rendering logic (children only render when mounted)
// but strips away animation timing so tests are deterministic.
vi.mock('motion/react', () => {
    const passthrough = (Tag: string) => {
        const Component = ({ children, ...props }: any) => {
            // Strip motion-only props so they don't leak onto DOM nodes as warnings
            const {
                layout, layoutId, initial, animate, exit, whileHover, whileTap,
                transition, mode, ...rest
            } = props
            const El = Tag as any
            return <El {...rest}>{children}</El>
        }
        return Component
    }

    // IMPORTANT: cache components per tag. Without this, the Proxy below
    // would return a NEW function identity every time `motion.div` (etc) is
    // accessed, which happens on every render. React treats a changed
    // component type as a different component and unmounts/remounts that
    // subtree, silently detaching any DOM node references a test captured
    // earlier (e.g. `const button = screen.getByRole('button')` before a
    // click). Caching keeps the same identity across renders so elements
    // are patched in place instead of torn down and rebuilt.
    const cache: Record<string, any> = {}

    return {
        motion: new Proxy(
            {},
            {
                get: (_target, tag: string) => {
                    if (!cache[tag]) cache[tag] = passthrough(tag)
                    return cache[tag]
                },
            }
        ),
        AnimatePresence: ({ children }: any) => <>{children}</>,
    }
})

// --- Mock matchMedia ----------------------------------------------------
// jsdom does not implement matchMedia at all, so it must be mocked
// per-test to control the "isMobile" branch of the component.
//
// The component calls window.matchMedia() exactly once (inside a
// useEffect) and holds onto the returned MediaQueryList object for the
// lifetime of the component. That means later reassigning
// `window.matchMedia` to a new mock function has NO effect on a component
// that already mounted — it's still holding the old object. To simulate a
// real viewport change, `matches` must be a mutable getter on the SAME
// object, updated via `setMatches`, then the listener re-invoked.
function mockMatchMedia(initialMatches: boolean) {
    let currentMatches = initialMatches
    const listeners: Array<() => void> = []

    const mediaQueryList = {
        get matches() {
            return currentMatches
        },
        media: '(max-width: 639px)',
        onchange: null,
        addEventListener: (_event: string, cb: () => void) => {
            listeners.push(cb)
        },
        removeEventListener: vi.fn(),
        addListener: vi.fn(), // deprecated API, some libs still check for it
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }

    window.matchMedia = vi.fn().mockReturnValue(mediaQueryList)

    return {
        // simulate a real viewport change: update `matches`, then fire the
        // same listener the component registered, just like a browser would.
        //
        // This is wrapped in act() because React 18's automatic batching
        // defers state updates triggered outside a React-managed event (like
        // fireEvent) to a microtask. Without act(), the assertion right after
        // calling setMatches would run against the pre-update DOM.
        setMatches: (value: boolean) => {
            act(() => {
                currentMatches = value
                listeners.forEach((cb) => cb())
            })
        },
    }
}

function renderNav() {
    return render(
        <MemoryRouter>
            <Navigation />
        </MemoryRouter>
    )
}

const LABELS = ['Home', 'Contact Me', 'Experience', 'Projects', 'About']

describe('Navigation', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    describe('desktop layout', () => {
        beforeEach(() => {
            mockMatchMedia(false) // max-width: 639px does NOT match -> desktop
        })

        it('renders the toggle button and all nav links', () => {
            renderNav()

            expect(screen.getByRole('button')).toBeInTheDocument()
            LABELS.forEach((label) => {
                expect(screen.getByTitle(label)).toBeInTheDocument()
            })
        })

        it('shows the menu icon by default and switches to the close icon when clicked', () => {
            renderNav()
            const button = screen.getByRole('button')

            // lucide icons render as <svg>, distinguish via class names lucide adds
            expect(button.querySelector('svg')).toHaveClass('lucide-menu')

            fireEvent.click(button)

            expect(button.querySelector('svg')).toHaveClass('lucide-x')
        })

        it('links remain present in the DOM regardless of open state on desktop', () => {
            renderNav()
            const button = screen.getByRole('button')

            // Desktop always renders the links container; only the text label
            // inside each link toggles with `isOpen`.
            LABELS.forEach((label) => {
                expect(screen.getByTitle(label)).toBeInTheDocument()
            })

            fireEvent.click(button)

            LABELS.forEach((label) => {
                expect(screen.getByTitle(label)).toBeInTheDocument()
            })
        })

        it('shows link text labels only once opened', () => {
            renderNav()
            const button = screen.getByRole('button')

            // Closed by default -> label text not rendered
            expect(screen.queryByText('Home')).not.toBeInTheDocument()

            fireEvent.click(button)

            expect(screen.getByText('Home')).toBeInTheDocument()
        })
    })

    describe('mobile layout', () => {
        beforeEach(() => {
            mockMatchMedia(true) // max-width: 639px matches -> mobile
        })

        it('hides nav links until the menu is opened', () => {
            renderNav()

            LABELS.forEach((label) => {
                expect(screen.queryByTitle(label)).not.toBeInTheDocument()
            })

            fireEvent.click(screen.getByRole('button'))

            LABELS.forEach((label) => {
                expect(screen.getByTitle(label)).toBeInTheDocument()
            })
        })

        it('closes the menu after a link is clicked', () => {
            renderNav()

            fireEvent.click(screen.getByRole('button')) // open menu
            expect(screen.getByTitle('Home')).toBeInTheDocument()

            fireEvent.click(screen.getByTitle('Home'))

            LABELS.forEach((label) => {
                expect(screen.queryByTitle(label)).not.toBeInTheDocument()
            })
        })

        it('closes the menu automatically if viewport switches from desktop to mobile while open', () => {
            const { setMatches } = mockMatchMedia(false) // start desktop
            renderNav()

            // On desktop, open the menu
            fireEvent.click(screen.getByRole('button'))
            expect(screen.getByText('Home')).toBeInTheDocument()

            // Simulate the media query actually flipping to mobile, the way a
            // browser resize would fire the registered "change" listener
            setMatches(true)

            // isMobile effect should force isOpen back to false
            LABELS.forEach((label) => {
                expect(screen.queryByTitle(label)).not.toBeInTheDocument()
            })
        })
    })

    describe('navigation links', () => {
        beforeEach(() => {
            mockMatchMedia(false)
        })

        it('points each link to the correct route', () => {
            renderNav()

            expect(screen.getByTitle('Home')).toHaveAttribute('href', '/')
            expect(screen.getByTitle('Contact Me')).toHaveAttribute('href', '/contact')
            expect(screen.getByTitle('Experience')).toHaveAttribute('href', '/experience')
            expect(screen.getByTitle('Projects')).toHaveAttribute('href', '/projects')
            expect(screen.getByTitle('About')).toHaveAttribute('href', '/about')
        })

        it('applies the active class to the current route link', () => {
            render(
                <MemoryRouter initialEntries={['/projects']}>
                    <Navigation />
                </MemoryRouter>
            )

            expect(screen.getByTitle('Projects')).toHaveClass('bg-primary-3')
            expect(screen.getByTitle('Home')).not.toHaveClass('bg-primary-3')
        })
    })
})
