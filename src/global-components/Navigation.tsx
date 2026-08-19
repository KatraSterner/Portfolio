import {NavLink} from "react-router-dom";
import {Briefcase, ChevronsLeftRight, FileCode, House, Phone, UserRound} from 'lucide-react';
import {useState} from "react";

const Navigation = () => {
    const [expandedNav, setExpandedNav] = useState<boolean>()
    const links = [
        {label:"Home", url:"/", icon:(<House size={20} />)},
        {label:"Contact Me", url:"/contact", icon:(<Phone size={20} />)},
        {label:"Experience", url:"/experience", icon:(<Briefcase size={20} />)},
        {label:"Projects", url:"/projects", icon:(<FileCode size={20} />)},
        {label:"About", url:"/about", icon:(<UserRound size={20} />)}
    ]

    return (
        <nav className={'flex flex-row justify-between'}>
            {/* TODO: replace with collapsable version with icons */}

            {links.map(link => (
                <NavLink
                    key={link.label}
                    to={link.url}
                    className={({ isActive }) => `bg-primary-2 hover:bg-primary-3 px-4 py-1 rounded-2xl font-bold ${isActive && 'bg-primary-3'}`}
                ><span className={'inline-flex align-middle items-center gap-2'}>{link.icon}{link.label}</span></NavLink>
            ))}
            <button
                onClick={() => {setExpandedNav(!expandedNav)}}
                className={'bg-primary-2 hover:bg-primary-3 rounded-2xl p-1 h-8 w-8 content-center'}>
                <ChevronsLeftRight size={25} />
            </button>

            <p className={`${expandedNav ? 'bg-red-400' : 'bg-blue-400'}`}>yo</p>
        </nav>
    )
}

export default Navigation;