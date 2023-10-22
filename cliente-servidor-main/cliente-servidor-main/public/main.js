const loginModal = document.querySelector("dialog")
const loginForm = loginModal.querySelector("form")
const loginFormButtonSend = loginModal.querySelector(".bt-send")
const loginMsg = loginModal.querySelector(".msg")
const domMovieList = document.querySelector("ul.movie-list")
const domFormAlterar = document.querySelector("form.form-alterar") 
//const deleteButtons = domMovieList.querySelectorAll(".delete-button")
const sendButton = domFormAlterar.querySelector("button")

// ---✀------------------------------------------------------------------

if (!localStorage.getItem("token")) {
  loginModal.showModal()
} else {
  listarTodosOsFilmes()
}

loginFormButtonSend.addEventListener("click", async ev => {
  const { login, senha } = loginForm
  const response = await fetch(`/login?login=${login.value}&senha=${senha.value}`)
  const data = await response.json()
  if (data.token) {
    localStorage.setItem("token", data.token)
    loginModal.close()
    listarTodosOsFilmes()
    return
  }
  loginMsg.innerHTML = `<strong>Usuário e/ou senha inválidos</strong>`
})

// ---✀------------------------------------------------------------------
async function listarTodosOsFilmes() {
  const response = await fetch("/movies")
  const movies = await response.json()
  domMovieList.innerHTML = ""
  movies.forEach(movie => {
    domMovieList.innerHTML += `  
      <li>
        <div>
          <strong>Title:</strong> ${movie.title}
        </div>
        <ul>
          <li>
            <strong>Source:</strong> ${movie.source}
          </li>
          <li>
            <strong>Thumb:</strong> ${movie.thumb}
          </li>
          <li>
            <strong>Description:</strong> ${movie.description}
          </li>
          <li>
            <button class ="delete-button" data-id="${movie.id}">Excluir</button>
            <button class ="alterar-button" data-id="${movie.id}">Alterar</button>
          </li>
        </ul>
      </li>
    `
  });
}

listarTodosOsFilmes()
// ---✀------------------------------------------------------------------

domFormAlterar.addEventListener("submit", async ev => {
  ev.preventDefault()
  ev.stopPropagation()
  ev.stopImmediatePropagation()
  
  const body = JSON.stringify({
    title: domFormAlterar.title.value,
    source: domFormAlterar.source.value,
    description: domFormAlterar.description.value,
    thumb: domFormAlterar.thumb.value,
  })

  if (sendButton.dataset.id) {
    console.log("botao alterar")
    const response = await fetch(`/movies?id=${sendButton.dataset.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body
    })
    sendButton.removeAttribute("data-id")
    sendButton.innerText = "Cadastrar"
    domFormAlterar.reset()
    listarTodosOsFilmes()
    return
  }
  
  const response = await fetch("/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  })
  
  const result = await response.json()
  domFormAlterar.reset()
  
  listarTodosOsFilmes()
})

// ---✀------------------------------------------------------------------

domMovieList.addEventListener("click", async ev => {
  if (ev.target.classList.contains("delete-button")) {
    const response = await fetch(`/movies?id=${ev.target.dataset.id}`, { method: "DELETE"})
   // const movies = await response.json()        
    listarTodosOsFilmes()
    return
  } 
  
  if (ev.target.classList.contains("alterar-button")) {
    console.log(ev.target.dataset.id)
    const idResponse = await fetch(`/movies?id=${ev.target.dataset.id}`, {method: "GET"})
    const movieData = await idResponse.json()
    // const response = await fetch(`/movies?id=${ev.target.dataset.id}`, {method: "PUT"})
    // console.log(await response.json())
    console.log(domFormAlterar.title.value)
    
    domFormAlterar.title.value = movieData.title
    domFormAlterar.source.value = movieData.source
    domFormAlterar.description.value = movieData.description
    domFormAlterar.thumb.value = movieData.thumb

    console.log(sendButton)
    sendButton.innerText = "Alterar"
    sendButton.dataset.id = movieData.id
    
    //console.log("Did not fetch")
    //console.log(ev.target.dataset.id)
    
    listarTodosOsFilmes()
    return
  }
})