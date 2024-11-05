'use strict';

// vars
const userForm = document.getElementById("users");
const confirmBtn = document.getElementById("confirm-btn");
const submitBtn = document.getElementById("submit-btn");
const resetBtn = document.getElementById("reset-btn");
const listContainer = document.getElementById('user-body');
const table = document.getElementById('user-table');
let usersFormDataObject;


// click on form buttons

confirmBtn.addEventListener("click", (e) => {
  e.preventDefault();
  submitBtn.classList.remove("disabled");
   createUserData();
});

resetBtn.addEventListener("click", () => {
  submitBtn.classList.add("disabled");
  usersFormDataObject = null;
});

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  sendUserData();
});

// creating an object from the form inputs data

function createUserData() {
  const usersFormData = new FormData(userForm);
  usersFormDataObject = Object.fromEntries(usersFormData);
  usersFormDataObject.date = (new Date().toLocaleString()).slice(0,17);
  console.log(usersFormDataObject);
}

// sending data to the server

async function sendUserData() {
  await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(usersFormDataObject),
  });
}

// getting data from server

async function getUserList() {
  let response = await fetch("http://localhost:3000/users");
  let getData = await response.json();
  renderUsers(getData);
}
getUserList();

// rendering data  from server

function renderUsers(data) {
  data.forEach((user) => {
    listContainer.innerHTML += `
   <tr class="table__tr">
        <td class="table__td">${user.name} ${user.surname}</td>
        <td class="table__td">${user.sex}</td>
        <td class="table__td">${user.age}</td>
        <td class="table__td">${user.date}</td>
        <td class="table__td"><button class="users__btn del-btn" id="${user.id}">delete</button></td>
      </tr>
      `;
  });
}

// removing user from list

table.addEventListener("click", function (event) {
  event.preventDefault();
  let delBtn = event.target.closest(".del-btn");
  if (delBtn) {
    delBtn.closest(".table__tr").remove();
    delUserFromServer(delBtn.id);
  }
});

async function delUserFromServer(id) {
  await fetch(`http://localhost:3000/users/${id}`, {
    method: "DELETE",
  });
}
