class Contact {
	id;
	name;
	email;
	phoneNumber;
}
let contacts = [];
let displaySize = 50;

function initializeStorage(){
	let myContacts = JSON.parse(localStorage.getItem('_myContacts'));	
	if (!(myContacts instanceof Array)) {
		localStorage.setItem('_myContacts', JSON.stringify(contacts));
		return;
	}
	contacts = myContacts;
	listContacts(displaySize, myContacts);
}

function addContact(){
	let contactToAdd = new Contact();
	let contactForm = document.getElementById("contact-form");

	contactToAdd.id = assignContactId();
	contactToAdd.name = contactForm.elements.name.value
	contactToAdd.email = contactForm.elements.email.value
	contactToAdd.phoneNumber = contactForm.elements.phoneNumber.value
	contacts.push(contactToAdd);
	localStorage.setItem('_myContacts', JSON.stringify(contacts));
	showNotification('success', `Contact ${contactToAdd.name} was successfully added`);
	
	contactForm.reset();
	
}

function showNotification(outcome, message){
	let container = document.getElementById("notification-box");
	container.className = '';
	container.classList.add(`text-${outcome}`, `border`, `border-${outcome}`, `mb-4`, `p-2`);
	container.innerHTML = message;
	setTimeout(function clearNotice(){
		container.className = '';
		container.innerHTML = '';
	}, 5000);
}

function listContacts(size, myContacts) {
	let contactBucket = document.getElementById("contacts-bucket");
	contactBucket.innerHTML = '';
	if (myContacts instanceof Array && contactBucket!=null) {

		if(size <= myContacts.length) {
			myContacts = myContacts.slice(0, size);			
	  }

		let orderedList = document.createElement('ol');
		orderedList.classList.add('contact-list', 'container-fluid');

		for (let i = 0; i < myContacts.length; i++) {
			let listItem = createContactItem(myContacts[i]);
			let itemClass = i%2 > 0 ? 'even' : 'odd';
			listItem.classList.add(itemClass);
			orderedList.appendChild(listItem);
		}

		contactBucket.appendChild(orderedList);
	}
}



function assignContactId() {
	if (contacts.length < 1) {
		return 1;
	}
	let maxId = Math.max(...contacts.map(o => o.id));
	return ++maxId;
}

function createContactItem(item){
	let listItem = document.createElement('li');
	listItem.classList.add('row');
	listItem.id = `contact-${item.id}`;
	
	let nameAnchor = document.createElement('a');
	nameAnchor.classList.add('col-12', 'col-md-4', 'p-1');
	nameAnchor.href = `javascript:showEditForm(${item.id});`;
	nameAnchor.innerHTML = item.name;
	
	let emailSpan = document.createElement('span');
	emailSpan.classList.add('col-12', 'col-md-4', 'bi', 'bi-envelope-fill', 'p-1');
	emailSpan.innerHTML = item.email;
	
	let phoneNumberSpan = document.createElement('span');
	phoneNumberSpan.classList.add('col-12', 'col-md-2', 'bi', 'bi-telephone-fill', 'p-1');
	phoneNumberSpan.innerHTML = item.phoneNumber;
	
	let deleteSpan = document.createElement('span');
	deleteSpan.classList.add('col-12', 'col-md-1', 'bi', 'bi-trash', 'p-1', 'text-danger', 'cursor-pointer');
	deleteSpan.addEventListener('click', deleteContact.bind(event,item));
	
	listItem.appendChild(nameAnchor);
	listItem.appendChild(emailSpan);
	listItem.appendChild(phoneNumberSpan);
	listItem.appendChild(deleteSpan);
	
	return listItem;
}

function showEditForm(id){
	let editBucket = document.getElementById('edit-bucket');
	editBucket.classList.remove('hide');
	editBucket.classList.add('show');
	
	let editForm = document.forms['edit-form'];
	let myContacts = JSON.parse(localStorage.getItem('_myContacts'));
	if (myContacts instanceof Array) {
		myContacts.forEach(contact => {
			if(contact.id === id) {
				editForm['id'].value = contact.id;
				editForm['name'].value = contact.name;
				editForm['email'].value = contact.email;
				editForm['phoneNumber'].value = contact.phoneNumber;
			}
		});
	}
}

function updateContact() {
	let myContacts = JSON.parse(localStorage.getItem('_myContacts'));
	if (myContacts instanceof Array) {
		let editForm = document.forms['edit-form'];
		let id = editForm['id'].value;
		let contact = myContacts.find(contact => contact.id == id);
		contact.name = editForm['name'].value;
		contact.email = editForm['email'].value;
		contact.phoneNumber = editForm['phoneNumber'].value;
		localStorage.setItem('_myContacts', JSON.stringify(myContacts));
	}
	
}

function closeEditForm() {
	let editBucket = document.getElementById('edit-bucket');
	editBucket.classList.remove('show');
	editBucket.classList.add('hide');
}

function deleteContact(item) {
	let myContacts = JSON.parse(localStorage.getItem('_myContacts'));
	if(confirm(`Are you sure you want to permanently delete ${item.name}`)) {
		for (let i = 0; i < myContacts.length; i++) {
			if(myContacts[i].id != item.id)
				continue;
			console.log("before splice "+myContacts.length);
			myContacts.splice(i, 1);
			console.log("after splice "+myContacts.length);
			localStorage.setItem('_myContacts', JSON.stringify(myContacts));
			removeFromView(item.id)
		}
		
	}
}

function removeFromView(id){
	let contactToRemove = document.getElementById(`contact-${id}`);
	contactToRemove.remove();
}

function changeDisplaySize(event) {
	let size = event.target.value;
	listContacts(size, contacts);
}

function filterContacts(event){
	const searchText =  event.target.value.toLowerCase();
	const filteredContacts = contacts.filter(
		(c) => c.name.toLowerCase().includes(searchText)
	);
	listContacts(displaySize, filteredContacts);
}
