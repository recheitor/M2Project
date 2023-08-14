
const button = document.querySelector('.addButton')
const addIngrName = document.querySelector('.ingredientFieldName')
const addIngrQuantity = document.querySelector('.ingredientFieldQuantity')
const addIngrMeasureUnit = document.querySelector('.ingredientFieldMeasureUnit')


button.addEventListener('click', () => {
    const ingrFieldName = document.createElement('input')
    ingrFieldName.type = 'text'
    ingrFieldName.className = 'mb-2'
    ingrFieldName.name = 'ingrName'
    ingrFieldName.id = 'ingrName'
    ingrFieldName.placeholder = 'Name'

    const ingrFieldQuantity = document.createElement('input')
    ingrFieldQuantity.type = 'text'
    ingrFieldQuantity.className = 'mb-2'
    ingrFieldQuantity.name = 'ingrQuantity'
    ingrFieldQuantity.id = 'ingrQuantity'
    ingrFieldQuantity.placeholder = 'Quantity'

    const ingrFieldMeasureUnit = document.createElement('input')
    ingrFieldMeasureUnit.type = 'text'
    ingrFieldMeasureUnit.className = 'mb-2'
    ingrFieldMeasureUnit.name = 'ingrMeasureUnit'
    ingrFieldMeasureUnit.id = 'ingrMeasureUnit'
    ingrFieldMeasureUnit.placeholder = 'Unit'

    addIngrName.appendChild(ingrFieldName)
    addIngrQuantity.appendChild(ingrFieldQuantity)
    addIngrMeasureUnit.appendChild(ingrFieldMeasureUnit)
});


