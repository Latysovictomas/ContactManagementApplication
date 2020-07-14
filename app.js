// Contact Class: Represents a Contact
class Contact {
  constructor(name, surname, birth, number, email, address) {
    this.name = name;
    this.surname = surname;
    this.birth = birth;
    this.number = number;
    this.email = email;
    this.address = address;
  }
}

// UI CLass: Handle UI Tasks
class UI {
  static displayContacts() {

    const contacts = Store.getContacts();

    contacts.forEach((contact) => UI.addContactToList(contact));
  }

static addContactToList(contact) {
  	const list = document.getElementById('contact-list'); // queryselector
    const row = document.createElement('tr');

    row.innerHTML =
    '<td>'+contact.name+'</td>\
    <td>'+contact.surname+'</td>\
    <td>'+contact.birth+'</td>\
    <td>'+contact.number+'</td>\
    <td>'+contact.email+'</td>\
    <td>'+contact.address+'</td>\
    <td><a href="#" class="fa fa-edit edit"></a></td>\
    <td><a href="#" class="fa fa-save save"></a></td>\
    <td><a href="#" class="fa fa-close delete"></a></td>';

    list.appendChild(row);
}



static deleteContact(el){
  if(el.classList.contains('delete')){
    el.parentElement.parentElement.remove();
  }
}

static editContact(el){
  if(el.classList.contains('edit')){

    let contact_rows = el.parentElement.parentElement;
    if (!contact_rows.children[0].innerHTML.includes("<input type")){ // fixing when double click on edit

      const name = contact_rows.children[0];
      const surname = contact_rows.children[1];
      const birth = contact_rows.children[2];
      const number = contact_rows.children[3];
      const email = contact_rows.children[4];
      const address = contact_rows.children[5];

      const name_data = name.innerHTML;
      const surname_data = surname.innerHTML;
      const birth_data = birth.innerHTML;
      const number_data = number.innerHTML;
      const email_data = email.innerHTML;
      const address_data = address.innerHTML;

      name.innerHTML="<input type='text' pattern='[A-Za-z]+' maxlength='35' title='Only letters allowed.' id='tb_name"+contact_rows.rowIndex+"' value='"+name_data+"' required>";
      surname.innerHTML = "<input type='text' maxlength='35' id='tb_surname"+contact_rows.rowIndex+"' value='"+surname_data+"'>";
      birth.innerHTML = "<input type='date' id='tb_birth"+contact_rows.rowIndex+"' value='"+birth_data+"'>";
      number.innerHTML = "<input type='tel' maxlength='15' id='tb_number"+contact_rows.rowIndex+"' value='"+number_data+"'>";
      email.innerHTML = "<input type='email' maxlength='254' id='tb_email"+contact_rows.rowIndex+"' value='"+email_data+"'>";
      address.innerHTML = "<input type='address' maxlength='95' id='tb_address"+contact_rows.rowIndex+"' value='"+address_data+"'>";

    }
  }
}

static saveContact(el){
  if(el.classList.contains('save')){
    let contact_rows = el.parentElement.parentElement;
    const name = document.getElementById('tb_name'+String(contact_rows.rowIndex)).value;
    const surname = document.getElementById('tb_surname'+String(contact_rows.rowIndex)).value;
    const birth = document.getElementById('tb_birth'+String(contact_rows.rowIndex)).value;
    const number = document.getElementById('tb_number'+String(contact_rows.rowIndex)).value;
    const email = document.getElementById('tb_email'+String(contact_rows.rowIndex)).value;
    const address = document.getElementById('tb_address'+String(contact_rows.rowIndex)).value;
    let contact = new Contact(name, surname, birth, number, email, address);

    // Validate fields
    if (Store.validateFields(contact)==true){

      if(Store.checkIfAttributeExists(contact.number, contact.email, contact_rows.rowIndex-1)===false){

        contact_rows.children[0].innerHTML = '<td>'+name+'</td>';
        contact_rows.children[1].innerHTML ='<td>'+surname+'</td>';
        contact_rows.children[2].innerHTML ='<td>'+birth+'</td>';
        contact_rows.children[3].innerHTML ='<td>'+number+'</td>';
        contact_rows.children[4].innerHTML ='<td>'+email+'</td>';
        contact_rows.children[5].innerHTML ='<td>'+address+'</td>';
        // Saving to the localStorage
        Store.overwriteContact(contact, contact_rows.rowIndex-1);

      } else {

        alert('Contact cannot be updated. Phone number or email already exist.')
      }


    } else
    {
      alert("Not valid format.")

    }





  }
}
static clearFields() {
  document.getElementById('name').value='';
  document.getElementById('surname').value='';
  document.getElementById('birth').value='';
  document.getElementById('phone').value='';
  document.getElementById('email').value='';
  document.getElementById('address').value='';
  }

}


