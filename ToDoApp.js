const TEXTAREA_BG_TEXT_SELECTOR = '.to-do-app__textarea__bg-text';
const TEXTAREA_CLEAR_BTN_SELECTOR = '.to-do-app__textarea__clear-btn';
const TEXTAREA_SELECTOR = '.to-do-app__textarea';
const TEXTAREA_ADD_BTN_SELECTOR = '.to-do-app__textarea__add-btn';
const TEXTAREA_TASKS_NUMBER = '.to-do-app__textarea__tasks-number';
const TEXTAREA_COMPLETED_TASK_NUMBER = '.to-do-app__textarea__completed-tasks-number';
const LIST_SELECTOR = '.to-do-app__list';
const ITEM_TEMPLATE_SELECTOR = '.to-do-app__item_temp';
const ITEM_DELETE_BTN_SELECTOR = '.to-do-app__item__delete-btn';
const ITEM_TEXT_SELECTOR = '.to-do-app__item__span';
const ITEM_COMPLETE_BTN_SELECTOR = '.to-do-app__item__complete-btn';
const ITEM_CLASS = 'to-do-app__item';
const TEXTAREA_BG_TEXT_ACTIVE_MOD = 'to-do-app__textarea__bg-text--active';
const ITEM_COMPLETE_MOD = 'to-do-app__item__span--complete';

class ToDoApp {
	constructor() {
		this.tasksArray = [];
		this.textareaValue = '';
		this.list = document.querySelector(LIST_SELECTOR);
		this.bindToElements();
	}

	bindToElements() {
		this.bindToElementsFunction(TEXTAREA_SELECTOR, 'input', e => this.textareaWriting(e));
		this.bindToElementsFunction(TEXTAREA_CLEAR_BTN_SELECTOR, 'click', () => this.textareaClear());
		this.bindToElementsFunction(TEXTAREA_ADD_BTN_SELECTOR, 'click', () => this.createTask());
	}

	bindToTaskButtons(task) {
		this.bindToElementsFunction(ITEM_DELETE_BTN_SELECTOR, 'click', e => this.taskDelete(e), task);
		this.bindToElementsFunction(ITEM_COMPLETE_BTN_SELECTOR, 'click', e => this.taskComplete(e), task);
	}

	bindToElementsFunction(id, eventType, callback, DOMelement = document) {
		const element = DOMelement.querySelector(id);
		if (!element) {
			console.warn(`Nie znaleziono elementu ${id}`);
		}
		element.addEventListener(eventType, callback);
	}

	textareaWriting(e) {
		this.textarea = e.target;
		this.textareaValue = e.target.value;
		this.textareaBgTextStatusChanger();
		this.searchTask();
	}

	textareaClear() {
		this.textareaValue = '';
		this.textarea.value = this.textareaValue;
		this.textareaBgTextStatusChanger();
		this.tasksArrayUpdate();
	}

	textareaBgTextStatusChanger() {
		const textareaBgText = document.querySelector(TEXTAREA_BG_TEXT_SELECTOR);
		if (this.textareaValue !== '' && textareaBgText.classList.contains(TEXTAREA_BG_TEXT_ACTIVE_MOD)) {
			textareaBgText.classList.remove(TEXTAREA_BG_TEXT_ACTIVE_MOD);
		} else if (this.textareaValue === '' && !textareaBgText.classList.contains(TEXTAREA_BG_TEXT_ACTIVE_MOD)) {
			textareaBgText.classList.add(TEXTAREA_BG_TEXT_ACTIVE_MOD);
		}
	}

	searchTask() {
		const searchText = this.textareaValue.toLowerCase();
		const searchTask = this.tasksArray.filter(task => task.textContent.toLowerCase().includes(searchText));
		this.list.textContent = '';
		searchTask.forEach(task => this.list.appendChild(task));
	}

	createTask() {
		if (this.textareaValue === '') return;
		const newTask = document.createElement('li');
		const taskTemplate = document.querySelector(ITEM_TEMPLATE_SELECTOR);
		const taskBody = taskTemplate.content.cloneNode(true);
		newTask.appendChild(taskBody);
		newTask.classList.add(ITEM_CLASS);
		const taskTextElement = newTask.querySelector(ITEM_TEXT_SELECTOR);
		taskTextElement.textContent = this.textareaValue;
		this.tasksArray.push(newTask);
		this.tasksArrayUpdate();
		this.list.appendChild(newTask);
		this.bindToTaskButtons(newTask);
		this.textareaClear();
	}

	tasksArrayUpdate() {
		this.list.textContent = '';
		this.tasksArray.forEach((task, key) => {
			task.dataset.taskKey = key;
			this.list.appendChild(task);
		});
		this.tasksNumberUpdate();
	}

	taskDelete(e) {
		const task = e.target.parentNode;

		task.animate([{ transform: 'scale(1)' }, { transform: 'scale(.9)' }], {
			duration: 200,
		});
		const taskKey = e.target.parentNode.dataset.taskKey;
		setTimeout(() => {
			this.tasksArray.splice(taskKey, 1);
			this.tasksArrayUpdate();
		}, 190);
	}

	taskComplete(e) {
		e.target.parentNode.querySelector(ITEM_TEXT_SELECTOR).classList.toggle(ITEM_COMPLETE_MOD);
		this.tasksNumberUpdate();
	}

	tasksNumberUpdate() {
		const textareaTasksNumber = document.querySelector(TEXTAREA_TASKS_NUMBER);
		textareaTasksNumber.textContent = this.tasksArray.length;
		const textareaCompletedTasksNumber = document.querySelector(TEXTAREA_COMPLETED_TASK_NUMBER);
		textareaCompletedTasksNumber.textContent = document.querySelectorAll(`.${ITEM_COMPLETE_MOD}`).length;
	}
}
const toDoApp = new ToDoApp();
