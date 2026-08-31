import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import PageFooter from '../PageFooter'


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

function renderFooter() {
    return render(<PageFooter />)
}

describe('PageFooter', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    // --- Visual Tests ---

    it('renders the copyright/name text', () => {
        renderFooter()

        expect(
            screen.getByText('Katra Sterner - Portfolio Website - 2026')
        ).toBeInTheDocument()
    })

    it('renders exactly four links', () => {
        renderFooter()

        expect(screen.getAllByRole('link')).toHaveLength(4)
    })

    it('points each link to the correct destination', () => {
        renderFooter()

        const links = screen.getAllByRole('link')
        const hrefs = links.map((link) => link.getAttribute('href'))

        expect(hrefs).toEqual([
            '/contact',
            'https://github.com/KatraSterner',
            'https://www.linkedin.com/in/katra-sterner-276480332',
            'https://www.instagram.com/kat.rollie',
        ])
    })

    it('applies the shared link styling to every link', () => {
        renderFooter()

        screen.getAllByRole('link').forEach((link) => {
            expect(link).toHaveClass(
                'bg-blank',
                'text-primary-1',
                'rounded-2xl',
                'shadow-black',
                'shadow-md',
                'hover:shadow-lg',
                'h-8',
                'w-8',
                'flex',
                'items-center',
                'justify-center'
            )
        })
    })

    // --- Accessibility Tests ---
    it('gives the email link an accessible name from aria-label', () => {
        renderFooter()

        const link = screen.getByRole('link', { name: 'Email Me' })
        expect(link).toHaveAttribute('href', '/contact')
    })

    it('hides the mail icon from assistive tech since the link is already labeled', () => {
        renderFooter()

        const link = screen.getByRole('link', { name: 'Email Me' })
        const icon = link.querySelector('svg')

        expect(icon).toHaveClass('lucide-mail')
        expect(icon).toHaveAttribute('aria-hidden', 'true')
    })

    it('gives each social link an accessible name from its logo alt text', () => {
        renderFooter()

        expect(
            screen.getByRole('link', { name: 'GitHub Logo' })
        ).toHaveAttribute('href', 'https://github.com/KatraSterner')

        expect(
            screen.getByRole('link', { name: 'LinkedIn Logo' })
        ).toHaveAttribute(
            'href',
            'https://www.linkedin.com/in/katra-sterner-276480332'
        )

        expect(
            screen.getByRole('link', { name: 'Instagram Logo' })
        ).toHaveAttribute('href', 'https://www.instagram.com/kat.rollie')
    })

    it('sets a hover tooltip title on every link', () => {
        renderFooter()

        expect(screen.getByRole('link', { name: 'Email Me' })).toHaveAttribute(
            'title',
            'Email'
        )
        expect(
            screen.getByRole('link', { name: 'GitHub Logo' })
        ).toHaveAttribute('title', 'GitHub Profile')
        expect(
            screen.getByRole('link', { name: 'LinkedIn Logo' })
        ).toHaveAttribute('title', 'LinkedIn Profile')
        expect(
            screen.getByRole('link', { name: 'Instagram Logo' })
        ).toHaveAttribute('title', 'Instagram Profile')
    })

    it('renders the correct logo image size classes for each social link', () => {
        renderFooter()

        expect(
            screen.getByRole('link', { name: 'GitHub Logo' }).querySelector('img')
        ).toHaveClass('h-7', 'pt-1')

        expect(
            screen.getByRole('link', { name: 'LinkedIn Logo' }).querySelector('img')
        ).toHaveClass('h-5')

        expect(
            screen.getByRole('link', { name: 'Instagram Logo' }).querySelector('img')
        ).toHaveClass('h-6')
    })
})