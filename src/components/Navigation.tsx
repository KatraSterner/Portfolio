import { NavLink } from "react-router-dom";
import { Briefcase, Menu, X, FileCode, House, Phone, UserRound } from 'lucide-react';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";


function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(max-width: 639px)");
        const listener = () => setIsMobile(media.matches);

        listener();
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, []);

    return isMobile;
}

const smoothSpring = {
    type: "spring",
    stiffness: 220,
    damping: 20,
    mass: 0.5
} as const;

const Navigation = () => {
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        if (isMobile) {
            setIsOpen(false);
        }
    }, [isMobile])

    const links = [
        {label:"Home", url:"/", icon:(<House size={20} />)},
        {label:"Contact Me", url:"/contact", icon:(<Phone size={20} />)},
        {label:"Experience", url:"/experience", icon:(<Briefcase size={20} />)},
        {label:"Projects", url:"/projects", icon:(<FileCode size={20} />)},
        {label:"About", url:"/about", icon:(<UserRound size={20} />)}
    ]

    const containerStyle = isMobile
        ? "flex flex-col gap-2 fixed top-4 left-4 z-50" // stick to left top
        : "flex flex-row gap-2 fixed top-4 left-1/2 -translate-x-1/2 items-center z-50 origin-center"; // stick to center top

    return (
        <motion.nav
            layout
            className={containerStyle}
            transition={smoothSpring}
        >
            {/* toggle button */}
            <motion.button
                layout
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {setIsOpen(!isOpen)}}
                title={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className={'bg-primary-2 hover:bg-primary-3 shadow-md rounded-2xl flex items-center justify-center h-8 w-8'}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={isMobile ? (isOpen ? "expanded" : "collapsed") : "toggle"}
                        initial={{ opacity: 0, rotate: -45 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 45 }}
                        transition={{ duration: 0.15 }}
                        className={'flex items-center justify-center'}
                    >
                        { isOpen
                            ? <X size={20} />
                            : <Menu size={20} />
                        }
                    </motion.div>
                </AnimatePresence>
            </motion.button>

            {/* navigation link buttons */}
            <AnimatePresence>
                {(!isMobile || isOpen) && (
                    <motion.div
                        layout={"position"}
                        initial={{opacity: 0}}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`flex gap-2 ${ isMobile ? "flex-col item-end w-full" : "flex-row items-center"}`}
                    >
                        {links.map(link => (
                            <motion.div
                                layout
                                layoutId={`nav-item-${link.label}`}
                                key={link.label}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale:0.95 }}
                                className={'rounded-2xl shadow-md overflow-hidden h-8'}
                            >
                                <NavLink
                                    title={link.label}
                                    to={link.url}
                                    onClick={() => isMobile && setIsOpen(false)}
                                    className={({ isActive }: { isActive: boolean }) =>
                                        `flex items-center h-full bg-primary-2 hover:bg-primary-3 font-bold ${isActive ? 'bg-primary-3' : ''}`
                                    }
                                >
                                    <span className={'flex items-center justify-center h-8 w-8'}>
                                        {link.icon}
                                    </span>

                                    <AnimatePresence initial={false} mode="popLayout">
                                        {((!isMobile && isOpen) || isMobile) && (
                                            <motion.span
                                                layout="size"
                                                initial={{ opacity: 0, width: 0, x: -10 }}
                                                animate={{ opacity: 1, width: "auto", x: 0 }}
                                                exit={{ opacity: 0, width: 0, x: -10 }}
                                                transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                                                className={'inline-flex items-center pr-3 whitespace-nowrap text-sm h-full'}
                                            >
                                                {link.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </NavLink>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

export default Navigation;