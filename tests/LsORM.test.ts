import { LsWebORM } from '../src/core/LsWebORM';
import { Schema, Record, TableSchema } from '../src/types/types';
import { AttributeNotFoundError } from '../src/errors/AttributeNotFoundError';
import { TableNotFoundError } from '../src/errors/TableNotFoundError';
import { AttributeBadType } from '../src/errors/AttributeBadType';
import { now } from '../src/utils/Utils';

describe('LsWebORM', () => {

    let orm: LsWebORM;
    const schema: Schema = {
        users: {
            table: 'users',
            attributes: {
                _id: { type: 'number' },
                name: { type: 'string' },
                age: { type: 'number' },
            },
            relationships: [],
            autoIncrement: true,
        },
        posts: {
            table: 'posts',
            attributes: {
                _id: { type: 'number' },
                title: { type: 'string' },
                userId: { type: 'number' },
            },
            relationships: [
                { type: 'many-to-one', relatedTable: 'users', foreignKey: 'userId' }
            ],
            autoIncrement: true,
        },
    };

    const storageMock = {} as Storage; // You can mock Storage further if needed.

    beforeEach(() => {

        orm = LsWebORM.getInstance('testDB', storageMock, schema);
    });

    describe('getInstance', () => {

        it('should return a singleton instance', () => {

            const instance1 = LsWebORM.getInstance('testDB', storageMock, schema);
            const instance2 = LsWebORM.getInstance('testDB', storageMock, schema);

            expect(instance1).toBe(instance2);
        });
    });

    describe('insert', () => {

        it('should insert a record into a table', () => {

            const user: Record = { name: 'Alice', age: 30 };
            orm.insert('users', user);

            const users = orm.all('users');
            expect(users).toHaveLength(1);
            expect(users[0].name).toBe('Alice');
        });

        it('should auto-increment the ID if specified in the schema', () => {

            const user: Record = { name: 'Bob', age: 25 };
            orm.insert('users', user);

            const users = orm.all('users');
            expect(users[0]._id).toBeDefined();
        });

        it('should throw AttributeNotFoundError if the attribute is not in the schema', () => {

            const user: Record = { name: 'Charlie', invalidAttribute: 'error' };

            expect(() => orm.insert('users', user)).toThrow(AttributeNotFoundError);
        });

        it('should throw AttributeBadType if the attribute type does not match', () => {

            const user: Record = { name: 'Eve', age: 'not a number' };

            expect(() => orm.insert('users', user)).toThrow(AttributeBadType);
        });
    });

    describe('select', () => {

        beforeEach(() => {

            orm.insert('users', { name: 'Alice', age: 30 });
            orm.insert('users', { name: 'Bob', age: 25 });
        });

        it('should return all records when no query is provided', () => {

            const users = orm.select('users');
            expect(users).toHaveLength(2);
        });

        it('should return records that match the query', () => {

            const users = orm.select('users', { name: 'Alice' });
            expect(users).toHaveLength(1);
            expect(users[0].name).toBe('Alice');
        });

        it('should throw TableNotFoundError if the table does not exist', () => {

            expect(() => orm.select('nonexistentTable')).toThrow(TableNotFoundError);
        });
    });

    describe('update', () => {
        beforeEach(() => {
            orm.insert('users', { name: 'Alice', age: 30 });
        });

        it('should update matching records with the provided updates', () => {
            orm.update('users', { name: 'Alice' }, { age: 31 });

            const updatedUser = orm.select('users', { name: 'Alice' })[0];
            expect(updatedUser.age).toBe(31);
        });

        it('should throw AttributeNotFoundError if the update contains invalid attributes', () => {
            expect(() => orm.update('users', { name: 'Alice' }, { invalidAttribute: 'error' }))
                .toThrow(AttributeNotFoundError);
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            orm.insert('users', { name: 'Alice', age: 30 });
            orm.insert('users', { name: 'Bob', age: 25 });
        });

        it('should delete records that match the query', () => {
            orm.delete('users', { name: 'Alice' });

            const users = orm.all('users');
            expect(users).toHaveLength(1);
            expect(users[0].name).toBe('Bob');
        });

        it('should throw TableNotFoundError if the table does not exist', () => {
            expect(() => orm.delete('nonexistentTable', { name: 'Alice' })).toThrow(TableNotFoundError);
        });
    });

    describe('many-to-many relationships', () => {
        beforeEach(() => {
            orm.insert('users', { name: 'Alice', age: 30 });
            orm.insert('users', { name: 'Bob', age: 25 });
            orm.insert('posts', { title: 'Post 1', userId: 1 });
        });

        it('should handle many-to-many relationships correctly', () => {
            orm.insertManyToMany('users', { name: 'Eve', age: 28 }, 'posts', [1]);

            const pivotRecords = orm.select('users_posts', { userId: 1 });
            expect(pivotRecords).toHaveLength(1);
            expect(pivotRecords[0].postId).toBe(1);
        });

        it('should add many-to-many relationships correctly', () => {
            orm.addManyToManyRelation('users', 1, 'posts', [1]);

            const pivotRecords = orm.select('users_posts', { userId: 1 });
            expect(pivotRecords).toHaveLength(1);
            expect(pivotRecords[0].postId).toBe(1);
        });
    });
});
