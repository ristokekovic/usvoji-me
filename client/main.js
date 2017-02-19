import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.nav.onCreated(function navOnCreated() {

});

Template.carousel.onRendered(function(){
  this.$('.carousel').carousel({fullWidth: true});
});

Template.search.onRendered(function(){
	this.$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    }
  );
});

Template.searchByRace.onRendered(function(){
	this.$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    }
  );
});

Template.add.onRendered(function(){
	this.$('select').material_select();
});

Template.view.onRendered(function(){
	this.$('.parallax').parallax();
	this.$('.carousel').carousel();
})

Template.edit.onRendered(function(){
	Materialize.updateTextFields();
	this.$('select').material_select();
})

Template.nav.helpers({

});

Template.search.helpers({
	dogs: function(){
		return Dogs.find({}, {sort: {createdAt: 1}});
	},
	races: function(){
		return Races.find();
	},
	places: function(){
		return Places.find();
	}
});

Template.view.helpers({
	isHomeless: function (name) {
    	return name === "lutalica"
  	},
  	isAdoptedBy: function(user) {
  		return user == Meteor.userId()
  	},
  	formatDate: function(createdAt){
  		//return moment(createdAt, "DD-MM-YYYY");
  		return moment(createdAt).format("DD/MM/YYYY");
  	},
  	photos: function(id){
      return Photos.find({dogID: id}).fetch();	
    },
});

Template.edit.helpers({
	isChecked(){
		var checked = this.urgent;
		return checked ? "checked" : false;
	},
	isMale(gender){
		return gender === 'muški';
	},
	isFemale(gender){
		return gender === 'ženski';
	}
});

Template.adopt.helpers({
	name: function(){
		return this.dog.name;
	},
	type: function(){
		var place = Places.findOne({name: this.dog.place}).name;
		var location = this.dog.location;
		var user = Meteor.users.findOne({_id: this.dog.createdBy});
		var email = user.emails[0].address;
		if(place === 'lutalica'){
			return "Ovaj pas je lutalica i može se naći u delu grada " + location + ". Obzirom da tačna lokacija ovog psa nije poznata, najbolje bi bilo da kontaktirate korisnika koji je registrovao ovog psa u našoj aplikaciji na e-mail adresu " + email + " i od njega dobijete više informacija. Molimo Vas da to uradite u narednih 7 dana, ili će pas ponovo biti dostupan na usvajanje nekom drugom. Hvala Vam na ovom plemenitom gestu!";
		} else if(place === 'nepoznato'){
			return "Tačna lokacija ovog psa trenutno nije poznata, tako da bi najbolje bilo da kontaktirate korisnika koji je registrovao ovog psa u našoj aplikaciji na e-mail adresu " + email + " i od njega dobijete više informacija. Molimo Vas da to uradite u narednih 7 dana, ili će pas ponovo biti dostupan na usvajanje nekom drugom. Hvala Vam na ovom plemenitom gestu!";
		} else {
			var city = Places.findOne({name: this.dog.place}).city;
			var address = Places.findOne({name: this.dog.place}).address;
			var phone = Places.findOne({name: this.dog.place}).phone;
			if(address != '' && phone != ''){
				return "Ovaj pas se trenutno nalazi u ustanovi " + place + " u gradu " + city + "u na adresi " + address + ". Da bi ste stupili u kontakt sa ovom ustanovom, najbolje bi bilo da ih pozovete na broj telefona " + phone + ". Molimo Vas da to uradite u narednih 7 dana, ili će pas ponovo biti dostupan na usvajanje nekom drugom. Hvala Vam na ovom plemenitom gestu!";
			} else if(address != '' && phone === ''){
				return "Ovaj pas se trenutno nalazi u ustanovi " + place + " u gradu " + city + "u na adresi " + address + ". Da bi ste stupili u kontakt sa ovom ustanovom, najbolje bi bilo da ih kontaktirate putem interneta, obzirom da nemamo njihov kontakt telefon. Molimo Vas da to uradite u narednih 7 dana, ili će pas ponovo biti dostupan na usvajanje nekom drugom. Hvala Vam na ovom plemenitom gestu!";
			} else if(address === '' && phone != ''){ 
				return "Ovaj pas se trenutno nalazi u ustanovi " + place + " u gradu " + city + "u. Da bi ste stupili u kontakt sa ovom ustanovom, najbolje bi bilo da ih pozovete na broj telefona " + phone + ". Molimo Vas da to uradite u narednih 7 dana, ili će pas ponovo biti dostupan na usvajanje nekom drugom. Hvala Vam na ovom plemenitom gestu!";
			}else if(city != '') {
				return "Ovaj pas se trenutno nalazi u ustanovi " + place + " u gradu " + city + "u. Obzirom da imamo jako malo podataka o njima, da bi ste stupili u kontakt sa ovom ustanovom, najbolje bi bilo da ih potražite i kontaktirate putem interneta. Molimo Vas da to uradite u narednih 7 dana, ili će pas ponovo biti dostupan na usvajanje nekom drugom. Hvala Vam na ovom plemenitom gestu!";
			} else {
				return "Ovaj pas se trenutno nalazi u ustanovi " + place + ". Obzirom da imamo jako malo podataka o njima, da bi ste stupili u kontakt sa ovom ustanovom, najbolje bi bilo da ih potražite i kontaktirate putem interneta. Molimo Vas da to uradite u narednih 7 dana, ili će pas ponovo biti dostupan na usvajanje nekom drugom. Hvala Vam na ovom plemenitom gestu!";
			}
		}
	}
});


