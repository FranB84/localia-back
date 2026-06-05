import {db} from './connection';
import {users} from './schema';

const seed = async () => {
    // PROTECTION: Prevent seeding in production
    const appStage = process.env.APP_STAGE;
    
    if (appStage === 'production') {
        console.error('ERROR: Cannot run seed script in production environment!');
        console.error('Current APP_STAGE:', appStage);
        process.exit(1); // Exit with error code
    }

    // confirmation for staging/test environments
    console.log(`Running seed in ${appStage} environment...`);
    console.log('starting seed...');

    try{
        console.log('deleting existing data...');
        await db.delete(users).execute();
        console.log('inserting seed data...');
        // Insert seed data
        // Insert users (no ID needed)
const insertedUsers = await db.insert(users).values([
    { email: 'alice@example.com', username: 'alice_smith', password: 'password1', first_name: 'Alice', last_name: 'Smith' },
    { email: 'bob@example.com', username: 'bob_johnson', password: 'password2', first_name: 'Bob', last_name: 'Johnson'}
    ]).returning();
    console.log('Seed completed successfully!');
    
}catch(error){
        console.error('Error during seeding:', error);
        process.exit(1); // Exit with error code
    }
}

if(require.main === module){
    seed().then(() => {
        console.log('Seed script finished.');
        process.exit(0); // Exit with success code
    }).catch((error) => {
        console.error('Error running seed script:', error);
        process.exit(1); // Exit with error code
    });
}

export default seed;