# Morozan Nichita IA2303. Лабораторная работа №5 Архитектурные стили и протоколы взаимодействия Web-API.
## Цель работы
1.Освоить один из альтернативных архитектурных стилей Web-API, отличных от REST (GraphQL, WebSockets, WebHooks, SOAP и др.).  
2.Научиться выбирать архитектурный стиль под конкретную задачу и аргументировать свой выбор.  
3.Расширить функциональность существующего сервиса, интегрируя новый тип API вместе с уже реализованным REST API.  
4.Закрепить навыки проектирования и реализации backend-приложений на Node.js + Express в более «приближенном к продакшену» сценарии.  
## Условие
Имплементировать использование websocket для просмотра логов в панели администратора.
## Условия по запуску проекта
1. Скачайте проект
2. Запустите контейнер бд mysql и создайте файл ```.env``` согласно примеру
3. npm install
4. npm run dev  
   Готово
## Выполнение 
### Добавление нового модуля для вебсокета 
``` js
//app.js
const server = http.createServer(app);

initWebSocket(server);
```

```js
import { Server } from "socket.io";
import { authenticateTokenAdminSocket } from "../middlewares/authSocket.js";

let io;

export const initWebSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.use(authenticateTokenAdminSocket);

    io.on("connection", (socket) => {
        console.log("Admin connected via WS:", socket.user.email);

        socket.join("logs-room");

        socket.on("disconnect", () => {
            console.log("Admin disconnected");
        });
    });
};

export const getIo = () => io;


```

### Добавление модуля для уатентификации с вебсокетом


```js

dotenv.config();

const verifyJwtToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new AuthenticationError("Invalid or expired token.");
    }
};

export const authenticateTokenAdminSocket = (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) return next(new AuthenticationError("Access denied. No token provided"));

        const user = verifyJwtToken(token);

        if (user.role !== "admin") {
            return next(new UnauthorizedError("Admin role required"));
        }

        socket.user = user;
        next();

    } catch (err) {
        next(err);
    }
};

```
### Изменение логики логирования с добавлением оповещения вебсокетом 

```js
function emitToWebsocket(event, payload) {
    const io = getIo();
    if (io) io.to("logs-room").emit(event, payload);
}

logger.on("data", log => {
    if (log.level === "error") emitToWebsocket("new-error-log", log);
    emitToWebsocket("new-combined-log", log);
});
```

## Скриншоты выполнения

## Контрольные вопросы
Вопрос :В чём основные отличия REST от выбранного вами типа Web-API (GraphQL / WebSockets / WebHooks / SOAP)  
Ответ:  
Вопрос :В каких случаях использование вашего типа API даёт преимущество по сравнению с REST (по производительности, удобству, гибкости и т.д.)?  
Ответ: 
Вопрос :Какие ограничения или недостатки имеет выбранный вами архитектурный стиль?  
Ответ: 
Вопрос :Как вы интегрировали новый тип API с уже существующей архитектурой приложения (REST + БД + аутентификация)?  
Ответ: 
