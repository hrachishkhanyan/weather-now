import { ReactiveVar } from 'meteor/reactive-var';
const form = new ReactiveVar('');
const loggedIn = new ReactiveVar(false);
const showSideBar = new ReactiveVar(false);

Template.Header.events({
  'click #toSignUp': () => {
    form.set('signUp');
  },
  'click #toSignIn': () => {
    form.set('');
  },
  'submit #signUpForm': (e) => {
    e.preventDefault();
    signUp(..._.map($('#signUpForm').serializeArray(), (el) => el.value))
      .then((user) => {
        Session.set('currentUser', user.email);
        setCookie('current_user', user.email, 1);
        user.getIdToken().then(data => {
          setCookie('access_token=', data, 1);
        });
        showSideBar.set(false);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('Error message: ', error.message);
      })
  },
  'submit #signInForm': (e) => {
    e.preventDefault();
    signIn(..._.map($('#signInForm').serializeArray(), (el) => el.value))
      .then((user) => {
        setCookie('current_user', user.email, 1);
        Session.set('currentUser', user.email);
        showSideBar.set(false);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('Error message: ', error.message);
      })
  },
  'click #signOutButton': () => {
    signOut()
      .then(() => {
        setCookie('current_user', '', 0);
        Session.set('currentUser', '');
      })
      .catch((err) => {
        console.log('Error in signOut: ', err);
      })
  },
  'click .icon': () => {
    if(showSideBar.get()) {
      showSideBar.set(false);
    } else {
    showSideBar.set(true);
    }
  }
})

Template.Header.helpers({
  currentUser: () => {
    return Session.get('currentUser') || getCookie('current_user');
  },
  openForm: () => {
    return form.get();
  },
  showSideBar: () => {
    return showSideBar.get();
  }
})

// Template.registerHelper('or', (a, b) => {
//   return a || b;
// })

function signUp(email, password, confirmPassword) {
   if(password !== confirmPassword) {
     return Promise.reject(new Error('Passwords don\'t match'));
   } else {
     return firebase.auth().createUserWithEmailAndPassword(email, password);

   }
 }

 function signIn(email, password) {
   return firebase.auth().signInWithEmailAndPassword(email, password);
  }


 function signOut() {
   return firebase.auth().signOut();
  }

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  }

  function setCookie(cname, cvalue, exdate) {
    var date = new Date();
    date.setTime(date.getTime() + (exdate*24*60*60*1000));
    var expires = "expires=" + date.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ";path=/";
  }
