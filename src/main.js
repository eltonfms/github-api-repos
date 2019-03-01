import '@babel/polyfill';
import api from './api';

class App{
	constructor(){
		this.repositories = [];

		this.formEl = document.getElementById('repo-form');
		this.inputEL = document.querySelector('input[name=repository]');
		this.listEl = document.getElementById('repo-list');

		this.registerHandlers();
	}

	registerHandlers(){
		this.formEl.onsubmit = event => this.addRepository(event);
	}

	setLoading(loading = true){
		if(loading === true){
			let loadingEl = document.createElement('span');
			loadingEl.appendChild(document.createTextNode('Carregando...'));
			loadingEl.setAttribute('id','loading');

			this.formEl.appendChild(loadingEl);
		}else{
			document.getElementById('loading').remove();
		}
	}

	async addRepository(event){
		event.preventDefault();

		const repoInput = this.inputEL.value;

		if(repoInput.length === 0)
			return;

		this.setLoading();

		try{
			const response = await api.get(`/repos/${repoInput}`);

			const { name, description, html_url, owner: { avatar_url } } = response.data;

			this.repositories.push({
				name,
				description,
				avatar_url,
				html_url
			});

			this.inputEL.value = '';

			this.render();
		}catch(err){
			alert('Repositório não encontrado.');
		}

		this.setLoading(false);
		
	}

	render(){
		this.listEl.innerHTML = '';
		this.repositories.forEach(repo => {
			let imgEl = document.createElement('img');
			imgEl.setAttribute('src', repo.avatar_url);

			let div1El = document.createElement('div');
			div1El.appendChild(imgEl);

			let titleEl = document.createElement('h2');
			titleEl.appendChild(document.createTextNode(repo.name));

			let descriptionEl = document.createElement('p');
			descriptionEl.appendChild(document.createTextNode(repo.description));

			let linkEl = document.createElement('a');
			linkEl.setAttribute('target', '_blank');
			linkEl.setAttribute('href', repo.html_url);
			linkEl.appendChild(document.createTextNode('Acessar'));

			let div2El = document.createElement('div');
			div2El.appendChild(titleEl);
			div2El.appendChild(descriptionEl);
			div2El.appendChild(linkEl);

			let listItemEl = document.createElement('li');
			listItemEl.appendChild(div1El);
			listItemEl.appendChild(div2El);
			
			this.listEl.appendChild(listItemEl);
		});
	}
}

new App();