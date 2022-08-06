const person = {
	firstname: 'John',
	lastname: 'Smith',
	address: {city: 'Hamburg', country: 'Germany'}
};


const {firstname, lastname, address: {city}} = person;
console.log(city);

const fruits = ['Mangoes', 'Apples', 'Guavas'];

console.log(fruits.at(1));