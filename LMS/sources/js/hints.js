function addTooltip(){ // Добавление data-tooltip для элементов по умолчанию
    let types = { // Подсказки по умолчанию (если нет в html)
        "#home": "Домой",
        "#back": "Назад",
        "#edit": "Редактировать",
        "#add_book": "Получить книгу",
        "#delete_book": "Сдать книгу",
        "#del" : "Удалить",
        "#remove" : "Отменить выделение",
    };

    for(let selector in types){ // Перебираем каждый селектор
        let elements = document.querySelectorAll(selector);

        for(let element of elements){ // перебираем каждый элемент с селектором
            if(!element.hasAttribute("data-tooltip")){ element.setAttribute("data-tooltip", types[selector]); } // Если нет data-tooltip, то добавляем его
        }
    }
}

function addTooltipListener(){ // Определение элементов с tooltip
    let withTooltip = [];

    return () => { // Обновление элементов с tooltip
        addTooltip();
        let nowTooltip = document.querySelectorAll("[data-tooltip]"); // Элементы с tooltip в реальности
        nowTooltip = Array.prototype.slice.call(nowTooltip);

        for(let element of nowTooltip){ // Перебираем элемненты в реальности
            if (!withTooltip.includes(element)){ // Если реального элемента нет в нашем массиве
                withTooltip.push(element); // Мы его добавляем
                element.addEventListener("mouseenter", tooltipControl); // И начинаем прослушивать
            }
        }

        withTooltip.forEach((element, index) => {
            if (!nowTooltip.includes(element)){ // Если реального элемента нет, но он есть в нашем массиве
                element.removeEventListener("mouseenter", tooltipControl); // Перестаём слушать
                withTooltip.splice(index, 1); // Удаляем из списка
            }
        });
    };
}

let updateTooltip = addTooltipListener();

function tooltipControl(e){ // Полный контроль подсказки
    const hintOpacity = () => Number(window.getComputedStyle(hint).opacity);

    function changeOpacity(show){ // Анимация прозрачности 
        let change = () => {
            if (animation) animation.cancel();
            animation = hint.animate({
                opacity: order
            }, duration);

        };
        
        let order = [hintOpacity(), 0]; // Ставим анимацию с текущй прозрачности до 0
        let duration = tooltipTime * hintOpacity(); // Вычисляем время анимации
        if (show){ // Если нужно показывать, а не скрывать
            order[1] = 1; // Ставим целевую прозрачность на 1
            duration = tooltipTime * (1 - hintOpacity());
        }

        change(); // Всё настроили, можно и запускать
        
    }

    function changeCoords(mouse){ // Следование за мышкой
        hint.style.top = `${mouse.pageY+10}px`;
        hint.style.left = `${mouse.pageX+10}px`;
    }

    function getCoords(){}

    function createHint(message){ // Создание подсказки
        hint = document.createElement('span');
        hint.classList.add("tooltip");

        let lastHint = document.querySelector(".tooltip"); // Существующая подсказка
        if(lastHint) hint = lastHint; // если подсказка уже есть, то работаем с ней

        hint.innerHTML = message;

        changeOpacity(true);
        document.body.append(hint);
        // getCoords();

        return hint;
    }

    function deleteHint(){ // Удаление подсказки
        function delRevoke(element){
            if(element.target.hasAttribute("data-tooltip")){ // Если навелись на другой элемент с подсказкой

                document.removeEventListener("mouseover", delRevoke); // Отменяем прослушку
                clearTimeout(delTimeout); // Останавливаем процесс удаления
                
                animation.pause(); // Ставим анимацию исчезновения на паузу
                setTimeout(() => animation.cancel()); // И удаляем анимацию
            }
        }

        changeOpacity(false);
        let delTimeout = setTimeout(() => {
            base.removeEventListener("mousemove", changeCoords);
            document.removeEventListener("mouseover", delRevoke);

            hint.remove();
        }, tooltipTime * hintOpacity() - 1);

        document.addEventListener("mouseover", delRevoke); //Ждём, пока не наведуться на другую подсказку
        
    }

    
    let hint, animation;
    let base = e.target; // Элемент, для которого есть подсказка

    if (e.type == "mouseenter"){
        createHint(base.getAttribute("data-tooltip")); // Создаём подсказку
        document.addEventListener("mousemove", changeCoords); // Следим за движением мышки
        base.addEventListener("mouseleave", deleteHint, {"once": true}); // Ждём покидание элемента мышкой
    }
}

function ready_hints(){
    updateTooltip();
}

document.addEventListener("DOMContentLoaded", ready_hints);

const tooltipTime = 150; // Врема исчезания и появления подсказки


//elem.getBoundingClientRect();