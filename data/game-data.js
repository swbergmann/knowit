import Question from "../models/question";

export const QUESTIONS = [
    new Question(
        'q1',
        'multiselect',
        'Question 1',
        'Select all australian cities that have a mediterranian climate.',
        'Mediterranian climates occur only in western-bound locations.',
        {
            answer_1: 'Perth',
            answer_2: 'Adelaide',
            answer_3: 'Sydney',
            answer_4: 'Melbourne'
        },
        {   // correct answers are true
            answer_1: true,
            answer_2: true,
            answer_3: false,
            answer_4: false
        },
        [], // no sort order in multiple choice questions
        ['answer_3', 'answer_4']
    ),
    new Question(
        'q2',
        'sortable',
        'Question 2',
        'Sort these australian cities based on their population from highest to lowest.',
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
        },
        [] // no correct or wrong answers in sorting questions
    ),
    new Question(
        'q3',
        'multiselect',
        'Question 3',
        'Select all cities that have more than 100 sunshine days per year.',
        'Canberra is famous for its many sunshine days.',
        {
            answer_1: 'Canberra',
            answer_2: 'Sydney',
            answer_3: 'Brisbane',
            answer_4: 'Melbourne'
        },
        {   // correct answers are true
            answer_1: true,
            answer_2: false,
            answer_3: true,
            answer_4: false
        },
        [], // no sort order in multiple choice questions
        ['answer_2', 'answer_4']
    ),
    new Question(
        'q4',
        'sortable',
        'Question 4',
        'Sort these australian universities based on their population from highest to lowest.',
        'Melbourne, Sydney and Queensland are not in the first place.',
        {
            answer_1: 'Australian National University',
            answer_2: 'University of Melbourne',
            answer_3: 'University of Sydney',
            answer_4: 'University of Queensland'
        },
        [], // no correct or wrong answers in sorting questions
        {   // correct sort
            answer_1: 'University of Queensland',
            answer_2: 'University of Sydney',
            answer_3: 'University of Melbourne',
            answer_4: 'Australian National University'
        },
        [] // no correct or wrong answers in sorting questions
    )
];