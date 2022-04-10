const parseJSON = async (url) => {
    //változóba mentjük a fetchet
    const response = await fetch(url);
    return response.json();
};

//objectumból kibontjuk a kulcsait: ({name, surname})
const userComponent = ({name, surname, status}) => {
    return `
        <div>
            <h1>${name}</h1>
            <h2>${surname}</h2>
        </div>
    `
};

function addUserComponent() {
    return `
        <div>
            <input type="text" name="firstName" placeholder="First name">
            <input type="text" name="surname" placeholder="Surname">
            <button id="submit-data">Send</button>
        </div>
    `
};


const loadEvent = async () => {
    // ezzel a location object-telmeg tudjuk vizsgalni hol vagyunk
    if(window.location.pathname === '/admin/oder-overview') {
        console.log("Mi most az admin feluleten vagyunk.");
    } else {
        console.log("Mi most a vasarloi feluleten vagyunk.");
    }

    const result = await parseJSON('/api/v1/users');
    const rootElement = document.getElementById("root");
    const dataSubmitButton = document.getElementById("submit-button");
    const firstName = document.querySelector(`input[name="firstName"]`);
    const surname = document.querySelector(`input[name="surname"]`);

    rootElement.insertAdjacentHTML(
        "beforeend", 
        result.map(user => userComponent(user)).join("")
    );

    rootElement.insertAdjacentHTML("afterend",  addUserComponent());


    dataSubmitButton.addEventListener("click", e => {
        const userData = {
            firstName: firstName.value,
            surname: surname.value
        };

        fetch("/user/new", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(async data => {
            const users = await data.json();

            rootElement.innerHTML = "";
            rootElement.insertAdjacentHTML("beforeend", users.map(user => userComponent(user)).join(""))
        })
    })
};

window.addEventListener('load', loadEvent);