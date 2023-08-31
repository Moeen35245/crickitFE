import { calculateAgeInDays, convertDate } from '@/util/date';
import { FiCalendar, FiCheck, FiChevronLeft, FiChevronRight, FiMapPin, FiUser } from 'react-icons/fi';
import { BiCricketBall } from 'react-icons/bi';
import { TbCricket } from 'react-icons/tb';
import { IconContainer } from './IconContainer';
import PlayerJersey from '../public/player-jersey.svg';
import Image from 'next/image';
const PlayerCard = ({ data }) => {
    return (
        <div className='bg-white shadow-lg rounded-xl border-2 border-primary overflow-hidden relative'>
            <div className='px-3 py-7 flex justify-center items-center border-b-2 border-primary'>
                <h4 className='text-primary text-lg font-bold'>{data.FirstName + ' ' + data.LastName}</h4>
            </div>
            <div className='flex justify-center'>
                <div className='relative overflow-hidden -translate-y-[50%] h-[50px] w-[50px] rounded-full border-2 border-primary'>
                    <Image
                        src={data.Image ? `http://localhost:5500/${data.Image}` : PlayerJersey}
                        objectFit='cover'
                        layout='fill'
                        alt="data.FirstName + ' ' + data.LastName"
                    />
                </div>
            </div>
            <div className='grid grid-cols-2 justify-between'>
                <div className='p-3 rounded-md flex  items-center gap-4'>
                    <IconContainer
                        styles={'border border-primary bg-primary/10'}
                        color={'rgb(99,102,241)'}
                        size={'15px'}
                    >
                        <FiCalendar />
                    </IconContainer>
                    <div className='flex items-start flex-col'>
                        <p className='text-gray-400 text-sm'>Dob:</p>
                        <p className='text-sm font-semibold'>{data.DOB ? convertDate(data.DOB) : 'N/A'}</p>
                    </div>
                </div>

                <div className='p-3 rounded-md flex  items-center gap-4'>
                    <IconContainer
                        styles={'border border-primary bg-primary/10'}
                        color={'rgb(99,102,241)'}
                        size={'15px'}
                    >
                        <FiUser />
                    </IconContainer>
                    <div className='flex items-start flex-col'>
                        <p className='text-gray-400 text-sm'>Role:</p>
                        <p className='text-sm font-semibold'>{data.Role ? data.Role : 'N/A'}</p>
                    </div>
                </div>
            </div>
            <div className=' p-3 rounded-md flex  items-center gap-4'>
                <IconContainer styles={'border border-primary bg-primary/10'} color={'rgb(99,102,241)'} size={'15px'}>
                    <TbCricket />
                </IconContainer>
                <div className='flex items-start flex-col'>
                    <p className='text-gray-400 text-sm'>Batting Style:</p>
                    <p className='text-base font-semibold'>{data.BattingStyle ? data.BattingStyle : 'N/A'}</p>
                </div>
            </div>
            <div className='p-3 rounded-md flex  items-center gap-4'>
                <IconContainer styles={'border border-primary bg-primary/10'} color={'rgb(99,102,241)'} size={'15px'}>
                    <BiCricketBall />
                </IconContainer>
                <div className='flex items-start flex-col'>
                    <p className='text-gray-400 text-sm'>Bowling Style:</p>
                    <p className='text-sm font-semibold text-center'>{data.BowlingStyle ? data.BowlingStyle : 'N/A'}</p>
                </div>
            </div>
            <button className='absolute bottom-0 right-0 p-2 bg-primary text-white rounded-tl-xl hover:text-lg transition-all'>
                <FiChevronRight />
            </button>
        </div>
    );
};

export default PlayerCard;
