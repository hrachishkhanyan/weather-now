import { ReactiveVar } from 'meteor/reactive-var';
const currentUser = new ReactiveVar('');
const loggedIn = new ReactiveVar(false);

Template.Header.onRendered(() => {
  Tracker.autorun(()=> {
    //Sign in or sign up
    const authButtons = $('#authButtons');
    const toSignUpForm = $('#toSignUpForm');
    const toSignInForm = $('#toSignInForm');

    //Sign up form
    const signUpForm = $('#signUpForm');
    const toSignIn = $('#toSignIn');
    const signUpEmailInput = $('#signUpEmailInput');
    const signUpPasswordInput = $('#signUpPasswordInput');
    const rePassInput = $('#reenterPasswordInput');
    const signUpButton = $('#signUpButton');

    //Sign in form
    const signInForm = $('#signInForm');
    const toSignUp = $('#toSignUp');
    const signInButton = $('#signInButton');
    const signInEmailInput = $('#signInEmailInput');
    const signInPasswordInput = $('#signInPasswordInput');

    const currentSignedUser = $('#currentSignedUser');
    const signOutButton = $('#signOutButton');

    // if(loggedIn.get()) {
    //   console.log(currentUser.get());
    //   toggleHidden(authButtons, currentSignedUser);
    // }

    signUpButton.click(function() {
      signUp()
        .then(() => {
          if(loggedIn.get()) {
            toggleHidden(signUpForm, currentSignedUser);
          } else {
            console.log('Wrong password or email');
          }
        })
        .catch((err) => {
          console.log("err: ", err);
        })
    })

    signInButton.click(function() {
      signIn()
        .then(() => {
          console.log(currentUser.get());
          if(loggedIn.get()){
          toggleHidden(signInForm, currentSignedUser);
          }
        })
        .catch((err) => {
          console.log("err: ", err);
        })
      })

    signOutButton.click(function() {
      signOut();
      toggleHidden(currentSignedUser, authButtons);
    })

    toSignUpForm.click(function() {
      toggleHidden(authButtons, signUpForm);
    });

    toSignInForm.click(function() {
      toggleHidden(authButtons, signInForm);
    });

    toSignIn.click(function() {
      toggleHidden(signUpForm, signInForm);
    });

    toSignUp.click(function() {
      toggleHidden(signInForm, signUpForm);
    });

    async function signUp() {
      const email = signUpEmailInput.val();
      const password = signUpPasswordInput.val();
      const confirmPassword = rePassInput.val();

      if(password !== confirmPassword) {
        console.log('Passwords don\'t match');
      } else {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((user) => {
            loggedIn.set(true);
            currentUser.set(user.email);
          })
          .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('Error message: ', error.message);
          });
      }
    }

    async function signIn() {
      const email = signInEmailInput.val();
      const password = signInPasswordInput.val();

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
                
                loggedIn.set(true);
                currentUser.set(user.email);
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('Sign-in error: ', errorMessage);
          });
    }

    function signOut() {
        firebase.auth().signOut()
          .then(function() {console.log('Signed out');})
          .catch(function(err) {console.log('Sign out err: ', err);});
      }

    function toggleHidden(elAddClass, elRemoveClass) {
        elAddClass.addClass('hidden');
        elRemoveClass.removeClass('hidden');
      }
  })
})

Template.Header.helpers({
  currentUser: () => {
    return currentUser.get();
  }
})