Template.nav.events({
	'click #logout' (event) {
		Meteor.logout((er) => {
			if(er) {
				Materialize.toast('Došlo je do greške prilikom odjave!', 4000);
			} else {
				//Redirect
				Router.go('/');
			}
		});
	},
});

Template.login.events({
	'click .submit' (event){
		event.preventDefault();

		var email = $('#email').val();
		var password = $('#password').val();

		if(email === '' || password === ''){
			Materialize.toast('Sva polja moraju biti popunjena!', 4000);
			return;
		}

		Meteor.loginWithPassword(email, password, (er)=>{
			if(er) {
				Materialize.toast('E-mail ili šifra nisu ispravni!', 4000);
			} else {
				//Redirect
				Router.go('/');
			}
		});
	},
});

Template.register.events({
	'click .submit' (event){
		event.preventDefault();

		var username = $('#username').val();
		var email = $('#email').val();
		var password = $('#password').val();
		var confirmPasword = $('#confirmPassword').val();

		if(username === '' || email === '' || password === '' || confirmPasword === ''){
			Materialize.toast('Sva polja moraju biti popunjena!', 4000);
			return;
		}

		if(!validateEmail(email)){
			Materialize.toast('E-mail adresa nije ispravna!', 4000);
			return;
		}

		if(password != confirmPasword){
			Materialize.toast('Šifre se ne poklapaju!', 4000);
			return;
		}

		var accountInfo = {
				username: username,
				email: email,
				password: password
		};

		Accounts.createUser(accountInfo, function(er) {
			if(er) {
				Materialize.toast('Došlo je do greške prilikom registracije!', 4000);
			} else {
				console.log('Success');
				//Redirect
				Router.go('/');
			}
		});
	},
});

Template.changePassword.events({
	'click .submit' (event){
		event.preventDefault();

		var oldPassword = $('#oldPassword').val();
		var newPassword = $('#newPassword').val();
		var confirmPassword = $('#confirmPassword').val();

		if(oldPassword === '' || newPassword === '' || confirmPassword === ''){
			Materialize.toast('Sva polja moraju biti popunjena!', 4000);
			return;
		}

		if(newPassword != confirmPassword){
			Materialize.toast('Šifre se ne poklapaju!', 4000);
			return;
		}

		var user = Meteor.user();
		

		Accounts.changePassword(oldPassword, newPassword, (er) => {
				if(er) {
					Materialize.toast('Stara šifra nije ispravna!', 4000);
				} else {
					Materialize.toast('Uspešno ste izmenili šifru!', 4000);
					Router.go('/');
				}
			});

	},
});

Template.upload.events({
	'click .submit' (event) {
		event.preventDefault();
		var race = this.race;
		let files = document.getElementById('image').files;
		if(files && files[0]){
			let FR = new FileReader();
			FR.onload = (data) => {
				Races.update({_id: race._id}, {$set: {photo: data.target.result}});
			}
			FR.readAsDataURL(files[0]);
			Router.go('/categories');
		} else {
			Materialize.toast('Morate prvo da izaberete sliku!', 4000);
		}
		
	}
});


