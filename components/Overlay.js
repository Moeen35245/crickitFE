const Overlay = ({ fn }) => {
    return (
        <div
            onClick={(e) => fn()}
            className='min-h-[100vh] min-w-[100vw] bg-black/20 absolute top-0 left-0 z-[90]'
        ></div>
    );
};

export default Overlay;
