/*
	ADA HELPER FUNCTIONS
*/

window.addEventListener('load', function() {
    ada();
})

function ada() {

	// Add 'keyboard-user' class to body when user hits tab key to activate focus ring for ADA-Compliance. 
	document.addEventListener('keydown', function(e) {
	    if (e.keyCode === 9) {
			document.body.classList.add('keyboard-user');
		}
	});
}