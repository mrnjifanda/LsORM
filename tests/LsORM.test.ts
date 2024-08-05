import { JSDOM } from "jsdom";

import { LsWebORM } from '../src/core/LsWebORM';
import { TableNotFoundError } from '../src/errors/TableNotFoundError';
import { AttributeNotFoundError } from '../src/errors/AttributeNotFoundError';
import { Schema } from "../src/types/types";


const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// global.window = dom.window;
global.document = dom.window.document;

interface CustomStorage extends Storage {
    length: number;
    key(index: number): string | null;
}

describe('LsWebORM', () => {

    let orm: LsWebORM;
    let schema: Schema;

    beforeEach(() => {

        // Configuration du schéma
        schema = {
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
        };

        // Initialisation de LsWebORM avec un localStorage simulé
        global.localStorage = {
            storage: {},
            setItem(key: string, value: string) { this.storage[key] = value; },
            getItem(key: string) { return this.storage[key] || null; },
            clear() { this.storage = {}; },
            removeItem(key: string) { delete this.storage[key]; },
            length: 0,
            key(index: number) { return Object.keys(this.storage)[index] || null; }
        } as CustomStorage;

        orm = LsWebORM.getInstance('LibraryDB', global.localStorage, schema);
    });

    afterEach(() => {
        global.localStorage.clear();
    });

    test('should initialize schema and create tables', () => {
        const tables = orm.getSchemas();
        expect(tables).toHaveProperty('books');
        expect(tables).toHaveProperty('authors');
    });

    test('should insert a book record', () => {
        const book = { title: '1984', author: 'George Orwell', year: 1949 };
        orm.insert('books', book);
        const books = orm.all('books');
        expect(books).toHaveLength(1);
        expect(books[0]).toMatchObject(book);
    });

    test('should throw error when inserting into non-existing table', () => {
        expect(() => orm.insert('nonExistingTable', {})).toThrow(TableNotFoundError);
    });

    test('should update a book record', () => {
        const book = { title: '1984', author: 'George Orwell', year: 1949 };
        orm.insert('books', book);
        orm.update('books', { title: '1984' }, { year: 1950 });
        const books = orm.all('books');
        expect(books[0].year).toBe(1950);
    });

    test('should delete a book record', () => {
        const book = { title: '1984', author: 'George Orwell', year: 1949 };
        orm.insert('books', book);
        orm.delete('books', { title: '1984' });
        const books = orm.all('books');
        expect(books).toHaveLength(0);
    });

    test('should insert multiple book records', () => {
        const books = [
            { title: '1984', author: 'George Orwell', year: 1949 },
            { title: 'Brave New World', author: 'Aldous Huxley', year: 1932 }
        ];
        orm.insertMany('books', books);
        const allBooks = orm.all('books');
        expect(allBooks).toHaveLength(2);
        expect(allBooks).toEqual(expect.arrayContaining(books));
    });

    test('should retrieve a book record by query', () => {
        const book = { title: '1984', author: 'George Orwell', year: 1949 };
        orm.insert('books', book);
        const retrieved = orm.selectOne('books', { title: '1984' });
        expect(retrieved).toMatchObject(book);
    });

    test('should throw error when accessing non-existing attribute', () => {
        expect(() => orm.insert('books', { nonExistingAttribute: 'test' })).toThrow(AttributeNotFoundError);
    });

    test('should populate relationships', () => {
        orm.insert('authors', { name: 'George Orwell', bio: 'English novelist' });
        orm.insert('books', { title: '1984', author: 'George Orwell', year: 1949 });
        const bookWithAuthor = orm.selectOne('books', { title: '1984' }, true);
        expect(bookWithAuthor).toHaveProperty('authors');
        expect(bookWithAuthor?.authors).toHaveLength(1);
        expect(bookWithAuthor?.authors[0]).toHaveProperty('name', 'George Orwell');
    });
});
