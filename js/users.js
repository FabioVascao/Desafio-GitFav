import { GitHubUsers } from "./githubuser.js"

// Classe para conter a lógica dos dados
// Como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
    this.userExist()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try { 
      const userExists = this.entries.find(entry => entry.login === username)
      if(userExists) {
        throw new Error('Usuário ja cadastrado.')
      }

      const user = await GitHubUsers.search(username)

    if(user.login === undefined) {
      throw new Error('Usuário não encontrado!')
    }
      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
        alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
    this.userExist()
  }
}

//Classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const {value} = this.root.querySelector('.search input')
      this.add(value)
  }
  }

  update() {
    this.removeAllTr();
    
    this.entries.forEach(user => {
      const row = this.createRow()
      
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector(`.user a`).href = `https://github.com/${user.login}`
      row.querySelector(`.user p`).textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositorios').textContent = user.public_repos
      row.querySelector('.seguidores').textContent = user.followers
      row.querySelector('.remover').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
      
      this.userExist()
    })    
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove();
      })
  }

  createRow() {
    const tr = document.createElement('tr');

    tr.innerHTML = `
            <td class="user">
              <img src="https://github.com/fabiovascao.png" alt="Imagem de Fabio de Sousa Santos">
              <a href="https://github.com/fabiovascao" target="_blank">
                <p>Fabio de Sousa Santos</p>
                <span>FabioVascão</span>
              </a>
            </td>
            <td class="repositorios">
              29
            </td>
            <td class="seguidores">
              9
            </td>
            <td>
              <button class="remover">&times;</button>
            </td>
          `
    return tr
  }

  userExist() {
    const teste = document.querySelectorAll('tbody tr')
    const teste2 = teste.length
    const nada = document.querySelector('.nada')
    if(teste2 === 0) {
      nada.classList.remove('hide')
    } else {
      nada.classList.add('hide')
    }
  }
}