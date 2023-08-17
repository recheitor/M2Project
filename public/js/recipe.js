// const button = document.querySelector('.addButton')
// const ingredientsRow = document.querySelector('.ingredientsRow')
// const ingredientsFields = document.querySelector('.ingredients')

// button.addEventListener('click', () => {
//     ingredientsFields.prepend(ingredientsRow.cloneNode(true))
//     document.querySelector('#ingrName').value = ''
//     document.querySelector('#ingrQuantity').value = ''
// });



const button = document.querySelector('.addButton')
const ingredientsCol = document.querySelector('.ingredientsCol')
const ingredientsRow = document.querySelector('.ingredientsRow')

const quantityRow = document.querySelector('.quantityRow')
const quantityCol = document.querySelector('.quantityCol')

const measureUnitRow = document.querySelector('.measureUnitRow')
const measureUnitCol = document.querySelector('.measureUnitCol')



// const ingredientsFields = document.querySelector('.ingredients')

button.addEventListener('click', () => {
    ingredientsRow.prepend(ingredientsCol.cloneNode(true))
    quantityRow.prepend(quantityCol.cloneNode(true))
    measureUnitRow.prepend(measureUnitCol.cloneNode(true))
    document.querySelector('#ingrName').value = ''
    document.querySelector('#ingrQuantity').value = ''
});