Template.add.events({
	'click .submit' (event){
		event.preventDefault();

		var name = $('#name').val();
		var race = $('#race').val();
		var age = $('#age').val();
		var place = $('#place').val();
		var location = $('#location').val();
		var description = $('#description').val();
		var urgent = $('#filled-in-box').is(':checked');
		var gender = $('#gender').find(":selected").val();

		if(name === '' || race === '' || place === ''){
			Materialize.toast('Ime, rasa i prebivalište su obavezni!', 4000);
			Materialize.toast('Ukoliko je pas lutalica, treba navesti \'lutalica\' u polju za prebivalište!', 6000);
			return;
		}

		if(gender === ''){
			Materialize.toast('Molimo Vas izaberite pol životinje!', 4000);
			return;
		}

		if(place == 'lutalica' && location === ''){
			$('.locationContainer').removeAttr('hidden');
			Materialize.toast('Molimo Vas navedite deo grada u kome se pas nalazi!', 4000);
			Materialize.toast('U slučaju da niste sigurni, navedite \'nepoznato \'', 6000);
			return;
		}

		var raceCount = Races.find({name: race}).fetch();

		if(raceCount.length === 0){
			Races.insert({name: race});
		}

		var placeCount = Places.find({name: place}).fetch();

		if(placeCount.length === 0){
			Places.insert({name: place});
		}

		var result;

		if(age === ''){
			result = Dogs.insert({name: name, gender: gender, race: race, place: place, location: location, description: description, hospitalized: false, createdAt: new Date(), createdBy: Meteor.userId(), adoptedBy: null, urgent: urgent});
		} else {
			result = Dogs.insert({name: name, gender: gender, race: race, age: age, place: place, location: location, description: description, hospitalized: false, createdAt: new Date(), createdBy: Meteor.userId(), adoptedBy: null, urgent: urgent});
		}		

		let files = document.getElementById('image').files;

		if(files && files[0]){
			let FR = new FileReader();
			FR.onload = (data) => {
				Dogs.update({_id: result}, {$set: {photo: data.target.result}});
			}
			FR.readAsDataURL(files[0]);

			for(i=1; i<files.length; i++){
				if(files[i]){
					let FR = new FileReader();
					FR.onload = (data) => {
						Photos.insert({photo: data.target.result, dogID: result});
					}
					FR.readAsDataURL(files[i]);
				}
			}
		}

		//Redirect
		Materialize.toast('Hvala Vam! Uspšno ste registrovali novog psa!', 4000);
		Router.go('/search');

	},
});

Template.edit.events({
	'click .submit' (event){
		event.preventDefault();

		var name = $('#name').val();
		var race = $('#race').val();
		var age = $('#age').val();
		var place = $('#place').val();
		var location = $('#location').val();
		var description = $('#description').val();
		var urgent = $('#filled-in-box').is(':checked');
		var gender = $('#gender').find(":selected").val();

		if(name === '' || race === '' || place === ''){
			Materialize.toast('Ime, rasa i prebivalište su obavezni!', 4000);
			Materialize.toast('Ukoliko je pas lutalica, treba navesti \'lutalica\' u polju za prebivalište!', 6000);
			return;
		}

		if(gender === ''){
			Materialize.toast('Molimo Vas izaberite pol životinje!', 4000);
			return;
		}

		if(place == 'lutalica' && location === ''){
			$('.locationContainer').removeAttr('hidden');
			Materialize.toast('Molimo Vas navedite deo grada u kome se pas nalazi!', 4000);
			Materialize.toast('U slučaju da niste sigurni, navedite \'nepoznato \'', 6000);
			return;
		}

		var raceCount = Races.find({name: race}).fetch();

		if(raceCount.length === 0){
			Races.insert({name: race});
		}

		var placeCount = Places.find({name: place}).fetch();

		if(placeCount.length === 0){
			Places.insert({name: place});
		}


		var result;

		
		Dogs.update({_id: this._id}, {name: name, gender: gender, race: race, place: place, location: location, description: description, hospitalized: false, createdAt: new Date(), createdBy: Meteor.userId(), adoptedBy: null, urgent: urgent});
			

		let files = document.getElementById('image').files;

		if(files && files[0]){
			let FR = new FileReader();
			FR.onload = (data) => {
				Dogs.update({_id: this._id}, {$set: {photo: data.target.result}});
			}
			FR.readAsDataURL(files[0]);

			for(i=1; i<files.length; i++){
				if(files[i]){
					let FR = new FileReader();
					FR.onload = (data) => {
						Photos.insert({photo: data.target.result, dogID: this._id});
					}
					FR.readAsDataURL(files[i]);
				}
			}
		}

		//Redirect
		Materialize.toast('Uspešno ste ažurirali podatke o ovom psu!', 4000);
		Router.go('/search');

	},
});

Template.view.events({
	'click #adopt' (event){
		Dogs.update({_id: this._id}, {$set: {hospitalized: true, adoptedBy: Meteor.userId()}});
		Router.go("/adopt/"+this._id);
	},
	'click #cancel' (event){
		Dogs.update({_id: this._id}, {$set: {hospitalized: false, adoptedBy: ''}});
		Router.go("/view/" + this._id);
	},
});

Template.adopt.events({
	'click #back' (event){
		Router.go("/categories");
	},
});

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}