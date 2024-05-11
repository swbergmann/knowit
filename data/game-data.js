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
        ['answer_3', 'answer_4'],
        ['answer_1', 'answer_2'],
        [] // no sort order in multiple choice questions
    ),
    new Question(
        'q2',
        'sort',
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
        [], // no correct or wrong answers in sorting questions
        ['answer_4', 'answer_3', 'answer_2', 'answer_1']
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
        ['answer_2', 'answer_4'],
        ['answer_1', 'answer_3'],
        [] // no sort order in multiple choice questions
    ),
    new Question(
        'q4',
        'sort',
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
        [], // no correct or wrong answers in sorting questions
        ['answer_4', 'answer_3', 'answer_2', 'answer_1']
    )
];