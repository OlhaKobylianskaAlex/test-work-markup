
document.addEventListener('DOMContentLoaded', (event) => {
  // Burger menu
  const html = document.querySelector('html');
  const header = document.querySelector('header');
  const button = document.querySelector('.header-burger__icon');
  const buttonContext = document.querySelector('.burger-img');
  const menu = document.querySelector('.header-burger__menu');
  // Active lesson
  const container = document.querySelector('.program-about');
  const lessonsBlock = document.querySelector('.program-lessons__block');
  const lessons = document.querySelectorAll('.program-lessons__item');
  const lessonsBlockDesc = document.querySelector('.program-about__block');
  const lessonsBlockDescTitle = document.querySelector('.program-about .block__title');
  // Form
  const form = document.querySelector("#form");
  const formBtn = document.querySelector("#formBtn");
  const fieldName = document.querySelector("#fieldName");
  const fieldEmail = document.querySelector("#fieldEmail");
  const fieldPhone = document.querySelector("#fieldPhone");
  const errorName = document.querySelector("#errorName");
  const errorEmail = document.querySelector("#errorEmail");
  const errorPhone = document.querySelector("#errorPhone");
  // Opinions slider
  const arrowPrev = document.querySelector('.opinions-block__arrow--prev');
  const arrowNext = document.querySelector('.opinions-block__arrow--next');
  const opinionsBlock = document.querySelector('.opinions-block__content');
  const opinions = opinionsBlock.getElementsByClassName('item');
  const opinionsBread = document.querySelector('.opinions-bread');
  const breads = opinionsBread.getElementsByClassName('item');
  let swipeStartWidth;
  let swipeEndWidth;
  // Answers open/close
  const answerBlock = document.querySelector('.answers-block');
  const answers = document.querySelectorAll('.answers-block .item');
  const answersArea = document.querySelectorAll('.answers-block .item__area');
  const answersImgs = answerBlock.querySelectorAll('.item__icon-img');

  // Burger menu
  button.addEventListener('click', openCloseMenu);
  header.addEventListener('click', closeMenu);
  // Active lesson
  lessonsBlock.addEventListener('click', activeLessons);
  // Resize screen - open active lesson
  window.addEventListener('resize', updateScreenSize);
  // Form
  formBtn.addEventListener('click', sendForm);
  // Opinions slider
  arrowPrev.addEventListener('click', () => slideTo(opinions?.length - 1, 'prepend', opinionsBlock, opinions, 'click'));
  arrowNext.addEventListener('click', () => slideTo(0, 'append', opinionsBlock, opinions, 'click'));
  opinionsBlock.addEventListener('touchstart', swipeStart);
  opinionsBlock.addEventListener('touchend', swipeEnd);
  // Answers open/close
  answerBlock.addEventListener('click', openCloseAnswer);


  // For first time resize
  updateScreenSize();

  // Phone form field
  window.intlTelInput(fieldPhone, {
    initialCountry: "ua",
    fixDropdownWidth:true,
    validationNumberType: 'MOBILE',
    useFullscreenPopup: false
  });

  // Burger menu
  function openCloseMenu() {
    menu.classList.toggle('active');
    html.classList.toggle('hidden');

    menu.classList.contains('active') ? 
      buttonContext.setAttribute('src', 'assets/img/svg/main-page/close.svg') : 
        buttonContext.setAttribute('src', 'assets/img/svg/main-page/menu-burger.svg');
  }

  function closeMenu(e) {
    const tgl = e.target.classList;
    if(tgl.contains('header-navbar__link') || tgl.contains('header-logo__link-img') || tgl.contains('btn__link')) {
      menu.classList.remove('active');
      html.classList.remove('hidden');
      buttonContext.setAttribute('src', 'assets/img/svg/main-page/menu-burger.svg');
    }
  }

  // Active lesson
  function activeLessons(e) {
    const target = e.target;
    const lessonItem = target.closest('.program-lessons__item');

    if(lessonItem && lessonItem.dataset.index) {
      lessons.forEach((elem, index) => {
        if(index === +lessonItem.dataset.index) {
          if(!elem.classList.contains('active')) {
            elem.classList.add('active');
            if(window.innerWidth <= 991) elem.insertAdjacentElement('afterend', lessonsBlockDesc);
            lessonsBlockDescTitle.innerHTML = `Модуль ${index + 1} ${elem.querySelector('.item__title').innerHTML}`;
          } else if (elem.classList.contains('active') && window.innerWidth <= 991) {
            //Ability to close all elements from table
            elem.classList.remove('active');
            lessonsBlockDesc.remove();
          }
        }
        else elem.classList.remove('active')
      })
    }
  }

  // Resize screen - open active lesson
  function updateScreenSize() {
    const activeLesson = document.querySelector('.program-lessons__item.active');

    if(lessonsBlockDesc && activeLesson && window.innerWidth <= 991) activeLesson.insertAdjacentElement('afterend', lessonsBlockDesc);
    else if (lessonsBlockDesc && container && window.innerWidth > 991) container.append(lessonsBlockDesc);
  }

  // Form
  function sendForm(e) {
    let isValid = true;
    e.preventDefault();

    const valName = fieldName.value.trim().match(/[^А-ЯЁа-яёA-Za-z]/);

    if(fieldName.value.trim().length < 3 || valName?.[0]?.trim()) {
      isValid = false;
      fieldName.classList.add('error');
      errorName.classList.add('show')
    } else {
      isValid = true;
      fieldName.classList.remove('error');
      errorName.classList.remove('show')
    }

    const emailRegex = /^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/
    const valEmail = emailRegex.test(fieldEmail.value.trim())

    if(!fieldEmail.value.trim() || !valEmail) {
      isValid = false;
      fieldEmail.classList.add('error');
      errorEmail.classList.add('show')
    } else {
      isValid = true;
      fieldEmail.classList.remove('error');
      errorEmail.classList.remove('show')
    }

    const phoneRegex = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
    const valPhone = phoneRegex.test(fieldPhone.value.trim())

    if(!fieldPhone.value.trim() || !valPhone) {
      isValid = false;
      fieldPhone.classList.add('error');
      errorPhone.classList.add('show')
    } else {
      isValid = true;
      fieldPhone.classList.remove('error');
      errorPhone.classList.remove('show')
    }

    if(isValid) {
      form.reset();
      alert('Форма відправлена!');
    }
  }

  // Opinions slider
  function swipeStart(e) {
    swipeStartWidth = e.changedTouches[0].pageX;
  }

  function swipeEnd(e) {
    const active = opinionsBread.querySelector('.item.active');
    if(active && active.dataset.index) {
      swipeEndWidth = e.changedTouches[0].pageX;
      swipeStartWidth - swipeEndWidth < -50 && slideTo(+active.dataset.index !== 0 ? +active.dataset.index - 1: 0, 'prepend', opinionsBread, breads);
      swipeStartWidth - swipeEndWidth > 50 && slideTo(+active.dataset.index !== 4 ? +active.dataset.index + 1: 4, 'append', opinionsBread, breads);
    }
  }

  function slideTo(index, action, block, items, act) {
    if(items) {
      Array.from(items).forEach(elem  => elem.classList.remove('active'));
      if(act === 'click') {
        const prev = items[index];
        items[index].remove();
        action === 'append' ? block.append(prev) : block.prepend(prev);
        items[Math.round(Math.floor(items.length / 2))].classList.add('active');
      } else items[index].classList.add('active');
    }
  }

  // Answers open/close
  function openCloseAnswer(e) {
    const target = e.target;
    const answerItem = target.closest('.item');

    if(answerItem && answerItem.dataset.index) {
      answers.forEach((elem, index) => {
        if(index === +answerItem.dataset.index) {
            elem.classList.toggle('active');
            answersArea[index]?.classList.toggle('active');

            answersArea[index]?.classList.contains('active') ? 
            answersImgs[index]?.setAttribute('src', 'assets/img/svg/answers/foundation_minus.svg'):
            answersImgs[index]?.setAttribute('src', 'assets/img/svg/answers/foundation_plus.svg');
        } else {
          elem.classList.remove('active');
          answersArea[index]?.classList.remove('active');
          answersImgs[index]?.setAttribute('src', 'assets/img/svg/answers/foundation_plus.svg');
        }
      })
    }
  }
});

