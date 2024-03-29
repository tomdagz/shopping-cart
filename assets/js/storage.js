function StorageController(key) {
    this.key = key;

    this.addProduct = function(order_info) {
        if (this.supports_storage()) {
            let products = [];

            if (localStorage.getItem(this.key)) {
                products = JSON.parse(localStorage.getItem(this.key));
            }

            products = products.filter((product) => {
                return !(product.id === order_info.id && product.size === order_info.size && product.color === order_info.color)
            })

            products.push(order_info)
            localStorage.setItem(this.key, JSON.stringify(products));

            return true;
        }
        return false;
    }

    this.getProducts = function() {
        if (localStorage.getItem(this.key)) {
            return JSON.parse(localStorage.getItem(this.key));
        }
        return null;
    }

    this.supports_storage = function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch(e) {
            return false;
        }
    }

    this.resetStorage = function() {
        localStorage.removeItem(this.key);
    }

}