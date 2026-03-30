const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const backupDatabase = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../backups');
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupFile = path.join(backupDir, `league-backup-${timestamp}.gz`);
    
    // Extract database info from connection string
    const dbUri = process.env.MONGODB_URI;
    const dbName = dbUri.split('/').pop().split('?')[0];
    
    // Create backup using mongodump
    const command = `mongodump --uri="${dbUri}" --gzip --archive="${backupFile}"`;
    
    console.log('Starting database backup...');
    console.log(`Backup file: ${backupFile}`);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Backup failed:', error);
        return;
      }
      
      console.log('✅ Database backup completed successfully!');
      console.log(`Backup saved to: ${backupFile}`);
      
      // Clean up old backups (keep last 7)
      const files = fs.readdirSync(backupDir)
        .filter(file => file.endsWith('.gz'))
        .sort()
        .reverse();
      
      if (files.length > 7) {
        const filesToDelete = files.slice(7);
        filesToDelete.forEach(file => {
          fs.unlinkSync(path.join(backupDir, file));
          console.log(`Deleted old backup: ${file}`);
        });
      }
    });
    
  } catch (error) {
    console.error('Backup script error:', error);
  }
};

// Run backup if called directly
if (require.main === module) {
  backupDatabase();
}

module.exports = backupDatabase;
