import Question from "../models/question";

export const QUESTIONS = [
    new Question(
        'q1',
        'multiselect',
        'Question 1',
        'Select all states that have a mediterranian climate.',
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
    )
];