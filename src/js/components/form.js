/*
	Form Validation
*/

window.addEventListener('load', function() {
    formValidation();
})

function formValidation() {
	const body = document.body;
	const submitbtn = document.getElementById('submit');
	let inputValidationMatrix = [];
	let validInput = false;
	if (body.classList.contains('contact-us')) {
		const FormHandler = (function() {
			// FORM HANDLING
			const form = document.getElementById('contact-us-form');
			let validForm = null;
			

			const getFormData = () => {
				return new FormData(form);
			}

			const collectRequiredInputData = function(event) {

				let inputs = form.getElementsByTagName("input"), 
					selects = form.getElementsByTagName("select");
			

				// function to create an array of all input/select/etc fields in the form that are required
				function buildRequiredInputsArray(...args) {
					let requiredInputs = [];

					for(let i = 0, len = args.length; i < len; i++) {
						let inputArray = args[i];
						

						for(let j = 0, len = inputArray.length; j < len; j++) {
							let input = inputArray[j];
							// test for data-required='required'
							if(input.dataset.required) {
								requiredInputs.push(input);
							}
						}
					}
					
					return requiredInputs;
				}
				// create array of all REQUIRED input/select/etc fields in the form
				return requiredInputs = buildRequiredInputsArray(inputs, selects);
			}

			//** receiving empty array for required Inputs
			const checkForInputValues = (requiredInputs) => {
				// reset inputValidationMatrix on each submission attempt
				inputValidationMatrix = [];
				// check that required fields have values
				for(var i = 0, len = requiredInputs.length; i < len; i++) {
					let input = requiredInputs[i];
					if(input.value === '') {
						markInvalid(input);
					} else {
						// check for proper field inputs
						validateInput(input);
					}
				}
			}

			// indexOf checks if any valuue in the array is false
			// if there is a false value return validForm = false
			const confirmAllInputsAreValid = (inputValidationMatrix) => {
				if(inputValidationMatrix.indexOf(false) >= 0) {
					validForm = false;
				} else {
					validForm = true;
				}
			}

			// triggered by sendform
			// takes valid or invalid form from 'confirmAllInputsAreValid'
			const formToJson = (validForm) => {
				let formValues = null;
				if (validForm) {
					// console.log('FORM IS VALID');
					formValues = {};
					const formData = getFormData();
					var xhr = new XMLHttpRequest();

					dataLayer.push({
						"event": "gtm-form",
						"eventCategory": "Form",
						"eventAction": "Click",
						"eventLabel" : "Submit"
					});

					xhr.onreadystatechange = function () {
						if (this.readyState !== 4) {
							return;
						}
						if (this.status === 200) {
							var jsonResponse = JSON.parse(this.responseText);
							if(jsonResponse.status === "success") {
								window.location.href = "/thank-you/";
							}
						}
					};	
					xhr.open('POST', "/api/send-email/", true);
					xhr.send(formData);
				} else {
					// console.log('FORM NOT VALID');
					submitbtn.style.backgroundColor = '#acacac';
				}
			};

			const validateForm = (event) => {
				let requiredInputs = collectRequiredInputData(event);
				checkForInputValues(requiredInputs);
				confirmAllInputsAreValid(inputValidationMatrix);
			};

			const sendForm = (event) => {
				event.preventDefault();
				formToJson(validForm);
			};

			const validateAndSendForm = (event) => {
				validateForm(event);
				sendForm(event);
			}

			return {
				validateAndSendForm
			};

		})();

		// activate/deactivate 'validation-fail' class
		function markInvalid(input) {
			// let elemParent = input.closest("div");
			// console.log('invalid')
			// console.log(input.localName)
			if (input.localName === "input") {
				input.classList.add("validation-fail");
			}
			input.nextSibling.nextSibling.style.display = "block";
			validInput = false;
			inputValidationMatrix.push(validInput)
		}
		function markValid(input) {
			// let elemParent = input.closest("div");
			// console.log('valid')
			if (input.localName === "input") {
				input.classList.remove("validation-fail");
			}
			input.nextSibling.nextSibling.style.display = "none";
			validInput = true;
			inputValidationMatrix.push(validInput)
		}
				
			// check for proper inputs
		function validateInput(input) {
			let inputType = input.type,
					inputValue = input.value;
			let textRegex = /\w+/;
			let emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]+\.[A-Za-z]{2,}$/;
			let phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
			let zipRegex = /^\d{5}(?:[-\s]\d{4})?$/;

			switch(inputType){ 
				// test <input type="text"> against textRegex
				case "text":
					if(textRegex.test(inputValue)){
						// console.log('text pass');
						markValid(input);
						break;
					} else {
						// console.log('text fail');
						markInvalid(input);
						break;
					}
				// test <input type="email"> against emailRegex
				case "email":
					if(emailRegex.test(inputValue)){
						// console.log('email pass');
						markValid(input);
						break;
					} else {
						// console.log('email fail');
						markInvalid(input);
						break;
					}
				// test <select> has a value selected
				case "select-one":
					if(inputValue !== ''){
						// console.log('select-one pass');
						markValid(input);
						break;
					} else {
						// console.log('select-one fail');
						markInvalid(input);
						break;
					}
				case "tel":
					if(phoneRegex.test(inputValue)) {
						markValid(input);
						break;
					} else {
						markInvalid(input);
					}
				case "number":
					if(zipRegex.test(inputValue)) {
						markValid(input);
						break;
					} else {
						markInvalid(input);
					}
				default:
					if(!inputType){
						// console.log('no input type')
						markValid(input);
						break;
					}
			}
		}

		// Live check for valid inputs after a failed submit
		const inputArray = document.querySelectorAll('input, select');
			for(i=0; i < inputArray.length; i++) {
				// Call function each time an input is triggered
				inputArray[i].addEventListener('input', (event) => {

						
						// collects inputs that receive 'validation-fail'
						const errorArray = document.getElementsByClassName('validation-fail');
						
						validateInput(event.target);
						if (errorArray.length === 0) {
							submitbtn.style.backgroundColor = '#40388A';
						}	
				})
			}



		// Handle form submissions
		const submitBtn = document.getElementById("submit");

		submitBtn.addEventListener('keypress', function (event) {
			if (event.key === 'Enter') {
				event.preventDefault()
				FormHandler.validateAndSendForm(event);
			}
		});

		submitBtn.addEventListener('click', function (event) {
			event.preventDefault()
			FormHandler.validateAndSendForm(event);
		});
	}
}
