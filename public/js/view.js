$(document).ready(function() {
  // Getting a reference to the input field where user adds a new burger
  var newItemInput = $("input.new-item");
  // Our new burgers will go inside the burgerContainer
  var burgerContainer = $(".burger-container");
  var burgerDevoured = $(".burger-devoured");

  $(document).on("click", "button.devoured", toggleDevoured);
  $(document).on("submit", "#burger-form", insertBurger);
  var burgers;

  // Getting burgers from database when page loads
  getBurgers();

  // This function resets the burgers displayed with new burgers from the database
  function initializeRows() {
    burgerContainer.empty();
    burgerDevoured.empty();
    var rowsToAdd = [];
    var rowsToAddDevoured = [];
    for (var i = 0; i < burgers.length; i++) {
      if(burgers[i].devoured == false){
        rowsToAdd.push(createNewRow(burgers[i]));
      }
      else{
        rowsToAddDevoured.push(createNewDevoured(burgers[i]));
      } 
   }
    burgerContainer.prepend(rowsToAdd);
    burgerDevoured.prepend(rowsToAddDevoured);
  }

  // This function grabs burgers from the database and updates the view
  function getBurgers() {
    $.get("/api/burgers", function(data) {
      console.log("Burgers", data);
      burgers = data;
      initializeRows();
    });
  }

  // This function sets a burgers complete attribute to the opposite of what it is
  // and then runs the updateburger function
  function toggleDevoured() {
    var burger = $(this)
      .parent()
      .data("burger");

    burger.devoured = !burger.devoured;
    updateBurger(burger);
  }

  // This function updates a burger in our database
  function updateBurger(burger) {
    $.ajax({
      method: "PUT",
      url: "/api/burgers",
      data: burger
    })
    .done(function() {
      getBurgers();
    });
  }

  // This function constructs a todo-item row
  function createNewRow(burger) {
    var newInputRow = $("<li>");
    newInputRow.addClass("list-group-item burger-item");
    var newBurgerSpan = $("<span>");
    newBurgerSpan.text(burger.burger_name);
    newInputRow.append(newBurgerSpan);
    var newBurgerInput = $("<input>");
    newBurgerInput.attr("type", "text");
    newBurgerInput.addClass("edit");
    newBurgerInput.css("display", "none");
    newInputRow.append(newBurgerInput);
    var newDevouredBtn = $("<button>");
    newDevouredBtn.addClass("devoured btn btn-success");
    newDevouredBtn.text("Devour it!");
    newInputRow.append(" ");
    newInputRow.append(newDevouredBtn);
    newInputRow.data("burger", burger);
    return newInputRow;
  }

    function createNewDevoured(burger) {
    var newInputRow = $("<li>");
    newInputRow.addClass("list-group-item burger-item");
    var newBurgerSpan = $("<span>");
    newBurgerSpan.text(burger.burger_name);
    newInputRow.append(newBurgerSpan);
    var newBurgerInput = $("<input>");
    newBurgerInput.attr("type", "text");
    newBurgerInput.addClass("edit");
    newBurgerInput.css("display", "none");
    newInputRow.append(newBurgerInput);
    var newDevouredBtn = $("<button>");
    newDevouredBtn.addClass("devoured btn btn-warning");
    newDevouredBtn.text("undevour it!");
    newInputRow.append(" ");
    newInputRow.append(newDevouredBtn);
    newInputRow.data("burger", burger);
    return newInputRow;
  }

  // This function inserts a new todo into our database and then updates the view
  function insertBurger(event) {
    event.preventDefault();
    // if (!newItemInput.val().trim()) {   return; }
    var burger = {
      burger_name: newItemInput
        .val()
        .trim(),
      devoured: false
    };

    // Posting the new todo, calling getTodos when done
    $.post("/api/burgers", burger, function() {
      getBurgers();
    });
    newItemInput.val("");
  }

});
