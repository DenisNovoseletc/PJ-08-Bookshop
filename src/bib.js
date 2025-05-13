let startIndex = 0; // Начальный индекс для пагинации
const maxResults = 6; // Максимальное количество результатов для отображения
let currentSubject = 'Architecture'; // Изначальная категория для загрузки книг
let cartCount = 0; // Переменная для отслеживания количества книг в корзине
// Функция для поиска книг по заданной категории
async function searchBooks(subject) {
      // Валидация входных данных
      if (!subject || typeof subject !== 'string' || subject.trim() === '') {
        console.error('Invalid subject. Please provide a non-empty string.'); // Логируем ошибку
        return []; // Возвращаем пустой массив в случае некорректного значения
    }
    console.log(`Fetching books for subject: ${subject}, startIndex: ${startIndex}`); // Логируем параметры запроса
    const apiKey = 'AIzaSyB0rj0m7l_9pXo6OrEMwBgs138rQHpNVto'; 
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(`subject:${subject}`)}&key=${apiKey}&printType=books&startIndex=${startIndex}&maxResults=${maxResults}&langRestrict=en`;
    
    try {
        // Выполняем запрос к API Google Books
        const response = await fetch(apiUrl);
        
        // Проверяем, успешен ли ответ
        if (!response.ok) {
            throw new Error(`Error fetching books: ${response.statusText}`);
        }        
        const data = await response.json(); // Преобразуем ответ в JSON формат
        console.log(data); // Логируем ответ API для отладки
        return data.items || []; // Возвращаем массив книг или пустой массив, если книг нет
    } catch (error) {
        console.error('Error fetching books:', error); // Логируем ошибку
        return []; // Возвращаем пустой массив в случае ошибки
    }
}
// Функция для загрузки книг по заданной категории
async function loadBooks(subject) {
    // Проверяем, изменилось ли текущее значение категории
    if (currentSubject !== subject) {
        startIndex = 0; // Сбрасываем индекс при смене категории
        currentSubject = subject; // Обновляем текущую категорию
    }
    const books = await searchBooks(subject); // Получаем книги для текущей категории
    const bookContainer = document.getElementById('bookContainer'); 
    bookContainer.style.display = 'flex'; 
    bookContainer.style.flexWrap = 'wrap'; 
    bookContainer.style.width = '924px'; 
    bookContainer.style.transform = 'translateX(-60px)'; 
    bookContainer.style.marginTop = '40px'; 
    bookContainer.style.gap = '76px';
   
    if (startIndex === 0) {
        bookContainer.innerHTML = ''; // Очищаем контейнер перед загрузкой новых книг
    }
    
    // Проверяем, если есть загруженные книги
    if (books.length > 0) {
        console.log(`Loaded ${books.length} books`); // Логируем количество загруженных книг
        
        books.forEach(book => {
            const bookElement = document.createElement('div'); 
            const ratingStars = `
                <span style="color: #F2C94C;font-size: 12px;">${'★'.repeat(Math.round(book.volumeInfo.averageRating))}</span>
                <span style="color: #EEEDF5;font-size: 12px; ">${'☆'.repeat(5 - Math.round(book.volumeInfo.averageRating))}</span>
            `;    
            bookElement.className = 'book-card';                         
            // Создаем уникальный идентификатор для каждой книги
            const bookId = book.id || book.volumeInfo.title.replace(/\s+/g, '-').toLowerCase(); // Если есть ID, используем его, иначе создаем ID на основе названия книги
            console.log(`Book ID: ${bookId}`); // Логируем идентификатор книги
            bookElement.innerHTML = `
            <img src="${book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : './images/placeholder.png'}" alt="${book.volumeInfo.title}" />
            <div class="text">
            <p>${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : ''}</p>
                <h3>${book.volumeInfo.title}</h3>                
                ${book.volumeInfo.averageRating ? 
                    `<p>${ratingStars} ${book.volumeInfo.ratingsCount} reviews</p>` 
                    : ''}
               <p id="text__description"> ${book.volumeInfo.description ? (book.volumeInfo.description.length > 110 
            ? book.volumeInfo.description.slice(0, 110) + '...' : book.volumeInfo.description) : ''}
                </p>
                ${book.saleInfo.listPrice ? 
                    `<div id = "text__price">${book.saleInfo.listPrice.amount.toFixed(2)} ${book.saleInfo.listPrice.currencyCode}</div>` 
                    : ''}
                     <button id="buy-button-${bookId}" class="buy-button">Buy now</button>
            </div>
        `;  
        // Применяем стили к элементу с классом "text"
        const textElement = bookElement.querySelector('.text');      
        textElement.style.lineHeight = '100%'; // Междустрочный интервал
        textElement.style.marginLeft = '36px';
        textElement.style.marginTop = '48px';        
        // Применяем стили к h3
        const titleElement = textElement.querySelector('h3');
        titleElement.style.color = '#1C2A39'; 
        titleElement.style.fontSize = '16px'; 
        titleElement.style.fontWeight = '700';
        titleElement.style.fontFamily = 'Montserrat, sans-serif'; 
        titleElement.style.marginBottom = '5px'; 
        titleElement.style.marginTop = '5px'; 
       // Применяем стили ко всем элементам p
        const textElements = textElement.querySelectorAll('p');
        textElements.forEach((textElement) => {
        textElement.style.color = '#5C6A79'; // Цвет текста автора
        textElement.style.fontSize = '10px'; // Размер шрифта автора
        textElement.style.fontFamily = '"Open Sans", sans-serif';
        textElement.style.fontWeight = '400';
    });
         bookContainer.appendChild(bookElement); // Добавляем элемент книги в контейнер
        // Обработчик события для кнопки "Buy now"
        const buyButton = bookElement.querySelector(`#buy-button-${bookId}`); // Находим кнопку "Buy now" по её уникальному идентификатору
        buyButton.addEventListener('click', () => { // Добавляем обработчик события нажатия на кнопку
            toggleCartItem(book, buyButton); // Вызываем функцию для добавления/удаления книги в корзину
        });
        });
    } else {
        console.log('No more books to load.'); // Логируем, если больше нет книг
    }    
    updateActiveLink(subject); // Обновляем активную ссылку
}
// Добавляем функцию в глобальный объект
window.loadBooks = loadBooks;
function toggleCartItem(book, button) {
    // Получаем текущие элементы корзины из localStorage или инициализируем пустой массив, если корзина пуста
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Генерируем уникальный идентификатор книги
    const bookId = book.id || book.volumeInfo.title.replace(/\s+/g, '-').toLowerCase();

    // Находим индекс книги в корзине по её идентификатору
    const bookIndex = cartItems.findIndex(item => item.id === bookId);

    if (bookIndex > -1) {
        // Если книга уже в корзине, удаляем её
        cartItems.splice(bookIndex, 1); // Удаляем книгу из массива корзины
        button.textContent = 'Buy now'; // Меняем текст кнопки на "Buy now"
        button.classList.remove('added'); // Удаляем класс "added" с кнопки
        cartCount--;
    } else {
        // Если книги нет в корзине, добавляем её
        cartItems.push({ id: bookId, title: book.volumeInfo.title }); // Добавляем книгу в массив корзины
        button.textContent = 'in the cart'; // Меняем текст кнопки на "Added to cart"
        button.classList.add('added'); // Добавляем класс "added" к кнопке
        cartCount++; 
    }

    // Сохраняем обновленный массив корзины в localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
     // Обновляем кружок с количеством книг
     updateCartBadge();
}
function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge'); // Находим элемент кружка
    cartBadge.textContent = cartCount; // Обновляем текст кружка
    cartBadge.style.visibility = cartCount > 0 ? 'visible' : 'hidden'; // Показываем или скрываем кружок
}
function clearCart() {
    cartCount = 0; // Сбрасываем количество книг в корзине
    localStorage.removeItem('cartItems'); // Удаляем корзину из localStorage
    updateCartBadge(); // Обновляем кружок с количеством книг
}


