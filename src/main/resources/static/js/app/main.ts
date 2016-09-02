/// <reference path="typings/globals/jquery/index.d.ts" />
/// <reference path="person.ts" />

function greeter(person: Person) {
    return "hallo " + person.name;
}

let person = new Person("bert");

$(document).ready(() => {
    $("body")[0].innerHTML = greeter(person);
});
