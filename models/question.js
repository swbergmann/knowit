/**
 * DATA MODEL
 * 
 * 
 * This class defines the constructor and attributes for a Question object.
 * 
 * Type 'multiselect' defines correct answers as true or false in the 'correctAnswers' attribute.
 * 
 *  id                  identifier
 * 
 *  type                'multiselect' defines correct answers as true or false in the 'correctAnswers' attribute.
 *                      'sortable' defines the correct order of answers in the 'correctOrder' attribute.
 * 
 *  title               i.e. "Question 1"
 * 
 *  text                the actual question
 * 
 *  hint                hints provide additional information that makes it easier to answer the question
 * 
 *  answers             an object of 4 possible answers i.e.
 *                      {
 *                          answer_1: 'Melbourne',
 *                          answer_2: 'Adelaide',
 *                          answer_3: 'Sydney',
 *                          answer_4: 'Perth'
 *                      }
 * 
 *  correctAnswers      in 'sortable' questions this attribute is an empty object i.e. {}
 *                      only questions of type 'multiselect' have correct answers and they are 'true' i.e.
 *                      {
 *                          answer_1: false,
 *                          answer_2: true,
 *                          answer_3: false,
 *                          answer_4: true
 *                      }
 * 
 *  correctOrder        in 'multiselect' questions this attribute is an empty object i.e. {}
 *                      only questions of type 'sortable' have a correct order of answers i.e.
 *                      {
 *                          answer_1: 'Sydney',
 *                          answer_2: 'Melbourne',
 *                          answer_3: 'Brisbane',
 *                          answer_4: 'Perth'
 *                      }
 */

class Question {
    constructor(
        id,
        type,
        title,
        text,
        hint,
        answers,
        correctAnswers,
        correctOrder
    ) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.text = text;
        this.hint = hint;
        this.answers = answers;
        this.correctAnswers = correctAnswers;
        this.correctOrder = correctOrder;
    }
}

export default Question;