const numProfiles = 12;
let count2 = 0;
let cards = [];

for(let i = 0; i < numProfiles; i++){
    fetch('https://randomuser.me/api/')
        .then(res=>res.json())
        .then(function(data){
            createGalleryItem(data.results[0]);
            return data;
        });
}



let people = [];
let count = 0;//used to index the cards to know which person's info to pull when event handling later
function createGalleryItem(person){
    people.push(person);
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
    document.getElementById('gallery').innerHTML += html;
    count++;
    return person;
}
document.getElementById('gallery').addEventListener('click', createModalWindow);

function createModalWindow(e){
    //find out which child element was clicked
    console.log(e.target);
    let target = e.target;
    while(!target.classList.contains('card')){
        if (target.tagName === 'body'){
            return;
        }
        target = target.parentNode;
    }
   
    const index = parseInt(target.classList.value.replace( /^\D+/g, ''));
    const html = 
        `<div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${people[index].picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${people[index].name.first} ${people[index].name.last}</h3>
                    <p class="modal-text">${people[index].email}</p>
                    <p class="modal-text cap">${people[index].location.city}</p>
                    <hr>
                    <p class="modal-text">${people[index].cell.replace( /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/, '($1) $2-$3')}</p>
                    <p class="modal-text">${people[index].location.street}, ${people[index].location.city}, ${people[index].location.postcode}</p>
                    <p class="modal-text">Birthday: ${people[index].dob.date}</p>
                </div>
            </div>

            // IMPORTANT: Below is only for exceeds tasks 
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`;
        
     document.getElementsByTagName('body')[0].innerHTML += html;
     
    document.getElementById('modal-close-btn').addEventListener('click', function(e){
        const container = document.getElementsByClassName('modal-container')[0];
        container.parentNode.removeChild(container);;
    });
    document.getElementById('gallery').addEventListener('click', createModalWindow);
}

