class FieldCheck {
    constructor(error) {
        this.error = error;
    }

    check() {
        throw new Error("check() not implemented");
    }
}

class FieldCheckRegex extends FieldCheck {
    constructor(regex, error) {
        super(error);
        this.regex = regex;
    }

    check(val) {
        if (!this.regex.test(val)) return this.error;
        return "";
    }
}

class FieldCheckMaxLength extends FieldCheck {
    constructor(maxLength) {
        super(`Максимальная длина равна ${maxLength}.`);
        this.maxLength = maxLength;
    }

    check(val) {
        if (val.length > this.maxLength) return this.error;
        return "";
    }
}

class FieldCheckMinLength extends FieldCheck {
    constructor(minLength) {
        super(`Минимальная длина равна ${minLength}.`);
        this.minLength = minLength;
    }

    check(val) {
        if (val.length < this.minLength) return this.error;
        return "";
    }
}

export class FieldChecks {
    static nonEmpty = new FieldCheckRegex(/\S+/, "Поле не может быть пустым.");
    static onlyLettersWhitespaces = new FieldCheckRegex(/^[A-Za-z\s]+$/, "Разрешены только Латинские буквы и пробелы.");
    static onlyLettersNumbersUnderscores = new FieldCheckRegex(
        /^[A-Za-z0-9_\s]+$/,
        "Разрешены только Латинские буквы, цифры и нижнее подчёркивание."
    );
    static email = new FieldCheckRegex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Проверьте почтовый адрес.");
    static noSpecialChars = new FieldCheckRegex(/^[A-Za-z0-9\s.,()!%]+$/, "Специальные символы не разрешены.");
    static maxLength = (maxLength) => new FieldCheckMaxLength(maxLength);
    static minLength = (minLength) => new FieldCheckMinLength(minLength);
}
