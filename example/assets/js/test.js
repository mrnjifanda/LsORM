const schema = {
    users: {
        table: "users",
        attributes: {
            name: { type: "string" },
        },
        relationships: [
            {
                type: "one-to-one",
                relatedTable: "profiles",
            },
            {
                type: "one-to-many",
                relatedTable: "articles",
            }
        ],
        autoIncrement: true
    },
    profiles: {
        table: "profiles",
        attributes: {
            bio: { type: "string" },
            usersId: { type: "number" },
        },
        autoIncrement: true
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

// Initialisation de LsORM
const orm = LsWebORM.getInstance("myDatabase", localStorage, schema);
console.log(orm);

// Insertion des données de test
orm.insert("users", { name: "Alice" });
orm.insert("users", { name: "Bob" });

orm.insert("profiles", { bio: "Developer", usersId: 1 }); // Relation one-to-one avec Alice
orm.insert("profiles", { bio: "Designer", usersId: 2 }); // Relation one-to-one avec Bob

orm.insert("articles", { title: "Understanding Relationships", content: "Content about relationships.", usersId: 1 }); // Relation one-to-many avec Alice
orm.insert("articles", { title: "Advanced TypeScript", content: "Content about TypeScript.", usersId: 1 }); // Relation one-to-many avec Alice

orm.insert("tags", { name: "Programming" });
orm.insert("tags", { name: "TypeScript" });

// Insertion des relations many-to-many entre articles et tags
orm.insertManyToMany("articles", { title: "New Understanding Relationships", content: "Content about relationships.", usersId: 1 }, "tags", [1]); // Article 1 avec tags "Programming" et "TypeScript"
// orm.insertManyToMany("articles", [{ _id: 2 }], "tags", [1]);    // Article 2 avec tag "Programming"

// Affichage des données avec relations
function displayData() {
    const users = orm.select("users", {}, true);
    const profiles = orm.select("profiles", {}, true);
    const articles = orm.select("articles", {}, true);
    const tags = orm.select("tags", {}, true);

    console.log("Users with Profiles and Articles (One-to-One, One-to-Many):", users);
    console.log("Profiles (One-to-One):", profiles);
    console.log("Articles with Users and Tags (Many-to-One, Many-to-Many):", articles);
    console.log("Tags (Many-to-Many):", tags);
}

displayData();
