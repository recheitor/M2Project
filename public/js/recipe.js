const button = document.querySelector('.addButton')
const ingredientsRow = document.querySelector('.ingredientsRow')
const ingredientsFields = document.querySelector('.ingredients')

button.addEventListener('click', () => {
    ingredientsFields.prepend(ingredientsRow.cloneNode(true))
    document.querySelector('#ingrName').value = ''
    document.querySelector('#ingrQuantity').value = ''
});


