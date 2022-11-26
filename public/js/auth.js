const url = (window.location.hostname.includes('localhost'))
  ? 'http://localhost:8080/api/auth/'
  : 'https://node-restserver-production-a7fd.up.railway.app/api/auth/';

const myForm =  document.querySelector('form');

myForm.addEventListener('submit', event =>{

    event.preventDefault();
    const formData = {};

    for(let e of myForm.elements){
        //Si el elemento tiene la propiedad 'name' con valor
        // Creamos el obeto formData con el 'name' como key y el 'value' como el valor
        if( e.name.length > 0 ){
            formData[e.name] = e.value;
        }
    }

    const params = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(formData),
      };

    const myRequest = new Request(url + 'login',
      params
    );

    // Request signIn de google
    fetch(myRequest)
    .then((resp) => resp.json())
    .then((data) => {
        //Si hay un msg es que hay un error
        if ( data.msg ){
            return console.error(data.msg);
        }

        localStorage.setItem('token', data.token);

        //Redirección a la página del chat
        window.location = 'chat.html'
    })
    .catch(console.warn);

});



function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.

    // GOOGLE TOKEN : ID TOKEN
    // console.log('id_token', response.credential);
    //  const responsePayload = decodeJwtResponse(response.credential);

    const data = { id_token: response.credential };

    const params = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(data),
    };

    const myRequest = new Request(url + 'google',
      params
    );

    // console.log(myRequest);

    // Request signIn de google
    fetch(myRequest)
      .then((resp) => resp.json())
      .then((data) => {
        //Guadamos el Token en el localStorage para usarlo para la parte de autenticacion con sockets
        // console.log(data.token);
        localStorage.setItem('token', data.token);

        //Redirección a la página del chat
        window.location = 'chat.html'
      })
      .catch(console.warn);

    //  console.log("ID: " + responsePayload.sub);
    //  console.log('Full Name: ' + responsePayload.name);
    //  console.log('Given Name: ' + responsePayload.given_name);
    //  console.log('Family Name: ' + responsePayload.family_name);
    //  console.log("Image URL: " + responsePayload.picture);
    //  console.log("Email: " + responsePayload.email);
  }

  const btn = document.getElementById('google-signout');

  btn.onclick = () => {
    google.accounts.id.disableAutoSelect();

    //sign out
    google.accounts.id.revoke(localStorage.getItem('email'), (done) => {
      localStorage.clear();
      location.reload();
    });
  };