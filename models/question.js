class Question {
    constructor(
        id,
        type,
        title,
        text,
        hint,
        answers,
        correctAnswers,
        correctOrder,
        joker
    ) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.text = text;
        this.hint = hint;
        this.answers = answers;
        this.correctAnswers = correctAnswers;
        this.correctOrder = correctOrder;
        this.joker = joker;
    }
}

export default Question;