const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});
//cart

const buttonCart = document.querySelector('.button-cart');
//const buttonClose = document.querySelector('.modal-close');
const modalCart = document.querySelector('#modal-cart');
//const modalCartDiv = document.querySelector('.modal');
const cardTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');
const cardTotalCount = document.querySelector('.cart-count');

const getGoods = async function () {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Ошибка вышла' + result.status
	}
	return await result.json()
};

const card = {
	cardGoods: [
		{
			id: "099",
			name: "Часы Dior",
			price: 999,
			count: 2,
		},
		{
			id: "090",
			name: "Кеды Вдики",
			price: 9,
			count: 3,
		},
	],
	
	renderCard() {
		cardTableGoods.textContent = '';
		this.cardGoods.forEach(({ id, name, price, count }) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;
			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete">x</button></td>
			`;
			cardTableGoods.append(trGood)
		})
		const totalPrice = this.cardGoods.reduce((sum, item) => {
			return sum + (item.price * item.count)
		}, 0)
		cardTableTotal.textContent = totalPrice + '$'
		card.totalCountButton()
		},
	deleteGood(id) {
		this.cardGoods = this.cardGoods.filter(item => id !== item.id);
		this.renderCard();
	},
	totalCountButton(){
		const totalCounts = this.cardGoods.reduce((sumcount, item) => {
			return sumcount + item.count
			}, 0)
		if (totalCounts<=0){
			cardTotalCount.textContent = ''
		}
		else{
			cardTotalCount.textContent = totalCounts}
	},	
	minusGood(id) {
		for (const item of this.cardGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id)
				} else {
					item.count--;
				}
				break;
			}
			}
			this.renderCard();
	},
	plusGood(id) {
		for (const item of this.cardGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
			}
		this.renderCard();
	},
	addCardGoods(id) {
		const goodItem = this.cardGoods.find(item => item.id === id)
		if (goodItem) {
			this.plusGood(id)
			this.totalCountButton()
		}
		else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({ id, name, price }) => {
					this.cardGoods.push({
						id,
						name,
						price,
						count: 1,
					})
					this.totalCountButton()
				})
			}

	},
	clearCard(){
		this.cardGoods = [];
		this.renderCard();
	},
};

card.totalCountButton()
document.body.addEventListener('click', event => {
	const addToCard = event.target.closest('.add-to-cart');
	if (addToCard){
		card.addCardGoods(addToCard.dataset.id)
	}
})

cardTableGoods.addEventListener('click', event => {
 	const target = event.target;
	  	if (target.tagName === "BUTTON") {
			  const id = target.closest('.cart-item').dataset.id
		if (target.classList.contains('cart-btn-delete')) {
			card.deleteGood(id);		
		};
 		if (target.classList.contains('cart-btn-plus')) {
 			card.plusGood(id);
 		}
		if (target.classList.contains('cart-btn-minus')) {
			card.minusGood(id);
 		}
 	}
 });

const openModal = () => {
	card.renderCard();
	modalCart.classList.add('show');

};
const closeModal = () => {
	modalCart.classList.remove('show')
};
modalCart.addEventListener('click', function (event) {
	const target = event.target;
	if (target.classList.contains('overlay') || target.classList.contains('modal-close')) {
		closeModal();
	}

})
// modalCart.addEventListener('click', e => {
// 	let target = e.target;
// 	let its_menu = target == modalCartDiv || modalCartDiv.contains(target);
// 	let menu_is_active = modalCart.classList.contains('show');
// 	let clkOnMenu = target == modalCartDiv;
// 	if (!its_menu && !clkOnMenu && menu_is_active) {
// 		modalCart.classList.remove('show')
// 	}
//   })
buttonCart.addEventListener('click', openModal);
//scroll smooth
//(function name(params) { другой вариант скрола был применен
{
	const scrollLinks = document.querySelectorAll('a.scroll-link');
	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', event => {
			event.preventDefault()
			const id = scrollLink.getAttribute('href')
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})
		})
	}

}

// 	for (let i = 0; i < scrollLink.length; i++) {
// 		scrollLink[i].addEventListener('click', function (event) {
// 			event.preventDefault()
// 			const id = scrollLink[i].getAttribute('href')
// 			document.querySelector(id).scrollIntoView({
// 				behavior: 'smooth',
// 				block: 'start'
// 			})
// 		})
// 	}
// })()

//button filter
document.body.addEventListener('click', event => {
	const addToCard = event.target.closest('.filter1');
	if (addToCard){
		filterCards('category', 'Accessories')
	}
})


document.body.addEventListener('click', event => {
	const addToCard = event.target.closest('.filter2');
	if (addToCard){
		filterCards('category', 'Clothing')
	}
})

//goods

const more = document.querySelector('.more')
const navigationLink = document.querySelectorAll('.navigation-link')
const longGoodsList = document.querySelector('.long-goods-list')
const clearCardButton = document.querySelector('.modal-clear')

clearCardButton.addEventListener('click', () =>{
	card.clearCard();
}
  )
// fetch('db/db.json') - аналог записи выше
// 		.then(function (response) {
// 			return response.json()
// 		}).then(function (data) {
// 			console.log(data)
// 		})

const createCard = function ({ label, name, img, description, id, price }) {
	const card = document.createElement('div')
	card.className = 'col-lg-3 col-sm-6'
	card.innerHTML = `
	<div class="goods-card">
	${label ?
			`<span class="label">${label}</span>` :
			''}
		<img src="db/${img}" alt="${name}" class="goods-image">
		<h3 class="goods-title">${name} Hoodie</h3>
		<p class="goods-description">${description}</p>
		<button class="button goods-card-btn add-to-cart" data-id="${id}">
			<span class="button-price">$${price}</span>
		</button>
	</div>`

	return card
}

const renderCards = function (data) {
	longGoodsList.textContent = ''
	const cards = data.map(createCard)
	longGoodsList.append(...cards)

	document.body.classList.add('show-goods')
}


	more.addEventListener('click', event => {
		event.preventDefault();
		getGoods().then(renderCards);

    const blockID = more.getAttribute('href')
    
    document.querySelector(blockID).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })

// more.addEventListener('click', event => {
// 	event.preventDefault();
// 	getGoods().then(renderCards);
// 	const scrollLinks = document.querySelectorAll('div.long-goods');
// 	for (const scrollLink of scrollLinks) {
// 		scrollLink.addEventListener('click', event => {
// 			const id = scrollLink.getAttribute('href')
// 			document.querySelector(id).scrollIntoView({
// 				behavior: 'smooth',
// 				block: 'start'
// 			})
// 		})
// 	}
// }
// )

const filterCards = function (field, value) {
	getGoods().then(data => data.filter(good => good[field] === value)).then(renderCards)
}
navigationLink.forEach(function (link) {
	link.addEventListener('click', event => {
		event.preventDefault()
		const field = link.dataset.field
		const value = link.textContent
		filterCards(field, value)
		if (value === 'All') {
			getGoods().then(renderCards);
		}
	})
})
///4 day
const modalForm = document.querySelector('.modal-form')

const postData = dataUser => fetch('server.php', {
	method: 'POST',
	body: dataUser,
})

modalForm.addEventListener('submit', event =>{
	event.preventDefault()
	console.log(modalForm)
	const formData = new FormData(modalForm)
	formData.append('card', JSON.stringify(card.cardGoods))
	postData(formData)
	.then(response => {
		if(!response.ok){
			throw new Error(response.status)
		}
		alert('Ваш заказ успешно отправлен, с вами свяжутся')
		console.log(response.statusText)
		})
	.catch(err => {
		alert('К сожалению произошла ошибка')
		console.log(err)
	})
	.finally(()=>{
		closeModal();
		modalForm.reset();
		card.cardGoods.length = 0;
	});
})