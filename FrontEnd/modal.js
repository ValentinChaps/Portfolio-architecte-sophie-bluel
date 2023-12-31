import { genererProjets } from "./projets.js"
const reponse = await fetch('http://localhost:5678/api/works')
const projets = await reponse.json()
const reponseCategories = await fetch('http://localhost:5678/api/categories')
const categories = await reponseCategories.json()
const token = localStorage.getItem("token")

async function ajouterProjet(e){
    e.preventDefault()
    const fileInput = document.getElementById('input')
    const imageFile = fileInput.files[0]
    const formData = new FormData()
    const title = document.querySelector("#titreProjet").value
    const category = document.querySelector("#categorieProjet").value
    formData.append('title', title)
    formData.append('image', imageFile)
    formData.append('category', category)
    
    if(imageFile && title.trim() !== "" && category !== ""){
        fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers :{
            Authorization: `Bearer ${token}`,
        }, 
        })
        .then(res => res.json())
        .then(data =>{
            genererProjetsAModifier([data])
            genererProjets([data])
            form.reset()
            const previewImageId = document.getElementById("previewImage")
            previewImageId.style.display ="none"
            const uploadPhotoDiv = document.querySelector(".uploadPhoto")
            const children = uploadPhotoDiv.children
            for (const child of children) {
                if (child !== uploadPhotoDiv.querySelector("#previewImage")) {
                    child.style.display = "block"
                }
            }
            const inputPhoto = document.querySelector(".inputPhoto")
            inputPhoto.style.display ="none"
            const modalAjouterPhoto = document.querySelector(".modalAjouterPhoto")
            modalAjouterPhoto.style.display = "none"
            
            const modalSupprimerPhoto = document.querySelector("#modalSupprimerPhoto")
            modalSupprimerPhoto.style.display = "block"
            
            const messageErreur = document.querySelector("#messageErreur")
            messageErreur.style.display = "none"

            const styleBoutonValider = document.querySelector(".styleBoutonValider")
            styleBoutonValider.style.backgroundColor = "gray"
        })
    }else{
        messageErreur.style.display = "inline"
    }
}

async function genererCategories(categories) {
    const choixCategories = document.querySelector("#categorieProjet")
    choixCategories.innerHTML =""
    const categorieVide = document.createElement("option")
    choixCategories.appendChild(categorieVide)
    for (let i = 0; i < categories.length; i++){
        const article = categories[i]
        const categorie = document.createElement("option")
        categorie.innerText = article.name
        categorie.value = article.id
        choixCategories.appendChild(categorie)
    }
}

async function supprimerProjet(id) {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers :{
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", 
      }, 
  })
  if (response.ok) {
        const projetElements = document.querySelector(`[data-id="${id}"]`)
        if (projetElements) {
            projetElements.remove()
        } else {
            console.log(`Le projet avec l'id "${id}" n'a pas été trouvé.`)
        }
    } else {
        console.log("La suppression du projet a échoué.")
    }

}

async function genererProjetsAModifier(projets) {
    const projetsAModifier = document.querySelector(".projetsAModifier")

    for (let i = 0; i < projets.length; i++) {
        const article = projets[i];

        const projetElements = document.createElement("div")
        const imageElements = document.createElement("img")
        imageElements.src = article.imageUrl

        const titreElements = document.createElement("figcaption")
        titreElements.innerText = 'éditer'

        const spanTrashIcon = document.createElement("span")
        spanTrashIcon.classList.add("fa-stack", "fa-sm")

        const trashCanIcon = document.createElement("i")
        trashCanIcon.classList.add("fa-solid", "fa-trash-can", "fa-stack-1x", "fa-inverse")

        const carreNoir = document.createElement("i")
        carreNoir.classList.add("fa-solid", "fa-square", "fa-stack-2x")

        projetElements.setAttribute("data-id", article.id)

        trashCanIcon.addEventListener("click", async () => {
            const projetElement = trashCanIcon.closest("[data-id]")
            const projetId = projetElement.getAttribute("data-id")
            await supprimerProjet(projetId)
            projetElement.remove()
        })
        projetsAModifier.appendChild(projetElements)
        projetElements.appendChild(imageElements)
        projetElements.appendChild(titreElements)
        projetElements.appendChild(spanTrashIcon)
        spanTrashIcon.appendChild(carreNoir)
        spanTrashIcon.appendChild(trashCanIcon) 
    }
}

