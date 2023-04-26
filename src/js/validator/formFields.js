export class FieldsContainer {
    constructor() {
        this.fields = {};
    }
    /**
     * Add field to container.
     * @param {string} name - The field name.
     * @param {string} value - The field value.
     * @param {Array} checks - Array of necessary FieldCheck objects.
     */
    addField(name, value, checks) {
        this.fields[name] = new Field(value, checks);
    }
}

export class Field {
    constructor(value, checks) {
        this.value = value;
        this.checks = checks;
    }

    tryGetFirstError() {
        let result = "";

        this.checks.every((fieldCheck) => {
            result = fieldCheck.check(this.value);
            return result === ""; //break or continue every()
        });

        return result;
    }

    tryGetAllErrors() {
        let result = this.checks.flatMap((fieldCheck) => {
            let err = fieldCheck.check(this.value);
            return err === "" ? [] : [err];
        });

        return result.join(", ");
    }
}
