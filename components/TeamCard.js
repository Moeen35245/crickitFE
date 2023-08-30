'use clinet';
import Image from 'next/image';
import TeamImage from '../public/team.jpg';
import { FiChevronRight } from 'react-icons/fi';
const TeamCard = ({ img, player, name }) => {
    return (
        <div className='rounded-lg overflow-hidden bg-white border-2 border-primary shadow-lg p-3 relative'>
            <div className='flex items-center gap-5'>
                <div className='h-[45px] w-[45px] rounded-full overflow-hidden p-2 border-2 border-primary relative'>
                    <Image src={img || TeamImage} layout='fill' objectFit='cover' />
                </div>
                <div className=''>
                    <h3 className='text-xl col-span-2  font-bold'>{name}</h3>
                    <p className='text-gray-400 text-sm'>{player} Players</p>
                </div>
            </div>
            <button className='absolute bottom-0 right-0 p-2 bg-primary text-white rounded-tl-xl hover:text-lg transition-all'>
                <FiChevronRight />
            </button>
        </div>
    );
};

export default TeamCard;
