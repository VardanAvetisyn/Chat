const emojiSelectorIcon = document.getElementById('emojiSelectorIcon');
const emojiSelector = document.getElementById('emojiSelector');
const emojiList = document.getElementById('emojiList');
let isEmojiSelectorVisible = false;

emojiSelectorIcon.addEventListener('click', () => {
    if (isEmojiSelectorVisible) {
        emojiSelector.style.display = 'none';
        isEmojiSelectorVisible = false;
    } else {
        emojiSelector.style.display = 'block';
        isEmojiSelectorVisible = true;
    }
});

fetch('https://emoji-api.com/emojis?access_key=ca3f1fcf16ec66fcdc1b84c3aeb43b9faf836d3c')
    .then(res => res.json())
    .then(data => loadEmoji(data))

function loadEmoji(data) {
    data.forEach(emoji => {
        let li = document.createElement('li');
        li.setAttribute('emoji-name', emoji.slug);
        li.textContent = emoji.character;
        emojiList.appendChild(li);
    });
};