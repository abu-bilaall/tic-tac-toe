class Person {
    static species = "Homo Sapiens";

    static aboutPerson() {
        return `Specie: ${this.species}`;
    }

    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

const person1 = new Person('musa', 'abdulrofihi');
