async function createDatabase() {
    const connection = await mysql2.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Pa55w0rd@1',
    });
  
    await connection.query('CREATE DATABASE IF NOT EXISTS TestDb1;');
    await connection.end();
  }
  
  async function bootstrapDatabase() {
    try {
      // Create tables based on model definitions
      await sequelize.sync({ force: true }); // Use { force: true } to drop and recreate tables (in development)
  
      console.log('Database tables created successfully.');
    } catch (error) {
      console.error('Error creating database tables:', error);
    }
  }
  
  (async () => {
    try {
      await createDatabase(); // Create the database
      await sequelize.authenticate(); // Authenticate with the database
      await bootstrapDatabase(); // Create tables
  
      console.log('Connected to the database successfully.');
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  })();
  