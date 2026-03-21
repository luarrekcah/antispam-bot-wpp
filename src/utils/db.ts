import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../database.json');

// Interface para o banco de dados
export interface Database {
    activeGroups: string[];
}

// Inicializa o banco de dados se não existir
const initDB = () => {
    if (!fs.existsSync(dbPath)) {
        const defaultData: Database = { activeGroups: [] };
        fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), 'utf-8');
    }
};

// Lê os dados do banco
export const readDB = (): Database => {
    initDB();
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
};

// Salva os dados no banco
export const writeDB = (data: Database): void => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};

// Ativa o antispam para um grupo
export const activateAntispam = (groupId: string): void => {
    const db = readDB();
    if (!db.activeGroups.includes(groupId)) {
        db.activeGroups.push(groupId);
        writeDB(db);
    }
};

// Desativa o antispam para um grupo
export const deactivateAntispam = (groupId: string): void => {
    const db = readDB();
    db.activeGroups = db.activeGroups.filter(id => id !== groupId);
    writeDB(db);
};

// Verifica se o antispam está ativo para um grupo
export const isAntispamActive = (groupId: string): boolean => {
    const db = readDB();
    return db.activeGroups.includes(groupId);
};
