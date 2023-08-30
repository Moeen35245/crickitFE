'use client';
import { XMarkIcon } from '@heroicons/react/24/solid';
const SideDrawer = ({ fn, style, children }) => {
    return (
        <div className={`z-[100] fixed top-0 right-0 w-[35vw] min-h-[100vh] bg-white py-5 px-2 ${style}`}>
            <div className='h-full w-full relative'>
                <div onClick={(e) => fn()} className='sticky max-w-[fit-content] top-5 left-5 cursor-pointer'>
                    <XMarkIcon className='h-5 w-5' />
                </div>
                {children}
            </div>
        </div>
    );
};

export default SideDrawer;
