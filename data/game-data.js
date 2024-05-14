import Question from "../models/question";

export const QUESTIONS = [
    new Question(
        'q1',
        'multiselect',
        'Question 1',
        'Select all australian cities that have a mediterranean climate.',
        'The mediterranean climate occurs in southern and southwestern Australia.',
        {
            answer_1: 'Melbourne',
            answer_2: 'Adelaide',
            answer_3: 'Sydney',
            answer_4: 'Perth'
        },
        {   // correct answers are true
            answer_1: false,
            answer_2: true,
            answer_3: false,
            answer_4: true
        },
        [] // no sort order in multiple choice questions
    ),
    new Question(
        'q2',
        'sortable',
        'Question 2',
        'Sort these australian cities by their population from highest to lowest.',
        'As of now, Sydney is still the most populous city of Australia.',
        {
            answer_1: 'Perth',
            answer_2: 'Brisbane',
            answer_3: 'Melbourne',
            answer_4: 'Sydney'
        },
        [], // no correct or wrong answers in sorting questions
        {   // correct sort
            answer_1: 'Sydney',
            answer_2: 'Melbourne',
            answer_3: 'Brisbane',
            answer_4: 'Perth'
        }
    ),
    new Question(
        'q3',
        'multiselect',
        'Question 3',
        'Select all australian cities where the highest temperature measured reached 42 °C or more.',
        'Australia is close to the equator and often has clear skies, making for very warm days.',
        {
            answer_1: 'Canberra',
            answer_2: 'Sydney',
            answer_3: 'Brisbane',
            answer_4: 'Melbourne'
        },
        {   // correct answers are true
            answer_1: true,
            answer_2: true,
            answer_3: true,
            answer_4: true
        },
        [] // no sort order in multiple choice questions
    ),
    new Question(
        'q4',
        'sortable',
        'Question 4',
        'Sort these australian cities based on their annual sunshine duration from highest to lowest.',
        'Melbourne, Sydney and Brisbane are not in the first place.',
        {
            answer_1: 'Sydney',
            answer_2: 'Perth',
            answer_3: 'Melbourne',
            answer_4: 'Brisbane'
        },
        [], // no correct or wrong answers in sorting questions
        {   // correct sort
            answer_1: 'Perth',
            answer_2: 'Brisbane',
            answer_3: 'Sydney',
            answer_4: 'Melbourne'
        }
    ),
    new Question(
        'q5',
        'sortable',
        'Question 5',
        'Sort these australian cities based on their Gross Domestic Product (GDP) per capita from highest to lowest.',
        'Adelaide has the lowest GDP per capita of the four.',
        {
            answer_1: 'Melbourne',
            answer_2: 'Sydney',
            answer_3: 'Adelaide',
            answer_4: 'Brisbane'
        },
        [], // no correct or wrong answers in sorting questions
        {   // correct sort
            answer_1: 'Sydney',
            answer_2: 'Melbourne',
            answer_3: 'Brisbane',
            answer_4: 'Adelaide'
        }
    ),
    new Question(
        'q6',
        'multiselect',
        'Question 6',
        'Select all nations whose maritime navigators discovered the coast of Australia.',
        'Either Spain or Purtugal are incorrectly on this list.',
        {
            answer_1: 'Netherlands',
            answer_2: 'Portugal',
            answer_3: 'Spain',
            answer_4: 'Great Britain'
        },
        {   // correct sort
            answer_1: true,
            answer_2: false,
            answer_3: true,
            answer_4: true
        },
        [] // no correct or wrong answers in sorting questions
    ),
    new Question(
        'q7',
        'multiselect',
        'Question 7',
        'Select all australian cities with an annual mean number of days of rain greater or equal than 130.',
        'Sunny cities, like Brisbane usually have less days of rain.',
        {
            answer_1: 'Canberra',
            answer_2: 'Sydney',
            answer_3: 'Brisbane',
            answer_4: 'Melbourne'
        },
        {   // correct sort
            answer_1: false,
            answer_2: true,
            answer_3: false,
            answer_4: true
        },
        [] // no correct or wrong answers in sorting questions
    )
];