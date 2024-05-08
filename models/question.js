class Question {
    constructor(
        id,
        type,
        text,
        hint,
        answers,
        joker,
        correctAnswers,
        correctOrder
    ) {
        this.id = id;
        this.type = type;
        this.text = text;
        this.hint = hint;
        this.joker = joker;
        this.answers = answers;
        this.correctAnswers = correctAnswers;
        this.correctOrder = correctOrder;
    }
}

export default Question;