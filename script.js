const menu = [
  {id:"pink-glitter",name:"Pink Glitter Sea Salt",category:"soft",price:16,accent:"pink",desc:"Belgian milk chocolate, Maldon sea salt, edible pink glitter, pure creamery butter."},
  {id:"love-oreo",name:"Love Oreo",category:"soft",price:16,accent:"oreo",desc:"Belgian white & dark chocolate, Oreo crumbs, Oreo biscuits, pure creamery butter."},
  {id:"matcha-cream",name:"Matcha Cream",category:"soft",price:17,accent:"matcha",desc:"Belgian white chocolate, macadamia nuts, matcha powder, cream cheese."},
  {id:"golden-caramel",name:"Golden Caramel",category:"soft",price:16,accent:"gold",desc:"Belgian caramel chocolate chips, caramel filling, edible gold dust and gold flake."},
  {id:"royal-whitey",name:"Royal Whitey",category:"soft",price:16,accent:"white",desc:"Pure creamery butter, Belgian white chocolate, icing sugar and edible white glitter."},
  {id:"love-bueno",name:"Love Bueno",category:"soft",price:17,accent:"gold",desc:"Belgian milk & white chocolate, Kinder Bueno chocolate and sauce."},
  {id:"red-velvet",name:"Red Velvet",category:"soft",price:16,accent:"red",desc:"Belgian white chocolate, cocoa powder, almond nibs and red velvet paste."},
  {id:"chewy-choc",name:"Chewy Chocolate Chips",category:"mini",price:7,accent:"pink",desc:"Mixed premium chocolate chips, Maldon sea salt and pure creamery butter."},
  {id:"hard-choc",name:"Chocolate Chips 100g",category:"hard",price:19,accent:"gold",desc:"Bite-size cookies with semi-sweet & bittersweet chocolate chips, butter and cinnamon."},
  {id:"biscoff-latte",name:"Biscoff Latte",category:"coffee",price:16,accent:"coffee",desc:"Bittersweet latte with Biscoff caramelised cookie bits."},
  {id:"nutella-latte",name:"Nutella Latte",category:"coffee",price:16,accent:"coffee",desc:"Creamy espresso blended with Nutella and topped with whipped cream."},
  {id:"americano",name:"Americano",category:"coffee",price:9,accent:"coffee",desc:"Black coffee. Simple, bold, classic."},
  {id:"latte",name:"Latte",category:"coffee",price:10,accent:"coffee",desc:"Espresso with steamed milk."},
  {id:"cappuccino",name:"Cappuccino",category:"coffee",price:10,accent:"coffee",desc:"Foamy espresso-based coffee."},
  {id:"mocha",name:"Mocha",category:"coffee",price:11,accent:"coffee",desc:"Chocolate-forward espresso drink."}
];

const grid = document.getElementById("menuGrid");
const filters = document.querySelectorAll(".filter");
const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const startShopping = document.getElementById("startShopping");
const whatsappCheckout = document.getElementById("whatsappCheckout");
const WHATSAPP = "60129369087";

let activeFilter = "soft";
let cart = JSON.parse(localStorage.getItem("ainul-cart") || "{}");

function money(value){ return `RM ${value.toFixed(2).replace(".00","")}`; }

function renderMenu(){
  const items = menu.filter(x => x.category === activeFilter);
  grid.innerHTML = items.map(item => `
    <article class="menu-card" data-accent="${item.accent}">
      <div class="product-orb"><div class="product-cookie"></div></div>
      <div class="menu-meta"><div>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
      </div></div>
      <div class="price-row">
        <strong>${money(item.price)}${item.category === "coffee" ? " +" : ""}</strong>
        <button class="add-btn" data-add="${item.id}" aria-label="Add ${item.name} to bag">+</button>
      </div>
    </article>`).join("");

  document.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => addItem(btn.dataset.add));
  });
}

filters.forEach(btn => btn.addEventListener("click", () => {
  filters.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  renderMenu();
}));

function addItem(id){
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  openDrawer();
}

function changeQty(id, delta){
  cart[id] = (cart[id] || 0) + delta;
  if(cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function saveCart(){ localStorage.setItem("ainul-cart", JSON.stringify(cart)); }

function cartEntries(){
  return Object.entries(cart).map(([id,qty]) => ({item:menu.find(x=>x.id===id),qty})).filter(x=>x.item);
}

function renderCart(){
  const entries = cartEntries();
  const count = entries.reduce((sum,x)=>sum+x.qty,0);
  const total = entries.reduce((sum,x)=>sum+x.item.price*x.qty,0);
  cartCount.textContent = count;
  cartTotal.textContent = money(total);
  cartEmpty.style.display = entries.length ? "none" : "grid";
  cartItems.style.display = entries.length ? "block" : "none";
  whatsappCheckout.disabled = !entries.length;
  whatsappCheckout.style.opacity = entries.length ? "1" : ".45";
  cartItems.innerHTML = entries.map(({item,qty}) => `
    <div class="cart-row">
      <div><h4>${item.name}</h4><small>${money(item.price)} each</small></div>
      <div class="qty">
        <button data-minus="${item.id}" aria-label="Decrease ${item.name}">−</button>
        <strong>${qty}</strong>
        <button data-plus="${item.id}" aria-label="Increase ${item.name}">+</button>
      </div>
    </div>`).join("");
  document.querySelectorAll("[data-minus]").forEach(b=>b.onclick=()=>changeQty(b.dataset.minus,-1));
  document.querySelectorAll("[data-plus]").forEach(b=>b.onclick=()=>changeQty(b.dataset.plus,1));
}

function openDrawer(){
  drawerBackdrop.hidden = false;
  requestAnimationFrame(()=>cartDrawer.classList.add("open"));
  cartDrawer.setAttribute("aria-hidden","false");
  document.body.classList.add("cart-open");
}
function shutDrawer(){
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden","true");
  document.body.classList.remove("cart-open");
  setTimeout(()=>drawerBackdrop.hidden=true,300);
}
cartButton.onclick=openDrawer;
closeCart.onclick=shutDrawer;
drawerBackdrop.onclick=shutDrawer;
startShopping.onclick=()=>{shutDrawer();document.getElementById("menu").scrollIntoView({behavior:"smooth"});};

whatsappCheckout.onclick=()=>{
  const entries=cartEntries();
  if(!entries.length) return;
  const total=entries.reduce((sum,x)=>sum+x.item.price*x.qty,0);
  const lines=entries.map(x=>`• ${x.qty}× ${x.item.name} — ${money(x.item.price*x.qty)}`);
  const message=[
    "Hi Ainul Cookies! 🍪 I’d like to order:",
    "",
    ...lines,
    "",
    `Estimated total: ${money(total)}`,
    "",
    "Please confirm availability and payment details. Thank you!"
  ].join("\n");
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,"_blank","noopener");
};

document.addEventListener("keydown",e=>{if(e.key==="Escape")shutDrawer()});
renderMenu();
renderCart();
