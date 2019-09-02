
const  cartBtn = document.querySelector(".cart-btn");
const  closeCartBtn = document.querySelector(".close-cart");
const  clearCartBtn = document.querySelector(".clear-cart");
const  cartDom = document.querySelector(".cart");
const  cartOverlay = document.querySelector(".cart-overlay");
const  cartItems = document.querySelector(".cart-items");
const  cartTotal = document.querySelector(".cart-total");
const  cartContent = document.querySelector(".cart-content");
const  productDom = document.querySelector(".products-center");
//const  btns = document.querySelectorAll(".bag-btn");
//console.log(btns);

//cart
let cart = [];

//buttons

let buttonDom = [];

//products
class Products {
      async  getProducts(){
          try {
            let result = await fetch('products.json');
            let data =  await result.json();
            let products = data.items;
            products = products.map(item => {
                const { title,price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;

                return {title,price,id,image};
            })
            return products;
          } catch (error) {
              console.log(error);
          }
          
        }

}

//display products 
class UI {

    displayProducts(products) {
         //   console.log(products);
        let result = "";
        products.forEach(product => {
                result += `<article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="" class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to bag
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>${product.price}</h4>
            </article>`
        });

        productDom.innerHTML = result;
        }

        getBagButtons(){
            const buttons = [...document.querySelectorAll(".bag-btn")];
            
            buttonDom = buttons;
          // console.log(buttons);
           buttons.forEach(button =>{
          
            let id = button.dataset.id; 
            let inCart = cart.find((item) =>{item.id === id});
           // console.log(inCart);
            if(inCart){
                button.innerHTML = "In cart";
                button.disabled = true;
                

            } else {
              //  console.log('in');
                button.addEventListener('click',(event) => {
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;
                    //get product from products
                    let cartItem = {...Storage.getProduct(id), amount:1};
                   // console.log(cartItem);
                    // add product to the cart
                    cart = [...cart, cartItem];
                    console.log(cart);
                    //save cart in local storage
                    Storage.saveCart(cart);
                    //set cart values

                    this.setCartValue(cart);
                    //show the cart
                    this.showCart();

                    //increse/decrese amount
                    this.setQuantity(cartItem,id);
                })
            }
        })
        } 
    setCartValue(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item =>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });

        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;


    }  
    
    showCart(){
        let result = "";
        cart.forEach((item)=>{
          //  console.log(item);
            result+=`<div class="cart-item">
            <img src=${item.image} alt="product">
            <div>    
                <h4>${item.title}</h4>
                <h5>${item.price}</h5>
                <span class="remove-item">remove</span>
                </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down"></i>
            </div>       
        </div>`

        });
        cartContent.innerHTML = result;
    }

    setQuantity(item,id){
       // console.log(item);
        let upper = [...document.querySelectorAll('.fa-chevron-up')];
        
        upper.forEach((it)=>{
            console.log(it);
            let product = ''//it.find((item) =>{item.id === id});
            console.log(product);

        if(product){
                console.log(product);
        
            }});
        console.log(upper);

    }
}

//local storage
class Storage {

    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id){
        let products  = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }

    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart));
    }

}


document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    let toggleCart = false;

    cartBtn.addEventListener('click',(event)=>{
        cartOverlay.style.visibility = "visible";
        
    });  
    closeCartBtn.addEventListener('click',()=>{
        cartOverlay.style.visibility = 'hidden' ;

    });

    clearCartBtn.addEventListener('click',()=>{
        cart = [];
        ui.showCart();

    });


    //get products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=>{ui.getBagButtons()}).then(ui.showCart());

    
});


