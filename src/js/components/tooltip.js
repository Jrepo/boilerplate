window.addEventListener('load', function() {
    tooltip();
})

function tooltip() {
	let button = document.getElementById('tooltip-example');
	let tooltip = document.getElementById('tooltipDesc');
	
	button.addEventListener('mouseenter', () => {
	  tooltip.removeAttribute('hidden');
	});
	
	button.addEventListener('mouseleave', () => {
	  tooltip.setAttribute('hidden', '');
	});
	
	button.addEventListener('focus', () => {
	  tooltip.removeAttribute('hidden');
	});
	
	button.addEventListener('blur', () => {
	  tooltip.setAttribute('hidden', '');
	});	
}


