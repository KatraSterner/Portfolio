import {Mail} from "lucide-react";
import { motion } from "motion/react";


const PageFooter = () => {
    const linkStyle = "bg-blank text-primary-1 rounded-2xl shadow-black shadow-md hover:shadow-lg h-8 w-8 flex items-center justify-center"

    return (
        <footer className={'bg-primary-1 flex flex-row flex-wrap gap-2 justify-between items-center p-4 shadow-[inset_0_6px_10px_-1px_rgba(0,0,0,0.5)]'}>
            <p className={'font-bold'}>Katra Sterner - Portfolio Website - 2026</p>
            <div className={'flex flex-row gap-2'}>
                <motion.a
                    href={'/contact'}
                    className={linkStyle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                ><Mail size={20}/></motion.a>
                <motion.a
                    href={'https://github.com/KatraSterner'}
                    className={linkStyle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                ><img src='../../public/Github_Logo.png' className={'h-7 pt-1'} /></motion.a>
                <motion.a
                    href={'https://www.linkedin.com/in/katra-sterner-276480332'}
                    className={linkStyle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                ><img src='../../public/LinkedIn_Logo.png' className={'h-5'} /></motion.a>
                <motion.a
                    href={'https://www.instagram.com/kat.rollie'}
                    className={linkStyle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                ><img src='../../public/Instagram_Logo.png' className={'h-6'} /></motion.a>
            </div>
        </footer>
    )
}

export default PageFooter;