# Лабораторная работа №3. Аутентификация и авторизация

## Цель работы
- Освоить методы аутентификации и авторизации в backend-приложениях на Node.js.
- Реализовать защиту REST API с помощью JWT (JSON Web Token).
- Научиться разграничивать доступ к ресурсам в зависимости от роли пользователя.
## Условие
Модифицировать существующий сервис ToDo REST API, добавив систему пользователей и механизм JWT-аутентификации.
## Выполнение 
### Шаг 1. Структура базы данных
Добавьте новую таблицу users, а также связь с таблицей todos.
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
### Шаг 2 создаем модель для взаимодействите с пользователем.
```js 
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    queueLimit: 0,
});

export async function createUser(username, email, password) {
    const [result] = await pool.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, password]
    );
    return { id: result.insertId, username, email };
}

export async function findUserByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
}

export async function findUserById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
}

```

### Шаг 3 Создаем контроллер для взаимодействия с пользователем и роутер для этих маршрутов.
```js 
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateToken, getProfile);
export default router;

```
### Шаг 4 Создаем middleware для защиты других маршрутов и прикрепляем где неоходимо.
```js 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }
        req.user = user;
        next();
    });
}
```
## Проверка 
<img width="893" height="665" alt="image" src="https://github.com/user-attachments/assets/5c365788-b5d2-4107-aeed-1c5f4d486d15" />  
<img width="893" height="665" alt="image" src="https://github.com/user-attachments/assets/90cd033f-3744-4224-9878-9b9c800fbe8c" />  
<img width="893" height="665" alt="image" src="https://github.com/user-attachments/assets/06cbaa26-9178-476d-aeca-8f2b496ba643" />  

## Контрольные вопросы
Что такое JWT и как он работает?  
JWT - json web token состоит из 3 частей (header,payload, sinature). При отправке логина и пароль от клиента, сервер генеирует токен и подписывает его секретным ключем. Пользователь сохраняет полученный токен в localstorage/cookie и отправляет его вместе со всеми последующими запросами.  
Как реализовать безопасное хранение паролей пользователей?  
Хранить хэши паролей.  
В чём разница между аутентификацией и авторизацией?  
Аутентификация это проверка пользователя(в основном логин и пароль), авторизация это проверка прав пользователя(что он может делать на сайте).  
Какие преимущества и недостатки использования Passport.js для аутентификации в Node.js  
Плюсы:  
Имплементированы сразу множество разных подходов(jwt, sessions, google )  
Легкая интеграция в проект.  
Минимальное количество кода.  
Минусы:  
Сложная настройка.  