// Store Class: Handles Storage
class Store {
  static getContacts(){
    let contacts;
    if(localStorage.getItem('contacts') === null){
      contacts = [];
    } else {
      contacts = JSON.parse(localStorage.getItem("contacts"));
    }
    return contacts;
  }

  static addContact(contact){
    const contacts = Store.getContacts();
    contacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }

  static overwriteContact(contact, index){
    const contacts = Store.getContacts();
    if (index !== -1) {
    contacts[index] = contact;
}
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }

  static removeContact(number){
    // A number is referred to a phone number
    const contacts = Store.getContacts();
    contacts.forEach((contact, index)=>{
      if(contact.number === number){
        contacts.splice(index, 1);
      }
    });
    localStorage.setItem('contacts', JSON.stringify(contacts));

  }

  static checkIfAttributeExists(number, email, index=-1){
      let isIncluded;
      const contacts = Store.getContacts();


      if (index > -1) {
          contacts.splice(index, 1);
          }



      let arrayOfNumbers = contacts.map((value)=>{
        return value.number;
      })
      let arrayOfEmails = contacts.map((value)=>{
        return value.email;
      })
      if(arrayOfNumbers.includes(number) || arrayOfEmails.includes(email)){
        isIncluded = true;
      } else {
        isIncluded = false;
      }


    return isIncluded;
  }

  static validateFields(contact){
    let reLetters = /^[A-Za-z]+$/;
    let reNumbers = /^[0-9]+$/;
    let reEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    let isValid;
    if(contact.name.match(reLetters) && contact.surname.match(reLetters)
    && contact.number.match(reNumbers) && contact.email.match(reEmail)){
      isValid = true;
    } else
    {
      isValid= false;
    }


    return isValid;

  }

}

// Event: Display Contacts
document.addEventListener('DOMContentLoaded', UI.displayContacts());

// Event: Add a Contact
document.getElementById('contact-form').addEventListener('submit', (e)=> {
  // Prevent fast reload
  e.preventDefault();

  // Get form values
  const name = document.getElementById('name').value;
  const surname = document.getElementById('surname').value;
  const birth = document.getElementById('birth').value;
  const number = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;


 // validate phone number and email
 if(Store.checkIfAttributeExists(number, email)===true){
   alert('Contact cannot be added. Phone number or email already exist.')
 } else {
   // Contact object
   const contact = new Contact(name, surname, birth, number, email, address);
   // Add Contact to UI
   UI.addContactToList(contact);
   // Add Contact to Storage
   Store.addContact(contact);
   // Clear fields
   UI.clearFields();
 }



});

// Event: Remove a Contact
document.getElementById('contact-list').addEventListener('click', (e)=> {
  // Remove contact from UI
  UI.deleteContact(e.target);
  // Remove contact from localStorage
  Store.removeContact(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

});

// Event: Edit a Contact
document.getElementById('contact-list').addEventListener('click', (e)=> {
  // Edit contact from UI
  UI.editContact(e.target);
});

// Event: Save a Contact
document.getElementById('contact-list').addEventListener('click', (e)=> {
  // Save contact from UI
  UI.saveContact(e.target);
  // Save to the localStorage
});
