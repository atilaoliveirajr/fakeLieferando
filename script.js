var tabBollean = false;

let menuItems = [{
        'productsName': 'Pizza Margherita [Ø 33cm]',
        'description': 'Choice of: with anchovies, with artichokes, with aubergine, with buffalo mozzarella, with capers and more.',
        'price': 7.40,
    },
    {
        'productsName': 'Pizza Salami [Ø 33cm]',
        'description': 'Choice of: with anchovies, with artichokes, with aubergine, with buffalo mozzarella and more.',
        'price': 8.90,
    },
    {
        'productsName': 'Tiramisu',
        'description': '',
        'price': 5.00,
    }
]


if (document.readyState == `loading`) {
    document.addEventListener(`DOMContentLoaded`, ready)
} else {
    ready()
}

/* This function will set a listener to all btns in the page */
function ready() {

    var preOrderBtn = document.getElementsByClassName('mealBorderExpander');
    for (let i = 0; i < preOrderBtn.length; i++) {
        let button = preOrderBtn[i]
        button.addEventListener(`click`, expandPreOderTab)
    }

    var removeCartItemButtons = document.getElementsByClassName('itemRemover');
    for (let i = 0; i < removeCartItemButtons.length; i++) {
        let button = removeCartItemButtons[i]
        button.addEventListener(`click`, removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName(`quantityController`);
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i];
        input.addEventListener(`change`, quantityChanged);
    }

    var productsNameInput = document.getElementsByClassName(`productsName`);
    for (let i = 0; i < productsNameInput.length; i++) {
        document.getElementsByClassName('productsName')[i].innerText = menuItems[i]['productsName'];
        document.getElementsByClassName('description')[i].innerText = menuItems[i]['description'];
        document.getElementsByClassName('price')[i].innerText = menuItems[i]['price'].toFixed(2).replace('.', ',') + ` €`;
    }

    var addToCartButtons = document.getElementsByClassName(`cartBtn`);
    for (let i = 0; i < addToCartButtons.length; i++) {
        let button = addToCartButtons[i]
        button.addEventListener(`click`, addToCartClicked)
    }

}

/* This function will update the total order price */
function updateTotalPrice() {
    var cartItemContainer = document.getElementsByClassName(`cartItems`)[0]
    var cartRows = cartItemContainer.getElementsByClassName(`itemRow`)
    var total = 0;

    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]

        var priceElement = cartRow.getElementsByClassName(`itemPrice`)[0]
        var price = parseFloat(priceElement.innerText.replace(`€`, ``).replace(',', '.'))

        total = total + price
    }

    total = (Math.round(total * 100) / 100).toFixed(2).replace('.', ',');
    totalComp = total.replace(',', '.');
    document.getElementsByClassName(`totalPrice`)[0].innerText = total + ` €`;

    if (totalComp > 0) {
        document.getElementsByClassName(`displayController`)[0].classList.add('displayNone')
    } else {
        document.getElementsByClassName(`displayController`)[0].classList.remove('displayNone')
    }

}

/* This function controlls the Display: none; property for the pre-order tab. */
function expandPreOderTab(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement;

    updateParcialPrice(shopItem);

    tabOnAndOff(shopItem);

}

/* This function controlls the Display: none; property for the pre-order tab. */
function tabOnAndOff(shopItem) {
    if (tabBollean == false) {

        function addTab() {
            shopItem.getElementsByClassName(`meal`)[0].classList.add('marginlessbottom');
            shopItem.getElementsByClassName(`meal`)[0].classList.add('borderlessbottom');

            shopItem.getElementsByClassName(`preOrderTabContainer`)[0].classList.remove('displayNone');

            tabBollean = true;
        }

        addTab()

    } else {

        function removeTab() {
            shopItem.getElementsByClassName(`meal`)[0].classList.remove('marginlessbottom');
            shopItem.getElementsByClassName(`meal`)[0].classList.remove('borderlessbottom');

            shopItem.getElementsByClassName(`preOrderTabContainer`)[0].classList.add('displayNone');

            tabBollean = false;
        }
        removeTab()
    }
}

/* This function will remove an item from the cart */
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove()

    updateTotalPrice()
}

/* This function will avoid a negative quantity */
function quantityChanged(event) {
    var input = event.target;
    var shoptItem = input.parentElement.parentElement.parentElement;

    if (isNaN(input.value) || input.value < 0) {
        input.value = 0
    }

    updateParcialPrice(shoptItem);
}

/* This function update the parcial price when quantity is changed */
function updateParcialPrice(shoptItem) {
    var priceElement = shoptItem.getElementsByClassName(`price`)[0];
    var price = parseFloat(priceElement.innerText.replace(`€`, ``).replace(',', '.'))
    var quantity = shoptItem.getElementsByClassName(`quantityController`)[0].value;
    var parcialPrice = (Math.round((price * quantity) * 100) / 100).toFixed(2).replace('.', ',');
    shoptItem.getElementsByClassName(`cartBtn`)[0].innerText = parcialPrice + ` €`;

}

/* This function will gather the data of an item before adding it to the cart */
function addToCartClicked(event) {
    var button = event.target;
    var shoptItem = button.parentElement.parentElement.parentElement;
    var title = shoptItem.getElementsByClassName(`productsName`)[0].innerText;
    var quantity = shoptItem.getElementsByClassName(`quantityController`)[0].value;

    var priceElement = shoptItem.getElementsByClassName(`price`)[0].innerText;
    var price = parseFloat(priceElement.replace(`€`, ``).replace(',', '.'))
    var parcialPrice = (Math.round((price * quantity) * 100) / 100).toFixed(2).replace('.', ',');

    addItemToCart(title, parcialPrice, quantity);
    updateTotalPrice();
}

/* This function will use the gathered data at addToCartClicked(event) to add the item to the cart */
function addItemToCart(title, parcialPrice, quantity) {
    var cartRow = document.createElement(`div`);
    cartRow.classList.add(`itemRow`);
    var cartItems = document.getElementsByClassName(`cartItems`)[0];

    var cartItemsNames = cartItems.getElementsByClassName(`itemDescription`);
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            alert(`This item is already added to the cart`);
            /* return */
        }
    }

    var cartRowContents = `
    <div class="itemDescription">
        ${title}
    </div>
    <div class="itemQuantity">
        ${quantity}
    </div>
    <div class="itemPrice">
        ${parcialPrice}
    </div>
    <div class="itemRemover">

    </div>`;

    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('itemRemover')[0].addEventListener('click', removeCartItem);

    /* cartRow.getElementsByClassName(`itemRemover`)[0].addEventListener(`click`, removeCartItem) */
}