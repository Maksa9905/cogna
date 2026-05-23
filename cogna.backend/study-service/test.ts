import { createEmptyCard, fsrs, Rating } from 'ts-fsrs';

const schedule = fsrs();
const card = createEmptyCard();

const result = schedule.next(card, new Date(), Rating.Easy);

console.log(card);
