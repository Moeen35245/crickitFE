import { convertDate } from '@/util/date';
import { FiCalendar, FiCheck, FiChevronLeft, FiChevronRight, FiMapPin } from 'react-icons/fi';
import { BiCricketBall } from 'react-icons/bi';
import { IconContainer } from './IconContainer';
const TournamentCard = ({ name, start, end, venue, format }) => {
    return (
        <div className='bg-white shadow-lg rounded-xl border-2 border-primary overflow-hidden relative'>
            <div className='p-3 flex justify-center items-center border-b-2 border-primary'>
                <h4 className='text-primary text-lg font-bold'>{name}</h4>
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
                        <p className='text-gray-400 text-sm'>Start:</p>
                        <p className='text-sm font-semibold'>{convertDate(start)}</p>
                    </div>
                </div>
                <div className='p-3 rounded-md flex  items-center gap-4'>
                    <IconContainer
                        styles={'border border-primary bg-primary/10'}
                        color={'rgb(99,102,241)'}
                        size={'15px'}
                    >
                        <FiCheck />
                    </IconContainer>
                    <div className='flex items-start flex-col'>
                        <p className='text-gray-400 text-sm'>End:</p>
                        <p className='text-sm font-semibold'>{convertDate(end)}</p>
                    </div>
                </div>
            </div>

            {/* <div className=' p-3 rounded-md flex  items-center gap-4'>
                <IconContainer styles={'border border-primary bg-primary/10'} color={'rgb(99,102,241)'} size={'20px'}>
                    <BiCricketBall />
                </IconContainer>
                <div className='flex items-start flex-col'>
                    <p className='text-gray-400 text-sm'>Format:</p>
                    <p className='text-base font-semibold'>{format}</p>
                </div>
            </div> */}
            <div className='p-3 rounded-md flex  items-center gap-4'>
                <IconContainer styles={'border border-primary bg-primary/10'} color={'rgb(99,102,241)'} size={'15px'}>
                    <FiMapPin />
                </IconContainer>
                <div className='flex items-start flex-col'>
                    <p className='text-gray-400 text-sm'>Venue:</p>
                    <p className='text-sm font-semibold text-center'>{venue}</p>
                </div>
            </div>

            <button className='absolute bottom-0 right-0 p-2 bg-primary text-white rounded-tl-xl hover:text-lg transition-all'>
                <FiChevronRight />
            </button>
        </div>
    );
};

export default TournamentCard;
