const translations = {
    fr: {
        title: "LsWebORM",
        subtitle: "Une bibliothèque JavaScript légère pour la gestion des bases de données locales avec le stockage local.",
        "nav-installation": "Installation",
        "nav-utilisation": "Utilisation",
        "nav-api": "API",
        "nav-contributions": "Contributions",
        "nav-licence": "Licence",
        "install-title": "Installation",
        "install-text": "Pour installer LsWebORM via npm :",
        "install-script": "Ou inclure directement via un script :",
        "usage-title": "Utilisation",
        "schema-title": "Configuration du schéma",
        "init-title": "Initialisation de la base de données",
        "insert-title": "Insertion de données",
        "select-title": "Sélection de données",
        "update-title": "Mise à jour de données",
        "delete-title": "Suppression de données",
        "api-title": "API",
        "api-description": "LsWebORM fournit plusieurs méthodes pour gérer la base de données :",
        "api-instance": "<code>getInstance(name, storage, schema)</code> : Retourne une instance unique de LsWebORM.",
        "api-addtable": "<code>addTable(tableSchema)</code> : Ajoute une nouvelle table.",
        "api-insert": "<code>insert(tableName, record)</code> : Insère un enregistrement.",
        "api-select": "<code>select(tableName, query, populate)</code> : Sélectionne des enregistrements.",
        "api-update": "<code>update(tableName, query, updates)</code> : Met à jour les enregistrements.",
        "api-delete": "<code>delete(tableName, query)</code> : Supprime des enregistrements.",
        "contrib-title": "Contributions",
        "contrib-text": "Les contributions sont les bienvenues! Suivez ces étapes :",
        "contrib-step1": "Forkez le dépôt.",
        "contrib-step2": "Créez une branche pour vos modifications.",
        "contrib-step3": "Soumettez une pull request.",
        "license-title": "Licence",
        "license-text": "Ce projet est sous licence MIT. Voir le fichier"
    },
    en: {
        title: "LsWebORM",
        subtitle: "A lightweight JavaScript library for local database management with local storage.",
        "nav-installation": "Installation",
        "nav-utilisation": "Usage",
        "nav-api": "API",
        "nav-contributions": "Contributions",
        "nav-licence": "License",
        "install-title": "Installation",
        "install-text": "To install LsWebORM via npm:",
        "install-script": "Or include directly via a script:",
        "usage-title": "Usage",
        "schema-title": "Schema Configuration",
        "init-title": "Database Initialization",
        "insert-title": "Data Insertion",
        "select-title": "Data Selection",
        "update-title": "Data Update",
        "delete-title": "Data Deletion",
        "api-title": "API",
        "api-description": "LsWebORM provides several methods to manage the database:",
        "api-instance": "<code>getInstance(name, storage, schema)</code>: Returns a unique instance of LsWebORM.",
        "api-addtable": "<code>addTable(tableSchema)</code>: Adds a new table.",
        "api-insert": "<code>insert(tableName, record)</code>: Inserts a record.",
        "api-select": "<code>select(tableName, query, populate)</code>: Selects records.",
        "api-update": "<code>update(tableName, query, updates)</code>: Updates records.",
        "api-delete": "<code>delete(tableName, query)</code>: Deletes records.",
        "contrib-title": "Contributions",
        "contrib-text": "Contributions are welcome! Follow these steps:",
        "contrib-step1": "Fork the repository.",
        "contrib-step2": "Create a branch for your changes.",
        "contrib-step3": "Submit a pull request.",
        "license-title": "License",
        "license-text": "This project is licensed under the MIT license. See the file"
    },
    es: {
        title: "LsWebORM",
        subtitle: "Una biblioteca ligera de JavaScript para la gestión de bases de datos locales con almacenamiento local.",
        "nav-installation": "Instalación",
        "nav-utilisation": "Uso",
        "nav-api": "API",
        "nav-contributions": "Contribuciones",
        "nav-licence": "Licencia",
        "install-title": "Instalación",
        "install-text": "Para instalar LsWebORM a través de npm:",
        "install-script": "O incluir directamente a través de un script:",
        "usage-title": "Uso",
        "schema-title": "Configuración del esquema",
        "init-title": "Inicialización de la base de datos",
        "insert-title": "Inserción de datos",
        "select-title": "Selección de datos",
        "update-title": "Actualización de datos",
        "delete-title": "Eliminación de datos",
        "api-title": "API",
        "api-description": "LsWebORM proporciona varios métodos para gestionar la base de datos:",
        "api-instance": "<code>getInstance(name, storage, schema)</code>: Devuelve una instancia única de LsWebORM.",
        "api-addtable": "<code>addTable(tableSchema)</code>: Añade una nueva tabla.",
        "api-insert": "<code>insert(tableName, record)</code>: Inserta un registro.",
        "api-select": "<code>select(tableName, query, populate)</code>: Selecciona registros.",
        "api-update": "<code>update(tableName, query, updates)</code>: Actualiza registros.",
        "api-delete": "<code>delete(tableName, query)</code>: Elimina registros.",
        "contrib-title": "Contribuciones",
        "contrib-text": "¡Las contribuciones son bienvenidas! Siga estos pasos:",
        "contrib-step1": "Haga un fork del repositorio.",
        "contrib-step2": "Cree una rama para sus cambios.",
        "contrib-step3": "Envíe una solicitud de pull.",
        "license-title": "Licencia",
        "license-text": "Este proyecto está bajo la licencia MIT. Consulte el archivo"
    }
};

