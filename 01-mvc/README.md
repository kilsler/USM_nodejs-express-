# Лабораторная работа №1 Morozan Nichita IA2303

## Инструкции по запуску проекта

`npm i`  
`npm run dev`

## Описание лабораторной работы
Разработать приложение "ToDo List" с возможностью:  
1. Просмотра списка задач.
2. Создания новой задачи.
3. Переключения статуса задачи (выполнена/не выполнена).
4. Удаления задачи.

## Примеры использования проекта 

<img width="1915" height="1077" alt="image" src="https://github.com/user-attachments/assets/ebbcba60-180b-44ca-9237-462673e2f755" />  
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/385e60b6-cdf5-43e3-9cf3-60e91b4228e1" />  
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/a44215f3-56f9-46fc-a85a-baf39208a7a0" />  
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/113c4f69-91aa-4dd7-8c97-d2b12e130a3e" />  



## Ответы на контрольные вопросы
1. Чем отличаются HTML-маршруты от REST API?  
   HTML-маршруты отдают готовые маршруты, REST API отдают данные в формате json.
3. Что такое res.render и `res.json`? В каких случаях что использовать?
   `res.json()`- возвращает структурированные данные.Используются в клиент-серверных архитектурах, где клиент сам отрисовывает интерфейс.
   `res.render()` - Возвращает HTML страницу.Применяются при серверной генерации страниц.  
5. Что такое middleware в Express и для чего используется `express.urlencoded`?
   middleware - это функции, которые выполняются между получением запроса и отправкой ответа.
   `express.urlencoded` - Это встроенный middleware, который разбирает тело запроса, отправленное через HTML-форму
