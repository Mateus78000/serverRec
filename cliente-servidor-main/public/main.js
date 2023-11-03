const loginModal = document.querySelector("dialog")
const loginForm = loginModal.querySelector("form")
const loginFormButtonSend = loginModal.querySelector(".bt-send")
const loginMsg = loginModal.querySelector(".msg")
const domMovieList = document.querySelector("ul.movie-list")
const domFormAlterar = document.querySelector("form.form-alterar") 
//const deleteButtons = domMovieList.querySelectorAll(".delete-button")
const sendButton = domFormAlterar.querySelector("button")

// ---✀------------------------------------------------------------------

// checa se já se logou na página antes
if (!localStorage.getItem("token")) {
  // se não tem os dados salvos, te mostra a tela de login
  loginModal.showModal()
   // se já tem os dados, te mostra a lista
} else {
  listarTodosOsFilmes()
}

// função que dá funcionalidade ao botão do diálogo,  adiciona o evento de click 
loginFormButtonSend.addEventListener("click", async ev => {
  //pega os valores dados pelo usuario e os transforma nas variaveis
  const { login, senha } = loginForm
  // acessa a  rota login, fornece os dados, checa se estão corretos, cria um token e o retorna
  const response = await fetch(`/login?login=${login.value}&senha=${senha.value}`)

  // guarda seus cookies no server
  const data = await response.json()
  console.log(data)
  if (data.token) {
    localStorage.setItem("token", data.token)
    // fecha a caixa de dialogo e mostra a lista de filmes
    loginModal.close()
    listarTodosOsFilmes()
    return
  }
  loginMsg.innerHTML = `<strong>Usuár/io e/ou senha inválidos</strong>`
})

// ---✀------------------------------------------------------------------
async function listarTodosOsFilmes() {
  // pega a lista de filmes
  const response = await fetch("/movies")
  const movies = await response.json()
  // depois de transformar a lista de filmes em json, deleta o conteudo atual da lista de itens
  domMovieList.innerHTML = ""
  // dentro dessa mesma lista, cria um item pra cada filme
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
  // pega o id do filme no json e o guarda nos botões, pra serem utilizados na hora de editar ou excluir
}

listarTodosOsFilmes()
// ---✀------------------------------------------------------------------

domFormAlterar.addEventListener("submit", async ev => {
  ev.preventDefault()
  ev.stopPropagation()
  ev.stopImmediatePropagation()
  
  // pega as informaões do forms
  const body = JSON.stringify({
    title: domFormAlterar.title.value,
    source: domFormAlterar.source.value,
    description: domFormAlterar.description.value,
    thumb: domFormAlterar.thumb.value,
  })

  // if (sendButton.dataset.id) {
  //   console.log("botao alterar")
  //   const response = await fetch(`/movies?id=${sendButton.dataset.id}`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body
  //   })
  //   sendButton.removeAttribute("data-id")
  //   sendButton.innerText = "Cadastrar"
  //   domFormAlterar.reset()
  //   listarTodosOsFilmes()
  //   return
  // }
  
  // manda as informaçoes pra rota movies com o método post, 
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