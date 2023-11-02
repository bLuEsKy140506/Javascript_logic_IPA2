import "./styles.css";

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  This Individual project is purely Javascript logic.
  <br>
  <br>
  <b>👇 Just open the console and drag up to expand the view.
  </b>
</div>
`;

/*
Task Description
    You are working as a freelance web developer, and your client wants you to develop functionalities
    for an online clothing store. Another web developer in your team
    will design the website, so you don’t need to do the HTML/CSS part. Your main
    focus is the website functionality

Development Goals
    Your ultimate goal for this project is to create the functionality of a clothing store’s
    e commerce website. Its users should be able to perform the following actions:
    > Create, remove, and add shop clients.
    > Create, remove, and add clothing items and their descriptions.
    > Change the availability of a certain item: in stock / out of stock.
    > Purchase clothing items ordered by clients.
    > Deduct clothing item quantity from what’s in stock.
*/

/*
ACTION PLAN:

1.Create an object that will hold the shop information, users, and items:
  A. Shop information should include the shop name, address, and its unique code.
*/

let isLoggedIn = false,
  userID,
  confirmed = false;

const onlineStore = {
  shopName: "Zara",
  address: "Manhattan Avenue, New York",
  uniqueCode: "NY656",
  // B. User information should include the user’s first name, surname, age, and birthday.
  userInfo: [
    {
      firstName: "admin",
      surName: "touring",
      username: "admin",
      password: "imstilllearning",
    },
    {
      firstName: "Angelina",
      surName: "Jolie",
      age: 47,
      birthday: "4/06/1975",
      username: "angelina",
      password: "password123",
      cart: [],
      confirmOrders: [],
    },
  ],
  // C.Clothing items should include the item name, category, price, and stock status.
  clothingItem: [
    {
      itemName: "Blue jeans",
      category: "Trousers",
      price: 50,
      status: "in stock",
      count: 6, // Additional property for testing
      //count: 5,
    },
    {
      itemName: "TopGun: Maverick",
      category: "Jacket",
      price: 150,
      status: "out of stock",
      count: 0,
    },
    {
      itemName: "Kungfu Panda shirt",
      category: "T-shirt",
      price: 75,
      status: "in stock",
      count: 10,
    },
  ],
  /*2. Develop the following functions:
  
  > Add users.
      Hint: Use an array method that can push items to the array. To find this
      method, you can rewatch the How to Manipulate Strings and Arrays
      Using Methods lesson or look through the lesson summary
*/
  addUser: function (userObj, userID) {
    if (userID === 0) {
      this.userInfo.push(userObj);
      userObj["cart"] = []; //system will create every new user an array for cart
      userObj["confirmOrders"] = []; //an array for confirmed items
    } else {
      return console.log(`restricted function`);
    }
  },
  /*
  > Add items and item stocks.
      Hint: Find the item that needs to be restocked. Depending on the argu
      ment passed, the system should add the necessary stocks to this item.
      To develop this, use conditional statements and array methods.
  */
  finditems_addItem: function (userID) {
    if (userID === 0) {
      this.clothingItem.forEach((item) => {
        if (item.status === "out of stock") {
          item.count = 5; //for testing
          item.status = "in stock";
        }
      });
    }
  },
};
// -------------------------------------- TEST SIMULATION FOR ADMIN -----------------------------------
// Testing for addUser
userID = 0;
onlineStore.addUser(
  {
    firstName: "Earl Lauriece",
    surName: "Butlay",
    age: 34,
    birthday: "7/26/1988",
    username: "earllauriece",
    password: "password123",
  },
  userID
);
//console.log(onlineStore.userInfo);

// Testing for Add items and item stocks
onlineStore.finditems_addItem(userID);
// console.log(onlineStore.clothingItem);

//-------------------------------------- FUNCTION SECTION -----------------------------------
// copied out from the lecture
const loginUser = function (username, password) {
  onlineStore.userInfo.forEach((element, index) => {
    if (element.username === username && element.password === password) {
      isLoggedIn = true;
      userID = index;

      console.log("Hi " + element.firstName + " " + element.surName);
    }
  });

  if (!isLoggedIn) {
    userID = null;
    console.log("Invalid Credentials");
  }
  confirmed = false;
};

// Add to cart function
const addToCart = function (itemObj, userID, quantity) {
  if (itemObj.count < quantity) {
    return console.log(`---\nInsufficient stock for this item\n----`); //make sure that there are enough supplies
  }
  // if enough supplies then push to cart
  if (loginUser) {
    onlineStore.userInfo[userID].cart.push({
      itemName: itemObj.itemName,
      price: itemObj.price,
      quantity: quantity,
      totalPrice: itemObj.price * quantity,
    });
  }
};

// checkout function
const confirmedPurchase = function (confirm, itemArr) {
  let separator = []; //separator of every batch/group of confirmed orders
  if (confirm) {
    //compared each item in the cart into the clothing item database
    itemArr.forEach((eachConfirmed) => {
      console.log(`🧑‍💻Processing...to buy...${eachConfirmed.itemName}`);
      onlineStore.clothingItem.forEach((eachStock) => {
        if (eachStock.itemName === eachConfirmed.itemName) {
          //if matched is found then
          if (eachStock.count >= eachConfirmed.quantity) {
            //double check if there are enough supplies
            //because other clients might confirmed and ordered the items first
            //then push to confirm order
            separator.push(eachConfirmed);
            //if the condition is satisfied then deduct the number of items ordered to the stock counts
            eachStock.count = eachStock.count - eachConfirmed.quantity;
            //after the stock reach to 0 then update the status
            eachStock.count === 0
              ? (eachStock.status = "out of stock")
              : (eachStock.status = "in stock");
            //update the cart array - delete the item(s) that  been confirmed
            onlineStore.userInfo[userID].cart.forEach((element, index) => {
              if (element.itemName === eachConfirmed.itemName) {
                onlineStore.userInfo[userID].cart.splice(index, 1);
              }
            });
          } else {
            //else print this message to the user
            return eachStock.count === 0
              ? console.log(`☹️Out of stock`)
              : console.log(
                  `☹️Sorry....unsuccessful\nCurrent number of orders[${eachConfirmed.quantity}]\nexceeded number of available stock[${eachStock.count}]`
                );
          }

          console.log(`....success👏`); //if we escape the else then print final message
        }
      });
    });
    onlineStore.userInfo[userID].confirmOrders.push(separator); //push the a batch of confirmed orders
  }
  displaySummary1D(separator); //display the one batch confirmed order
};

//display reciept function
const displaySummary1D = function (itemObj) {
  console.log(`Summarized as follows:`);
  console.log(`--------------------------------`);

  let totalAll = 0, //total price of all the items
    countAll = 0; //quantity of each items
  itemObj.forEach((each) => {
    totalAll += each.totalPrice;
    countAll += each.quantity;
    console.log(
      `${each.quantity} items of ${each.itemName} -- ${each.price.toFixed(
        2
      )} --> ${each.totalPrice.toFixed(2)}`
    );
  });
  console.log(`--------------------------------`);
  console.log(`${countAll} total items amounting to ${totalAll.toFixed(2)}`);
  console.log(`--------------------------------`);
};

//2D or Layer of arrays
const displaySummary2D = function (itemObjArr) {
  console.log(
    `\n========This is your overall summary of all the orders==========`
  );
  itemObjArr.forEach((eachgroup, index) => {
    console.log(`\nBATCH ${index + 1} of confirmed orders:`);
    displaySummary1D(eachgroup);
  });
};
//-------------------------------------------TEST SIMULATION -----------------------------------------------------------------------------------------------------
/*user1 -> add 3 items to the cart but not confirm yet
  user2 -> adds 2 item to the cart similar of the 
          itemName and quantity ordered by the user1
  user2 -> confirmed the itemS
  user1 -> then confirmed the item on his cart 
          particularly including the items 
          similar confirmed by user2
  user1 -> should recieve a message that the 
           items is no longer available 

  NOTE: this scenario is not required on PA, but 
  this will covered/test the minimum requirements 
  of the project assignment*/

loginUser("earllauriece", "password123");

let selected_singleItem, counts_item; // just a sample

selected_singleItem = 2; // ORDER 1
counts_item = 3;
addToCart(onlineStore.clothingItem[selected_singleItem], userID, counts_item);

selected_singleItem = 1; // this will be dynamically changed in the UI (DOM)
counts_item = 2; // ORDER 2
addToCart(onlineStore.clothingItem[selected_singleItem], userID, counts_item);

selected_singleItem = 0;
counts_item = 2; // ORDER 3
addToCart(onlineStore.clothingItem[selected_singleItem], userID, counts_item);

displaySummary1D(onlineStore.userInfo[userID].cart);
console.log(`Confirmed item(s)?\n`); //NO CONFIRMATION COMMITTED

loginUser("angelina", "password123");

selected_singleItem = 0; // this will be dynamically changed in the UI (DOM)
counts_item = 5; //ORDER 1
addToCart(onlineStore.clothingItem[selected_singleItem], userID, counts_item);

selected_singleItem = 2;
counts_item = 7; //ORDER 2
addToCart(onlineStore.clothingItem[selected_singleItem], userID, counts_item);

console.log(`Confirmed item(s)?\n`);
confirmed = true; // this will be dynamically changed in the UI (DOM)

confirmedPurchase(confirmed, [
  onlineStore.userInfo[userID].cart[0],
  onlineStore.userInfo[userID].cart[1], //I just manually input objects here to demontrate,
]); //inputting only the selected entries of the array

selected_singleItem = 0; // this will be dynamically changed in the UI (DOM)
counts_item = 1; //ORDER 3
addToCart(onlineStore.clothingItem[selected_singleItem], userID, counts_item);

selected_singleItem = 2;
counts_item = 1; //ORDER 4
addToCart(onlineStore.clothingItem[selected_singleItem], userID, counts_item);

selected_singleItem = 1;
counts_item = 2; //ORDER 5
addToCart(onlineStore.clothingItem[selected_singleItem], userID, counts_item);

console.log(`Confirmed item(s)?\n`);
confirmed = true; // this will be dynamically changed in the UI (DOM)

confirmedPurchase(confirmed, [
  onlineStore.userInfo[userID].cart[0], //only two items confirmed in the cart
  onlineStore.userInfo[userID].cart[1], //I just manually input objects here to demontrate,
]); //inputting only the selected entries of the array

displaySummary2D(onlineStore.userInfo[userID].confirmOrders);

loginUser("earllauriece", "password123");
displaySummary1D(onlineStore.userInfo[userID].cart);
console.log(`Confirmed item(s)?`);
confirmed = true;
confirmedPurchase(confirmed, [...onlineStore.userInfo[userID].cart]); //BUG? no blue jeans included in processing?

displaySummary2D(onlineStore.userInfo[userID].confirmOrders);

/* EXPECTED OUTPUT: > blues jean count should be 0 and out of stock (6 - 5 - 1 = 0)
                    > topgun: maverick count should be 3 and in stock (0 + 5 - 2 = 3)                   
                    > Kung fu panda count should be 2 and in stock (10 - 7 - 1 = 2)
                    > cart of Earl Lauriece Butlay should contain 2 items since 1 item failed(because it out stock)
                    and 1 item(because it exceed the stock available)
                    > cart of Angelina should contain 1 item (4 out 5 item checkout)
                    > confirmedOrder of Earl Lauriece Butlay should have 1 confirmed order: 2 item of maverick
                    > confirmedOrder of Angelina should have 2 batches of orders: both successful
                  
*/

// console.log(onlineStore.clothingItem);
// console.log(onlineStore.userInfo[userID].cart);
// console.log(onlineStore.userInfo[userID].confirmOrders);
// loginUser("angelina", "password123");
// console.log(onlineStore.userInfo[userID].cart);

