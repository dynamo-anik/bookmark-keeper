const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

//show modal, and focus on input
function showModal() {
	modal.classList.add('show-modal');
	websiteNameEl.focus();
}

//modal event listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => {
	modal.classList.remove('show-modal');
});
window.addEventListener('click', (e) =>
	e.target === modal ? modal.classList.remove('show-modal') : false
);

//validate form
function validate(nameValue, urlValue) {
	const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
	const regex = new RegExp(expression);

	if (!nameValue || !urlValue) {
		alert('Please enter value first.');
		return false;
	}

	if (!urlValue.match(regex)) {
		alert('please proveid valid url');
		return false;
	}

	return true;
}

// add bookmarks in the dom
function buildBookmarks() {
	//remove all bookmarks
	bookmarksContainer.textContent = '';
	bookmarks.forEach((bookmark) => {
		const { name, url } = bookmark;

		//item container
		const item = document.createElement('div');
		item.classList.add('item');
		//close icon
		const closeIcon = document.createElement('div');
		closeIcon.classList.add('fas', 'fa-times-circle');
		closeIcon.setAttribute('title', 'Delete Bookmark');
		closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

		//link container
		const linkInfo = document.createElement('div');
		linkInfo.classList.add('name');

		//favicon dynamically populate
		const favicon = document.createElement('img');
		favicon.setAttribute(
			'src',
			`https://s2.googleusercontent.com/s2/favicons?domain=${url}`
		);

		//link
		const link = document.createElement('a');
		link.setAttribute('href', `${url}`);
		link.setAttribute('target', '_blank');
		link.textContent = name;

		//append all to dom
		linkInfo.append(favicon, link);
		item.append(closeIcon, linkInfo);

		bookmarksContainer.appendChild(item);
	});
}

//fetch bookmarks
function fetchBookmarks() {
	//get bookmarks from local storage if available
	if (localStorage.getItem('bookmarks')) {
		bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
	} else {
		//create bookmarks array in local storage
		bookmarks = [
			{
				name: 'Google',
				url: 'https://google.com',
			},
		];
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	}
	buildBookmarks();
}

//delete bookmar
function deleteBookmark(url) {
	bookmarks.forEach((bookmark, i) => {
		if (bookmark.url === url) {
			bookmarks.splice(i, 1);
		}
	});
	//update local storage and re render dom
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

	fetchBookmarks();
}

//handle data from form
function storeBookmark(e) {
	e.preventDefault();
	const nameValue = websiteNameEl.value;
	let urlValue = websiteUrlEl.value;

	if (!urlValue.includes('http://', 'https://')) {
		urlValue = `https://${urlValue}`;
	}

	if (!validate(nameValue, urlValue)) {
		return false;
	}

	const bookmark = {
		name: nameValue,
		url: urlValue,
	};

	bookmarks.push(bookmark);
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	bookmarkForm.reset();
	websiteNameEl.focus();
	fetchBookmarks();
}

//event listeners
bookmarkForm.addEventListener('submit', storeBookmark);

//on load fetch bookmarks
fetchBookmarks();
