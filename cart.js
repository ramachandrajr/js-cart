
/**
 * Creates a cart
 */
const Cart = function(cartObj) {
	if (cartObj) {
		this.items    = cartObj.items;
		this.total    = cartObj.total;
		this.quantity = cartObj.quantity;		
	} else {
		this.items    = [];
		this.total    =
		this.quantity = 0;
	}
};

/**
 * This function finds any item in this.items by id.
 * @params {String} id - The id of data to find.
 * returns {String|Boolean} Returns index as a string / false incase it is not found.
 */
Cart.prototype.findItemIndex = function(id) {
	// If there is no such item as before.
	if (this.items.length>0) {
		for (var i = 0; i < this.items.length; i++) {
			if (this.items[i].id.toString() === id.toString()) {				
				return i.toString();
			}
		}
		return false;
	}
};

/**
 * This function adds an item to the this.items array.
 * @params {String} id - Id of the item to add.
 * @params {String}	name - Name of the item to add.
 * @params {String} quantity - Quantity of the item to add.
 * @params {String} price - Price of the item to add.
 * @params {Function} cb - Callback to be executed.
 * returns {object|null} Returns this.items array / null incase of an error.
 */
Cart.prototype.addItem = function(id, name, quantity, price, cb) {
	try {
		quantity = Number.parseInt(quantity, 10);
		price = Number.parseInt(price, 10);
		// If it is a duplicate.
		let indx = this.findItemIndex(id);
		console.log(indx);
		if (indx) {
			this.items[Number.parseInt(indx, 10)].quantity += quantity;		
		} else {
			// Not a dupe.
			let shallowItem = {};
			shallowItem.id = id;
			shallowItem.name = name;
			shallowItem.quantity = quantity;
			shallowItem.price = price;
			this.items.push(shallowItem);
		}
		this.quantity += quantity;
		this.total += (quantity*price);
		if (cb) cb(this);
		return this.items;
	} catch (e) {
		console.error("Error Adding Item: " + err);
		return null;		
	}
};


/**
 * This function removes an item from this.items array.
 * @params {String} id - Id of the item to remove.
 * @params {Function} cb - Call back to be executed.
 * returns {Boolean|null} Returns true incase removal successsful / returns null in case of error.
 */
Cart.prototype.removeItem = function(id, cb) {
	try {
		let indx = this.findItemIndex(id);
		if (indx) {
			// Not converting to number till now to avoid falsity incase 0 is the 'indx' value.
			indx = Number.parseInt(indx, 10);
			this.quantity -= this.items[indx].quantity;
			this.total -= this.items[indx].quantity*this.items[indx].price; 
			this.items.splice(indx);
			if (cb) cb(this);
			return true;			
		}
		else throw new Error("Item not found!");
	} catch (err) {
		console.error("Error Removing Item: " + err);
		return null;
	}
}

/**
 * Posts the cart data to given page.
 * @params {String} url - URL to post cart data to.
 * returns {Promise} Returns a promise to deal with.
 */
Cart.prototype.postCart = function(url) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();

		xhr.onload = function() {
			resolve(this);
		};
		xhr.onerror = function(err) {
			reject("Error posting cart: " + err);
		};

		xhr.open("POST", url);
		xhr.send();
	});	
};

/**
 * Show Cart.
 */
Cart.prototype.getCart = function() {
	return {
		items: this.items,
		total: this.total,
		quantity: this.quantity
	};
};


/* Name space creator. */
const $cart = function(cartObj) {
	if (cartObj) return new Cart(cartObj);
	return new Cart();
};