export const ErrorEnum = {
    EmptyText : 1,
    EndDateIsLowerTanCurrent : 2,
    IntervalIsNegative : 3
};

export const GetErrorText = (error) => {
    if(error === ErrorEnum.EmptyText)
        return "Требуется заполнить текст задачи"

    if(error === ErrorEnum.EndDateIsLowerTanCurrent)
        return "Дата окончания промежутка меньше текущей даты"

    if(error === ErrorEnum.IntervalIsNegative)
        return "Интервал повторения должен быть больше 1"
}

