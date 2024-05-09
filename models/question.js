class Question {
    constructor(
        id,
        type,
        title,
        text,
        hint,
        answers,
        joker,
        correctAnswers,
        correctOrder
    ) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.text = text;
        this.hint = hint;
        this.joker = joker;
        this.answers = answers;
        this.correctAnswers = correctAnswers;
        this.correctOrder = correctOrder;
    }
}

export default Question;