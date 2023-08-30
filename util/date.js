import { format, differenceInYears, differenceInDays } from 'date-fns';
import enGB from 'date-fns/locale/en-GB';

export function calculateAgeInDays(dob) {
    const dobDate = new Date(dob);
    const currentDate = new Date();

    const ageYears = differenceInYears(currentDate, dobDate);
    const remainingDays = differenceInDays(currentDate, dobDate);
    const cappedRemainingDays = remainingDays;

    return `${ageYears} yr ${cappedRemainingDays} d`;
}

export const convertDate = (inputDateString) => {
    const inputDate = new Date(inputDateString);
    return format(inputDate, 'd MMM yyyy', { locale: enGB });
    // Output: "ex. 3 Aug 2023"
};
