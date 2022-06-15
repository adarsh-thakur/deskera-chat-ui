import "../../css/Alert.css";

export const AlertType = {
    standard: "STANDARD",
    user_input: "USER_INPUT",
};

// buttons - [{title:"", className:"", onClick:()=>{}}]
export function showAlert(
    title,
    message,
    buttons = null,
    type = AlertType.standard
) {
    let main_div = document.createElement("div");
    main_div.className = "dk-chat-alert";
    main_div.id = "dk-alert";

    let background_div = document.createElement("div");
    background_div.className = "dk-chat-alert-background";
    background_div.id = "dk-alert-background";

    let parent = document.getElementById("root");

    let title_div = document.createElement("div");
    title_div.className = "dk-chat-alert-title";
    title_div.innerHTML = title;

    let message_div = document.createElement("div");
    message_div.className = "dk-chat-alert-message";
    message_div.innerHTML = message;

    let textInput_div = document.createElement("input");
    textInput_div.id = "textInput";
    textInput_div.className = "dk-chat-alert-textField";
    textInput_div.setAttribute("type", "password");
    textInput_div.innerHTML = message;

    let buttons_holder_div = document.createElement("div");
    buttons_holder_div.className = "dk-chat-alert-button-row";


    if (buttons === null) {
        let button_div = getAlertButton("Ok", "dk-chat-dk-bg-button dk-chat-text-white", () => {
            parent.removeChild(main_div);
            parent.removeChild(background_div);
        });
        buttons_holder_div.appendChild(button_div);
    } else {
        for (let i = 0; i < buttons.length; i++) {
            let data = buttons[i];
            let button_div = getAlertButton(data.title, data.className, () => {
                parent.removeChild(main_div);
                parent.removeChild(background_div);
                if (data.onClick) {
                    if (type === AlertType.user_input) {
                        data.onClick(textInput_div.value);
                    } else {
                        data.onClick();
                    }
                }
            });
            buttons_holder_div.appendChild(button_div);
        }
    }

    main_div.appendChild(title_div);
    main_div.appendChild(message_div);
    if (type === AlertType.user_input) {
        main_div.append(textInput_div);
    }
    main_div.appendChild(buttons_holder_div);

    parent.appendChild(background_div);
    parent.appendChild(main_div);

    let input = document.createElement("input");
    main_div.appendChild(input);
    input.focus();
    main_div.removeChild(input);
}

export function getAlertButton(title, className, onClick) {
    let button_div = document.createElement("button");
    button_div.innerHTML = title;
    button_div.className = className + " dk-chat-alert-button dk-chat-border-none";
    button_div.onclick = () => {
        onClick();
    };
    return button_div;
}