function translate(lang) {
    document.getElementById("title").textContent = translations[lang].title;
    document.getElementById("subtitle").textContent = translations[lang].subtitle;
    document.getElementById("nav-installation").textContent = translations[lang]["nav-installation"];
    document.getElementById("nav-utilisation").textContent = translations[lang]["nav-utilisation"];
    document.getElementById("nav-api").textContent = translations[lang]["nav-api"];
    document.getElementById("nav-contributions").textContent = translations[lang]["nav-contributions"];
    document.getElementById("nav-licence").textContent = translations[lang]["nav-licence"];
    document.getElementById("install-title").textContent = translations[lang]["install-title"];
    document.getElementById("install-text").textContent = translations[lang]["install-text"];
    document.getElementById("install-script").textContent = translations[lang]["install-script"];
    document.getElementById("usage-title").textContent = translations[lang]["usage-title"];
    document.getElementById("schema-title").textContent = translations[lang]["schema-title"];
    document.getElementById("init-title").textContent = translations[lang]["init-title"];
    document.getElementById("insert-title").textContent = translations[lang]["insert-title"];
    document.getElementById("select-title").textContent = translations[lang]["select-title"];
    document.getElementById("update-title").textContent = translations[lang]["update-title"];
    document.getElementById("delete-title").textContent = translations[lang]["delete-title"];
    document.getElementById("api-title").textContent = translations[lang]["api-title"];
    document.getElementById("api-description").textContent = translations[lang]["api-description"];
    document.getElementById("api-instance").innerHTML = translations[lang]["api-instance"];
    document.getElementById("api-addtable").innerHTML = translations[lang]["api-addtable"];
    document.getElementById("api-insert").innerHTML = translations[lang]["api-insert"];
    document.getElementById("api-select").innerHTML = translations[lang]["api-select"];
    document.getElementById("api-update").innerHTML = translations[lang]["api-update"];
    document.getElementById("api-delete").innerHTML = translations[lang]["api-delete"];
    document.getElementById("contrib-title").textContent = translations[lang]["contrib-title"];
    document.getElementById("contrib-text").textContent = translations[lang]["contrib-text"];
    document.getElementById("contrib-step1").textContent = translations[lang]["contrib-step1"];
    document.getElementById("contrib-step2").textContent = translations[lang]["contrib-step2"];
    document.getElementById("contrib-step3").textContent = translations[lang]["contrib-step3"];
    document.getElementById("license-title").textContent = translations[lang]["license-title"];
    document.getElementById("license-text").textContent = translations[lang]["license-text"];
}

const change_langs = document.querySelectorAll(".change-lang");
change_langs.forEach(change_lang => {

    change_lang.addEventListener("click", () => {

        const lang = change_lang.dataset.lang;
        translate(lang);
    });
});