genererProjetsAModifier(projets)
genererCategories(categories)

const form = document.querySelector("#form")   
form.addEventListener("submit", ajouterProjet)    

let modal = null
const focusaleSelector ="button, a, input, textarea"
let focusables =[]

const openModal = async function (e) {
    e.preventDefault()
    modal = document.querySelector( e.target.getAttribute("href"))
    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal","true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
    if (modalSupprimerPhoto.style.display = "none"){
        modalSupprimerPhoto.style.display = "block"
    }
    const ajouterPhotoButton = document.querySelector("#ajouterPhotoButton")
    const modalAjouterPhoto = document.querySelector(".modalAjouterPhoto")
    modalAjouterPhoto.style.display = "none"
    ajouterPhotoButton.addEventListener("click", () => {
        modalAjouterPhoto.style.display = "block"
        const modalSupprimerPhoto = document.querySelector("#modalSupprimerPhoto")
        modalSupprimerPhoto.style.display = "none"
    })
    const boutonArrow = document.querySelector(".fa-arrow-left")
    boutonArrow.addEventListener("click", () =>{
        modalAjouterPhoto.style.display = "none"
        modalSupprimerPhoto.style.display = "block"
    })

    const importImage = document.getElementById("input")
    importImage.addEventListener("change", function (event) {
        const file = this.files[0]
        if(file){
            if(file.size <= 4 * 1024 * 1024){
                const extensionAutorise = [".png", ".jpg", ".jpeg"]
                const fileName = file.name.toLowerCase()
                const fileExtension = fileName.substring(fileName.lastIndexOf("."))
    
                if (extensionAutorise.includes(fileExtension)){
                    const fileId = document.getElementById("previewImage")
                    fileId.style.display ="block"
                    const uploadPhotoDiv = document.querySelector(".uploadPhoto")
                    const children = uploadPhotoDiv.children
                    for (const child of children) {
                        if (child !== uploadPhotoDiv.querySelector("#previewImage")) {
                            child.style.display = "none"
                        }
                    }
                    fileId.src = window.URL.createObjectURL(this.files[0])
                    fileId.onload = () =>  {
                        URL.revokeObjectURL(fileId.src)
                     }
                } else {
                    alert("Veuillez sélectionner un fichier PNG ou JPG.")
                    this.value =""
                }
            } else {
                alert("Veuillez sélectionner un fichier de 4mo ou moins.")
                this.value = ""
            }
        }
    })

    const fileInput = document.getElementById('input')
    const titleInput = document.querySelector("#titreProjet")
    const categorySelect = document.querySelector("#categorieProjet")
    const validerButton = document.querySelector(".styleBoutonValider")
    fileInput.addEventListener('change', changerBoutonCouleur)
    titleInput.addEventListener('input', changerBoutonCouleur)
    categorySelect.addEventListener('change', changerBoutonCouleur)
    
    function changerBoutonCouleur() {
        const imageFile = fileInput.files[0]
        const title = titleInput.value
        const category = categorySelect.value
    
        if (imageFile && title.trim() !== "" && category !== "") {
            validerButton.style.backgroundColor = "#1D6154"
        } else {
            validerButton.style.backgroundColor = ""
        }
    }
}
   
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.removeAttribute("aria-modal")
    modal.setAttribute("aria-hidden", "true")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

const focusInModal = function(e){
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
    if (e.shiftKey === true){
        index--
    } else{
        index++
    }
    if (index >= focusables.length){
        index = 0
    }
    if (index < 0) {
        index = focusables.length -1
    }
    focusables[index].focus()
}

const lienModal = document.querySelector(".js-modal")
lienModal.addEventListener("click", openModal)

window.addEventListener("keydown", function(e){
    if (e.key === "Escape" || e.key === "Esc"){
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null){
        focusInModal(e)
    }
})