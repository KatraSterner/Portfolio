import HomeHeader from "../Home/HomeHeader.tsx";

export default function Home() {
    return (
        <div className={'flex flex-col p-3 pt-0'}>
            <div className={'w-full max-w-[1400px] mx-auto flex flex-col gap-6'}>
                <HomeHeader />
                {/* TODO: carousel */}
                {/* TODO: tabs */}
            </div>
        </div>

    );
}