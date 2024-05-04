const apiUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';
const productGrid = document.querySelector('.product-grid');

//category select 
// Get all list items
const options = document.querySelectorAll('.option');

// Add event listener to each list item
options.forEach((option) => {
    option.addEventListener('click', (event) => {
        // Remove the 'selected' class from all list items
        options.forEach((opt) => opt.classList.remove('selected'));

        // Add the 'selected' class to the clicked list item
        option.classList.add('selected');
        const category = option.getAttribute('data-category');
        fetchdata(category)
    });
});

function fetchdata(category) {
    try{
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const categories = data.categories;
            renderProducts(category, categories);
        })}
    catch{
        error => console.error('Error fetching data:', error)};
}

//initial fetch
try{
fetch(apiUrl)
.then(response => response.json())
.then(data => {
    const categories = data.categories;
    renderProducts('Men', categories);
})}
catch{
    console.error('Error fetching data:', error)};


function renderProducts(category, categories) {
    productGrid.innerHTML = '';
    const categoryProducts = categories.find(cat => cat.category_name === category).category_products;

    categoryProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const image = document.createElement('img');
        try{
        image.src = product.image;
        }
        catch{
            console.error("error");
        }
        image.onerror = function() {
            const imgNotAvailable = document.createElement('div');
            imgNotAvailable.className = 'img_not_available';
            const p = document.createElement('p');
            p.textContent = 'Image not available';
            imgNotAvailable.appendChild(p);
            productCard.appendChild(imgNotAvailable);
        };
        productCard.appendChild(image);

        const bad = document.createElement('p');
        bad.className='badge'
        if (product.badge_text) {
            bad.textContent = product.badge_text;
            productCard.appendChild(bad)
        }

        const tv = document.createElement('div');
        tv.className = 'title_vendor'
        productCard.appendChild(tv);

        const title = document.createElement('h2');
        title.className = 'title';
        if (product.title.length > 10){
            var t=product.title.substring(0,10) + "..";
            title.textContent = t
            tv.appendChild(title);
        }
        else{
        title.textContent = product.title;
        tv.appendChild(title);
        }
        
        const dott = document.createElement('p');
        dott.innerHTML="&bull;";
        tv.appendChild(dott)
    

        const vendor = document.createElement('p');
        vendor.textContent = `${product.vendor}`;
        tv.appendChild(vendor);

        const pd = document.createElement('div');
        pd.className = 'price_discount'
        productCard.appendChild(pd);

        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = `Rs ${product.price}.00`;
        pd.appendChild(price);

        const compareAtPrice = document.createElement('strike');
        compareAtPrice.className = 'compare-at-price';
        if (product.compare_at_price) {
            compareAtPrice.textContent = `${product.compare_at_price}.00`;
            pd.appendChild(compareAtPrice);

            const discount = document.createElement('p');
            discount.className = 'discount';
            discount.textContent = `${calculateDiscount(product.price, product.compare_at_price)}% Off`;
            pd.appendChild(discount);
        }

        const btn = document.createElement('button');
        btn.className = 'add-to-cart';
        btn.textContent = 'Add to Cart';
        productCard.appendChild(btn);

        productGrid.appendChild(productCard);
    });
}

function calculateDiscount(price, compareAtPrice) {
    const discount = (compareAtPrice - price) / compareAtPrice * 100;
    return Math.round(discount);
}