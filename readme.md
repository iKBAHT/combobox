# Combobox angularjs element

##Как использовать
Вставить в html
```html
<combobox source="list" model="model" on-item-selected="onSelect" disable="isDisable" options="options"></combobox> 
```
##Настройки
*  `source` - источник данных: 

1.  массив с данными в формате `{id: ..., value: ...}`
2.  promise объект который вернет массив с данными в том же формате


* `model` - текущий выбранный элемент. В эту модель будут сохранятся значения при изменении выбора.
* `on-item-selected` - это функция, которая будет вызвана при выборе значения
* `disable` - bool значение, нужно ли заблокировать возможность выбора (не обязательный параметр)
* `options` - объект с дополнительными настройками (не обязательный параметр). Имеются следующие настройки (указанные значения являются дефолтными):

```js
{
  lazyLoad: false,              //true - то загрузить данные когда придет время отобразить попап, иначе загрузит сразу
  emptyText: 'Нет',             //показывается когда не задан текущий выбранный элемент
  noResultText: 'Не найдено',   //показывается когда поиск не дал результата
  listEmptyText: 'Список пуст', //показывается когда нет списка вариантов
  loadProcessText: 'Загрузка',  //текст для отображения во время загрузки
  defaultSearchText: 'Поиск',   //текст для плейсхолдера поиска
  needSearch: true,             //показывать ли окно поиска. если false, то не показывать никогда, если true, то в зависимости от countToShowSearch
  countToShowSearch: 4,         //после какого количества элементов надо показывать поиск
  itemsToShow: 6                //сколько элементов влезает до появления скролла
}
```
##Как запустить
Выполнить в консоли:
* bower install
* npm i
* grunt

##todo
* подсвечивать участки совпадений при поиске
* покрыть unit тестами ComboboxList
* добавить debounce для задержки поиска