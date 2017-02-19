Router.route('/register', function () {
	if (Meteor.userId() === null){
		this.render('register');
	}
	else{
		Router.go('/');
	}
});

Router.route('/login', function () {
	if (Meteor.userId() === null){
		this.render('login');
	}
	else{
		Router.go('/');
	}
});

Router.route('/changePassword', function () {
	if (Meteor.userId() === null){
		Router.go('/');
	}
	else{
		this.render('changePassword');
	}
});

Router.route('/search', function () {
  this.render('search', {
    races: function () {
      return Races.find().fetch();
    },
  });
});

Router.route('/search/:name', function () {
  this.render('searchByRace', {
    data: {
        races: Races.find().fetch(),
        dogs: Dogs.find({race: this.params.name}).fetch()
    }
});
});


Router.route('/add', function() {
	if (Meteor.userId() === null){
    	Router.go('/');
	} else {
		this.render('add');
	}
});

Router.route('/view/:_id', function () {
  this.render('view', {
    data: function () {
      return Dogs.findOne({_id: this.params._id});
    },
  });
});

Router.route('/edit/:_id', function () {
  if (Meteor.userId() === null){
  	Router.go('/');
  } else {
	  var dog = Dogs.findOne({_id: this.params._id});
	  if(Meteor.userId() === dog.createdBy){
	  		this.render('edit', {
		    data: function () {
		      return Dogs.findOne({_id: this.params._id});
		    },
	  	});
	  } else {
	  	Materialize.toast('Možete menjati samo informacije o psima koje ste dodali!', 4000);
	  	Router.go('/search');
	  }
 }
});

Router.route('/delete/:_id', function () {
  if (Meteor.userId() === null){
  	Router.go('/');
  } else {
	  var dog = Dogs.findOne({_id: this.params._id});
	  if(Meteor.userId() === dog.createdBy){
	  		var r = confirm("Da li ste sigurni da želite da obrišete sve podatke o ovom psu?");
			if (r == true) {
			    Dogs.remove({_id: this.params._id});
			    Router.go('/search');
			} else {
			    Router.go('/search');
			}
	  } else {
	  	Materialize.toast('Možete brisati samo pse koje ste dodali', 4000);
	  	Router.go('/search');
	  }
  }
});

Router.route('/myDogs', function() {
	if (Meteor.userId() === null){
  	Router.go('/');
  	} else {
	    this.render('myDogs', {
	    data: {
	        dogs: Dogs.find({createdBy: Meteor.userId()}).fetch()
	    }

		});
	}
});

Router.route('/categories', function() {
    this.render('categories', {
    data: {
        races: Races.find().fetch()
    }
});
});

Router.route('/upload/:name', function() {
	if (Meteor.userId() === null){
  	Router.go('/');
  	} else {
	    this.render('upload', {
	    data: {
	        race: Races.findOne({name: this.params.name})
	    }
		});
	}
});

Router.route('/adopt/:_id', function() {
	if (Meteor.userId() === null){
  	Router.go('/');
  	} else {
	    this.render('adopt', {
	    data: {
	        dog: Dogs.findOne({_id: this.params._id})
	    }
		});
	}
});

Router.route('/', {
    template: 'home'
});