const entities = [
  {
    img: './images/image1.png' 
  },
  {
    img: './images/image2.png'
  },
  {
    img: './images/image3.png'
  }
];

const img = document.querySelector('.content');
const dots = document.querySelectorAll('.dot');  
let currentIndex = 0;

// Функция для обновления изображения и состояния точек
const setEntity = (index) => {   
  img.style.backgroundImage = `url(${entities[index].img})`;

  // Сбрасываем активные состояния для точек
  dots.forEach(dot => dot.classList.remove('active'));
  
  // Устанавливаем активный класс для текущей точки
  dots[index]?.classList.add('active');
};

// Инициализация слайдера
setEntity(currentIndex);

// Функция для автоматической смены изображений
const autoSlide = () => {
  currentIndex = (currentIndex < entities.length - 1) ? currentIndex + 1 : 0; // Циклический переход
  setEntity(currentIndex);
};

// Запускаем автоматическую смену изображений каждые 5 секунд
let slideInterval = setInterval(autoSlide, 5000);

// Добавление обработчиков событий для точек
const addClickListener = (element, index) => {
  element.addEventListener('click', (event) => {
    event.preventDefault(); // Предотвращаем переход по ссылке
    clearInterval(slideInterval); // Останавливаем автоматическую прокрутку
    currentIndex = index; // Устанавливаем текущий индекс на индекс точки
    setEntity(currentIndex); // Обновляем слайдер
  });
};

dots.forEach((dot, index) => addClickListener(dot, index));

// Запускаем автоматическую прокрутку заново при взаимодействии
const restartAutoSlide = () => {
  clearInterval(slideInterval);
  slideInterval = setInterval(autoSlide, 5000);
};

dots.forEach(dot => dot.addEventListener('click', restartAutoSlide));