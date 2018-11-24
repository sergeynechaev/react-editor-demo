# React Editor Demo

Практическое решение тестовой задачи.

## Задача

Сделать простой редактор контента.

Чистая страница с двумя кнопками: добавить фото и добавить видео.

При нажатии на “добавить фото” появляется диалог выбора файла.

После выбора на рабочей области появляется серый блок, в который отобразится выбранная картинка. У блока должно быть 4 точки по углам для того чтобы ресайзить картинку (ресайз пропорциональный). Также должна быть возможность перемещать блок по экрану.

При нажатии на “добавить видео” появляется диалог вставки урла видео с youtube.

После ввода урла на рабочей области появляется серый блок, в который отобразится постер (thumbnail) указанного видео. Также как и с картинкой у блока должны быть 4 точки для ресайза (ресайз со свободными пропорциями) и возможность перемещать блок.

Количество добавляемых блоков на страницу не ограничено. Каждый новый блок добавляется под предыдущими.

Приложение необходимо реализовать на React. При желании можно использовать Redux для хранения состояния. Аплоад картинок делать не обязательно, достаточно просто сохранить данные о файле.

## Установка

```
$ npm ci
```

## Запуск локального проекта

```
$ npm start
```
или чтобы сразу открыть проект в окне браузера:

```
$ npm start:open
```

## Сборка

```
$ npm run build
```
