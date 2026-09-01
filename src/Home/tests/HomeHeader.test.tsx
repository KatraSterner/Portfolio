import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomeHeader from '../HomeHeader'

vi.mock('motion/react', () => {
    const passthrough = (Tag: string) => {
        const Component = ({ children, ...props }: any) => {
            const {
                layout, layoutId, initial, animate, exit, whileHover, whileTap,
                transition, mode, ...rest
            } = props
            const El = Tag as any
            return <El {...rest}>{children}</El>
        }
        return Component
    }

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
    }
})

vi.mock('../assets/images/Kat_Headshot_1.png', () => ({
    default: 'mock-headshot.png',
}))

function renderHeader() {
    return render(<HomeHeader />)
}

describe('HomeHeader', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    describe('content', () => {
        it('renders the name split across two spaced-out words', () => {
            renderHeader()

            expect(screen.getByText('K a t r a')).toBeInTheDocument()
            expect(screen.getByText('S t e r n e r')).toBeInTheDocument()
        })

        it('renders the job title', () => {
            renderHeader()

            expect(screen.getByText('Software Engineer')).toBeInTheDocument()
        })

        it('renders a call-to-action link pointing to the About page', () => {
            renderHeader()

            const link = screen.getByRole('link', { name: 'Get to Know Me' })
            expect(link).toHaveAttribute('href', '/about')
        })
    })

    describe('image', () => {
        it('renders the headshot with a descriptive alt text', () => {
            renderHeader()

            const img = screen.getByAltText('professional headshot of Katra')
            expect(img).toBeInTheDocument()
            expect(img).toHaveAttribute('src', 'mock-headshot.png')
        })

        it('crops the headshot to fill its frame anchored toward the top', () => {
            renderHeader()

            const img = screen.getByAltText('professional headshot of Katra')
            expect(img).toHaveClass('object-cover', 'object-top', 'w-full', 'h-full')
        })
    })

    describe('accessibility', () => {
        it('exposes the header content inside a <header> landmark', () => {
            renderHeader()

            expect(screen.getByRole('banner')).toBeInTheDocument()
        })

        it('gives the headshot a non-empty, descriptive alt attribute', () => {
            renderHeader()

            const img = screen.getByAltText('professional headshot of Katra')
            const alt = img.getAttribute('alt')

            expect(alt).toBeTruthy()
            expect(alt!.length).toBeGreaterThan(0)
        })

        it('exposes the call-to-action as a real link with an accessible name', () => {
            renderHeader()

            // getByRole with an explicit `name` already asserts the accessible
            // name resolves correctly from the link's text content.
            expect(
                screen.getByRole('link', { name: 'Get to Know Me' })
            ).toBeInTheDocument()
        })

        it('does not rely on color alone to distinguish the button from its background', () => {
            renderHeader()

            // The button has its own background class distinct from the header's,
            // so it reads as a discrete element rather than blending into the hero.
            const link = screen.getByRole('link', { name: 'Get to Know Me' })
            expect(link).toHaveClass('bg-primary-2')
        })
    })

    describe('visual structure', () => {
        it('renders the header as a rounded, contained hero section', () => {
            renderHeader()

            const header = screen.getByRole('banner')
            expect(header).toHaveClass(
                'bg-primary-3',
                'rounded-3xl',
                'overflow-hidden',
                'relative'
            )
        })

        it('applies fluid clamp-based sizing to the name, title, and CTA text', () => {
            renderHeader()

            const nameParts = [
                screen.getByText('K a t r a'),
                screen.getByText('S t e r n e r'),
            ]
            nameParts.forEach((el) => {
                expect(el.className).toContain('text-[clamp(4rem,6vw,6.5rem)]')
            })

            expect(screen.getByText('Software Engineer').className).toContain(
                'text-[clamp(2rem,2vw,3rem)]'
            )

            expect(
                screen.getByRole('link', { name: 'Get to Know Me' }).className
            ).toContain('text-[clamp(1.25rem,1.5vw,1.75rem)]')
        })

        it('constrains the text column so it does not overlap the photo', () => {
            renderHeader()

            const heading = screen.getByText('K a t r a')
            const textColumn = heading.parentElement!.parentElement!

            expect(textColumn).toHaveClass('max-w-[65%]')
        })

        it('pins the photo to the right edge of the header at a fixed aspect ratio', () => {
            renderHeader()

            const img = screen.getByAltText('professional headshot of Katra')
            const photoFrame = img.parentElement!

            expect(photoFrame).toHaveClass(
                'absolute',
                'right-0',
                'top-0',
                'w-[45%]',
                'aspect-[3/4]'
            )
        })

        it('renders a left-to-right fade overlay on the photo', () => {
            renderHeader()

            const img = screen.getByAltText('professional headshot of Katra')
            const photoFrame = img.parentElement!
            const overlay = photoFrame.querySelector('div')

            expect(overlay).not.toBeNull()
            expect(overlay).toHaveClass(
                'bg-gradient-to-r',
                'from-primary-3',
                'to-transparent'
            )
        })
    })
})