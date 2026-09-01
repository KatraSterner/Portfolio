import {Mail} from "lucide-react";
import { motion } from "motion/react";
import github_logo from "../assets/icons/Github_Logo.png";
import linkedIn_logo from "../assets/icons/LinkedIn_logo.png";
import instagram_logo from "../assets/icons/Instagram_Logo.png";

const PageFooter = () => {
    const linkStyle = "bg-blank text-primary-1 rounded-2xl shadow-black shadow-md hover:shadow-lg h-8 w-8 flex items-center justify-center"

    return (
        <footer className={'bg-primary-1 flex flex-row flex-wrap gap-2 justify-between items-center p-4 shadow-[inset_0_6px_10px_-1px_rgba(0,0,0,0.5)]'}>
            <p className={'font-bold'}>Katra Sterner - Portfolio Website - 2026</p>
            <div className={'flex flex-row gap-2'}>
                <motion.a
                    title={"Email"}
                    aria-label={"Email Me"}
                    href={'/contact'}
                    className={linkStyle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                ><Mail size={20} aria-hidden={"true"} /></motion.a>
                <motion.a
                    title={"GitHub Profile"}
                    href={'https://github.com/KatraSterner'}
                    className={linkStyle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                ><img src={github_logo} alt={"GitHub Logo"} className={'h-7 pt-1'} /></motion.a>
                <motion.a
                    title={"LinkedIn Profile"}
                    href={'https://www.linkedin.com/in/katra-sterner-276480332'}
                    className={linkStyle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                ><img src={linkedIn_logo} alt={"LinkedIn Logo"} className={'h-5'} /></motion.a>
                <motion.a
                    title={"Instagram Profile"}
                    href={'https://www.instagram.com/kat.rollie'}
                    className={linkStyle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                ><img src={instagram_logo} alt={"Instagram Logo"} className={'h-6'} /></motion.a>
            </div>
        </footer>
    )
}

export default PageFooter;