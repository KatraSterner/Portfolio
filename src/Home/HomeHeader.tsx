import { motion } from 'motion/react';
import headshot from '../assets/images/Kat_Headshot_1.png'

const HomeHeader = () => {
    return (
        <header className={'relative bg-primary-3 p-8 rounded-3xl text-blank text-xl overflow-hidden min-h-[26rem] flex items-center'}>
            <div className={'relative pl-10 z-10 flex flex-col justify-center max-w-[65%]'}>
                <div className={'flex flex-row flex-wrap gap-x-14'}>
                    <p className={"text-[clamp(4rem,6vw,6.5rem)] italic font-bold leading-tight"}>K a t r a</p>
                    <p className={"text-[clamp(4rem,6vw,6.5rem)] italic font-bold leading-tight"}>S t e r n e r</p>
                </div>
                <p className={"text-[clamp(2rem,2vw,3rem)] font-bold"}>Software Engineer</p>
                <motion.a
                    href={'/about'}
                    className={"self-start text-[clamp(1.25rem,1.5vw,1.75rem)] font-bold bg-primary-2 rounded-2xl p-3 px-12 mt-6 shadow-md hover:shadow-lg"}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >Get to Know Me</motion.a>
            </div>

            <div className={'absolute right-0 top-0 h-full w-[45%] rounded-2xl overflow-hidden aspect-[3/4]'}>
                <img
                    src={headshot}
                    alt={"professional headshot of Katra"}
                    className={"absolute inset-0 w-full h-full object-cover object-top"}
                />
                <div className={"absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-primary-3 to-transparent"} />
            </div>
        </header>
    )
}

export default HomeHeader;