function loadMoreBooks() {
    // Увеличиваем индекс начала загрузки книг на количество максимальных результатов
    startIndex += maxResults; 
    
    // Загружаем новые книги для текущей категории, используя обновленный индекс
    loadBooks(currentSubject); 
}
// Добавляем в глобальный объект
window.loadMoreBooks = loadMoreBooks;

function updateActiveLink(subject) {
    // Получаем все ссылки в боковой панели
    const links = document.querySelectorAll('.sidebar__list a');
    
    // Проходим по каждой ссылке и обновляем класс активности
    links.forEach(link => {
        link.classList.remove('active'); // Удаляем класс "active" у всех ссылок
        
       
        // Извлекаем имя категории из значения onclick
        const onclickValue = link.getAttribute('onclick');
        const categoryMatch = onclickValue.match(/loadBooks\('([^']+)'\)/);
        const category = categoryMatch ? categoryMatch[1] : null;

        // Если извлеченная категория совпадает с текущей темой, добавляем класс "active"
        if (category === subject) {
            link.classList.add('active'); 
        }
    });
}



/// Восстановление состояния кнопок при загрузке страницы
function restoreCartState() {
    // Получаем элементы корзины из localStorage или инициализируем пустой массив, если корзина пуста
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log('Restoring cart state:', cartItems); 
    // Обновляем количество книг в корзине
    cartCount = cartItems.length; // Устанавливаем количество книг в корзине
    updateCartBadge(); // Обновляем кружок сразу при восстановлении состояния
    
    // Проходим по каждому элементу корзины
    cartItems.forEach(item => {
        // Находим кнопку по идентификатору книги
        const button = document.getElementById(`buy-button-${item.id}`) || 
                       document.getElementById(`buy-button-${item.title.replace(/\s+/g, '-').toLowerCase()}`);
        
        // Если кнопка найдена, обновляем её состояние
        if (button) {
            button.textContent = 'in the cart'; // Меняем текст кнопки на "Added to cart"
            button.classList.add('added'); // Добавляем класс "added" к кнопке
            // Логируем обновление кнопки для отладки
            console.log(`Button updated for book: ${item.title}`); 
        } else {
            // Логируем предупреждение, если кнопка не найдена
            console.warn(`Button not found for book ID: ${item.id}`); 
        }
    });
}


// Инициализация загрузки книг при загрузке страницы
window.onload = () => {
    loadBooks(currentSubject).then(() => {
        restoreCartState(); // Восстанавливаем состояние корзины только после загрузки книг
    });
};