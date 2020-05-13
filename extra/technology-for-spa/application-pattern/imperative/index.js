const words = document.querySelector('#words')
const term = document.querySelector('#term')
const description = document.querySelector('#description')
const addButton = document.querySelector('#add-button')

addButton.addEventListener('click', () => {
  const dt = document.createElement('dt')
  dt.style = "font-weight: bold;"
  dt.textContent = term.value

  const dd = document.createElement('dd')
  dd.textContent = description.value

  words.appendChild(dt)
  words.appendChild(dd)
})
