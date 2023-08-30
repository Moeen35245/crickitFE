import { IconContext } from 'react-icons';

export const IconContainer = ({ color, size, styles, children }) => {
    return (
        <div className={`p-2 rounded-full max-w-[fit-content] flex justify-center items-center ${styles}`}>
            <IconContext.Provider value={{ color: color, size: size }}>{children}</IconContext.Provider>
        </div>
    );
};
