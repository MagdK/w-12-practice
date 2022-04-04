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
            <p>${status}</p>
        </div>
    `
};

const loadEvent = async () => {
    const result = await parseJSON('/api/v1/users');
    const rootElement = document.getElementById("root");
    rootElement.insertAdjacentHTML(
        "beforeend", 
        result.map(user => userComponent(user)).join("")
    );
};

window.addEventListener('load', loadEvent);