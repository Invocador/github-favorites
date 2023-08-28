import { GithubUser } from "./GitHubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  };


  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-fav')) || [];
  } 

  save() {
    localStorage.setItem('@github-fav', JSON.stringify(this.entries));
  }


  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login.toUpperCase() === username.toUpperCase());
      
      if(userExists) {
        throw new Error('Usuário já Cadastrado');
      }
      
      const user = await GithubUser.search(username);

      if(user.login === undefined) {
        throw new Error('User not found');
      };

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
      this.check();
    } catch(error) {
      alert(error.message);
    };
  };

  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login.toUpperCase() !== user.login.toUpperCase());
    this.entries = filteredEntries;
    this.update();
    this.save();
  }
};


export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector('table tbody');
    this.onadd();
    this.update();
    this.check();
  };

  onadd() {
    const addButton = this.root.querySelector('.star-button');

    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input');

      this.add(value);
    };
  };

  update() {
    this.removeAlltr();
    this.entries.forEach(user => {
    const row = this.createRow();
    

    row.querySelector('.user img').src = `https://github.com/${user.login}.png`;

    row.querySelector('.user img').alt = `Imagem de ${user.name}`;

    row.querySelector('.user p').textContent = user.name;

    row.querySelector('.user a').href = `https://github.com/${user.login}`;

    row.querySelector('.user span').textContent = user.login;


    row.querySelector('.repositories').textContent = user.public_repos;

    row.querySelector('.followers').textContent = user.followers;
    
    row.querySelector('.remove').onclick = () => {
      const isOk = confirm('Tem certeza que deseja deletar esse usuário?');

      if(isOk) {
          this.delete(user);
          this.check();
      };
    };

    this.tbody.append(row);

  });
};

createRow() {

  const tr = document.createElement('tr');

 const content = `
        <tr>
          <td class="user">
           <img src="https://github.com/Invocador.png" alt="Imagem de Invocador">
           <a href="https://github.com/Invocador" target="_blank">
               <p>Caio Rocha</p>
               <span>/Invocador</span>
           </a>
          </td>
          <td class="repositories">
           48
          </td>
          <td class="followers">
           25522
          </td>
          <td>
           <button class="remove">
              Remover
           </button>
           </td>
       </tr> 
  `;

  tr.innerHTML = content;

  return tr;
};

removeAlltr() {
 this.tbody.querySelectorAll('tr').forEach(tr => tr.remove());
};

check() {
  if(this.entries.length === 0) {
    this.tbody.classList.add('hide');
    this.root.querySelector(".star").classList.remove('hide');
    this.root.querySelector(".border").classList.remove('hide');
   } else {
    this.tbody.classList.remove('hide');
    this.root.querySelector(".star").classList.add('hide');
    this.root.querySelector(".border").classList.add('hide');
   }
}

}