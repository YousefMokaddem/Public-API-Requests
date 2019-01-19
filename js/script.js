const numProfiles = 12;

for(let i = 0; i < numProfiles; i++){
    //using nationality as query to ensure only english letters, for search functionality
    fetch('https://randomuser.me/api/?nat=AU,BR,CA,CH,DE,DK,ES,FI,FR,GB,IE,NO,NL,NZ,US')
        .then(res=>res.json())
        .then(function(data){
            createGalleryItem(data.results[0]);
        });
}

let people = [];//used to store the objects fetched for getting more info when creating modal view
let count = 0;//used to index the cards to know which person's info to pull when event handling later
function createGalleryItem(person){
    people.push(person);
    //create html, added custom class here for indexing purposes
    const html = `<div class="card card-${count}">
                    <div class="card-img-container">
                        <img class="card-img" src="${person.picture.large}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                        <p class="card-text">${person.email}</p>
                        <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
                    </div>
                </div>`;
    //append html to gallery
    document.getElementById('gallery').innerHTML += html;
    count++;
}
//add one event listener for the entire gallery
document.getElementById('gallery').addEventListener('click', createModalWindow);

//here is the handler for the gallery clicks
function createModalWindow(e){
    //find out which child element was clicked
    let target = e.target;
    while(!target.classList.contains('card')){
        //if the clicked element was the gallery(not a specific card but somewhere else in the div) then end the handling of the click
        if (target.id === 'gallery'){
            return;
        }
        //if it was not the gallery, traverse up until it is the card.
        target = target.parentNode;
    }
    //extract the index from the class that was added in the create gallery item template literal
    let index = parseInt(target.classList.value.replace( /^\D+/g, ''));
    //create the html using the index to get the specified person's data
    let html = createModalHtml(index);
    //append the html to the body.
    document.getElementsByTagName('body')[0].innerHTML += html;
    //attach the handlers for the buttons in the modal view
    attachModalHandlers(index);
}
//modal button event handlers
function attachModalHandlers(index){
    //remove the modal view and re-attach the gallery's click handler and search handler
    document.getElementById('modal-close-btn').addEventListener('click', function(e){
        const container = document.getElementsByClassName('modal-container')[0];
        container.parentNode.removeChild(container);
        document.getElementById('gallery').addEventListener('click', createModalWindow);
        document.getElementsByTagName('form')[0].addEventListener('submit', searchHandler);
    });
    //remove the modal view, create a new modal view using the decremented index and add modal button handlers again
    document.getElementById('modal-prev').addEventListener('click', function(e){
        const container = document.getElementsByClassName('modal-container')[0];
        container.parentNode.removeChild(container);
        index = (index+11)%12;
        html = createModalHtml(index);
        document.getElementsByTagName('body')[0].innerHTML += html;
        attachModalHandlers(index);
    });
    //remove the modal view, create a new modal view using the incremented index and add modal button handlers again
    document.getElementById('modal-next').addEventListener('click', function(e){
        const container = document.getElementsByClassName('modal-container')[0];
        container.parentNode.removeChild(container);
        index = (index+1)%12;
        html = createModalHtml(index);
        document.getElementsByTagName('body')[0].innerHTML += html;
        attachModalHandlers(index);
    });
}
//create html based on index and return it.
function createModalHtml(index){
    return `<div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${people[index].picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${people[index].name.first} ${people[index].name.last}</h3>
            <p class="modal-text">${people[index].email}</p>
            <p class="modal-text cap">${people[index].location.city}</p>
            <hr>
            <p class="modal-text">${people[index].cell.replace( /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/, '($1) $2-$3')}</p>
            <p class="modal-text cap">${people[index].location.street}, ${people[index].location.city}, ${people[index].location.postcode}</p>
            <p class="modal-text">Birthday: ${people[index].dob.date.replace(/^(\d{4})\D(\d{2})\D(\d{2})/, '$2/$3/$1').substring(0,10)}</p>
        </div>
    </div>

    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
</div>`;
}
//add search html to page
document.getElementsByClassName('search-container')[0].innerHTML = 
    `<form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>`;
//handle search
document.getElementsByTagName('form')[0].addEventListener('submit', searchHandler);

function searchHandler(e){
    e.preventDefault();
    //get the value from the input field
    const searchString = document.getElementById('search-input').value;
    //select all of the cards
    let cards = document.getElementsByClassName('card');
    //loop through the cards and check the name fields against the search string. style the cards accordingly.
    for(let i = 0; i < cards.length; i++){
        if(cards[i].children[1].children[0].textContent.search(searchString.toLowerCase()) === -1){
            cards[i].style.display = 'none';
        }else{
            cards[i].style.display = 'inherit';
        }
    }
}