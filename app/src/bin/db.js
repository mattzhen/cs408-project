const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const createUsersTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )`;

const createGroceriesTableSQL = `
  CREATE TABLE IF NOT EXISTS groceries (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_name TEXT NOT NULL,
    section TEXT NOT NULL,
    quantity INT NOT NULL,
    price REAL,
    brand TEXT,
    was_obtained INT DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
  )`;


function createDatabaseManager(dbPath) {
  const database = new Database(dbPath);
  console.log('Database manager created for:', dbPath);
  database.pragma('foreign_keys = ON');
  database.exec(createUsersTableSQL);
  database.exec(createGroceriesTableSQL);

  function ensureConnected() {
    if (!database.open) {
      throw new Error('Database connection is not open');
    }
  }
  return {
    dbHelpers: {

      clearDatabase: () => {
        if (process.env.NODE_ENV === 'test') {
          ensureConnected();
          database.prepare('DELETE FROM users').run();
          database.prepare('DELETE FROM groceries').run();
        } else {
          console.warn('clearDatabase called outside of test environment. FIXME!');
        }
      },

      seedTestData: () => {
        if (process.env.NODE_ENV === 'test') {
          ensureConnected();
          const insert = database.prepare('INSERT INTO groceries (user_id, item_name, section, quantity, price, brand, was_obtained) VALUES (?, ?, ?, ?, ?, ?, ?)');
          const testData = [
            { user_id: 1, item_name: "Avocado", section: "Fresh Fruit", quantity: 5, price: 0.68, brand: "Fresh Hass Avocados", was_obtained: 1},
            { user_id: 1, item_name: "Loaf of Whole Wheat Bread", section: "Bakery or Bread Aisle", quantity: 1, price: 1.97, brand: "Great Value", was_obtained: 0},
            { user_id: 2, item_name: "Bananas", section: "Produce", quantity: 6, price: null, brand: null, was_obtained: 0 },
            { user_id: 2, item_name: "Spinach", section: "Produce", quantity: 2, price: 2.50, brand: "Organic Valley", was_obtained: 1 }
          ];
          const insertMany = database.transaction((items) => {
            for (const item of items) {
              insert.run(
                item.user_id,
                item.item_name,
                item.section,
                item.quantity,
                item.price,
                item.brand,
                item.was_obtained
              );
            }
          });
          insertMany(testData);
          console.log('Seeding test data into database');
        } else {
          console.warn('seedTestData called outside of test environment. FIXME!');

        }
      },

//      getAllTodos: () => {
//        return database.prepare('SELECT * FROM todos ORDER BY id DESC').all();
//      },

      createUser: async (username, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const stmt = database.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
        const result = stmt.run(username, hashedPassword);
        return result.lastInsertRowid;
      },

      verifyUser: async (username, password) => {
        const stmt = database.prepare('SELECT * FROM users WHERE username = ?');
        const user = stmt.get(username);
        if (!user) {
          return null;
        }
        const match = await bcrypt.compare(password, user.password);
        return match ? user : null;
      },

      getGroceriesByUser: (user_id) => {
        const stmt =  database.prepare('SELECT item_name, quantity, price, was_obtained FROM groceries WHERE user_id = ? ORDER BY was_obtained, section');
        return stmt.all(user_id);
      },

      getTotalPriceByUser: (user_id) => {
        const stmt = database.prepare('SELECT SUM(price * quantity) AS total FROM groceries WHERE user_id = ?');
        return stmt.get(user_id).total;
      },

      getItemDetails: (item_id) => {
        const stmt =  database.prepare('SELECT item_name, section, quantity, price, brand, was_obtained FROM groceries WHERE item_id = ? ORDER BY was_obtained, section');
        return stmt.all(item_id);
      },

      createItem: (user_id, item_name, section, quantity, price = null, brand = null) => {
        const stmt = database.prepare('INSERT INTO groceries (user_id, item_name, section, quantity, price, brand) VALUES (?, ?, ?, ?, ?, ?)');
        const result = stmt.run(user_id, item_name, section, quantity, price, brand);
        return result.lastInsertRowid;
      },

//      updateTodo: (id, task, completed) => {
//        const info = database.prepare('UPDATE todos SET task = ?, completed = ? WHERE id = ?')
//          .run(task, completed ? 1 : 0, id);
//        return info.changes;
//      },

      deleteItem: (item_id) => {
        const info = database.prepare('DELETE FROM groceries WHERE item_id = ?').run(item_id);
        return info.changes;
      },

      deleteObtainedItems: (user_id) => {
        const info = database.prepare('DELETE FROM groceries WHERE user_id = ? AND was_obtained = 1').run(user_id);
        return info.changes;
      },

      toggleAcquired: (item_id) => {
        const info = database.prepare('UPDATE groceries SET was_obtained = NOT was_obtained WHERE item_id = ?').run(item_id);
        return info.changes;
      },

//      getTotalTodos: () => {
//        return database.prepare('SELECT COUNT(*) AS c FROM todos').get().c;
//      },

//      getCompletedTodos: () => {
//        return database.prepare('SELECT COUNT(*) AS c FROM todos WHERE completed > 0').get().c;
//      },
    }
  };
}


module.exports = {
  createDatabaseManager,
};
