const todo_api_URL = "https://todo-jkgw.onrender.com/api/todo/";
import popupFun from "./popup.js";

window.addEventListener("load", async () => {
  getData();
});

//read data
let getData = async () => {
  let res = await fetch(todo_api_URL);
  let data = await res.json();
  console.log("data:", data);
  renderDom(data);
};

//render data on page
let renderDom = (data) => {
  let dataContainer = document.getElementById("dataContainer");
  dataContainer.innerHTML = null;

  data.forEach(({ id, title, status }) => {
    // Create card div and add Bootstrap classes
    let cardDiv = document.createElement("div");
    cardDiv.className = "col-md-4 card-div";

    // Apply card class to create Bootstrap card
    let card = document.createElement("div");
    card.className = "card w-100";

    // Create card body
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Create and style h5 element for card title
    let h5 = document.createElement("h3");
    h5.className = "card-title";
    h5.innerText = title;

    // Create and style p element for card text
    let p = document.createElement("p");
    p.className = "card-text";
    p.innerText = status === true ? "Active" : "Inactive";

    // Create a button element for toggle action
    let toggleBtn = document.createElement("button");
    toggleBtn.className = "btn btn-primary";
    toggleBtn.innerText = "Toggle";
    toggleBtn.onclick = () => {
      toggleTodo(id);
    };

    // Create a button element for edit action
    let editBtn = document.createElement("button");
    editBtn.className = "btn btn-primary";
    editBtn.innerText = "Edit";
    editBtn.onclick = () => {
      editTodo(id);
    };

    // Create a button element for remove action
    let removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger";
    removeBtn.innerText = "Remove";
    removeBtn.onclick = () => {
      deleteTodo(id);
    };

    // Append elements to build the card structure
    cardBody.append(h5, p, toggleBtn, editBtn, removeBtn);
    card.append(cardBody);
    cardDiv.append(card);
    dataContainer.append(cardDiv);
  });
};

//crud
//create , read, update(put & patch), delete

//create //add item to database
let addTodoItem = async () => {
  //get data from user
  let todo = document.getElementById("todo").value;

  let data = {
    title: todo,
    status: false,
    id: Date.now(),
  };
  let response = await fetch(todo_api_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getData();
  document.getElementById("todo").value = null;
};
document.querySelector("#add_todo").addEventListener("click", addTodoItem);

//patch - modifies
//toggle todo item /// active / inactive
let toggleTodo = async (id) => {
  let todo = await fetch(`${todo_api_URL}${id}`);
  todo = await todo.json();

  let data = {
    status: !todo.status,
  };

  let response = await fetch(`${todo_api_URL}${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getData();
};

//delete todo item
let deleteTodo = async (id) => {
  let response = await fetch(`${todo_api_URL}${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  getData();
};

//pop-up box
//edit/patch //// edit todo title
let editTodo = (id) => {
  popup.style.display = "block";
  document.getElementById("popup").innerHTML = popupFun();
  const editedValueInput = document.getElementById("editedValue");
  const submitButton = document.getElementById("submit");

  submitButton.addEventListener("click", async () => {
    const enteredValue = editedValueInput.value;
    // console.log("Entered Value:", enteredValue);
    popup.style.display = "none";

    let updatedTitle = editedValueInput.value;
    // let updatedTitle = prompt("Enter new Title");
    if (updatedTitle === "") return false;
    let todo = await fetch(`${todo_api_URL}${id}`);
    todo = await todo.json();

    let data = {
      title: updatedTitle,
    };

    let response = await fetch(`${todo_api_URL}${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    getData();
  });
};
