// version 1.0 release

// const { dialog } = require("electron");

class Message {
    constructor(buttons, head, body, {activate = null, cancel = -1, focus = 0, type = "notice", esc = true, home = "esc"} ){
        this.buttons  = buttons; // Список кнопок
        this.head     = head; // Заголовок
        this.body     = body; // Описание
        this.activate = activate; // Кнопка для активации
        this.cancel   = cancel; // Индекс кнопки для закрытия уведомления
        this.focus    = focus; // Индекс кнопки, которая должна находиться в фокусе
        this.type     = type; // Тип уведомления
        this.esc      = esc; // Возможность закрытия уведомления
        this.home     = home; // Возможность перейти домой (disable)
        if (home == "esc") this.home = this.esc;
    }

    class_create(){ // Создаём класс для уведомления в зависимости от типа
        let full_class = "mes-";

        if (this.type == "conf")        {full_class += "confirmation";}
        else if (this.type == "notice") {full_class += "notice";}
        else                            {full_class += this.type;}

        return full_class;
    }

    add_listeners(){
        if (this.activate) { // activate - должен быть css селектор на элемент или сам элемент
            if (typeof(this.activate) == "string"){
                this.activate =  document.querySelector(this.activate);
            }
            this.activate.addEventListener("click", () => this.show_message());
        }

        if (this.cancel != -1) {  // close - должен быть индекс кнопки в переданном списке
            this.link_buttons[this.cancel].addEventListener("click", () => this.close_message());
        }
        if (this.esc){ // Закрытие на кнопку крестика
            this.link_close.addEventListener("click", () => this.close_message());
        }
    }

    create(){ // Создаем и добавляем уведомление на страницу

        // Ищем тег <messages>
        let space = document.querySelector("messages");

        if (!space){
            space = document.createElement("messages");
            document.body.append(space);
        }

        // Генерируем наш dialog
        let dialog = document.createElement("dialog");
        dialog.className = `message ${this.class_create()}`;

        let inner = '';
        
        if (this.head){ // Если есть заголовок
            inner += `<h3 class="modal-header">${this.head}</h3>`;
        }
        if (this.body){ // Если есть описание
            inner += `<div class="modal-body">${this.body}</div>`;
        }
        if (this.buttons){ // Если есть кнопки
            inner += `<footer class="modal-footer">`;
            for (let x = 0; x < this.buttons.length; x++) {
                inner += `<button type="button">${this.buttons[x]}</button>`;   
            }
            inner += `</footer>`;
        }
        if (this.esc){ // Если уведомление можно закрыть
            inner += `<button class="modal-close" type="button" tabindex="-1">&times;</button>`; // крестик
        }


        dialog.innerHTML = inner;
        space.append(dialog); // Добавляем элемент на страницу
        
        this.dialog = dialog;
        this.add_listeners();

        return dialog;

    }

    remove(){
        this.dialog.remove();
    }

    esc_control(){ // Контроль нажатия клавиши Esc для плавного закрытия уведомления
        if (this.dialog.open){
            let self_mes = this;

            document.querySelector('body').onkeydown = (e) => {
                if (e.code == "Escape") {
                    e.preventDefault();
                    if (self_mes.esc){ self_mes.close_message(); }
                }
                // else if (e.key == "Home" && e.altKey){ // Если это alt + home
                //     e.preventDefault();
                // }
            };
        } else {
            document.querySelector('body').onkeydown = null;
        }
    }

    show(){ // Показать уведомление
        if (this.dialog.open){return false;}
        this.dialog.showModal();
        this.link_buttons[this.focus].focus();
        this.dialog.classList.add("show");
        this.esc_control();
    }

    close(){ // Закрыть уведомление
        this.dialog.classList.remove("show");
        setTimeout(() => {
            this.dialog.close();
            this.esc_control();
        }, 250);
    }

    // Геттеры

    get link_buttons(){
        return this.dialog.querySelectorAll(".modal-footer button");
    }
    get link_close(){
        return this.dialog.querySelector(".modal-close");
    }
    get link_head(){
        return this.dialog.querySelector(".modal-header");
    }
    get link_body(){
        return this.dialog.querySelector(".modal-body");
    }
    get self(){
        return this.dialog;
    }

    // Сеттеры


    set set_head(value){
        this.head = value;
        this.link_head.innerHTML = value;
    }

    set set_body(value){
        this.body = value;
        this.link_body.innerHTML = value;
    }

    // Поддержка старых версий
    

    show_message(){ return this.show(); }

    close_message(){ return this.close(); }

    remove_message(){ return this.remove(); }

    create_message(){ return this.create(); }
}



function message_ready() {
    
}
document.addEventListener("DOMContentLoaded", message_ready);

// Код Djacon
function sendErr() {
    document.body.innerHTML = `<a class="but" id="home" href="index.html"></a>
                                <a class="but" id="back" onclick="history.back()"></a>
                                <h1>Упс, вас здесь быть не должно 😱!</h1>
                                <h2 align=center>Чтобы продолжить вернитесь на главную страницу</h2>`;
}