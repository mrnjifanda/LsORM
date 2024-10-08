# LsWebORM

LsWebORM est une bibliothèque JavaScript légère pour la gestion de bases de données locales utilisant le stockage local (localStorage) du navigateur. Elle permet de définir un schéma de base de données, d'insérer, de mettre à jour, de supprimer et de sélectionner des enregistrements, tout en supportant les relations entre les tables (comme `one-to-one`, `one-to-many`, `many-to-one` et `many-to-many`). LsWebORM est particulièrement utile pour des applications front-end légères ou des prototypes nécessitant une gestion simple des données.

## Table des matières

1. [Installation](#installation)
2. [Utilisation](#utilisation)
   - [Configuration du schéma](#configuration-du-schéma)
   - [Initialisation de la base de données](#initialisation-de-la-base-de-données)
   - [Insertion de données](#insertion-de-données)
   - [Sélection de données](#sélection-de-données)
   - [Mise à jour de données](#mise-à-jour-de-données)
   - [Suppression de données](#suppression-de-données)
   - [Gestion des relations](#gestion-des-relations)
3. [API](#api)
   - [Méthodes principales](#méthodes-principales)
   - [Types](#types)
4. [Contributions](#contributions)
5. [CHANGELOG](#changelog)
6. [Licence](#licence)

## Installation

```bash
npm install LsWebORM
```

Vous pouvez aussi utilisé un des CDN directement sur votre page:

```javascript
  // jsdelivr
  <script src="https://cdn.jsdelivr.net/npm/ls-weborm/dist/LsWebORM.js"></script>

  // OR

  // UNPKG
  <script src="https://unpkg.com/ls-weborm/dist/LsWebORM.js"></script>
```

Vous pouvez également inclure LsWebORM directement via un script dans votre fichier HTML si vous ne souhaitez pas utiliser un gestionnaire de paquets.

```html
<script src="path/to/LsWebORM.js"></script>
```

## Utilisation

### Configuration du schéma

Pour définir une base de données, commencez par créer un schéma décrivant les tables et leurs attributs.

```typescript
const schema: Schema = {
  users: {
    table: "users",
    attributes: {
      name: { type: "string" },
      email: { type: "string" },
    },
    relationships: [
      {
        type: "one-to-many",
        relatedTable: "orders",
        foreignKey: "userId",
      },
    ],
    autoIncrement: true,
  },
  orders: {
    table: "orders",
    attributes: {
      product: { type: "string" },
      quantity: { type: "number" },
      userId: { type: "number" },
    },
    relationships: [
      {
        type: "many-to-one",
        relatedTable: "users",
        foreignKey: "_id",
      },
    ],
    autoIncrement: true,
  },
  articles: {
    table: "articles",
    attributes: {
      title: { type: "string" },
      content: { type: "string" },
      usersId: { type: "number" }
    },
    relationships: [
      {
        type: "many-to-one",
        relatedTable: "users"
      },
      {
        type: "many-to-many",
        relatedTable: "tags"
      }
    ],
    autoIncrement: true
  },
  tags: {
    table: "tags",
    attributes: {
      name: { type: "string" },
    },
    autoIncrement: true
  }
};
```

**Note :** Les types sont facultatifs à la creation du schema. Si vous ajoutez des types, lors d l'insertion vous devriez respecter les même types.

### Initialisation de la base de données

Pour initialiser la base de données avec le schéma défini, utilisez la méthode `getInstance`.

```typescript
const db = LsWebORM.getInstance("myDatabase", localStorage, schema);
```

### Insertion de données

Vous pouvez insérer un ou plusieurs enregistrements dans une table.

```typescript
// Insertion d'un seul enregistrement
db.insert("users", { name: "John Doe", email: "john@example.com" });

// Insertion de plusieurs enregistrements
db.insertMany("orders", [
  { product: "Laptop", quantity: 1, userId: 1 },
  { product: "Mouse", quantity: 2, userId: 1 },
]);
```

Pour les tables avec les relations **many-to-many**, il faut utiliser la methode **insertManyToMany** :

```typescript
db.insertManyToMany("articles", { title: "Understanding Relationships", content: "Content about relationships.", usersId: 1 }, "tags", [1, 2]); // Article 1 avec les tags qui ont pour id 1 et 2
```

Si vous voulez rejouter un nouveau tag à un article qui existe déjà, vous pouvez suivre cette exemple:

```typescript
db.addManyToManyRelation("articles", 1, "tags", [3, 5]); // 1 represente l'id de l'article et [3, 5] les id des tags a rajoutés.
```

### Sélection de données

Vous pouvez sélectionner des enregistrements à partir d'une table, avec la possibilité de récupérer les relations associées.

```typescript
// Sélection de tous les utilisateurs
const users = db.all("users");

// Sélection de tous les utilisateurs
const users = db.select("users");

// Sélection d'un utilisateur avec ses commandes associées
const userWithOrders = db.selectOne("users", { _id: 1 }, true);
```

### Mise à jour de données

Vous pouvez mettre à jour des enregistrements existants.

```typescript
db.update("users", { _id: 1 }, { email: "newemail@example.com" });
```

### Suppression de données

Vous pouvez supprimer des enregistrements en fonction d'un critère.

```typescript
// Ajout d'une table
db.addTable({
  table: new_table;
  attributes: {
    name: { type: 'string' },
    bio: { type: 'string' }
  };
  autoIncrement: true;
});

// Ajout de plusieurs tables
db.addTables({
    books: {
        table: 'books',
        attributes: {
            title: { type: 'string' },
            author: { type: 'string' },
            year: { type: 'number' }
        },
        autoIncrement: true
    },
    authors: {
        table: 'authors',
        attributes: {
            name: { type: 'string' },
            bio: { type: 'string' }
        }
    }
})
```

### Ajout des tables

Vous pouvez ajouter une ou plusieurs tables dans votre base de données.

```typescript
db.delete("users", { _id: 1 });
```

### Gestion des relations

LsWebORM permet de gérer les relations entre les tables et de peupler les enregistrements associés.

- **one-to-one** : Un enregistrement dans une table correspond à un seul enregistrement dans une autre table.
- **one-to-many** : Un enregistrement dans une table correspond à plusieurs enregistrements dans une autre table.
- **many-to-one** : Plusieurs enregistrements dans une table correspond à un seul enregistrement dans une autre table.
- **many-to-many** : Plusieurs enregistrements dans une autre table correspond à plusieurs enregistrements dans une autre table.

## API

## Méthodes principales

- `getInstance(name: string, storage: Storage, schema: Schema): LsWebORM` : Retourne une instance unique de LsWebORM pour la base de données spécifiée.
- `addTable(tableSchema: TableSchema): void` : Insère une nouvelle table dans la base de donnée.
- `addTables(newTables: Schema): void` : Insère plusieurs nouvelles tables dans la base de donnée.
- `insert(tableName: string, record: Record): void` : Insère un enregistrement dans la table.
- `insertMany(tableName: string, records: Record[]): void` : Insère plusieurs enregistrements dans la table.
- `insertManyToMany(tableName: string, record: Record, relatedTableName: string, relatedIds: number[]): void` : Insère un enregistrement avec une relation **many-to-many**
- `addManyToManyRelation(tableName: string, recordId: number, relatedTableName: string, relatedIds: number[]): void` : Insère de nouveau(x) à une relation **many-to-many**
- `all(tableName: string): Record[]` : Sélectionne tous les enregistrements d'une table.
- `select(tableName: string, query: Record, populate?: boolean): Record[]` : Sélectionne plusieurs enregistrements en fonction du critère.
- `selectOne(tableName: string, query: Record, populate?: boolean): Record | null` : Sélectionne un seul enregistrement.
- `update(tableName: string, query: Record, updates: Record): void` : Met à jour les enregistrements en fonction du critère.
- `delete(tableName: string, query: Record): void` : Supprime les enregistrements en fonction du critère.

## Types

- `AttributeType` : `'string' | 'number' | 'boolean' | 'object' | 'array'`
- `RelationshipType` : `'one-to-one' | 'one-to-many'`
- `AttributeSchema` : Décrit le type d'un attribut.
- `Relationship` : Décrit une relation entre deux tables.
- `TableSchema` : Décrit la structure d'une table.
- `Schema` : Un ensemble de TableSchema.
- `Record` : Un enregistrement dans une table.
- `Database` : Ensemble de toutes les tables et leurs enregistrements.
- `Settings` : Métadonnées de la base de données, incluant les IDs et la date de création.
- `StorageData` : Structure complète de la base de données, incluant les données et les paramètres.

## Contributions

Les contributions sont les bienvenues! Si vous souhaitez contribuer, veuillez suivre les étapes suivantes:

1. [Forkez le dépôt](https://github.com/mrnjifanda/LsORM/).
2. Créez une branche pour vos modifications.
3. Soumettez une pull request pour examen.

### A faire

- Prise en charge des tableaux et ojects
- Ajouter la modification des tables
- Recherche dans les tableaux
- Rajouter le support des objects

### CHANGELOG

[Voire toutes les modifications et les mises à jours ici](https://github.com/mrnjifanda/LsORM/blob/main/CHANGELOG.md)

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](https://github.com/mrnjifanda/LsORM/blob/main/LICENSE.txt) pour plus de détails.

##

**Remarque**: LsWebORM est conçu pour un usage léger et pour des données temporaires. Il n'est pas recommandé pour des applications nécessitant une gestion complexe des transactions ou des données sensibles. Pour des besoins plus robustes, considérez l'utilisation de bases de données traditionnelles ou d'autres solutions de gestion des données côté client.
